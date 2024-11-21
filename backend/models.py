from extensions import db

class UserAuthentication(db.Model):
    __tablename__ = 'UserAuthentication'
    cadetId = db.Column(db.String(14), primary_key=True)
    nationalId = db.Column(db.Integer, unique=True, nullable=False)
    
class Event(db.Model):
    __tablename__ = 'Event'
    eventId = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    dateFrom = db.Column(db.DateTime, nullable=False)
    dateTo = db.Column(db.DateTime, nullable=False)
    location = db.Column(db.String(255), nullable=False)
