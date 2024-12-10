from extensions import db

class UserDisciplineResult(db.Model):
    __tablename__ = 'UserDisciplineResult'
    cadetId = db.Column(db.String(14), db.ForeignKey('UserAuthentication.cadetId'), primary_key=True)
    disciplineId = db.Column(db.Integer, db.ForeignKey('Discipline.disciplineId'), primary_key=True)
    result = db.Column(db.Float, nullable=False)

class Discipline(db.Model):
    __tablename__ = 'Discipline'
    disciplineId = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    controlForMale = db.Column(db.Float)
    controlForFemale = db.Column(db.Float)
    needMore = db.Column(db.Boolean)
