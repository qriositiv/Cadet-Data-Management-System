from flask import Blueprint, request, jsonify, current_app
from datetime import datetime, timedelta
from models import Event, UserAuthentication, UserProfileData, CarEnterPermission, ExemptionFromPhysicalActivity, db
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
import random
import string

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

@bp.route('/permission/car/<string:cadetId>', methods=['GET'])
# @jwt_required()
def get_car_permissions(cadetId):
    permissions = CarEnterPermission.query.filter_by(cadetId=cadetId).all()

    if not permissions:
        return jsonify({'error': 'No car permissions found for this cadet'}), 404

    permissions_list = [
        {
            'permissionId': permission.permissionId,
            'cadetId': permission.cadetId,
            'status': permission.status,
            'location': permission.location,
            'dateFrom': permission.dateFrom.strftime('%Y-%m-%d'),
            'dateTo': permission.dateTo.strftime('%Y-%m-%d'),
            'carNumber': permission.carNumber,
            'carBrand': permission.carBrand,
            'additionalInformation': permission.additionalInformation,
        }
        for permission in permissions
    ]

    return jsonify({'enterWithCarPermissions': permissions_list})

@bp.route('/permission/car', methods=['POST'])
def create_car_permission():
    data = request.get_json()

    # Validate required fields
    required_fields = ['cadetId', 'status', 'location', 'dateFrom', 'dateTo', 'carNumber', 'carBrand']
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({'error': f'{field} is required'}), 400

    try:
        # Parse dates
        date_from = datetime.fromisoformat(data['dateFrom'])
        date_to = datetime.fromisoformat(data['dateTo'])

        # Create a new permission instance
        new_permission = CarEnterPermission(
            cadetId=data['cadetId'],
            status=data['status'],
            location=data['location'],
            dateFrom=date_from,
            dateTo=date_to,
            carNumber=data['carNumber'],
            carBrand=data['carBrand'],
            additionalInformation=data.get('additionalInformation', ''),
        )

        # Add to database and commit
        db.session.add(new_permission)
        db.session.commit()

        # Return the created permission as JSON
        return jsonify({
            'permissionId': new_permission.permissionId,
            'cadetId': new_permission.cadetId,
            'status': new_permission.status,
            'location': new_permission.location,
            'dateFrom': new_permission.dateFrom.isoformat(),
            'dateTo': new_permission.dateTo.isoformat(),
            'carNumber': new_permission.carNumber,
            'carBrand': new_permission.carBrand,
            'additionalInformation': new_permission.additionalInformation,
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create permission: {str(e)}'}), 500
    
    
@bp.route('/permission/physical/<string:cadetId>', methods=['GET'])
def get_physical_permissions(cadetId):
    permissions = ExemptionFromPhysicalActivity.query.filter_by(cadetId=cadetId).all()

    permission_list = [
        {
            'permissionId': permission.permissionId,
            'cadetId': permission.cadetId,
            'status': permission.status,
            'dateFrom': permission.dateFrom.isoformat(),
            'dateTo': permission.dateTo.isoformat(),
            'documentPhotoUrl': permission.documentPhotoUrl,
            'additionalInformation': permission.additionalInformation,
        }
        for permission in permissions
    ]

    return jsonify(permission_list)
    
@bp.route('/permission/physical', methods=['POST'])
def create_physical_permission():
    data = request.get_json()

    required_fields = ['cadetId', 'status', 'dateFrom', 'dateTo', 'documentPhotoUrl']
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({'error': f'{field} is required'}), 400

    try:
        # Parse dates
        date_from = datetime.fromisoformat(data['dateFrom'])
        date_to = datetime.fromisoformat(data['dateTo'])

        # Create a new permission
        new_permission = ExemptionFromPhysicalActivity(
            cadetId=data['cadetId'],
            status=data['status'],
            dateFrom=date_from,
            dateTo=date_to,
            documentPhotoUrl=data['documentPhotoUrl'],
            additionalInformation=data.get('additionalInformation', ''),
        )

        # Add and commit to the database
        db.session.add(new_permission)
        db.session.commit()

        return jsonify({
            'permissionId': new_permission.permissionId,
            'cadetId': new_permission.cadetId,
            'status': new_permission.status,
            'dateFrom': new_permission.dateFrom.isoformat(),
            'dateTo': new_permission.dateTo.isoformat(),
            'documentPhotoUrl': new_permission.documentPhotoUrl,
            'additionalInformation': new_permission.additionalInformation,
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create permission: {str(e)}'}), 500

def allowed_file(filename):
    allowed_extensions = current_app.config['ALLOWED_EXTENSIONS']
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

def generate_random_filename(extension):
    random_str = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
    return f"{random_str}.{extension}"

@bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in the request'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'No file selected for uploading'}), 400

    if file and allowed_file(file.filename):
        # Get the file extension
        extension = file.filename.rsplit('.', 1)[1].lower()
        # Generate a random file name
        random_filename = generate_random_filename(extension)
        # Secure the file name and save it to the upload folder
        upload_folder = current_app.config['UPLOAD_FOLDER']
        file_path = os.path.join(upload_folder, secure_filename(random_filename))
        file.save(file_path)
        return jsonify({'file_name': random_filename}), 201

    return jsonify({'error': 'File type not allowed'}), 400
