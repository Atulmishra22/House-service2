from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_security import UserMixin, RoleMixin

db = SQLAlchemy()


class User(db.Model,UserMixin):
    __tablename__ = 'user'
    id = db.Column(db.Integer,primary_key= True)
    email = db.Column(db.String, unique = True, nullable = False)
    password = db.Column(db.String,nullable = False)

    fs_uniquifier = db.Column(db.String,unique = True, nullable = False)
    active = db.Column(db.Boolean, default = True)
    roles = db.relationship('Role',backref = 'users',secondary='user_roles')


class Role(db.Model,RoleMixin):
    __tablename__ = 'role'
    id = db.Column(db.Integer,primary_key= True)
    name = db.Column(db.String,unique=True,nullable=False)
    description = db.Column(db.String,nullable= False)

class UserRoles(db.Model):
    __tablename__ = 'user_roles'
    id = db.Column(db.Integer,primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer,db.ForeignKey('role.id'))