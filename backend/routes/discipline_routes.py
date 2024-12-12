from flask import Blueprint, jsonify, request
from datetime import datetime
from flask_jwt_extended import jwt_required
from models import UserProfileData, Discipline, UserDisciplineResult
from extensions import db

bp = Blueprint('discipline', __name__)

@bp.route('/user-discipline-results/<string:cadet_id>', methods=['GET'])
@jwt_required()
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
@jwt_required()
def get_disciplines():
    disciplines = Discipline.query.all()

    result = []
    for discipline in disciplines:
        result.append({
            'disciplineId': discipline.disciplineId,
            'name': discipline.name,
            'controlForMale': discipline.controlForMale,
            'controlForFemale': discipline.controlForFemale,
            'controlValue': discipline.controlForMale + discipline.controlForFemale
        })

    return jsonify(result)

@bp.route('/user-discipline-results', methods=['PUT'])
@jwt_required()
def update_user_discipline_result():
    try:
        # Parse the request data
        data = request.get_json()
        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Validate required fields
        required_fields = ['cadetId', 'disciplineId', 'result']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400

        # Fetch the existing result
        user_discipline_result = UserDisciplineResult.query.filter_by(
            cadetId=data['cadetId'],
            disciplineId=data['disciplineId']
        ).first()

        if not user_discipline_result:
            return jsonify({'error': 'Discipline result not found for the specified cadet'}), 404

        # Update the result
        user_discipline_result.result = data['result']
        db.session.commit()

        return jsonify({'message': 'Discipline result updated successfully'}), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update discipline result: {str(e)}'}), 500