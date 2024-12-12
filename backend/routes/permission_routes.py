from flask import Blueprint, request, jsonify, current_app
from datetime import datetime

from flask_jwt_extended import jwt_required
from models import CarEnterPermission, ExemptionFromPhysicalActivity
from extensions import db
import os
import random
import string
from werkzeug.utils import secure_filename

bp = Blueprint('permissions', __name__)

@bp.route('/permission/car/<string:cadetId>', methods=['GET'])
@jwt_required()
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
@jwt_required()
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
@jwt_required()
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
@jwt_required()
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
@jwt_required()
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


@bp.route('/permission/car/unapproved', methods=['GET'])
@jwt_required()
def get_unapproved_permissions():
    try:
        # Query all permissions with status 'Nepatvirtintas'
        unapproved_permissions = CarEnterPermission.query.filter_by(status='Nepatvirtintas').all()

        # Serialize the data
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
    
@bp.route('/permission/car/<int:permissionId>', methods=['PUT'])
@jwt_required()
def update_permission(permissionId):
    try:
        # Fetch the permission by ID
        permission = CarEnterPermission.query.get(permissionId)
        if not permission:
            return jsonify({'error': 'Permission not found'}), 404

        # Parse the request data
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Update the fields if provided in the request
        if 'dateTo' in data:
            permission.dateTo = data['dateTo']
        if 'additionalInformation' in data:
            permission.additionalInformation = data['additionalInformation']
        if 'status' in data:
            permission.status = data['status']

        # Commit changes to the database
        db.session.commit()
        return jsonify({'message': f'Permission with ID {permissionId} updated successfully!'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update permission: {str(e)}'}), 500
    
@bp.route('/permission/physical/unapproved', methods=['GET'])
@jwt_required()
def get_unapproved_exemptions():
    try:
        # Query all exemptions with status 'Nepatvirtintas'
        unapproved_exemptions = ExemptionFromPhysicalActivity.query.filter_by(status='Nepatvirtintas').all()

        # Serialize the data
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
    
@bp.route('/permission/physical/<int:permissionId>', methods=['PUT'])
@jwt_required()
def update_exemption(permissionId):
    try:
        # Fetch the exemption by ID
        exemption = ExemptionFromPhysicalActivity.query.get(permissionId)
        if not exemption:
            return jsonify({'error': 'Exemption not found'}), 404

        # Parse request data
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Update fields if they exist in the request
        if 'cadetId' in data:
            exemption.cadetId = data['cadetId']
        if 'status' in data:
            exemption.status = data['status']
        if 'dateFrom' in data:
            exemption.dateFrom = data['dateFrom']
        if 'dateTo' in data:
            exemption.dateTo = data['dateTo']
        if 'documentPhotoUrl' in data:
            exemption.documentPhotoUrl = data['documentPhotoUrl']
        if 'additionalInformation' in data:
            exemption.additionalInformation = data['additionalInformation']

        # Commit changes to the database
        db.session.commit()

        return jsonify({'message': f'Exemption with ID {permissionId} updated successfully!'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update exemption: {str(e)}'}), 500