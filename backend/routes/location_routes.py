from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from models import Location

# Create a blueprint for location-related routes.
bp = Blueprint('locations', __name__)

# Route to get all available locations.
@bp.route('/locations', methods=['GET'])
# @jwt_required()  # Uncomment this line if authentication is required for this route.
def get_all_locations():
    try:
        # Query all locations from the database.
        locations = Location.query.all()
        
        # Create a list of location names.
        location_list = [loc.location for loc in locations]
        
        # Return the list of locations as a JSON response.
        return jsonify(location_list), 200
    except Exception as e:
        # Handle exceptions and return an error message.
        return jsonify({'error': f'Failed to fetch locations: {str(e)}'}), 500
