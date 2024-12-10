from flask import Blueprint, jsonify, request
from extensions import db
from datetime import datetime, timedelta
from models import Event

bp = Blueprint('events', __name__)

@bp.route('/events/', methods=['GET'])
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

@bp.route('/events/new', methods=['POST'])
def post_event():
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['title', 'dateFrom', 'dateTo', 'location']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Parse dates
        try:
            date_from = datetime.fromisoformat(data['dateFrom'])
            date_to = datetime.fromisoformat(data['dateTo'])
        except ValueError:
            return jsonify({'error': 'Invalid date format. Please use ISO 8601 format (YYYY-MM-DDTHH:MM:SS)'}), 400
        
        # Create a new event
        new_event = Event(
            title=data['title'],
            dateFrom=date_from,
            dateTo=date_to,
            location=data['location']
        )
        
        # Save to database
        db.session.add(new_event)
        db.session.commit()
        
        return jsonify({'message': 'Event created successfully!', 'eventId': new_event.eventId}), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create event: {str(e)}'}), 500

@bp.route('/events/delete/<int:eventId>', methods=['DELETE'])
def delete_event(eventId):
    try:
        # Fetch the event by eventId
        event = Event.query.get(eventId)
        
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        
        # Delete the event from the database
        db.session.delete(event)
        db.session.commit()
        
        return jsonify({'message': f'Event with ID {eventId} deleted successfully!'}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete event: {str(e)}'}), 500