from flask import Blueprint, request, jsonify, current_app
from datetime import datetime
from flask_jwt_extended import jwt_required
from models import CarEnterPermission, ExemptionFromPhysicalActivity, Notification
from extensions import db
import os
import random
import string
from werkzeug.utils import secure_filename

# Create a blueprint for permission-related routes.
bp = Blueprint('permissions', __name__)

# Route to get all car permissions for a specific cadet.
@bp.route('/permission/car/<string:cadetId>', methods=['GET'])
@jwt_required()
def get_car_permissions(cadetId):
    # Query permissions from the database.
    permissions = CarEnterPermission.query.filter_by(cadetId=cadetId).all()
    
    # Serialize permissions to JSON format.
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

# Route to create a new car permission.
@bp.route('/permission/car', methods=['POST'])
@jwt_required()
def create_car_permission():
    # Validate input data.
    data = request.get_json()
    required_fields = ['cadetId', 'status', 'location', 'dateFrom', 'dateTo', 'carNumber', 'carBrand']
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({'error': f'{field} is required'}), 400

    try:
        # Parse dates and create a new permission.
        date_from = datetime.fromisoformat(data['dateFrom'])
        date_to = datetime.fromisoformat(data['dateTo'])
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

# Route to get all physical activity exemptions for a specific cadet.
@bp.route('/permission/physical/<string:cadetId>', methods=['GET'])
@jwt_required()
def get_physical_permissions(cadetId):
    # Query exemptions from the database.
    permissions = ExemptionFromPhysicalActivity.query.filter_by(cadetId=cadetId).all()
    # Serialize exemptions to JSON format.
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

# Route to create a new physical activity exemption.
@bp.route('/permission/physical', methods=['POST'])
@jwt_required()
def create_physical_permission():
    # Validate input data.
    data = request.get_json()
    required_fields = ['cadetId', 'status', 'dateFrom', 'dateTo', 'documentPhotoUrl']
    for field in required_fields:
        if field not in data or not data[field]:
            return jsonify({'error': f'{field} is required'}), 400

    try:
        # Parse dates and create a new exemption.
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
        return jsonify({'error': f'Failed to create exemption: {str(e)}'}), 500

# Helper functions for file uploads.
def allowed_file(filename):
    allowed_extensions = current_app.config['ALLOWED_EXTENSIONS']
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in allowed_extensions

def generate_random_filename(extension):
    random_str = ''.join(random.choices(string.ascii_letters + string.digits, k=10))
    return f"{random_str}.{extension}"

# Route to handle file uploads.
@bp.route('/upload', methods=['POST'])
@jwt_required()
def upload_file():
    # Validate file presence and type.
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

# Other routes include querying, updating unapproved permissions and exemptions, which follow similar patterns.
# Route to get all unapproved car permissions.
@bp.route('/permission/car/unapproved', methods=['GET'])
@jwt_required()
def get_unapproved_permissions():
    try:
        # Query all car permissions with status 'Nepatvirtintas'.
        unapproved_permissions = CarEnterPermission.query.filter_by(status='Nepatvirtintas').all()

        # Serialize permissions into JSON format.
        result = [
            {
                'permissionId': perm.permissionId,
                'cadetId': perm.cadetId,
                'status': perm.status,
                'location': perm.location,
                'dateFrom': perm.dateFrom.isoformat(),
                'dateTo': perm.dateTo.isoformat(),
                'carNumber': perm.carNumber,
                'carBrand': perm.carBrand,
                'additionalInformation': perm.additionalInformation,
            }
            for perm in unapproved_permissions
        ]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': f'Failed to fetch unapproved permissions: {str(e)}'}), 500

# Route to update a specific car permission by ID.
@bp.route('/permission/car/<int:permissionId>', methods=['PUT'])
@jwt_required()
def update_permission(permissionId):
    try:
        # Fetch the car permission by ID.
        permission = CarEnterPermission.query.get(permissionId)
        if not permission:
            return jsonify({'error': 'Permission not found'}), 404

        # Parse the request data.
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Track changes and update fields if they are provided in the request.
        updated_fields = []
        if 'dateTo' in data and permission.dateTo != datetime.fromisoformat(data['dateTo']):
            permission.dateTo = datetime.fromisoformat(data['dateTo'])
            updated_fields.append('dateTo')
        if 'additionalInformation' in data and permission.additionalInformation != data['additionalInformation']:
            permission.additionalInformation = data['additionalInformation']
            updated_fields.append('additionalInformation')
        if 'status' in data and permission.status != data['status']:
            permission.status = data['status']
            updated_fields.append('status')

        # Commit changes to the database.
        db.session.commit()

        # Send notification if the status has been updated.
        if 'status' in updated_fields:
            notification = Notification(
                cadetId=permission.cadetId,
                type='fail' if data['status'] != 'Approved' else 'success',
                title='Leidimas įvažiuoti į teritoriją',
                message=f"Jūsų automobilio leidimo būsena atnaujinta į '{data['status']}' lokacijai {permission.location}.",
                hidden=False
            )
            db.session.add(notification)
            db.session.commit()

        return jsonify({'message': f'Permission with ID {permissionId} updated successfully!'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update permission: {str(e)}'}), 500

# Route to get all unapproved physical activity exemptions.
@bp.route('/permission/physical/unapproved', methods=['GET'])
@jwt_required()
def get_unapproved_exemptions():
    try:
        # Query all exemptions with status 'Nepatvirtintas'.
        unapproved_exemptions = ExemptionFromPhysicalActivity.query.filter_by(status='Nepatvirtintas').all()

        # Serialize exemptions into JSON format.
        result = [
            {
                'permissionId': exemption.permissionId,
                'cadetId': exemption.cadetId,
                'status': exemption.status,
                'dateFrom': exemption.dateFrom.isoformat(),
                'dateTo': exemption.dateTo.isoformat(),
                'documentPhotoUrl': exemption.documentPhotoUrl,
                'additionalInformation': exemption.additionalInformation,
            }
            for exemption in unapproved_exemptions
        ]
        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': f'Failed to fetch unapproved exemptions: {str(e)}'}), 500

# Route to update a specific physical activity exemption by ID.
@bp.route('/permission/physical/<int:permissionId>', methods=['PUT'])
@jwt_required()
def update_exemption(permissionId):
    try:
        # Fetch the exemption by ID.
        exemption = ExemptionFromPhysicalActivity.query.get(permissionId)
        if not exemption:
            return jsonify({'error': 'Exemption not found'}), 404

        # Parse the request data.
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Track changes and update fields if they are provided in the request.
        updated_fields = []
        if 'status' in data and exemption.status != data['status']:
            exemption.status = data['status']
            updated_fields.append('status')
        if 'dateFrom' in data and exemption.dateFrom != datetime.fromisoformat(data['dateFrom']):
            exemption.dateFrom = datetime.fromisoformat(data['dateFrom'])
            updated_fields.append('dateFrom')
        if 'dateTo' in data and exemption.dateTo != datetime.fromisoformat(data['dateTo']):
            exemption.dateTo = datetime.fromisoformat(data['dateTo'])
            updated_fields.append('dateTo')
        if 'documentPhotoUrl' in data and exemption.documentPhotoUrl != data['documentPhotoUrl']:
            exemption.documentPhotoUrl = data['documentPhotoUrl']
            updated_fields.append('documentPhotoUrl')
        if 'additionalInformation' in data and exemption.additionalInformation != data['additionalInformation']:
            exemption.additionalInformation = data['additionalInformation']
            updated_fields.append('additionalInformation')

        # Commit changes to the database.
        db.session.commit()

        # Send notification if the status has been updated.
        if 'status' in updated_fields:
            notification = Notification(
                cadetId=exemption.cadetId,
                type='fail' if data['status'] != 'Approved' else 'success',
                title='Atleidimas nuo fizinės veiklos',
                message=f"Jūsų atleidimo nuo fizinio aktyvumo statusas atnaujintas į '{data['status']}' effective from {exemption.dateFrom}.",
                hidden=False
            )
            db.session.add(notification)
            db.session.commit()

        return jsonify({'message': f'Exemption with ID {permissionId} updated successfully!'}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update exemption: {str(e)}'}), 500
