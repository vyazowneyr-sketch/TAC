import logging
from fastapi import BackgroundTasks
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
from src.core.config import settings

logger = logging.getLogger(__name__)

conf = ConnectionConfig(
    MAIL_USERNAME=settings.MAIL_USERNAME,
    MAIL_PASSWORD=settings.MAIL_PASSWORD,
    MAIL_FROM=settings.MAIL_USERNAME,
    MAIL_SERVER=settings.MAIL_SERVER,
    MAIL_PORT=settings.MAIL_PORT,
    MAIL_FROM_NAME="TAC",
    MAIL_STARTTLS=False,
    MAIL_SSL_TLS=True
)

mail = FastMail(conf)

async def send_verification_email(email: str, token: str):
    html = f"""
    <h1>Подтверждение email</h1>
    <p>Перейдите по ссылке для подтверждения:</p>
    <a href="http://localhost:5173/verify/{token}">Подтвердить email</a>
    """

    message = MessageSchema(
        subject="Подтверждение email - TAC",
        recipients=[email],
        body=html,
        subtype="html"
    )
    
    try:
        await mail.send_message(message)
        logger.info(f"Email sent to {email}")
    except Exception as e:
        logger.error(f"Failed to send email to {email}: {e}")
        raise

def send_verification_email_background(background_tasks: BackgroundTasks, email: str, token: str):
    background_tasks.add_task(send_verification_email, email, token)
