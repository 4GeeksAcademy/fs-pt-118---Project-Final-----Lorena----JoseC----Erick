"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from sqlalchemy import select, func
from api.models import db, User, Events, Groups, Reservations, UsersEvents, UsersGroups
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, get_jwt, get_jwt_identity, current_user
from .utils import verify_reset_token, send_reset_email
from datetime import datetime
from flask import Flask, request, redirect, url_for, flash
import traceback


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# -----------------------------------------------Statistics---------------------------------------------------


@api.route('/stats/users', methods=['GET'])
def get_user_count():
    user_count = db.session.query(func.count(User.id)).scalar()
    return jsonify({"usersRegistered": user_count}), 200


@api.route('/stats/groups', methods=['GET'])
def get_group_count():
    group_count = db.session.query(func.count(Groups.id)).scalar()
    return jsonify({"groupsCount": group_count}), 200


@api.route('/stats/events', methods=['GET'])
def get_event_count():
    event_count = db.session.query(func.count(Events.id)).scalar()
    return jsonify({"eventsCount": event_count}), 200


@api.route('/stats/reservations', methods=['GET'])
def get_reservations_count():
    reservation_count = db.session.query(func.count(Reservations.id)).scalar()
    return jsonify({"reservationsCount": reservation_count}), 200


@api.route('/stats/general', methods=['GET'])
def get_general_stats():
    user_count = db.session.query(func.count(User.id)).scalar()
    group_count = db.session.query(func.count(Groups.id)).scalar()
    event_count = db.session.query(func.count(Events.id)).scalar()
    reservation_count = db.session.query(func.count(Reservations.id)).scalar()

    return jsonify({
        "usersRegistered": user_count,
        "groupsCount": group_count,
        "eventsCount": event_count,
        "reservationsCount": reservation_count
    }), 200


# --------------------------------------------------------Register-----------------------------------------------
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


# ------------------------------------------------------Login----------------------------------------------------
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
    token = create_access_token(identity=str(user.id), additional_claims={"user_name": user.user_name}
                                )

    return jsonify({
        "success": True,
        "data": user.serialize(),
        "token": token
    }), 200

# --------------------------------------------------------Users--------------------------------------------------


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
            select(User).where(User.user_name ==

                               body["user_name"], User.id != id)
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


# -------------------------------------------------Password-----------------------------------------------------
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

# -----------------------------------------------------Events----------------------------------------------------


@api.route('/events', methods=['GET'])
def get_events():
    events = Events.query.all()
    return jsonify([event.serialize() for event in events]), 200


@api.route("/create-event", methods=["POST"])
@jwt_required()
def create_event():
    try:
        data = request.get_json()
        name = data.get("name")
        description = data.get("description")
        start_str = data.get("start_time")
        end_str = data.get("end_time")
        imagen = data.get("imagen")

        creator_id = get_jwt_identity()

        start_time = datetime.strptime(start_str, "%Y-%m-%dT%H:%M")
        end_time = datetime.strptime(end_str, "%Y-%m-%dT%H:%M")

        new_event = Events(
            name=name,
            description=description,
            start_time=start_time,
            end_time=end_time,
            creator_id=creator_id,
            imagen=imagen,
        )
        db.session.add(new_event)
        db.session.flush()

        user_event = UsersEvents(
            user_id=creator_id,
            event_id=new_event.id
        )
        db.session.add(user_event)

        db.session.commit()
        return jsonify({"success": True, "event_id": new_event.id}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500



@api.route('/groups', methods=['GET'])
def get_groups():

    groups = db.session.execute(select(Groups)).scalars().all()
    groups = [group.serialize() for group in groups]

    return jsonify({"success": True, "data": groups}), 200


@api.route('/groups', methods=['POST'])
@jwt_required()
def create_group():
    try:
        data = request.get_json()
        print("DATA RECIBIDA:", data)

        new_group = Groups(
            name=data["name"],
            description=data.get("description"),
            avatar=data.get("avatar"),
            user_id=get_jwt_identity(),
        )

        new_group.members.append(current_user)

        db.session.add(new_group)
        db.session.commit()

        return jsonify(success=True, data=new_group.serialize()), 201

    except Exception as e:
        print("ERROR AL CREAR GRUPO:", e)
        return jsonify(success=False, message=str(e)), 500


@api.route("/groups/<int:group_id>", methods=["PUT"])
@jwt_required()
def update_group(group_id):
    user_name = get_jwt().get("user_name")
    data = request.get_json()

    if not data:
        return jsonify(success=False, message="No data provided"), 400

    group = Groups.query.get(group_id)
    if not group:
        return jsonify(success=False, message="Group not found"), 404

    if not group.owner or group.owner.user_name != user_name:
        return jsonify(success=False, message="You are not the owner of this group"), 403

    try:
        if "name" in data and not data["name"].strip():
            return jsonify(success=False, message="Group name cannot be empty"), 400

        group.name = data.get("name", group.name)
        group.description = data.get("description", group.description)
        group.avatar = data.get("avatar", group.avatar)

        db.session.commit()
        return jsonify(success=True, data=group.serialize()), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        db.session.rollback()
        return jsonify(success=False, message="Internal server error", detail=str(e)), 500


@api.route("/groups/<int:group_id>", methods=["DELETE"])
@jwt_required()
def delete_group(group_id):
    user_name = get_jwt().get("user_name")
    group = db.session.get(Groups, group_id)

    if not group:
        return jsonify(success=False, message="Group not found"), 404

    if not group.owner or group.owner.user_name != user_name:
        return jsonify(success=False, message="You are not the owner of this group"), 403

    try:
        group.members.clear()
        group.events.clear()
        db.session.delete(group)
        db.session.commit()

        return jsonify(success=True, message="Group deleted successfully"), 200

    except Exception as e:
        import traceback
        traceback.print_exc()
        db.session.rollback()
        return jsonify(success=False, message="Internal server error", detail=str(e)), 500


@api.route("groups/<int:group_id>/join", methods=["POST"])
@jwt_required()
def join_group(group_id):
    current_user_id = get_jwt_identity()
    group = db.session.get(Groups, group_id)

    if not group:
        return jsonify({"message": "Group not found"}), 404

    user = db.session.get(User, current_user_id)

    if user in group.members:
        return jsonify({"message": "Already a member"}), 400

    group.members.append(user)
    db.session.commit()

    return jsonify({"message": "Joined group successfully", "group": group.serialize()}), 200


@api.route("/groups/<int:group_id>/leave", methods=["POST"])
@jwt_required()
def leave_group(group_id):
    current_user_id = get_jwt_identity()
    group = db.session.get(Groups, group_id)

    if not group:
        return jsonify({"message": "Group not found"}), 404

    user = db.session.get(User, current_user_id)

    if user not in group.members:
        return jsonify({"message": "Not a member"}), 400

    group.members.remove(user)
    db.session.commit()

    return jsonify({"message": "Left group successfully", "group": group.serialize()}), 200

# --------------------------------------------- Perfil ---------------------------------------------


@api.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():

    try:
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)

        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404

        # Eventos creados por el usuario
        user_events = Events.query.filter_by(creator_id=user_id).all()

        # Grupos creados por el usuario
        user_groups = Groups.query.filter_by(user_id=user_id).all()

        # Datos del usuario
        user_data = {
            "id": user.id,
            "user_name": user.user_name,
            "email": user.email,
            "avatar": getattr(user, "avatar", None),
        }

        # Serializar eventos y grupos
        events_data = [
            {"id": e.id, "name": e.name, "description": e.description}
            for e in user_events
        ]

        groups_data = [
            {"id": g.id, "name": g.name, "description": g.description}
            for g in user_groups
        ]

        return jsonify({
            "success": True,
            "user": user_data,
            "events": events_data,
            "groups": groups_data
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500
    

@api.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    try:
        user_id = get_jwt_identity()
        user = db.session.get(User, user_id)
        if not user:
            return jsonify({"success": False, "message": "User not found"}), 404

        data = request.get_json() or {}

        # --- user_name (único) ---
        new_username = data.get("user_name")
        if new_username and new_username != user.user_name:
            exists = db.session.query(User.id)\
                .filter(User.user_name == new_username, User.id != user.id)\
                .first()
            if exists:
                return jsonify({"success": False, "message": "Username already taken"}), 409
            user.user_name = new_username

        # --- email (único) ---
        new_email = data.get("email")
        if new_email and new_email != user.email:
            exists = db.session.query(User.id)\
                .filter(User.email == new_email, User.id != user.id)\
                .first()
            if exists:
                return jsonify({"success": False, "message": "Email already registered"}), 409
            user.email = new_email

        new_avatar = data.get("avatar")
        if new_avatar is not None:
            user.avatar = new_avatar

        new_password = data.get("password")
        if new_password:
            user.password_hash = generate_password_hash(new_password)

        db.session.commit()

        return jsonify({"success": True, "data": user.serialize()}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({"success": False, "error": str(e)}), 500

