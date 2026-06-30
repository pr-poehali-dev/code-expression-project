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
        import datetime as _dt
        now_str = _dt.datetime.now().strftime("%d.%m.%Y в %H:%M")

        # Определяем имя и телефон клиента для заголовка
        client_name = ""
        client_phone = ""
        for k, v in fields.items():
            kl = k.lower()
            if not client_name and any(w in kl for w in ["имя", "name", "обращ", "клиент", "контакт", "как к вам"]):
                client_name = v
            if not client_phone and any(w in kl for w in ["тел", "phone", "моб", "звон", "+7", "номер"]):
                client_phone = v

        # Строки таблицы с данными
        field_icons = {
            "имя": "👤", "name": "👤", "обращ": "👤", "клиент": "👤",
            "тел": "📞", "phone": "📞", "моб": "📞", "номер": "📞",
            "email": "✉️", "почт": "✉️", "mail": "✉️",
            "услуг": "💼", "service": "💼",
            "вопрос": "💬", "коммент": "💬", "пожелан": "💬", "сообщен": "💬",
            "дат": "📅", "date": "📅", "врем": "📅",
            "гост": "👥", "кол-во": "👥",
        }

        def get_icon(label):
            ll = label.lower()
            for kw, ico in field_icons.items():
                if kw in ll:
                    return ico
            return "•"

        rows_html = "".join(
            f'<tr style="border-bottom:1px solid #f1f5f9">'
            f'<td style="padding:12px 16px;color:#64748b;font-size:13px;white-space:nowrap;width:40%;vertical-align:top">'
            f'<span style="margin-right:6px">{get_icon(k)}</span>{k}</td>'
            f'<td style="padding:12px 16px;font-size:14px;font-weight:600;color:#0f172a;vertical-align:top">{v}</td>'
            f'</tr>'
            for k, v in fields.items() if v
        )

        phone_btn = ""
        if client_phone:
            clean_phone = "".join(c for c in client_phone if c in "0123456789+")
            phone_btn = f'<a href="tel:{clean_phone}" style="display:inline-block;margin-top:8px;padding:10px 22px;background:#10b981;color:#fff;text-decoration:none;border-radius:8px;font-size:14px;font-weight:700;">📞 Позвонить {client_phone}</a>'

        source_line = f'<p style="margin:4px 0 0;font-size:12px;color:rgba(255,255,255,0.45)">🌐 {source_domain}</p>' if source_domain else ""
        client_line = f"Заявка от <b>{client_name}</b>" if client_name else "Новая заявка"

        html_body = f"""<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,Helvetica,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f1f5f9;padding:32px 16px">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%">

  <!-- Шапка -->
  <tr><td style="background:linear-gradient(135deg,#0f172a 0%,#1e3a5f 100%);border-radius:16px 16px 0 0;padding:28px 32px">
    <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:2px;color:rgba(255,255,255,0.4);text-transform:uppercase">Промт Диалог · Лид #{lead_id}</p>
    <h1 style="margin:0 0 6px;font-size:22px;font-weight:800;color:#fff;line-height:1.2">{client_line}</h1>
    <p style="margin:0;font-size:13px;color:rgba(255,255,255,0.5)">🕐 {now_str}{("  " + source_line) if source_domain else ""}</p>
  </td></tr>

  <!-- Данные формы -->
  <tr><td style="background:#fff;padding:0;border-left:1px solid #e2e8f0;border-right:1px solid #e2e8f0">
    <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse">
      {rows_html}
    </table>
  </td></tr>

  <!-- Кнопка и футер -->
  <tr><td style="background:#fff;border:1px solid #e2e8f0;border-top:none;border-radius:0 0 16px 16px;padding:20px 32px 28px">
    {phone_btn}
    <p style="margin:20px 0 0;font-size:12px;color:#94a3b8;border-top:1px solid #f1f5f9;padding-top:16px">
      Заявка получена через <b>Промт Диалог</b> · С баланса списано {LEAD_COST} ⚡<br>
      Ответьте клиенту в течение часа — это увеличивает конверсию в 3 раза.
    </p>
  </td></tr>

</table>
</td></tr></table>
</body></html>
"""

        smtp_password = os.environ.get("SMTP_PASSWORD", "")
        from_email = "massopro@mail.ru"
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"Новая заявка с лендинга{' — ' + source_domain if source_domain else ''}"
        msg["From"] = from_email
        msg["To"] = to_email
        msg.attach(MIMEText(html_body, "html"))

        print(f"[form-submit] Отправка письма на {to_email}, lead_id={lead_id}, domain={source_domain}")
        try:
            with smtplib.SMTP_SSL("smtp.mail.ru", 465, timeout=10) as server:
                server.login(from_email, smtp_password)
                server.sendmail(from_email, to_email, msg.as_string())
            print(f"[form-submit] Письмо отправлено успешно на {to_email}")
        except Exception as smtp_err:
            print(f"[form-submit] SMTP ошибка: {smtp_err}")
            return ok({"ok": True, "saved": True, "email_sent": False, "smtp_error": str(smtp_err)})

        return ok({"ok": True, "saved": True, "email_sent": True})

    finally:
        conn.close()