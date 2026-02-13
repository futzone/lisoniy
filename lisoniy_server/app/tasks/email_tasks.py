"""Celery tasks for background job processing"""

from celery import Celery

from app.core.config import settings
from app.services.email_service import EmailService

# Initialize Celery
celery_app = Celery(
    "fastapi_auth",
    broker=settings.CELERY_BROKER_URL,
    backend=settings.CELERY_RESULT_BACKEND,
)

# Celery configuration
celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=30 * 60,  # 30 minutes
    task_soft_time_limit=25 * 60,  # 25 minutes
)


@celery_app.task(name="send_verification_email", bind=True, max_retries=3)
def send_verification_email(self, email: str, name: str, otp: str) -> dict:
    """
    Send email verification OTP
    
    Args:
        email: Recipient email
        name: Recipient name
        otp: OTP code
        
    Returns:
        Task result
    """
    try:
        html = EmailService.create_verification_html(name, otp)
        success = EmailService.send_email_sync(email, "Lisoniy - Email Tasdiqlash", html)
        
        if not success:
            raise Exception("Failed to send email")
        
        return {"status": "success", "email": email}
    except Exception as exc:
        # Retry with exponential backoff
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))


@celery_app.task(name="send_password_reset_email", bind=True, max_retries=3)
def send_password_reset_email(
    self,
    email: str,
    name: str,
    reset_token: str
) -> dict:
    """
    Send password reset email
    
    Args:
        email: Recipient email
        name: Recipient name
        reset_token: Password reset token
        
    Returns:
        Task result
    """
    try:
        html = EmailService.create_password_reset_html(name, reset_token)
        success = EmailService.send_email_sync(email, "Lisoniy - Parolni Tiklash", html)
        
        if not success:
            raise Exception("Failed to send email")
        
        return {"status": "success", "email": email}
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))


@celery_app.task(name="send_welcome_email", bind=True, max_retries=3)
def send_welcome_email(self, email: str, name: str) -> dict:
    """
    Send welcome email after successful verification
    
    Args:
        email: Recipient email
        name: Recipient name
        
    Returns:
        Task result
    """
    try:
        html = EmailService.create_welcome_html(name)
        success = EmailService.send_email_sync(email, "Lisoniy ga Xush Kelibsiz! 🎉", html)
        
        if not success:
            raise Exception("Failed to send email")
        
        return {"status": "success", "email": email}
    except Exception as exc:
        raise self.retry(exc=exc, countdown=60 * (2 ** self.request.retries))
