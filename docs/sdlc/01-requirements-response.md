# Stage 1 Response — Requirements

## Summary

Captured [SCRUM-5](https://vinayqa24-1792155730342.atlassian.net/browse/SCRUM-5) (view hotels on a map) into `requirements.md`. The story is traveler-facing: plot available hotels as map markers, show basic details on marker activation, allow selection and navigation into booking, and show an empty-state message when no hotels are available.

Clarifying questions were interrupted; the user asked to **Continue**. Documented defaults (list + map on results, Leaflet + OSM, mock `lat`/`lng`, popup → details and booking) are in the Clarifications section of `requirements.md` and remain reversible before Architecture approval.

## Artifacts

- `requirements.md` — primary Stage 1 artifact
- `docs/sdlc/01-requirements-response.md` — this file

## Key Decisions

- New SDLC cycle for SCRUM-5 (no prior `requirements.md` in the workspace).
- Delivery remains a **Python web application** with **Playwright** verification in Stage 7.
- Map is an additional path on HarborStay results, not a rewrite of the booking wizard.
- No commercial map API keys in the repo; OSM attribution required.
- Secrets stay out of docs and source (`api-conf.properties` is gitignored).

## Open Questions / Blockers

- Human must confirm assumed UX defaults (layout, Leaflet, Book vs details).
- Local workspace currently has **no `.git` directory** and **no application source** (`app/`, tests). Stage 2 must decide: restore/extend HarborStay vs greenfield Flask app that still matches README routes.
- Stage PR URL is pending until git remote + GitHub create succeed.

## PR

pending

## Ready for Human Approval

Yes. Please confirm `requirements.md` (including assumed defaults) before Stage 2 Architecture. Reply **approved** / **proceed to architecture**, or list changes.
