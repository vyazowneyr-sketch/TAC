from fastapi import BackgroundTasks
from fastapi_mail import FastMail, MessageSchema
from src.core.config import settings

mail = FastMail(
    credentials=(settings.MAIL_USERNAME, settings.MAIL_PASSWORD),
    mail_server=settings.MAIL_SERVER,
    mail_port=settings.MAIL_PORT
)

def send_verification_email(email: str, token: str):
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

    mail.send_message(message)