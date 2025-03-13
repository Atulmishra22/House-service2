from flask import Flask
from backend.config import LocalConfig
from backend.model import db, Users, Roles
from flask_security import Security, SQLAlchemyUserDatastore, auth_required
from backend.celery.celery_factory import celery_init_app
from flask_caching import Cache
import flask_excel as excel


def createApp():
    app = Flask(
        __name__,
        template_folder="frontend",
        static_folder="frontend",
        static_url_path="/static",
    )
    app.config.from_object(LocalConfig)
    # model init
    db.init_app(app)

    cache = Cache(app)

    datastore = SQLAlchemyUserDatastore(db, Users, Roles)
    app.security = Security(app, datastore=datastore, register_blueprint=False)
    app.cache = cache

    app.app_context().push()

    # api
    from backend.service import service_api_bp
    from backend.prof import prof_api_bp
    from backend.service_request import service_request_api_bp
    from backend.customer_users import customer_api_bp

    app.register_blueprint(service_api_bp)
    app.register_blueprint(prof_api_bp)
    app.register_blueprint(service_request_api_bp)
    app.register_blueprint(customer_api_bp)

    return app


app = createApp()

excel.init_excel(app)
celery_app = celery_init_app(app)

import backend.initial_data
from backend.routes import *


if __name__ == "__main__":
    app.run()
