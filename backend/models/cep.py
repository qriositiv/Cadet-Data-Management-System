from extensions import db

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
