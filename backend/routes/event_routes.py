from flask import Blueprint, jsonify
from datetime import datetime, timedelta
from models import Event

bp = Blueprint('events', __name__)

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
