"""
Structured logging utilities for security auditing.
Implements JSON-formatted logging for compliance and monitoring.
"""

import os
import json
import logging
from datetime import datetime
from typing import Any, Dict, Optional
from flask import request, g
from pythonjsonlogger import jsonlogger

class SecurityLogger:
    """Logger for security events."""

    @staticmethod
    def setup_logging(app) -> None:
        """
        Setup structured JSON logging for the Flask app.

        Args:
            app: Flask application instance
        """
        log_level = os.getenv('LOG_LEVEL', 'INFO')
        log_format = os.getenv('LOG_FORMAT', 'json')
        log_file = os.getenv('LOG_FILE', 'backend/logs/app.log')

        # Create logs directory if it doesn't exist
        log_dir = os.path.dirname(log_file)
        if log_dir and not os.path.exists(log_dir):
            os.makedirs(log_dir)

        # Get root logger
        root_logger = logging.getLogger()
        root_logger.setLevel(getattr(logging, log_level))

        # Remove existing handlers
        for handler in root_logger.handlers[:]:
            root_logger.removeHandler(handler)

        # Create formatters
        if log_format == 'json':
            formatter = jsonlogger.JsonFormatter(
                '%(timestamp)s %(level)s %(name)s %(message)s'
            )
        else:
            formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
            )

        # File handler
        try:
            file_handler = logging.FileHandler(log_file)
            file_handler.setLevel(getattr(logging, log_level))
            file_handler.setFormatter(formatter)
            root_logger.addHandler(file_handler)
        except Exception as e:
            print(f"Error setting up file logging: {e}")

        # Console handler (for development)
        console_handler = logging.StreamHandler()
        console_handler.setLevel(getattr(logging, log_level))
        console_handler.setFormatter(formatter)
        root_logger.addHandler(console_handler)

        # Disable verbose third-party logging
        logging.getLogger('werkzeug').setLevel(logging.WARNING)
        logging.getLogger('sqlalchemy').setLevel(logging.WARNING)

    @staticmethod
    def log_auth_event(
        event_type: str,
        user_id: Optional[str] = None,
        email: Optional[str] = None,
        status: str = 'success',
        details: Optional[Dict[str, Any]] = None
    ) -> None:
        """
        Log authentication event.

        Args:
            event_type: Type of auth event (login, logout, signup, password_change)
            user_id: User ID
            email: User email
            status: Event status (success, failure)
            details: Additional details
        """
        logger = logging.getLogger('security.auth')

        log_data = {
            'event_type': event_type,
            'user_id': user_id,
            'email': email,
            'status': status,
            'ip_address': SecurityLogger._get_client_ip(),
            'user_agent': request.user_agent.string if request else None,
            'timestamp': datetime.utcnow().isoformat(),
        }

        if details:
            log_data.update(details)

        if status == 'failure':
            logger.warning(json.dumps(log_data))
        else:
            logger.info(json.dumps(log_data))

    @staticmethod
    def log_access_event(
        endpoint: str,
        method: str,
        status_code: int,
        user_id: Optional[str] = None,
        duration_ms: float = 0
    ) -> None:
        """
        Log API access event.

        Args:
            endpoint: API endpoint
            method: HTTP method
            status_code: Response status code
            user_id: User ID if authenticated
            duration_ms: Request duration in milliseconds
        """
        logger = logging.getLogger('security.access')

        log_data = {
            'endpoint': endpoint,
            'method': method,
            'status_code': status_code,
            'user_id': user_id,
            'ip_address': SecurityLogger._get_client_ip(),
            'user_agent': request.user_agent.string if request else None,
            'duration_ms': duration_ms,
            'timestamp': datetime.utcnow().isoformat(),
        }

        if status_code >= 400:
            logger.warning(json.dumps(log_data))
        else:
            logger.info(json.dumps(log_data))

    @staticmethod
    def log_data_event(
        event_type: str,
        resource_type: str,
        resource_id: str,
        action: str,
        user_id: str,
        changes: Optional[Dict[str, Any]] = None
    ) -> None:
        """
        Log data modification event (audit trail).

        Args:
            event_type: Type of event (create, update, delete)
            resource_type: Type of resource (chart, user, etc.)
            resource_id: Resource ID
            action: Description of action
            user_id: User performing action
            changes: What was changed
        """
        logger = logging.getLogger('security.data')

        log_data = {
            'event_type': event_type,
            'resource_type': resource_type,
            'resource_id': resource_id,
            'action': action,
            'user_id': user_id,
            'changes': changes,
            'ip_address': SecurityLogger._get_client_ip(),
            'timestamp': datetime.utcnow().isoformat(),
        }

        logger.info(json.dumps(log_data))

    @staticmethod
    def log_security_event(
        event_type: str,
        severity: str = 'INFO',
        details: Optional[Dict[str, Any]] = None
    ) -> None:
        """
        Log security event.

        Args:
            event_type: Type of security event
            severity: Severity level (INFO, WARNING, ERROR, CRITICAL)
            details: Event details
        """
        logger = logging.getLogger('security.security')

        log_data = {
            'event_type': event_type,
            'severity': severity,
            'ip_address': SecurityLogger._get_client_ip(),
            'timestamp': datetime.utcnow().isoformat(),
        }

        if details:
            log_data.update(details)

        if severity == 'CRITICAL' or severity == 'ERROR':
            logger.error(json.dumps(log_data))
        elif severity == 'WARNING':
            logger.warning(json.dumps(log_data))
        else:
            logger.info(json.dumps(log_data))

    @staticmethod
    def log_rate_limit_event(
        endpoint: str,
        identifier: str,
        limit: str
    ) -> None:
        """
        Log rate limit violation.

        Args:
            endpoint: API endpoint
            identifier: IP or user identifier
            limit: Rate limit that was exceeded
        """
        logger = logging.getLogger('security.rate_limit')

        log_data = {
            'event_type': 'rate_limit_exceeded',
            'endpoint': endpoint,
            'identifier': identifier,
            'limit': limit,
            'ip_address': SecurityLogger._get_client_ip(),
            'timestamp': datetime.utcnow().isoformat(),
        }

        logger.warning(json.dumps(log_data))

    @staticmethod
    def log_error_event(
        error_type: str,
        error_message: str,
        user_id: Optional[str] = None,
        endpoint: Optional[str] = None,
        stack_trace: Optional[str] = None
    ) -> None:
        """
        Log error event.

        Args:
            error_type: Type of error
            error_message: Error message
            user_id: User ID if applicable
            endpoint: API endpoint if applicable
            stack_trace: Stack trace for debugging
        """
        logger = logging.getLogger('security.error')

        log_data = {
            'event_type': 'error',
            'error_type': error_type,
            'error_message': error_message,
            'user_id': user_id,
            'endpoint': endpoint,
            'ip_address': SecurityLogger._get_client_ip(),
            'timestamp': datetime.utcnow().isoformat(),
        }

        if stack_trace:
            log_data['stack_trace'] = stack_trace

        logger.error(json.dumps(log_data))

    @staticmethod
    def _get_client_ip() -> str:
        """
        Get client IP address, considering proxy headers.

        Returns:
            Client IP address
        """
        if not request:
            return 'unknown'

        if request.environ.get('HTTP_X_FORWARDED_FOR'):
            return request.environ.get('HTTP_X_FORWARDED_FOR').split(',')[0].strip()

        if request.environ.get('HTTP_X_REAL_IP'):
            return request.environ.get('HTTP_X_REAL_IP')

        return request.remote_addr or 'unknown'


def add_request_context(app) -> None:
    """
    Add request context for logging.

    Args:
        app: Flask application instance
    """

    @app.before_request
    def before_request():
        """Log request start time."""
        g.start_time = datetime.utcnow()

    @app.after_request
    def after_request(response):
        """Log request completion."""
        try:
            duration = (datetime.utcnow() - g.start_time).total_seconds() * 1000

            user_id = None
            try:
                from flask_jwt_extended import get_jwt_identity
                user_id = get_jwt_identity()
            except:
                pass

            # Only log API requests
            if request.path.startswith('/api/'):
                SecurityLogger.log_access_event(
                    endpoint=request.path,
                    method=request.method,
                    status_code=response.status_code,
                    user_id=user_id,
                    duration_ms=duration
                )
        except Exception as e:
            print(f"Error in after_request logging: {e}")

        return response
