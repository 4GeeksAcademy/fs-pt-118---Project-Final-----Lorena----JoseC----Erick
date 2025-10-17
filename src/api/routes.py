"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from sqlalchemy import select, func
from api.models import db, User, Events, Groups, Reservations
from api.utils import generate_sitemap, APIException
from flask_cors import CORS

api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)


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
