from extensions import db

class Location(db.Model):
    __tablename__ = 'Location'
    location = db.Column(db.String(50), primary_key=True)
