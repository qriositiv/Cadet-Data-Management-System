from flask import Blueprint, jsonify
from models import Location

bp = Blueprint('locations', __name__)

@bp.route('/', methods=['GET'])
def get_all_locations():
    try:
        locations = Location.query.all()
        location_list = [loc.location for loc in locations]
        return jsonify(location_list), 200
    except Exception as e:
        return jsonify({'error': f'Failed to fetch locations: {str(e)}'}), 500
