from flask import Blueprint, jsonify
from models import Event

bp = Blueprint('events', __name__)

@bp.route('/events', methods=['GET'])
def get_events():
    events = Event.query.all()
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
