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


def test_markdown_cell_is_escaped(tmp_path):
    evidence = tmp_path / "evidence"
    evidence.mkdir()
    (evidence / "image-20261103-075923.png").write_bytes(b"\x89PNG\r\n\x1a\n")
    tables = {
        "inventory.md": (
            "| Feature | Screen | Section | Control | Evidence |\n"
            "| --- | --- | --- | --- | --- |\n"
            "| Brand | Home | Header | <script>alert(1)</script> | Mark |\n"
        ),
        "journey.md": (
            "| Step | Evidenced | Transition | Required inputs |\n"
            "| --- | --- | --- | --- |\n"
            "| search | Not Found | Not Found | Not Found |\n"
        ),
        "validations.md": (
            "| Step | Field | Visible placeholder | Format | Failure state |\n"
            "| --- | --- | --- | --- | --- |\n"
            "| guest details | Email | you@example.com | Not Found | Not Found |\n"
        ),
        "gaps.md": (
            "| ID | Priority | Gap | Rationale |\n"
            "| --- | --- | --- | --- |\n"
            "| G1 | P0 | No confirmation | Booking integrity |\n"
        ),
        "questions.md": (
            "| ID | Question | Assumption | Owner | Due |\n"
            "| --- | --- | --- | --- | --- |\n"
            "| Q1 | Screens? | Not Found | Product owner | Before Stage 2 approval |\n"
        ),
    }
    for name, body in tables.items():
        (tmp_path / name).write_text(body, encoding="utf-8")
    app = create_app()
    app.config["BASELINE_DIR"] = str(tmp_path)
    body = app.test_client().get("/baseline").get_data(as_text=True)
    assert "<script>" not in body
    assert "&lt;script&gt;alert(1)&lt;/script&gt;" in body


def test_harborstay_routes_still_ok():
    client = create_app().test_client()
    results = client.get("/results")
    assert results.status_code == 200
    assert b"results-map" in results.data
    assert b'baseline-nav' in results.data
    assert client.get("/book/hotel-01/room").status_code == 200
