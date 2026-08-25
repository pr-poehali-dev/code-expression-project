"""
Приём заявок от школ на партнёрскую программу «Промт Диалог» (страница /dlya-shkol).
POST / — сохраняет заявку в БД и отправляет уведомление на почту. Без авторизации, публичный эндпоинт.
Body: school_name, contact_name, position, phone, messenger, website, email, graduates_per_year.
"""
import json
import os
import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
from email.utils import formataddr
import psycopg2

SCHEMA = "t_p84565078_code_expression_proj"
FROM_EMAIL = "massopro@mail.ru"
TO_EMAIL = "massopro@mail.ru"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def ok(data):
    return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps(data, ensure_ascii=False)}


def err(msg, status=400):
    return {"statusCode": status, "headers": CORS,
            "body": json.dumps({"error": msg}, ensure_ascii=False)}


def send_notify_email(lead: dict) -> bool:
    smtp_password = os.environ.get("SMTP_PASSWORD", "")
    if not smtp_password:
        return False

    rows = "".join(
        f"<tr><td style='padding:8px 14px;color:#888;font-size:13px;'>{label}</td>"
        f"<td style='padding:8px 14px;font-size:14px;color:#1a1a1a;'>{value}</td></tr>"
        for label, value in [
            ("Школа", lead.get("school_name") or "—"),
            ("Контакт", lead.get("contact_name") or "—"),
            ("Должность", lead.get("position") or "—"),
            ("Телефон", lead.get("phone") or "—"),
            ("Telegram/WhatsApp", lead.get("messenger") or "—"),
            ("Сайт школы", lead.get("website") or "—"),
            ("Email", lead.get("email") or "—"),
            ("Выпускников в год", lead.get("graduates_per_year") or "—"),
        ]
    )

    html = f"""<!DOCTYPE html>
<html><body style="margin:0;padding:0;background:#f4f4f0;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#0F172A,#0F2A30);padding:28px 32px;">
      <div style="font-size:20px;font-weight:800;color:#fff;">Промт Диалог</div>
      <div style="font-size:13px;color:#2DD4BF;margin-top:4px;">НОВАЯ ЗАЯВКА — ПАРТНЁРСТВО ДЛЯ ШКОЛ</div>
    </div>
    <div style="padding:28px 32px;">
      <table style="border-collapse:collapse;width:100%;">{rows}</table>
    </div>
  </div>
</body></html>"""

    msg = MIMEMultipart("alternative")
    msg["Subject"] = str(Header(f"Заявка школы: {lead.get('school_name') or '—'}", "utf-8"))
    msg["From"] = formataddr((str(Header("Промт Диалог", "utf-8")), FROM_EMAIL))
    msg["To"] = TO_EMAIL
    msg.attach(MIMEText(html, "html", "utf-8"))

    ctx = ssl.create_default_context()
    try:
        with smtplib.SMTP_SSL("smtp.mail.ru", 465, context=ctx, timeout=15) as srv:
            srv.login(FROM_EMAIL, smtp_password)
            srv.sendmail(FROM_EMAIL, TO_EMAIL, msg.as_string())
        return True
    except (smtplib.SMTPException, TimeoutError, OSError):
        return False


def handler(event: dict, context) -> dict:
    """Приём заявки школы на партнёрскую программу — сохранение в БД + уведомление на почту."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    if event.get("httpMethod") != "POST":
        return err("Метод не поддерживается", 405)

    body = json.loads(event.get("body") or "{}")
    school_name = (body.get("school_name") or "").strip()
    contact_name = (body.get("contact_name") or "").strip()
    phone = (body.get("phone") or "").strip()
    if not school_name or not contact_name or not phone:
        return err("Укажите название школы, имя и телефон")

    lead = {
        "school_name": school_name,
        "contact_name": contact_name,
        "position": (body.get("position") or "").strip(),
        "phone": phone,
        "messenger": (body.get("messenger") or "").strip(),
        "website": (body.get("website") or "").strip(),
        "email": (body.get("email") or "").strip(),
        "graduates_per_year": (body.get("graduates_per_year") or "").strip(),
    }

    email_sent = send_notify_email(lead)

    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute(
            f"""INSERT INTO {SCHEMA}.school_partner_leads
                (school_name, contact_name, position, phone, messenger, website, email, graduates_per_year, email_sent)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id""",
            (lead["school_name"], lead["contact_name"], lead["position"], lead["phone"],
             lead["messenger"], lead["website"], lead["email"], lead["graduates_per_year"], email_sent)
        )
        lead_id = cur.fetchone()[0]
        conn.commit()
        return ok({"ok": True, "id": lead_id})
    finally:
        conn.close()
