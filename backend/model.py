from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from flask_security import UserMixin, RoleMixin
from sqlalchemy import func

db = SQLAlchemy()


class Users(db.Model, UserMixin):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, unique=True, nullable=False)
    name = db.Column(db.String, nullable=False)
    password = db.Column(db.String, nullable=False)

    # customer or professional related field
    phone = db.Column(db.Integer, nullable=True)
    address = db.Column(db.Text, nullable=True)
    pincode = db.Column(db.Integer, nullable=True)

    # flask sequrity related field
    fs_uniquifier = db.Column(db.String, unique=True, nullable=False)
    active = db.Column(db.Boolean, default=True)
    roles = db.relationship("Roles", backref="users", secondary="user_roles")
    service_requests = db.relationship(
        "ServiceRequest", backref="user", lazy=True, cascade="all, delete-orphan"
    )

    # JTI
    user_type = db.Column(
        db.String(50), nullable=False
    )  # This is the discriminator column

    __mapper_args__ = {
        "polymorphic_identity": "user",  # For regular users
        "polymorphic_on": "user_type",  # Discriminator column
    }


class Professional(Users):
    __tablename__ = "professional"
    id = db.Column(db.Integer, db.ForeignKey("users.id"), primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey("service.id"), nullable=False)
    date_created = db.Column(db.DateTime, default=datetime.now, nullable=False)
    experience = db.Column(db.Integer, nullable=False)
    file_path = db.Column(db.String, nullable=True)
    service_requests = db.relationship(
        "ServiceRequest",
        backref="professional",
        lazy=True,
        cascade="all, delete-orphan",
    )

    __mapper_args__ = {
        "polymorphic_identity": "professional",  # For professional users
    }

    def total_rating(self):
        total = (
            db.session.query(func.sum(ServiceRequest.rating))
            .filter(ServiceRequest.professional_id == self.id)
            .scalar()
        )
        return total if total is not None else 0


class Roles(db.Model, RoleMixin):
    __tablename__ = "roles"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    description = db.Column(db.String, nullable=False)


class UserRoles(db.Model):
    __tablename__ = "user_roles"
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    role_id = db.Column(db.Integer, db.ForeignKey("roles.id"))


class Service(db.Model):
    __tablename__ = "service"
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False, unique=True)
    price = db.Column(db.Integer, nullable=False)
    time_required = db.Column(db.Integer, nullable=False)
    description = db.Column(db.Text, nullable=True)
    service_requests = db.relationship(
        "ServiceRequest", backref="service", lazy=True, cascade="all, delete-orphan"
    )
    professional = db.relationship(
        "Professional", backref="service", lazy=True, cascade="all, delete-orphan"
    )


class ServiceRequest(db.Model):
    __tablename__ = "service_request"
    id = db.Column(db.Integer, primary_key=True)
    service_id = db.Column(db.Integer, db.ForeignKey("service.id"), nullable=False)
    customer_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    professional_id = db.Column(
        db.Integer, db.ForeignKey("professional.id"), nullable=True
    )
    date_of_request = db.Column(db.DateTime, default=datetime.now, nullable=False)
    date_of_completion = db.Column(db.DateTime, nullable=True)
    service_status = db.Column(db.String, nullable=False, default="requested")
    remarks = db.Column(db.Text, nullable=True)
    rating = db.Column(db.Integer, nullable=True)
