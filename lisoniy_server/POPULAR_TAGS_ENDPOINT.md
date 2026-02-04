# Popular Tags Endpoint

## Overview

Get the top most-used tags across all posts with their post counts.

---

## Endpoint

**URL:** `GET /api/v1/posts/tags/popular`  
**Auth Required:** ❌ No (Public)  
**Response Time:** Fast (uses indexed JSONB queries)

---

## Query Parameters

| Parameter | Type | Default | Max | Description |
|-----------|------|---------|-----|-------------|
| limit | int | 10 | 50 | Number of top tags to return |

---

## Response Format

```json
[
  {
    "tag": "python",
    "contents": 45
  },
  {
    "tag": "fastapi",
    "contents": 32
  },
  {
    "tag": "tutorial",
    "contents": 28
  }
]
```

**Fields:**
- `tag` (string): The tag name (normalized, lowercase)
- `contents` (int): Number of posts with this tag

---

## Examples

### Basic Usage

```bash
GET /api/v1/posts/tags/popular?limit=10
```

### JavaScript

```javascript
// Fetch top 10 popular tags
const response = await fetch('http://localhost:8000/api/v1/posts/tags/popular?limit=10');
const popularTags = await response.json();

// Display tags
popularTags.forEach(({ tag, contents }) => {
  console.log(`#${tag}: ${contents} posts`);
});

// Example output:
// #python: 45 posts
// #fastapi: 32 posts
// #tutorial: 28 posts
```

### Create Tag Cloud

```javascript
async function renderTagCloud() {
  const response = await fetch('/api/v1/posts/tags/popular?limit=20');
  const tags = await response.json();
  
  // Calculate font sizes based on usage
  const maxCount = tags[0].contents;
  
  const tagCloud = tags.map(({ tag, contents }) => {
    const fontSize = 12 + (contents / maxCount) * 24; // 12px to 36px
    return `
      <a href="/posts?tag=${tag}" 
         style="font-size: ${fontSize}px"
         class="tag-link">
        #${tag}
      </a>
    `;
  }).join(' ');
  
  document.getElementById('tag-cloud').innerHTML = tagCloud;
}
```

### Python

```python
import requests

response = requests.get('http://localhost:8000/api/v1/posts/tags/popular', params={'limit': 10})
popular_tags = response.json()

for tag_data in popular_tags:
    print(f"#{tag_data['tag']}: {tag_data['contents']} posts")
```

---

## Use Cases

### 1. Homepage Tag Cloud

Display trending topics on your homepage:

```tsx
// React Component
function TagCloud() {
  const [tags, setTags] = useState([]);
  
  useEffect(() => {
    fetch('/api/v1/posts/tags/popular?limit=15')
      .then(res => res.json())
      .then(setTags);
  }, []);
  
  return (
    <div className="tag-cloud">
      <h3>Trending Topics</h3>
      {tags.map(({ tag, contents }) => (
        <Link 
          key={tag} 
          to={`/posts?tag=${tag}`}
          className="tag"
          style={{ 
            fontSize: `${12 + (contents / tags[0].contents) * 12}px` 
          }}
        >
          #{tag}
        </Link>
      ))}
    </div>
  );
}
```

### 2. Tag Autocomplete

Suggest popular tags as users type:

```javascript
async function suggestTags(input) {
  const response = await fetch('/api/v1/posts/tags/popular?limit=30');
  const allTags = await response.json();
  
  return allTags
    .filter(({ tag }) => tag.startsWith(input.toLowerCase()))
    .map(({ tag }) => tag);
}

// Usage
const suggestions = await suggestTags('py'); // ['python', 'pytorch', ...]
```

### 3. Analytics Dashboard

Show tag distribution:

```javascript
async function getTagStats() {
  const response = await fetch('/api/v1/posts/tags/popular?limit=50');
  const tags = await response.json();
  
  // Create pie chart data
  const chartData = {
    labels: tags.map(t => `#${t.tag}`),
    datasets: [{
      data: tags.map(t => t.contents),
      backgroundColor: generateColors(tags.length)
    }]
  };
  
  // Render with Chart.js or similar
  renderPieChart(chartData);
}
```

### 4. Tag Recommendations

Recommend related tags when creating a post:

```javascript
async function recommendTags(currentTags) {
  const response = await fetch('/api/v1/posts/tags/popular?limit=20');
  const popularTags = await response.json();
  
  // Filter out tags already used
  return popularTags
    .filter(({ tag }) => !currentTags.includes(tag))
    .slice(0, 5);
}
```

---

## Implementation Details

### SQL Query

The endpoint uses PostgreSQL's `jsonb_array_elements_text()` function:

```sql
SELECT 
    tag::text as tag,
    COUNT(*) as contents
FROM posts,
     jsonb_array_elements_text(tags) AS tag
WHERE tags IS NOT NULL
GROUP BY tag
ORDER BY contents DESC
LIMIT 10;
```

**How it works:**
1. `jsonb_array_elements_text(tags)` unnests the JSONB array
2. Each tag becomes a separate row
3. `GROUP BY tag` aggregates by tag name
4. `COUNT(*)` counts posts per tag
5. `ORDER BY contents DESC` sorts by popularity
6. `LIMIT` restricts to top N tags

### Performance

- **GIN Index:** The `tags` column has a GIN index for fast queries
- **Expected Speed:** ~10-50ms for 100k posts
- **Scaling:** Efficient even with millions of posts

---

## Frontend Integration

### React Hook

```tsx
import { useState, useEffect } from 'react';

function usePopularTags(limit = 10) {
  const [tags, setTags] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch(`/api/v1/posts/tags/popular?limit=${limit}`)
      .then(res => res.json())
      .then(data => {
        setTags(data);
        setLoading(false);
      });
  }, [limit]);
  
  return { tags, loading };
}

// Usage
function PopularTags() {
  const { tags, loading } = usePopularTags(10);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div className="popular-tags">
      {tags.map(({ tag, contents }) => (
        <span key={tag} className="tag">
          #{tag} ({contents})
        </span>
      ))}
    </div>
  );
}
```

### Vue Composable

```javascript
import { ref, onMounted } from 'vue';

export function usePopularTags(limit = 10) {
  const tags = ref([]);
  const loading = ref(true);
  
  onMounted(async () => {
    const response = await fetch(`/api/v1/posts/tags/popular?limit=${limit}`);
    tags.value = await response.json();
    loading.value = false;
  });
  
  return { tags, loading };
}
```

---

## Caching Recommendations

For high-traffic sites, consider caching the response:

### Redis Caching (Server-Side)

```python
@router.get("/tags/popular")
async def get_popular_tags(limit: int = 10, db: AsyncSession = Depends(get_db)):
    cache_key = f"popular_tags:{limit}"
    
    # Try cache first
    cached = await redis_manager.get_value(cache_key)
    if cached:
        return json.loads(cached)
    
    # Query database
    tags = await PostService.get_popular_tags(db, limit)
    
    # Cache for 5 minutes
    await redis_manager.set_value(cache_key, json.dumps(tags), expire=300)
    
    return tags
```

### Client-Side Caching

```javascript
// Cache in localStorage for 5 minutes
const CACHE_KEY = 'popular_tags';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function getPopularTags() {
  const cached = localStorage.getItem(CACHE_KEY);
  
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    if (Date.now() - timestamp < CACHE_TTL) {
      return data;
    }
  }
  
  const response = await fetch('/api/v1/posts/tags/popular');
  const tags = await response.json();
  
  localStorage.setItem(CACHE_KEY, JSON.stringify({
    data: tags,
    timestamp: Date.now()
  }));
  
  return tags;
}
```

---

## Testing

### cURL

```bash
curl "http://localhost:8000/api/v1/posts/tags/popular?limit=10"
```

### pytest

```python
def test_popular_tags(client):
    # Create some posts with tags
    client.post('/api/v1/posts/', data={
        'title': 'Post 1',
        'body': 'Content...',
        'tags': 'python,fastapi'
    }, headers={'Authorization': f'Bearer {token}'})
    
    # Get popular tags
    response = client.get('/api/v1/posts/tags/popular?limit=10')
    
    assert response.status_code == 200
    tags = response.json()
    assert isinstance(tags, list)
    assert len(tags) <= 10
    
    if tags:
        assert 'tag' in tags[0]
        assert 'contents' in tags[0]
        assert isinstance(tags[0]['contents'], int)
```

---

## Summary

✅ **Endpoint:** `GET /api/v1/posts/tags/popular`  
✅ **Response:** `[{"tag": "python", "contents": 45}, ...]`  
✅ **Performance:** Fast (GIN indexed)  
✅ **Use Cases:** Tag clouds, autocomplete, analytics, recommendations  
✅ **Public:** No authentication required

Perfect for building engaging tag-based discovery features! 🏷️
