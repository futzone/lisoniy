"""Script to verify project setup and structure"""

import os
import sys
from pathlib import Path


def check_file_exists(filepath: str) -> bool:
    """Check if file exists and print status"""
    exists = Path(filepath).exists()
    status = "✅" if exists else "❌"
    print(f"{status} {filepath}")
    return exists


def verify_project_structure():
    """Verify all required files exist"""
    
    print("\n" + "="*60)
    print("FastAPI Auth System - Project Structure Verification")
    print("="*60 + "\n")
    
    base_dir = Path(__file__).parent
    
    # Configuration files
    print("📋 Configuration Files:")
    config_files = [
        ".env.example",
        ".gitignore",
        "docker-compose.yml",
        "Dockerfile",
        "requirements.txt",
        "alembic.ini",
        "README.md",
    ]
    
    for file in config_files:
        check_file_exists(base_dir / file)
    
    # Core application files
    print("\n📁 Core Application Files:")
    app_files = [
        "app/__init__.py",
        "app/main.py",
        "app/core/__init__.py",
        "app/core/config.py",
        "app/core/security.py",
        "app/core/dependencies.py",
    ]
    
    for file in app_files:
        check_file_exists(base_dir / file)
    
    # Database layer
    print("\n🗄️ Database Layer:")
    db_files = [
        "app/db/__init__.py",
        "app/db/base.py",
        "app/db/session.py",
        "app/models/__init__.py",
        "app/models/user.py",
    ]
    
    for file in db_files:
        check_file_exists(base_dir / file)
    
    # Schemas
    print("\n📝 Pydantic Schemas:")
    schema_files = [
        "app/schemas/__init__.py",
        "app/schemas/auth.py",
        "app/schemas/user.py",
        "app/schemas/token.py",
    ]
    
    for file in schema_files:
        check_file_exists(base_dir / file)
    
    # Services
    print("\n⚙️ Service Layer:")
    service_files = [
        "app/services/__init__.py",
        "app/services/redis_manager.py",
        "app/services/auth_service.py",
        "app/services/user_service.py",
        "app/services/email_service.py",
    ]
    
    for file in service_files:
        check_file_exists(base_dir / file)
    
    # Tasks
    print("\n🔄 Background Tasks:")
    task_files = [
        "app/tasks/__init__.py",
        "app/tasks/email_tasks.py",
    ]
    
    for file in task_files:
        check_file_exists(base_dir / file)
    
    # API routes
    print("\n🌐 API Routes:")
    api_files = [
        "app/api/__init__.py",
        "app/api/v1/__init__.py",
        "app/api/v1/auth.py",
        "app/api/v1/users.py",
        "app/api/v1/admin.py",
    ]
    
    for file in api_files:
        check_file_exists(base_dir / file)
    
    # Migrations
    print("\n🔧 Database Migrations:")
    migration_files = [
        "alembic/env.py",
        "alembic/versions/001_initial.py",
    ]
    
    for file in migration_files:
        check_file_exists(base_dir / file)
    
    print("\n" + "="*60)
    print("✅ Project structure verification complete!")
    print("="*60)
    
    # Print next steps
    print("\n📖 Next Steps:")
    print("1. Copy .env.example to .env and configure settings")
    print("2. Run: docker-compose up -d")
    print("3. Run migrations: docker-compose exec web alembic upgrade head")
    print("4. Access API docs: http://localhost:8000/docs")
    print("\n")


if __name__ == "__main__":
    verify_project_structure()
