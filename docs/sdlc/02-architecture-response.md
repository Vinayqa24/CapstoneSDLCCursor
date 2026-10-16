# Stage 2 Response — Architecture

## Summary

Proposed HarborStay architecture for approved [SCRUM-5](https://vinayqa24-1792155730342.atlassian.net/browse/SCRUM-5): keep **Flask + Jinja2 + vanilla JS**, restore/extend the existing booking portal if source is missing, and add a **Leaflet + OpenStreetMap** map on the results page that consumes the same filtered mock catalog as the list. Marker popups navigate to hotel details and booking room selection. No map API keys, no geolocation, no new JSON API.

## Artifacts

- `architecture.md` — primary Stage 2 artifact
- `docs/sdlc/02-architecture-response.md` — this file
- `requirements.md` — approved Stage 1 input (unchanged)

## Key Decisions

- **Extend HarborStay**, do not ship a map-only app (resolves requirements open question 4).
- Flask over FastAPI/Django: HTML multi-page app with a mock catalog, no ORM or public API.
- Leaflet vendored under static assets; OSM tiles at runtime; attribution required.
- Map is a view of `visibleHotels[]` from the existing filter/sort pipeline.
- Playwright contracts: `results-map`, `map-marker`, `map-popup`, `map-view-details`, `map-book`, `map-empty`, `map-fallback`.
- Popup content via escaped text, not unsanitized HTML.

## Open Questions / Blockers

- Stage 1 GitHub PR create still 403 unless the token has Pull requests: write; Stage 2 will use the same push + compare-URL fallback if needed.
- Baseline UI must be reimplemented in Stage 5 if `app/` is absent from the workspace.

## PR

pending

## Ready for Human Approval

Yes. Confirm `architecture.md` (Flask + Leaflet on results, restore HarborStay baseline) before Stage 3 Design Review. Reply **approved** / **proceed to design review**, or list changes.
