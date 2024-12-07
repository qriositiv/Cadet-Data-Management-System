from flask import Blueprint, request, jsonify, current_app
from datetime import datetime, timedelta
from models import Event, UserAuthentication, UserProfileData, CarEnterPermission, ExemptionFromPhysicalActivity, UserEquipment, Equipment, EquipmentSize, Location, UserDisciplineResult, Discipline, db
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
            "nationalId": profile.authentication.nationalId
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
def get_car_permissions(cadetId):
    permissions = CarEnterPermission.query.filter_by(cadetId=cadetId).all()

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

    required_fields = ['cadetId', 'status', 'location', 'dateFrom', 'dateTo', 'carNumber', 'carBrand']
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({'error': f'{field} is required'}), 400

    try:
        try:
            date_from = datetime.fromisoformat(data['dateFrom'])
            date_to = datetime.fromisoformat(data['dateTo'])
        except ValueError:
            return jsonify({'error': 'Invalid date format. Please use ISO 8601 format (YYYY-MM-DDTHH:MM:SS)'}), 400

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

        db.session.add(new_permission)
        db.session.commit()

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
        date_from = datetime.fromisoformat(data['dateFrom'])
        date_to = datetime.fromisoformat(data['dateTo'])

        new_permission = ExemptionFromPhysicalActivity(
            cadetId=data['cadetId'],
            status=data['status'],
            dateFrom=date_from,
            dateTo=date_to,
            documentPhotoUrl=data['documentPhotoUrl'],
            additionalInformation=data.get('additionalInformation', ''),
        )

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
        extension = file.filename.rsplit('.', 1)[1].lower()
        random_filename = generate_random_filename(extension)
        upload_folder = current_app.config['UPLOAD_FOLDER']
        file_path = os.path.join(upload_folder, secure_filename(random_filename))
        file.save(file_path)
        return jsonify({'file_name': random_filename}), 201

    return jsonify({'error': 'File type not allowed'}), 400

@bp.route('/equipment/<string:cadetId>', methods=['GET'])
def get_user_equipment(cadetId):
    try:
        user_equipment = db.session.query(
            UserEquipment,
            Equipment,
            EquipmentSize
        ).join(
            Equipment, Equipment.equipmentId == UserEquipment.equipmentId
        ).join(
            EquipmentSize, (EquipmentSize.equipmentId == Equipment.equipmentId) & (UserEquipment.size == EquipmentSize.size)
        ).filter(
            UserEquipment.cadetId == cadetId
        ).all()

        if user_equipment:
            equipment_list = []
            for user_eq, equipment, equipment_size in user_equipment:
                sizes = [es.size for es in db.session.query(EquipmentSize).filter(EquipmentSize.equipmentId == equipment.equipmentId).all()]

                equipment_list.append({
                    'equipmentId': equipment.equipmentId,
                    'name': equipment.name,
                    'photoUrl': equipment.photoUrl,
                    'size': user_eq.size,
                    'status': user_eq.status,
                    'dateGiven': user_eq.dateGiven.strftime('%Y-%m-%d'),
                    'sizes': sizes
                })

            return jsonify(equipment_list), 200
        else:
            return jsonify({'message': 'No equipment found for this cadet.'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
@bp.route('/updateUserEquipment', methods=['PUT'])
def update_user_equipment():
    try:
        data = request.get_json()
        cadetId = data.get('cadetId')
        equipmentId = data.get('equipmentId')
        size = data.get('size')
        status = data.get('status')

        if not cadetId or not equipmentId or not size or not status:
            return jsonify({'error': 'Missing required data'}), 400

        user_equipment = db.session.query(UserEquipment).filter_by(cadetId=cadetId, equipmentId=equipmentId).first()

        if not user_equipment:
            return jsonify({'error': 'User equipment not found'}), 404

        size_entry = EquipmentSize.query.filter_by(equipmentId=equipmentId, size=size).first()

        if not size_entry:
            return jsonify({'error': 'Invalid size for the given equipment'}), 400

        user_equipment.status = status
        user_equipment.size = size

        db.session.commit()

        return jsonify({'message': 'User equipment updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/locations', methods=['GET'])
def get_all_locations():
    try:
        locations = Location.query.all()

        location_list = [loc.location for loc in locations]

        return jsonify(location_list), 200
    except Exception as e:
        return jsonify({'error': f'Failed to fetch locations: {str(e)}'}), 500

@bp.route('/user-discipline-results/<string:cadet_id>', methods=['GET'])
def get_user_discipline_results(cadet_id):
    user = UserProfileData.query.filter_by(cadetId=cadet_id).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    today = datetime.now()
    age = today.year - user.dateOfBirth.year - ((today.month, today.day) < (user.dateOfBirth.month, user.dateOfBirth.day))

    results = (
        db.session.query(
            Discipline.name,
            UserDisciplineResult.result,
            Discipline.controlForMale if user.gender == 'Vyras' else Discipline.controlForFemale,
            Discipline.needMore
        )
        .join(UserDisciplineResult, Discipline.disciplineId == UserDisciplineResult.disciplineId)
        .filter(UserDisciplineResult.cadetId == cadet_id)
        .all()
    )

    response = {
        'username': user.fullName,
        'gender': user.gender,
        'age': age,
        'results': [
            {
                'name': r[0],
                'result': r[1],
                'controlValue': r[2],
                'needMore': r[3],
            }
            for r in results
        ],
    }

    return jsonify(response)

@bp.route('/disciplines', methods=['GET'])
def get_disciplines():
    disciplines = Discipline.query.all()

    result = []
    for discipline in disciplines:
        result.append({
            'name': discipline.name,
            'controlForMale': discipline.controlForMale,
            'controlForFemale': discipline.controlForFemale,
            'controlValue': discipline.controlForMale + discipline.controlForFemale
        })

    return jsonify(result)