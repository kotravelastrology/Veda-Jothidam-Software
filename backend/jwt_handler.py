"""
JWT token management utilities.
Handles token creation, validation, refresh, and blacklisting.
"""

import os
from datetime import datetime, timedelta
from typing import Tuple, Optional, Dict, Any
from flask_jwt_extended import create_access_token, create_refresh_token
from backend.database import db
from sqlalchemy import Column, String, DateTime

class TokenBlacklist(db.Model):
    """Model for storing blacklisted tokens (for logout)."""

    __tablename__ = 'token_blacklist'

    id = Column(String(36), primary_key=True)
    token_jti = Column(String(500), unique=True, nullable=False, index=True)
    user_id = Column(String(36), nullable=False, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False, index=True)

    def to_dict(self) -> Dict[str, Any]:
        """Convert to dictionary."""
        return {
            'id': self.id,
            'token_jti': self.token_jti,
            'user_id': self.user_id,
            'created_at': self.created_at.isoformat(),
            'expires_at': self.expires_at.isoformat(),
        }


class JWTHandler:
    """Handles JWT token operations."""

    # Token configuration
    ACCESS_TOKEN_EXPIRES_MINUTES = int(os.getenv('ACCESS_TOKEN_EXPIRE_MINUTES', '15'))
    REFRESH_TOKEN_EXPIRES_DAYS = int(os.getenv('REFRESH_TOKEN_EXPIRE_DAYS', '7'))

    @staticmethod
    def create_tokens(user_id: str) -> Tuple[str, str]:
        """
        Create access and refresh tokens for a user.

        Args:
            user_id: ID of the user

        Returns:
            Tuple of (access_token, refresh_token)
        """
        # Create access token (short-lived)
        access_token = create_access_token(
            identity=user_id,
            expires_delta=timedelta(minutes=JWTHandler.ACCESS_TOKEN_EXPIRES_MINUTES),
            additional_claims={
                'token_type': 'access',
                'scope': 'full',
            }
        )

        # Create refresh token (long-lived)
        refresh_token = create_refresh_token(
            identity=user_id,
            expires_delta=timedelta(days=JWTHandler.REFRESH_TOKEN_EXPIRES_DAYS),
            additional_claims={
                'token_type': 'refresh',
            }
        )

        return access_token, refresh_token

    @staticmethod
    def create_access_token_from_refresh(user_id: str) -> str:
        """
        Create a new access token from a valid refresh token.

        Args:
            user_id: ID of the user

        Returns:
            New access token
        """
        return create_access_token(
            identity=user_id,
            expires_delta=timedelta(minutes=JWTHandler.ACCESS_TOKEN_EXPIRES_MINUTES),
            additional_claims={
                'token_type': 'access',
                'scope': 'full',
            }
        )

    @staticmethod
    def add_token_to_blacklist(
        token_jti: str,
        user_id: str,
        expires_at: datetime
    ) -> bool:
        """
        Add a token to the blacklist (for logout).

        Args:
            token_jti: JWT ID (jti claim)
            user_id: User ID
            expires_at: Token expiration time

        Returns:
            True if successfully added
        """
        try:
            import uuid

            blacklist_entry = TokenBlacklist(
                id=str(uuid.uuid4()),
                token_jti=token_jti,
                user_id=user_id,
                expires_at=expires_at
            )

            db.session.add(blacklist_entry)
            db.session.commit()

            return True
        except Exception as e:
            db.session.rollback()
            print(f"Error adding token to blacklist: {e}")
            return False

    @staticmethod
    def is_token_blacklisted(token_jti: str) -> bool:
        """
        Check if a token is blacklisted.

        Args:
            token_jti: JWT ID (jti claim)

        Returns:
            True if token is blacklisted
        """
        try:
            return TokenBlacklist.query.filter_by(token_jti=token_jti).first() is not None
        except Exception:
            # If database error, allow token (fail open)
            return False

    @staticmethod
    def cleanup_expired_tokens() -> int:
        """
        Remove expired tokens from blacklist.

        Returns:
            Number of tokens removed
        """
        try:
            expired = TokenBlacklist.query.filter(
                TokenBlacklist.expires_at < datetime.utcnow()
            ).delete()

            db.session.commit()
            return expired
        except Exception as e:
            db.session.rollback()
            print(f"Error cleaning up expired tokens: {e}")
            return 0


def token_blacklist_loader(jwt_manager):
    """
    Configure JWT blacklist checking.
    Should be called during app initialization.

    Args:
        jwt_manager: Flask-JWT-Extended JWTManager instance
    """

    @jwt_manager.token_in_blocklist_loader
    def check_if_token_revoked(jwt_header, jwt_payload):
        """Check if token is in blacklist."""
        jti = jwt_payload['jti']
        return JWTHandler.is_token_blacklisted(jti)
