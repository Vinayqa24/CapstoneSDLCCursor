# Stage 2 Response — Architecture

## Summary

Replaced the SCRUM-5 architecture with a design for approved [SCRUM-31](https://vinayqa24-1792155730342.atlassian.net/browse/SCRUM-31). The existing Flask app gains `GET /baseline`, which renders inventory, journey, validations, gaps, and questions from markdown under `docs/baseline/`. Regions render only when `docs/baseline/evidence/image-20261103-075923.png` is present. HarborStay routes and the Leaflet map stay as they are and are not used as evidence.

Stage 1 approval adopted Q1–Q5. This stage does not invent the missing Hotel Titan screens.

## Artifacts

- `architecture.md` — primary Stage 2 artifact
- `docs/sdlc/02-architecture-response.md` — this file
- `requirements.md` — approved Stage 1 input (unchanged)

## Key Decisions

- Stay on **Flask + Jinja2**. FastAPI and Django are a worse fit for one HTML page on an existing Flask app.
- Markdown pipe tables are the source of truth. A small reader returns cells; Jinja autoescape prints them. No new runtime dependency and no markdown-to-HTML step.
- Missing PNG: HTTP 200, `baseline-evidence-missing`, five regions omitted.
- Missing or invalid markdown for one region: that region shows `Not Found`; other regions still render.
- Evidence URL serves only the canonical filename. No path from the query string.
- Playwright in Stage 7 uses `data-testid` hooks and a test `BASELINE_DIR` for the missing-file case.
- One header link (`baseline-nav`) makes the page discoverable. Map and booking behavior are unchanged.

## Open Questions / Blockers

- Q1–Q4 remain displayed as product-owner assumptions (no extra screens, no guessed validation, no calendar date). They do not block this design.
- GitHub pull-request creation returned 403 on Stage 1. Stage 2 uses the same push and compare-URL path if create fails again.
- `gh` is not installed on this machine.

## PR

pending — `gh` is not installed, and GitHub `POST /repos/Vinayqa24/CapstoneSDLCCursor/pulls` returned **403**. The branch is on the remote. Open:

https://github.com/Vinayqa24/CapstoneSDLCCursor/compare/sdlc/stage-1-scrum-31-requirements...sdlc/stage-2-scrum-31-architecture?expand=1

Base is `sdlc/stage-1-scrum-31-requirements` so the diff is this stage only. Grant the token **Pull requests: write** to create the PR from here.

## Ready for Human Approval

Yes. Confirm `architecture.md` (Flask baseline viewer, markdown tables, HarborStay routes unchanged) before Stage 3 Design Review. Reply **approved** / **proceed to design review**, or list changes.
