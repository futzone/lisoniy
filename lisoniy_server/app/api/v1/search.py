"""Search API endpoints"""

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.terminology import SearchQuery, SearchResponse
from app.services.term_service import TermService


router = APIRouter()


@router.get("/", response_model=SearchResponse)
async def search_terms(
    q: str = Query(..., min_length=1, max_length=255, description="Search query"),
    language: str | None = Query(None, min_length=2, max_length=2, regex="^[a-z]{2}$", description="Filter by language (ISO 639-1 code)"),
    category: str | None = Query(None, description="Filter by category slug"),
    offset: int = Query(0, ge=0, description="Pagination offset"),
    limit: int = Query(20, ge=1, le=100, description="Results per page"),
    db: AsyncSession = Depends(get_db)
):
    """
    Search terms (public endpoint, cached)
    
    Multi-strategy search:
    1. Exact match on keyword
    2. Partial match on keyword
    3. Full-text search on definitions
    
    **Query parameters:**
    - **q**: Search query (required)
    - **language**: Filter by language code (uz, en, ru)
    - **category**: Filter by category slug
    - **offset**: Pagination offset (default: 0)
    - **limit**: Results per page (max: 100, default: 20)
    """
    search_query = SearchQuery(
        q=q,
        language=language,
        category=category,
        offset=offset,
        limit=limit
    )
    
    terms, total = await TermService.search_terms(db, search_query)
    
    return SearchResponse(
        total=total,
        offset=offset,
        limit=limit,
        results=terms
    )
