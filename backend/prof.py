from sqlalchemy import desc, func
from backend.model import Service, ServiceRequest, db, Users, Professional, Roles
from flask_security import auth_required, current_user, roles_required, roles_accepted
from flask_restful import Resource, marshal_with, fields, Api
from flask import jsonify, request, Blueprint, make_response, send_from_directory,current_app as app
from backend.useful_fun import formatTime, os, reject_sr
from backend.service_request import ServiceRequestsAPI

cache = app.cache
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
    "status": fields.String,
    "file_path": fields.String,
    "file_name": fields.String,
    "date_created": fields.String,
}


class ProfsAPI(Resource):

    @auth_required("token")
    @roles_accepted("admin", "customer")
    @marshal_with(prof_fields)
    @cache.cached(timeout=60,key_prefix = 'prof_all_data')
    def get(self):

        if current_user.roles[0].name == "customer":
            profs = Professional.query.filter(Professional.active == True).all()
        else:
            profs = Professional.query.all()
        professionals = []
        for prof in profs:
            professional = {
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
                "status": prof.status,
                "file_path": prof.file_path,
                "file_name": os.path.basename(prof.file_path),
                "date_created": formatTime(prof.date_created),
            }

            professionals.append(professional)
        return professionals


class ProfAPI(Resource):

    @auth_required("token")
    @roles_accepted("admin", "professional")
    @marshal_with(prof_fields)
    @cache.memoize(timeout=60)
    def get(self, id):
        prof = Professional.query.get(id)
        if not prof:
            return {"message": "Not Found"}, 404

        professional = {
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
            "file_name": os.path.basename(prof.file_path),
            "date_created": formatTime(prof.date_created),
        }

        return professional

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
                cache.delete('prof_all_data')
                cache.delete_memoized(ProfAPI.get, id)
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
            db.session.commit()
            cache.delete('prof_all_data')
            cache.delete('sr_all_data')
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
            prof.status = data.get("status")
            if prof.status == 'blocked':
                reject_sr(id, 'professional')
            db.session.commit()
            cache.delete('prof_all_data')
            cache.delete('sr_all_data')
            return make_response(
                jsonify({"message": f"{prof.name} is {prof.status}"}), 200
            )
        except:
            db.session.rollback()
            return make_response(jsonify({"mesaage": "something went wrong"}), 500)


api.add_resource(
    professionalFile, "/verification/<filename>", "/professionals/status/<int:id>"
)


class ProfessionalService(Resource):

    @auth_required("token")
    @roles_accepted("customer")
    @cache.memoize(timeout=5)
    def get(self, id):
        profs = (
            db.session.query(Professional)
            .join(ServiceRequest, ServiceRequest.professional_id == Professional.id, isouter=True)  
            .filter(Professional.service_id == id, Professional.active == True) 
            .group_by(Professional.id)  
            .order_by(func.coalesce(func.avg(ServiceRequest.rating), 0).desc()) 
            .all()  
        )

        if not profs:
            return {"message": "Not Found"}, 404
        professionals = []
        for prof in profs:
            professionals.append(
                {
                    "id": prof.id,
                    "name": prof.name,
                    "email": prof.email,
                    "phone": prof.phone,
                    "address": prof.address,
                    "pincode": prof.pincode,
                    "service_id": prof.service_id,
                    "service_name": prof.service.name,
                    "rating": prof.total_rating(),
                }
            )
        return professionals


api.add_resource(ProfessionalService, "/professionals/service/<int:id>")


class ProfessionalSearch(Resource):

    @auth_required("token")
    @roles_accepted("customer")
    def get(self, query):
        name = (
            Professional.query.join(Service)
            .filter(Service.name.ilike(f"%{query}%"), Professional.active == True)
            .all()
        )

        pincode = Professional.query.filter(
            Professional.pincode.ilike(f"%{query}%"), Professional.active == True
        ).all()

        address = Professional.query.filter(
            Professional.address.ilike(f"%{query}%"), Professional.active == True
        ).all()

        all_professional = set(name + pincode + address)

        if not all_professional:
            return {"message": "Not Found"}, 404
        professionals = []
        for prof in all_professional:
            professionals.append(
                {
                    "id": prof.id,
                    "name": prof.name,
                    "email": prof.email,
                    "phone": prof.phone,
                    "address": prof.address,
                    "pincode": prof.pincode,
                    "service_id": prof.service_id,
                    "service_name": prof.service.name,
                    "rating": prof.total_rating(),
                }
            )
        return professionals


api.add_resource(ProfessionalSearch, "/professionals/search/<string:query>")
