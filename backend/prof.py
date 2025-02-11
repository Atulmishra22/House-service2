from backend.model import db, Users, Professional, Roles
from uuid import uuid4
from flask_security import hash_password

def create_professional():
    if not Professional.query.filter_by(email="prof@mail.com").first():

        prof1 = Professional(email="prof@mail.com",name="prof1",password=hash_password("pass"),experience= 3, fs_uniquifier=uuid4().hex)
        db.session.add(prof1)
        role = Roles.query.filter_by(name="professional").first()
        prof1.roles.append(role)
        db.session.commit()

    
create_professional()

