# Design Review

## Summary

Architecture for [SCRUM-5](https://vinayqa24-1792155730342.atlassian.net/browse/SCRUM-5) is **fit for a Flask multi-page app**: list + Leaflet map on results, mock `lat`/`lng`, no map API keys, Playwright against the UI. The original design had three testability/correctness gaps (default Leaflet pin DOM, collapsed empty states, popup `innerHTML` vs `textContent`). Those are **closed in `architecture.md`**. Residual risk is operational (OSM tiles, missing `app/` baseline on this branch) rather than a wrong stack.

Flask remains the right choice versus FastAPI/Django. Stage 5 must re-establish HarborStay routes if `app/` is absent, then add the map—scope is large but required by approved requirements.

## Findings

### Critical

1. **Marker `data-testid` vs default Leaflet icon**  
   Requirements NFR-8 and architecture Interfaces demanded `map-marker` on markers. Leaflet’s default pin is an `<img class="leaflet-marker-icon">` that is awkward for Playwright and keyboard names.  
   **Fix applied:** DivIcon (or equivalent) with `data-testid="map-marker"`, `data-hotel-id`, and accessible name = hotel name; `keyboard: true` on map and markers.

2. **One empty message for two requirements**  
   FR-8 (zero hotels) and FR-9 (hotels without coords) were specified as the “same class” of message. That fails distinct AC, assistive-tech clarity, and E2E (`map-empty` could not encode both).  
   **Fix applied:** `map-empty` vs `map-no-coords`; Data Flow and Failure Modes updated.

3. **Popup construction contradiction**  
   Components said “popup HTML” while Security forbade unsanitized `innerHTML` from catalog strings. XSS risk if Stage 5 followed the HTML wording.  
   **Fix applied:** `createElement` / `textContent` only.

### Warnings

1. **OSM tiles are a single point of failure for imagery**  
   Markers/popups still work if tiles fail (Failure Modes). E2E must not assert on tile pixels; stub tiles if needed.

2. **Map Book skips details**  
   Allowed by requirements. Wizard **must** hydrate `hotelBookingDraft` from URL `hotel_id` so room step is not empty. Architecture Data Flow step 6 now states this.

3. **Baseline restore is most of Stage 5**  
   This git branch has no `app/` tree. Implementing SCRUM-5 implies rebuilding results/details/booking/confirmation plus the map. Impl-plan must sequence baseline before map and avoid scope creep (no payment/auth changes).

4. **Zero-result path must be reachable**  
   Playwright cannot meet AC without a filter combination that yields no hotels. Architecture now requires that the results filters (or a documented test combination) can empty the set.

5. **Coordinate validity was underspecified**  
   “Finite number” would plot lat=200. **Fix applied:** lat ∈ [-90, 90], lng ∈ [-180, 180].

### Suggestions

1. Responsive stacking (list above map under ~800px) in implementation CSS; not a new route.
2. Optional list↔marker highlight (click list to open popup) — out of SCRUM-5 AC; do not block.
3. Vendor Leaflet with version pin + LICENSE file in impl-plan.
4. Include one mock hotel with `lat`/`lng: null` so `map-no-coords` can be exercised by filtering to that hotel only (or a tiny test catalog).
5. Do not add CSP in this story; if added later, allow OSM tile origins explicitly.

## Decisions Agreed

| Decision | Source |
|----|---|
| Flask + Jinja2 + vanilla JS | Requirements NFR-1; Architecture Technology Choices |
| Extend/re-establish HarborStay, not map-only | Requirements open Q4; Architecture Overview |
| Leaflet vendored + OSM, no API key | Requirements clarifications; Architecture |
| List + map on `/` and `/results` | Requirements clarifications |
| Popup: details + Book to `/book/<id>/room` | Requirements FR-5/6 |
| DivIcon markers with testids | This review |
| Distinct empty vs no-coords UI | This review |
| Draft hydration from URL, map does not write sessionStorage | This review |
| Playwright: markers/popup/empty, not tile screenshots | Architecture Interfaces |

## Architecture Updates Made

- Data Flow: dual empty states, coordinate range check, single subscriber of `visibleHotels[]`, booking draft from URL.
- Map component: DivIcon, keyboard, `textContent` popups, `fitBounds`.
- Interfaces: `map-no-coords`; E2E must empty the filter set; no tile-pixel assertions.
- Failure Modes and Open Trade-offs aligned with the above.
- Stage 2 response PR compare URL recorded.

## Residual Risks

- OSM tile availability/rate limits (imagery only).
- Workspace may lack HarborStay source until Stage 5; schedule risk, not design risk.
- GitHub token cannot create PRs (403); stage PRs may stay at compare URLs.
- Default Leaflet CSS vs custom DivIcon styling on small viewports — verify visually in Stage 5/7.
- Keyboard order of many markers is Leaflet-defined; acceptable for ~12 hotels.

## Approval Status

**Pending human approval** of this design review (and the updated `architecture.md`) before Stage 4 Implementation Planning.
