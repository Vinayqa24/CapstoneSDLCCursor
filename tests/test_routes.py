from app import create_app


def test_app_factory():
    app = create_app()
    assert app.name == "app"


def test_core_routes_ok():
    client = create_app().test_client()
    paths = [
        "/",
        "/results",
        "/hotels/hotel-01",
        "/hotels/unknown-hotel",
        "/book/hotel-01/room",
        "/book/hotel-01/guest",
        "/book/hotel-01/payment",
        "/confirmation",
    ]
    for path in paths:
        res = client.get(path)
        assert res.status_code == 200, path


def test_unknown_hotel_page_has_not_found_hook():
    res = create_app().test_client().get("/hotels/not-a-hotel")
    assert res.status_code == 200
    assert b"hotel-missing" in res.data


def test_results_includes_map_hooks():
    res = create_app().test_client().get("/results")
    assert res.status_code == 200
    for hook in (b"results-map", b"map-empty", b"map-no-coords", b"map-fallback"):
        assert hook in res.data


def test_leaflet_vendor_served():
    client = create_app().test_client()
    js = client.get("/static/vendor/leaflet/leaflet.js")
    css = client.get("/static/vendor/leaflet/leaflet.css")
    lic = client.get("/static/vendor/leaflet/LICENSE")
    assert js.status_code == 200
    assert css.status_code == 200
    assert lic.status_code == 200
    assert b"Leaflet" in js.data or js.data.startswith(b"!")
