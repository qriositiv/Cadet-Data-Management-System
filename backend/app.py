from flask import Flask
from flask_cors import CORS
from extensions import db
from routes import bp

def create_app():
    app = Flask(__name__)

    CORS(app)

    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://admin:admin@localhost/CadetDatabase'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)

    app.register_blueprint(bp)

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True)
