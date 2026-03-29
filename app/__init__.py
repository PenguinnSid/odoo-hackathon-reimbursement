from flask import Flask
from config import Config
from app.extensions import db, login_manager, migrate


def create_app():
    app = Flask(__name__, static_folder='static', template_folder='templates')
    app.config.from_object(Config)

    db.init_app(app)
    login_manager.init_app(app)
    migrate.init_app(app, db)

    from app.auth import auth_bp
    from app.expenses import expenses_bp
    from app.approvals import approvals_bp
    from app.admin import admin_bp

    app.register_blueprint(auth_bp, url_prefix='/auth')
    app.register_blueprint(expenses_bp, url_prefix='/expenses')
    app.register_blueprint(approvals_bp, url_prefix='/approvals')
    app.register_blueprint(admin_bp, url_prefix='/admin')

    @app.after_request
    def add_cors_headers(response):
        response.headers['Access-Control-Allow-Origin'] = '*'
        response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
        response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PATCH, PUT, DELETE, OPTIONS'
        return response

    @app.route('/health')
    def health():
        return {'ok': True}

    return app