from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from extensions import db
from routes import bp
import os

def create_app():
    app = Flask(__name__)

    # Enable CORS
    CORS(app)

    # Configuration
    UPLOAD_FOLDER = '../frontend/public'
    ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://admin:admin@localhost/CadetDatabase'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['JWT_SECRET_KEY'] = 'zzzxxx'
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = 1800
    app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
    app.config['ALLOWED_EXTENSIONS'] = ALLOWED_EXTENSIONS
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)

    # Initialize extensions
    db.init_app(app)
    JWTManager(app)

    # Register blueprints
    app.register_blueprint(bp)

    return app
