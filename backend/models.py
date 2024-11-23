from extensions import db

class UserAuthentication(db.Model):
    __tablename__ = 'UserAuthentication'
    cadetId = db.Column(db.String(14), primary_key=True)
    nationalId = db.Column(db.BigInteger, unique=True, nullable=False)

    
class UserProfileData(db.Model):
    __tablename__ = 'UserProfileData'

    cadetId = db.Column(db.String(14), db.ForeignKey('UserAuthentication.cadetId'), primary_key=True)
    dateOfBirth = db.Column(db.Date, nullable=False)
    fullName = db.Column(db.String(255), nullable=False)
    photoUrl = db.Column(db.Text)
    phoneNumber = db.Column(db.String(20))
    email = db.Column(db.String(255), unique=True)
    address = db.Column(db.Text)
    bloodType = db.Column(db.Enum('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'), nullable=False)
    gender = db.Column(db.Enum('Vyras', 'Moteris', 'Nenuroditas'), nullable=False)
    heightCm = db.Column(db.Numeric(5, 2))
    weightKg = db.Column(db.Numeric(5, 2))
    allergies = db.Column(db.Text)
    medicalConditions = db.Column(db.Text)
    baseLocation = db.Column(db.String(50))
    status = db.Column(db.Enum('ppkt/pkt', 'intendantas'), default='ppkt/pkt')

    # Relationship with UserAuthentication
    authentication = db.relationship(
        'UserAuthentication',
        backref=db.backref('profile', lazy=True),
        primaryjoin='UserProfileData.cadetId == UserAuthentication.cadetId'
    )
    
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
    status = db.Column(db.String(14), nullable=False)
    location = db.Column(db.String(255))
    dateFrom = db.Column(db.DateTime, nullable=False)
    dateTo = db.Column(db.DateTime, nullable=False)
    carNumber = db.Column(db.String(20))
    carBrand = db.Column(db.String(14))
    additionalInformation = db.Column(db.Text)

class ExemptionFromPhysicalActivity(db.Model):
    __tablename__ = 'ExemptionFromPhysicalActivity'

    permissionId = db.Column(db.Integer, primary_key=True)
    cadetId = db.Column(db.String(14), db.ForeignKey('UserAuthentication.cadetId'))
    status = db.Column(db.String(14), nullable=False)
    dateFrom = db.Column(db.DateTime, nullable=False)
    dateTo = db.Column(db.DateTime, nullable=False)
    documentPhotoUrl = db.Column(db.Text)
    additionalInformation = db.Column(db.Text)
    
class UserEquipment(db.Model):
    __tablename__ = 'UserEquipment'

    cadetId = db.Column(db.String(14), db.ForeignKey('UserAuthentication.cadetId'), primary_key=True)
    equipmentId = db.Column(db.Integer, db.ForeignKey('Equipment.equipmentId'), primary_key=True)
    status = db.Column(db.String(14))
    size = db.Column(db.String(5), db.ForeignKey('EquipmentSize.size'), nullable=False)
    dateGiven = db.Column(db.DateTime, nullable=False)

    # Relationships
    equipment = db.relationship('Equipment', backref='user_equipment')
    equipment_size = db.relationship('EquipmentSize', backref='user_equipment_size', foreign_keys=[size])

    def __init__(self, cadetId, equipmentId, status, size, dateGiven):
        self.cadetId = cadetId
        self.equipmentId = equipmentId
        self.status = status
        self.size = size
        self.dateGiven = dateGiven


class Equipment(db.Model):
    __tablename__ = 'Equipment'

    equipmentId = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    photoUrl = db.Column(db.String(200))

    def __init__(self, name, photoUrl):
        self.name = name
        self.photoUrl = photoUrl


class EquipmentSize(db.Model):
    __tablename__ = 'EquipmentSize'

    equipmentId = db.Column(db.Integer, db.ForeignKey('Equipment.equipmentId'), primary_key=True)
    size = db.Column(db.String(5), primary_key=True)

    # Relationship to the Equipment table
    equipment = db.relationship('Equipment', backref='equipment_size')

    def __init__(self, equipmentId, size):
        self.equipmentId = equipmentId
        self.size = size

