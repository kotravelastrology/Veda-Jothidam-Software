#!/usr/bin/env python
"""Reset the database (delete all data and recreate tables)."""

import sys
import os
sys.path.insert(0, '.')

from backend.app import create_app
from backend.database import db, get_db_path

def reset_database():
    """Delete all tables and recreate them."""
    db_path = get_db_path().replace('sqlite:///', '')

    print("[INFO] Resetting Database")
    print(f"[INFO] Database: {db_path}")

    app = create_app()

    with app.app_context():
        # Drop all tables
        print("[INFO] Dropping existing tables...")
        db.drop_all()

        # Recreate tables
        print("[INFO] Creating new tables...")
        db.create_all()

        print("[OK] Database reset successfully!")

        # Show tables
        from sqlalchemy import inspect
        inspector = inspect(db.engine)
        tables = inspector.get_table_names()
        print(f"[INFO] Tables created: {', '.join(tables)}")

if __name__ == '__main__':
    reset_database()
