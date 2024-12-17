# Importing the database extension.
from extensions import db

# Database model for storing equipment details.
class Equipment(db.Model):
    __tablename__ = 'Equipment'  # Table name in the database.

    equipmentId = db.Column(db.Integer, primary_key=True)  # Unique ID for the equipment.
    photoUrl = db.Column(db.Text)  # URL for a photo of the equipment.
    name = db.Column(db.String(255), nullable=False)  # Name of the equipment.

# Database model for storing equipment sizes.
class EquipmentSize(db.Model):
    __tablename__ = 'EquipmentSize'  # Table name in the database.

    size = db.Column(db.String(5), primary_key=True)  # Size of the equipment.
    equipmentId = db.Column(db.Integer, db.ForeignKey('Equipment.equipmentId'), primary_key=True)  # Link to the equipment.
    equipmentLeft = db.Column(db.Integer, nullable=True)  # Quantity of equipment left in this size.

    # Relationship linking sizes to equipment.
    equipment = db.relationship('Equipment', backref=db.backref('sizes', lazy=True))

# Database model for tracking user-issued equipment.
class UserEquipment(db.Model):
    __tablename__ = 'UserEquipment'  # Table name in the database.

    cadetId = db.Column(db.String(14), db.ForeignKey('UserAuthentication.cadetId'), primary_key=True)  # User ID.
    equipmentId = db.Column(db.Integer, db.ForeignKey('Equipment.equipmentId'), primary_key=True)  # Equipment ID.
    status = db.Column(db.Enum('Negauta', 'Apdorojama', 'Gauta', 'Paruošta'), 
                       default='Negauta', nullable=False)  # Status of equipment issuance.
    size = db.Column(db.String(5), db.ForeignKey('EquipmentSize.size'), nullable=False)  # Size of the equipment issued.
    dateGiven = db.Column(db.DateTime, nullable=False)  # Date the equipment was given.

    # Relationships linking the user, equipment, and size.
    user = db.relationship('UserAuthentication', backref=db.backref('equipment', lazy=True))
    equipment = db.relationship('Equipment', backref=db.backref('user_equipments', lazy=True))
    equipment_size = db.relationship('EquipmentSize', backref=db.backref('user_equipments', lazy=True))
