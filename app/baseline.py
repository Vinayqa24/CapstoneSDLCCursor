"""Load the SCRUM-31 baseline from a fixed directory. No request paths."""

import logging
from pathlib import Path

LOGGER = logging.getLogger("app.baseline")

EVIDENCE_FILENAME = "image-20261103-075923.png"
PNG_SIGNATURE = b"\x89PNG\r\n\x1a\n"
MAX_PNG_BYTES = 2 * 1024 * 1024
MAX_MARKDOWN_BYTES = 256 * 1024

SECTIONS = (
    {
        "key": "inventory",
        "filename": "inventory.md",
        "columns": ("Feature", "Screen", "Section", "Control", "Evidence"),
    },
    {
        "key": "journey",
        "filename": "journey.md",
        "columns": ("Step", "Evidenced", "Transition", "Required inputs"),
    },
    {
        "key": "validations",
        "filename": "validations.md",
        "columns": ("Step", "Field", "Visible placeholder", "Format", "Failure state"),
    },
    {
        "key": "gaps",
        "filename": "gaps.md",
        "columns": ("ID", "Priority", "Gap", "Rationale"),
    },
    {
        "key": "questions",
        "filename": "questions.md",
        "columns": ("ID", "Question", "Assumption", "Owner", "Due"),
    },
)


def default_baseline_dir():
    return Path(__file__).resolve().parents[1] / "docs" / "baseline"


def path_stays_inside(root, candidate):
    """True when the resolved candidate is root or a path under it."""
    root_resolved = Path(root).resolve()
    try:
        resolved = Path(candidate).resolve()
    except OSError:
        return False
    if resolved == root_resolved:
        return True
    try:
        resolved.relative_to(root_resolved)
    except ValueError:
        return False
    return True


def load_baseline(baseline_dir):
    root = Path(baseline_dir)
    evidence = _resolve(root, Path("evidence") / EVIDENCE_FILENAME)
    if evidence is None:
        _log("escape", EVIDENCE_FILENAME)
        return {"evidence_missing": True, "sections": {}}
    if not _png_ok(evidence):
        return {"evidence_missing": True, "sections": {}}
    sections = {}
    for spec in SECTIONS:
        sections[spec["key"]] = _load_table(root, spec)
    return {"evidence_missing": False, "sections": sections}


def read_evidence(baseline_dir):
    """Return PNG bytes when the evidence check passes, else None."""
    root = Path(baseline_dir)
    evidence = _resolve(root, Path("evidence") / EVIDENCE_FILENAME)
    if evidence is None:
        _log("escape", EVIDENCE_FILENAME)
        return None
    if not _png_ok(evidence):
        return None
    return evidence.read_bytes()


def _resolve(root, relative):
    root_resolved = Path(root).resolve()
    candidate = root_resolved / relative
    if not path_stays_inside(root_resolved, candidate):
        return None
    return candidate.resolve()


def _png_ok(path):
    if not path.is_file():
        _log("missing", EVIDENCE_FILENAME)
        return False
    size = path.stat().st_size
    if size < 1 or size > MAX_PNG_BYTES:
        _log("too-large" if size > MAX_PNG_BYTES else "not-png", EVIDENCE_FILENAME)
        return False
    with path.open("rb") as handle:
        signature = handle.read(len(PNG_SIGNATURE))
    if signature != PNG_SIGNATURE:
        _log("not-png", EVIDENCE_FILENAME)
        return False
    return True


def _load_table(root, spec):
    empty = {"ok": False, "headers": [], "rows": []}
    path = _resolve(root, spec["filename"])
    name = spec["filename"]
    if path is None:
        _log("escape", name)
        return empty
    if not path.is_file():
        _log("missing", name)
        return empty
    size = path.stat().st_size
    if size > MAX_MARKDOWN_BYTES:
        _log("too-large", name)
        return empty
    raw = path.read_bytes()
    try:
        text = raw.decode("utf-8-sig")
    except UnicodeDecodeError:
        _log("decode", name)
        return empty
    rows = _pipe_rows(text)
    columns = spec["columns"]
    if not rows or tuple(rows[0]) != columns:
        _log("bad-table", name)
        return empty
    data = rows[1:]
    width = len(columns)
    if not data or any(len(row) != width for row in data):
        _log("bad-table", name)
        return empty
    return {"ok": True, "headers": list(columns), "rows": data}


def _pipe_rows(text):
    rows = []
    started = False
    for line in text.splitlines():
        stripped = line.strip()
        if not stripped.startswith("|"):
            if started:
                break
            continue
        started = True
        cells = [cell.strip() for cell in stripped.strip("|").split("|")]
        if cells and all(_separator_cell(cell) for cell in cells):
            continue
        rows.append(cells)
    return rows


def _separator_cell(cell):
    if len(cell) < 3:
        return False
    if cell[0] == ":":
        cell = cell[1:]
    if cell.endswith(":"):
        cell = cell[:-1]
    return bool(cell) and set(cell) == {"-"}


def _log(code, name):
    LOGGER.warning("baseline %s %s", name, code)
