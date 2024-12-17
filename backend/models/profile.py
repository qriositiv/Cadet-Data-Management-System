# Importing the database extension.
from extensions import db

# Database model for storing user profile data.
class UserProfileData(db.Model):
    __tablename__ = 'UserProfileData'  # Table name in the database.

    cadetId = db.Column(db.String(14), db.ForeignKey('UserAuthentication.cadetId'), primary_key=True)  # User ID.
    dateOfBirth = db.Column(db.Date, nullable=False)  # Date of birth.
    fullName = db.Column(db.String(255), nullable=False)  # Full name of the user.
    photoUrl = db.Column(db.Text)  # URL of the user's profile photo.
    phoneNumber = db.Column(db.String(12))  # Contact phone number.
    email = db.Column(db.String(255), unique=True)  # Email address (must be unique).
    address = db.Column(db.Text)  # Home address.
    bloodType = db.Column(db.Enum('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'), nullable=False)  # Blood type.
    gender = db.Column(db.Enum('Vyras', 'Moteris', 'Nenuroditas'), default='Nenuroditas', nullable=False)  # Gender.
    heightCm = db.Column(db.Numeric(5, 2))  # Height in centimeters.
    weightKg = db.Column(db.Numeric(5, 2))  # Weight in kilograms.
    allergies = db.Column(db.Text)  # Known allergies.
    medicalConditions = db.Column(db.Text)  # Medical conditions.
    baseLocation = db.Column(db.String(50), db.ForeignKey('Location.location'))  # User's base location.
    status = db.Column(db.Enum('-', 'ppkt', 'pkt', 'intendantas'), default='-', nullable=False)  # Status of the user.

    # Relationship to user authentication data.
    authentication = db.relationship('UserAuthentication', backref=db.backref('profile', lazy=True))
    
    # Relationship to location data.
    location = db.relationship('Location', backref=db.backref('users', lazy=True))
