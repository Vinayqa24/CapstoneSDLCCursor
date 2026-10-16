# Implementation Plan

## Approach Summary

Stage 5 builds a **Python Flask + Jinja2** HarborStay portal (baseline is missing on this branch) and then the [SCRUM-5](https://vinayqa24-1792155730342.atlassian.net/browse/SCRUM-5) **results map**. Catalog, filters, and booking draft stay in the browser. The map is a Leaflet 1.9.4 view of the same `visibleHotels[]` array as the list (vendored static assets, OpenStreetMap tiles, no API key).

Order: **scaffold → routes/templates → mock catalog with coordinates → list/filter → details/booking → Leaflet map → route tests → Playwright scripts**. Do not change payment into a real gateway. Do not add auth, geolocation, or clustering.

Stage 7 runs **Playwright** (pytest and/or `@playwright/test`) against `http://127.0.0.1:5000` in a **single tab**: marker → details, marker → book, empty filter → `map-empty`. Assertions use `data-testid`s, not tile pixels.

**Leaflet pin:** vendor **Leaflet 1.9.4** under `app/static/vendor/leaflet/` with upstream LICENSE/NOTICE. OSM attribution stays visible.

**Catalog:** `hotel-01`–`hotel-12`; at least **one** hotel with `lat`/`lng` null (for `map-no-coords`); remaining hotels get valid demo coordinates (e.g. a single metro area). Filters must include a combination that yields **zero** hotels.

**`data-testid` (map + existing smoke):**

| Testid | Owner task |
|----|---|
| `results-map` | T10 |
| `map-marker` (+ `data-hotel-id`) | T11 |
| `map-popup` | T12 |
| `map-view-details` | T12 |
| `map-book` | T12 |
| `map-empty` | T11 |
| `map-no-coords` | T11 |
| `map-fallback` | T11 |
| Existing list/filter/booking ids | T4–T7 (keep README-style names if rebuilt) |

## Task List (dependency order)

| ID | Task | Depends On | Priority | Status | Notes |
|----|------|------------|----------|--------|-------|
| T01 | Python deps: Flask, pytest, pytest-playwright (or playwright), pin versions in `requirements.txt`; `pytest.ini` | — | P0 | Done | No secrets. Do not add map API clients. |
| T02 | App factory `app/__init__.py`, `wsgi.py`, `app/routes.py` registering GET routes from architecture | T01 | P0 | Done | `/`, `/results`, `/hotels/<id>`, `/book/<id>/room\|guest\|payment`, `/confirmation` |
| T03 | Jinja `base.html` + page shells returning HTTP 200 | T02 | P0 | Done | Unknown hotel id: in-page not-found, still 200 |
| T04 | Mock catalog JS with `lat`/`lng` (nullable) and ≥1 hotel without coords | T03 | P0 | Done | Schema: id, name, area, stars, nightlyPrice, rooms, lat, lng |
| T05 | Results **list**: filter/sort, shared `visibleHotels[]`, a filter combo that empties the list | T04 | P0 | Done | ≤200 ms guidance on mock set; list `data-testid`s |
| T06 | Hotel details page from catalog id | T04 | P0 | Done | Link target for `map-view-details` |
| T07 | Booking draft: `sessionStorage` key `hotelBookingDraft`; **hydrate from URL hotel id** on room step | T06 | P0 | Done | Map must not write the draft (design review) |
| T08 | Room / guest / dummy payment / confirmation (minimal HarborStay wizard) | T07 | P0 | Done | No PAN; simulated pay only |
| T09 | `pytest` route smoke (`tests/test_routes.py`) | T03 | P0 | Done | All GETs 200; can land before catalog polish |
| T10 | Vendor Leaflet 1.9.4 + LICENSE into `app/static/vendor/leaflet/` | T03 | P0 | Done | No CDN runtime dependency for JS/CSS |
| T11 | Results split layout: list + map region, CSS stack ~800px, OSM attribution | T05, T10 | P0 | Done | `data-testid="results-map"`; hide map chrome until JS inits |
| T12 | Map module: keyboard map, layerGroup, DivIcon markers, coord range check, empty/no-coords/fallback, subscribe to `visibleHotels[]` only | T11 | P0 | Done | Skip invalid coords; ≤500 ms marker refresh; `map-fallback` if Leaflet missing |
| T13 | Marker popup via `createElement`/`textContent`: name, area, stars, price; View details; Book | T12, T06, T08 | P0 | Done | GET `/hotels/<id>` and `/book/<id>/room` |
| T14 | README: map usage, testids, Playwright commands | T13 | P1 | Done | No tokens |
| T15 | Playwright scripts: marker→details, marker→book, empty→`map-empty`; optional no-coords; stub tiles OK | T13, T09 | P0 | Done | Single tab; author now, **execute in Stage 7** |
| T16 | Stage 5 response MD (`docs/sdlc/05-implementation-response.md`) | T13, T09, T15 | P0 | Done | After code, before coding-stage PR |

## Critical Path

T01 → T02 → T03 → T04 → T05 → T10 → T11 → T12 → T13 → T15 → T16

Booking (T06–T08) sits beside the map path after T04; **T13 needs T08** so Book lands on a working room step. T09 can run as soon as T03 exists and should be re-run after T11.

## Blocked Tasks

| Task | Blocked until | Reason |
|----|----|---|
| T11–T13 (map UI) | T05 and T10 | Need filtered hotel array and vendored Leaflet |
| T13 popup Book | T08 | Room route must exist and hydrate draft |
| T15 Playwright map | T13 | Selectors and behavior must exist |
| T16 Stage 5 response | T13, T09, T15 | Evidence of app + tests in tree |
| Stage 6–8 | Human approval of Stage 5 | Pipeline gate |

No external vendor or Jira blocker. GitHub PR create (403) is a process blocker for stage PRs, not for coding.

## Test Strategy Preview

**Unit / route (`pytest`)**

- App factory loads.
- GET `/`, `/results`, `/hotels/hotel-01`, `/book/hotel-01/room`, guest, payment, confirmation → 200.
- Unknown hotel id → 200 with not-found UI.
- Static Leaflet path served 200 after T10.

**Playwright MCP / E2E (Stage 7 execute)**

- Happy: results map visible → activate `map-marker` → `map-popup` shows name/price → `map-view-details` → details page.
- Happy: marker → `map-book` → room step with hotel from URL (draft not empty).
- Empty: apply zero-result filter → `map-empty` visible, zero `map-marker`.
- Optional: filter to the null-coord hotel only → `map-no-coords`, list still has the row.
- Do **not** assert OSM tile bitmaps; intercept tiles if offline.

**Out of test scope:** real payments, geolocation, clustering, commercial map SDKs.

## Definition of Done (per task / overall)

**Per task:** implements the Notes column, no secrets, matches architecture contracts, leaves the app runnable (`flask --app wsgi:app run`).

**Overall (Stage 5):**

- [x] HarborStay routes in README work without a database.
- [x] Results show list + interactive map; markers for plottable hotels in the current filter set.
- [x] Popup details + View details + Book work; Book hydrates draft from URL.
- [x] `map-empty` and `map-no-coords` behave as specified; invalid coords skipped.
- [x] Leaflet vendored; OSM attribution visible; no map API keys.
- [x] `pytest tests/test_routes.py` passes; Playwright scripts exist under `tests/e2e/` for Stage 7.
- [x] `docs/sdlc/05-implementation-response.md` written; no `api-conf.properties` committed.
