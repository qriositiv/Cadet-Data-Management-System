from extensions import db

class Equipment(db.Model):
    __tablename__ = 'Equipment'

    equipmentId = db.Column(db.Integer, primary_key=True)
    photoUrl = db.Column(db.Text)
    name = db.Column(db.String(255), nullable=False)

class EquipmentSize(db.Model):
    __tablename__ = 'EquipmentSize'

    equipmentId = db.Column(db.Integer, db.ForeignKey('Equipment.equipmentId'), primary_key=True)
    size = db.Column(db.String(5), primary_key=True)

    equipment = db.relationship('Equipment', backref=db.backref('sizes', lazy=True))

class UserEquipment(db.Model):
    __tablename__ = 'UserEquipment'

    cadetId = db.Column(db.String(14), db.ForeignKey('UserAuthentication.cadetId'), primary_key=True)
    equipmentId = db.Column(db.Integer, db.ForeignKey('Equipment.equipmentId'), primary_key=True)
    status = db.Column(db.Enum('Negauta', 'Apdorojama', 'Gauta', 'Paruošta'), default='Negauta', nullable=False)
    size = db.Column(db.String(5), db.ForeignKey('EquipmentSize.size'), nullable=False)
    dateGiven = db.Column(db.DateTime, nullable=False)

    user = db.relationship('UserAuthentication', backref=db.backref('equipment', lazy=True))
    equipment = db.relationship('Equipment', backref=db.backref('user_equipments', lazy=True))
    equipment_size = db.relationship('EquipmentSize', backref=db.backref('user_equipments', lazy=True))
