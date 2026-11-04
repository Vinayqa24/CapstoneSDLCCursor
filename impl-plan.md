# Implementation Plan

## Approach Summary

Stage 5 adds the approved [SCRUM-31](https://vinayqa24-1792155730342.atlassian.net/browse/SCRUM-31) **baseline viewer** to the existing Flask app. It does not rebuild HarborStay and it does not change results, map, booking, or confirmation handlers. No new runtime dependency.

Order: **config → loader → loader unit tests → routes → template → header link → markdown from the screenshot → Flask client tests → Playwright scripts**. Playwright **runs** in Stage 7.

`create_app()` sets `BASELINE_DIR` to the parent of the `app` package plus `docs/baseline`. A test may set `app.config["BASELINE_DIR"]` on its own app instance. For a browser server, `create_app()` may copy the `BASELINE_DIR` environment variable into that config when the variable is set. The HTTP request never chooses a path.

The page reads five pipe tables and the canonical PNG only. Regions render only after the PNG check (regular file, 1 byte through 2 MiB, signature `89 50 4E 47 0D 0A 1A 0A`). A bad table, a file over 256 KiB, or a path that leaves `BASELINE_DIR` becomes `Not Found` for that region or for the whole page, as `architecture.md` states.

**`data-testid`:**

| Test id | Owner task |
|----|---|
| `baseline-inventory` | T05 |
| `baseline-journey` | T05 |
| `baseline-validations` | T05 |
| `baseline-gaps` | T05 |
| `baseline-questions` | T05 |
| `baseline-evidence-missing` | T05 |
| `baseline-nav` | T06 |

Fixed headings in the template: Inventory, Journey, Validations, Gaps, Questions. Page title: Baseline. Do not mark cell text safe.

## Task List (dependency order)

| ID | Task | Depends On | Priority | Status | Notes |
|----|------|------------|----------|--------|-------|
| T01 | Set `BASELINE_DIR` in `create_app()` to the package parent plus `docs/baseline`. Optional env override for the test server only. | — | P0 | Done | Do not use the process cwd. Do not add a dependency. Do not read `api-conf.properties`. |
| T02 | Add `app/baseline.py`: path containment, PNG check, UTF-8 with BOM stripped, pipe-table reader, column contract, 256 KiB markdown cap, reason-code logs. | T01 | P0 | Done | Files: `inventory.md`, `journey.md`, `validations.md`, `gaps.md`, `questions.md`, `evidence/image-20261103-075923.png`. Log codes: `missing`, `escape`, `not-png`, `too-large`, `decode`, `bad-table`. No cell text in logs. |
| T03 | Unit tests for the loader on a temp `BASELINE_DIR`. | T02 | P0 | Done | Cases: valid table, short row, wrong header, zero data rows, non-PNG, file over the size cap, path that leaves the directory, missing PNG. No browser. |
| T04 | `GET /baseline` and `GET /baseline/evidence` in `app/routes.py`. | T02 | P0 | Done | Page **200**. Evidence **200** `image/png` only when the PNG check passes; otherwise **404** `Not Found`. No filename parameter. HarborStay routes untouched. |
| T05 | `app/templates/baseline.html` with the five regions or the missing-evidence message. | T04 | P0 | Done | Fixed headings and test ids. Omit the five regions when evidence is missing. Title Baseline. |
| T06 | Text link in `base.html` to `/baseline` with `data-testid="baseline-nav"`. | T05 | P0 | Done | Do not edit map, catalog, or booking templates. |
| T07 | Author the five markdown tables from the screenshot and the `Not Found` rules below. | — | P0 | Done | Can proceed beside T01–T06. No extra hotels, prices, errors, or screens. |
| T08 | Flask client tests for missing evidence and the evidence route. | T05 | P0 | Done | Temp dir without the PNG: **200**, `baseline-evidence-missing`, body does not contain `Titan City House`. Bad file: evidence route **404**. |
| T09 | Flask client test for the populated page. | T05, T07 | P0 | Done | Five regions, headings, Titan City House, `Book my stay`, `P0`, and a `Not Found` journey step. |
| T10 | Author `tests/e2e/test_baseline_e2e.py` (pytest-playwright). | T05, T07 | P0 | Done | Happy path against the committed baseline. Second server with `BASELINE_DIR` pointed at a temp dir for the missing PNG. Do not delete the committed screenshot. |
| T11 | Run the baseline Playwright file and the existing map Playwright file once. | T06, T10 | P0 | Done | Stage 7: Python 8 passed; `npx playwright test` 9 passed, including the header link and the map specs. |

### T07 content rules

Transcribe only what is readable in `docs/baseline/evidence/image-20261103-075923.png`. If a placeholder cannot be read, write `Not Found`. Do not invent a format or an error string.

Columns must match `architecture.md` in order: inventory (Feature, Screen, Section, Control, Evidence); journey (Step, Evidenced, Transition, Required inputs); validations (Step, Field, Visible placeholder, Format, Failure state); gaps (ID, Priority, Gap, Rationale); questions (ID, Question, Assumption, Owner, Due).

Journey rows, in order: search, results, hotel/room selection, guest details, submit, confirmation. Guest details and submit describe the inline “Book your stay” form. Search, results, hotel/room selection, and confirmation are `Not Found` as distinct steps. The room control stays on the booking panel in the inventory and validations tables; it is not a separate selection screen.

Inventory includes the Hotel Titan mark, “Your next stay starts here” (target `Not Found`), hero copy, the visible carousel frame only, Titan City House, Titan Shoreline, Titan Alpine Lodge, the booking fields (first name, last name, email, room, guests, check-in, check-out, phone), “Book my stay”, and the no-sign-in statement.

Validations list those booking fields. Format and failure state are `Not Found`.

Gap rows: **P0** no confirmation after “Book my stay”; **P1** no distinct search, results, or hotel-details step and no card navigation; **P1** no failure states for the booking fields; **P2** carousel frames other than the one visible image. Each rationale cites user impact or booking integrity.

Questions copy Q1–Q5 from `requirements.md`. Owner is product owner. Due is before Stage 2 approval. Do not add a calendar date.

## Critical Path

T01 → T02 → T04 → T05 → T09, with T07 joined before T09. T03 can follow T02 immediately and does not block the template. T10 follows T05 and T07. T11 waits for Stage 7.

T07 is the content bottleneck if the loader and template finish first. It has no code dependency, so it should start in parallel with T02.

## Blocked Tasks

| ID | Blocked until | Why |
|----|---|---|
| T03 | T02 | Tests need the loader’s reason codes and rejection rules. |
| T04 | T02 | Routes call the loader. |
| T05 | T04 | The template needs the view model from the route. |
| T06 | T05 | The link should land on the finished page. |
| T08 | T05 | The missing-evidence markup must exist. |
| T09 | T05 and T07 | Happy-path HTML needs both the template and the markdown. |
| T10 | T05 and T07 | Playwright asserts the same content. |
| T11 | — | Executed in Stage 7. Python Playwright 8 passed. `npx playwright test` 9 passed. |

No task is blocked on a new screenshot or on a Jira comment. Q1–Q4 stay the approved assumptions.

## Test Strategy Preview

- **Unit:** `tests/test_baseline.py` (name may match the suite) drives `app/baseline.py` with temporary directories. Covers the design-review cases. No browser and no network.
- **Flask client:** `tests/test_routes.py` (extend the existing module or add a focused module) checks `GET /baseline` and `GET /baseline/evidence` on a `create_app()` instance whose `BASELINE_DIR` is a temp directory. Assert status codes and `data-testid` strings.
- **Playwright (Stage 7):** `tests/e2e/test_baseline_e2e.py` uses pytest-playwright. Happy path uses the committed `docs/baseline`. Missing path starts a second app with `BASELINE_DIR` set to a directory that has no PNG. Assertions: five regions and headings, Titan City House, “Book my stay”, a `P0` gap, a `Not Found` journey step, then `baseline-evidence-missing` without those hotel and form strings.
- **Regression:** rerun `tests/e2e/test_booking_e2e.py` in Stage 7 after the header link exists. Do not change those assertions in Stage 5.
- **Out of scope for tests:** Jira calls, tile pixels, booking submission, and deleting the committed PNG.

## Definition of Done (per task / overall)

**Per task**

- The task’s notes in this plan and the matching section of `architecture.md` are met.
- New or updated tests for that task pass.
- No API keys, tokens, or `api-conf.properties` contents are added.
- HarborStay map and booking behavior is not edited except the one header link in T06.

**Overall (end of Stage 5)**

- `GET /baseline` shows the five regions from the markdown when the canonical PNG is present.
- When that PNG is absent, the response is **200**, `baseline-evidence-missing` is visible, and hotel or form rows are not rendered.
- `GET /baseline/evidence` returns the PNG or **404** `Not Found` using the same check.
- Loader unit tests and Flask client tests pass.
- `tests/e2e/test_baseline_e2e.py` is in the tree. Running it is Stage 7 (T11).
- `docs/sdlc/05-implementation-response.md` and the Stage 5 PR are written by the implementation stage, not by this plan.
