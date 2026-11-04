from app import create_app


def test_missing_evidence_hides_regions(tmp_path):
    app = create_app()
    app.config["BASELINE_DIR"] = str(tmp_path)
    res = app.test_client().get("/baseline")
    assert res.status_code == 200
    body = res.get_data(as_text=True)
    assert 'data-testid="baseline-evidence-missing"' in body
    assert "Titan City House" not in body
    assert "Book my stay" not in body
    assert "baseline-inventory" not in body


def test_evidence_route_rejects_non_png(tmp_path):
    evidence = tmp_path / "evidence"
    evidence.mkdir()
    (evidence / "image-20261103-075923.png").write_bytes(b"hello")
    app = create_app()
    app.config["BASELINE_DIR"] = str(tmp_path)
    res = app.test_client().get("/baseline/evidence")
    assert res.status_code == 404
    assert res.mimetype == "text/plain"
    assert res.data == b"Not Found"


def test_populated_baseline_matches_markdown():
    client = create_app().test_client()
    page = client.get("/baseline")
    assert page.status_code == 200
    body = page.get_data(as_text=True)
    for hook in (
        "baseline-inventory",
        "baseline-journey",
        "baseline-validations",
        "baseline-gaps",
        "baseline-questions",
    ):
        assert f'data-testid="{hook}"' in body
    for heading in ("Inventory", "Journey", "Validations", "Gaps", "Questions"):
        assert f"<h2>{heading}</h2>" in body
    assert "Titan City House" in body
    assert "Book my stay" in body
    assert ">P0<" in body
    assert "Not Found" in body
    assert "baseline-evidence-missing" not in body
    shot = client.get("/baseline/evidence")
    assert shot.status_code == 200
    assert shot.mimetype == "image/png"
    assert shot.data.startswith(b"\x89PNG\r\n\x1a\n")


def test_harborstay_routes_still_ok():
    client = create_app().test_client()
    results = client.get("/results")
    assert results.status_code == 200
    assert b"results-map" in results.data
    assert b'baseline-nav' in results.data
    assert client.get("/book/hotel-01/room").status_code == 200
