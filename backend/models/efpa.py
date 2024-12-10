from extensions import db

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
