from flask_restx import Resource,Namespace,fields
from models import User
from werkzeug.security import generate_password_hash,check_password_hash
from flask_jwt_extended import (JWTManager,create_access_token,create_refresh_token,get_jwt_identity,jwt_required)
from flask import Flask,request,jsonify,make_response
from flask import Blueprint, request, jsonify
from .oauth import google_login
from flask import Blueprint, request, jsonify
from .oauth import google_login

auth_bp = Blueprint('auth', __name__)

auth_ns=Namespace('auth',description="A namespace for our authentication")


signup_model=auth_ns.model(
    'SignUp',
    {
        "username":fields.String(),
        "email":fields.String(),
        "password":fields.String()
    }
)

login_model=auth_ns.model(
    'Login',
    {
        "email":fields.String(),
        "password":fields.String()
    }
)

@auth_ns.route('/signup')
class SignUp(Resource):
    # @api.marshal_with(signup_model)
    @auth_ns.expect(signup_model)
    def post(self):
        data=request.get_json()

        email=data.get('email')

        db_user=User.query.filter_by(email=email).first()

        if db_user is not None:
            return jsonify({"message":f"User with email {email} already exist"})

        new_user=User(
            username=data.get('username'),
            email=data.get('email'),
            password=generate_password_hash(data.get('password'))
        )
        new_user.save()
        # return new_user,201
        return make_response(jsonify({"message":"User created Successfully"}),201)



@auth_ns.route('/login')
class Login(Resource):
    @auth_ns.expect(login_model)
    def post(self):
        data=request.get_json()
        email=data.get('email')
        password=data.get('password')

        db_user=User.query.filter_by(email=email).first()

        if db_user and check_password_hash(db_user.password,password):
            access_token=create_access_token(identity=db_user.username)
            refresh_token=create_refresh_token(identity=db_user.username)

            return jsonify(
                {"access_token":access_token,"refresh_token":refresh_token}
            )
        return jsonify({"message": "Invalid username or password"}), 401
    
@auth_ns.route('/refresh')
class RefreshResource(Resource):
    @jwt_required(refresh=True)
    def post(self):

        current_user=get_jwt_identity()
        new_access_token=create_access_token(identity=current_user)
        return make_response(jsonify({"access_token":new_access_token}), 200)
    

@auth_bp.route('/google-signin', methods=['POST'])
def google_signin():
    user_info = google_login()
    # Implement user authentication logic here (e.g., create or update user in database)
    # Return user information or success message
    return jsonify({'message': 'User signed in successfully', 'user': user_info}), 200




