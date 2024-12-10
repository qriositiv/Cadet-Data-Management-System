from flask import Blueprint, jsonify
from datetime import datetime
from models import UserProfileData, Discipline, UserDisciplineResult
from extensions import db

bp = Blueprint('discipline', __name__)

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
