"""Redis manager for caching, OTP storage, and rate limiting"""

import json
import secrets
from typing import Optional, Any
from datetime import timedelta
from redis import asyncio as aioredis
from fastapi.encoders import jsonable_encoder

from app.core.config import settings


class RedisManager:
    """Redis connection manager with helper methods"""
    
    def __init__(self):
        """Initialize Redis connection pool"""
        self.redis: Optional[aioredis.Redis] = None
    
    async def connect(self) -> None:
        """Create Redis connection pool with timeouts"""
        self.redis = await aioredis.from_url(
            settings.REDIS_URL,
            encoding="utf-8",
            decode_responses=True,
            max_connections=settings.REDIS_MAX_CONNECTIONS,
            socket_timeout=5.0,
            socket_connect_timeout=5.0,
            retry_on_timeout=True,
        )
    
    async def disconnect(self) -> None:
        """Close Redis connection pool"""
        if self.redis:
            await self.redis.close()
    
    async def set_value(
        self,
        key: str,
        value: Any,
        expire: Optional[int] = None
    ) -> None:
        """
        Set a value in Redis with optional expiration
        
        Args:
            key: Redis key
            value: Value to store (will be JSON serialized if not string)
            expire: Expiration time in seconds
        """
        if not isinstance(value, str):
            value = json.dumps(jsonable_encoder(value))
        
        await self.redis.set(key, value, ex=expire)
    
    async def get_value(self, key: str) -> Optional[str]:
        """
        Get a value from Redis
        
        Args:
            key: Redis key
            
        Returns:
            Value from Redis or None
        """
        return await self.redis.get(key)
    
    async def delete_key(self, key: str) -> None:
        """
        Delete a key from Redis
        
        Args:
            key: Redis key to delete
        """
        await self.redis.delete(key)

    async def delete_pattern(self, pattern: str) -> None:
        """
        Delete all keys matching a pattern
        
        Args:
            pattern: Redis glob-style pattern (e.g. "prefix:*")
        """
        keys = []
        async for key in self.redis.scan_iter(match=pattern):
            keys.append(key)
            
        if keys:
            await self.redis.delete(*keys)
    
    async def key_exists(self, key: str) -> bool:
        """
        Check if a key exists in Redis
        
        Args:
            key: Redis key
            
        Returns:
            True if key exists, False otherwise
        """
        return bool(await self.redis.exists(key))
    
    # OTP Management
    async def generate_otp(self, email: str) -> str:
        """
        Generate and store OTP for email verification
        
        Args:
            email: User email
            
        Returns:
            Generated 6-digit OTP
        """
        otp = str(secrets.randbelow(1000000)).zfill(6)
        key = f"otp:{email}"
        expire_seconds = settings.OTP_EXPIRE_MINUTES * 60
        
        await self.set_value(key, otp, expire=expire_seconds)
        return otp
    
    async def verify_otp(self, email: str, otp: str) -> bool:
        """
        Verify OTP for email
        
        Args:
            email: User email
            otp: OTP to verify
            
        Returns:
            True if OTP is valid, False otherwise
        """
        key = f"otp:{email}"
        stored_otp = await self.get_value(key)
        
        if stored_otp and stored_otp == otp:
            await self.delete_key(key)  # Delete OTP after successful verification
            return True
        
        return False
    
    # Refresh Token Management
    async def store_refresh_token(
        self,
        user_id: int,
        token: str,
        expire_days: int
    ) -> None:
        """
        Store refresh token in Redis
        
        Args:
            user_id: User ID
            token: Refresh token
            expire_days: Expiration in days
        """
        key = f"refresh_token:{user_id}:{token}"
        expire_seconds = expire_days * 24 * 60 * 60
        
        await self.set_value(key, "1", expire=expire_seconds)
    
    async def verify_refresh_token(self, user_id: int, token: str) -> bool:
        """
        Verify if refresh token exists in Redis
        
        Args:
            user_id: User ID
            token: Refresh token to verify
            
        Returns:
            True if token exists, False otherwise
        """
        key = f"refresh_token:{user_id}:{token}"
        return await self.key_exists(key)
    
    async def revoke_refresh_token(self, user_id: int, token: str) -> None:
        """
        Revoke a refresh token
        
        Args:
            user_id: User ID
            token: Refresh token to revoke
        """
        key = f"refresh_token:{user_id}:{token}"
        await self.delete_key(key)
    
    async def revoke_all_user_tokens(self, user_id: int) -> None:
        """
        Revoke all refresh tokens for a user
        
        Args:
            user_id: User ID
        """
        pattern = f"refresh_token:{user_id}:*"
        async for key in self.redis.scan_iter(match=pattern):
            await self.delete_key(key)
    
    # Rate Limiting
    async def check_rate_limit(self, identifier: str) -> bool:
        """
        Check if identifier is rate limited
        
        Args:
            identifier: Unique identifier (e.g., IP address, user email)
            
        Returns:
            True if allowed, False if rate limited
        """
        key = f"rate_limit:{identifier}"
        current = await self.redis.get(key)
        
        if current and int(current) >= settings.RATE_LIMIT_REQUESTS:
            return False
        
        # Increment counter
        pipe = self.redis.pipeline()
        pipe.incr(key)
        pipe.expire(key, settings.RATE_LIMIT_WINDOW)
        await pipe.execute()
        
        return True
    
    # Password Reset Token Management
    async def store_password_reset_token(self, email: str, token: str) -> None:
        """
        Store password reset token
        
        Args:
            email: User email
            token: Reset token
        """
        key = f"password_reset:{token}"
        expire_seconds = settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES * 60
        
        await self.set_value(key, email, expire=expire_seconds)
    
    async def verify_password_reset_token(self, token: str) -> Optional[str]:
        """
        Verify password reset token and get associated email
        
        Args:
            token: Reset token
            
        Returns:
            Email if token is valid, None otherwise
        """
        key = f"password_reset:{token}"
        email = await self.get_value(key)
        
        if email:
            await self.delete_key(key)  # Delete token after retrieval
        
        return email


# Global Redis manager instance
redis_manager = RedisManager()

