"""
Database Migrations Package for Veda Jothidam

This package manages database schema migrations for the Vedic Astrology Platform.

Usage:
    python -m backend.migrations.migrate --action full
    python -m backend.migrations.migrate --action migrate
    python -m backend.migrations.migrate --action verify
"""

from .migrate import DatabaseMigrator

__all__ = ['DatabaseMigrator']
