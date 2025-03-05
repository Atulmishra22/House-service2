from backend.model import db, ServiceRequest
from flask_security import auth_required, current_user, roles_required
from flask_restful import Resource,marshal_with, fields,Api
from flask import jsonify , request, Blueprint

service_request_api_bp = Blueprint('service_request_api',__name__,url_prefix='/api')
api = Api(service_request_api_bp)


ser_req_fields={
    'id':fields.Integer,
    'service_id':fields.Integer,
    'customer_id':fields.Integer,
    'professional_id':fields.Integer,
    'date_of_request':fields.DateTime,
    'date_of_completion':fields.DateTime,
    'service_status' : fields.String,
    'remarks' : fields.String,
    'rating' : fields.Integer,

}

class ServiceRequestsAPI(Resource):

    @marshal_with(ser_req_fields)
    @auth_required('token')
    @roles_required('admin')
    def get(self):
        ser_reqs = ServiceRequest.query.all()
        return ser_reqs
    
    @auth_required('token')
    @roles_required('customer')
    def post(self):
        data = request.get_json()
        try:
            ser_id = data.get('ser_id')
            professional_id = data.get('prof_id')
            customer_id = data.get('customer_id')
            request_date = data.get('request_date')
            completion_date = data.get('completion_date')
            ser_req = ServiceRequest(service_id= ser_id,
                                    customer_id=customer_id,
                                    professional_id=professional_id,
                                    date_of_request=request_date,
                                    date_of_completion=completion_date)
            db.session.add(ser_req)
            db.session.commit()
            return jsonify({"message": "Created Sucessfully"}),200

        except:
            db.session.rollback()
            return jsonify({"message":"Something went wrong"}), 500

    
class ServiceRequestAPI(Resource):

    @marshal_with(ser_req_fields)
    @auth_required('token')
    @roles_required(['admin','professional','customer'])
    def get(self,id):
        ser_req = ServiceRequest.query.get(id)
        if not ser_req:
            return {"message": "Not Found"},404
        return ser_req
    
    @auth_required('token')
    @roles_required(['professional','customer'])
    def put(self,id):
        ser_req = ServiceRequest.query.get(id)
        if not ser_req:
            return {"message": "Not Found"},404
        data = request.get_json()
        if current_user.id == ser_req.customer_id or ser_req.professional_id:
            try:
                ser_req.date_of_request = data.get('request_date')
                ser_req.date_of_completion = data.get('completion_date')
                ser_req.service_status = data.get('service_status')
                ser_req.remarks = data.get('remarks')
                ser_req.rating = data.get('rating')

                db.session.commit()
                return jsonify({"message": "updated Sucessfully"}),200
            except:
                db.session.rollback()
                return jsonify({"message":"Updation Unsucessfull"}), 500
        else:
            return ({"message":"Not Authorised"})
    
    @auth_required('token')
    def delete(self,id):
        ser_req = ServiceRequest.query.get(id)
        if not ser_req:
            return {"message": "Not Found"},404
        try:
            db.session.delete(ser_req)
            return jsonify({"message":"Deleted Sucessfully"}),200
        except:
            db.session.rollback()
            return jsonify({"message":"Deletion Unsucessfull"}), 500

api.add_resource(ServiceRequestAPI,"/service_requests/<int:id>")
api.add_resource(ServiceRequestsAPI,"/service_requests")
