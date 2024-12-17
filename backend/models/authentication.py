from extensions import db

# Database model for user authentication.
class UserAuthentication(db.Model):
    __tablename__ = 'UserAuthentication'  # Table name in the database.
    
    cadetId = db.Column(db.String(14), primary_key=True)  # Unique ID for the user.
    hashedPassword = db.Column(db.String(128), nullable=False)  # Encrypted password.