from flask import current_app as app, request, jsonify, render_template
from flask_security import auth_required, verify_password, hash_password
from .model import db

datastore = app.security.datastore


@app.route("/", methods=["GET"])
def homepage():
    return render_template("index.html")


@app.get("/protected")
@auth_required("token")
def protected():
    return "Hello, authenticated user!"


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
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")
    # name = data.get('name')
    role = data.get("role")
    if not email or not password or not role:
        return jsonify({"error": "Email, password and role are required"}), 400
    if datastore.find_user(email=email):
        return jsonify({"error": "User already exists"}), 400
    try:
        user = datastore.create_user(
            email=email, password=hash_password(password), roles=[role], active=True
        )
        db.session.commit()
        return jsonify({"message": "user created successfully"}), 200
    except:
        db.session.rollback()
        return jsonify({"message": "user creation failed"}), 500
