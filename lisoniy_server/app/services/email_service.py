"""Email service for sending emails via HTTP API"""

import httpx
from typing import Optional

from app.core.config import settings


# External email API configuration
EMAIL_API_URL = "https://projects.qahorov.uz/mail-sender"
EMAIL_API_TOKEN = "iL48vt1tRHS+8eMwLnBNaRn33ooE1ySI+LVj4vC8M/M="


class EmailService:
    """Service for sending emails via HTTP API"""
    
    @staticmethod
    def create_verification_html(name: str, otp: str) -> str:
        """Create verification email HTML"""
        return f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #3B82F6;">Lisoniy - Email Tasdiqlash</h2>
                    <p>Salom {name}!</p>
                    <p>Ro'yxatdan o'tganingiz uchun rahmat! Emailingizni tasdiqlash uchun quyidagi kodni kiriting:</p>
                    <div style="background-color: #f4f4f4; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
                        <h1 style="color: #3B82F6; font-size: 32px; letter-spacing: 5px; margin: 0;">{otp}</h1>
                    </div>
                    <p>Bu kod {settings.OTP_EXPIRE_MINUTES} daqiqa ichida amal qiladi.</p>
                    <p>Agar siz ro'yxatdan o'tmagan bo'lsangiz, bu xabarni e'tiborsiz qoldiring.</p>
                    <hr style="border: 1px solid #eee; margin: 30px 0;">
                    <p style="font-size: 12px; color: #999;">
                        Bu avtomatik xabar. Javob bermang.
                        <br>Lisoniy — O'zbek tilining raqamli kelajagi
                    </p>
                </div>
            </body>
        </html>
        """
    
    @staticmethod
    def create_password_reset_html(name: str, reset_token: str) -> str:
        """Create password reset email HTML"""
        reset_link = f"https://lisoniy.uz/reset-password?token={reset_token}"
        
        return f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #F59E0B;">Lisoniy - Parolni Tiklash</h2>
                    <p>Salom {name}!</p>
                    <p>Parolni tiklash so'rovi qabul qilindi. Yangi parol yaratish uchun quyidagi tugmani bosing:</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="{reset_link}" 
                           style="background-color: #3B82F6; color: white; padding: 12px 30px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block;">
                            Parolni Tiklash
                        </a>
                    </div>
                    <p>Yoki bu havolani brauzeringizga nusxalang:</p>
                    <p style="background-color: #f4f4f4; padding: 10px; border-radius: 5px; 
                              word-break: break-all; font-size: 12px;">{reset_link}</p>
                    <p>Bu havola {settings.PASSWORD_RESET_TOKEN_EXPIRE_MINUTES} daqiqa ichida amal qiladi.</p>
                    <p>Agar siz bu so'rovni yubormagan bo'lsangiz, bu xabarni e'tiborsiz qoldiring.</p>
                    <hr style="border: 1px solid #eee; margin: 30px 0;">
                    <p style="font-size: 12px; color: #999;">
                        Bu avtomatik xabar. Javob bermang.
                        <br>Lisoniy — O'zbek tilining raqamli kelajagi
                    </p>
                </div>
            </body>
        </html>
        """
    
    @staticmethod
    def create_welcome_html(name: str) -> str:
        """Create welcome email HTML"""
        return f"""
        <html>
            <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #10B981;">Lisoniy ga Xush Kelibsiz! 🎉</h2>
                    <p>Salom {name}!</p>
                    <p>Emailingiz muvaffaqiyatli tasdiqlandi! Endi Lisoniy platformasining barcha imkoniyatlaridan foydalanishingiz mumkin:</p>
                    <ul style="padding-left: 20px;">
                        <li>📚 NLP va AI bo'yicha bepul kurslar</li>
                        <li>📊 O'zbek tili datasetlari</li>
                        <li>🛠️ Til asboblari (transliteratsiya, imlo tekshiruv)</li>
                        <li>💬 Hamjamiyat muhokamalarida ishtirok</li>
                    </ul>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://lisoniy.uz/dashboard" 
                           style="background-color: #10B981; color: white; padding: 12px 30px; 
                                  text-decoration: none; border-radius: 5px; display: inline-block;">
                            Boshlash
                        </a>
                    </div>
                    <hr style="border: 1px solid #eee; margin: 30px 0;">
                    <p style="font-size: 12px; color: #999;">
                        Bu avtomatik xabar. Javob bermang.
                        <br>Lisoniy — O'zbek tilining raqamli kelajagi
                    </p>
                </div>
            </body>
        </html>
        """
    
    @staticmethod
    async def send_email(to: str, subject: str, body: str) -> bool:
        """
        Send email via external API
        
        Args:
            to: Recipient email
            subject: Email subject
            body: HTML body
            
        Returns:
            True if sent successfully, False otherwise
        """
        try:
            async with httpx.AsyncClient(timeout=30.0) as client:
                response = await client.post(
                    EMAIL_API_URL,
                    json={
                        "to": to,
                        "subject": subject,
                        "body": body,
                        "token": EMAIL_API_TOKEN
                    },
                    headers={"Content-Type": "application/json"}
                )
                
                if response.status_code >= 400:
                    print(f"Email API Error: {response.status_code} - {response.text}")
                    return False
                
                print(f"Email sent successfully to {to}")
                return True
                
        except Exception as e:
            print(f"Failed to send email to {to}: {e}")
            return False
    
    @staticmethod
    def send_email_sync(to: str, subject: str, body: str) -> bool:
        """
        Send email via external API (synchronous version for Celery)
        
        Args:
            to: Recipient email
            subject: Email subject
            body: HTML body
            
        Returns:
            True if sent successfully, False otherwise
        """
        import requests
        
        try:
            response = requests.post(
                EMAIL_API_URL,
                json={
                    "to": to,
                    "subject": subject,
                    "body": body,
                    "token": EMAIL_API_TOKEN
                },
                headers={"Content-Type": "application/json"},
                timeout=30
            )
            
            if response.status_code >= 400:
                print(f"Email API Error: {response.status_code} - {response.text}")
                return False
            
            print(f"Email sent successfully to {to}")
            return True
            
        except Exception as e:
            print(f"Failed to send email to {to}: {e}")
            return False


# Convenience functions
async def send_verification_email(to: str, name: str, otp: str) -> bool:
    """Send verification email"""
    html = EmailService.create_verification_html(name, otp)
    return await EmailService.send_email(to, "Lisoniy - Email Tasdiqlash", html)


async def send_password_reset_email(to: str, name: str, token: str) -> bool:
    """Send password reset email"""
    html = EmailService.create_password_reset_html(name, token)
    return await EmailService.send_email(to, "Lisoniy - Parolni Tiklash", html)


async def send_welcome_email(to: str, name: str) -> bool:
    """Send welcome email"""
    html = EmailService.create_welcome_html(name)
    return await EmailService.send_email(to, "Lisoniy ga Xush Kelibsiz! 🎉", html)
