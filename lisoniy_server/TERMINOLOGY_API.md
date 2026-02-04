# Terminology API - Quick Start Guide

## Overview
The Terminology/Dictionary API system is now fully implemented with:
- ✅ Database models (Category, Term, Definition, AuditLog)
- ✅ Pydantic schemas with validation
- ✅ Business logic services
- ✅ RESTful API endpoints
- ✅ JWT authentication integration
- ✅ Redis caching
- ✅ Full-text search
- ✅ Audit logging

## Database Migration

Before using the API, run the database migration:

```bash
# Make sure Docker containers are running
docker-compose up -d

# Run migration (inside the web container or locally if you have alembic)
docker-compose exec web alembic upgrade head
```

This will create all necessary tables:
- `categories` - Term categories
- `terms` - Main terminology table
- `definitions` - Translations and explanations
- `term_audit_logs` - Audit trail

## Seed Sample Data

To populate the database with sample data:

```bash
# Inside the web container
docker-compose exec web python seed_terminology.py

# Or locally
python seed_terminology.py
```

This will create:
- 3 categories (IT Texnologiyalari, Dasturlash, Sun'iy Intellekt)
- 4 sample terms with definitions in Uzbek, English, and Russian

## API Endpoints

### Public Endpoints (No Auth Required)

#### Search Terms
```http
GET /api/v1/search/?q=api&language=uz&category=it-texnologiyalari
```

#### Get Term by Keyword
```http
GET /api/v1/terms/API
```

#### Get All Categories
```http
GET /api/v1/categories/
```

#### Get Category Terms
```http
GET /api/v1/categories/it-texnologiyalari/terms
```

### Protected Endpoints (Requires Authentication)

First, register and login to get an access token:

```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "Test User"
}
```

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

Then use the `access_token` in Authorization header:

#### Create Term
```http
POST /api/v1/terms/
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "keyword": "FastAPI",
  "category_id": "<category-uuid>",
  "definitions": [
    {
      "language": "uz",
      "text": "Python uchun zamonaviy, tez web framework",
      "example": "FastAPI async/await qo'llab-quvvatlaydi"
    },
    {
      "language": "en",
      "text": "Modern, fast web framework for Python",
      "example": "FastAPI supports async/await"
    }
  ]
}
```

#### Update Term
```http
PATCH /api/v1/terms/<term-id>
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "keyword": "FastAPI Framework"
}
```

#### Delete Term (Soft Delete)
```http
DELETE /api/v1/terms/<term-id>
Authorization: Bearer <access_token>
```

#### Bulk Create Terms
```http
POST /api/v1/terms/bulk
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "terms": [
    {
      "keyword": "Redis",
      "category_id": "<category-uuid>",
      "definitions": [...]
    },
    {
      "keyword": "PostgreSQL",
      "category_id": "<category-uuid>",
      "definitions": [...]
    }
  ]
}
```

#### Bulk Delete Terms
```http
DELETE /api/v1/terms/bulk
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "term_ids": ["<uuid1>", "<uuid2>"]
}
```

### Admin-Only Endpoints

Create/Update/Delete categories requires Admin role:

```http
POST /api/v1/categories/
Authorization: Bearer <admin_access_token>
Content-Type: application/json

{
  "slug": "web-development",
  "name": "Web Development",
  "description": "Web development related terms"
}
```

## Features

### 1. Atomic Transactions
When creating a term, if any definition fails, the entire operation rolls back.

### 2. Multi-Strategy Search
Search prioritizes results:
1. **Exact match** on keyword (highest priority)
2. **Partial match** on keyword (medium priority)
3. **Full-text search** on definitions (lower priority)

### 3. Redis Caching
- Terms: 1 hour cache
- Search results: 30 minutes cache
- Categories: 2 hours cache
- Automatic cache invalidation on updates

### 4. Audit Logging
Every create/update/delete operation is logged with:
- User ID
- Action type
- Timestamp
- Changes made (JSON)

### 5. Soft Deletes
Deleted terms are marked as `is_deleted=true` instead of being removed, allowing data recovery.

## Testing with Swagger UI

1. Start the application:
```bash
docker-compose up
```

2. Open Swagger UI:
```
http://localhost:8000/docs
```

3. Test endpoints interactively with the built-in UI

## Redis Integration

Cache keys used:
- `term:{keyword}` - Individual term cache
- `search:{query}:{language}:{category}` - Search results
- `categories:all` - All categories
- `category:{slug}:terms:{offset}:{limit}` - Category terms

## Database Schema

```
categories
├── id (UUID, PK)
├── slug (String, Unique, Index)
├── name (String)
├── description (Text)
└── timestamps

terms
├── id (UUID, PK)
├── keyword (String, Unique, Index)
├── category_id (UUID, FK)
├── creator_id (Integer, FK to users)
├── is_deleted (Boolean)
├── deleted_at (DateTime)
├── deleted_by (Integer, FK to users)
└── timestamps

definitions
├── id (UUID, PK)
├── term_id (UUID, FK)
├── language (String, 2 chars)
├── text (Text)
├── example (Text)
├── is_approved (Boolean)
├── search_vector (TSVector)
└── timestamps

term_audit_logs
├── id (UUID, PK)
├── term_id (UUID, FK)
├── user_id (Integer, FK to users)
├── action (Enum: CREATE/UPDATE/DELETE)
├── changes (Text/JSON)
└── timestamp
```

## Next Steps

1. Run migrations
2. Seed sample data
3. Test endpoints with Swagger UI
4. Create a frontend application
5. Add more categories and terms
6. Implement definition editing endpoints if needed
7. Add statistics and usage tracking

## Troubleshooting

### Migration fails
```bash
# Drop all tables and recreate
docker-compose down -v
docker-compose up -d
docker-compose exec web alembic upgrade head
```

### Redis not caching
Check Redis connection:
```bash
docker-compose exec redis redis-cli ping
# Should return: PONG
```

### Authentication failing
Make sure to:
1. Register a user first
2. Verify email (or skip verification in settings)
3. Login to get access token
4. Use Bearer token in Authorization header
