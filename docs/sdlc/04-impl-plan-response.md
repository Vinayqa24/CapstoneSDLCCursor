# Stage 4 Response — Implementation Planning

## Summary

Broke approved architecture and design review into a dependency-ordered HarborStay plan: restore the Flask baseline, then add a vendored Leaflet 1.9.4 results map that subscribes to `visibleHotels[]`. Map work is explicitly blocked on catalog, filters, and Leaflet vendor files. Playwright scripts are planned in Stage 5 and executed in Stage 7.

## Artifacts

- `impl-plan.md` — primary Stage 4 artifact
- `docs/sdlc/04-impl-plan-response.md` — this file
- `design-review.md` — approval status set after human Stage 3 approval

## Key Decisions

- Baseline (T01–T08) before map (T10–T13); do not ship map-only.
- Leaflet **1.9.4** vendored with LICENSE.
- One mock hotel without coordinates; filters can yield zero hotels.
- Booking draft hydration from URL (T07); map never writes `sessionStorage`.
- `pytest` route smoke in Stage 5; Playwright **run** in Stage 7.

## Open Questions / Blockers

- Coding starts only after human approval of this plan.
- GitHub PR API may still 403; compare URL fallback.
- `app/` still absent until Stage 5.

## PR

pending — compare URL: https://github.com/Vinayqa24/CapstoneSDLCCursor/compare/main...sdlc/stage-4-scrum-5-impl-plan?expand=1

## Ready for Human Approval

Yes. Confirm `impl-plan.md` (task order, Leaflet pin, testids) before Stage 5 Implementation. Reply **approved** / **proceed to implementation**, or list changes.
