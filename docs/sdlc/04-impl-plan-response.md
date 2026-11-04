# Stage 4 Response — Implementation Planning

## Summary

Broke the approved SCRUM-31 architecture and design review into a dependency-ordered plan for the Flask baseline viewer. Stage 5 adds a loader, two routes, one template, a header link, and five markdown tables transcribed from the Hotel Titan screenshot. HarborStay map and booking handlers stay as they are. Playwright scripts are written in Stage 5 and run in Stage 7.

No production code was written in this stage.

## Artifacts

- `impl-plan.md` — primary Stage 4 artifact
- `docs/sdlc/04-impl-plan-response.md` — this file
- `design-review.md` — approval status set after human Stage 3 approval

## Key Decisions

- T01–T06 are the code path; T07 (markdown) can start in parallel and blocks the happy-path tests.
- No new runtime dependency. `BASELINE_DIR` is package-relative, with a test-only env override for the browser server.
- Bad tables, non-PNG evidence, and paths outside the baseline directory are `Not Found`, matching the design review.
- Journey steps search, results, hotel/room selection, and confirmation stay `Not Found`. The room control is documented on the inline form, not as its own screen.
- `pytest` unit and client tests in Stage 5. Playwright execution is T11 in Stage 7, including one rerun of the existing map specs.

## Open Questions / Blockers

- Coding starts only after human approval of this plan.
- T11 is blocked until Stage 7.
- GitHub PR API may still 403; compare URL fallback.
- Q1–Q4 stay assumptions and do not block T07.

## PR

pending

## Ready for Human Approval

Yes. Confirm `impl-plan.md` (task order, markdown rules, and test ids) before Stage 5 Implementation. Reply **approved** / **proceed to implementation**, or list changes.
