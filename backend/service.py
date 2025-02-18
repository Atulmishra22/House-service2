from backend.model import db, Service
from flask_restful import Resource,Api,fields , marshal_with
from flask_security import auth_required, current_user, roles_required, roles_accepted
from flask import jsonify, request

api = Api(prefix="/api")

service_fields = {
    'id': fields.Integer,
    "name":fields.String,
    "price":fields.Integer,
    "description":fields.String,
    'time_required':fields.Integer
}

class ServiceApi(Resource):

    @auth_required('token')
    @marshal_with(service_fields)
    def get(self,id):
        ser = Service.query.get(id)
        if not ser:
            return jsonify({'message':'service not found/ exist'})
        return ser
    

    @auth_required('token')
    @roles_required('admin')
    def put(self,id):
        ser = Service.query.get(id)
        if not ser:
            return jsonify({'message':'service not found/ exist'})
        data = request.get_json()
        try:
            ser.name = data.get('name')
            ser.price = data.get('price')
            ser.time_required = data.get('time_required')
            ser.description = data.get('description')

            db.session.commit()
            return jsonify({'message':'service updated sucessfully'}),200
        except:
            db.session.rollback()
            return jsonify({'message':'service not updated'}), 500
    

    @auth_required('token')
    @roles_required('admin')
    def delete(self,id):
        ser = Service.query.get(id)
        if not ser:
            return jsonify({'message':'service not found/ exist'}), 404
        try:
            db.session.delete(ser)
            db.session.commit()
            return jsonify({"message":"Deleted Sucessfully"}),200
        except:
            db.session.rollback()
            return jsonify({"message":"Deletion Unsucessfull"}), 500
            
class ServicesApi(Resource):
    
    @marshal_with(service_fields)
    def get(self):
        sers = Service.query.all()
        return sers
    
    @auth_required('token')
    @roles_required('admin')
    def post(self):
        data = request.get_json()
        name = data.get('name')
        ser = Service.query.filter_by(name=name).first()
        if not ser:
            price = data.get('price')
            time_required = data.get('time_required')
            description = data.get('description')
            service = Service(name=name,price=price,time_required=time_required,description=description)
            db.session.add(service)
            db.session.commit()
            return jsonify({'message':'service aadded sucessfully'})
        else:
            return jsonify({'message':'service already exist'})
            
        

    
api.add_resource(ServiceApi,"/services/<int:id>")
api.add_resource(ServicesApi,"/services")
