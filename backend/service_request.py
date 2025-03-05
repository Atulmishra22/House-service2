from backend.model import db, ServiceRequest
from flask_security import auth_required, current_user, roles_required, roles_accepted
from flask_restful import Resource, marshal_with, fields, Api
from flask import jsonify, request, Blueprint, make_response

service_request_api_bp = Blueprint("service_request_api", __name__, url_prefix="/api")
api = Api(service_request_api_bp)


ser_req_fields = {
    "id": fields.Integer,
    "service_id": fields.Integer,
    "service_name": fields.String,
    "customer_id": fields.Integer,
    "customer_name": fields.String,
    "professional_id": fields.Integer,
    "professional_name": fields.String,
    "date_of_request": fields.DateTime,
    "date_of_completion": fields.DateTime,
    "service_status": fields.String,
    "remarks": fields.String,
    "rating": fields.Integer,
}


class ServiceRequestsAPI(Resource):

    @marshal_with(ser_req_fields)
    @auth_required("token")
    @roles_required("admin")
    def get(self):
        ser_reqs = ServiceRequest.query.all()
        service_requests = []
        for ser_req in ser_reqs:
            service_requests.append(
                {
                    "id": ser_req.id,
                    "service_id": ser_req.service_id,
                    "service_name": ser_req.service.name,
                    "customer_id": ser_req.customer_id,
                    "customer_name": ser_req.user.name,
                    "professional_id": ser_req.professional_id,
                    "professional_name": ser_req.professional.name,
                    "date_of_request": ser_req.date_of_request,
                    "date_of_completion": ser_req.date_of_completion,
                    "service_status": ser_req.service_status,
                    "remarks": ser_req.remarks,
                    "rating": ser_req.rating,
                }
            )
        return service_requests

    @auth_required("token")
    @roles_required("customer")
    def post(self):
        data = request.get_json()
        try:
            ser_id = data.get("ser_id")
            professional_id = data.get("prof_id")
            customer_id = data.get("customer_id")
            request_date = data.get("request_date")
            completion_date = data.get("completion_date")
            ser_req = ServiceRequest(
                service_id=ser_id,
                customer_id=customer_id,
                professional_id=professional_id,
                date_of_request=request_date,
                date_of_completion=completion_date,
            )
            db.session.add(ser_req)
            db.session.commit()
            return make_response(jsonify({"message": "Created Sucessfully"}), 200)

        except:
            db.session.rollback()
            return make_response(jsonify({"message": "Something went wrong"}), 500)


class ServiceRequestAPI(Resource):

    @marshal_with(ser_req_fields)
    @auth_required("token")
    @roles_accepted("admin", "professional", "customer")
    def get(self, id):
        ser_req = ServiceRequest.query.get(id)
        if not ser_req:
            return {"message": "Not Found"}, 404
        return ser_req

    @auth_required("token")
    @roles_accepted("professional", "customer")
    def put(self, id):
        ser_req = ServiceRequest.query.get(id)
        if not ser_req:
            return {"message": "Not Found"}, 404
        data = request.get_json()
        if current_user.id == ser_req.customer_id or ser_req.professional_id:
            try:
                ser_req.date_of_request = data.get("request_date")
                ser_req.date_of_completion = data.get("completion_date")
                ser_req.service_status = data.get("service_status")
                ser_req.remarks = data.get("remarks")
                ser_req.rating = data.get("rating")

                db.session.commit()
                return make_response(jsonify({"message": "updated Sucessfully"}), 200)
            except:
                db.session.rollback()
                return make_response(jsonify({"message": "Updation Unsucessfull"}), 500)
        else:
            return make_response(jsonify({"message": "Not Authorised"}))

    @auth_required("token")
    @roles_accepted("customer")
    def delete(self, id):
        ser_req = ServiceRequest.query.get(id)
        if not ser_req:
            return {"message": "Not Found"}, 404
        try:
            db.session.delete(ser_req)
            return make_response(jsonify({"message": "Deleted Sucessfully"}), 200)
        except:
            db.session.rollback()
            return make_response(jsonify({"message": "Deletion Unsucessfull"}), 500)


api.add_resource(ServiceRequestAPI, "/service_requests/<int:id>")
api.add_resource(ServiceRequestsAPI, "/service_requests")
