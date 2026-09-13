#!/usr/bin/env python3
"""
Database Initialization Script

Initialize and manage the Veda Jothidam database.
Supports creation, testing, and resetting of the database.

Usage:
    python -m backend.init_database --action init
    python -m backend.init_database --action test
    python -m backend.init_database --action reset
    python -m backend.init_database --action stats
"""

import os
import sys
import logging
import argparse
from datetime import datetime

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)


def init_database():
    """Initialize the database."""
    from backend.app import create_app
    from backend.database import init_db, test_connection

    logger.info("=" * 60)
    logger.info("Veda Jothidam Database Initialization")
    logger.info("=" * 60)

    try:
        logger.info("\n1. Creating Flask application...")
        app = create_app()
        logger.info("   ✅ Flask app created")

        logger.info("\n2. Initializing database...")
        with app.app_context():
            init_db(app)
        logger.info("   ✅ Database initialized")

        logger.info("\n3. Testing database connection...")
        with app.app_context():
            test_connection()
        logger.info("   ✅ Connection verified")

        logger.info("\n" + "=" * 60)
        logger.info("✅ Database initialization completed successfully!")
        logger.info("=" * 60)
        return True

    except Exception as e:
        logger.error("\n" + "=" * 60)
        logger.error(f"❌ Database initialization failed: {str(e)}")
        logger.error("=" * 60)
        return False


def test_database():
    """Test database connection."""
    from backend.app import create_app
    from backend.database import test_connection, get_database_stats

    logger.info("=" * 60)
    logger.info("Database Connection Test")
    logger.info("=" * 60)

    try:
        logger.info("\n1. Creating Flask application...")
        app = create_app()
        logger.info("   ✅ Flask app created")

        logger.info("\n2. Testing database connection...")
        with app.app_context():
            test_connection()
        logger.info("   ✅ Connection successful")

        logger.info("\n3. Gathering database statistics...")
        with app.app_context():
            stats = get_database_stats()

        if stats['status'] == 'connected':
            logger.info("   ✅ Database stats retrieved:")
            for table, count in stats['tables'].items():
                logger.info(f"      - {table}: {count} rows")
        else:
            logger.warning(f"   ⚠️ Could not retrieve stats: {stats.get('message')}")

        logger.info("\n" + "=" * 60)
        logger.info("✅ Database test completed successfully!")
        logger.info("=" * 60)
        return True

    except Exception as e:
        logger.error("\n" + "=" * 60)
        logger.error(f"❌ Database test failed: {str(e)}")
        logger.error("=" * 60)
        return False


def reset_database():
    """Reset the database (warning: destructive)."""
    from backend.app import create_app
    from backend.database import reset_database as db_reset

    env = os.getenv('FLASK_ENV', 'development')

    if env == 'production':
        logger.error("=" * 60)
        logger.error("❌ Cannot reset database in production!")
        logger.error("=" * 60)
        return False

    logger.info("=" * 60)
    logger.info("⚠️ WARNING: Database Reset (Destructive Operation)")
    logger.info("=" * 60)
    logger.warning("\n🚨 This will DELETE ALL DATA from the database!")

    # Confirmation prompt
    response = input("\nAre you sure? Type 'yes' to confirm: ")
    if response.lower() != 'yes':
        logger.info("❌ Reset cancelled by user")
        return False

    try:
        logger.info("\n1. Creating Flask application...")
        app = create_app()
        logger.info("   ✅ Flask app created")

        logger.info("\n2. Resetting database...")
        with app.app_context():
            db_reset()
        logger.info("   ✅ Database reset completed")

        logger.info("\n" + "=" * 60)
        logger.info("✅ Database reset completed successfully!")
        logger.info("=" * 60)
        return True

    except Exception as e:
        logger.error("\n" + "=" * 60)
        logger.error(f"❌ Database reset failed: {str(e)}")
        logger.error("=" * 60)
        return False


def show_stats():
    """Show database statistics."""
    from backend.app import create_app
    from backend.database import get_database_stats

    logger.info("=" * 60)
    logger.info("Database Statistics")
    logger.info("=" * 60)

    try:
        logger.info("\n1. Connecting to database...")
        app = create_app()
        logger.info("   ✅ Connected")

        logger.info("\n2. Gathering statistics...")
        with app.app_context():
            stats = get_database_stats()

        if stats['status'] == 'connected':
            logger.info("   ✅ Database Statistics:")
            logger.info("   " + "-" * 40)
            for table, count in stats['tables'].items():
                logger.info(f"   {table:20} : {count:>6} rows")
            logger.info("   " + "-" * 40)
        else:
            logger.error(f"   ❌ Could not retrieve stats: {stats.get('message')}")

        logger.info("\n" + "=" * 60)
        logger.info("✅ Statistics retrieved successfully!")
        logger.info("=" * 60)
        return True

    except Exception as e:
        logger.error("\n" + "=" * 60)
        logger.error(f"❌ Error retrieving statistics: {str(e)}")
        logger.error("=" * 60)
        return False


def main():
    """Main entry point."""
    parser = argparse.ArgumentParser(
        description='Veda Jothidam Database Initialization Tool'
    )
    parser.add_argument(
        '--action',
        choices=['init', 'test', 'reset', 'stats'],
        default='init',
        help='Action to perform (default: init)'
    )

    args = parser.parse_args()

    # Perform action
    if args.action == 'init':
        success = init_database()
    elif args.action == 'test':
        success = test_database()
    elif args.action == 'reset':
        success = reset_database()
    elif args.action == 'stats':
        success = show_stats()
    else:
        logger.error(f"Unknown action: {args.action}")
        success = False

    # Exit with appropriate code
    sys.exit(0 if success else 1)


if __name__ == '__main__':
    main()
