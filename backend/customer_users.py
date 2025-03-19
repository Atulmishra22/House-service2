from backend.model import db, Users, Professional, Roles
from flask_security import auth_required, current_user, roles_required, roles_accepted
from flask_restful import Api, Resource, marshal_with, fields
from flask import jsonify, request, Blueprint, make_response, current_app as app

cache = app.cache
customer_api_bp = Blueprint("customer_api", __name__, url_prefix="/api")
api = Api(customer_api_bp)

user_fields = {
    "id": fields.Integer,
    "email": fields.String,
    "name": fields.String,
    "phone": fields.Integer,
    "address": fields.String,
    "pincode": fields.Integer,
    "active": fields.Boolean,
    "user_type": fields.String,
}


class CustomersAPI(Resource):

    @auth_required("token")
    @roles_required("admin")
    @marshal_with(user_fields)
    @cache.cached(timeout=60,key_prefix = 'customer_all_data')
    def get(self):
        users = Users.query.all()
        customers = []
        users.pop(0)
        for user in users:
            if user.user_type != "professional":
                customers.append(user)
        return customers


class CustomerAPI(Resource):

    @auth_required("token")
    @roles_accepted("admin", "customer")
    @marshal_with(user_fields)
    @cache.memoize(timeout=20)
    def get(self, id):
        customer = Users.query.get(id)
        if not customer:
            return {"message": "Not Found"}, 404
        return customer

    @auth_required("token")
    @roles_required("customer")
    def put(self, id):
        customer = Users.query.get(id)
        if not customer:
            return {"message": "Not Found"}, 404
        data = request.get_json()
        if customer.id == current_user.id:
            try:
                customer.email = data.get("email")
                customer.name = data.get("name")
                customer.phone = data.get("phone")
                customer.address = data.get("address")
                customer.pincode = data.get("pincode")

                db.session.commit()
                cache.delete('customer_all_data')
                return make_response(jsonify({"message": "updated Sucessfully"}), 200)
            except:
                db.session.rollback()
                return make_response(jsonify({"message": "Updation Unsucessfull"}), 500)
        else:
            return {"message": "Not Authorised"}, 401

    @auth_required("token")
    @roles_accepted("admin", "customer")
    def delete(self, id):
        customer = Users.query.get(id)
        if not customer:
            return {"message": "Not Found"}, 404
        try:
            db.session.delete(customer)
            db.session.commit()
            cache.delete('customer_all_data')
            return make_response(jsonify({"message": "Deleted Sucessfully"}), 200)
        except:
            db.session.rollback()
            return make_response(jsonify({"message": "Deletion Unsucessfull"}), 500)


api.add_resource(CustomerAPI, "/customers/<int:id>")
api.add_resource(CustomersAPI, "/customers")


class CustomerExtra(Resource):

    @auth_required('token')
    @roles_required('admin')
    def put(self, id):
        customer = Users.query.get(id)
        if not customer:
            return {"message": "Not Found"}, 404
        data = request.get_json()
        try:
            customer.active = data.get("active")
            db.session.commit()
            cache.delete('customer_all_data')
            return make_response(
                jsonify({"message": f"{customer.name} is {data.get('active')}"}), 200
            )

        except:
            db.session.rollback()
            return make_response(jsonify({"message": "something went wrong"}), 500)


api.add_resource(CustomerExtra, "/customers/status/<int:id>")
