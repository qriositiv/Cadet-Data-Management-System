from flask import Blueprint, request, jsonify
from datetime import datetime, timedelta
from models import Event, UserAuthentication, UserProfileData
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

bp = Blueprint('events', __name__)

@bp.route('/login', methods=['POST'])
def login():
    data = request.json
    cadetId = data.get('cadetId')
    nationalId = data.get('nationalId')

    user = UserAuthentication.query.filter_by(cadetId=cadetId, nationalId=nationalId).first()
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401

    access_token = create_access_token(identity={'cadetId': cadetId})
    return jsonify({'access_token': access_token}), 200

@bp.route('/protected', methods=['GET'])
# @jwt_required()
def protected():
    current_user = get_jwt_identity()
    return jsonify({'message': f'Welcome, {current_user["cadetId"]}!'}), 200

@bp.route('/profile/<string:cadetId>', methods=['GET'])
# @jwt_required() 
def get_user_profile(cadetId):
    profile = UserProfileData.query.filter_by(cadetId=cadetId).first()

    if not profile:
        return jsonify({'error': 'User profile not found'}), 404

    profile_data = {
        "authentication": {
            "cadetId": profile.cadetId,
            "nationalId": profile.authentication.nationalId  # Access the related authentication data
        },
        "basicData": {
            "dateOfBirth": profile.dateOfBirth.strftime('%Y-%m-%d'),
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
            "heightCm": float(profile.heightCm) if profile.heightCm else None,
            "weightKg": float(profile.weightKg) if profile.weightKg else None,
            "allergies": profile.allergies,
            "medicalConditions": profile.medicalConditions,
        },
        "serviceData": {
            "location": profile.baseLocation,
            "status": profile.status,
        },
    }

    return jsonify(profile_data)

@bp.route('/events', methods=['GET'])
# @jwt_required() 
def get_events():
    now = datetime.utcnow() + timedelta(hours=2) 
    events = Event.query.filter(Event.dateTo > now).order_by(Event.dateFrom).all()
    event_list = [
        {
            'eventId': event.eventId,
            'title': event.title,
            'dateFrom': event.dateFrom.strftime('%Y-%m-%d %H:%M:%S'),
            'dateTo': event.dateTo.strftime('%Y-%m-%d %H:%M:%S'),
            'location': event.location
        }
        for event in events
    ]
    return jsonify(event_list)
