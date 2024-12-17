from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import UserAuthentication, UserProfileData

# Create a blueprint for authentication-related routes.
bp = Blueprint('auth', __name__)

# Route for user login.
@bp.route('/login', methods=['POST'])
def login():
    # Parse the JSON payload from the request.
    data = request.json
    cadetId = data.get('cadetId')  # Get the user ID.
    password = data.get('password')  # Get the plaintext password.

    # Validate that both fields are provided.
    if not cadetId or not password:
        return jsonify({'error': 'cadetId and password are required'}), 400

    # Look for the user in the database by cadetId.
    user = UserAuthentication.query.filter_by(cadetId=cadetId).first()
    if not user or user.hashedPassword != password:  # Compare passwords (this example assumes no hashing).
        return jsonify({'error': 'Invalid credentials'}), 401

    # Fetch the user's profile data.
    profile = UserProfileData.query.filter_by(cadetId=cadetId).first()
    if not profile:
        return jsonify({'error': 'Profile data not found'}), 404

    # Check if the user has an 'intendant' status.
    isIntendant = profile.status == 'intendantas'

    # Create a JWT token for the user (identity must be a string).
    access_token = create_access_token(identity=str(cadetId))

    # Return the access token and role status.
    return jsonify({'access_token': access_token, 'isIntendant': isIntendant}), 200

# Protected route that requires a valid JWT token.
@bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    # Extract the user's identity from the JWT token.
    current_user = get_jwt_identity()
    return jsonify({'message': f'Protected route accessed by {current_user}!'}), 200

# Route to retrieve the user's role/status.
@bp.route('/user-role', methods=['GET'])
@jwt_required()
def get_user_role():
    # Get the user's cadetId from the JWT token.
    cadetId = get_jwt_identity()

    # Fetch the user's profile data from the database.
    profile = UserProfileData.query.filter_by(cadetId=cadetId).first()
    if not profile:
        return jsonify({'error': 'Profile data not found'}), 404

    # Return the user's role/status.
    return jsonify({'role': profile.status}), 200
