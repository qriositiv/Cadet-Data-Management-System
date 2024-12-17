# Importing the database extension.
from extensions import db

# Database model for storing location details.
class Location(db.Model):
    __tablename__ = 'Location'  # Table name in the database.

    location = db.Column(db.String(50), primary_key=True)  # Unique name or identifier for the location.
