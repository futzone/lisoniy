"""Token-related Pydantic schemas"""

from pydantic import BaseModel


class TokenResponse(BaseModel):
    """Schema for token response"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshTokenRequest(BaseModel):
    """Schema for refresh token request"""
    refresh_token: str


class AccessTokenResponse(BaseModel):
    """Schema for access token response (after refresh)"""
    access_token: str
    token_type: str = "bearer"
