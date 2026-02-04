"""SEO API endpoints for sitemap, robots.txt, and SEO metadata"""

from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import Response
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.services.seo_service import SEOService
from app.schemas.seo import DatasetSEO, PostSEO, UserSEO


router = APIRouter()


@router.get("/sitemap.xml")
async def get_sitemap(db: AsyncSession = Depends(get_db)):
    """
    Generate XML sitemap with all public content
    
    Returns sitemap in XML format for search engines.
    """
    urls = await SEOService.generate_sitemap(db)
    xml_content = SEOService.generate_sitemap_xml(urls)
    
    return Response(
        content=xml_content,
        media_type="application/xml",
        headers={"Content-Disposition": "inline; filename=sitemap.xml"}
    )


@router.get("/robots.txt")
async def get_robots_txt():
    """
    Serve robots.txt file
    
    Returns robots.txt content for search engine crawlers.
    """
    content = SEOService.generate_robots_txt()
    
    return Response(
        content=content,
        media_type="text/plain"
    )


@router.get("/seo/dataset/{dataset_id}", response_model=DatasetSEO)
async def get_dataset_seo(
    dataset_id: UUID,
    db: AsyncSession = Depends(get_db)
):
    """
    Get SEO metadata for a dataset
    
    Returns optimized title, description, keywords, and structured data
    for use in meta tags and JSON-LD.
    """
    try:
        seo_data = await SEOService.get_dataset_seo(db, str(dataset_id))
        return seo_data
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.get("/seo/post/{post_id}", response_model=PostSEO)
async def get_post_seo(
    post_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Get SEO metadata for a post/article
    
    Returns optimized title, description, keywords, and structured data
    for use in meta tags and JSON-LD.
    """
    try:
        seo_data = await SEOService.get_post_seo(db, post_id)
        return seo_data
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.get("/seo/user/{user_id}", response_model=UserSEO)
async def get_user_seo(
    user_id: int,
    db: AsyncSession = Depends(get_db)
):
    """
    Get SEO metadata for a user profile
    
    Returns optimized title, description, and structured data
    for use in meta tags and JSON-LD.
    """
    try:
        seo_data = await SEOService.get_user_seo(db, user_id)
        return seo_data
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
