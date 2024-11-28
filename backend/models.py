from extensions import db

class UserAuthentication(db.Model):
    __tablename__ = 'UserAuthentication'
    cadetId = db.Column(db.String(14), primary_key=True)
    nationalId = db.Column(db.String(11), unique=True, nullable=False)

class Location(db.Model):
    __tablename__ = 'Location'
    location = db.Column(db.String(50), primary_key=True)

class UserProfileData(db.Model):
    __tablename__ = 'UserProfileData'

    cadetId = db.Column(db.String(14), db.ForeignKey('UserAuthentication.cadetId'), primary_key=True)
    dateOfBirth = db.Column(db.Date, nullable=False)
    fullName = db.Column(db.String(255), nullable=False)
    photoUrl = db.Column(db.Text)
    phoneNumber = db.Column(db.String(12))
    email = db.Column(db.String(255), unique=True)
    address = db.Column(db.Text)
    bloodType = db.Column(db.Enum('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'), nullable=False)
    gender = db.Column(db.Enum('Vyras', 'Moteris', 'Nenuroditas'), default='Nenuroditas', nullable=False)
    heightCm = db.Column(db.Numeric(5, 2))
    weightKg = db.Column(db.Numeric(5, 2))
    allergies = db.Column(db.Text)
    medicalConditions = db.Column(db.Text)
    baseLocation = db.Column(db.String(50), db.ForeignKey('Location.location'))
    status = db.Column(db.Enum('-', 'ppkt', 'pkt', 'intendantas'), default='-', nullable=False)

    authentication = db.relationship('UserAuthentication', backref=db.backref('profile', lazy=True))
    location = db.relationship('Location', backref=db.backref('users', lazy=True))

class Event(db.Model):
    __tablename__ = 'Event'
    eventId = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    dateFrom = db.Column(db.DateTime, nullable=False)
    dateTo = db.Column(db.DateTime, nullable=False)
    location = db.Column(db.String(255), nullable=False)

class CarEnterPermission(db.Model):
    __tablename__ = 'CarEnterPermission'

    permissionId = db.Column(db.Integer, primary_key=True)
    cadetId = db.Column(db.String(14), db.ForeignKey('UserAuthentication.cadetId'))
    status = db.Column(db.Enum('Nepatvirtintas', 'Patvirtintas', 'Atšauktas'), default='Nepatvirtintas', nullable=False)
    location = db.Column(db.String(50), db.ForeignKey('Location.location'))
    dateFrom = db.Column(db.DateTime, nullable=False)
    dateTo = db.Column(db.DateTime, nullable=False)
    carNumber = db.Column(db.String(6))
    carBrand = db.Column(db.String(50))
    additionalInformation = db.Column(db.Text)

    user = db.relationship('UserAuthentication', backref=db.backref('car_permissions', lazy=True))
    location_ref = db.relationship('Location', backref=db.backref('car_permissions', lazy=True))

class ExemptionFromPhysicalActivity(db.Model):
    __tablename__ = 'ExemptionFromPhysicalActivity'

    permissionId = db.Column(db.Integer, primary_key=True)
    cadetId = db.Column(db.String(14), db.ForeignKey('UserAuthentication.cadetId'))
    status = db.Column(db.Enum('Nepatvirtintas', 'Patvirtintas', 'Atšauktas'), default='Nepatvirtintas', nullable=False)
    dateFrom = db.Column(db.DateTime, nullable=False)
    dateTo = db.Column(db.DateTime, nullable=False)
    documentPhotoUrl = db.Column(db.Text)
    additionalInformation = db.Column(db.Text)

    user = db.relationship('UserAuthentication', backref=db.backref('exemptions', lazy=True))

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

class UserDisciplineResult(db.Model):
    __tablename__ = 'UserDisciplineResult'
    cadetId = db.Column(db.String(14), db.ForeignKey('UserAuthentication.cadetId'), primary_key=True)
    disciplineId = db.Column(db.Integer, db.ForeignKey('Discipline.disciplineId'), primary_key=True)
    result = db.Column(db.Float, nullable=False)

class Discipline(db.Model):
    __tablename__ = 'Discipline'
    disciplineId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    controlForMale = db.Column(db.Float)
    controlForFemale = db.Column(db.Float)
    needMore = db.Column(db.Boolean)
