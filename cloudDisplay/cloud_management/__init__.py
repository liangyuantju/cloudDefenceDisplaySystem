import os

from flask import Flask, render_template

def create_app(test_config=None):
    # create and configure the app
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY = 'dev',
    )

    from . import login
    app.register_blueprint(login.bp)

    from . import display
    app.register_blueprint(display.bp)
    
    return app