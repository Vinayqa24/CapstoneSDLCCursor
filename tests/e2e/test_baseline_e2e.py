"""Playwright E2E for the SCRUM-31 baseline viewer. Run in Stage 7.

  playwright install chromium
  pytest tests/e2e/test_baseline_e2e.py -q
"""

import threading

import pytest
from werkzeug.serving import make_server

from app import create_app


def _serve(app):
    server = make_server("127.0.0.1", 0, app)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    return server


@pytest.fixture
def baseline_url():
    server = _serve(create_app())
    yield f"http://127.0.0.1:{server.server_port}"
    server.shutdown()


def test_baseline_regions(page, baseline_url):
    page.goto(baseline_url + "/baseline")
    for testid in (
        "baseline-inventory",
        "baseline-journey",
        "baseline-validations",
        "baseline-gaps",
        "baseline-questions",
    ):
        assert page.locator(f'[data-testid="{testid}"]').is_visible()
    for heading in ("Inventory", "Journey", "Validations", "Gaps", "Questions"):
        assert page.get_by_role("heading", name=heading).is_visible()
    assert "Titan City House" in page.locator('[data-testid="baseline-inventory"]').inner_text()
    assert "Book my stay" in page.locator('[data-testid="baseline-inventory"]').inner_text()
    assert "P0" in page.locator('[data-testid="baseline-gaps"]').inner_text()
    journey = page.locator('[data-testid="baseline-journey"]').inner_text()
    assert "search" in journey
    assert "Not Found" in journey
    page.locator('[data-testid="baseline-nav"]').click()
    page.wait_for_url("**/baseline")


def test_missing_evidence_message(page, tmp_path):
    app = create_app()
    app.config["BASELINE_DIR"] = str(tmp_path)
    server = _serve(app)
    try:
        page.goto(f"http://127.0.0.1:{server.server_port}/baseline")
        missing = page.locator('[data-testid="baseline-evidence-missing"]')
        missing.wait_for()
        assert missing.inner_text().strip() == "Not Found"
        body = page.locator("body").inner_text()
        assert "Titan City House" not in body
        assert "Book my stay" not in body
        assert page.locator('[data-testid="baseline-inventory"]').count() == 0
    finally:
        server.shutdown()
