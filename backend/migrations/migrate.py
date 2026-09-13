#!/usr/bin/env python
"""
Database Migration Runner for Veda Jothidam
Handles database schema initialization and migrations
"""

import os
import sys
import psycopg2
from psycopg2 import sql
from pathlib import Path
import argparse
from datetime import datetime
import logging

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

class DatabaseMigrator:
    def __init__(self, database_url=None):
        """Initialize database migrator"""
        self.database_url = database_url or os.getenv('DATABASE_URL')
        if not self.database_url:
            # Default to local PostgreSQL
            self.database_url = 'postgresql://postgres:postgres@localhost:5432/vedic_astrology'

        self.conn = None
        self.cur = None

    def connect(self):
        """Connect to the database"""
        try:
            logger.info(f"Connecting to database: {self.database_url.split('@')[1] if '@' in self.database_url else 'local'}")
            self.conn = psycopg2.connect(self.database_url)
            self.cur = self.conn.cursor()
            logger.info("✅ Database connection successful")
            return True
        except psycopg2.Error as e:
            logger.error(f"❌ Database connection failed: {e}")
            return False

    def disconnect(self):
        """Disconnect from the database"""
        if self.cur:
            self.cur.close()
        if self.conn:
            self.conn.close()
        logger.info("Database connection closed")

    def create_database(self, db_name="vedic_astrology"):
        """Create the database if it doesn't exist"""
        try:
            conn = psycopg2.connect(
                self.database_url.replace(f'/{db_name}', '/postgres')
            )
            conn.autocommit = True
            cur = conn.cursor()

            # Check if database exists
            cur.execute(
                "SELECT 1 FROM pg_database WHERE datname = %s",
                (db_name,)
            )

            if not cur.fetchone():
                logger.info(f"Creating database: {db_name}")
                cur.execute(sql.SQL("CREATE DATABASE {}").format(
                    sql.Identifier(db_name)
                ))
                logger.info(f"✅ Database '{db_name}' created successfully")
            else:
                logger.info(f"Database '{db_name}' already exists")

            cur.close()
            conn.close()
            return True
        except psycopg2.Error as e:
            logger.error(f"❌ Error creating database: {e}")
            return False

    def run_migration(self, migration_file):
        """Run a single migration file"""
        try:
            logger.info(f"Running migration: {migration_file}")

            with open(migration_file, 'r') as f:
                sql_script = f.read()

            # Execute the migration
            self.cur.execute(sql_script)
            self.conn.commit()

            logger.info(f"✅ Migration completed: {migration_file}")
            return True
        except psycopg2.Error as e:
            self.conn.rollback()
            logger.error(f"❌ Migration failed: {e}")
            return False

    def run_all_migrations(self, migrations_dir):
        """Run all migration files in a directory"""
        migrations_path = Path(migrations_dir)
        migration_files = sorted(migrations_path.glob('*.sql'))

        if not migration_files:
            logger.warning("No migration files found")
            return False

        logger.info(f"Found {len(migration_files)} migration(s)")

        for migration_file in migration_files:
            if not self.run_migration(str(migration_file)):
                return False

        return True

    def verify_schema(self):
        """Verify that all tables were created successfully"""
        try:
            logger.info("Verifying database schema...")

            # Check for tables
            self.cur.execute("""
                SELECT tablename FROM pg_tables
                WHERE schemaname = 'public'
                ORDER BY tablename;
            """)

            tables = self.cur.fetchall()
            logger.info(f"✅ Found {len(tables)} tables:")

            expected_tables = ['users', 'charts', 'consultations']
            found_tables = [table[0] for table in tables]

            for table in found_tables:
                logger.info(f"   • {table}")

            # Verify each table structure
            for table in expected_tables:
                if table in found_tables:
                    self.cur.execute(f"""
                        SELECT column_name, data_type
                        FROM information_schema.columns
                        WHERE table_name = '{table}'
                        ORDER BY ordinal_position;
                    """)
                    columns = self.cur.fetchall()
                    logger.info(f"   Table '{table}' ({len(columns)} columns):")
                    for col_name, col_type in columns:
                        logger.info(f"      - {col_name}: {col_type}")
                else:
                    logger.warning(f"   ⚠️ Expected table '{table}' not found")

            return len(found_tables) >= len(expected_tables)
        except psycopg2.Error as e:
            logger.error(f"❌ Schema verification failed: {e}")
            return False

    def test_connection(self):
        """Test database connection and basic operations"""
        try:
            logger.info("Testing database connection...")

            # Test basic query
            self.cur.execute("SELECT version();")
            version = self.cur.fetchone()
            logger.info(f"✅ PostgreSQL Version: {version[0]}")

            # Test UUID support
            self.cur.execute("SELECT uuid_generate_v4();")
            uuid = self.cur.fetchone()
            logger.info(f"✅ UUID Support: {uuid[0]}")

            return True
        except psycopg2.Error as e:
            logger.error(f"❌ Connection test failed: {e}")
            return False

def main():
    """Main entry point"""
    parser = argparse.ArgumentParser(
        description='Veda Jothidam Database Migration Tool'
    )
    parser.add_argument(
        '--action',
        choices=['create-db', 'migrate', 'verify', 'test', 'full'],
        default='full',
        help='Action to perform'
    )
    parser.add_argument(
        '--database-url',
        help='Database URL (overrides DATABASE_URL env var)'
    )
    parser.add_argument(
        '--migrations-dir',
        default=os.path.dirname(__file__),
        help='Path to migrations directory'
    )

    args = parser.parse_args()

    logger.info("=" * 70)
    logger.info("Veda Jothidam Database Migration Tool")
    logger.info("=" * 70)

    migrator = DatabaseMigrator(args.database_url)

    try:
        # Full workflow
        if args.action in ['full', 'create-db']:
            logger.info("\n[Step 1] Creating database...")
            if not migrator.create_database():
                return 1

        # Connect to database
        logger.info("\n[Step 2] Connecting to database...")
        if not migrator.connect():
            return 1

        # Run migrations
        if args.action in ['full', 'migrate']:
            logger.info("\n[Step 3] Running migrations...")
            if not migrator.run_all_migrations(args.migrations_dir):
                return 1

        # Test connection
        if args.action in ['full', 'test']:
            logger.info("\n[Step 4] Testing database connection...")
            if not migrator.test_connection():
                return 1

        # Verify schema
        if args.action in ['full', 'verify']:
            logger.info("\n[Step 5] Verifying schema...")
            if not migrator.verify_schema():
                return 1

        logger.info("\n" + "=" * 70)
        logger.info("✅ All database operations completed successfully!")
        logger.info("=" * 70)
        return 0

    finally:
        migrator.disconnect()

if __name__ == '__main__':
    sys.exit(main())
