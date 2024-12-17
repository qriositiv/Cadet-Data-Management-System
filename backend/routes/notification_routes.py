from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from models import Notification
from extensions import db

# Create a blueprint for notification-related routes.
bp = Blueprint('notifications', __name__)

# Route to get all visible notifications for a specific cadet.
@bp.route('/notifications/<string:cadet_id>', methods=['GET'])
# @jwt_required  # Uncomment this line if authentication is required.
def get_notifications_by_cadet(cadet_id):
    # Query notifications for the given cadet ID that are not hidden.
    notifications = Notification.query.filter_by(cadetId=cadet_id, hidden=False).all()
    
    # Return an empty array if no notifications are found.
    if not notifications:
        return jsonify([]), 200
    
    # Format and return the notifications as a JSON array.
    return jsonify([{
        'notificationId': n.notificationId,
        'cadetId': n.cadetId,
        'type': n.type,
        'title': n.title,
        'message': n.message,
        'hidden': n.hidden
    } for n in notifications]), 200

# Route to hide a specific notification by ID.
@bp.route('/notifications/<int:notification_id>/hide', methods=['PATCH'])
def hide_notification(notification_id):
    # Query the notification by its ID.
    notification = Notification.query.filter_by(notificationId=notification_id).first()
    
    # Return an error message if the notification is not found.
    if not notification:
        return jsonify({'message': 'Notification not found'}), 404
    
    # Set the 'hidden' field to True and save the change to the database.
    notification.hidden = True
    db.session.commit()
    
    return jsonify({'message': f'Notification {notification_id} has been hidden'}), 200
