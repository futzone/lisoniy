# FastAPI High-Load User Authentication & Management System

Production-ready high-load authentication system built with FastAPI, PostgreSQL, Redis, and Celery.

## 🚀 Features

- ✅ **User Registration & Login** - Email/password authentication
- ✅ **Email Verification** - OTP-based email verification via Redis
- ✅ **JWT Authentication** - Access and refresh tokens
- ✅ **Password Reset** - Secure password reset flow
- ✅ **Role-Based Access Control (RBAC)** - Admin and User roles
- ✅ **User Management** - Full CRUD operations
- ✅ **Background Tasks** - Celery for async email sending
- ✅ **Rate Limiting** - Redis-based rate limiting
- ✅ **High Performance** - Async SQLAlchemy, Redis caching
- ✅ **Docker Ready** - Complete Docker Compose setup

## 🏗️ Tech Stack

- **Framework**: FastAPI (async)
- **Database**: PostgreSQL + SQLAlchemy (async) + Alembic
- **Cache/Queue**: Redis
- **Task Queue**: Celery + Flower
- **Security**: JWT, OAuth2, bcrypt
- **Validation**: Pydantic V2
- **Type Hints**: Full type coverage with mypy support

## 📁 Project Structure

```
fastapi-auth/
├── app/
│   ├── api/v1/          # API endpoints
│   │   ├── auth.py      # Authentication routes
│   │   ├── users.py     # User management routes
│   │   └── admin.py     # Admin routes
│   ├── core/            # Core functionality
│   │   ├── config.py    # Configuration
│   │   ├── security.py  # JWT & password hashing
│   │   └── dependencies.py  # FastAPI dependencies
│   ├── models/          # SQLAlchemy models
│   │   └── user.py
│   ├── schemas/         # Pydantic schemas
│   │   ├── auth.py
│   │   ├── user.py
│   │   └── token.py
│   ├── services/        # Business logic
│   │   ├── auth_service.py
│   │   ├── user_service.py
│   │   ├── email_service.py
│   │   └── redis_manager.py
│   ├── tasks/           # Celery tasks
│   │   └── email_tasks.py
│   ├── db/              # Database configuration
│   │   ├── base.py
│   │   └── session.py
│   └── main.py          # Application entry point
├── alembic/             # Database migrations
├── docker-compose.yml   # Docker services
├── Dockerfile
├── requirements.txt
└── .env.example
```

## 🛠️ Setup Instructions

### 1. Clone and Setup Environment

```bash
cd c:\src\projects\lisoniy\fastapi-auth

# Copy environment file
copy .env.example .env

# Edit .env with your settings (especially SECRET_KEY and SMTP credentials)
```

### 2. Start Services with Docker Compose

```bash
docker-compose up -d
```

This will start:
- PostgreSQL (port 5432)
- Redis (port 6379)
- FastAPI app (port 8000)
- Celery worker
- Flower monitoring (port 5555)

### 3. Run Database Migrations

```bash
# Inside Docker container
docker-compose exec web alembic upgrade head

# Or locally
alembic upgrade head
```

### 4. Access the Application

- **API Documentation**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc
- **Flower (Celery)**: http://localhost:5555
- **Health Check**: http://localhost:8000/health

## 📝 API Endpoints

### Authentication

- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/verify-email` - Verify email with OTP
- `POST /api/v1/auth/login` - Login and get tokens
- `POST /api/v1/auth/refresh` - Refresh access token
- `POST /api/v1/auth/request-password-reset` - Request password reset
- `POST /api/v1/auth/reset-password` - Reset password

### User Management

- `GET /api/v1/users/me` - Get current user
- `PUT /api/v1/users/me` - Update profile
- `DELETE /api/v1/users/me` - Delete account

### Admin (RBAC Protected)

- `GET /api/v1/admin/users` - List all users
- `GET /api/v1/admin/users/{id}` - Get user by ID
- `PUT /api/v1/admin/users/{id}` - Update any user
- `DELETE /api/v1/admin/users/{id}` - Delete any user

## 🔐 Security Best Practices

1. **Change SECRET_KEY** - Generate a strong secret key (min 32 characters)
2. **Configure SMTP** - Set up proper email credentials in `.env`
3. **CORS Origins** - Restrict CORS_ORIGINS to your frontend domains
4. **Rate Limiting** - Adjust rate limits based on your needs
5. **HTTPS Only** - Use HTTPS in production
6. **Database Security** - Use strong database passwords
7. **Token Expiration** - Adjust token expiration times as needed

## ⚡ High-Load Performance Optimizations

### Database Optimizations

- **Connection Pooling**: Configured for 50 connections + 100 overflow
- **Async Engine**: All database operations are asynchronous
- **Proper Indexing**: Email and token fields are indexed
- **Auto Vacuum**: PostgreSQL auto-vacuum enabled

### Redis Optimizations

- **Token Caching**: Refresh tokens cached in Redis for fast validation
- **OTP Storage**: OTPs stored in Redis with auto-expiration
- **Rate Limiting**: IP-based rate limiting via Redis counters
- **Connection Pool**: Max 100 Redis connections

### Application Optimizations

- **Async Everywhere**: FastAPI + async SQLAlchemy + async Redis
- **Background Tasks**: Heavy operations (emails) run in Celery
- **Proper Pagination**: All list endpoints support pagination
- **Minimal DB Queries**: Efficient query design to reduce load

### Scaling Strategies

1. **Horizontal Scaling**:
   ```bash
   docker-compose up --scale web=3 --scale celery_worker=2
   ```

2. **Load Balancing**: Add Nginx/Traefik for load balancing

3. **Database Replication**: Setup PostgreSQL read replicas

4. **Redis Cluster**: Use Redis Cluster for high availability

5. **CDN**: Serve static content via CDN

## 🧪 Testing

```bash
# Create test user via API
curl -X POST http://localhost:8000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "strongpass123",
    "full_name": "Test User"
  }'
```

## 📊 Monitoring

- **Celery Flower**: Monitor background tasks at http://localhost:5555
- **Database Logs**: Check PostgreSQL logs via Docker
- **Application Logs**: Check FastAPI logs in terminal/Docker logs
- **Redis Monitoring**: Use `redis-cli` MONITOR command

## 🔧 Development

```bash
# Install dependencies locally
pip install -r requirements.txt

# Run locally (without Docker)
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run Celery worker locally
celery -A app.tasks.email_tasks worker --loglevel=info

# Create new migration
alembic revision --autogenerate -m "description"
```

## 📦 Production Deployment

1. Set `DEBUG=False` in `.env`
2. Use strong `SECRET_KEY`
3. Configure proper SMTP credentials
4. Set up SSL/TLS certificates
5. Use production-grade PostgreSQL
6. Configure Redis persistence
7. Set up monitoring (Sentry, Prometheus, etc.)
8. Implement proper logging
9. Use environment-specific configurations
10. Set up CI/CD pipeline

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch
3. Make your changes with proper type hints
4. Run tests and linting
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 👤 Author

Built with ❤️ using FastAPI and modern Python best practices.

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check the documentation at `/docs`
- Review the code comments and type hints

---

**Note**: This is a production-ready template. Make sure to review and adjust configurations based on your specific requirements before deploying to production.
