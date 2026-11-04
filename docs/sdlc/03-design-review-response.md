# Stage 3 Response — Design Review

## Summary

Reviewed the approved SCRUM-31 architecture for the Flask baseline viewer. The stack and the screenshot-gated `/baseline` page are sound. Three critical gaps were closed in `architecture.md`: pipe tables must match the column contract or the region is `Not Found`, region headings are fixed in the template, and baseline paths must stay inside `BASELINE_DIR`. Warnings added a PNG signature check, size caps, reason-code logs, a ban on marking cell text safe, and unit tests for the loader.

No production code was written. HarborStay map behavior was not changed.

## Artifacts

- `design-review.md` — primary Stage 3 artifact
- `architecture.md` — updated where the findings required a design change
- `docs/sdlc/03-design-review-response.md` — this file

## Key Decisions

- Keep Flask. Do not split a second app for the baseline page.
- A mismatched markdown table is not rendered in part.
- Evidence is a real PNG within 2 MiB, not merely a file with the right name.
- Playwright covers the page. Unit tests cover the loader’s failure cases.
- Q1–Q4 remain assumptions. This review does not invent missing Hotel Titan screens.

## Open Questions / Blockers

- Human acceptance of `design-review.md` and the architecture edits.
- The five baseline markdown files are still unwritten; that is Stage 5 work.
- GitHub `POST /pulls` may 403 again. Compare URL will be recorded if create fails.
- `gh` is not installed.

## PR

pending

## Ready for Human Approval

Yes. Confirm this review and the updates in `architecture.md` before Stage 4 Implementation Planning. Reply **approved** / **proceed to implementation planning**, or list changes.
