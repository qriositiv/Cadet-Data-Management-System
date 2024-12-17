from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from models import UserProfileData

# Create a blueprint for user profile-related routes.
bp = Blueprint('profile', __name__)

# Route to get the profile of a specific user (cadet).
@bp.route('/profile/<string:cadetId>', methods=['GET'])
@jwt_required()  # Requires a valid JWT token.
def get_user_profile(cadetId):
    # Query the user profile by cadetId.
    profile = UserProfileData.query.filter_by(cadetId=cadetId).first()

    # If the profile is not found, return a 404 error.
    if not profile:
        return jsonify({'error': 'User profile not found'}), 404

    # Serialize the profile data into a structured JSON format.
    profile_data = {
        "authentication": {
            "cadetId": profile.cadetId,
        },
        "basicData": {
            "dateOfBirth": profile.dateOfBirth.strftime('%Y-%m-%d'),  # Format date for JSON.
            "fullName": profile.fullName,
            "photoUrl": profile.photoUrl,
        },
        "contactData": {
            "phoneNumber": profile.phoneNumber,
            "email": profile.email,
            "address": profile.address,
        },
        "healthData": {
            "bloodType": profile.bloodType,
            "gender": profile.gender,
            "heightCm": float(profile.heightCm) if profile.heightCm else None,  # Convert height to float if available.
            "weightKg": float(profile.weightKg) if profile.weightKg else None,  # Convert weight to float if available.
            "allergies": profile.allergies,
            "medicalConditions": profile.medicalConditions,
        },
        "serviceData": {
            "location": profile.baseLocation,
            "status": profile.status,
        },
    }

    # Return the serialized profile data as a JSON response.
    return jsonify(profile_data)
