"""Playwright E2E for SCRUM-5 map + booking. Run in Stage 7 with Flask up or this live_server fixture.

  playwright install chromium
  pytest tests/e2e/test_booking_e2e.py -q
"""

import threading

import pytest
from werkzeug.serving import make_server

from wsgi import app as flask_app


@pytest.fixture(scope="session")
def base_url():
    env = __import__("os").environ.get("PLAYWRIGHT_BASE_URL")
    if env:
        yield env.rstrip("/")
        return
    server = make_server("127.0.0.1", 0, flask_app)
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    yield f"http://127.0.0.1:{server.server_port}"
    server.shutdown()


@pytest.fixture(scope="session")
def browser_context_args(browser_context_args):
    return {**browser_context_args, "viewport": {"width": 1280, "height": 800}}


def test_marker_opens_details(page, base_url):
    page.route("**/*.tile.openstreetmap.org/**", lambda route: route.fulfill(status=204, body=b""))
    page.goto(base_url + "/results")
    marker = page.locator('[data-testid="map-marker"]').first
    marker.click()
    popup = page.locator('[data-testid="map-popup"]')
    popup.wait_for()
    assert popup.locator('[data-testid="map-view-details"]').count() == 1
    popup.locator('[data-testid="map-view-details"]').click()
    page.wait_for_url("**/hotels/**")
    assert page.locator('[data-testid="hotel-name"]').inner_text().strip() != ""


def test_marker_book_hydrates_room_step(page, base_url):
    page.route("**/*.tile.openstreetmap.org/**", lambda route: route.fulfill(status=204, body=b""))
    page.goto(base_url + "/results")
    page.locator('[data-testid="map-marker"]').first.click()
    page.locator('[data-testid="map-book"]').click()
    page.wait_for_url("**/book/**/room")
    assert page.locator('[data-testid="room-step"]').is_visible()
    assert page.locator('[data-testid="room-hotel"]').inner_text().strip() != ""


def test_empty_filter_shows_map_empty(page, base_url):
    page.route("**/*.tile.openstreetmap.org/**", lambda route: route.fulfill(status=204, body=b""))
    page.goto(base_url + "/results")
    page.locator('[data-testid="filter-q"]').fill("zzz-no-hotels")
    page.locator('[data-testid="map-empty"]').wait_for()
    assert page.locator('[data-testid="map-marker"]').count() == 0


def test_unknown_hotel_not_found(page, base_url):
    page.goto(base_url + "/hotels/not-a-hotel")
    page.locator('[data-testid="hotel-missing"]').wait_for()
    assert page.locator('[data-testid="hotel-details"]').is_hidden()


def test_guest_validation_error(page, base_url):
    page.route("**/*.tile.openstreetmap.org/**", lambda route: route.fulfill(status=204, body=b""))
    page.goto(base_url + "/results")
    page.locator('[data-testid="map-marker"]').first.click()
    page.locator('[data-testid="map-book"]').click()
    page.locator('[data-testid="room-continue"]').click()
    page.locator('[data-testid="guest-name"]').fill("A")
    page.locator('[data-testid="guest-email"]').fill("guest@example.com")
    page.locator('[data-testid="guest-continue"]').click()
    page.locator('[data-testid="guest-error"]').wait_for()


def test_offshore_area_shows_no_coords(page, base_url):
    page.route("**/*.tile.openstreetmap.org/**", lambda route: route.fulfill(status=204, body=b""))
    page.goto(base_url + "/results")
    page.locator('[data-testid="filter-area"]').select_option("Offshore")
    page.locator('[data-testid="map-no-coords"]').wait_for()
    assert page.locator('[data-testid="hotel-card"]').count() == 1
    assert page.locator('[data-testid="map-marker"]').count() == 0
