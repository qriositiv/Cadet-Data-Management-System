from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from models import UserEquipment, Equipment, EquipmentSize, UserAuthentication, Notification
from extensions import db

# Create a blueprint for equipment-related routes.
bp = Blueprint('equipment', __name__)

# Route to retrieve a user's equipment details.
@bp.route('/equipment/<string:cadetId>', methods=['GET'])
@jwt_required()
def get_user_equipment(cadetId):
    try:
        # Query to fetch user's equipment, including sizes and details.
        user_equipment = db.session.query(
            UserEquipment, Equipment, EquipmentSize
        ).join(
            Equipment, Equipment.equipmentId == UserEquipment.equipmentId
        ).join(
            EquipmentSize, (EquipmentSize.equipmentId == Equipment.equipmentId) & (UserEquipment.size == EquipmentSize.size)
        ).filter(UserEquipment.cadetId == cadetId).all()

        if user_equipment:
            # Prepare a list of equipment details.
            equipment_list = []
            for user_eq, equipment, equipment_size in user_equipment:
                sizes_info = [
                    {
                        'size': es.size,
                        'equipmentLeft': es.equipmentLeft
                    }
                    for es in db.session.query(EquipmentSize).filter(EquipmentSize.equipmentId == equipment.equipmentId).all()
                ]

                equipment_list.append({
                    'equipmentId': equipment.equipmentId,
                    'name': equipment.name,
                    'photoUrl': equipment.photoUrl,
                    'size': user_eq.size,
                    'status': user_eq.status,
                    'dateGiven': user_eq.dateGiven.strftime('%Y-%m-%d'),
                    'sizes': sizes_info
                })

            return jsonify(equipment_list), 200
        else:
            return jsonify({'message': 'No equipment found for this cadet.'}), 204
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to update user equipment details.
@bp.route('/updateUserEquipment', methods=['PUT'])
@jwt_required()
def update_user_equipment():
    try:
        # Parse and validate request data.
        data = request.get_json()
        cadetId = data.get('cadetId')
        equipmentId = data.get('equipmentId')
        size = data.get('size')
        status = data.get('status')

        if not cadetId or not equipmentId or not size or not status:
            return jsonify({'error': 'Missing required data'}), 400

        # Fetch the user's equipment entry.
        user_equipment = UserEquipment.query.filter_by(cadetId=cadetId, equipmentId=equipmentId).first()
        if not user_equipment:
            return jsonify({'error': 'User equipment not found'}), 204

        # Validate the size.
        size_entry = EquipmentSize.query.filter_by(equipmentId=equipmentId, size=size).first()
        if not size_entry:
            return jsonify({'error': 'Invalid size for the given equipment'}), 400

        # Update the user's equipment details.
        user_equipment.status = status
        user_equipment.size = size
        db.session.commit()

        return jsonify({'message': 'User equipment updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to retrieve user equipment with the status "Apdorojama".
@bp.route('/user-equipment/processing', methods=['GET'])
@jwt_required()
def get_processing_user_equipment():
    try:
        # Query for equipment being processed.
        user_equipment = db.session.query(
            UserEquipment, Equipment, EquipmentSize, UserAuthentication
        ).join(
            Equipment, Equipment.equipmentId == UserEquipment.equipmentId
        ).join(
            EquipmentSize, (EquipmentSize.equipmentId == Equipment.equipmentId) & (EquipmentSize.size == UserEquipment.size)
        ).join(
            UserAuthentication, UserAuthentication.cadetId == UserEquipment.cadetId
        ).filter(UserEquipment.status == 'Apdorojama').all()

        # Prepare response with equipment details.
        equipment_list = []
        for user_eq, equipment, equipment_size, user in user_equipment:
            sizes_info = [
                {
                    'size': size.size,
                    'equipmentLeft': size.equipmentLeft
                }
                for size in db.session.query(EquipmentSize).filter(EquipmentSize.equipmentId == equipment.equipmentId).all()
            ]

            equipment_list.append({
                'equipmentId': equipment.equipmentId,
                'cadetId': user_eq.cadetId,
                'photoUrl': equipment.photoUrl,
                'status': user_eq.status,
                'name': equipment.name,
                'sizes': sizes_info,
                'size': user_eq.size,
                'dateGiven': user_eq.dateGiven.strftime('%Y-%m-%dT%H:%M:%S'),
            })

        return jsonify(equipment_list), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Route to update the status of a specific piece of equipment for a cadet.
@bp.route('/user-equipment/<int:equipmentId>/status', methods=['PUT'])
@jwt_required()
def update_equipment_status(equipmentId):
    try:
        # Parse and validate request data.
        data = request.get_json()
        if not data or 'status' not in data or 'cadetId' not in data:
            return jsonify({'error': 'Both cadetId and status fields are required'}), 400

        valid_statuses = ['Negauta', 'Apdorojama', 'Gauta', 'Paruošta']
        if data['status'] not in valid_statuses:
            return jsonify({'error': f'Invalid status. Must be one of {valid_statuses}'}), 400

        # Find the user's equipment entry.
        user_equipment = UserEquipment.query.filter_by(equipmentId=equipmentId, cadetId=data['cadetId']).first()
        if not user_equipment:
            return jsonify({'error': 'Equipment not found for the given cadet'}), 204

        # Update the status and notify the user.
        user_equipment.status = data['status']
        db.session.commit()

        equipment_name = user_equipment.equipment.name if user_equipment.equipment else "Unknown Equipment"
        notification_type = 'success' if data['status'] == 'Paruošta' else 'fail'
        notification_message = f"Ekipuotės statusas atnaujintas į {data['status']}: {equipment_name}."

        notification = Notification(
            cadetId=data['cadetId'],
            type=notification_type,
            title='Ekipuotės statusas atnaujintas',
            message=notification_message,
            hidden=False
        )
        db.session.add(notification)
        db.session.commit()

        return jsonify({'message': 'Equipment status updated successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update equipment status: {str(e)}'}), 500
