# Code Review

## Summary

Peer review of the Stage 5 Flask baseline viewer for [SCRUM-31](https://vinayqa24-1792155730342.atlassian.net/browse/SCRUM-31) against `requirements.md` and `architecture.md`. The diff is the loader, `GET /baseline`, the five markdown tables, and the tests (`git diff sdlc/stage-4-scrum-31-impl-plan...HEAD`). Stack fit is correct. No critical defect. HarborStay map and booking handlers were not changed except the header link.

Loader and route tests were re-checked in Stage 5: 19 passed, 1 skipped (OS symlink). Playwright scripts exist and have not been executed. Stage 7 should run them with Playwright, including the existing map file.

## Critical (must fix)

None.

## Warnings (should fix)

1. **Playwright has not been executed** — `tests/e2e/test_baseline_e2e.py` is authored. `tests/conftest.py` sets `collect_ignore = ["e2e"]`, so a normal `pytest` run skips it. Chromium was not installed in Stage 5, and Playwright MCP was not available. Stage 7 must install Chromium and run `tests/e2e/test_baseline_e2e.py` and `tests/e2e/test_booking_e2e.py`.
2. **A read error after the existence check can still 500** — `app/baseline.py` `_png_ok` and `_load_table` handle a missing path, a bad signature, a size cap, and `UnicodeDecodeError`. `stat()` or `open()` raising `OSError` (permission, file deleted mid-request) is not caught, so the request becomes an unhandled 500. Architecture asks the loader to turn file failure into `Not Found`.
3. **HTML escaping is not locked by a test** — `app/templates/baseline.html` prints cells with `{{ cell }}` and does not mark them safe. There is no test that a cell containing `<script>` is escaped. The behavior is the Jinja default; a one-row unit or client test would keep a later edit from marking the cell safe.
4. **Real symlink escape was skipped on this host** — `tests/test_baseline.py` `test_symlink_outside_baseline_is_missing` skipped because Windows would not create the link. `test_resolved_path_outside_is_rejected` and `test_loader_rejects_path_that_leaves_the_directory` did run. Stage 7 does not need the symlink if those two stay.

## Suggestions (consider)

1. `load_baseline` and `read_evidence` in `app/baseline.py` repeat the resolve-and-PNG-check. One helper would keep the two routes from drifting.
2. `test_baseline_regions` clicks `baseline-nav` only after the test is already on `/baseline`. Also open `/results` and follow the link so the header change is what the test proves.
3. Confirm the three property blurbs in `docs/baseline/inventory.md` against the PNG during the Stage 7 browser pass. Names and the booking fields are covered by tests; the short descriptions are not.
4. `gunicorn==23.0.0` in `requirements.txt` is still unused. It was not added in this stage. Leave it unless a later stage documents a deploy command.

## Checklist Results

| Area | Pass/Fail | Notes |
|------|-----------|-------|
| Correctness | Pass | `GET /baseline` renders the five regions from the contract tables when the PNG check passes, and omits them when it fails. Journey steps that are not in the screenshot are `Not Found`. HarborStay routes still return 200 and `results-map`. |
| Security | Pass | No secrets in the new Python, templates, markdown, or tests. Request paths are not joined onto `BASELINE_DIR`. Evidence is a fixed filename. Cells are autoescaped. `api-conf.properties` is not read by the app. |
| Error Handling | Pass | Missing PNG, non-PNG, oversize markdown, bad header, short row, and zero data rows return a page or `Not Found` instead of invented rows. `OSError` during read is the remaining gap (warning 2). No outbound API. |
| Test Coverage | Pass | Happy path and missing-evidence client tests pass. Loader tests cover a valid table, short row, wrong header, empty table, non-PNG, oversize PNG, oversize markdown, missing PNG, and a path outside the directory. Playwright execution is Stage 7. |
| Code Clarity | Pass | `load_baseline`, `read_evidence`, and `path_stays_inside` match the architecture names. Section columns live in one tuple. |
| DRY Principle | Pass | The evidence check is duplicated in two functions (suggestion 1). Table parsing is shared. Not enough duplication to fail the review. |
| Dependency Safety | Pass | No new package. Pins are unchanged: Flask 3.0.3, pytest 8.3.3, playwright 1.64.0, pytest-playwright 0.10.0, gunicorn 23.0.0. No audit tool was run. |
| Stack fit | Pass | Python Flask app, Jinja template, local markdown, Playwright script path as in `architecture.md` and `impl-plan.md`. |

## Recommended Fixes (ordered)

1. Stage 7: install Chromium and run the baseline and map Playwright files.
2. Optional before Verify: catch `OSError` in the loader and add an escape test for a `<script>` cell. Not required to leave this review.
3. During the browser pass, compare the three property blurbs to the screenshot.

## Ready for Verify Stage?

Yes. There is no critical defect. Stage 7 still has to execute the Playwright scripts; authoring them was Stage 5 (T10). T11 stays blocked until that run.
