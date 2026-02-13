"""SEO service for generating sitemaps and SEO metadata"""

from datetime import datetime
from typing import List, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func

from app.models.dataset import Dataset
from app.models.post import Post
from app.models.user import User
from app.schemas.seo import DatasetSEO, PostSEO, UserSEO, SitemapURL


class SEOService:
    """Service for SEO-related operations"""
    
    BASE_URL = "https://lisoniy.uz"  # TODO: Move to config
    
    @staticmethod
    async def generate_sitemap(db: AsyncSession) -> List[SitemapURL]:
        """
        Generate complete sitemap with all public content
        
        Args:
            db: Database session
            
        Returns:
            List of sitemap URLs
        """
        urls = []
        
        # Static pages
        static_pages = [
            {"loc": f"{SEOService.BASE_URL}/", "priority": 1.0, "changefreq": "daily"},
            {"loc": f"{SEOService.BASE_URL}/about", "priority": 0.8, "changefreq": "monthly"},
            {"loc": f"{SEOService.BASE_URL}/nlp", "priority": 0.8, "changefreq": "monthly"},
            {"loc": f"{SEOService.BASE_URL}/corpus", "priority": 0.8, "changefreq": "monthly"},
            {"loc": f"{SEOService.BASE_URL}/hub", "priority": 0.8, "changefreq": "monthly"},
            {"loc": f"{SEOService.BASE_URL}/ai", "priority": 0.8, "changefreq": "monthly"},
            {"loc": f"{SEOService.BASE_URL}/hamjamiyat", "priority": 0.9, "changefreq": "daily"},
        ]
        
        for page in static_pages:
            urls.append(SitemapURL(**page))
        
        # Public datasets
        datasets_result = await db.execute(
            select(Dataset).where(Dataset.is_public == True)
        )
        datasets = datasets_result.scalars().all()
        
        for dataset in datasets:
            urls.append(SitemapURL(
                loc=f"{SEOService.BASE_URL}/datasets/{dataset.id}",
                lastmod=dataset.updated_at,
                changefreq="weekly",
                priority=0.7
            ))
        
        # Published posts (articles and discussions)
        posts_result = await db.execute(
            select(Post).where(Post.is_published == True)
        )
        posts = posts_result.scalars().all()
        
        for post in posts:
            if post.type == "article":
                url_path = f"/hamjamiyat/post/{post.id}"
                priority = 0.7
            else:  # discussion
                url_path = f"/hamjamiyat/discussion/{post.id}"
                priority = 0.6
            
            urls.append(SitemapURL(
                loc=f"{SEOService.BASE_URL}{url_path}",
                lastmod=post.updated_at,
                changefreq="monthly",
                priority=priority
            ))
        
        # User profiles (active users with public content)
        users_result = await db.execute(
            select(User).where(User.is_active == True, User.is_verified == True).limit(100)
        )
        users = users_result.scalars().all()
        
        for user in users:
            # Create slug from full_name or email
            slug = user.full_name.lower().replace(" ", "-") if user.full_name else f"user-{user.id}"
            urls.append(SitemapURL(
                loc=f"{SEOService.BASE_URL}/hamjamiyat/author/{slug}",
                changefreq="monthly",
                priority=0.5
            ))
        
        # Tags (get unique tags from posts)
        tags_result = await db.execute(
            select(Post.tags).where(Post.is_published == True, Post.tags.isnot(None))
        )
        all_tags = set()
        for row in tags_result:
            if row[0]:  # tags is JSONB array
                all_tags.update(row[0])
        
        for tag in all_tags:
            urls.append(SitemapURL(
                loc=f"{SEOService.BASE_URL}/hamjamiyat/tag/{tag}",
                changefreq="weekly",
                priority=0.6
            ))
        
        return urls
    
    @staticmethod
    def generate_sitemap_xml(urls: List[SitemapURL]) -> str:
        """
        Generate XML sitemap from URL list
        
        Args:
            urls: List of sitemap URLs
            
        Returns:
            XML string
        """
        xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
        xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
        
        for url in urls:
            xml += '  <url>\n'
            xml += f'    <loc>{url.loc}</loc>\n'
            
            if url.lastmod:
                xml += f'    <lastmod>{url.lastmod.strftime("%Y-%m-%d")}</lastmod>\n'
            
            if url.changefreq:
                xml += f'    <changefreq>{url.changefreq}</changefreq>\n'
            
            if url.priority is not None:
                xml += f'    <priority>{url.priority}</priority>\n'
            
            xml += '  </url>\n'
        
        xml += '</urlset>'
        return xml
    
    @staticmethod
    async def get_dataset_seo(db: AsyncSession, dataset_id: str) -> DatasetSEO:
        """
        Get SEO metadata for dataset
        
        Args:
            db: Database session
            dataset_id: Dataset ID
            
        Returns:
            Dataset SEO data
        """
        from app.services.dataset_service import DatasetService
        from app.services.dataset_meta_service import DatasetMetaService
        
        dataset = await DatasetService.get_by_id(db, dataset_id)
        if not dataset:
            raise ValueError("Dataset not found")
        
        meta = await DatasetMetaService.get_meta(db, dataset_id)
        
        # Generate title (max 60 chars)
        title = f"{dataset.name} - Uzbek {dataset.type.upper()} Dataset | Lisoniy"
        if len(title) > 60:
            title = f"{dataset.name[:40]}... | Lisoniy"
        
        # Generate description (max 160 chars)
        description = dataset.description or f"Download {dataset.name}, a free Uzbek {dataset.type} dataset"
        if len(description) > 160:
            description = description[:157] + "..."
        
        # Keywords
        keywords = ["uzbek", "dataset", dataset.type, "nlp", "corpus", "open source"]
        
        # Structured data (Schema.org Dataset)
        structured_data = {
            "@context": "https://schema.org",
            "@type": "Dataset",
            "name": dataset.name,
            "description": description,
            "url": f"{SEOService.BASE_URL}/datasets/{dataset.id}",
            "keywords": keywords,
            "datePublished": dataset.created_at.isoformat(),
            "dateModified": dataset.updated_at.isoformat(),
            "creator": {
                "@type": "Person",
                "name": dataset.creator.full_name if dataset.creator else "Unknown"
            }
        }
        
        if meta:
            structured_data["interactionStatistic"] = [
                {
                    "@type": "InteractionCounter",
                    "interactionType": "https://schema.org/DownloadAction",
                    "userInteractionCount": meta.downloads_count
                },
                {
                    "@type": "InteractionCounter",
                    "interactionType": "https://schema.org/LikeAction",
                    "userInteractionCount": meta.stars_count
                }
            ]
            
            if meta.license_type:
                structured_data["license"] = meta.license_type
        
        return DatasetSEO(
            seo_title=title,
            seo_description=description,
            seo_keywords=keywords,
            canonical_url=f"{SEOService.BASE_URL}/datasets/{dataset.id}",
            structured_data=structured_data
        )
    
    @staticmethod
    async def get_post_seo(db: AsyncSession, post_id: int) -> PostSEO:
        """
        Get SEO metadata for post/article
        
        Args:
            db: Database session
            post_id: Post ID
            
        Returns:
            Post SEO data
        """
        from app.services.post_service import PostService
        
        post = await PostService.get_post_by_id(db, post_id)
        if not post:
            raise ValueError("Post not found")
        
        # Title
        title = f"{post.title} | Lisoniy"
        if len(title) > 60:
            title = post.title[:55] + "..."
        
        # Description - extract from body
        clean_body = post.body.replace("\n", " ").strip()
        description = clean_body[:157] + "..." if len(clean_body) > 160 else clean_body
        
        # Keywords
        keywords = list(post.tags) if post.tags else []
        keywords.extend(["uzbek", "nlp", post.type])
        
        # Structured data
        if post.type == "article":
            structured_data = {
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": post.title,
                "description": description,
                "datePublished": post.created_at.isoformat(),
                "dateModified": post.updated_at.isoformat(),
                "author": {
                    "@type": "Person",
                    "name": post.owner.full_name if post.owner else "Unknown"
                },
                "publisher": {
                    "@type": "Organization",
                    "name": "Lisoniy",
                    "url": SEOService.BASE_URL
                }
            }
        else:  # discussion
            structured_data = {
                "@context": "https://schema.org",
                "@type": "QAPage",
                "mainEntity": {
                    "@type": "Question",
                    "name": post.title,
                    "text": description,
                    "dateCreated": post.created_at.isoformat(),
                    "author": {
                        "@type": "Person",
                        "name": post.owner.full_name if post.owner else "Unknown"
                    }
                }
            }
        
        url_path = f"/hamjamiyat/post/{post.id}" if post.type == "article" else f"/hamjamiyat/discussion/{post.id}"
        
        return PostSEO(
            seo_title=title,
            seo_description=description,
            seo_keywords=keywords,
            canonical_url=f"{SEOService.BASE_URL}{url_path}",
            structured_data=structured_data
        )
    
    @staticmethod
    async def get_user_seo(db: AsyncSession, user_id: int) -> UserSEO:
        """
        Get SEO metadata for user profile
        
        Args:
            db: Database session
            user_id: User ID
            
        Returns:
            User SEO data
        """
        from app.services.user_service import UserService
        
        user = await UserService.get_user_by_id(db, user_id)
        if not user:
            raise ValueError("User not found")
        
        # Title
        title = f"{user.full_name} - Lisoniy Community Profile"
        
        # Description
        description = f"View {user.full_name}'s contributions to the Uzbek NLP community on Lisoniy. Articles, datasets, and discussions."
        
        # Slug from name
        slug = user.full_name.lower().replace(" ", "-") if user.full_name else f"user-{user.id}"
        
        # Structured data
        structured_data = {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": user.full_name,
            "url": f"{SEOService.BASE_URL}/hamjamiyat/author/{slug}"
        }
        
        return UserSEO(
            seo_title=title,
            seo_description=description,
            canonical_url=f"{SEOService.BASE_URL}/hamjamiyat/author/{slug}",
            structured_data=structured_data
        )
    
    @staticmethod
    def generate_robots_txt() -> str:
        """
        Generate robots.txt content
        
        Returns:
            robots.txt content
        """
        return """User-agent: *
Allow: /
Disallow: /dashboard/
Disallow: /auth/
Disallow: /api/
Disallow: /tools/

Sitemap: {}/sitemap.xml
""".format(SEOService.BASE_URL)

    @staticmethod
    async def generate_post_share_html(db: AsyncSession, post_id: int) -> str:
        """
        Generate HTML page with OG meta tags for social sharing
        
        Args:
            db: Database session
            post_id: Post ID
            
        Returns:
            HTML string with meta tags
        """
        from app.services.post_service import PostService
        
        post = await PostService.get_post(db, post_id)
        if not post:
            raise ValueError("Post not found")
        
        # Clean description
        clean_body = post.body.replace("\n", " ").replace('"', "'").strip()
        description = clean_body[:200] + "..." if len(clean_body) > 200 else clean_body
        
        # URL path based on type
        url_path = f"/hamjamiyat/article/{post.id}" if post.type == "article" else f"/hamjamiyat/discussion/{post.id}"
        full_url = f"{SEOService.BASE_URL}{url_path}"
        
        # Author name
        author_name = post.owner.full_name if post.owner else "Lisoniy"
        
        # Handle datetime conversion
        if hasattr(post.created_at, 'isoformat'):
            published_time = post.created_at.isoformat()
        else:
            published_time = str(post.created_at)
        
        html = f"""<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Primary Meta Tags -->
    <title>{post.title} | Lisoniy</title>
    <meta name="title" content="{post.title} | Lisoniy">
    <meta name="description" content="{description}">
    <meta name="author" content="{author_name}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="article">
    <meta property="og:url" content="{full_url}">
    <meta property="og:title" content="{post.title}">
    <meta property="og:description" content="{description}">
    <meta property="og:image" content="{SEOService.BASE_URL}/og-image.png">
    <meta property="og:site_name" content="Lisoniy">
    <meta property="og:locale" content="uz_UZ">
    <meta property="article:author" content="{author_name}">
    <meta property="article:published_time" content="{published_time}">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="{full_url}">
    <meta name="twitter:title" content="{post.title}">
    <meta name="twitter:description" content="{description}">
    <meta name="twitter:image" content="{SEOService.BASE_URL}/og-image.png">
    
    <!-- Telegram specific -->
    <meta property="telegram:channel" content="@lisoniy">
    
    <!-- Redirect to actual page -->
    <meta http-equiv="refresh" content="0; url={full_url}">
    <link rel="canonical" href="{full_url}">
</head>
<body>
    <p>Redirecting to <a href="{full_url}">{post.title}</a>...</p>
    <script>window.location.href = "{full_url}";</script>
</body>
</html>"""
        
        return html
    
    @staticmethod
    async def generate_dataset_share_html(db: AsyncSession, dataset_id: str) -> str:
        """
        Generate HTML page with OG meta tags for dataset sharing
        
        Args:
            db: Database session
            dataset_id: Dataset ID
            
        Returns:
            HTML string with meta tags
        """
        from app.services.dataset_service import DatasetService
        
        dataset = await DatasetService.get_by_id(db, dataset_id)
        if not dataset:
            raise ValueError("Dataset not found")
        
        # Clean description
        description = dataset.description or f"{dataset.name} - O'zbek tili uchun {dataset.type} dataseti"
        description = description.replace('"', "'")[:200]
        
        full_url = f"{SEOService.BASE_URL}/datasets/{dataset.id}"
        author_name = dataset.creator.full_name if dataset.creator else "Lisoniy"
        
        html = f"""<!DOCTYPE html>
<html lang="uz">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <!-- Primary Meta Tags -->
    <title>{dataset.name} | Lisoniy Datasets</title>
    <meta name="title" content="{dataset.name} | Lisoniy Datasets">
    <meta name="description" content="{description}">
    <meta name="author" content="{author_name}">
    
    <!-- Open Graph / Facebook -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="{full_url}">
    <meta property="og:title" content="{dataset.name}">
    <meta property="og:description" content="{description}">
    <meta property="og:image" content="{SEOService.BASE_URL}/og-image.png">
    <meta property="og:site_name" content="Lisoniy">
    <meta property="og:locale" content="uz_UZ">
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:url" content="{full_url}">
    <meta name="twitter:title" content="{dataset.name}">
    <meta name="twitter:description" content="{description}">
    <meta name="twitter:image" content="{SEOService.BASE_URL}/og-image.png">
    
    <!-- Redirect to actual page -->
    <meta http-equiv="refresh" content="0; url={full_url}">
    <link rel="canonical" href="{full_url}">
</head>
<body>
    <p>Redirecting to <a href="{full_url}">{dataset.name}</a>...</p>
    <script>window.location.href = "{full_url}";</script>
</body>
</html>"""
        
        return html
