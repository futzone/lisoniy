"""FastAPI Application Entry Point"""

from contextlib import asynccontextmanager
from typing import AsyncGenerator

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy.exc import SQLAlchemyError

from fastapi.staticfiles import StaticFiles
import os

from app.core.config import settings
from app.api.v1 import api_router
from app.services.redis_manager import redis_manager
from fastapi.responses import Response
from sqlalchemy import select
from app.db.session import AsyncSessionLocal
from app.models.post import Post
from app.models.dataset import Dataset

@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """
    Lifespan context manager for startup and shutdown events
    
    Args:
        app: FastAPI application instance
    """
    # Startup
    print("🚀 Starting FastAPI application...")
    
    # Initialize Redis connection
    await redis_manager.connect()
    print("✅ Redis connected")
    
    yield
    
    # Shutdown
    print("🛑 Shutting down FastAPI application...")
    
    # Close Redis connection
    await redis_manager.disconnect()
    print("✅ Redis disconnected")


# Create FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    version=settings.APP_VERSION,
    description="High-load User Authentication & Management System with FastAPI",
    docs_url="/docs" if settings.DEBUG else None,
    redoc_url="/redoc" if settings.DEBUG else None,
    lifespan=lifespan,
)


# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.middleware("http")
async def timeout_middleware(request: Request, call_next):
    """
    Middleware to fail requests that take too long
    """
    import asyncio
    try:
        # 20 second hard timeout for any request
        return await asyncio.wait_for(call_next(request), timeout=20.0)
    except asyncio.TimeoutError:
        print(f"REQUEST TIMEOUT: {request.method} {request.url}", flush=True)
        return JSONResponse(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            content={"detail": "Request processing timed out"},
        )
    except Exception as e:
        print(f"REQUEST ERROR: {request.method} {request.url} - {e}", flush=True)
        import traceback
        traceback.print_exc()
        raise


# Include API routers
app.include_router(api_router, prefix="/api/v1")


# Root endpoint
@app.get("/", tags=["Health"])
async def root() -> dict:
    """Root endpoint - API health check"""
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "status": "running",
        "environment": settings.ENVIRONMENT,
    }

# Mount static files (uploads)
# Create directory if it doesn't exist
os.makedirs(settings.UPLOADS_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=settings.UPLOADS_DIR), name="uploads")


@app.get("/health", tags=["Health"])
async def health_check() -> dict:
    """Health check endpoint"""
    return {
        "status": "healthy",
        "database": "connected",
        "redis": "connected",
    }


# Exception Handlers
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(
    request: Request,
    exc: RequestValidationError
) -> JSONResponse:
    """Handle Pydantic validation errors"""
    # Convert body to string if it's bytes (e.g., form data)
    body = exc.body
    if isinstance(body, bytes):
        try:
            body = body.decode('utf-8')
        except Exception:
            body = str(body)
    
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "detail": exc.errors(),
            "body": body,
        },
    )


@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(
    request: Request,
    exc: SQLAlchemyError
) -> JSONResponse:
    """Handle SQLAlchemy database errors"""
    import traceback
    traceback.print_exc()
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Database error occurred",
            "error": str(exc) if settings.DEBUG else "Internal server error",
        },
    )


@app.exception_handler(Exception)
async def general_exception_handler(
    request: Request,
    exc: Exception
) -> JSONResponse:
    """Handle general exceptions"""
    import traceback
    traceback.print_exc()
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "An unexpected error occurred",
            "error": str(exc) if settings.DEBUG else "Internal server error",
        },
    )


@app.get("/sitemap.xml", tags=["SEO"])
async def sitemap_xml():
    """Generate dynamic sitemap.xml"""
    base_url = "https://lisoniy.uz"
    
    # Static pages
    urls = [
        f"{base_url}/",
        f"{base_url}/datasets",
        f"{base_url}/posts",
        f"{base_url}/terminology",
        f"{base_url}/login",
        f"{base_url}/register",
    ]
    
    async with AsyncSessionLocal() as session:
        # Fetch posts
        result = await session.execute(select(Post.id, Post.updated_at))
        posts = result.all()
        for p in posts:
            urls.append(f"{base_url}/posts/{p.id}")
            
        # Fetch datasets
        result = await session.execute(select(Dataset.id, Dataset.updated_at))
        datasets = result.all()
        for d in datasets:
            urls.append(f"{base_url}/datasets/{d.id}")

    # Build XML
    xml_content = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml_content += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    for url in urls:
        xml_content += f'  <url>\n    <loc>{url}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.8</priority>\n  </url>\n'
        
    xml_content += '</urlset>'
    
    return Response(content=xml_content, media_type="application/xml")


if __name__ == "__main__":
    import uvicorn
    
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG,
    )
