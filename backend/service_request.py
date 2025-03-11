from backend.model import db, ServiceRequest, Professional
from flask_security import auth_required, current_user, roles_required, roles_accepted
from flask_restful import Resource, marshal_with, fields, Api
from flask import jsonify, request, Blueprint, make_response
from datetime import datetime

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
    "date_of_request": fields.String,
    "date_of_completion": fields.String,
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
            req = {
                "id": ser_req.id,
                "service_id": ser_req.service_id,
                "service_name": ser_req.service.name,
                "customer_id": ser_req.customer_id,
                "customer_name": ser_req.user.name,
                "professional_id": ser_req.professional_id,
                "date_of_request": ser_req.date_of_request.strftime("%Y-%m-%dT%H:%M"),
                "date_of_completion": ser_req.date_of_completion.strftime(
                    "%Y-%m-%dT%H:%M"
                ),
                "service_status": ser_req.service_status,
                "remarks": ser_req.remarks,
                "rating": ser_req.rating,
            }
            if ser_req.professional_id:
                req["professional_name"] = ser_req.professional.name

            service_requests.append(req)
        return service_requests

    @auth_required("token")
    @roles_required("customer")
    def post(self):
        data = request.get_json()
        try:
            ser_id = data.get("service_id")
            professional_id = data.get("professional_id")
            customer_id = data.get("customer_id")
            request_date = data.get("date_of_request")
            completion_date = data.get("date_of_completion")
            remarks = data.get("remarks")
            ser_req = ServiceRequest(
                service_id=ser_id,
                customer_id=customer_id,
                professional_id=professional_id,
                date_of_request=datetime.strptime(request_date, "%Y-%m-%dT%H:%M"),
                date_of_completion=datetime.strptime(completion_date, "%Y-%m-%dT%H:%M"),
                remarks=remarks,
            )
            db.session.add(ser_req)
            db.session.commit()
            return make_response(jsonify({"message": "Created Sucessfully"}), 200)

        except Exception as e:
            print(e)
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
        req = {
            "id": ser_req.id,
            "service_id": ser_req.service_id,
            "service_name": ser_req.service.name,
            "customer_id": ser_req.customer_id,
            "customer_name": ser_req.user.name,
            "professional_id": ser_req.professional_id,
            "date_of_request": ser_req.date_of_request.strftime("%Y-%m-%dT%H:%M"),
            "date_of_completion": ser_req.date_of_completion.strftime("%Y-%m-%dT%H:%M"),
            "service_status": ser_req.service_status,
            "remarks": ser_req.remarks,
            "rating": ser_req.rating,
        }
        if ser_req.professional_id:
            req["professional_name"] = ser_req.professional.name

        return req

    @auth_required("token")
    @roles_accepted("professional", "customer")
    def put(self, id):
        ser_req = ServiceRequest.query.get(id)
        if not ser_req:
            return {"message": "Not Found"}, 404
        data = request.get_json()
        try:
            if data.get("service_status") and data.get("rating"):
                ser_req.service_status = data.get("service_status")
                ser_req.rating = data.get("rating")
            elif data.get("service_status") and data.get("professional_id"):
                ser_req.service_status = data.get("service_status")
                ser_req.professional_id = data.get("professional_id")
            elif data.get("service_status"):
                ser_req.service_status = data.get("service_status")

            else:
                ser_req.remarks = data.get("remarks")
                request_date = data.get("date_of_request")
                ser_req.date_of_request = datetime.strptime(
                    request_date, "%Y-%m-%dT%H:%M"
                )
                completion_date = data.get("date_of_completion")
                ser_req.date_of_completion = datetime.strptime(
                    completion_date, "%Y-%m-%dT%H:%M"
                )

            db.session.commit()
            return make_response(jsonify({"message": "updated Sucessfully"}), 200)
        except:
            db.session.rollback()
            return make_response(jsonify({"message": "Updation Unsucessfull"}), 500)

    @auth_required("token")
    @roles_accepted("customer", "professional")
    def delete(self, id):
        ser_req = ServiceRequest.query.get(id)
        if not ser_req:
            return {"message": "Not Found"}, 404
        try:
            db.session.delete(ser_req)
            db.session.commit()
            return make_response(jsonify({"message": "Deleted Sucessfully"}), 200)
        except:
            db.session.rollback()
            return make_response(jsonify({"message": "Deletion Unsucessfull"}), 500)


api.add_resource(ServiceRequestAPI, "/service_requests/<int:id>")
api.add_resource(ServiceRequestsAPI, "/service_requests")


class CustomerRequest(Resource):

    @auth_required("token")
    @roles_accepted("customer")
    @marshal_with(ser_req_fields)
    def get(self, id):
        reqs = ServiceRequest.query.filter_by(customer_id=id)
        cust_reqs = []
        for ser_req in reqs:
            req = {
                "id": ser_req.id,
                "service_id": ser_req.service_id,
                "service_name": ser_req.service.name,
                "customer_id": ser_req.customer_id,
                "customer_name": ser_req.user.name,
                "professional_id": ser_req.professional_id,
                "date_of_request": ser_req.date_of_request.strftime("%Y-%m-%dT%H:%M"),
                "date_of_completion": ser_req.date_of_completion.strftime(
                    "%Y-%m-%dT%H:%M"
                ),
                "service_status": ser_req.service_status,
                "remarks": ser_req.remarks,
                "rating": ser_req.rating,
            }
            if ser_req.professional_id:
                req["professional_name"] = ser_req.professional.name
            cust_reqs.append(req)
        return cust_reqs


api.add_resource(CustomerRequest, "/service_requests/customer/<int:id>")


class ProfessionalRequest(Resource):

    @auth_required("token")
    @roles_accepted("professional")
    @marshal_with(ser_req_fields)
    def get(self, professional_id):
        requests_professional = ServiceRequest.query.filter(
            ServiceRequest.professional_id == professional_id
        ).all()
        requests_not_professional = ServiceRequest.query.filter(
            ServiceRequest.service_id == current_user.service_id,
            ServiceRequest.professional_id == None,
        ).all()

        all_request = requests_not_professional + requests_professional

        cust_reqs = []
        for ser_req in all_request:
            req = {
                "id": ser_req.id,
                "service_id": ser_req.service_id,
                "service_name": ser_req.service.name,
                "customer_id": ser_req.customer_id,
                "customer_name": ser_req.user.name,
                "professional_id": ser_req.professional_id,
                "date_of_request": ser_req.date_of_request.strftime("%Y-%m-%dT%H:%M"),
                "date_of_completion": ser_req.date_of_completion.strftime(
                    "%Y-%m-%dT%H:%M"
                ),
                "service_status": ser_req.service_status,
                "remarks": ser_req.remarks,
                "rating": ser_req.rating,
            }
            if ser_req.professional_id:
                req["professional_name"] = ser_req.professional.name
            cust_reqs.append(req)
        return cust_reqs


api.add_resource(
    ProfessionalRequest, "/service_requests/professional/<int:professional_id>"
)
