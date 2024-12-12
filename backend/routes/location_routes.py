from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from models import Location

bp = Blueprint('locations', __name__)

@bp.route('/locations', methods=['GET'])
# @jwt_required()
def get_all_locations():
    try:
        locations = Location.query.all()
        location_list = [loc.location for loc in locations]
        return jsonify(location_list), 200
    except Exception as e:
        return jsonify({'error': f'Failed to fetch locations: {str(e)}'}), 500
