from flask import (
    current_app as app,
    request,
    jsonify,
    render_template,
    send_from_directory,
    send_file,
)
from flask_security import auth_required, verify_password, hash_password, login_user
from .model import db, Professional, Roles
from backend.useful_fun import *
import uuid
from backend.celery.tasks import create_csv
from celery.result import AsyncResult

datastore = app.security.datastore


@app.route("/", methods=["GET"])
def homepage():
    return render_template("index.html")


@app.get("/create-closed-service-request-csv")
def createCsv():
    task = create_csv.delay()
    return {"task_id": task.id}, 200


@app.get("/get-csv/<id>")
def getCsv(id):
    result = AsyncResult(id)

    if result.ready():
        return send_file(f"./backend/celery/csv_files/{result.result}"), 200
    else:
        return {"result": "task not ready"}, 405


@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = datastore.find_user(email=email)
    if not user:
        return jsonify({"error": "User not found"}), 404

    if verify_password(password, user.password):

        if not user.active:
            return jsonify({"error": "Your account is banned or inactive."}), 403

        login_user(user)

        return jsonify(
            {
                "token": user.get_auth_token(),
                "email": user.email,
                "role": user.roles[0].name,
                "id": user.id,
            }
        )

    return jsonify({"error": "Invalid password"}), 401


@app.route("/register", methods=["POST"])
def register():
    data = request.form
    email = data.get("email")
    password = data.get("password")
    name = data.get("name")
    role = data.get("role")
    phone = data.get("phone")
    address = data.get("address")
    pincode = data.get("pincode")
    service_id = data.get("service_id")
    exp = data.get("experience")
    file = request.files.get("file")
    file_path = file_url(file, name)

    if not email or not password or not role:
        return jsonify({"error": "Email, password and role are required"}), 400
    if datastore.find_user(email=email):
        return jsonify({"error": "User already exists"}), 400
    try:
        if role == "customer":
            user = datastore.create_user(
                email=email,
                password=hash_password(password),
                roles=[role],
                name=name,
                phone=phone,
                address=address,
                pincode=pincode,
            )
        else:
            prof = Professional(
                email=email,
                password=hash_password(password),
                name=name,
                phone=phone,
                address=address,
                pincode=pincode,
                fs_uniquifier=uuid.uuid4().hex,
                service_id=int(service_id),
                file_path=file_path,
                experience=exp,
                active=0,
            )
            prof_role = Roles.query.filter_by(name="professional").first()
            prof.roles.append(prof_role)
            db.session.add(prof)

        db.session.commit()
        return jsonify({"message": "user created successfully"}), 201
    except:
        db.session.rollback()
        return jsonify({"message": "user creation failed"}), 500
