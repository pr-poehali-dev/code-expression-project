import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
import psycopg2
import psycopg2.extras

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p84565078_code_expression_proj")
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}
LEAD_COST = 3


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def ok(data):
    return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps(data, ensure_ascii=False)}


def err(msg, status=400):
    return {"statusCode": status, "headers": CORS,
            "body": json.dumps({"error": msg}, ensure_ascii=False)}


def handler(event: dict, context) -> dict:
    """Приём заявок с форм скачанных лендингов: списание 2 энергий, сохранение в БД, отправка email"""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    body = json.loads(event.get("body") or "{}")
    user_id = body.get("uid")
    fields = body.get("fields", {})
    source_domain = body.get("domain", "")

    if not user_id or not fields:
        return err("Недостаточно данных")

    conn = get_conn()
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        # Получаем пользователя и его салон
        cur.execute(
            f"SELECT u.id, u.email, u.notification_email, u.full_name, u.salon_id "
            f"FROM {SCHEMA}.lk_users u WHERE u.id = %s AND u.is_active = TRUE",
            (user_id,)
        )
        user = cur.fetchone()
        if not user:
            return err("Пользователь не найден", 404)

        salon_id = user["salon_id"]
        to_email = user["notification_email"] or user["email"]
        fields_json = json.dumps(fields, ensure_ascii=False)

        # Проверяем баланс
        has_energy = False
        if salon_id:
            cur.execute(f"SELECT credits_balance FROM {SCHEMA}.salons WHERE id = %s", (salon_id,))
            row = cur.fetchone()
            balance = row["credits_balance"] if row else 0
            has_energy = balance >= LEAD_COST

        # Сохраняем заявку в БД всегда
        cur.execute(
            f"INSERT INTO {SCHEMA}.landing_leads (user_id, fields, source_domain, email_sent) "
            f"VALUES (%s, %s::jsonb, %s, %s) RETURNING id",
            (user_id, fields_json, source_domain, has_energy)
        )
        lead_id = cur.fetchone()["id"]

        # Если энергии нет — сохраняем без письма
        if not has_energy:
            conn.commit()
            return ok({"ok": True, "saved": True, "email_sent": False})

        # Списываем энергию
        cur.execute(
            f"UPDATE {SCHEMA}.salons SET credits_balance = credits_balance - %s WHERE id = %s",
            (LEAD_COST, salon_id)
        )
        cur.execute(
            f"INSERT INTO {SCHEMA}.credit_transactions (salon_id, user_id, action, amount, tool_key, type) "
            f"VALUES (%s, %s, %s, %s, %s, 'debit')",
            (salon_id, user_id, "Заявка с лендинга", LEAD_COST, "landing_lead")
        )
        conn.commit()

        # Формируем письмо
        rows_html = "".join(
            f'<tr>'
            f'<td style="padding:8px 12px;color:#64748b;font-size:14px;white-space:nowrap;border-bottom:1px solid #f1f5f9">{k}</td>'
            f'<td style="padding:8px 12px;font-size:14px;font-weight:600;color:#0f172a;border-bottom:1px solid #f1f5f9">{v}</td>'
            f'</tr>'
            for k, v in fields.items() if v
        )

        source_row = (
            f'<tr><td style="padding:8px 12px;color:#64748b;font-size:13px;border-bottom:1px solid #f1f5f9">Страница</td>'
            f'<td style="padding:8px 12px;font-size:13px;color:#94a3b8;border-bottom:1px solid #f1f5f9">{source_domain}</td></tr>'
        ) if source_domain else ""

        html_body = f"""
<div style="font-family:Arial,sans-serif;max-width:580px;margin:0 auto;background:#f8fafc;padding:24px">
  <div style="background:#0f172a;padding:24px 28px;border-radius:12px 12px 0 0">
    <h2 style="color:#fff;margin:0;font-size:18px;font-weight:700">Новая заявка с лендинга</h2>
    <p style="color:rgba(255,255,255,0.5);margin:4px 0 0;font-size:13px">Лид #{lead_id}</p>
  </div>
  <div style="background:#fff;padding:0;border-radius:0 0 12px 12px;border:1px solid #e2e8f0;border-top:none">
    <table cellpadding="0" cellspacing="0" style="width:100%;border-collapse:collapse">
      {rows_html}
      {source_row}
    </table>
    <div style="padding:16px 12px;border-top:1px solid #f1f5f9">
      <p style="margin:0;color:#94a3b8;font-size:12px">Заявка принята через Промт Диалог · С баланса списано {LEAD_COST} ⚡</p>
    </div>
  </div>
</div>
"""

        smtp_password = os.environ.get("SMTP_PASSWORD", "")
        from_email = "massopro@mail.ru"
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"Новая заявка с лендинга{' — ' + source_domain if source_domain else ''}"
        msg["From"] = from_email
        msg["To"] = to_email
        msg.attach(MIMEText(html_body, "html"))

        with smtplib.SMTP_SSL("smtp.mail.ru", 465) as server:
            server.login(from_email, smtp_password)
            server.sendmail(from_email, to_email, msg.as_string())

        return ok({"ok": True, "saved": True, "email_sent": True})

    finally:
        conn.close()