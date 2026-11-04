# Verification Report

## Commands Run

```text
python -m pytest tests/test_baseline.py tests/test_baseline_routes.py tests/test_routes.py --override-ini "addopts=" -q
# 20 passed, 1 skipped in 1.12s

python -m playwright install chromium
# Chromium for Python Playwright 1.64 downloaded

python -m pytest tests/e2e/test_baseline_e2e.py tests/e2e/test_booking_e2e.py --override-ini "addopts=" -q
# 8 passed in 14.60s

npx playwright install chromium
npx playwright test
# 9 passed (8.6s)
```

Start the app locally with `python -m flask --app wsgi:app run --port 5000`, then open `http://127.0.0.1:5000/baseline`.

Playwright MCP was not registered in this session (no browser tools). The same flows were executed with the committed Playwright scripts against the Flask app.

## Playwright Scripts Added

- `tests/e2e/baseline.spec.js` — results link to `/baseline`, five regions, PNG response, and a second Flask process with `BASELINE_DIR` empty for the missing-screenshot case. Executed by `npx playwright test`.
- `tests/e2e/test_baseline_e2e.py` — Python twin. The happy path now starts at `/results` and follows `baseline-nav`. Executed by pytest.
- `tests/e2e/booking.spec.js` and `tests/e2e/test_booking_e2e.py` — existing HarborStay map suite, re-run after the header link. Both passed.
- `playwright.config.js` — unchanged. It starts Flask on port 5000 and matches `**/*.spec.js`.

## Test Results Summary

| Suite | Result |
|----|---|
| pytest loader and route tests | **20 passed, 1 skipped** |
| pytest `test_baseline_e2e.py` and `test_booking_e2e.py` | **8 passed** |
| `npx playwright test` | **9 passed** |
| Playwright MCP live session | **Unavailable** |

The skipped test is `test_symlink_outside_baseline_is_missing` (this host would not create a symlink). The outside-path and forced-escape tests passed.

UI cases that ran: `/results` → Baseline link → five regions, Titan City House / Shoreline / Alpine Lodge, Book my stay, P0, journey `Not Found`, evidence PNG 200; empty `BASELINE_DIR` → `baseline-evidence-missing` and no hotel or form text; map marker → details, marker → book, empty filter, Offshore no-coords, unknown hotel, guest error.

A Flask client test also checks that a markdown cell `<script>` is rendered as escaped text.

## Acceptance Criteria Traceability

| Criterion | Result | Evidence |
|----|---|---|
| Screenshot is the only UI evidence; inventory lists header, hero, three Titan properties, booking fields, and Book my stay | Pass | `docs/baseline/inventory.md`; `baseline.spec.js` saw the three hotels and Book my stay |
| Inventory does not add screens or controls that are absent from the PNG | Pass | `inventory.md` has one Home screen. Search, results, hotel details, and confirmation are `Not Found` in `journey.md`, not extra pages |
| `GET /baseline` shows five regions and headings matching the markdown, with the named `data-testid`s | Pass | JS and Python Playwright; Flask client `test_populated_baseline_matches_markdown` |
| Journey covers all six steps and marks steps that are not in the screenshot `Not Found` | Pass | `journey.md`; Playwright asserts `Not Found` in the journey region |
| Visible fields list placeholder, format, and failure state, using `Not Found` when the PNG shows no rule | Pass | `validations.md` — eight booking fields, format and failure state `Not Found` |
| Gaps include P0 confirmation, P1 selection, P1 validation, and P2 carousel, each with a rationale | Pass | `gaps.md`; Playwright asserts `P0` |
| Each open question has owner product owner and due before Stage 2 approval | Pass | `questions.md` Q1–Q5 |
| Missing PNG returns the missing-evidence message and does not invent hotels or form fields | Pass | `baseline.spec.js` and `test_baseline_e2e.py` with an empty directory |
| No secrets in the repo or in docs for this story | Pass | Scan of `docs/baseline/` found no tokens, passwords, or private keys. The app does not read `api-conf.properties` |
| Playwright opens `/baseline` and asserts the five regions and the missing-evidence message | Pass | Both runners, commands above |

## Output Document Quality Check

| Document | Check |
|----|---|
| `docs/baseline/inventory.md` | Columns match the contract. Home screen only. Three hotels, booking fields, Book my stay, no-sign-in statement. No prices or error strings. |
| `docs/baseline/journey.md` | Six steps in order. Guest details and submit describe the inline form. The other steps are `Not Found`. |
| `docs/baseline/validations.md` | Placeholders only. Format and failure state are `Not Found`. |
| `docs/baseline/gaps.md` | G1 P0, G2 P1, G3 P1, G4 P2, each with a user-impact or booking-integrity rationale. |
| `docs/baseline/questions.md` | Q1–Q5, owner Product owner, due Before Stage 2 approval. No calendar date invented. |
| Secrets | None in those files. |

Property-card sentences were transcribed from the screenshot and were not compared pixel by pixel in this run. The tests lock the hotel names and the booking button.

## Failures / Gaps

- Playwright MCP tools were not available, so the browser pass used the Playwright test runners instead of the MCP session.
- One symlink unit test is skipped on this Windows host.
- A read `OSError` can still surface as HTTP 500. The missing-file path that the acceptance criteria name was tested and passed.
- Jira was not updated. That stays out of scope until a later approval.

## Go / No-Go for Final PR

**Go.** Acceptance criteria for SCRUM-31 passed in unit tests and in both Playwright runners. Stage 8 may open the final PR after the human confirms this Go.
