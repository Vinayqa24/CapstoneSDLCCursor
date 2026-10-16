# Requirements

## User Story

**Source:** [SCRUM-5](https://vinayqa24-1792155730342.atlassian.net/browse/SCRUM-5)

As a traveler, I want to view hotels on a map so that I can easily find and select a hotel.

Display available hotels on an interactive map. Users can click a hotel marker to view basic hotel details and proceed with booking.

**Jira acceptance (verbatim):**

- Hotels are displayed as markers on the map.
- Clicking a marker shows basic hotel details.
- User can select a hotel from the map.
- User can proceed to the booking page.
- An appropriate message is shown when no hotels are available.

**Product context:** HarborStay is a Python Flask + Jinja2 hotel booking portal with a mock catalog (`hotel-01` … `hotel-12`), results (filter/sort), hotel details, a three-step booking wizard, and confirmation. This story extends the traveler-facing results experience with a map; it does not replace the booking wizard.

## Clarifications (Q&A summary)

Clarifying questions were asked; the user replied **Continue** without choosing options. The following defaults are recorded so Stage 1 can complete. They may be overridden before Architecture is approved.

| Topic | Assumed default |
|----|---|
| Map placement | Results page (`/` and `/results`): keep the existing hotel **list** and add an **interactive map** of the same filtered set (split / list+map view). |
| Map library | **Leaflet** with **OpenStreetMap** tiles (no map API key). Attribution must remain visible. |
| Marker click | Popup/card with **basic details**: hotel name, location/area, star rating, and nightly price. |
| Select hotel | From the popup, **View details** navigates to existing hotel details (`/hotels/<hotel_id>`). |
| Proceed to booking | From the popup, **Book** (or equivalent) navigates to the existing room step (`/book/<hotel_id>/room`), same as starting booking from details. |
| Coordinates | Add `lat` / `lng` to the **mock catalog** (static demo data). No runtime geocoding. |
| Empty map | When the **current results filters yield zero hotels**, the map region shows an appropriate empty message and **no markers**. |
| Missing coordinates | Hotels without valid `lat`/`lng` still appear in the list but **do not** get a marker. If every hotel in the current result set lacks coordinates (or the set is empty), show the same class of empty/unavailable map message. |
| Clustering / geolocation | Not required (catalog size is ~12 hotels). No “use my location” or “search this area.” |
| Delivery / verify | Python web application (Flask, consistent with HarborStay). Stage 7 verifies with **Playwright** (plus unit/route tests). |

## Functional Requirements

1. The results screen SHALL render an interactive map in addition to the hotel list.
2. The map SHALL plot one marker per hotel in the **current filtered/sorted result set** that has valid latitude and longitude.
3. Marker positions SHALL come from mock catalog fields (`lat`, `lng`), not from an external geocoding service.
4. Clicking (or activating) a marker SHALL show basic hotel details: name, location/area, star rating, and nightly price.
5. From that marker UI the traveler SHALL be able to **select** the hotel (open hotel details).
6. From that marker UI the traveler SHALL be able to **proceed to booking** (open room selection for that hotel).
7. Changing results filters or sort SHALL update map markers so they stay consistent with the list (same hotels; sort need not change geographic position).
8. When no hotels are available in the current result set, the map area SHALL show an appropriate, visible message and SHALL NOT show hotel markers.
9. When hotels exist in the list but none have plottable coordinates, the map area SHALL show an appropriate message (no markers).
10. Existing results list, hotel details, and booking wizard routes SHALL remain usable; the map is an additional selection path, not a replacement of booking.
11. Map tile usage SHALL include required OpenStreetMap / Leaflet attribution.

## Non-Functional Requirements

1. **Stack:** Implement as a Python web application (Flask + Jinja2 + static JS/CSS unless Architecture revises this with human approval).
2. **Security:** No API keys, tokens, or credentials in source, templates, tests, or generated docs. Map tiles must not require a committed secret. Do not commit `api-conf.properties` or `.env`.
3. **Privacy:** Do not collect or persist the traveler’s geolocation. Booking remains mock (no real payments or PAN storage).
4. **Reliability:** Missing or invalid coordinates SHALL NOT crash the results page; skip the marker and continue.
5. **Accessibility:** Markers and popup actions SHALL be operable with keyboard and SHALL expose accessible names (e.g. hotel name). Empty-state copy SHALL be available to assistive technology (not color-only).
6. **Performance:** Plotting the mock catalog (~12 hotels) on the map SHALL complete without blocking the existing ≤200 ms filter/sort path beyond a documented, testable budget (default: marker refresh within **500 ms** of a filter change on the mock set).
7. **Observability:** Client-side failures to load map assets SHALL surface a visible fallback message in the map region (not a blank page).
8. **Testability:** Primary map controls SHALL have stable `data-testid` hooks for Playwright (map container, marker, popup, view-details, book, empty message).
9. **Verification:** Happy path and empty-map path SHALL be covered by Playwright E2E in Stage 7.

## Acceptance Criteria

- [ ] On `/` or `/results`, an interactive map is visible alongside the hotel list.
- [ ] Each hotel in the current filtered set with valid `lat`/`lng` appears as a map marker.
- [ ] Activating a marker shows name, location/area, star rating, and nightly price.
- [ ] From the marker UI the user can open that hotel’s details page.
- [ ] From the marker UI the user can open that hotel’s booking room-selection page.
- [ ] When filters yield zero hotels, the map region shows an appropriate message and zero hotel markers.
- [ ] Hotels missing coordinates do not produce a marker and do not break the page.
- [ ] No secrets appear in the repo or in documentation generated for this story.
- [ ] Playwright can drive: results → marker → details or booking, and results → empty filters → empty map message.

## Out of Scope

- Real-time hotel inventory, pricing APIs, or paid map platforms (Google Maps, Mapbox) unless Architecture is later approved to change this.
- User accounts, authentication, and saved favorites.
- Geolocation (“hotels near me”), driving directions, and map clustering.
- Editing or creating hotels (catalog remains mock/static).
- Changing the three-step booking, payment simulation, or confirmation flows except as needed to keep navigation from the map working.
- Mobile-native apps; responsive web is in scope only as the existing portal layout allows.

## Open Questions (if any remain)

1. Confirm the assumed **list + map** results layout vs list/map toggle vs a dedicated `/map` route.
2. Confirm **Leaflet + OSM** vs a keyed commercial map SDK.
3. Confirm popup **Book** goes to `/book/<id>/room` vs details-only selection.
4. If the local workspace is missing the prior HarborStay application code, Architecture must state whether this story **extends** that app (restore/reimplement baseline) or delivers **map-only** on a new Flask app.
