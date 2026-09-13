"""
Configuration management for security and environment variables.
Loads and validates all configuration from environment.
"""

import os
import secrets
from datetime import timedelta
from typing import List

class Config:
    """Base configuration."""

    # Flask
    FLASK_ENV = os.getenv('FLASK_ENV', 'development')
    DEBUG = FLASK_ENV == 'development'
    TESTING = False

    # Database
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = False if FLASK_ENV == 'production' else True

    # JWT Configuration
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(minutes=15)  # 15 minutes (from 30 days)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=7)     # 7 days
    JWT_ALGORITHM = 'HS256'

    # Security Headers
    SECURE_HSTS_SECONDS = 31536000  # 1 year
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_SSL_REDIRECT = FLASK_ENV == 'production'

    # Cookies
    SESSION_COOKIE_SECURE = FLASK_ENV == 'production'
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'
    SESSION_COOKIE_NAME = '__Secure-session' if SESSION_COOKIE_SECURE else 'session'
    PERMANENT_SESSION_LIFETIME = timedelta(hours=24)

    # CORS
    CORS_ORIGINS = os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000,http://localhost:5000').split(',')
    CORS_ALLOW_HEADERS = [
        'Content-Type',
        'Authorization',
        'X-CSRF-Token',
        'Accept',
        'Accept-Language'
    ]
    CORS_EXPOSE_HEADERS = [
        'X-RateLimit-Limit',
        'X-RateLimit-Remaining',
        'X-RateLimit-Reset'
    ]
    CORS_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    CORS_MAX_AGE = int(os.getenv('CORS_MAX_AGE', '3600'))
    CORS_ALLOW_CREDENTIALS = os.getenv('CORS_ALLOW_CREDENTIALS', 'true').lower() == 'true'

    # Rate Limiting
    RATELIMIT_ENABLED = True
    RATELIMIT_STORAGE_URL = os.getenv('REDIS_URL', 'memory://')
    RATELIMIT_DEFAULT = "100/hour"  # Global default

    # Specific rate limits
    RATELIMIT_LOGIN = "5/15min"        # 5 attempts per 15 minutes
    RATELIMIT_SIGNUP = "3/hour"        # 3 attempts per hour
    RATELIMIT_CHART_CREATE = "10/hour" # 10 charts per hour per user
    RATELIMIT_UPLOAD = "5/hour"        # 5 uploads per hour per user

    # Password Policy
    PASSWORD_MIN_LENGTH = 12
    PASSWORD_REQUIRE_UPPERCASE = True
    PASSWORD_REQUIRE_LOWERCASE = True
    PASSWORD_REQUIRE_NUMBERS = True
    PASSWORD_REQUIRE_SPECIAL = True
    PASSWORD_EXPIRY_DAYS = 90
    PASSWORD_HISTORY_COUNT = 5
    PASSWORD_BCRYPT_ROUNDS = 12

    # Login Policy
    MAX_LOGIN_ATTEMPTS = 5
    LOGIN_LOCKOUT_MINUTES = 15

    # Logging
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FORMAT = 'json'  # 'json' or 'text'
    LOG_FILE = os.getenv('LOG_FILE', 'backend/logs/app.log')

    # Security
    CSRF_ENABLED = True
    CSRF_COOKIE_SECURE = SESSION_COOKIE_SECURE
    CSRF_COOKIE_HTTPONLY = False  # Needs to be accessible to JavaScript
    CSRF_COOKIE_SAMESITE = 'Lax'
    CSRF_PROTECTION_METHODS = ['POST', 'PUT', 'DELETE', 'PATCH']

    # Content Security Policy
    CONTENT_SECURITY_POLICY = {
        'default-src': "'self'",
        'script-src': "'self' 'unsafe-inline' 'unsafe-eval'",  # Relax for development
        'style-src': "'self' 'unsafe-inline'",
        'img-src': "'self' data: https:",
        'font-src': "'self'",
        'connect-src': "'self'",
        'frame-ancestors': "'none'",
        'base-uri': "'self'",
        'form-action': "'self'",
    }

    @staticmethod
    def validate():
        """Validate required environment variables."""
        required_vars = [
            'JWT_SECRET_KEY',
            'DATABASE_URL'
        ]

        missing = [var for var in required_vars if not os.getenv(var)]
        if missing:
            raise ValueError(f"Missing required environment variables: {', '.join(missing)}")

        # Warn if using default secrets in production
        if Config.FLASK_ENV == 'production':
            jwt_secret = os.getenv('JWT_SECRET_KEY')
            if jwt_secret and (jwt_secret.startswith('your-') or len(jwt_secret) < 32):
                raise ValueError(
                    "JWT_SECRET_KEY is not secure for production. "
                    "Use a strong random key with at least 32 characters."
                )


class DevelopmentConfig(Config):
    """Development configuration."""
    FLASK_ENV = 'development'
    DEBUG = True
    TESTING = False
    SECURE_SSL_REDIRECT = False
    SESSION_COOKIE_SECURE = False
    SQLALCHEMY_ECHO = True


class TestingConfig(Config):
    """Testing configuration."""
    FLASK_ENV = 'testing'
    DEBUG = True
    TESTING = True
    RATELIMIT_ENABLED = False
    SECURE_SSL_REDIRECT = False
    SESSION_COOKIE_SECURE = False
    # Use in-memory SQLite for tests
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'


class ProductionConfig(Config):
    """Production configuration."""
    FLASK_ENV = 'production'
    DEBUG = False
    TESTING = False
    SECURE_SSL_REDIRECT = True
    SESSION_COOKIE_SECURE = True
    SQLALCHEMY_ECHO = False


def get_config(env: str = None) -> Config:
    """
    Get configuration based on environment.

    Args:
        env: Environment name (development, testing, production)

    Returns:
        Configuration object
    """
    if env is None:
        env = os.getenv('FLASK_ENV', 'development')

    config_map = {
        'development': DevelopmentConfig,
        'testing': TestingConfig,
        'production': ProductionConfig,
    }

    return config_map.get(env, DevelopmentConfig)
