import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Универсальная отправка заявок с форм сайта на massopro@mail.ru"""
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    body = json.loads(event.get("body") or "{}")
    name = body.get("name", "").strip()
    contact = body.get("contact", "").strip()
    message = body.get("message", "").strip()

    if not name or not contact:
        return {
            "statusCode": 400,
            "headers": cors,
            "body": json.dumps({"error": "Имя и контакт обязательны"}),
        }

    smtp_password = os.environ.get("SMTP_PASSWORD", "")
    from_email = "massopro@mail.ru"
    to_email = "massopro@mail.ru"

    is_b2b = "B2B-заявка" in message or "салон" in message.lower()
    subject = f"{'[Салон] ' if is_b2b else ''}Новая заявка: {name}"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = from_email
    msg["To"] = to_email

    rows = f"""
      <tr><td><b>Имя:</b></td><td>{name}</td></tr>
      <tr><td><b>Контакт:</b></td><td>{contact}</td></tr>
    """
    if message:
        rows += f'<tr><td><b>Сообщение:</b></td><td style="white-space:pre-wrap">{message}</td></tr>'

    html = f"""
    <h2 style="color:#1a1a1a">{'🏢 B2B-заявка для салона' if is_b2b else 'Новая заявка с сайта'}</h2>
    <table cellpadding="8" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:15px;">
      {rows}
    </table>
    """
    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP_SSL("smtp.mail.ru", 465) as server:
        server.login(from_email, smtp_password)
        server.sendmail(from_email, to_email, msg.as_string())

    return {
        "statusCode": 200,
        "headers": cors,
        "body": json.dumps({"ok": True}),
    }