# Posts Tags Feature Documentation

## Overview

Posts now support **hashtag-style tags** for categorization and filtering. Tags are stored as a JSONB array in PostgreSQL with a GIN index for efficient searching.

---

## Features

✅ **Tag Support:**
- Posts can have multiple tags
- Tags stored as JSON array: `["python", "fastapi", "api"]`
- Automatic normalization (lowercase, # removal)
- GIN index for fast searching

✅ **Flexible Input:**
- Accept tags with or without `#` prefix
- Case-insensitive storage and search
- Comma-separated form input support

---

## API Usage

### 1. Create Post with Tags

**Endpoint:** `POST /api/v1/posts/`  
**Content-Type:** `multipart/form-data`

**Form Fields:**
```
title: "Getting Started with FastAPI"
body: "This is a tutorial about..."
type: "article"
tags: "python,fastapi,tutorial"  // or "#python,#fastapi,#tutorial"
files: [file1.jpg, file2.png]
```

**JavaScript Example:**
```javascript
const formData = new FormData();
formData.append('title', 'Getting Started with FastAPI');
formData.append('body', 'This is a tutorial about...');
formData.append('type', 'article');
formData.append('tags', 'python,fastapi,tutorial'); // Comma-separated

const response = await fetch('http://localhost:8000/api/v1/posts/', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`
  },
  body: formData
});
```

**Response:**
```json
{
  "id": 1,
  "title": "Getting Started with FastAPI",
  "body": "This is a tutorial about...",
  "type": "article",
  "tags": ["python", "fastapi", "tutorial"],
  "files": [],
  "owner_id": 5,
  "owner": { ... },
  "total_likes": 0,
  "total_views": 0,
  "created_at": "2026-01-27T16:00:00Z",
  "updated_at": "2026-01-27T16:00:00Z"
}
```

---

### 2. Update Post Tags

**Endpoint:** `PUT /api/v1/posts/{post_id}`  
**Auth Required:** ✅ Yes (Owner only)

**Request Body:**
```json
{
  "tags": ["python", "fastapi", "tutorial", "beginner"]
}
```

**Response:**
```json
{
  "id": 1,
  "title": "Getting Started with FastAPI",
  "body": "This is a tutorial about...",
  "type": "article",
  "tags": ["python", "fastapi", "tutorial", "beginner"],
  ...
}
```

---

### 3. Search Posts by Tag

**Endpoint:** `GET /api/v1/posts/?tag={tagname}`  
**Auth Required:** ❌ No (Public)

**Examples:**

```bash
# Search for posts tagged with "python" (with or without #)
GET /api/v1/posts/?tag=python
GET /api/v1/posts/?tag=%23python

# Combine with pagination
GET /api/v1/posts/?tag=fastapi&skip=0&limit=20

# Combine with type filter
GET /api/v1/posts/?tag=tutorial&type=article

# Multiple filters
GET /api/v1/posts/?tag=python&type=article&limit=10
```

**JavaScript Example:**
```javascript
// Search posts with #python tag
const response = await fetch(
  'http://localhost:8000/api/v1/posts/?tag=python&limit=20'
);
const posts = await response.json();

posts.forEach(post => {
  console.log(post.title, post.tags);
});
```

**Response:**
```json
[
  {
    "id": 1,
    "title": "Getting Started with FastAPI",
    "tags": ["python", "fastapi", "tutorial"],
    ...
  },
  {
    "id": 5,
    "title": "Python Best Practices",
    "tags": ["python", "coding", "tips"],
    ...
  }
]
```

---

## Tag Normalization

All tags are automatically normalized before storage and search:

### Input Examples:
```
"Python"        → "python"
"#FastAPI"      → "fastapi"
"#API-design"   → "api-design"
" tutorial  "   → "tutorial"
"machine_learning" → "machine_learning"
```

### Rules:
1. **Remove `#` prefix** if present
2. **Convert to lowercase**
3. **Trim whitespace**
4. **Preserve hyphens and underscores**

### Why Normalize?
- **Consistent storage**: Prevents duplicates like `["Python", "python", "#python"]`
- **Easy searching**: Users can search with or without `#`
- **Case-insensitive**: `#Python`, `python`, and `PYTHON` all match

---

## Database Schema

### Posts Table (Updated)

```sql
CREATE TABLE posts (
    id INTEGER PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    files JSONB,
    tags JSONB,  -- NEW: Array of tags, e.g., ["python", "fastapi"]
    owner_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- GIN index for efficient tag searching
CREATE INDEX ix_posts_tags_gin ON posts USING gin(tags);
```

### Example Data:
```sql
INSERT INTO posts (title, body, type, tags, owner_id, created_at, updated_at)
VALUES (
    'FastAPI Tutorial',
    'Learn FastAPI...',
    'article',
    '["python", "fastapi", "tutorial"]'::jsonb,
    5,
    NOW(),
    NOW()
);
```

---

## PostgreSQL JSONB Queries

### Search for Posts with Specific Tag

```sql
-- Posts tagged with "python"
SELECT * FROM posts WHERE tags @> '["python"]';

-- Posts tagged with "python" OR "javascript"
SELECT * FROM posts 
WHERE tags @> '["python"]' OR tags @> '["javascript"]';

-- Posts tagged with BOTH "python" AND "fastapi"
SELECT * FROM posts 
WHERE tags @> '["python"]' AND tags @> '["fastapi"]';

-- Count posts per tag (requires unnesting)
SELECT tag, COUNT(*) as count
FROM posts, jsonb_array_elements_text(tags) AS tag
GROUP BY tag
ORDER BY count DESC;
```

### Performance Note:
The GIN index makes these queries **very fast**, even with millions of posts.

---

## Frontend Integration Examples

### React Example

```tsx
import React, { useState } from 'react';

function CreatePost() {
  const [tags, setTags] = useState('');
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);
    formData.append('tags', tags); // Comma-separated: "python,fastapi,api"
    
    const response = await fetch('/api/v1/posts/', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Tags (comma-separated, e.g., python,fastapi)"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
      />
      <button type="submit">Create Post</button>
    </form>
  );
}

function TagFilter() {
  const [selectedTag, setSelectedTag] = useState('');
  const [posts, setPosts] = useState([]);
  
  const fetchPostsByTag = async (tag) => {
    const response = await fetch(`/api/v1/posts/?tag=${tag}`);
    const data = await response.json();
    setPosts(data);
  };
  
  return (
    <div>
      <input 
        type="text" 
        placeholder="Filter by tag (e.g., python or #python)"
        onChange={(e) => fetchPostsByTag(e.target.value)}
      />
      {posts.map(post => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <div>
            {post.tags.map(tag => (
              <span key={tag} className="tag">#{tag}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
```

### Vue Example

```js
<template>
  <div>
    <input 
      v-model="tagInput"
      placeholder="Tags (comma-separated)"
    />
    <button @click="createPost">Create</button>
    
    <!-- Tag cloud -->
    <div class="tags">
      <span 
        v-for="tag in post.tags" 
        :key="tag"
        class="tag"
        @click="filterByTag(tag)"
      >
        #{{ tag }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tagInput: '',
      posts: []
    };
  },
  methods: {
    async filterByTag(tag) {
      const response = await fetch(`/api/v1/posts/?tag=${tag}`);
      this.posts = await response.json();
    }
  }
};
</script>
```

---

## Best Practices

### 1. Tag Naming Conventions
- Use lowercase
- Separate words with hyphens: `machine-learning` not `machine_learning`
- Keep tags short and descriptive
- Avoid special characters except hyphens and underscores

### 2. Tag Limits
- Recommended: 3-5 tags per post
- Maximum: No hard limit, but keep it reasonable

### 3. Popular Tags
```javascript
// Get most popular tags (requires backend aggregation)
async function getPopularTags() {
  // This would require a new endpoint that aggregates tags
  // For now, track client-side or implement server-side aggregation
}
```

### 4. Tag Autocomplete
```js
// Suggest tags as user types
const commonTags = ['python', 'javascript', 'react', 'vue', 'fastapi'];

function suggestTags(input) {
  return commonTags.filter(tag => 
    tag.startsWith(input.toLowerCase())
  );
}
```

---

## Migration Instructions

Run the migration to add the tags column:

```bash
# If using Docker
docker-compose exec web alembic upgrade head

# If running locally
alembic upgrade head
```

**Migration file:** `alembic/versions/004_posts_and_comments.py`

---

## Testing Examples

### Python Test

```python
import requests

BASE_URL = "http://localhost:8000/api/v1"
token = "your-access-token"
headers = {"Authorization": f"Bearer {token}"}

# Create post with tags
data = {
    'title': 'My Post',
    'body': 'Content here...',
    'type': 'article',
    'tags': 'python,fastapi,tutorial'
}
response = requests.post(f"{BASE_URL}/posts/", headers=headers, data=data)
post = response.json()
print(f"Created post with tags: {post['tags']}")

# Search by tag
search_response = requests.get(f"{BASE_URL}/posts/?tag=python")
posts = search_response.json()
print(f"Found {len(posts)} posts tagged with 'python'")

# Update tags
update_data = {"tags": ["python", "fastapi", "tutorial", "beginner"]}
update_response = requests.put(
    f"{BASE_URL}/posts/{post['id']}",
    headers=headers,
    json=update_data
)
updated_post = update_response.json()
print(f"Updated tags: {updated_post['tags']}")
```

---

## Future Enhancements

1. **Tag Autocomplete Endpoint** - `GET /tags/suggest?q=pyt`
2. **Popular Tags** - `GET /tags/popular?limit=20`
3. **Tag Analytics** - `GET /tags/{tag}/stats`
4. **Multiple Tag Search** - `GET /posts/?tags=python,fastapi` (AND/OR logic)
5. **Tag Trending** - Time-based tag popularity
6. **Tag Synonyms** - Map aliases (e.g., `js` → `javascript`)
7. **Tag Moderation** - Admin approval for new tags

---

## Summary

✅ **Implemented:**
- JSONB array storage for tags
- GIN index for fast searching
- Automatic tag normalization
- Comma-separated form input
- Tag filtering in GET /posts/
- Support for # prefix or plain text
- Create and update with tags

✅ **Features:**
- Case-insensitive search
- Efficient PostgreSQL querying
- Clean, normalized storage
- Flexible API design

**Tags are now fully functional and ready to use!** 🏷️
