# Importing the database extension.
from extensions import db

# Database model for exemptions from physical activity.
class ExemptionFromPhysicalActivity(db.Model):
    __tablename__ = 'ExemptionFromPhysicalActivity'  # Table name in the database.

    permissionId = db.Column(db.Integer, primary_key=True)  # Unique ID for the exemption.
    cadetId = db.Column(db.String(14), db.ForeignKey('UserAuthentication.cadetId'))  # Link to the user's ID.
    status = db.Column(db.Enum('Nepatvirtintas', 'Patvirtintas', 'Atšauktas'), 
                       default='Nepatvirtintas', nullable=False)  # Approval status of the exemption.
    dateFrom = db.Column(db.DateTime, nullable=False)  # Start date of the exemption.
    dateTo = db.Column(db.DateTime, nullable=False)  # End date of the exemption.
    documentPhotoUrl = db.Column(db.Text)  # URL of the uploaded document supporting the exemption.
    additionalInformation = db.Column(db.Text)  # Extra details about the exemption.

    # Relationship to the user who requested the exemption.
    user = db.relationship('UserAuthentication', backref=db.backref('exemptions', lazy=True))
