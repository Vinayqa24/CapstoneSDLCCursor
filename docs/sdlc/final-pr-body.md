## Summary

This pull request delivers HarborStay, the Flask hotel portal from [SCRUM-5](https://vinayqa24-1792155730342.atlassian.net/browse/SCRUM-5), and the [SCRUM-31](https://vinayqa24-1792155730342.atlassian.net/browse/SCRUM-31) baseline viewer. SCRUM-31 documents one Hotel Titan screenshot: inventory, booking journey, field notes, and P0/P1/P2 gaps at `GET /baseline`. Verify for this cycle was **Go** (20 pytest passes, 8 Python Playwright passes, 9 Node Playwright passes). HarborStay is in the diff because `main` does not yet contain that earlier cycle.

## Changes Made

- `requirements.md` — SCRUM-31 screenshot-only requirements and acceptance criteria
- `architecture.md` — Flask baseline viewer, path containment, PNG check, markdown table contract
- `design-review.md` — design findings closed in the architecture
- `impl-plan.md` — task order T01–T11; T11 marked done after Verify
- `code-review.md` — Stage 6 review, no critical defect
- `app/baseline.py` — loads the five tables and the canonical PNG from `docs/baseline`
- `app/__init__.py`, `app/routes.py` — `BASELINE_DIR` and `GET /baseline`, `GET /baseline/evidence`; HarborStay routes kept
- `app/templates/baseline.html`, `app/templates/base.html` — baseline regions and the Baseline header link
- `app/static/css/main.css` — baseline table styles
- `docs/baseline/inventory.md`, `journey.md`, `validations.md`, `gaps.md`, `questions.md` — source of truth transcribed from the screenshot
- `docs/baseline/evidence/image-20261103-075923.png` — the only UI evidence
- `app/` HarborStay templates, catalog, and Leaflet map — prior SCRUM-5 portal included because it is not on `main`
- `tests/test_baseline.py`, `tests/test_baseline_routes.py`, `tests/test_routes.py` — loader, missing evidence, escaped cell, route smoke
- `tests/e2e/baseline.spec.js`, `tests/e2e/test_baseline_e2e.py` — Playwright happy path and missing screenshot
- `tests/e2e/booking.spec.js`, `tests/e2e/test_booking_e2e.py` — HarborStay map regression
- `docs/sdlc/01-requirements-response.md` through `docs/sdlc/07-verify-response.md` — stage records
- `docs/sdlc/verification-report.md` — Stage 7 Go evidence
- `docs/sdlc/08-final-pr-response.md` — this final-PR record

## Test Evidence

```text
python -m pytest tests/test_baseline.py tests/test_baseline_routes.py tests/test_routes.py --override-ini "addopts=" -q
# 20 passed, 1 skipped in 1.12s

python -m playwright install chromium
python -m pytest tests/e2e/test_baseline_e2e.py tests/e2e/test_booking_e2e.py --override-ini "addopts=" -q
# 8 passed in 14.60s

npx playwright install chromium
npx playwright test
# 9 passed (8.6s)
```

Playwright scripts: `tests/e2e/baseline.spec.js`, `tests/e2e/test_baseline_e2e.py`, `tests/e2e/booking.spec.js`, `tests/e2e/test_booking_e2e.py`. Playwright MCP was not connected; the scripts above were executed instead. The skipped test is the Windows symlink case. An outside-path check passed.

## Known Limitations

- Search, results, hotel/room selection, and confirmation are `Not Found`. The screenshot shows one home page with an inline Book your stay form.
- Format and failure state for every booking field are `Not Found`. No calendar due date was provided.
- Property-card sentences were transcribed from the screenshot and were not pixel-compared during Verify.
- A file-read `OSError` can still become HTTP 500. A missing screenshot returns 200 and `baseline-evidence-missing`.
- Jira was not updated with the artifact links.
- `main` does not contain the earlier HarborStay cycle, so this diff includes SCRUM-5 as well as SCRUM-31.
- GitHub pull-request creation has been returning 403. `gh` is not installed.

## Reviewer Checklist

- [ ] Behavior matches `requirements.md` acceptance criteria
- [ ] No secrets in code or generated documentation
- [ ] Error paths for missing files / empty repos handled
- [ ] Tests cover happy path and Not Found / missing-field cases
- [ ] Playwright E2E scripts cover primary UI flows
- [ ] Design aligns with approved `architecture.md`
- [ ] Implementation is a Python web application as planned
- [ ] Verification report reviewed
- [ ] Prior stage response MDs under `docs/sdlc/` are present
