"""
Database Module - SQLAlchemy Configuration and Initialization

Handles database connection, table creation, and connection verification.
Supports both PostgreSQL and SQLite databases.
"""

import os
import logging
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import event, text
from sqlalchemy.engine import Engine
from datetime import datetime

# Configure logging
logger = logging.getLogger(__name__)

# Initialize SQLAlchemy
db = SQLAlchemy()


def init_db(app):
    """
    Initialize database with Flask app.

    - Creates all tables based on models
    - Logs database connection info
    - Performs basic health check

    Args:
        app: Flask application instance (db.init_app should be called before this)
    """
    with app.app_context():
        try:
            # Create all tables
            db.create_all()
            logger.info("✅ Database initialized successfully!")

            # Test connection
            test_connection()

            # Log database info
            log_database_info(app)

        except Exception as e:
            logger.error(f"❌ Database initialization error: {str(e)}")
            raise


def get_db_path():
    """
    Get SQLite database file path.

    Creates the database directory if it doesn't exist.
    Returns a properly formatted SQLite connection string.

    Returns:
        str: SQLite database URI (sqlite:////path/to/db.db)
    """
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    db_dir = os.path.join(base_dir, 'backend', 'database')
    os.makedirs(db_dir, exist_ok=True)

    db_file = os.path.join(db_dir, 'vedic_astrology.db')
    # Convert backslashes to forward slashes for SQLite URI
    db_path = db_file.replace('\\', '/')

    return f"sqlite:///{db_path}"


def test_connection():
    """
    Test database connection.

    Executes a simple query to verify the database is accessible.
    Raises an exception if the connection fails.

    Raises:
        Exception: If database connection fails
    """
    try:
        result = db.session.execute(text("SELECT 1"))
        if result:
            logger.info("✅ Database connection verified!")
            return True
    except Exception as e:
        logger.error(f"❌ Database connection test failed: {str(e)}")
        raise


def log_database_info(app):
    """
    Log database connection information.

    Args:
        app: Flask application instance
    """
    db_uri = app.config.get('SQLALCHEMY_DATABASE_URI', 'Not configured')

    # Mask password in connection string for logging
    if 'postgresql://' in db_uri:
        masked_uri = 'postgresql://[user]:[password]@[host]:[port]/[database]'
    elif 'sqlite:///' in db_uri:
        masked_uri = db_uri
    else:
        masked_uri = 'Unknown database type'

    logger.info(f"📊 Database Connection: {masked_uri}")
    logger.info(f"   Environment: {app.config.get('ENV', 'unknown')}")
    logger.info(f"   Debug Mode: {app.config.get('DEBUG', False)}")


def get_database_stats():
    """
    Get database statistics (table count, row counts, etc.).

    Returns:
        dict: Database statistics
    """
    try:
        # Import models to get table names
        from models import User, Chart, Consultation, PhaseData

        stats = {
            'status': 'connected',
            'tables': {
                'users': User.query.count() if User else 0,
                'charts': Chart.query.count() if Chart else 0,
                'consultations': Consultation.query.count() if Consultation else 0,
                'phase_data': PhaseData.query.count() if PhaseData else 0,
            }
        }
        return stats
    except Exception as e:
        logger.error(f"Error getting database stats: {str(e)}")
        return {
            'status': 'error',
            'message': str(e)
        }


def reset_database():
    """
    Reset the database (drop all tables and recreate them).

    WARNING: This will delete all data!
    Only use in development/testing environments.
    """
    if os.getenv('FLASK_ENV') == 'production':
        logger.error("❌ Cannot reset database in production!")
        raise Exception("Database reset is not allowed in production")

    try:
        logger.warning("⚠️ Resetting database - all data will be deleted!")
        db.drop_all()
        db.create_all()
        logger.info("✅ Database reset successfully!")
        return True
    except Exception as e:
        logger.error(f"❌ Database reset failed: {str(e)}")
        raise


@event.listens_for(Engine, "before_cursor_execute")
def receive_before_cursor_execute(conn, cursor, statement, parameters, context, executemany):
    """Log SQL queries in debug mode."""
    if os.getenv('FLASK_ENV') == 'development':
        logger.debug(f"SQL: {statement}")


@event.listens_for(Engine, "connect")
def receive_connect(dbapi_conn, connection_record):
    """Handle new database connections."""
    logger.debug("New database connection established")
