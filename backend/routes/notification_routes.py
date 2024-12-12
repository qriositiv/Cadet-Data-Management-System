from flask import Blueprint, jsonify
from flask_jwt_extended import jwt_required
from models import Notification
from extensions import db

bp = Blueprint('notifications', __name__)

@bp.route('/notifications/<string:cadet_id>', methods=['GET'])
# @jwt_required
def get_notifications_by_cadet(cadet_id):
    notifications = Notification.query.filter_by(cadetId=cadet_id, hidden=False).all()
    # Return an empty array if no notifications are found
    if not notifications:
        return jsonify([]), 200
    # Return the notifications as a list of JSON objects
    return jsonify([{
        'notificationId': n.notificationId,
        'cadetId': n.cadetId,
        'type': n.type,
        'title': n.title,
        'message': n.message,
        'hidden': n.hidden
    } for n in notifications]), 200

@bp.route('/notifications/<int:notification_id>/hide', methods=['PATCH'])
def hide_notification(notification_id):
    # Query the notification by ID
    notification = Notification.query.filter_by(notificationId=notification_id).first()
    
    if not notification:
        return jsonify({'message': 'Notification not found'}), 404
    
    # Update the 'hidden' field to True
    notification.hidden = True
    db.session.commit()
    
    return jsonify({'message': f'Notification {notification_id} has been hidden'}), 200
