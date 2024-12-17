# Importing the database extension.
from extensions import db

# Database model for storing notifications.
class Notification(db.Model):
    __tablename__ = 'Notification'  # Table name in the database.

    notificationId = db.Column(db.Integer, primary_key=True, autoincrement=True)  # Unique ID for the notification.
    cadetId = db.Column(db.String(14), db.ForeignKey('UserAuthentication.cadetId'))  # ID of the user receiving the notification.
    type = db.Column(db.Enum('info', 'success', 'fail', 'important'), 
                     default='info', nullable=False)  # Type of notification.
    title = db.Column(db.String(255), nullable=False)  # Title or subject of the notification.
    message = db.Column(db.Text)  # Detailed message content.
    hidden = db.Column(db.Boolean, default=False, nullable=False)  # Visibility status of the notification.

    # Relationship to the user who receives the notification.
    user = db.relationship('UserAuthentication', backref='notifications', lazy=True)
