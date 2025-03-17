from flask import (
    current_app as app,
    make_response,
    request,
    jsonify,
    render_template,
    send_from_directory,
    send_file,
)
from flask_security import (
    auth_required,
    verify_password,
    hash_password,
    login_user,
    roles_accepted,
    current_user,
)
from sqlalchemy import case, func
from .model import ServiceRequest, Users, db, Professional, Roles
from backend.useful_fun import *
import uuid
from backend.celery.tasks import create_csv
from celery.result import AsyncResult

datastore = app.security.datastore


@app.route("/", methods=["GET"])
def homepage():
    return render_template("index.html")


@auth_required("token")
@app.get("/create-closed-service-request-csv")
def createCsv():
    task = create_csv.delay()
    return {"task_id": task.id}, 200


@auth_required("token")
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


@app.get("/api/user/<int:id>/service-request/stats")
@auth_required("token")
@roles_accepted("professional", "customer")
def Userstats(id):
    user = Users.query.get(id)
    if not user:
        return jsonify({"message": "user not found"}), 404
    if user.roles[0].name == "admin":
        return jsonify({"message": "Admin doesnt have requesr"}), 404
    try:

        if user.roles[0].name == "professional":
            stats = (
                db.session.query(
                    ServiceRequest.service_status,
                    func.count(ServiceRequest.id).label("count"),
                )
                .filter(ServiceRequest.professional_id == id)
                .group_by(ServiceRequest.service_status)
                .all()
            )

        elif user.roles[0].name == "customer":
            stats = (
                db.session.query(
                    ServiceRequest.service_status,
                    func.count(ServiceRequest.id).label("count"),
                )
                .filter(ServiceRequest.customer_id == id)
                .group_by(ServiceRequest.service_status)
                .all()
            )

        result = {
            "requested": 0,
            "accepted": 0,
            "rejected": 0,
            "canceled": 0,
            "closed": 0,
            "total": 0,
        }
        for status, count in stats:
            if status in result:
                result[status] = count
                result["total"] += count
        if user.roles[0].name == "professional":
            result["professional_id"] = user.id
            result["rating"] = user.total_rating()
        else:
            result["customer_id"] = user.id

        return result, 200
    except Exception as e:
        print(e)
        db.session.rollback()
        return jsonify({"message": "something went wrong"}), 500


@app.get("/api/admin-summary")
@auth_required("token")
@roles_accepted("admin")
def admin_stats():

    if not current_user.roles[0].name == "admin":
        return jsonify({"message": "Unauthorized access"}), 403

    try:
        user_counts = db.session.query(
            func.count(Users.id).label("total_users"),
            func.count(
                case(
                    (Users.roles.any(Roles.name == "professional"), Users.id),
                    else_=None,
                )
            ).label("total_professionals"),
            func.count(
                case((Users.roles.any(Roles.name == "customer"), Users.id), else_=None)
            ).label("total_customers"),
        ).first()
        service_request_stats = (
            db.session.query(
                ServiceRequest.service_status,
                func.count(ServiceRequest.id).label("count"),
            )
            .group_by(ServiceRequest.service_status)
            .all()
        )

        service_request_counts = {
            "requested": 0,
            "accepted": 0,
            "rejected": 0,
            "canceled": 0,
            "closed": 0,
            "total": 0,
        }
        for status, count in service_request_stats:
            if status in service_request_counts:
                service_request_counts[status] = count
                service_request_counts["total"] += count
        result = {
            "user_counts" : {
                "professionals": user_counts.total_professionals,
                "total_users": user_counts.total_users - 1,
                "customers": user_counts.total_customers,
                },
            "service_request_stats":service_request_counts,
        }
        return jsonify(result), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
