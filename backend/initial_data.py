from flask import current_app as app
from backend.model import db, Users, Professional,Roles
from flask_security import SQLAlchemyUserDatastore, hash_password

with app.app_context():

    db.create_all()

    userdatastore: SQLAlchemyUserDatastore = app.security.datastore
    userdatastore.find_or_create_role(name="admin", description="superuser")
    userdatastore.find_or_create_role(
        name="professional", description="professional user"
    )
    userdatastore.find_or_create_role(name="customer", description="customer user")

    if not userdatastore.find_user(email="admin@mail.com"):
        userdatastore.create_user(
            email="admin@mail.com", name="Admin", password=hash_password("pass"), roles=["admin"]
        )
    if not userdatastore.find_user(email="user@mail.com"):
        userdatastore.create_user(
            email="user@mail.com" , name="Customer", password=hash_password("pass"), roles=["customer"]
        )

    
    
    
    db.session.commit()
