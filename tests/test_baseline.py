import logging
from pathlib import Path

import pytest

from app.baseline import (
    EVIDENCE_FILENAME,
    MAX_MARKDOWN_BYTES,
    MAX_PNG_BYTES,
    PNG_SIGNATURE,
    load_baseline,
    path_stays_inside,
)

INVENTORY_HEADER = "| Feature | Screen | Section | Control | Evidence |"
INVENTORY_ROW = "| Brand | Home | Header | Hotel Titan | Mark |"


def _png(directory: Path, payload: bytes = PNG_SIGNATURE + b"ok") -> None:
    evidence = directory / "evidence"
    evidence.mkdir(parents=True, exist_ok=True)
    (evidence / EVIDENCE_FILENAME).write_bytes(payload)


def _table(directory: Path, name: str, header: str, row: str) -> None:
    body = f"# {name}\n\n{header}\n| --- | --- | --- | --- | --- |\n{row}\n"
    (directory / name).write_text(body, encoding="utf-8")


def _five_tables(directory: Path) -> None:
    specs = [
        ("inventory.md", INVENTORY_HEADER, INVENTORY_ROW),
        (
            "journey.md",
            "| Step | Evidenced | Transition | Required inputs |",
            "| search | Not Found | Not Found | Not Found |",
        ),
        (
            "validations.md",
            "| Step | Field | Visible placeholder | Format | Failure state |",
            "| guest details | Email | you@example.com | Not Found | Not Found |",
        ),
        (
            "gaps.md",
            "| ID | Priority | Gap | Rationale |",
            "| G1 | P0 | No confirmation | Booking integrity |",
        ),
        (
            "questions.md",
            "| ID | Question | Assumption | Owner | Due |",
            "| Q1 | Screens? | Not Found | Product owner | Before Stage 2 approval |",
        ),
    ]
    for name, header, row in specs:
        _table(directory, name, header, row)


def test_valid_table_and_bom(tmp_path, caplog):
    _png(tmp_path)
    _five_tables(tmp_path)
    inventory = tmp_path / "inventory.md"
    inventory.write_bytes(b"\xef\xbb\xbf" + inventory.read_bytes())
    with caplog.at_level(logging.WARNING, logger="app.baseline"):
        model = load_baseline(tmp_path)
    assert model["evidence_missing"] is False
    section = model["sections"]["inventory"]
    assert section["ok"] is True
    assert section["rows"][0][0] == "Brand"
    assert "bad-table" not in caplog.text


def test_short_row_drops_the_region(tmp_path, caplog):
    _png(tmp_path)
    _five_tables(tmp_path)
    (tmp_path / "inventory.md").write_text(
        f"{INVENTORY_HEADER}\n| --- | --- | --- | --- | --- |\n| Only | Three | Cells |\n",
        encoding="utf-8",
    )
    with caplog.at_level(logging.WARNING, logger="app.baseline"):
        model = load_baseline(tmp_path)
    assert model["sections"]["inventory"]["ok"] is False
    assert model["sections"]["inventory"]["rows"] == []
    assert model["sections"]["journey"]["ok"] is True
    assert "baseline inventory.md bad-table" in caplog.text


def test_wrong_header_is_not_found(tmp_path, caplog):
    _png(tmp_path)
    _five_tables(tmp_path)
    (tmp_path / "gaps.md").write_text(
        "| Priority | ID | Gap | Rationale |\n| --- | --- | --- | --- |\n| P0 | G1 | Gap | Why |\n",
        encoding="utf-8",
    )
    with caplog.at_level(logging.WARNING, logger="app.baseline"):
        model = load_baseline(tmp_path)
    assert model["sections"]["gaps"]["ok"] is False
    assert "baseline gaps.md bad-table" in caplog.text


def test_zero_data_rows(tmp_path):
    _png(tmp_path)
    _five_tables(tmp_path)
    (tmp_path / "questions.md").write_text(
        "| ID | Question | Assumption | Owner | Due |\n| --- | --- | --- | --- | --- |\n",
        encoding="utf-8",
    )
    model = load_baseline(tmp_path)
    assert model["sections"]["questions"]["ok"] is False
    assert model["sections"]["questions"]["rows"] == []


def test_non_png_does_not_unlock_regions(tmp_path, caplog):
    _png(tmp_path, b"not-a-png")
    _five_tables(tmp_path)
    with caplog.at_level(logging.WARNING, logger="app.baseline"):
        model = load_baseline(tmp_path)
    assert model["evidence_missing"] is True
    assert model["sections"] == {}
    assert "baseline image-20261103-075923.png not-png" in caplog.text


def test_markdown_over_size_cap(tmp_path, caplog):
    _png(tmp_path)
    _five_tables(tmp_path)
    huge = "x" * (MAX_MARKDOWN_BYTES + 1)
    (tmp_path / "inventory.md").write_text(huge, encoding="utf-8")
    with caplog.at_level(logging.WARNING, logger="app.baseline"):
        model = load_baseline(tmp_path)
    assert model["evidence_missing"] is False
    assert model["sections"]["inventory"]["ok"] is False
    assert "baseline inventory.md too-large" in caplog.text


def test_png_over_size_cap(tmp_path, caplog):
    _png(tmp_path, PNG_SIGNATURE + b"x" * MAX_PNG_BYTES)
    with caplog.at_level(logging.WARNING, logger="app.baseline"):
        model = load_baseline(tmp_path)
    assert model["evidence_missing"] is True
    assert "too-large" in caplog.text


def test_missing_png(tmp_path, caplog):
    tmp_path.mkdir(exist_ok=True)
    with caplog.at_level(logging.WARNING, logger="app.baseline"):
        model = load_baseline(tmp_path)
    assert model["evidence_missing"] is True
    assert "baseline image-20261103-075923.png missing" in caplog.text


def test_resolved_path_outside_is_rejected(tmp_path):
    root = tmp_path / "baseline"
    root.mkdir()
    outside = tmp_path / "other" / "notes.md"
    outside.parent.mkdir()
    outside.write_text("secret", encoding="utf-8")
    assert path_stays_inside(root, outside) is False
    assert path_stays_inside(root, root / "inventory.md") is True


def test_loader_rejects_path_that_leaves_the_directory(tmp_path, monkeypatch, caplog):
    _png(tmp_path)
    _five_tables(tmp_path)
    monkeypatch.setattr("app.baseline.path_stays_inside", lambda root, candidate: False)
    with caplog.at_level(logging.WARNING, logger="app.baseline"):
        model = load_baseline(tmp_path)
    assert model["evidence_missing"] is True
    assert model["sections"] == {}
    assert "baseline image-20261103-075923.png escape" in caplog.text
    assert "Hotel Titan" not in caplog.text


def test_symlink_outside_baseline_is_missing(tmp_path, caplog):
    _png(tmp_path)
    outside = tmp_path / "secret.png"
    outside.write_bytes(PNG_SIGNATURE + b"secret")
    link = tmp_path / "evidence" / EVIDENCE_FILENAME
    link.unlink()
    try:
        link.symlink_to(outside)
    except OSError:
        pytest.skip("symlinks are not available on this host")
    with caplog.at_level(logging.WARNING, logger="app.baseline"):
        model = load_baseline(tmp_path)
    assert model["evidence_missing"] is True
    assert "secret" not in caplog.text
    assert "escape" in caplog.text
