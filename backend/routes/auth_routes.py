from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from models import UserAuthentication, UserProfileData

bp = Blueprint('auth', __name__)

@bp.route('/login', methods=['POST'])
def login():
    # Parse JSON payload
    data = request.json
    cadetId = data.get('cadetId')
    password = data.get('password')  # User-provided plaintext password

    # Validate input
    if not cadetId or not password:
        return jsonify({'error': 'cadetId and password are required'}), 400

    # Query user by cadetId
    user = UserAuthentication.query.filter_by(cadetId=cadetId).first()
    if not user or user.hashedPassword != password:  # Direct plaintext password comparison
        return jsonify({'error': 'Invalid credentials'}), 401

    # Fetch user profile data
    profile = UserProfileData.query.filter_by(cadetId=cadetId).first()
    if not profile:
        return jsonify({'error': 'Profile data not found'}), 404

    # Determine if user is an 'intendant'
    isIntendant = profile.status == 'intendantas'

    # Ensure cadetId is a string before passing to create_access_token
    access_token = create_access_token(identity=str(cadetId))  # Convert cadetId to string

    # Return token and status
    return jsonify({'access_token': access_token, 'isIntendant': isIntendant}), 200

@bp.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    # Extract user identity from JWT
    current_user = get_jwt_identity()
    return jsonify({'message': f'Protected route accessed by {current_user}!'}), 200

@bp.route('/user-role', methods=['GET'])
@jwt_required()
def get_user_role():
    # Extract user identity (cadetId) from JWT token
    cadetId = get_jwt_identity()

    # Query the user's profile data
    profile = UserProfileData.query.filter_by(cadetId=cadetId).first()
    if not profile:
        return jsonify({'error': 'Profile data not found'}), 404

    # Return the user's role
    return jsonify({'role': profile.status}), 200
