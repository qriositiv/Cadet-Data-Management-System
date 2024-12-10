from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from models import UserAuthentication, UserProfileData

bp = Blueprint('auth', __name__)

@bp.route('/login', methods=['POST'])
def login():
    data = request.json
    cadetId = data.get('cadetId')
    nationalId = data.get('nationalId')

    user = UserAuthentication.query.filter_by(cadetId=cadetId, nationalId=nationalId).first()
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401

    profile = UserProfileData.query.filter_by(cadetId=cadetId).first()
    if not profile:
        return jsonify({'error': 'Profile data not found'}), 404

    isIntendant = profile.status == 'intendantas'
    access_token = create_access_token(identity={'cadetId': cadetId})

    return jsonify({'access_token': access_token, 'isIntendant': isIntendant}), 200

@bp.route('/protected', methods=['GET'])
def protected():
    return jsonify({'message': 'Protected route!'}), 200
