from flask import Flask
from .config import Config

def create_app(config_class=Config):
    """Application factory pattern"""
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    init_extensions(app)

    # Register blueprints
    register_blueprints(app)

    return app

def init_extensions(app):
    """Initialize Flask extensions"""
    # Example for future database extension:
    # from .extensions import db
    # db.init_app(app)
    pass

def register_blueprints(app):
    """Register all blueprints"""
    from .routes.main import bp as main_bp
    from .routes.api import bp as api_bp
    from .routes.auth import bp as auth_bp

    app.register_blueprint(main_bp)
    app.register_blueprint(api_bp, url_prefix='/api')
    app.register_blueprint(auth_bp, url_prefix='/auth')