# HarborStay — Interactive Hotel Booking User Portal

Python **Flask + Jinja2** web app that serves a multi-page hotel booking UI. Catalog data, filters, sorting, validation, and booking draft state run in the browser (vanilla JS + `sessionStorage`). No database, authentication, or real payments.

## Quick start

```bash
# From the repo root
python -m venv .venv

# Windows PowerShell
.\.venv\Scripts\Activate.ps1

# macOS / Linux
# source .venv/bin/activate

pip install -r requirements.txt

# Run the app
set FLASK_APP=wsgi:app          # PowerShell: $env:FLASK_APP = "wsgi:app"
flask run
```

Open http://127.0.0.1:5000/

Alternative: `python -m flask --app wsgi:app run`

## Routes

| Path | Screen |
|------|--------|
| `/` or `/results` | A — Results (filter / sort + **Leaflet map**) |
| `/hotels/<hotel_id>` | B — Hotel details |
| `/book/<hotel_id>/room` | C — Room selection (step 1/3) |
| `/book/<hotel_id>/guest` | D — Guest details (step 2/3) |
| `/book/<hotel_id>/payment` | E — Dummy payment (step 3/3) |
| `/confirmation` | F — Confirmation + confetti |

Sample mock hotel ids: `hotel-01` … `hotel-12`. `hotel-12` (area **Offshore**) has no coordinates. Search `zzz-no-hotels` yields an empty list and `map-empty`.

## Map (SCRUM-5)

Results is a split list + map. Markers are DivIcon pins (`data-testid="map-marker"`). Popup: name, area, stars, price, **View details**, **Book** (room step). Leaflet **1.9.4** is vendored at `app/static/vendor/leaflet/` (LICENSE included). Tiles come from OpenStreetMap (attribution on the map). No map API key.

| `data-testid` | Meaning |
|----|---|
| `results-map` | Map container |
| `map-marker` | Marker (`data-hotel-id`) |
| `map-popup` | Popup |
| `map-view-details` / `map-book` | Popup links |
| `map-empty` | Zero hotels in the filter set |
| `map-no-coords` | Listed hotels, none plottable (e.g. area Offshore) |
| `map-fallback` | Leaflet failed to load |

## Booking draft

- Storage key: `hotelBookingDraft` in **`sessionStorage`** (same-tab only).
- Survives refresh in the same tab; clears when the tab closes.
- Confirmation “Back to results” clears the draft.
- Demos and Playwright E2E must stay in a **single browser tab**.

## Performance tip (≤200 ms)

Filter/sort runs synchronously against the in-memory mock catalog. In DevTools console on Results:

```js
performance.now(); // wrap around filter changes; results.js also warns if >200ms
```

Dummy payment uses a brief ~400 ms loading simulation (not a real gateway).

## Tests

```bash
# Route smoke only
pytest tests/test_routes.py -q

# Playwright E2E (Flask must be running on :5000)
pip install -r requirements.txt
playwright install chromium
# terminal 1: flask --app wsgi:app run --port 5000
# terminal 2:
set PLAYWRIGHT_BASE_URL=http://127.0.0.1:5000
pytest tests/e2e/test_booking_e2e.py -q
```

Optional JS twin: `npm i` then `npx playwright test` (see `tests/e2e/booking.spec.js`).

Default `pytest` runs route smoke only (`tests/e2e` is ignored). E2E covers map marker → details, marker → book, empty search, and Offshore / no-coords. Tests stub OSM tiles and do not assert tile pixels.

## Stage 7 prep (Playwright)

Happy path (single tab): Results → filter + sort → open details → Select room → C Continue → D valid guest → E Pay/Confirm → F summary + `HB-` reference + confetti.

Prefer `data-testid` selectors (see `impl-plan.md` naming table). Scripts live under `tests/e2e/`.

## Security

- No secrets in source or docs. Do not commit `api-conf.properties` or `.env`.
- Payment is simulation-only; no card PAN collection.
- The map does not use geolocation and does not write `hotelBookingDraft` (the room step hydrates from the URL hotel id).
