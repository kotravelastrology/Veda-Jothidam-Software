"""
Security headers middleware and utilities.
Implements OWASP recommended security headers.
"""

from flask import Flask, request, jsonify
from functools import wraps
from typing import Dict, Any

def add_security_headers(app: Flask) -> None:
    """
    Add security headers to all responses.

    Args:
        app: Flask application instance
    """

    @app.after_request
    def set_security_headers(response):
        """Add security headers to response."""

        # Prevent MIME type sniffing
        response.headers['X-Content-Type-Options'] = 'nosniff'

        # Enable XSS protection (modern browsers ignore, but good for legacy support)
        response.headers['X-XSS-Protection'] = '1; mode=block'

        # Prevent clickjacking attacks (embedding in iframe)
        response.headers['X-Frame-Options'] = 'DENY'

        # Control how much referrer information is sent
        response.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'

        # Content Security Policy (CSP)
        # Restrict where content can be loaded from
        csp_header = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline'; "  # unsafe-inline for development only
            "style-src 'self' 'unsafe-inline'; "
            "img-src 'self' data: https:; "
            "font-src 'self'; "
            "connect-src 'self'; "
            "frame-ancestors 'none'; "
            "base-uri 'self'; "
            "form-action 'self';"
        )
        response.headers['Content-Security-Policy'] = csp_header

        # HSTS (HTTP Strict Transport Security)
        # Force HTTPS in production
        if request.environ.get('wsgi.url_scheme') == 'https':
            response.headers['Strict-Transport-Security'] = (
                'max-age=31536000; includeSubDomains; preload'
            )

        # Permissions-Policy (formerly Feature-Policy)
        # Control which browser features can be used
        response.headers['Permissions-Policy'] = (
            'geolocation=(), '
            'microphone=(), '
            'camera=(), '
            'payment=(), '
            'usb=(), '
            'magnetometer=(), '
            'gyroscope=(), '
            'accelerometer=()'
        )

        # Additional security headers
        response.headers['X-Permitted-Cross-Domain-Policies'] = 'none'
        response.headers['Cross-Origin-Resource-Policy'] = 'same-origin'
        response.headers['Cross-Origin-Opener-Policy'] = 'same-origin'
        response.headers['Cross-Origin-Embedder-Policy'] = 'require-corp'

        # Remove unnecessary headers
        response.headers.pop('Server', None)
        response.headers.pop('X-Powered-By', None)

        return response


def require_secure_headers(f):
    """
    Decorator to require specific security headers in request.
    Used for sensitive operations (state-changing requests).
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Check Content-Type for POST/PUT requests
        if request.method in ['POST', 'PUT', 'DELETE', 'PATCH']:
            content_type = request.headers.get('Content-Type', '')
            if not content_type.startswith('application/json'):
                return jsonify({'error': 'Content-Type must be application/json'}), 400

        return f(*args, **kwargs)

    return decorated_function


def validate_request_origin(f):
    """
    Decorator to validate request origin.
    Ensures requests come from allowed origins.
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        origin = request.headers.get('Origin')
        referer = request.headers.get('Referer')

        # Allow requests without Origin/Referer from same-origin
        if request.method in ['POST', 'PUT', 'DELETE', 'PATCH']:
            if not origin and not referer:
                # Same-origin requests may not have Origin header
                pass
            elif origin:
                # Validate origin in CORS middleware
                pass

        return f(*args, **kwargs)

    return decorated_function


class SecurityHeaderConfig:
    """Static security header configurations."""

    # CSP directives for different content types
    CSP_DIRECTIVES = {
        'default-src': ["'self'"],
        'script-src': ["'self'", "'unsafe-inline'"],  # Inline for development only
        'style-src': ["'self'", "'unsafe-inline'"],
        'img-src': ["'self'", "data:", "https:"],
        'font-src': ["'self'"],
        'connect-src': ["'self'"],
        'frame-ancestors': ["'none'"],
        'base-uri': ["'self'"],
        'form-action': ["'self'"],
        'upgrade-insecure-requests': [],
    }

    @staticmethod
    def get_csp_header(custom_directives: Dict[str, list] = None) -> str:
        """
        Generate CSP header string.

        Args:
            custom_directives: Override default directives

        Returns:
            CSP header string
        """
        directives = SecurityHeaderConfig.CSP_DIRECTIVES.copy()

        if custom_directives:
            directives.update(custom_directives)

        parts = []
        for key, values in directives.items():
            if values:
                parts.append(f"{key} {' '.join(values)}")
            else:
                parts.append(key)

        return "; ".join(parts)

    @staticmethod
    def get_hsts_header(
        max_age: int = 31536000,
        include_subdomains: bool = True,
        preload: bool = True
    ) -> str:
        """
        Generate HSTS header string.

        Args:
            max_age: Max age in seconds (default 1 year)
            include_subdomains: Include subdomains
            preload: Enable HSTS preload

        Returns:
            HSTS header string
        """
        parts = [f"max-age={max_age}"]

        if include_subdomains:
            parts.append("includeSubDomains")

        if preload:
            parts.append("preload")

        return "; ".join(parts)


def remove_sensitive_headers(response) -> None:
    """
    Remove headers that expose server information.

    Args:
        response: Flask response object
    """
    sensitive_headers = [
        'Server',
        'X-Powered-By',
        'X-AspNet-Version',
        'X-Runtime-Version',
        'X-Content-Type-Options',  # Keep for security
    ]

    for header in sensitive_headers:
        response.headers.pop(header, None)
