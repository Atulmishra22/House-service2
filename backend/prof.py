from backend.model import db, Users, Professional, Roles
from flask_security import auth_required, current_user, roles_required, roles_accepted
from flask_restful import Resource, marshal_with, fields, Api
from flask import jsonify, request, Blueprint, make_response, send_from_directory
from backend.useful_fun import formatTime, os

prof_api_bp = Blueprint("prof_api", __name__, url_prefix="/api")
api = Api(prof_api_bp)


prof_fields = {
    "id": fields.Integer,
    "email": fields.String,
    "name": fields.String,
    "phone": fields.Integer,
    "active": fields.Boolean,
    "address": fields.String,
    "pincode": fields.Integer,
    "service_id": fields.Integer,
    "service_name": fields.String,
    "experience": fields.Integer,
    "file_path": fields.String,
    "file_name": fields.String,
    "date_created": fields.String,
}


class ProfsAPI(Resource):

    @marshal_with(prof_fields)
    @auth_required("token")
    @roles_required("admin")
    def get(self):
        profs = Professional.query.all()
        professionals = []
        for prof in profs:
            professionals.append(
                {
                    "id": prof.id,
                    "name": prof.name,
                    "email": prof.email,
                    "phone": prof.phone,
                    "active": prof.active,
                    "address": prof.address,
                    "pincode": prof.pincode,
                    "service_id": prof.service_id,
                    "service_name": prof.service.name,
                    "experience": prof.experience,
                    "file_path": prof.file_path,
                    "file_name": os.path.basename(prof.file_path),
                    "date_created": formatTime(prof.date_created),
                }
            )
        return professionals


class ProfAPI(Resource):

    @marshal_with(prof_fields)
    @auth_required("token")
    @roles_accepted("admin", "professional")
    def get(self, id):
        prof = Professional.query.get(id)
        if not prof:
            return {"message": "Not Found"}, 404
        return prof

    @auth_required("token")
    @roles_required("professional")
    def put(self, id):
        prof = Professional.query.get(id)
        if not prof:
            return {"message": "Not Found"}, 404
        data = request.get_json()

        if prof.id == current_user.id:
            try:
                prof.email = data.get("email")
                prof.name = data.get("name")
                prof.phone = data.get("phone")
                prof.address = data.get("address")
                prof.experience = data.get("experience")
                prof.pincode = data.get("pincode")

                db.session.commit()
                return make_response(jsonify({"message": "updated Sucessfully"}), 200)
            except:
                db.session.rollback()
                return make_response(jsonify({"message": "Updation Unsucessfull"}), 500)
        else:
            return make_response(jsonify({"message": "Not Authorised"}), 401)

    @auth_required("token")
    @roles_accepted("admin", "professional")
    def delete(self, id):
        prof = Professional.query.get(id)
        if not prof:
            return {"message": "Not Found"}, 404
        try:
            db.session.delete(prof)
            return make_response(jsonify({"message": "Deleted Sucessfully"}), 200)
        except:
            db.session.rollback()
            return make_response(jsonify({"message": "Deletion Unsucessfull"}), 500)


api.add_resource(ProfAPI, "/professionals/<int:id>")
api.add_resource(ProfsAPI, "/professionals")


class professionalFile(Resource):

    @auth_required("token")
    @roles_accepted("admin")
    def get(self, filename):
        try:
            return send_from_directory("professional_verification", filename)
        except FileNotFoundError:
            return "File not found", 404

    @auth_required("token")
    @roles_accepted("admin")
    def put(self, id):
        prof = Professional.query.get(id)
        if not prof:
            return {"message": "Not Found"}, 404
        data = request.get_json()
        try:
            prof.active = data.get("active")
            db.session.commit()
            return make_response(jsonify({"message": f"{prof.name} is banned"}), 200)
        except:
            db.session.rollback()
            return make_response(jsonify({"mesaage": "something went wrong"}), 500)


api.add_resource(
    professionalFile, "/verification/<filename>", "/professionals/status/<int:id>"
)
