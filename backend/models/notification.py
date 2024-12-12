from extensions import db

class Notification(db.Model):
    __tablename__ = 'Notification'
    
    notificationId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    cadetId = db.Column(db.String(14), db.ForeignKey('UserAuthentication.cadetId'))
    type = db.Column(db.Enum('info', 'success', 'fail', 'important'), default='info', nullable=False)
    title = db.Column(db.String(255), nullable=False)
    message = db.Column(db.Text)
    hidden = db.Column(db.Boolean, default=False, nullable=False)

    # Relationship to UserAuthentication if needed
    user = db.relationship('UserAuthentication', backref='notifications', lazy=True)
