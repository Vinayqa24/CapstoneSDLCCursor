# Stage 1 Response — Requirements

## Summary

Captured [SCRUM-31](https://vinayqa24-1792155730342.atlassian.net/browse/SCRUM-31) (screenshot-driven baseline inventory and booking journey map) into `requirements.md`. The product owner wants an evidence-based feature inventory, an end-to-end booking journey, field and failure notes, and P0/P1/P2 gaps.

Clarifying questions were answered before writing the file. Evidence is the single Jira screenshot only. Both ticket attachments are the same PNG; the repo copy is `docs/baseline/evidence/image-20261103-075923.png`. That image is one Hotel Titan home page (hero, three property cards, inline booking form). Search Results, Hotel Details, a separate Checkout page, and Confirmation are not in the image and are recorded as questions, not invented screens.

Delivery for later stages is a Python web app that presents markdown under `docs/baseline/` at `GET /baseline`, verified with Playwright. This stage does not implement that app. Jira is not updated until a later approval.

This starts a new cycle. SCRUM-5 artifacts already in the tree stay as history and are not the approved design for SCRUM-31.

## Artifacts

- `requirements.md` — primary Stage 1 artifact
- `docs/baseline/evidence/image-20261103-075923.png` — canonical screenshot (copy of Jira attachment 10000; attachment 10001 is identical)
- `docs/sdlc/01-requirements-response.md` — this file

## Key Decisions

- New SDLC cycle for SCRUM-31 on top of the completed SCRUM-5 branch. Stage 2 must rewrite the architecture for this story.
- Evidence is screenshot-only. HarborStay is not a source for the inventory.
- Unknown controls, formats, and screens are `Not Found`.
- Gap rubric: P0 confirmation/outcome, P1 hotel selection and unseen validation, P2 non-booking content such as unseen carousel frames.
- Question owner is the product owner role; due is before Stage 2 approval. No calendar date was provided.
- Python web application plus Playwright remains the delivery and verification path. The app will display the baseline; it will not reimplement Hotel Titan booking.
- Secrets stay out of docs and source. `api-conf.properties` is gitignored and was not copied into artifacts.

## Open Questions / Blockers

- Q1–Q5 in `requirements.md` remain open for the product owner. Working assumptions are enough to leave Stage 1.
- SCRUM-31 has no Jira assignee.
- Linking the artifacts back to the Jira story is intentionally deferred.

## PR

pending — `gh` is not installed, and GitHub `POST /repos/Vinayqa24/CapstoneSDLCCursor/pulls` returned **403** (empty body). The branch is on the remote. Open:

https://github.com/Vinayqa24/CapstoneSDLCCursor/compare/sdlc/stage-8-scrum-5-final...sdlc/stage-1-scrum-31-requirements?expand=1

Grant the token **Pull requests: write** (or install `gh`) to create the PR from here. Base is `sdlc/stage-8-scrum-5-final` so the diff is this stage only.

## Ready for Human Approval

Yes. Please confirm `requirements.md` (screenshot-only evidence, `/baseline` viewer, and the P0/P1/P2 rubric) before Stage 2 Architecture. Reply **approved** / **proceed to architecture**, or list changes.
