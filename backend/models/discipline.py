# Importing the database extension.
from extensions import db

# Database model to store a user's discipline results.
class UserDisciplineResult(db.Model):
    __tablename__ = 'UserDisciplineResult'  # Table name in the database.
    
    cadetId = db.Column(db.String(14), db.ForeignKey('UserAuthentication.cadetId'), primary_key=True)  # User ID.
    disciplineId = db.Column(db.Integer, db.ForeignKey('Discipline.disciplineId'), primary_key=True)  # Discipline ID.
    result = db.Column(db.Float, nullable=False)  # User's result in the discipline.

# Database model to store discipline details.
class Discipline(db.Model):
    __tablename__ = 'Discipline'  # Table name in the database.
    
    disciplineId = db.Column(db.Integer, primary_key=True, autoincrement=True)  # Unique ID for the discipline.
    name = db.Column(db.String(100), nullable=False)  # Name of the discipline.
    controlForMale = db.Column(db.Float)  # Standard control value for males.
    controlForFemale = db.Column(db.Float)  # Standard control value for females.
    needMore = db.Column(db.Boolean)  # Indicates if more training is needed.
