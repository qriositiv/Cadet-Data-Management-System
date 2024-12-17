from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required
from extensions import db
from datetime import datetime, timedelta
from models import Event

# Create a blueprint for event-related routes.
bp = Blueprint('events', __name__)

# Route to get all upcoming events.
@bp.route('/events/', methods=['GET'])
def get_events():
    # Get the current time adjusted for timezone (UTC+2).
    now = datetime.utcnow() + timedelta(hours=2)
    
    # Query all events ending after the current time, sorted by start time.
    events = Event.query.filter(Event.dateTo > now).order_by(Event.dateFrom).all()
    
    # Format event data into a list of dictionaries.
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

# Route to create a new event.
@bp.route('/events/new', methods=['POST'])
@jwt_required()
def post_event():
    try:
        # Parse JSON data from the request.
        data = request.get_json()
        
        # Validate that all required fields are present and not empty.
        required_fields = ['title', 'dateFrom', 'dateTo', 'location']
        for field in required_fields:
            if field not in data or not data[field]:
                return jsonify({'error': f'{field} is required'}), 400
        
        # Parse the date fields from the input.
        try:
            date_from = datetime.fromisoformat(data['dateFrom'])
            date_to = datetime.fromisoformat(data['dateTo'])
        except ValueError:
            return jsonify({'error': 'Invalid date format. Use ISO 8601 (YYYY-MM-DDTHH:MM:SS)'}), 400
        
        # Create a new event instance.
        new_event = Event(
            title=data['title'],
            dateFrom=date_from,
            dateTo=date_to,
            location=data['location']
        )
        
        # Save the event to the database.
        db.session.add(new_event)
        db.session.commit()
        
        return jsonify({'message': 'Event created successfully!', 'eventId': new_event.eventId}), 201
    
    except Exception as e:
        db.session.rollback()  # Rollback the transaction in case of an error.
        return jsonify({'error': f'Failed to create event: {str(e)}'}), 500

# Route to delete an event by its ID.
@bp.route('/events/delete/<int:eventId>', methods=['DELETE'])
@jwt_required()
def delete_event(eventId):
    try:
        # Fetch the event by its ID.
        event = Event.query.get(eventId)
        
        if not event:
            return jsonify({'error': 'Event not found'}), 404
        
        # Delete the event from the database.
        db.session.delete(event)
        db.session.commit()
        
        return jsonify({'message': f'Event with ID {eventId} deleted successfully!'}), 200
    
    except Exception as e:
        db.session.rollback()  # Rollback the transaction in case of an error.
        return jsonify({'error': f'Failed to delete event: {str(e)}'}), 500
