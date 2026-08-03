"""
Cron-задача: ежедневное списание энергии за хранение каждого лендинга на нашем сервере,
а также рассылка письма-напоминания пользователям, зарегистрированным 2 дня назад.
Вызывается внешним cron-сервисом (console.cron-job.org).
GET/POST ?action=charge   — только списание за лендинги
GET/POST ?action=followup — только рассылка писем-напоминаний
GET/POST ?action=run (по умолчанию) — обе задачи сразу
"""
import json
import os
import smtplib
import ssl
import psycopg2
import psycopg2.extras
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
from email.utils import formataddr

SCHEMA = "t_p84565078_code_expression_proj"
COST_PER_LANDING = 2
FROM_EMAIL = "massopro@mail.ru"
SITE_URL = "https://promtdialog.ru"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def _send_followup_email(to_email: str, full_name: str) -> None:
    """Письмо-напоминание о платформе через 2 дня после регистрации."""
    smtp_password = os.environ.get("SMTP_PASSWORD", "")
    if not smtp_password:
        return

    name = full_name or "Здравствуйте"
    html = f"""<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f0;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#1a9fae,#136e7a);padding:28px 32px;">
      <div style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px;">Промт Диалог</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.7);margin-top:4px;">Платформа для бьюти-бизнеса</div>
    </div>
    <div style="padding:32px 32px 24px;">
      <p style="font-size:18px;font-weight:700;color:#1a1a1a;margin:0 0 14px;">
        {name}, как вам первые дни на платформе?
      </p>
      <p style="font-size:14px;color:#555;line-height:1.7;margin:0 0 18px;">
        Прошло 2 дня с момента регистрации — и мы хотим убедиться, что вы уже нашли для себя пользу
        в «Промт Диалог». Напоминаем, что в личном кабинете доступны:
      </p>
      <ul style="font-size:14px;color:#555;line-height:1.9;margin:0 0 20px;padding-left:20px;">
        <li>«Диагностика роста салона PRO» — бесплатный разбор, где вы теряете деньги;</li>
        <li>ИИ-инструменты для контента: посты, сторис, ответы на отзывы;</li>
        <li>ИИ-примерка образа — покажите клиенту результат ещё до начала работы;</li>
        <li>обучение и курсы для вас и вашей команды.</li>
      </ul>
      <p style="font-size:14px;color:#555;line-height:1.7;margin:0 0 28px;">
        Если что-то не получилось разобраться, остались вопросы по инструментам или есть идея,
        чего не хватает — просто ответьте на это письмо, мы обязательно поможем.
      </p>
      <a href="{SITE_URL}/cabinet"
         style="display:inline-block;background:linear-gradient(135deg,#1a9fae,#136e7a);color:#fff;text-decoration:none;
                font-size:15px;font-weight:700;padding:16px 32px;border-radius:12px;letter-spacing:0.2px;">
        Перейти в кабинет
      </a>
    </div>
    <div style="padding:16px 32px;background:#f8f8f5;border-top:1px solid #eee;">
      <p style="font-size:11px;color:#bbb;margin:0;">Промт Диалог — платформа для бьюти-бизнеса. Вопросы: {FROM_EMAIL}</p>
    </div>
  </div>
</body>
</html>"""

    msg = MIMEMultipart("alternative")
    msg["Subject"] = str(Header("Как вам инструменты Промт Диалог? Мы на связи", "utf-8"))
    msg["From"] = formataddr((str(Header("Промт Диалог", "utf-8")), FROM_EMAIL))
    msg["To"] = to_email
    msg["MIME-Version"] = "1.0"
    msg.attach(MIMEText(html, "html", "utf-8"))

    ctx = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.mail.ru", 465, context=ctx, timeout=15) as srv:
        srv.login(FROM_EMAIL, smtp_password)
        srv.sendmail(FROM_EMAIL, [to_email], msg.as_string())


def do_followup_emails(conn) -> dict:
    """Находит пользователей, зарегистрированных 2 дня назад, и отправляет им письмо-напоминание."""
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"""SELECT id, email, full_name, username FROM {SCHEMA}.lk_users
            WHERE is_active = TRUE
              AND followup_email_sent_at IS NULL
              AND created_at <= NOW() - INTERVAL '2 days'
              AND created_at >  NOW() - INTERVAL '3 days'"""
    )
    users = cur.fetchall()
    sent = []
    failed = []
    for u in users:
        try:
            _send_followup_email(u["email"], u["full_name"] or u["username"])
            cur.execute(
                f"UPDATE {SCHEMA}.lk_users SET followup_email_sent_at=NOW() WHERE id=%s",
                (u["id"],)
            )
            conn.commit()
            sent.append(u["id"])
        except Exception as e:
            conn.rollback()
            failed.append({"user_id": u["id"], "error": str(e)})
    return {"sent": sent, "failed": failed, "total_found": len(users)}


def do_charge_landings(conn) -> dict:
    """Списывает энергию с баланса салона за каждый лендинг пользователя (плата за хостинг)."""
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    # Получаем всех пользователей у кого есть лендинги, сгруппированные по салону
    cur.execute(f"""
        SELECT
            u.id AS user_id,
            u.salon_id,
            COUNT(lp.id) AS landing_count,
            COUNT(lp.id) * {COST_PER_LANDING} AS total_cost
        FROM {SCHEMA}.lk_users u
        JOIN {SCHEMA}.landing_projects lp ON lp.user_id = u.id
        WHERE u.is_active = TRUE AND u.salon_id IS NOT NULL
        GROUP BY u.id, u.salon_id
    """)
    rows = cur.fetchall()

    charged = 0
    skipped = 0

    for row in rows:
        user_id = row["user_id"]
        salon_id = row["salon_id"]
        landing_count = row["landing_count"]
        total_cost = row["total_cost"]

        # Проверяем баланс
        cur.execute(
            f"SELECT credits_balance FROM {SCHEMA}.salons WHERE id = %s",
            (salon_id,)
        )
        salon = cur.fetchone()
        if not salon:
            skipped += 1
            continue

        balance = salon["credits_balance"]
        actual_cost = min(total_cost, balance)  # списываем не больше чем есть

        if actual_cost <= 0:
            skipped += 1
            continue

        # Списываем энергию
        cur.execute(
            f"UPDATE {SCHEMA}.salons SET credits_balance = credits_balance - %s WHERE id = %s",
            (actual_cost, salon_id)
        )
        cur.execute(
            f"INSERT INTO {SCHEMA}.credit_transactions "
            f"(salon_id, user_id, action, amount, tool_key, type) "
            f"VALUES (%s, %s, %s, %s, %s, 'debit')",
            (
                salon_id,
                user_id,
                f"Хостинг лендингов ({landing_count} шт.)",
                actual_cost,
                "landing_daily"
            )
        )
        charged += 1

    conn.commit()
    return {"charged_salons": charged, "skipped_salons": skipped, "total_processed": len(rows)}


def handler(event: dict, context) -> dict:
    """Cron (вызывается сервисом console.cron-job.org): списание энергии за лендинги и/или рассылка письма-напоминания через 2 дня после регистрации.
    ?action=charge — только списание, ?action=followup — только письма, по умолчанию (run) — оба действия."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    qs = event.get("queryStringParameters") or {}
    action = qs.get("action", "run")

    conn = get_conn()
    try:
        result: dict = {"ok": True}

        if action in ("run", "charge"):
            result["charge"] = do_charge_landings(conn)

        if action in ("run", "followup"):
            result["followup_emails"] = do_followup_emails(conn)

        print(f"[landing-daily-charge] action={action} {result}")

        return {
            "statusCode": 200,
            "headers": CORS,
            "body": json.dumps(result, ensure_ascii=False)
        }

    finally:
        conn.close()