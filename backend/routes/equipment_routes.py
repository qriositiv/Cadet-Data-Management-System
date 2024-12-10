from flask import Blueprint, jsonify, request
from models import UserEquipment, Equipment, EquipmentSize
from extensions import db

bp = Blueprint('equipment', __name__)

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
                sizes = [
                    es.size for es in db.session.query(EquipmentSize)
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
