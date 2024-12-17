# Importing the database extension.
from extensions import db

# Database model for storing event details.
class Event(db.Model):
    __tablename__ = 'Event'  # Table name in the database.

    eventId = db.Column(db.Integer, primary_key=True)  # Unique ID for the event.
    title = db.Column(db.String(255), nullable=False)  # Title or name of the event.
    dateFrom = db.Column(db.DateTime, nullable=False)  # Start date and time of the event.
    dateTo = db.Column(db.DateTime, nullable=False)  # End date and time of the event.
    location = db.Column(db.String(255), nullable=False)  # Location where the event is held.
