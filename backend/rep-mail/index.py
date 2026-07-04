"""
Отправка красивых HTML-писем представителем салонам.
Авторизация через X-Session-Id, требует is_representative или is_admin.
"""
import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
from email.utils import formataddr

import psycopg2
import psycopg2.extras

SCHEMA = "t_p84565078_code_expression_proj"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}
FROM_EMAIL = "massopro@mail.ru"
SITE_URL = "https://promtdialog.ru"


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


def build_html_email(to_name: str, subject: str, body_html: str, sender_name: str, cta_url: str = "", cta_label: str = "") -> str:
    """Формирует красивое брендовое HTML-письмо Промт Диалог."""
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
              Промт <span style="color:#4ecdc4;">Диалог</span>
            </div>
            <div style="font-size:12px;color:#8ab8b4;margin-top:4px;letter-spacing:2px;text-transform:uppercase;">
              ИИ-агенты для вашего салона
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
            <a href="{cta_url or SITE_URL}"
               style="display:inline-block;background:#1a7a74;color:#ffffff;text-decoration:none;
                      padding:14px 36px;border-radius:10px;font-size:15px;font-weight:600;
                      letter-spacing:0.3px;">
              {cta_label or "Узнать подробнее"}
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
              <span style="color:#888;">Администратор Промт Диалог</span>
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
              Это письмо отправлено администратором платформы Промт Диалог.
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
    """Отправка брендового письма представителем Промт Диалог клиенту-салону."""
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
    template_label = (body.get("template_label") or "").strip()
    cta_url = (body.get("cta_url") or "").strip()
    cta_label = (body.get("cta_label") or "").strip()

    if not to_email or not subject or not body_html:
        return err("Укажите email получателя, тему и текст письма")

    sender_name = user.get("full_name") or user.get("username") or "Администратор"

    html_content = build_html_email(to_name, subject, body_html, sender_name, cta_url, cta_label)

    msg = MIMEMultipart("alternative")
    msg["Subject"] = Header(subject, "utf-8")
    msg["From"] = formataddr((str(Header("Промт Диалог", "utf-8")), FROM_EMAIL))
    msg["To"] = to_email
    msg["Reply-To"] = FROM_EMAIL
    msg["List-Unsubscribe"] = f"<mailto:{FROM_EMAIL}?subject=unsubscribe>"
    msg["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click"
    msg["X-Mailer"] = "ProDialog Platform"
    msg["Precedence"] = "bulk"

    msg.attach(MIMEText(html_content, "html", "utf-8"))

    smtp_password = os.environ["SMTP_PASSWORD"]
    with smtplib.SMTP_SSL("smtp.mail.ru", 465) as server:
        server.login(FROM_EMAIL, smtp_password)
        server.sendmail(FROM_EMAIL, to_email, msg.as_string())

    log_conn = psycopg2.connect(os.environ["DATABASE_URL"])
    try:
        log_cur = log_conn.cursor()
        log_cur.execute(
            f"INSERT INTO {SCHEMA}.rep_mail_log (sender_id, to_email, to_name, subject, template_label) "
            f"VALUES (%s, %s, %s, %s, %s)",
            (user["id"], to_email, to_name, subject, template_label)
        )
        log_conn.commit()
    finally:
        log_conn.close()

    return ok({"ok": True, "sent_to": to_email})