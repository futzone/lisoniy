"""SEO API endpoints for sitemap, robots.txt, and SEO metadata"""

from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import Response, HTMLResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.services.seo_service import SEOService
from app.schemas.seo import DatasetSEO, PostSEO, UserSEO


router = APIRouter()


# List of known crawler user agents
CRAWLER_USER_AGENTS = [
    "telegrambot",
    "twitterbot",
    "facebookexternalhit",
    "linkedinbot",
    "slackbot",
    "whatsapp",
    "discordbot",
    "applebot",
    "googlebot",
    "bingbot",
    "yandexbot",
]


def is_crawler(request: Request) -> bool:
    """Check if request is from a crawler based on User-Agent"""
    user_agent = request.headers.get("user-agent", "").lower()
    return any(crawler in user_agent for crawler in CRAWLER_USER_AGENTS)


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


@router.get("/share/article/{post_id}", response_class=HTMLResponse)
async def get_article_share_page(
    post_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Get HTML page with OG meta tags for social sharing
    
    This endpoint returns an HTML page with proper Open Graph meta tags
    for social media platforms (Telegram, Facebook, Twitter, etc.)
    """
    try:
        html = await SEOService.generate_post_share_html(db, post_id)
        return HTMLResponse(content=html)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.get("/share/discussion/{post_id}", response_class=HTMLResponse)
async def get_discussion_share_page(
    post_id: int,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Get HTML page with OG meta tags for discussion sharing
    """
    try:
        html = await SEOService.generate_post_share_html(db, post_id)
        return HTMLResponse(content=html)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )


@router.get("/share/dataset/{dataset_id}", response_class=HTMLResponse)
async def get_dataset_share_page(
    dataset_id: str,
    request: Request,
    db: AsyncSession = Depends(get_db)
):
    """
    Get HTML page with OG meta tags for dataset sharing
    """
    try:
        html = await SEOService.generate_dataset_share_html(db, dataset_id)
        return HTMLResponse(content=html)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e)
        )
