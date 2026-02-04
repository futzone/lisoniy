"""SEO-related Pydantic schemas"""

from typing import List, Optional
from pydantic import BaseModel, HttpUrl
from datetime import datetime


class SEOMetadata(BaseModel):
    """SEO metadata for a page"""
    title: str
    description: str
    keywords: List[str] = []
    canonical_url: Optional[str] = None
    og_image: Optional[str] = None
    og_type: str = "website"
    author: Optional[str] = None
    published_time: Optional[datetime] = None
    modified_time: Optional[datetime] = None


class DatasetSEO(BaseModel):
    """SEO data for dataset pages"""
    seo_title: str
    seo_description: str
    seo_keywords: List[str]
    og_image: Optional[str] = None
    canonical_url: str
    structured_data: dict


class PostSEO(BaseModel):
    """SEO data for post/article pages"""
    seo_title: str
    seo_description: str
    seo_keywords: List[str]
    og_image: Optional[str] = None
    canonical_url: str
    structured_data: dict


class UserSEO(BaseModel):
    """SEO data for user profile pages"""
    seo_title: str
    seo_description: str
    canonical_url: str
    structured_data: dict


class SitemapURL(BaseModel):
    """Sitemap URL entry"""
    loc: HttpUrl
    lastmod: Optional[datetime] = None
    changefreq: Optional[str] = "weekly"
    priority: Optional[float] = 0.5
