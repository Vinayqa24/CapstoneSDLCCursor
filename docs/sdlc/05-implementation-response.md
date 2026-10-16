# Stage 5 Response — Implementation

## Summary

Implemented HarborStay as a **Flask + Jinja2** app with a mock catalog and three-step booking, then the SCRUM-5 results map: vendored **Leaflet 1.9.4**, DivIcon markers, `textContent` popups, View details / Book, `map-empty` / `map-no-coords` / `map-fallback`. Booking draft hydrates from the URL hotel id on the room step. Playwright scripts are in the tree for Stage 7; route smoke is run in this stage.

## Artifacts

- `wsgi.py`, `app/` (routes, templates, JS/CSS, `static/vendor/leaflet/`)
- `requirements.txt`, `pytest.ini`, `tests/test_routes.py`, `tests/e2e/`
- `README.md`, `impl-plan.md` (tasks marked Done)
- `docs/sdlc/05-implementation-response.md` — this file

## Key Decisions

- Followed T01–T16 without FastAPI/Django or paid map SDKs.
- `hotel-12` / area Offshore has null coordinates.
- Search `zzz-no-hotels` empties the list for E2E.
- OSM tiles stubbed in Playwright; assertions use `data-testid`.

## Open Questions / Blockers

- Playwright E2E execution is Stage 7 (Chromium install).
- GitHub PR create may still 403; compare URL fallback.
- Visual check of DivIcon styling on a live map should be part of human Stage 5 review.

## PR

pending — compare URL: https://github.com/Vinayqa24/CapstoneSDLCCursor/compare/main...sdlc/stage-5-scrum-5-implementation?expand=1

## Ready for Human Approval

Yes. Run `flask --app wsgi:app run`, open `/results`, click a marker, try empty search and Offshore. Reply **approved** before Stage 6 Code Review, or list fixes.
