# Stage 6 Response — Code Review

## Summary

Reviewed the Flask HarborStay + Leaflet map implementation against the capstone checklist. Found one critical bug: `Number(null) === 0` would plot hotels without coordinates. Fixed `isPlottable` in `app/static/js/map.js`. Warnings: weak email check, E2E not executed yet, unused gunicorn. Ready for Verify after human acceptance of this review.

## Artifacts

- `code-review.md` — primary Stage 6 report
- `app/static/js/map.js` — critical fix
- `docs/sdlc/06-code-review-response.md` — this file

## Key Decisions

- Treat null-coordinate plotting as must-fix (FR-9 / Offshore hotel).
- Do not expand guest validation or remove gunicorn in this stage unless requested.
- Verify stays blocked until this review is accepted (critical already patched).

## Open Questions / Blockers

- Human accept warnings and proceed to Stage 7.
- GitHub PR API may still 403.

## PR

pending — compare URL: https://github.com/Vinayqa24/CapstoneSDLCCursor/compare/main...sdlc/stage-6-scrum-5-code-review?expand=1

## Ready for Human Approval

Yes. Confirm the code review and the `isPlottable` fix before Stage 7 Verify. Reply **approved** / **proceed to verify**, or list further fixes.
