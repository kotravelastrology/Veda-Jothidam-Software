"""
Rate limiting utilities and middleware.
Implements per-endpoint and per-user rate limiting to prevent abuse.
"""

import os
from functools import wraps
from datetime import datetime, timedelta
from typing import Dict, Tuple, Optional
from flask import request, jsonify
from database import db
from sqlalchemy import Column, String, DateTime, Integer, func

class RateLimitRecord(db.Model):
    """Model for tracking rate limit attempts."""

    __tablename__ = 'rate_limit_records'

    id = Column(String(36), primary_key=True)
    endpoint = Column(String(255), nullable=False, index=True)
    identifier = Column(String(255), nullable=False, index=True)  # IP or user_id
    attempt_count = Column(Integer, default=1)
    window_start = Column(DateTime, default=datetime.utcnow)
    last_attempt = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        """Convert to dictionary."""
        return {
            'endpoint': self.endpoint,
            'identifier': self.identifier,
            'attempt_count': self.attempt_count,
            'window_start': self.window_start.isoformat(),
            'last_attempt': self.last_attempt.isoformat(),
        }


class RateLimiter:
    """Rate limiting manager."""

    # Rate limit configurations
    LIMITS = {
        '/api/auth/login': ('5', '15 minutes'),        # 5 per 15 minutes
        '/api/auth/signup': ('3', '1 hour'),           # 3 per hour
        '/api/auth/change-password': ('5', '1 hour'),  # 5 per hour
        '/api/charts/create': ('10', '1 hour'),        # 10 per hour
    }

    @staticmethod
    def _parse_limit(limit_str: str) -> Tuple[int, int]:
        """
        Parse limit string to count and seconds.
        Format: "count/period" where period is "second", "minute", "hour", "day"

        Args:
            limit_str: Limit string (e.g., "5/15 minutes")

        Returns:
            Tuple of (count, seconds)
        """
        if not limit_str or '/' not in limit_str:
            return (100, 3600)  # Default: 100/hour

        try:
            count_str, period_str = limit_str.split('/')
            count = int(count_str.strip())
            period = period_str.strip().lower()

            period_mapping = {
                'second': 1,
                'minute': 60,
                'minutes': 60,
                'hour': 3600,
                'hours': 3600,
                'day': 86400,
                'days': 86400,
            }

            seconds = period_mapping.get(period, 3600)
            return (count, seconds)
        except (ValueError, AttributeError):
            return (100, 3600)  # Default

    @staticmethod
    def _get_identifier(use_user_id: bool = False) -> str:
        """
        Get identifier for rate limiting (IP or user ID).

        Args:
            use_user_id: Whether to use user ID instead of IP

        Returns:
            Identifier string
        """
        if use_user_id:
            from flask_jwt_extended import get_jwt_identity
            try:
                return f"user_{get_jwt_identity()}"
            except:
                pass

        # Fall back to IP address
        if request.environ.get('HTTP_X_FORWARDED_FOR'):
            return request.environ.get('HTTP_X_FORWARDED_FOR').split(',')[0].strip()
        return request.remote_addr or 'unknown'

    @staticmethod
    def check_limit(endpoint: str, limit_tuple: Tuple[str, str], use_user_id: bool = False) -> Optional[Tuple[dict, int]]:
        """
        Check if rate limit is exceeded.

        Args:
            endpoint: API endpoint
            limit_tuple: Tuple of (count, period) strings
            use_user_id: Whether to limit per user instead of IP

        Returns:
            None if within limit, or (error_dict, status_code) if exceeded
        """
        try:
            count_str, period_str = limit_tuple
            count, seconds = RateLimiter._parse_limit(f"{count_str}/{period_str}")

            identifier = RateLimiter._get_identifier(use_user_id)
            now = datetime.utcnow()
            window_start = now - timedelta(seconds=seconds)

            # Count attempts in current window
            record = RateLimitRecord.query.filter(
                RateLimitRecord.endpoint == endpoint,
                RateLimitRecord.identifier == identifier,
                RateLimitRecord.window_start >= window_start
            ).first()

            if not record:
                # New window, create record
                import uuid
                new_record = RateLimitRecord(
                    id=str(uuid.uuid4()),
                    endpoint=endpoint,
                    identifier=identifier,
                    attempt_count=1,
                    window_start=now,
                    last_attempt=now
                )
                db.session.add(new_record)
                db.session.commit()

                # Add headers
                response_headers = {
                    'X-RateLimit-Limit': str(count),
                    'X-RateLimit-Remaining': str(count - 1),
                    'X-RateLimit-Reset': str(int((now + timedelta(seconds=seconds)).timestamp()))
                }
                return None

            # Increment attempt count
            if record.attempt_count < count:
                record.attempt_count += 1
                record.last_attempt = now
                db.session.commit()

                # Add headers
                return None
            else:
                # Rate limit exceeded
                reset_time = int((record.window_start + timedelta(seconds=seconds)).timestamp())

                return (
                    {
                        'error': 'Too many requests',
                        'retry_after': reset_time - int(now.timestamp())
                    },
                    429
                )

        except Exception as e:
            print(f"Rate limit check error: {e}")
            # Fail open - allow request if rate limiter fails
            return None

    @staticmethod
    def cleanup_expired_records() -> int:
        """
        Remove expired rate limit records.

        Returns:
            Number of records removed
        """
        try:
            # Keep records for 24 hours
            cutoff = datetime.utcnow() - timedelta(days=1)

            expired = RateLimitRecord.query.filter(
                RateLimitRecord.window_start < cutoff
            ).delete()

            db.session.commit()
            return expired
        except Exception as e:
            db.session.rollback()
            print(f"Error cleaning up rate limit records: {e}")
            return 0


def rate_limit(endpoint: str, limit_tuple: Tuple[str, str], use_user_id: bool = False):
    """
    Decorator for rate limiting endpoints.

    Args:
        endpoint: Endpoint name for identifying limits
        limit_tuple: Tuple of (count, period) strings
        use_user_id: Whether to limit per user instead of IP

    Example:
        @rate_limit('/api/auth/login', ('5', '15 minutes'))
        def login():
            ...
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Check rate limit
            result = RateLimiter.check_limit(endpoint, limit_tuple, use_user_id)

            if result:
                error_dict, status_code = result
                response = jsonify(error_dict)
                response.status_code = status_code
                return response

            return f(*args, **kwargs)

        return decorated_function

    return decorator


def add_rate_limit_headers(response, endpoint: str, limit_tuple: Tuple[str, str]) -> object:
    """
    Add rate limit headers to response.

    Args:
        response: Flask response object
        endpoint: Endpoint name
        limit_tuple: Tuple of (count, period)

    Returns:
        Modified response
    """
    try:
        count_str, period_str = limit_tuple
        count, seconds = RateLimiter._parse_limit(f"{count_str}/{period_str}")

        identifier = RateLimiter._get_identifier()
        now = datetime.utcnow()
        window_start = now - timedelta(seconds=seconds)

        record = RateLimitRecord.query.filter(
            RateLimitRecord.endpoint == endpoint,
            RateLimitRecord.identifier == identifier,
            RateLimitRecord.window_start >= window_start
        ).first()

        remaining = count - (record.attempt_count if record else 0)
        reset_time = int((now + timedelta(seconds=seconds)).timestamp()) if not record else int((record.window_start + timedelta(seconds=seconds)).timestamp())

        response.headers['X-RateLimit-Limit'] = str(count)
        response.headers['X-RateLimit-Remaining'] = str(max(0, remaining))
        response.headers['X-RateLimit-Reset'] = str(reset_time)

        return response
    except:
        return response
