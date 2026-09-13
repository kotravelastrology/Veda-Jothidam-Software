import os
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

def init_db(app):
    """Initialize database with Flask app."""
    db.init_app(app)

    with app.app_context():
        db.create_all()
        print("[OK] Database initialized successfully!")

def get_db_path():
    """Get database file path."""
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    db_dir = os.path.join(base_dir, 'backend', 'database')
    os.makedirs(db_dir, exist_ok=True)
    return f"sqlite:///{os.path.join(db_dir, 'taara_vedic.db').replace(chr(92), '/')}"
