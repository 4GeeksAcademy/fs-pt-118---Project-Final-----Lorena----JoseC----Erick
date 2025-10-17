"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from sqlalchemy import select, func
from api.models import db, User, Groups
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, get_jwt
from .utils import verify_reset_token, send_reset_email


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200


@api.route('/register', methods=['POST'])
def register_user():
    body = request.get_json()

    # Validación de campos obligatorios
    email = body.get("email")
    password = body.get("password")
    user_name = body.get("user_name")

    if not email or not password or not user_name:
        return jsonify({"error": "Email, password and user_name are required"}), 400

    # Verificar si el email ya existe
    existing_user = db.session.execute(
        select(User).where(User.email == email)
    ).scalar_one_or_none()

    if existing_user:
        return jsonify({"error": "Email is already registered"}), 409

    # Verificar si el user_name ya existe
    existing_username = db.session.execute(
        select(User).where(User.user_name == user_name)
    ).scalar_one_or_none()

    if existing_username:
        return jsonify({"error": "Username is already taken"}), 409

    # Hashear la contraseña
    hashed_password = generate_password_hash(password)

    # Crear nuevo usuario
    try:
        new_user = User(
            email=email,
            password_hash=hashed_password,
            user_name=user_name
        )

        db.session.add(new_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        print("Error al registrar usuario:", e)
        return jsonify({"error": "Internal server error"}), 500

    # Generar token JWT
    token = create_access_token(identity=str(new_user.id))

    return jsonify({
        "success": True,
        "data": new_user.serialize(),
        "token": token
    }), 201


@api.route('/login', methods=['POST'])
def login_user():
    body = request.get_json()

    identifier = body.get("identifier")  # puede ser email o user_name
    password = body.get("password")

    if not identifier or not password:
        return jsonify({"error": "Identifier and password are required"}), 400

    # Buscar usuario por email o user_name
    query = select(User).where(
        (User.email == identifier) | (User.user_name == identifier)
    )
    user = db.session.execute(query).scalar_one_or_none()

    if not user:
        return jsonify({"error": "User not found"}), 404

    # Verificar contraseña
    if not check_password_hash(user.password_hash, password):
        return jsonify({"error": "Invalid password"}), 401

    # Generar token JWT
    token = create_access_token(identity=str(user.id))

    return jsonify({
        "success": True,
        "data": user.serialize(),
        "token": token
    }), 200


@api.route('/users', methods=['GET'])
def get_users():

    users = db.session.execute(select(User)).scalars().all()
    users = [user.serialize() for user in users]

    return jsonify({"success": True, "data": users}), 200


@api.route('/users/<int:id>', methods=['GET'])
def get_user(id):
    user = db.session.get(User, id)
    return jsonify({"success": True, "data": user.serialize()}), 200


@api.route('/users/edit/<int:id>', methods=['PUT'])
@jwt_required()
def edit_user(id):
    current_user_id = get_jwt_identity()

    if current_user_id != id:
        return jsonify({"error": "Unauthorized"}), 403

    body = request.json
    user = db.session.get(User, id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    
    if "email" in body:
        email = body["email"]
        user.email = email

    if "user_name" in body and body["user_name"] != user.user_name:
        existing = db.session.execute(
            select(User).where(User.user_name == body["user_name"], User.id != id)
        ).scalar_one_or_none()
        if existing:
            return jsonify({"error": "Username already taken"}), 409
        user.user_name = body["user_name"]

    if "password" in body:
        password = body["password"]
        user.password_hash = generate_password_hash(password)

    try:
        db.session.commit()
        return jsonify({"success": True, "data": user.serialize()}), 200
    except:
        db.session.rollback()
        return jsonify({"error": "Internal server error"}), 500


@api.route('/remove-account/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_user(id):
    current_user_id = get_jwt_identity()
    claims = get_jwt()

    if current_user_id != id and claims.get("role") != "admin":
        return jsonify({"error": "Unauthorized"}), 403
    
    if claims.get("role") == "admin" and current_user_id == id:
        return jsonify({"error": "Admins cannot delete themselves"}), 403

    user = db.session.get(User, id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    try:
        db.session.delete(user)
        db.session.commit()
        return jsonify({"success": True, "message": "User deleted successfully"}), 200
    except:
        db.session.rollback()
    return jsonify({"error": "Internal server error"}), 500




@api.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get("email")

    if not email:
        return jsonify({"msg": "Email required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    send_reset_email(user)
    return jsonify({"msg": "Recovery email sent"}), 200


@api.route('/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get("token")
    new_password = data.get("new_password")

    if not token or not new_password:
        return jsonify({"msg": "Missing fields"}), 400

    email = verify_reset_token(token)
    if not email:
        return jsonify({"msg": "The token is invalid or has expired"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"msg": "User not found"}), 404

    user.password_hash = generate_password_hash(new_password)
    db.session.commit()

    return jsonify({"msg": "Password updated successfully"}), 200