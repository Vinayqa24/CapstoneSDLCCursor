# Stage 3 Response — Design Review

## Summary

Reviewed approved `requirements.md` and `architecture.md` for SCRUM-5. Flask + Leaflet on results is sound. Three critical gaps (marker testability, collapsed empty states, popup HTML vs XSS-safe DOM) were fixed in `architecture.md`. Warnings remain around OSM tiles, URL-based booking draft hydration, and Stage 5 baseline restore if `app/` is missing.

## Artifacts

- `design-review.md` — primary Stage 3 artifact
- `architecture.md` — updated per findings
- `docs/sdlc/03-design-review-response.md` — this file

## Key Decisions

- Keep Flask + vendored Leaflet + OSM.
- DivIcon markers with `data-testid` / `data-hotel-id` / accessible names.
- Separate `map-empty` and `map-no-coords`.
- No catalog `innerHTML` in popups.
- Booking wizard hydrates from URL; map does not write `sessionStorage`.

## Open Questions / Blockers

- Human acceptance of the review outcome (no remaining criticals).
- GitHub PR API may still return 403; compare URL used as fallback.

## PR

pending — compare URL: https://github.com/Vinayqa24/CapstoneSDLCCursor/compare/main...sdlc/stage-3-scrum-5-design-review?expand=1

## Ready for Human Approval

Yes. Confirm `design-review.md` and the architecture deltas before Stage 4 Implementation Planning. Reply **approved** / **proceed to implementation planning**, or list changes.
