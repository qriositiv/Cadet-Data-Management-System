# Importing the database extension.
from extensions import db

# Database model for car entry permissions.
class CarEnterPermission(db.Model):
    __tablename__ = 'CarEnterPermission'  # Table name in the database.

    permissionId = db.Column(db.Integer, primary_key=True)  # Unique ID for the permission.
    cadetId = db.Column(db.String(14), db.ForeignKey('UserAuthentication.cadetId'))  # Link to the user's ID.
    status = db.Column(db.Enum('Nepatvirtintas', 'Patvirtintas', 'Atšauktas'), 
                       default='Nepatvirtintas', nullable=False)  # Approval status.
    location = db.Column(db.String(50), db.ForeignKey('Location.location'))  # Link to the location.
    dateFrom = db.Column(db.DateTime, nullable=False)  # Start date of permission.
    dateTo = db.Column(db.DateTime, nullable=False)  # End date of permission.
    carNumber = db.Column(db.String(6))  # License plate number.
    carBrand = db.Column(db.String(50))  # Brand of the car.
    additionalInformation = db.Column(db.Text)  # Extra details, if any.

    # Relationships to other models.
    user = db.relationship('UserAuthentication', backref=db.backref('car_permissions', lazy=True))  # Link to user.
    location_ref = db.relationship('Location', backref=db.backref('car_permissions', lazy=True))  # Link to location.
