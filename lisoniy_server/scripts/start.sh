#!/bin/bash
set -e

echo "🚀 Starting application..."

# Wait for postgres to be ready
echo "⏳ Waiting for PostgreSQL..."
while ! nc -z postgres 5432; do
  sleep 0.1
done
echo "✅ PostgreSQL is ready!"

# Wait for redis to be ready
echo "⏳ Waiting for Redis..."
while ! nc -z redis 6379; do
  sleep 0.1
done
echo "✅ Redis is ready!"

# Run database migrations
echo "📦 Running database migrations..."
alembic upgrade head
echo "✅ Migrations completed!"

# Start the application
echo "🎉 Starting FastAPI server..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000
