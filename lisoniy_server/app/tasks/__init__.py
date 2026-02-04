"""Tasks module initialization"""

from app.tasks.email_tasks import (
    celery_app,
    send_verification_email,
    send_password_reset_email,
    send_welcome_email,
)

__all__ = [
    "celery_app",
    "send_verification_email",
    "send_password_reset_email",
    "send_welcome_email",
]
