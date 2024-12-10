from flask import Blueprint

# Import individual route blueprints
from .auth_routes import bp as auth_bp
from .profile_routes import bp as profile_bp
from .event_routes import bp as event_bp
from .permission_routes import bp as permission_bp
from .equipment_routes import bp as equipment_bp
from .location_routes import bp as location_bp
from .discipline_routes import bp as discipline_bp

# Create a main blueprint to aggregate all routes
bp = Blueprint('api', __name__)

# Register individual blueprints with prefixes
bp.register_blueprint(auth_bp)
bp.register_blueprint(profile_bp)
bp.register_blueprint(event_bp)
bp.register_blueprint(permission_bp)
bp.register_blueprint(equipment_bp)
bp.register_blueprint(location_bp)
bp.register_blueprint(discipline_bp)
