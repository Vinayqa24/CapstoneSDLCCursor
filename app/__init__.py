import os
from pathlib import Path

from flask import Flask

from app.baseline import default_baseline_dir


def create_app():
    app = Flask(__name__)
    override = os.environ.get("BASELINE_DIR")
    if override:
        app.config["BASELINE_DIR"] = str(Path(override))
    else:
        app.config["BASELINE_DIR"] = str(default_baseline_dir())
    from app.routes import register_routes

    register_routes(app)
    return app
