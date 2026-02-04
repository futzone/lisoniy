"""Email service for sending emails via SMTP"""

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import Optional

from app.core.config import settings


class EmailService:
    """Service for sending emails"""
    
    @staticmethod
    def create_verification_email(to_email: str, name: str, otp: str) -> MIMEMultipart:
        """
        Create verification email
        
        Args:
            to_email: Recipient email
            name: Recipient name
            otp: OTP code
            
        Returns:
            Email message
        """
        message = MIMEMultipart("alternative")
        message["Subject"] = "Verify Your Email"
        message["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
        message["To"] = to_email
        
        html = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #4CAF50;">Email Verification</h2>
                    <p>Hello {name},</p>
                    <p>Thank you for registering! Please use the following code to verify your email:</p>
                    <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #4CAF50; font-size: 32px; letter-spacing: 5px; margin: 0;">{otp}</h1>
                    </div>
                    <p>This code will expire in {settings.OTP_EXPIRE_MINUTES} minutes.</p>
                    <p>If you didn't request this, please ignore this email.</p>
                    <hr style="border: 1px solid #eee; margin: 30px 0;">
                    <p style="font-size: 12px; color: #999;">
                        This is an automated email, please do not reply.
                    </p>
                </div>
            </body>
        </html>
        """
        
        message.attach(MIMEText(html, "html"))
        return message
    
    @staticmethod
    def create_password_reset_email(
        to_email: str,
        name: str,
        reset_token: str
    ) -> MIMEMultipart:
        """
        Create password reset email
        
        Args:
            to_email: Recipient email
            name: Recipient name
            reset_token: Password reset token
            
        Returns:
            Email message
        """
        # In production, this would be a link to your frontend
        reset_link = f"http://localhost:3000/reset-password?token={reset_token}"
        
        message = MIMEMultipart("alternative")
        message["Subject"] = "Password Reset Request"
        message["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
        message["To"] = to_email
        
        html = f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #FF5722;">Password Reset Request</h2>
                    <p>Hello {name},</p>
                    <p>We received a request to reset your password. Click the button below to create a new password:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{reset_link}" 
                           style="background-color: #FF5722; color: white; padding: 12px 30px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block;">
                            Reset Password
                        </a>
                    </div>
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="background-color: #f4f4f4; padding: 10px; border-radius: 5px; 
                              word-break: break-all;">{reset_link}</p>
                    <p>This link will expire in {settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES} minutes.</p>
                    <p>If you didn't request this, please ignore this email and your password will remain unchanged.</p>
                    <hr style="border: 1px solid #eee; margin: 30px 0;">
                    <p style="font-size: 12px; color: #999;">
                        This is an automated email, please do not reply.
                    </p>
                </div>
            </body>
        </html>
        """
        
        message.attach(MIMEText(html, "html"))
        return message
    
    @staticmethod
    def create_welcome_email(to_email: str, name: str) -> MIMEMultipart:
        """
        Create welcome email
        
        Args:
            to_email: Recipient email
            name: Recipient name
            
        Returns:
            Email message
        """
        message = MIMEMultipart("alternative")
        message["Subject"] = "Welcome to FastAPI Auth System!"
        message["From"] = f"{settings.SMTP_FROM_NAME} <{settings.SMTP_FROM_EMAIL}>"
        message["To"] = to_email
        
        html = f"""
        <html>
            <body style="font-family: Arial, sans-seri f; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2196F3;">Welcome!</h2>
                    <p>Hello {name},</p>
                    <p>Thank you for verifying your email! Your account is now fully activated.</p>
                    <p>You can now enjoy all the features of our platform.</p>
                    <p>If you have any questions, feel free to contact our support team.</p>
                    <hr style="border: 1px solid #eee; margin: 30px 0;">
                    <p style="font-size: 12px; color: #999;">
                        This is an automated email, please do not reply.
                    </p>
                </div>
            </body>
        </html>
        """
        
        message.attach(MIMEText(html, "html"))
        return message
    
    @staticmethod
    def send_email(message: MIMEMultipart) -> None:
        """
        Send email via SMTP (synchronous - to be called from Celery)
        
        Args:
            message: Email message to send
        """
        if not settings.SMTP_USER or not settings.SMTP_PASSWORD:
            print(f"SMTP not configured. Would send email to {message['To']}")
            return
        
        try:
            with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
                server.starttls()
                server.login(settings.SMTP_USER, settings.SMTP_PASSWORD)
                server.send_message(message)
                print(f"Email sent successfully to {message['To']}")
        except Exception as e:
            print(f"Failed to send email: {e}")
            raise
