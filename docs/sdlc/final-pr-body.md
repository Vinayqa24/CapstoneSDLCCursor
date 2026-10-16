## Summary

HarborStay is a Python Flask hotel-booking UI. This cycle delivers [SCRUM-5](https://vinayqa24-1792155730342.atlassian.net/browse/SCRUM-5): travelers can see filtered hotels on a Leaflet/OpenStreetMap map, open basic details from a marker, and continue to hotel details or the booking room step. Stage 7 Verify was **Go** (5 route tests, 7 Playwright JS tests).

## Changes Made

- `requirements.md` — SCRUM-5 map requirements and acceptance criteria
- `architecture.md` / `design-review.md` / `impl-plan.md` / `code-review.md` — SDLC design artifacts (DivIcon markers, distinct empty vs no-coords, null-coord fix)
- `app/` `wsgi.py` `requirements.txt` — Flask app, mock catalog, booking wizard, vendored Leaflet 1.9.4
- `app/static/js/map.js` — map markers, popups (`textContent`), empty/no-coords/fallback
- `tests/test_routes.py` — route smoke including map hooks and Leaflet static
- `tests/e2e/booking.spec.js` — executed Playwright suite
- `docs/sdlc/*-response.md` `docs/sdlc/verification-report.md` — stage responses 1–8 and verify report
- `README.md` — map testids and how to run tests

## Test Evidence

```text
python -m pytest tests/test_routes.py -q
.....  (5 passed)

npx playwright test
  ok 1 results shows list and map
  ok 2 marker popup shows details and opens hotel page
  ok 3 marker book opens room step
  ok 4 empty search shows map-empty
  ok 5 offshore area shows map-no-coords
  ok 6 unknown hotel shows not-found
  ok 7 guest validation error
  7 passed (6.3s)
```

Scripts: `tests/e2e/booking.spec.js` (executed), `tests/e2e/test_booking_e2e.py` (not executed on CPython 3.14). Report: `docs/sdlc/verification-report.md`.

## Known Limitations

- Playwright MCP was not available in the Verify session; JS Playwright was used.
- Python Playwright (`greenlet`) did not install on CPython 3.14.
- `gunicorn` is pinned but unused (`flask run`).
- OSM tiles have no SLA; tests stub tiles.
- No geolocation, clustering, or paid map SDK (out of scope).
- GitHub stage PRs were compare URLs when `POST /pulls` returned 403.

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
