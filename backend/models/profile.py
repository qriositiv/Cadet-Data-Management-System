from extensions import db

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
