# Code Review

## Summary

Peer review of Stage 5 HarborStay (Flask + Leaflet map for [SCRUM-5](https://vinayqa24-1792155730342.atlassian.net/browse/SCRUM-5)) against `requirements.md` and `architecture.md`. Stack fit is correct. One **critical** coordinate bug (`Number(null) === 0`) would have placed unmapped hotels at (0, 0) and broken `map-no-coords`. That is **fixed in `app/static/js/map.js`**. Remaining items are warnings/suggestions. Route smoke exists; Playwright E2E is authored for Stage 7 and has not been executed yet.

## Critical (must fix)

1. **Null coordinates treated as 0,0** — `app/static/js/map.js` `isPlottable` used `Number(hotel.lat)` / `Number(hotel.lng)`. In JavaScript `Number(null) === 0`, which is in-range, so `hotel-12` (lat/lng `null`) would get a marker in the Atlantic instead of `map-no-coords` (FR-9, AC). **Fixed:** require `typeof … === "number"` before the range check.

## Warnings (should fix)

1. **Guest email check is weak** — `app/static/js/booking-guest.js` only requires `"@"`. Fine for a mock portal; tighten if guest validation is in Stage 7 beyond “has an @”.
2. **Playwright not run in Stage 5** — `tests/e2e/` is ignored by default `pytest` (`tests/conftest.py` `collect_ignore`). Stage 7 must install Chromium and execute marker/empty/Offshore paths.
3. **Empty map still shows a tile pane** — When `map-empty` is visible, leftover OSM tiles remain under the message. Acceptable vs AC (message + zero markers); clearer if the map container is hidden when empty.
4. **Unused runtime dep** — `gunicorn==23.0.0` in `requirements.txt` is unused (`flask run` only). Extra install surface.

## Suggestions (consider)

1. Hide `#results-map` when showing empty/no-coords/fallback.
2. Drop gunicorn or document it as optional deploy.
3. Share `encodeURIComponent(hotel.id)` URL helpers between map, results, and details (small DRY).
4. Stage 7: run Offshore filter E2E to lock the null-coord fix.

## Checklist Results

| Area | Pass/Fail | Notes |
|------|-----------|-------|
| Correctness | Pass (after fix) | List+map, popups via `textContent`, details/book URLs, distinct empty vs no-coords, DivIcon testids. Null-coord bug fixed. |
| Security | Pass | No map/GitHub/Jira secrets in app. `api-conf.properties` gitignored. Popup DOM not `innerHTML` of catalog. No PAN. `hotel_id` passed with Jinja `tojson`. |
| Error Handling | Pass | Unknown hotel id → in-page not-found (HTTP 200). Bad `sessionStorage` JSON → null draft. Leaflet missing → `map-fallback`. Invalid coords skipped after fix. Catalog is bundled JS (no empty-repo sync API in this story). |
| Test Coverage | Pass* | Route 200s, unknown hotel hook, map testids, Leaflet static. E2E scripts cover marker/details/book/empty/Offshore but are Stage 7 execute. * = E2E not yet run. |
| Code Clarity | Pass | Small modules (`catalog`, `results`, `map`, `booking-*`). Names match architecture. |
| DRY Principle | Pass | Filter pipeline is single-source for list and map. Minor URL-building duplication is acceptable. |
| Dependency Safety | Pass | Pinned Flask 3.0.3, pytest, Playwright. Vendored Leaflet 1.9.4 + LICENSE. OSM tiles need no key. gunicorn unused (warning). |
| Stack fit | Pass | Python Flask web app as architecture/impl-plan. |

## Recommended Fixes (ordered)

1. ~~Reject non-number lat/lng in `isPlottable`~~ **done**
2. Stage 7: run `pytest tests/e2e/test_booking_e2e.py` (Chromium + live app)
3. Optional: hide map pane on empty states; remove gunicorn if unused

## Ready for Verify Stage? (yes/no)

**Yes**, provided the null-coord fix stays in the tree and the human accepts remaining warnings. Stage 7 must actually run Playwright (MCP/scripts), not only keep them unexecuted.
