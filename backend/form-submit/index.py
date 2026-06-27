import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import psycopg2
import psycopg2.extras


SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "public")
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def handler(event: dict, context) -> dict:
    """Приём заявок с форм скачанных лендингов и отправка на email владельца"""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    body = json.loads(event.get("body") or "{}")
    landing_user_id = body.get("uid")
    fields = body.get("fields", {})

    if not landing_user_id or not fields:
        return {
            "statusCode": 400,
            "headers": CORS,
            "body": json.dumps({"error": "Недостаточно данных"}),
        }

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT notification_email, email, full_name FROM {SCHEMA}.lk_users WHERE id = %s AND is_active = TRUE",
        (landing_user_id,)
    )
    user = cur.fetchone()
    conn.close()

    if not user:
        return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Пользователь не найден"})}

    to_email = user["notification_email"] or user["email"]
    owner_name = user["full_name"] or to_email

    rows_html = "".join(
        f'<tr><td style="padding:6px 12px;color:#666;font-size:14px">{k}</td>'
        f'<td style="padding:6px 12px;font-size:14px"><b>{v}</b></td></tr>'
        for k, v in fields.items() if v
    )

    html_body = f"""
<div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto">
  <div style="background:#1a1a2e;padding:24px 32px;border-radius:8px 8px 0 0">
    <h2 style="color:#fff;margin:0;font-size:20px">Новая заявка с лендинга</h2>
  </div>
  <div style="background:#f9f9f9;padding:24px 32px;border-radius:0 0 8px 8px;border:1px solid #e5e5e5">
    <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">
      {rows_html}
    </table>
    <p style="margin-top:24px;color:#999;font-size:12px">
      Заявка отправлена через форму вашего лендинга (Про Диалог)
    </p>
  </div>
</div>
"""

    smtp_password = os.environ.get("SMTP_PASSWORD", "")
    from_email = "massopro@mail.ru"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Новая заявка с вашего лендинга"
    msg["From"] = f"Про Диалог <{from_email}>"
    msg["To"] = to_email
    msg.attach(MIMEText(html_body, "html"))

    with smtplib.SMTP_SSL("smtp.mail.ru", 465) as server:
        server.login(from_email, smtp_password)
        server.sendmail(from_email, to_email, msg.as_string())

    return {
        "statusCode": 200,
        "headers": CORS,
        "body": json.dumps({"ok": True}),
    }
