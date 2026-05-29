import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime


def handler(event: dict, context) -> dict:
    """Отправка истории диалога с AI-консультантом на почту massopro@mail.ru"""
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    body = json.loads(event.get("body") or "{}")
    name = body.get("name", "").strip()
    email = body.get("email", "").strip()
    messages = body.get("messages", [])

    if not name or not email or not messages:
        return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "missing fields"})}

    rows = ""
    for msg in messages:
        role = msg.get("role", "")
        content = msg.get("content", "")
        if role == "assistant":
            label = "🤖 AI-консультант"
            bg = "#f4f4f0"
            color = "#1a1a1a"
        else:
            label = "👤 Пользователь"
            bg = "#e0f5f5"
            color = "#0d4f4f"
        rows += f"""
        <tr>
          <td style="padding:10px 14px;background:{bg};color:{color};border-radius:8px;vertical-align:top;font-size:14px;line-height:1.6;">
            <div style="font-size:11px;font-weight:700;color:#888;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px;">{label}</div>
            <div style="white-space:pre-wrap;">{content}</div>
          </td>
        </tr>
        <tr><td style="height:8px;"></td></tr>
        """

    now = datetime.now().strftime("%d.%m.%Y %H:%M")

    html = f"""
    <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;">
      <h2 style="color:#1a1a1a;border-bottom:2px solid #e0e0d8;padding-bottom:12px;">
        💬 Диалог с AI-консультантом
      </h2>
      <table cellpadding="0" cellspacing="0" style="margin-bottom:20px;font-size:14px;">
        <tr><td style="padding:4px 0;"><b>Имя:</b></td><td style="padding:4px 12px;">{name}</td></tr>
        <tr><td style="padding:4px 0;"><b>Email:</b></td><td style="padding:4px 12px;">{email}</td></tr>
        <tr><td style="padding:4px 0;"><b>Дата:</b></td><td style="padding:4px 12px;">{now}</td></tr>
        <tr><td style="padding:4px 0;"><b>Сообщений:</b></td><td style="padding:4px 12px;">{len(messages)}</td></tr>
      </table>
      <table width="100%" cellpadding="0" cellspacing="0">
        {rows}
      </table>
    </div>
    """

    smtp_password = os.environ.get("SMTP_PASSWORD", "")
    from_email = "massopro@mail.ru"
    to_email = "massopro@mail.ru"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Чат AI-консультанта: {name} ({email})"
    msg["From"] = from_email
    msg["To"] = to_email

    msg.attach(MIMEText(html, "html"))

    with smtplib.SMTP_SSL("smtp.mail.ru", 465) as server:
        server.login(from_email, smtp_password)
        server.sendmail(from_email, to_email, msg.as_string())

    return {
        "statusCode": 200,
        "headers": cors,
        "body": json.dumps({"ok": True}),
    }
