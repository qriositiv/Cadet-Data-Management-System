from extensions import db

class UserAuthentication(db.Model):
    __tablename__ = 'UserAuthentication'
    cadetId = db.Column(db.String(14), primary_key=True)
    hashedPassword = db.Column(db.String(128), nullable=False)
