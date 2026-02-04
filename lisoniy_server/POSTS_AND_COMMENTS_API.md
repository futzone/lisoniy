# Posts and Comments Service Documentation

## Overview

The Posts and Comments service provides a complete social content platform with:
- ✅ Article and discussion posts
- ✅ Nested comments (recursive reply system)
- ✅ File uploads for posts
- ✅ Redis-based likes and views tracking
- ✅ Background email notifications for comment replies
- ✅ Efficient caching strategy

---

## Database Schema

### Posts Table

```sql
CREATE TABLE posts (
    id INTEGER PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,  -- 'article' or 'discussion'
    files JSON,  -- Array of file URLs
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- Indexes
CREATE INDEX ix_posts_owner_id ON posts(owner_id);
CREATE INDEX ix_posts_type ON posts(type);
CREATE INDEX ix_posts_created_at ON posts(created_at);
```

### Comments Table

```sql
CREATE TABLE comments (
    id INTEGER PRIMARY KEY,
    body TEXT NOT NULL,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    parent_id INTEGER REFERENCES comments(id) ON DELETE CASCADE,  -- For nested replies
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- Indexes
CREATE INDEX ix_comments_owner_id ON comments(owner_id);
CREATE INDEX ix_comments_post_id ON comments(post_id);
CREATE INDEX ix_comments_parent_id ON comments(parent_id);
CREATE INDEX ix_comments_created_at ON comments(created_at);
```

---

## API Endpoints

### 1. Create Post

**Endpoint:** `POST /api/v1/posts/`  
**Auth Required:** ✅ Yes  
**Content-Type:** `multipart/form-data`

**Form Fields:**
- `title` (string, required): Post title (3-255 characters)
- `body` (string, required): Post content (min 10 characters)
- `type` (enum, optional): `article` or `discussion` (default: `discussion`)
- `files` (List[File], optional): Multiple file uploads

**Example (JavaScript):**
```javascript
const formData = new FormData();
formData.append('title', 'My First Post');
formData.append('body', 'This is the content of my post...');
formData.append('type', 'article');
formData.append('files', fileInput1.files[0]);
formData.append('files', fileInput2.files[0]);

const response = await fetch('http://localhost:8000/api/v1/posts/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  },
  body: formData
});
```

**Response (201 Created):**
```json
{
  "id": 1,
  "title": "My First Post",
  "body": "This is the content of my post...",
  "type": "article",
  "files": ["/static/uuid1.jpg", "/static/uuid2.png"],
  "owner_id": 5,
  "owner": {
    "id": 5,
    "email": "user@example.com",
    "full_name": "John Doe",
    "is_verified": true,
    "role": "user",
    "created_at": "2026-01-27T10:00:00Z"
  },
  "total_likes": 0,
  "total_views": 0,
  "created_at": "2026-01-27T16:00:00Z",
  "updated_at": "2026-01-27T16:00:00Z"
}
```

**File Upload Details:**
- Files are stored in `/app/uploads/` directory
- Files are renamed to UUID + original extension
- URLs are returned as `/static/{filename}`
- Multiple files supported

---

### 2. Get All Posts

**Endpoint:** `GET /api/v1/posts/`  
**Auth Required:** ❌ No (Public)  
**Cached:** ❌ No (live data)

**Query Parameters:**
- `skip` (int, default: 0): Pagination offset
- `limit` (int, default: 10, max: 100): Items per page
- `type` (enum, optional): Filter by `article` or `discussion`

**Example:** `GET /api/v1/posts/?skip=0&limit=10&type=article`

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "title": "Post Title",
    "body": "Post content...",
    "type": "article",
    "files": ["/static/file1.jpg"],
    "owner_id": 5,
    "owner": {
      "id": 5,
      "email": "user@example.com",
      "full_name": "John Doe",
      "is_verified": true,
      "role": "user",
      "created_at": "2026-01-27T10:00:00Z"
    },
    "total_likes": 15,
    "total_views": 250,
    "created_at": "2026-01-27T16:00:00Z",
    "updated_at": "2026-01-27T16:00:00Z"
  }
]
```

---

### 3. Get Post with Comments

**Endpoint:** `GET /api/v1/posts/{post_id}`  
**Auth Required:** ❌ No (Public)  
**Cached:** ✅ Yes (Redis, 1 hour)

**Side Effects:**
- **View counter incremented** in Redis: `post:views:{post_id}`
- Post cached after first fetch

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Post Title",
  "body": "Post content...",
  "type": "article",
  "files": [],
  "owner_id": 5,
  "owner": {
    "id": 5,
    "email": "user@example.com",
    "full_name": "John Doe",
    "is_verified": true,
    "role": "user",
    "created_at": "2026-01-27T10:00:00Z"
  },
  "total_likes": 15,
  "total_views": 251,
  "created_at": "2026-01-27T16:00:00Z",
  "updated_at": "2026-01-27T16:00:00Z",
  "comments": [
    {
      "id": 1,
      "body": "Great post!",
      "owner_id": 3,
      "post_id": 1,
      "parent_id": null,
      "created_at": "2026-01-27T16:05:00Z",
      "updated_at": "2026-01-27T16:05:00Z",
      "owner": {
        "id": 3,
        "email": "commenter@example.com",
        "full_name": "Jane Smith",
        "is_verified": true,
        "role": "user",
        "created_at": "2026-01-26T10:00:00Z"
      },
      "replies": [
        {
          "id": 2,
          "body": "Thanks!",
          "owner_id": 5,
          "post_id": 1,
          "parent_id": 1,
          "created_at": "2026-01-27T16:10:00Z",
          "updated_at": "2026-01-27T16:10:00Z",
          "owner": {
            "id": 5,
            "email": "user@example.com",
            "full_name": "John Doe",
            "is_verified": true,
            "role": "user",
            "created_at": "2026-01-27T10:00:00Z"
          },
          "replies": []
        }
      ]
    }
  ]
}
```

**Comment Tree Structure:**
- Top-level comments have `parent_id: null`
- Replies have `parent_id` pointing to parent comment
- Recursively nested `replies` array
- Comments ordered by `created_at` ascending

---

### 4. Update Post

**Endpoint:** `PUT /api/v1/posts/{post_id}`  
**Auth Required:** ✅ Yes (Owner only)

**Request Body:**
```json
{
  "title": "Updated Title",
  "body": "Updated content..."
}
```

**Response (200 OK):**
```json
{
  "id": 1,
  "title": "Updated Title",
  "body": "Updated content...",
  "type": "article",
  "files": [],
  "owner_id": 5,
  "owner": { ... },
  "total_likes": 15,
  "total_views": 251,
  "created_at": "2026-01-27T16:00:00Z",
  "updated_at": "2026-01-27T16:30:00Z"
}
```

**Authorization:**
- Only the post owner can update
- Returns 403 if unauthorized

---

### 5. Delete Post

**Endpoint:** `DELETE /api/v1/posts/{post_id}`  
**Auth Required:** ✅ Yes (Owner only)

**Response (204 No Content)**

**Side Effects:**
- All comments on the post are cascade deleted
- Post cache is invalidated
- Files are NOT automatically deleted (manual cleanup needed)

---

### 6. Like Post

**Endpoint:** `POST /api/v1/posts/{post_id}/like`  
**Auth Required:** ✅ Yes

**Response (204 No Content)**

**Implementation Details:**
- Uses Redis `SADD` to store unique user likes
- Key: `post:likes:{post_id}`
- Value: Set of user IDs
- Duplicate likes are automatically ignored (set uniqueness)
- Post cache is invalidated

**Redis Storage:**
```redis
SADD post:likes:1 5   # User 5 likes post 1
SADD post:likes:1 3   # User 3 likes post 1
SADD post:likes:1 5   # User 5 likes again - ignored (already in set)
SCARD post:likes:1    # Returns 2 (total unique likes)
```

---

### 7. Create Comment

**Endpoint:** `POST /api/v1/comments/{post_id}`  
**Auth Required:** ✅ Yes

**Request Body:**
```json
{
  "body": "This is my comment",
  "parent_id": null  // Optional: ID of parent comment for replies
}
```

**Top-level Comment Example:**
```json
{
  "body": "Great article!"
}
```

**Reply Example:**
```json
{
  "body": "I agree with your point about...",
  "parent_id": 5  // Replying to comment #5
}
```

**Response (201 Created):**
```json
{
  "id": 10,
  "body": "I agree with your point about...",
  "owner_id": 3,
  "post_id": 1,
  "parent_id": 5,
  "created_at": "2026-01-27T17:00:00Z",
  "updated_at": "2026-01-27T17:00:00Z",
  "owner": {
    "id": 3,
    "email": "commenter@example.com",
    "full_name": "Jane Smith",
    "is_verified": true,
    "role": "user",
    "created_at": "2026-01-26T10:00:00Z"
  }
}
```

**Email Notification (Background Task):**
When a reply is created (`parent_id` is not null):
1. System fetches the parent comment's owner
2. If parent owner ≠ current user (prevent self-notification)
3. Email sent in background via `FastAPI BackgroundTasks`
4. Currently mocked (prints to console in development)

**Mock Email Output:**
```
--- MOCK EMAIL ---
To: parent_commenter@example.com
Subject: You have a new reply on 'Post Title'
Body: Jane Smith has replied to your comment.
------------------
```

**Validation:**
- `parent_id` must belong to a comment on the same post
- Post must exist
- Returns 400 if validation fails

---

## Redis Data Structure

### 1. Post Views Counter

**Key:** `post:views:{post_id}`  
**Type:** STRING (integer)  
**Operations:**
- Incremented on every `GET /posts/{id}`
- Retrieved for `total_views` field

```redis
INCR post:views:1    # Increment view count
GET post:views:1     # Get current view count
```

---

### 2. Post Likes Set

**Key:** `post:likes:{post_id}`  
**Type:** SET  
**Operations:**
- Add user ID when liking: `SADD post:likes:{post_id} {user_id}`
- Get total likes: `SCARD post:likes:{post_id}`

```redis
SADD post:likes:1 5    # User 5 likes post 1
SADD post:likes:1 10   # User 10 likes post 1
SCARD post:likes:1     # Returns 2
SISMEMBER post:likes:1 5  # Check if user 5 liked (returns 1)
```

**Unlike Implementation (Future):**
```redis
SREM post:likes:1 5    # User 5 unlikes post 1
```

---

### 3. Post Cache

**Key:** `post:{post_id}`  
**Type:** STRING (JSON)  
**TTL:** 3600 seconds (1 hour)  
**Operations:**
- Set after first fetch
- Invalidated on update/delete

```redis
SET post:1 "{\"id\":1,\"title\":\"...\",..." EX 3600
GET post:1
DEL post:1  # Invalidate
```

---

## Service Layer Architecture

### PostService Methods

```python
class PostService:
    @staticmethod
    async def create_post(
        db: AsyncSession,
        post_data: PostCreate,
        current_user: User,
        files: List[UploadFile]
    ) -> Post
    
    @staticmethod
    async def get_post(db: AsyncSession, post_id: int) -> Optional[Post]
    
    @staticmethod
    async def get_all_posts(
        db: AsyncSession,
        skip: int,
        limit: int,
        post_type: Optional[PostType]
    ) -> Tuple[List[Post], int]
    
    @staticmethod
    async def update_post(
        db: AsyncSession,
        post_id: int,
        post_data: PostUpdate,
        current_user: User
    ) -> Optional[Post]
    
    @staticmethod
    async def delete_post(
        db: AsyncSession,
        post_id: int,
        current_user: User
    ) -> bool
    
    @staticmethod
    async def like_post(post_id: int, user_id: int)
    
    @staticmethod
    async def get_post_metrics(post_id: int) -> dict
```

### CommentService Methods

```python
class CommentService:
    @staticmethod
    async def create_comment(
        db: AsyncSession,
        comment_data: CommentCreate,
        post_id: int,
        current_user: User,
        background_tasks: BackgroundTasks
    ) -> Comment
    
    @staticmethod
    async def get_comments_for_post(
        db: AsyncSession,
        post_id: int
    ) -> List[Comment]
    
    @staticmethod
    def build_comment_tree(comments: List[Comment]) -> List[Comment]
```

---

## Performance Optimizations

### 1. Redis Caching
- **Post caching:** 1-hour TTL reduces database load
- **View counter:** Redis INCR is O(1), much faster than SQL UPDATE
- **Likes storage:** Redis SETs provide O(1) membership checking

### 2. Lazy Loading
- All relationships configured with `lazy="noload"`
- Prevents automatic loading during serialization
- Avoids recursion errors

### 3. Selective Loading
```python
# Only load what you need
result = await db.execute(
    select(Post).options(selectinload(Post.owner))
)
```

### 4. Comment Tree Building
- Efficient O(n) algorithm
- Single database query fetches all comments
- Tree built in-memory using hash map

### 5. Background Tasks
- Email notifications don't block request
- FastAPI `BackgroundTasks` runs after response sent

---

## File Upload Configuration

### Settings Required

```python
# app/core/config.py
class Settings(BaseSettings):
    UPLOADS_DIR: str = "/app/uploads"  # In Docker
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10 MB
```

### File Storage Structure
```
/app/uploads/
├── uuid1-abc123.jpg
├── uuid2-def456.png
└── uuid3-ghi789.pdf
```

### Serving Static Files

```python
# main.py
from fastapi.staticfiles import StaticFiles

app.mount("/static", StaticFiles(directory=settings.UPLOADS_DIR), name="static")
```

**Access files:** `http://localhost:8000/static/uuid1-abc123.jpg`

---

## Error Handling

### Common Errors

**400 Bad Request:**
```json
{
  "detail": "Post not found"
}
```

**403 Forbidden:**
```json
{
  "detail": "Not authorized or post not found"
}
```

**Validation Error (422):**
```json
{
  "detail": [
    {
      "loc": ["body", "title"],
      "msg": "ensure this value has at least 3 characters",
      "type": "value_error.any_str.min_length"
    }
  ]
}
```

---

## Testing Examples

### Python Test Example

```python
import requests

BASE_URL = "http://localhost:8000/api/v1"

# Login
login_response = requests.post(f"{BASE_URL}/auth/login", json={
    "email": "user@example.com",
    "password": "password123"
})
token = login_response.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# Create post
files = [('files', open('image.jpg', 'rb'))]
data = {
    'title': 'My Post',
    'body': 'This is a great post about...',
    'type': 'article'
}
post_response = requests.post(
    f"{BASE_URL}/posts/",
    headers=headers,
    data=data,
    files=files
)
post_id = post_response.json()["id"]

# Get post with comments
get_response = requests.get(f"{BASE_URL}/posts/{post_id}")
print(f"Views: {get_response.json()['total_views']}")

# Like post
requests.post(f"{BASE_URL}/posts/{post_id}/like", headers=headers)

# Add comment
comment_response = requests.post(
    f"{BASE_URL}/comments/{post_id}",
    headers=headers,
    json={"body": "Great article!"}
)
comment_id = comment_response.json()["id"]

# Reply to comment
reply_response = requests.post(
    f"{BASE_URL}/comments/{post_id}",
    headers=headers,
    json={
        "body": "Thanks for the feedback!",
        "parent_id": comment_id
    }
)
```

---

## Migration Instructions

### Run Migration

```bash
# If using Docker
docker-compose exec web alembic upgrade head

# If running locally
alembic upgrade head
```

### Migration File
Location: `alembic/versions/004_posts_and_comments.py`

---

## Future Enhancements

1. **Unlike Feature:** Add `DELETE /posts/{id}/unlike` endpoint
2. **Edit Comments:** Add `PATCH /comments/{id}` endpoint
3. **Delete Comments:** Add `DELETE /comments/{id}` endpoint
4. **Reactions:** Extend beyond likes (love, laugh, angry, etc.)
5. **Real Email Service:** Replace mock with SendGrid/AWS SES
6. **File Validation:** Add MIME type checking, virus scanning
7. **Pagination:** Add total count to `GET /posts/` response
8. **Search:** Full-text search across posts
9. **Tags:** Add tagging system for posts
10. **Notifications:** Real-time notifications via WebSockets

---

## Summary

✅ **Complete Implementation:**
- Posts with file uploads
- Nested comments (unlimited depth)
- Redis-based metrics (likes, views)
- Background email notifications
- Efficient caching and loading
- Proper authorization and validation

✅ **Production Ready:**
- Cascade delete handling
- Cache invalidation
- Error handling
- Performance optimizations
- Security (owner-only updates/deletes)

**The posts and comments service is fully functional and ready to use!**
