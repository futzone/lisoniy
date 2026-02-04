# Lisoniy Platform - Docker Setup

This Docker configuration runs both the frontend (React) and backend (FastAPI) applications together.

## Services

- **postgres** - PostgreSQL 15 database (port 5432)
- **redis** - Redis cache and message broker (port 6379)
- **backend** - FastAPI application (port 8000)
- **frontend** - React application with Nginx (port 3000)
- **celery_worker** - Background task worker
- **celery_flower** - Task monitoring UI (port 5555)

## Quick Start

### 1. Start All Services

From the root directory (`lisoniy/`):

```bash
docker compose up -d
```

### 2. Access Applications

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs
- **Celery Flower**: http://localhost:5555

### 3. Stop All Services

```bash
docker compose down
```

## Database Setup

### Run Migrations

After starting services, run database migrations:

```bash
docker compose exec backend alembic upgrade head
```

### Create Test Database for Tests

```bash
docker compose exec postgres psql -U postgres -c "CREATE DATABASE lisoniy_test;"
```

## Development

### Backend Development

The backend code is mounted as a volume, so changes will be reflected with auto-reload.

View backend logs:
```bash
docker compose logs -f backend
```

### Frontend Development

For development with hot reload, you can run the frontend locally:

```bash
cd lisoniy_app
npm install
npm run dev
```

This will start Vite dev server on http://localhost:5173

### Rebuild Services

If you change dependencies or Dockerfile:

```bash
# Rebuild specific service
docker compose build backend
docker compose build frontend

# Rebuild and restart
docker compose up -d --build
```

## Environment Variables

### Backend (.env in lisoniy_server/)
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `SECRET_KEY` - JWT secret key
- `ACCESS_TOKEN_EXPIRE_MINUTES` - Token expiration time

### Frontend
- `VITE_API_BASE_URL` - Backend API URL (set in docker-compose.yml)

## Networking

All services are connected via the `lisoniy_network` bridge network, allowing them to communicate using service names as hostnames.

Frontend can reach backend at: `http://backend:8000`
Backend can reach database at: `postgres:5432`

## Data Persistence

Data is persisted in Docker volumes:
- `postgres_data` - Database data
- `redis_data` - Redis data

To remove all data:
```bash
docker compose down -v
```

## Troubleshooting

### Backend won't start
Check migration issues:
```bash
docker compose logs backend
docker compose exec backend alembic current
```

### Frontend build fails
Check Node.js build logs:
```bash
docker compose logs frontend
```

### Cannot connect to database
Verify database is healthy:
```bash
docker compose ps
docker compose exec postgres pg_isready -U postgres
```

### API calls from frontend fail
Check that backend is running and CORS is configured:
```bash
curl http://localhost:8000/docs
```

## Production Deployment

For production:

1. Update environment variables in `.env` files
2. Set `DEBUG=False` in backend
3. Use proper SECRET_KEY values
4. Configure domain names in Nginx
5. Add SSL/TLS certificates
6. Set up proper logging
7. Use production-grade database (not SQLite)

## Architecture

```
┌─────────────┐
│   Nginx     │ :3000 (Frontend)
│  (React)    │
└──────┬──────┘
       │
       │ Proxy /api
       ▼
┌─────────────┐
│   FastAPI   │ :8000 (Backend API)
└──────┬──────┘
       │
       ├──────► PostgreSQL :5432 (Database)
       │
       └──────► Redis :6379 (Cache/Queue)
                  │
                  └──► Celery Worker (Background Tasks)
```

## Useful Commands

```bash
# View all logs
docker compose logs -f

# View specific service logs
docker compose logs -f backend
docker compose logs -f frontend

# Execute command in container
docker compose exec backend bash
docker compose exec frontend sh

# Restart a service
docker compose restart backend

# Check service status
docker compose ps

# Remove all containers and volumes
docker compose down -v

# Rebuild without cache
docker compose build --no-cache
```
