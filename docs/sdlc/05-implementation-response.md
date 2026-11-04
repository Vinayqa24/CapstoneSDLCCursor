# Stage 5 Response — Implementation

## Summary

Implemented the approved SCRUM-31 baseline viewer on the existing Flask app. `GET /baseline` renders inventory, journey, validations, gaps, and questions from markdown under `docs/baseline/` only when `image-20261103-075923.png` passes the PNG check. A missing or invalid screenshot returns HTTP 200 with `baseline-evidence-missing` and does not render those regions. HarborStay results, map, and booking handlers were not changed. A Baseline link was added in the header.

T01–T10 are done. T11 stays blocked for Stage 7.

## Artifacts

- `app/baseline.py` — loader
- `app/__init__.py` — `BASELINE_DIR`
- `app/routes.py` — `GET /baseline` and `GET /baseline/evidence`
- `app/templates/baseline.html` — regions and fixed headings
- `app/templates/base.html` — `baseline-nav`
- `app/static/css/main.css` — table styles for the baseline page
- `docs/baseline/inventory.md`, `journey.md`, `validations.md`, `gaps.md`, `questions.md`
- `tests/test_baseline.py`, `tests/test_baseline_routes.py`
- `tests/e2e/test_baseline_e2e.py` — authored, not executed (T11)
- `impl-plan.md` — task status
- `docs/sdlc/05-implementation-response.md` — this file

## Key Decisions

- No new runtime dependency. Cells are printed with Jinja autoescape.
- `BASELINE_DIR` defaults to the parent of the `app` package plus `docs/baseline`. The env var is only a test-server override.
- A table with the wrong header, a short row, or no data rows is `Not Found` for that region.
- Search, results, hotel/room selection, and confirmation stay `Not Found` in the journey. The room control is documented on the inline form.
- Playwright scripts are in the tree. Running them is Stage 7.

## Tasks completed

T01, T02, T03, T04, T05, T06, T07, T08, T09, T10.

## How to run

From the repo root:

```text
python -m flask --app wsgi:app run --port 5000
```

Open `http://127.0.0.1:5000/baseline`. HarborStay remains at `http://127.0.0.1:5000/results`.

Tests:

```text
python -m pytest tests/test_baseline.py tests/test_baseline_routes.py tests/test_routes.py
```

Stage 7:

```text
playwright install chromium
pytest tests/e2e/test_baseline_e2e.py tests/e2e/test_booking_e2e.py -q
```

## Acceptance criteria

- The five regions and the screenshot route come from the committed markdown and PNG.
- Missing evidence was checked with a temp `BASELINE_DIR`: HTTP 200, `baseline-evidence-missing`, and no Titan City House or Book my stay text.
- Gaps include P0, P1, and P2 rows. Journey includes `Not Found` steps.
- Questions keep owner “Product owner” and due “Before Stage 2 approval”.
- No secrets were added. The app does not read `api-conf.properties`.

## Verification

`python -m pytest tests/test_baseline.py tests/test_baseline_routes.py tests/test_routes.py` — 19 passed, 1 skipped. The skipped test is the real symlink escape: this Windows host would not create the link. A direct outside-path check and a loader test that forces the escape branch both passed.

A live Werkzeug server on `127.0.0.1` returned `/baseline` (five regions, Titan City House, Book my stay, P0, Not Found), `/baseline/evidence` as `image/png`, and `/results` with `results-map` and `baseline-nav`.

Playwright MCP was not available in this session, and the Chromium binary was not installed, so the browser click-through was not run. That remains T11.

## Open Questions / Blockers

- T11 is blocked until Stage 7.
- Property-card blurbs were transcribed from the screenshot. Please confirm Titan City House, Titan Shoreline, and Titan Alpine Lodge wording on `/baseline` against the PNG.
- GitHub pull-request creation may return 403 again.
- `gh` is not installed.

## PR

pending — `gh` is not installed, and GitHub `POST /repos/Vinayqa24/CapstoneSDLCCursor/pulls` returned **403**. The branch is on the remote. Open:

https://github.com/Vinayqa24/CapstoneSDLCCursor/compare/sdlc/stage-4-scrum-31-impl-plan...sdlc/stage-5-scrum-31-implementation?expand=1

Base is `sdlc/stage-4-scrum-31-impl-plan` so the diff is this stage only. Grant the token **Pull requests: write** to create the PR from here.

## Ready for Human Approval

Yes. Review `/baseline` and the loader tests before Stage 6 Code Review. Reply **approved** / **proceed to code review**, or list changes.
