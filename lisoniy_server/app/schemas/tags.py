"""Schemas for tags"""
from pydantic import BaseModel


class TagStats(BaseModel):
    """Tag statistics response"""
    tag: str
    contents: int
    
    class Config:
        from_attributes = True
