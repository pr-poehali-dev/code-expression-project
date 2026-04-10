import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


def handler(event: dict, context) -> dict:
    """Отправка заявки с формы интенсива на massopro@mail.ru"""
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    body = json.loads(event.get("body") or "{}")
    name = body.get("name", "").strip()
    phone = body.get("phone", "").strip()
    email = body.get("email", "").strip()
    message = body.get("message", "").strip()

    if not all([name, phone, email, message]):
        return {
            "statusCode": 400,
            "headers": cors,
            "body": {"error": "Все поля обязательны"},
        }

    smtp_password = os.environ.get("SMTP_PASSWORD", "")
    from_email = "massopro@mail.ru"
    to_email = "massopro@mail.ru"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Заявка с сайта: {name}"
    msg["From"] = from_email
    msg["To"] = to_email

    html = f"""
    <h2>Новая заявка с сайта — интенсив для массажистов</h2>
    <table cellpadding="8" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:15px;">
      <tr><td><b>Имя:</b></td><td>{name}</td></tr>
      <tr><td><b>Телефон:</b></td><td>{phone}</td></tr>
      <tr><td><b>Email:</b></td><td>{email}</td></tr>
      <tr><td><b>Сообщение:</b></td><td style="white-space:pre-wrap">{message}</td></tr>
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