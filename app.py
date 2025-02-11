from flask import Flask
from backend.config import LocalConfig
from backend.model import db, Users, Roles
from flask_security import Security, SQLAlchemyUserDatastore, auth_required


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

    datastore = SQLAlchemyUserDatastore(db, Users, Roles)
    app.security = Security(app, datastore=datastore, register_blueprint=False)

    app.app_context().push()

    return app


app = createApp()

import backend.initial_data
from backend.routes import *
from backend.prof import *


if __name__ == "__main__":
    app.run()
