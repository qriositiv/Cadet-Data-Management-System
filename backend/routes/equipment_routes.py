from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from models import UserEquipment, Equipment, EquipmentSize, UserAuthentication, Notification
from extensions import db

bp = Blueprint('equipment', __name__)

@bp.route('/equipment/<string:cadetId>', methods=['GET'])
@jwt_required()
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
                sizes_info = [
                    {
                        'size': es.size,
                        'equipmentLeft': es.equipmentLeft
                    }
                    for es in db.session.query(EquipmentSize)
                    .filter(EquipmentSize.equipmentId == equipment.equipmentId)
                    .all()
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
            return jsonify({'message': 'No equipment found for this cadet.'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@bp.route('/updateUserEquipment', methods=['PUT'])
@jwt_required()
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

@bp.route('/user-equipment/processing', methods=['GET'])
@jwt_required()
def get_processing_user_equipment():
    try:
        # Query for UserEquipment with status 'Apdorojama'
        user_equipment = db.session.query(
            UserEquipment,
            Equipment,
            EquipmentSize,
            UserAuthentication
        ).join(
            Equipment, Equipment.equipmentId == UserEquipment.equipmentId
        ).join(
            EquipmentSize, (EquipmentSize.equipmentId == Equipment.equipmentId) & 
                           (EquipmentSize.size == UserEquipment.size)
        ).join(
            UserAuthentication, UserAuthentication.cadetId == UserEquipment.cadetId
        ).filter(UserEquipment.status == 'Apdorojama').all()

        # Format the response
        equipment_list = []
        for user_eq, equipment, equipment_size, user in user_equipment:
            sizes_info = [
                {
                    'size': size.size,
                    'equipmentLeft': size.equipmentLeft
                }
                for size in db.session.query(EquipmentSize)
                .filter(EquipmentSize.equipmentId == equipment.equipmentId).all()
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
    
@bp.route('/user-equipment/<int:equipmentId>/status', methods=['PUT'])
@jwt_required()
def update_equipment_status(equipmentId):
    try:
        # Parse the request data
        data = request.get_json()
        if not data or 'status' not in data or 'cadetId' not in data:
            return jsonify({'error': 'Both cadetId and status fields are required'}), 400

        # Validate the new status
        valid_statuses = ['Negauta', 'Apdorojama', 'Gauta', 'Paruošta']
        if data['status'] not in valid_statuses:
            return jsonify({'error': f'Invalid status. Must be one of {valid_statuses}'}), 400

        # Find the UserEquipment entry by equipmentId and cadetId
        user_equipment = UserEquipment.query.filter_by(
            equipmentId=equipmentId, cadetId=data['cadetId']
        ).first()

        if not user_equipment:
            return jsonify({'error': 'Equipment not found for the given cadet'}), 404

        # Retrieve equipment details
        equipment_name = user_equipment.equipment.name if user_equipment.equipment else "Unknown Equipment"

        # Update the status
        user_equipment.status = data['status']
        db.session.commit()

        # Create a notification for the cadet
        notification_type = 'success' if data['status'] == 'Paruošta' else 'fail'
        notification_message = (
            f"Statusas atnaujintas į {data['status']} įrangai: {equipment_name}."
            if notification_type == 'success' else
            f"Statusas pakeistas: {data['status']} įrangai: {equipment_name}. Sekite atnaujinimus."
        )
        notification = Notification(
            cadetId=data['cadetId'],
            type=notification_type,
            title='Įrangos statusas atnaujintas',
            message=notification_message,
            hidden=False
        )
        db.session.add(notification)
        db.session.commit()

        return jsonify({'message': 'Equipment status updated successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update equipment status: {str(e)}'}), 500
