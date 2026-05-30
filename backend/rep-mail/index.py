"""
Отправка красивых HTML-писем представителем салонам.
Авторизация через X-Session-Id, требует is_representative или is_admin.
"""
import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

import psycopg2
import psycopg2.extras

SCHEMA = "t_p84565078_code_expression_proj"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}
FROM_EMAIL = "massopro@mail.ru"
SITE_URL = "https://dok-dialog.ru"


def ok(data: dict) -> dict:
    return {"statusCode": 200, "headers": CORS, "body": json.dumps(data, ensure_ascii=False)}


def err(msg: str, status: int = 400) -> dict:
    return {"statusCode": status, "headers": CORS, "body": json.dumps({"error": msg}, ensure_ascii=False)}


def get_session_user(event: dict):
    session_id = (event.get("headers") or {}).get("X-Session-Id", "")
    if not session_id:
        return None
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"SELECT u.* FROM {SCHEMA}.lk_sessions s JOIN {SCHEMA}.lk_users u ON u.id = s.user_id "
            f"WHERE s.id = %s AND s.expires_at > NOW() AND u.is_active = TRUE",
            (session_id,)
        )
        return cur.fetchone()
    finally:
        conn.close()


def build_html_email(to_name: str, subject: str, body_html: str, sender_name: str) -> str:
    """Формирует красивое брендовое HTML-письмо Dok Диалог."""
    return f"""<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{subject}</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f0;padding:32px 0;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Шапка с логотипом -->
        <tr>
          <td style="background:#1a2e2a;border-radius:16px 16px 0 0;padding:28px 40px;text-align:center;">
            <div style="font-family:Georgia,serif;font-size:26px;font-weight:700;color:#ffffff;letter-spacing:1px;">
              Dok <span style="color:#4ecdc4;">Диалог</span>
            </div>
            <div style="font-size:12px;color:#8ab8b4;margin-top:4px;letter-spacing:2px;text-transform:uppercase;">
              Профессиональная платформа для салонов красоты
            </div>
          </td>
        </tr>

        <!-- Основной контент -->
        <tr>
          <td style="background:#ffffff;padding:40px 40px 32px;">

            {f'<p style="font-size:16px;color:#1a1a1a;margin:0 0 24px;">Здравствуйте, <strong>{to_name}</strong>!</p>' if to_name else ''}

            <div style="font-size:15px;color:#333;line-height:1.8;">
              {body_html}
            </div>

          </td>
        </tr>

        <!-- Кнопка CTA -->
        <tr>
          <td style="background:#ffffff;padding:0 40px 40px;text-align:center;">
            <a href="{SITE_URL}/dlya-salonov"
               style="display:inline-block;background:#1a7a74;color:#ffffff;text-decoration:none;
                      padding:14px 36px;border-radius:10px;font-size:15px;font-weight:600;
                      letter-spacing:0.3px;">
              Узнать подробнее
            </a>
          </td>
        </tr>

        <!-- Разделитель -->
        <tr>
          <td style="background:#ffffff;padding:0 40px;">
            <hr style="border:none;border-top:1px solid #eeeeea;margin:0;">
          </td>
        </tr>

        <!-- Подпись представителя -->
        <tr>
          <td style="background:#ffffff;padding:24px 40px 32px;border-radius:0 0 0 0;">
            <p style="margin:0;font-size:14px;color:#555;">
              С уважением,<br>
              <strong style="color:#1a1a1a;">{sender_name}</strong><br>
              <span style="color:#888;">Представитель Dok Диалог</span>
            </p>
          </td>
        </tr>

        <!-- Футер -->
        <tr>
          <td style="background:#f0f0ea;border-radius:0 0 16px 16px;padding:20px 40px;text-align:center;">
            <p style="margin:0 0 8px;font-size:12px;color:#999;">
              <a href="{SITE_URL}" style="color:#1a7a74;text-decoration:none;">{SITE_URL}</a>
            </p>
            <p style="margin:0;font-size:11px;color:#bbb;">
              Это письмо отправлено представителем платформы Dok Диалог.
            </p>
          </td>
        </tr>

      </table>
    </td>
  </tr>
</table>
</body>
</html>"""


def handler(event: dict, context) -> dict:
    """Отправка брендового письма представителем Dok Диалог клиенту-салону."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    user = get_session_user(event)
    if not user:
        return err("Не авторизован", 401)
    if not user.get("is_representative") and not user.get("is_admin"):
        return err("Нет доступа", 403)

    body = json.loads(event.get("body") or "{}")
    to_email = (body.get("to_email") or "").strip()
    to_name = (body.get("to_name") or "").strip()
    subject = (body.get("subject") or "").strip()
    body_html = (body.get("body_html") or "").strip()

    if not to_email or not subject or not body_html:
        return err("Укажите email получателя, тему и текст письма")

    sender_name = user.get("full_name") or user.get("username") or "Представитель"

    html_content = build_html_email(to_name, subject, body_html, sender_name)

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"Dok Диалог <{FROM_EMAIL}>"
    msg["To"] = to_email
    msg["Reply-To"] = FROM_EMAIL

    msg.attach(MIMEText(html_content, "html", "utf-8"))

    smtp_password = os.environ["SMTP_PASSWORD"]
    with smtplib.SMTP_SSL("smtp.mail.ru", 465) as server:
        server.login(FROM_EMAIL, smtp_password)
        server.sendmail(FROM_EMAIL, to_email, msg.as_string())

    return ok({"ok": True, "sent_to": to_email})
