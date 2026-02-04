# API Documentation for Frontend Integration

**Base URL:** `http://localhost:8000/api/v1`

**Version:** 1.0  
**Last Updated:** 2026-01-27

This document provides complete API documentation for frontend developers and AI agents to integrate with the Lisoniy Server backend.

---

## Table of Contents

1. [Authentication API](#authentication-api)
2. [Categories API](#categories-api)
3. [Terms API](#terms-api)
4. [Datasets API](#datasets-api)
5. [Entries API](#entries-api)
6. [Error Handling](#error-handling)
7. [Quick Start Examples](#quick-start-examples)

---

## Authentication API

Base path: `/auth`

### 1. Register New User

**Endpoint:** `POST /auth/register`  
**Auth Required:** ❌ No  
**Rate Limited:** ✅ Yes (by IP)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "full_name": "John Doe",
  "phone": "+998901234567"
}
```

**Response (201 Created):**
```json
{
  "message": "Registration successful. Please verify your email.",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "is_verified": false,
    "created_at": "2026-01-27T12:00:00Z"
  }
}
```

**Validation Rules:**
- Email: Valid email format, unique
- Password: Minimum 8 characters
- Full name: Optional but recommended
- Phone: Optional, valid phone format

---

### 2. Verify Email with OTP

**Endpoint:** `POST /auth/verify-email`  
**Auth Required:** ❌ No

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "email": "user@example.com",
  "full_name": "John Doe",
  "is_verified": true,
  "role": "user",
  "created_at": "2026-01-27T12:00:00Z"
}
```

**Notes:**
- OTP expires after 10 minutes
- 3 OTP attempts allowed before needing to request a new one

---

### 3. Login

**Endpoint:** `POST /auth/login`  
**Auth Required:** ❌ No  
**Rate Limited:** ✅ Yes (by email)

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "expires_in": 1800
}
```

**Error (401 Unauthorized):**
```json
{
  "detail": "Invalid email or password"
}
```

**Frontend Usage:**
```javascript
// Store tokens securely
localStorage.setItem('access_token', response.access_token);
localStorage.setItem('refresh_token', response.refresh_token);

// Use in subsequent requests
const headers = {
  'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
  'Content-Type': 'application/json'
};
```

---

### 4. Refresh Access Token

**Endpoint:** `POST /auth/refresh`  
**Auth Required:** ❌ No (requires refresh token)

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer"
}
```

**When to refresh:**
- When you get a 401 Unauthorized error
- Before access token expires (30 minutes from login)

---

### 5. Request Password Reset

**Endpoint:** `POST /auth/request-password-reset`  
**Auth Required:** ❌ No  
**Rate Limited:** ✅ Yes (by IP)

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK):**
```json
{
  "message": "If the email exists, a password reset link has been sent."
}
```

---

### 6. Reset Password

**Endpoint:** `POST /auth/reset-password`  
**Auth Required:** ❌ No

**Request Body:**
```json
{
  "token": "reset-token-from-email",
  "new_password": "NewSecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "message": "Password has been reset successfully"
}
```

---

## Categories API

Base path: `/categories`

### 1. Get All Categories

**Endpoint:** `GET /categories/`  
**Auth Required:** ❌ No  
**Cached:** ✅ Yes (Redis, 1 hour)

**Query Parameters:**
- `offset` (int, default: 0): Pagination offset
- `limit` (int, default: 20, max: 100): Items per page

**Response (200 OK):**
```json
{
  "total": 45,
  "offset": 0,
  "limit": 20,
  "categories": [
    {
      "id": "uuid-here",
      "name": "Technology",
      "slug": "technology",
      "description": "Tech-related terminology",
      "parent_id": null,
      "term_count": 150,
      "created_at": "2026-01-20T10:00:00Z",
      "updated_at": "2026-01-27T12:00:00Z"
    }
  ]
}
```

---

### 2. Get Category by Slug

**Endpoint:** `GET /categories/{slug}`  
**Auth Required:** ❌ No  
**Cached:** ✅ Yes (Redis, 1 hour)

**Example:** `GET /categories/technology`

**Response (200 OK):**
```json
{
  "id": "uuid-here",
  "name": "Technology",
  "slug": "technology",
  "description": "Tech-related terminology",
  "parent_id": null,
  "term_count": 150,
  "created_at": "2026-01-20T10:00:00Z",
  "updated_at": "2026-01-27T12:00:00Z"
}
```

**Error (404 Not Found):**
```json
{
  "detail": "Category with slug 'invalid-slug' not found"
}
```

---

### 3. Get Category Terms

**Endpoint:** `GET /categories/{slug}/terms`  
**Auth Required:** ❌ No  
**Cached:** ✅ Yes (Redis, 1 hour)

**Query Parameters:**
- `offset` (int, default: 0)
- `limit` (int, default: 20, max: 100)

**Example:** `GET /categories/technology/terms?offset=0&limit=10`

**Response (200 OK):**
```json
{
  "category": {
    "id": "uuid-here",
    "name": "Technology",
    "slug": "technology"
  },
  "total": 150,
  "offset": 0,
  "limit": 10,
  "terms": [
    {
      "id": "uuid-here",
      "uzbek": "Sun'iy intellekt",
      "english": "Artificial Intelligence",
      "russian": "Искусственный интеллект",
      "category_id": "uuid-here",
      "status": "approved",
      "created_at": "2026-01-20T10:00:00Z"
    }
  ]
}
```

---

## Terms API

Base path: `/terms`

### 1. Search Terms

**Endpoint:** `GET /terms/search`  
**Auth Required:** ❌ No  
**Cached:** ✅ Yes (Redis, 5 minutes)

**Query Parameters:**
- `q` (string, required): Search query
- `lang` (string, optional): Language filter ('uz', 'en', 'ru')
- `category_slug` (string, optional): Filter by category
- `offset` (int, default: 0)
- `limit` (int, default: 20, max: 100)

**Example:** `GET /terms/search?q=intellekt&lang=uz&limit=5`

**Response (200 OK):**
```json
{
  "total": 3,
  "offset": 0,
  "limit": 5,
  "terms": [
    {
      "id": "uuid-here",
      "uzbek": "Sun'iy intellekt",
      "english": "Artificial Intelligence",
      "russian": "Искусственный интеллект",
      "category_id": "uuid-here",
      "status": "approved",
      "created_at": "2026-01-20T10:00:00Z"
    }
  ]
}
```

**Search Behavior:**
- Searches across all three language fields
- Case-insensitive
- Partial matching supported
- Returns results ranked by relevance

---

### 2. Get Term by ID

**Endpoint:** `GET /terms/{term_id}`  
**Auth Required:** ❌ No

**Response (200 OK):**
```json
{
  "id": "uuid-here",
  "uzbek": "Sun'iy intellekt",
  "english": "Artificial Intelligence",
  "russian": "Искусственный интеллект",
  "category_id": "uuid-here",
  "status": "approved",
  "created_at": "2026-01-20T10:00:00Z",
  "updated_at": "2026-01-27T12:00:00Z"
}
```

---

### 3. Create Term (Admin)

**Endpoint:** `POST /terms/`  
**Auth Required:** ✅ Yes (Admin only)

**Request Body:**
```json
{
  "uzbek": "Mashinani o'rganish",
  "english": "Machine Learning",
  "russian": "Машинное обучение",
  "category_id": "uuid-here"
}
```

**Response (201 Created):**
```json
{
  "id": "new-uuid",
  "uzbek": "Mashinani o'rganish",
  "english": "Machine Learning",
  "russian": "Машинное обучение",
  "category_id": "uuid-here",
  "status": "pending",
  "created_at": "2026-01-27T13:00:00Z"
}
```

---

## Datasets API

Base path: `/datasets`

### 1. Create Dataset

**Endpoint:** `POST /datasets/`  
**Auth Required:** ✅ Yes

**Request Body:**
```json
{
  "name": "Uzbek-English Translation Corpus",
  "type": "parallel",
  "description": "High-quality parallel sentences for machine translation",
  "is_public": false
}
```

**Response (201 Created):**
```json
{
  "id": "uuid-here",
  "name": "Uzbek-English Translation Corpus",
  "type": "parallel",
  "description": "High-quality parallel sentences for machine translation",
  "is_public": false,
  "creator_id": 1,
  "entry_count": 0,
  "created_at": "2026-01-27T13:00:00Z",
  "updated_at": "2026-01-27T13:00:00Z"
}
```

**Dataset Types:**
- `instruction` - LLM fine-tuning datasets
- `parallel` - Translation/multilingual data
- `ner` - Named entity recognition
- `legal_qa` - Legal question answering
- `classification` - Text classification
- `sentiment` - Sentiment analysis
- `summarization` - Text summarization
- `qa` - Question answering
- Custom types are also supported

---

### 2. Get My Datasets

**Endpoint:** `GET /datasets/me`  
**Auth Required:** ✅ Yes

**Query Parameters:**
- `offset` (int, default: 0)
- `limit` (int, default: 20, max: 100)

**Response (200 OK):**
```json
{
  "total": 5,
  "offset": 0,
  "limit": 20,
  "datasets": [
    {
      "id": "uuid-here",
      "name": "My Dataset",
      "type": "instruction",
      "description": "Dataset description",
      "is_public": false,
      "creator_id": 1,
      "entry_count": 1500,
      "created_at": "2026-01-27T13:00:00Z",
      "updated_at": "2026-01-27T13:00:00Z"
    }
  ]
}
```

---

### 3. Get Public Datasets

**Endpoint:** `GET /datasets/public`  
**Auth Required:** ❌ No

**Query Parameters:**
- `dataset_type` (string, optional): Filter by type
- `offset` (int, default: 0)
- `limit` (int, default: 20, max: 100)

**Example:** `GET /datasets/public?dataset_type=parallel&limit=10`

**Response (200 OK):**
```json
{
  "total": 12,
  "offset": 0,
  "limit": 10,
  "datasets": [
    {
      "id": "uuid-here",
      "name": "Public Translation Dataset",
      "type": "parallel",
      "description": "Open dataset for translation",
      "is_public": true,
      "creator_id": 5,
      "entry_count": 50000,
      "created_at": "2026-01-20T10:00:00Z",
      "updated_at": "2026-01-27T12:00:00Z"
    }
  ]
}
```

---

### 4. Get Dataset by ID

**Endpoint:** `GET /datasets/{dataset_id}`  
**Auth Required:** ❌ No (for public datasets)

**Response (200 OK):**
```json
{
  "id": "uuid-here",
  "name": "Dataset Name",
  "type": "instruction",
  "description": "Dataset description",
  "is_public": true,
  "creator_id": 1,
  "entry_count": 1500,
  "created_at": "2026-01-27T13:00:00Z",
  "updated_at": "2026-01-27T13:00:00Z"
}
```

---

### 5. Update Dataset

**Endpoint:** `PATCH /datasets/{dataset_id}`  
**Auth Required:** ✅ Yes (Owner only)

**Request Body:**
```json
{
  "name": "Updated Dataset Name",
  "description": "Updated description",
  "is_public": true
}
```

**Response (200 OK):**
```json
{
  "id": "uuid-here",
  "name": "Updated Dataset Name",
  "type": "instruction",
  "description": "Updated description",
  "is_public": true,
  "creator_id": 1,
  "entry_count": 1500,
  "created_at": "2026-01-27T13:00:00Z",
  "updated_at": "2026-01-27T13:30:00Z"
}
```

---

### 6. Delete Dataset

**Endpoint:** `DELETE /datasets/{dataset_id}`  
**Auth Required:** ✅ Yes (Owner only)

**Response (204 No Content)**

**Note:** This will cascade delete all entries in the dataset!

---

### 7. Search Datasets

**Endpoint:** `GET /datasets/search/all`  
**Auth Required:** ✅ Yes

**Query Parameters:**
- `q` (string, optional): Search query (name/description)
- `dataset_type` (string, optional): Filter by type
- `offset` (int, default: 0)
- `limit` (int, default: 20, max: 100)

**Example:** `GET /datasets/search/all?q=translation&dataset_type=parallel`

**Response (200 OK):**
```json
{
  "total": 3,
  "offset": 0,
  "limit": 20,
  "datasets": [
    {
      "id": "uuid-here",
      "name": "Translation Dataset",
      "type": "parallel",
      "description": "Dataset for translation",
      "is_public": true,
      "creator_id": 1,
      "entry_count": 5000,
      "created_at": "2026-01-27T13:00:00Z",
      "updated_at": "2026-01-27T13:00:00Z"
    }
  ]
}
```

---

## Entries API

Base path: `/entries`

### 1. Create Single Entry

**Endpoint:** `POST /entries/`  
**Auth Required:** ✅ Yes

**Request Body:**
```json
{
  "dataset_id": "uuid-here",
  "content": {
    "instruction": "Translate to Uzbek",
    "input": "Hello world",
    "output": "Salom dunyo"
  },
  "metadata": {
    "source": "manual",
    "quality": "high",
    "tags": ["verified", "reviewed"]
  }
}
```

**Response (201 Created):**
```json
{
  "id": "uuid-here",
  "dataset_id": "uuid-here",
  "content": {
    "instruction": "Translate to Uzbek",
    "input": "Hello world",
    "output": "Salom dunyo"
  },
  "entry_metadata": {
    "source": "manual",
    "quality": "high",
    "tags": ["verified", "reviewed"]
  },
  "hash_key": "sha256-hash-here",
  "creator_id": 1,
  "created_at": "2026-01-27T13:00:00Z",
  "updated_at": "2026-01-27T13:00:00Z"
}
```

**Error (409 Conflict):**
```json
{
  "detail": "Duplicate entry detected"
}
```

**Note:** Duplicates are detected using SHA256 hash of dataset_id + content

---

### 2. Bulk Create Entries

**Endpoint:** `POST /entries/bulk`  
**Auth Required:** ✅ Yes

**Request Body (max 1000 entries):**
```json
{
  "dataset_id": "uuid-here",
  "entries": [
    {
      "source_lang": "uz",
      "target_lang": "en",
      "source_text": "Salom",
      "target_text": "Hello"
    },
    {
      "source_lang": "uz",
      "target_lang": "en",
      "source_text": "Rahmat",
      "target_text": "Thank you"
    }
  ]
}
```

**Response (201 Created):**
```json
{
  "total": 2,
  "created": 2,
  "skipped": 0,
  "failed": 0,
  "errors": []
}
```

**Partial Success Example:**
```json
{
  "total": 100,
  "created": 95,
  "skipped": 5,
  "failed": 0,
  "errors": []
}
```

**Performance:**
- Up to 1000 entries per request
- Uses PostgreSQL `ON CONFLICT DO NOTHING` for efficiency
- Duplicates automatically skipped
- Expected time: ~100-200ms for 1000 entries

---

### 3. Search/Filter Entries

**Endpoint:** `GET /entries/`  
**Auth Required:** ❌ No  
**Cached:** ⏸️ Temporarily disabled (will be re-enabled)

**Query Parameters:**
- `dataset_id` (UUID, optional): Filter by dataset
- `dataset_type` (string, optional): Filter by dataset type
- `offset` (int, default: 0)
- `limit` (int, default: 20, max: 100)

**Example:** `GET /entries/?dataset_id=uuid-here&offset=0&limit=20`

**Response (200 OK):**
```json
{
  "total": 1500,
  "offset": 0,
  "limit": 20,
  "entries": [
    {
      "id": "uuid-here",
      "dataset_id": "uuid-here",
      "content": {
        "instruction": "Translate to Uzbek",
        "input": "Hello",
        "output": "Salom"
      },
      "entry_metadata": {
        "source": "manual",
        "quality": "high"
      },
      "hash_key": "sha256-hash",
      "creator_id": 1,
      "created_at": "2026-01-27T13:00:00Z",
      "updated_at": "2026-01-27T13:00:00Z"
    }
  ]
}
```

---

### 4. Get Entry by ID

**Endpoint:** `GET /entries/{entry_id}`  
**Auth Required:** ❌ No

**Response (200 OK):**
```json
{
  "id": "uuid-here",
  "dataset_id": "uuid-here",
  "content": {
    "instruction": "Translate",
    "input": "Hello",
    "output": "Salom"
  },
  "entry_metadata": {
    "source": "manual"
  },
  "hash_key": "sha256-hash",
  "creator_id": 1,
  "created_at": "2026-01-27T13:00:00Z",
  "updated_at": "2026-01-27T13:00:00Z"
}
```

---

### 5. Update Entry

**Endpoint:** `PATCH /entries/{entry_id}`  
**Auth Required:** ✅ Yes (Owner only)

**Request Body:**
```json
{
  "content": {
    "instruction": "Updated instruction",
    "input": "Updated input",
    "output": "Updated output"
  },
  "metadata": {
    "source": "automated",
    "reviewed": true
  }
}
```

**Response (200 OK):**
```json
{
  "id": "uuid-here",
  "dataset_id": "uuid-here",
  "content": {
    "instruction": "Updated instruction",
    "input": "Updated input",
    "output": "Updated output"
  },
  "entry_metadata": {
    "source": "automated",
    "reviewed": true
  },
  "hash_key": "new-sha256-hash",
  "creator_id": 1,
  "created_at": "2026-01-27T13:00:00Z",
  "updated_at": "2026-01-27T13:30:00Z"
}
```

**Note:** Hash is regenerated when content is updated

---

### 6. Delete Entry

**Endpoint:** `DELETE /entries/{entry_id}`  
**Auth Required:** ✅ Yes (Owner only)

**Response (204 No Content)**

---

### 7. Bulk Delete Entries

**Endpoint:** `DELETE /entries/bulk`  
**Auth Required:** ✅ Yes (Owner only)

**Request Body (max 1000 IDs):**
```json
{
  "entry_ids": [
    "uuid-1",
    "uuid-2",
    "uuid-3"
  ]
}
```

**Response (200 OK):**
```json
{
  "total": 3,
  "deleted": 3,
  "failed": 0,
  "errors": []
}
```

**Partial Success:**
```json
{
  "total": 5,
  "deleted": 3,
  "failed": 2,
  "errors": [
    "2 entries not found or unauthorized"
  ]
}
```

---

## Error Handling

### Standard Error Response Format

```json
{
  "detail": "Error message here"
}
```

### HTTP Status Codes

| Code | Meaning | When It Occurs |
|------|---------|----------------|
| 200 | OK | Successful GET, PATCH requests |
| 201 | Created | Successful POST requests |
| 204 | No Content | Successful DELETE requests |
| 400 | Bad Request | Invalid request body/parameters |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Authenticated but lacking permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Duplicate entry (for entries) |
| 422 | Validation Error | Request validation failed |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |

### Common Error Examples

**401 Unauthorized:**
```json
{
  "detail": "Not authenticated"
}
```

**Validation Error (422):**
```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "value is not a valid email address",
      "type": "value_error.email"
    }
  ]
}
```

**Rate Limit (429):**
```json
{
  "detail": "Too many requests. Please try again later."
}
```

---

## Quick Start Examples

### JavaScript/TypeScript Example

```typescript
// API Client Configuration
const API_BASE_URL = 'http://localhost:8000/api/v1';

class APIClient {
  private accessToken: string | null = null;

  // Set authentication token
  setToken(token: string) {
    this.accessToken = token;
    localStorage.setItem('access_token', token);
  }

  // Get headers with authentication
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (this.accessToken) {
      headers['Authorization'] = `Bearer ${this.accessToken}`;
    }
    
    return headers;
  }

  // Login
  async login(email: string, password: string) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      throw new Error('Login failed');
    }
    
    const data = await response.json();
    this.setToken(data.access_token);
    return data;
  }

  // Create dataset
  async createDataset(name: string, type: string, description: string, isPublic = false) {
    const response = await fetch(`${API_BASE_URL}/datasets/`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        name,
        type,
        description,
        is_public: isPublic
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to create dataset');
    }
    
    return await response.json();
  }

  // Bulk create entries
  async bulkCreateEntries(datasetId: string, entries: any[]) {
    const response = await fetch(`${API_BASE_URL}/entries/bulk`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({
        dataset_id: datasetId,
        entries
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to create entries');
    }
    
    return await response.json();
  }

  // Search terms
  async searchTerms(query: string, lang?: string) {
    const params = new URLSearchParams({ q: query });
    if (lang) params.append('lang', lang);
    
    const response = await fetch(`${API_BASE_URL}/terms/search?${params}`, {
      headers: this.getHeaders()
    });
    
    if (!response.ok) {
      throw new Error('Search failed');
    }
    
    return await response.json();
  }

  // Get public datasets
  async getPublicDatasets(type?: string, offset = 0, limit = 20) {
    const params = new URLSearchParams({
      offset: offset.toString(),
      limit: limit.toString()
    });
    if (type) params.append('dataset_type', type);
    
    const response = await fetch(`${API_BASE_URL}/datasets/public?${params}`);
    
    if (!response.ok) {
      throw new Error('Failed to fetch datasets');
    }
    
    return await response.json();
  }
}

// Usage
const api = new APIClient();

// Login and create dataset
async function example() {
  try {
    // Login
    await api.login('user@example.com', 'password123');
    
    // Create dataset
    const dataset = await api.createDataset(
      'My Translation Dataset',
      'parallel',
      'Uzbek-English translations',
      false
    );
    
    // Bulk add entries
    const entries = [
      { source_lang: 'uz', target_lang: 'en', source_text: 'Salom', target_text: 'Hello' },
      { source_lang: 'uz', target_lang: 'en', source_text: 'Rahmat', target_text: 'Thank you' }
    ];
    
    const result = await api.bulkCreateEntries(dataset.id, entries);
    console.log(`Created ${result.created} entries`);
    
  } catch (error) {
    console.error('Error:', error);
  }
}
```

### Python Example

```python
import requests
from typing import Optional, List, Dict

class LisoniyClient:
    def __init__(self, base_url: str = "http://localhost:8000/api/v1"):
        self.base_url = base_url
        self.access_token: Optional[str] = None
    
    def _get_headers(self) -> Dict[str, str]:
        headers = {"Content-Type": "application/json"}
        if self.access_token:
            headers["Authorization"] = f"Bearer {self.access_token}"
        return headers
    
    def login(self, email: str, password: str) -> Dict:
        """Login and store access token"""
        response = requests.post(
            f"{self.base_url}/auth/login",
            json={"email": email, "password": password}
        )
        response.raise_for_status()
        data = response.json()
        self.access_token = data["access_token"]
        return data
    
    def create_dataset(self, name: str, dataset_type: str, 
                      description: str, is_public: bool = False) -> Dict:
        """Create a new dataset"""
        response = requests.post(
            f"{self.base_url}/datasets/",
            headers=self._get_headers(),
            json={
                "name": name,
                "type": dataset_type,
                "description": description,
                "is_public": is_public
            }
        )
        response.raise_for_status()
        return response.json()
    
    def bulk_create_entries(self, dataset_id: str, entries: List[Dict]) -> Dict:
        """Bulk create entries"""
        response = requests.post(
            f"{self.base_url}/entries/bulk",
            headers=self._get_headers(),
            json={"dataset_id": dataset_id, "entries": entries}
        )
        response.raise_for_status()
        return response.json()
    
    def search_terms(self, query: str, lang: Optional[str] = None) -> Dict:
        """Search terms"""
        params = {"q": query}
        if lang:
            params["lang"] = lang
        
        response = requests.get(
            f"{self.base_url}/terms/search",
            params=params,
            headers=self._get_headers()
        )
        response.raise_for_status()
        return response.json()

# Usage
client = LisoniyClient()

# Login
client.login("user@example.com", "password123")

# Create dataset
dataset = client.create_dataset(
    name="My Dataset",
    dataset_type="instruction",
    description="LLM training data",
    is_public=False
)

# Add entries
entries = [
    {"instruction": "Translate", "input": "Hello", "output": "Salom"},
    {"instruction": "Translate", "input": "Thank you", "output": "Rahmat"}
]

result = client.bulk_create_entries(dataset["id"], entries)
print(f"Created {result['created']} entries")
```

---

## Interactive API Documentation

For interactive API testing and detailed schema information:

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

---

## Support & Additional Resources

- **Dataset Schema Guide:** See `about_dataset.md` for detailed information about dataset types and recommended schemas
- **Source Code:** Available in the repository
- **Issues:** Report bugs or request features via GitHub issues

---

**Last Updated:** 2026-01-27  
**API Version:** 1.0  
**Server:** Lisoniy Backend API
