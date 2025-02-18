from backend.model import db, Users, Professional, Roles
from flask_security import auth_required, current_user, roles_required
from flask_restful import Api, Resource,marshal_with, fields
from flask import jsonify , request

api = Api(prefix="/api")

prof_fields={
    'id':fields.Integer,
    'email':fields.String,
    'name':fields.String,
    'phone':fields.Integer,
    'active':fields.Boolean,
    'address':fields.String,
    'pincode':fields.Integer,
    'service_id':fields.Integer,
    'experience':fields.Integer,
    'file_path':fields.String,
    'date_created':fields.DateTime
}

class ProfsAPI(Resource):

    @marshal_with(prof_fields)
    @auth_required('token')
    @roles_required('admin')
    def get(self):
        profs = Professional.query.all()
        return profs
    
class ProfAPI(Resource):

    @marshal_with(prof_fields)
    @auth_required('token')
    @roles_required(['admin','professional'])
    def get(self,id):
        prof = Professional.query.get(id)
        if not prof:
            return {"message": "Not Found"},404
        return prof
    
    @auth_required('token')
    @roles_required('professional')
    def put(self,id):
        prof = Professional.query.get(id)
        if not prof:
            return {"message": "Not Found"},404
        data = request.get_json()
        if prof.id == current_user.id:
            try:
                prof.email = data.get('email')
                prof.name = data.get('name')
                prof.phone= data.get('phone')
                prof.address= data.get('address')
                prof.experience = data.get('experience')
                prof.pincode = data.get('pincode')

                db.session.commit()
                return jsonify({"message": "updated Sucessfully"}),200
            except:
                db.session.rollback()
                return jsonify({"message":"Updation Unsucessfull"}), 500
        else:
            return ({"message":"Not Authorised"})
    
    @auth_required('token')
    def delete(self,id):
        prof = Professional.query.get(id)
        if not prof:
            return {"message": "Not Found"},404
        try:
            db.session.delete()
            return jsonify({"message":"Deleted Sucessfully"}),200
        except:
            db.session.rollback()
            return jsonify({"message":"Deletion Unsucessfull"}), 500

api.add_resource(ProfAPI,"/professionals/<int:id>")
api.add_resource(ProfsAPI,"/professionals")
