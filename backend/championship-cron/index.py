"""
Автоматика чемпионата — вызывается по расписанию (cron) или вручную из админки.
GET  ?action=run           — запускает все проверки (cron trigger)
GET  ?action=check_min     — проверка минимума участников за 3 дня до старта
GET  ?action=open_tasks    — открывает задание когда наступает task_opens_at
GET  ?action=start_voting  — переводит в статус voting когда наступает voting_starts
GET  ?action=close_voting  — переводит в статус finished_pending когда voting_ends
GET  ?action=notify        — рассылает уведомления о новых турнирах
"""
import json
import os
import smtplib
import psycopg2
import psycopg2.extras
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timezone, timedelta

S = "t_p84565078_code_expression_proj"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}
FROM_EMAIL = "massopro@mail.ru"
SITE_URL = "https://promtdialog.ru"


def tbl(name): return f"{S}.{name}"
def get_db(): return psycopg2.connect(os.environ["DATABASE_URL"])
def ok(data, status=200): return {"statusCode": status, "headers": CORS, "body": json.dumps(data, ensure_ascii=False, default=str)}
def err(msg, status=400): return {"statusCode": status, "headers": CORS, "body": json.dumps({"error": msg}, ensure_ascii=False)}
def now(): return datetime.now(timezone.utc)


def send_email_html(to: str, subject: str, html: str):
    smtp_pw = os.environ.get("SMTP_PASSWORD", "")
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = FROM_EMAIL
    msg["To"] = to
    msg.attach(MIMEText(html, "html"))
    with smtplib.SMTP_SSL("smtp.mail.ru", 465, timeout=10) as s:
        s.login(FROM_EMAIL, smtp_pw)
        s.sendmail(FROM_EMAIL, to, msg.as_string())


def handler(event: dict, context) -> dict:
    """Cron-автоматика чемпионата: проверка дат, перенос, открытие заданий, рассылки."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    qs = event.get("queryStringParameters") or {}
    action = qs.get("action", "run")

    results = {}

    if action in ("run", "check_min"):
        results["check_min"] = do_check_min_participants()
    if action in ("run", "open_tasks"):
        results["open_tasks"] = do_open_tasks()
    if action in ("run", "start_voting"):
        results["start_voting"] = do_start_voting()
    if action in ("run", "close_voting"):
        results["close_voting"] = do_close_voting()
    if action in ("run", "notify"):
        results["notify"] = do_notify_salons()

    return ok({"ok": True, "results": results, "ran_at": now().isoformat()})


# ── Проверка минимума участников ─────────────────────────────────────────────

def do_check_min_participants() -> dict:
    """
    За 3 дня до task_opens_at проверяет набран ли минимум участников.
    Если нет — переводит в postponed, ставит next_date и рассылает уведомление.
    """
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    check_until = now() + timedelta(days=3)

    cur.execute(
        f"""SELECT t.* FROM {tbl('ch_tournaments')} t
            WHERE t.status IN ('announced','registration')
              AND t.task_opens_at IS NOT NULL
              AND t.task_opens_at <= %s
              AND t.postponed = FALSE""",
        (check_until,)
    )
    tournaments = cur.fetchall()
    postponed = []

    for t in tournaments:
        # Считаем одобренные заявки
        cur.execute(
            f"SELECT COUNT(*) as cnt FROM {tbl('ch_applications')} WHERE tournament_id=%s AND status='approved'",
            (t["id"],)
        )
        count = cur.fetchone()["cnt"]

        if count < t["min_participants"]:
            # Переносим на next_date (если задана, иначе +14 дней)
            next_dt = t.get("next_date") or (t["task_opens_at"] + timedelta(days=14))
            reason = (f"Набрано {count} из {t['min_participants']} участников. "
                      f"Турнир перенесён на {next_dt.strftime('%d.%m.%Y')}.")
            cur.execute(
                f"""UPDATE {tbl('ch_tournaments')} SET
                       postponed=TRUE, postpone_reason=%s,
                       task_opens_at=%s,
                       work_deadline=work_deadline + (%s - task_opens_at),
                       voting_starts=voting_starts + (%s - task_opens_at),
                       voting_ends=voting_ends + (%s - task_opens_at),
                       updated_at=NOW()
                    WHERE id=%s""",
                (reason, next_dt, next_dt, next_dt, next_dt, t["id"])
            )

            # Уведомляем участников
            cur.execute(
                f"""SELECT a.notify_email FROM {tbl('ch_applications')} a
                    WHERE a.tournament_id=%s AND a.status IN ('approved','pending')
                      AND a.notify_email IS NOT NULL AND a.notify_email != ''""",
                (t["id"],)
            )
            emails = [r["notify_email"] for r in cur.fetchall()]
            for email in emails:
                try:
                    _send_postpone_email(email, t, count, next_dt)
                except Exception as e:
                    print(f"[cron] postpone email error {email}: {e}")

            postponed.append({"tournament_id": t["id"], "name": t["name"], "count": count, "next_date": str(next_dt)})

    conn.commit()
    return {"postponed": postponed, "checked": len(tournaments)}


def _send_postpone_email(to_email: str, tournament: dict, count: int, next_dt):
    html = f"""<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:16px;overflow:hidden">
  <tr><td style="background:linear-gradient(135deg,#f59e0b,#d97706);padding:28px 32px">
    <h2 style="margin:0;color:#fff;font-size:20px">⏰ Турнир перенесён</h2>
    <p style="margin:6px 0 0;color:rgba(255,255,255,0.85);font-size:14px">{tournament['name']}</p>
  </td></tr>
  <tr><td style="padding:28px 32px">
    <p style="margin:0 0 16px;font-size:15px;color:#374151;line-height:1.6">
      К сожалению, минимальное количество участников не набрано:<br>
      <b>{count} из {tournament['min_participants']} участников</b>
    </p>
    <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:10px;padding:16px 20px;margin-bottom:20px">
      <div style="font-size:13px;color:#92400e;font-weight:700;margin-bottom:4px">Новые даты</div>
      <div style="font-size:15px;color:#78350f;font-weight:700">Старт: {next_dt.strftime("%d.%m.%Y")}</div>
    </div>
    <p style="margin:0 0 20px;font-size:14px;color:#6b7280;line-height:1.6">
      Ваша заявка сохранена и автоматически перенесена. Расскажите коллегам о турнире!
    </p>
    <a href="{SITE_URL}/championship" style="display:inline-block;padding:12px 28px;background:#6366f1;color:#fff;text-decoration:none;border-radius:10px;font-size:14px;font-weight:700">
      Перейти к чемпионату
    </a>
  </td></tr>
  <tr><td style="padding:16px 32px;border-top:1px solid #f1f5f9">
    <p style="margin:0;font-size:12px;color:#9ca3af">Промт Диалог · Чемпионат красоты</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>"""
    send_email_html(to_email, f"Турнир «{tournament['name']}» перенесён", html)


# ── Открытие задания ──────────────────────────────────────────────────────────

def do_open_tasks() -> dict:
    """Переводит турниры в статус 'active' когда наступает task_opens_at."""
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"""SELECT * FROM {tbl('ch_tournaments')}
            WHERE status = 'registration'
              AND task_opens_at IS NOT NULL
              AND task_opens_at <= NOW()
              AND postponed = FALSE""",
    )
    tournaments = cur.fetchall()
    opened = []

    for t in tournaments:
        cur.execute(
            f"UPDATE {tbl('ch_tournaments')} SET status='active', updated_at=NOW() WHERE id=%s",
            (t["id"],)
        )
        # Уведомляем участников об открытии задания
        cur.execute(
            f"""SELECT a.notify_email, sl.name as salon_name
                FROM {tbl('ch_applications')} a
                JOIN {tbl('salons')} sl ON sl.id = a.salon_id
                WHERE a.tournament_id=%s AND a.status='approved'
                  AND a.notify_email IS NOT NULL AND a.notify_email != ''""",
            (t["id"],)
        )
        for row in cur.fetchall():
            try:
                _send_task_open_email(row["notify_email"], row["salon_name"], t)
            except Exception as e:
                print(f"[cron] task open email error: {e}")
        opened.append({"tournament_id": t["id"], "name": t["name"]})

    conn.commit()
    return {"opened": opened}


def _send_task_open_email(to_email: str, salon_name: str, tournament: dict):
    html = f"""<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:16px;overflow:hidden">
  <tr><td style="background:linear-gradient(135deg,#6366f1,#4f46e5);padding:28px 32px">
    <h2 style="margin:0;color:#fff;font-size:22px">{tournament.get('emoji','🏆')} Турнир начался!</h2>
    <p style="margin:6px 0 0;color:rgba(255,255,255,0.8);font-size:15px">{tournament['name']}</p>
  </td></tr>
  <tr><td style="padding:28px 32px">
    <p style="margin:0 0 16px;font-size:15px;color:#374151">Здравствуйте, <b>{salon_name}</b>!</p>
    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.6">
      Задание турнира открыто. Войдите в личный кабинет, чтобы увидеть задание и загрузить свою работу.
    </p>
    <div style="background:#eef2ff;border-radius:10px;padding:16px 20px;margin-bottom:20px">
      <div style="font-size:13px;color:#4338ca;font-weight:700;margin-bottom:6px">Срок подачи работ</div>
      <div style="font-size:15px;color:#1e1b4b;font-weight:700">
        {tournament.get('work_deadline','').strftime('%d.%m.%Y %H:%M') if tournament.get('work_deadline') else 'Уточняется'}
      </div>
    </div>
    <a href="{SITE_URL}/cabinet" style="display:inline-block;padding:14px 32px;background:#6366f1;color:#fff;text-decoration:none;border-radius:10px;font-size:15px;font-weight:700">
      Открыть задание →
    </a>
  </td></tr>
  <tr><td style="padding:16px 32px;border-top:1px solid #f1f5f9">
    <p style="margin:0;font-size:12px;color:#9ca3af">Промт Диалог · Чемпионат красоты</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>"""
    send_email_html(to_email, f"🏆 Задание открыто — {tournament['name']}", html)


# ── Старт голосования ─────────────────────────────────────────────────────────

def do_start_voting() -> dict:
    """Переводит турнир в статус 'voting' когда наступает voting_starts."""
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"""SELECT * FROM {tbl('ch_tournaments')}
            WHERE status = 'active'
              AND voting_starts IS NOT NULL
              AND voting_starts <= NOW()""",
    )
    tournaments = cur.fetchall()
    started = []
    for t in tournaments:
        cur.execute(
            f"UPDATE {tbl('ch_tournaments')} SET status='voting', updated_at=NOW() WHERE id=%s",
            (t["id"],)
        )
        started.append({"tournament_id": t["id"], "name": t["name"]})
    conn.commit()
    return {"started_voting": started}


# ── Закрытие голосования ──────────────────────────────────────────────────────

def do_close_voting() -> dict:
    """Переводит турнир в статус 'finished_pending' для ручного подведения итогов."""
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"""SELECT * FROM {tbl('ch_tournaments')}
            WHERE status = 'voting'
              AND voting_ends IS NOT NULL
              AND voting_ends <= NOW()""",
    )
    tournaments = cur.fetchall()
    closed = []
    for t in tournaments:
        cur.execute(
            f"UPDATE {tbl('ch_tournaments')} SET status='finished_pending', updated_at=NOW() WHERE id=%s",
            (t["id"],)
        )
        closed.append({"tournament_id": t["id"], "name": t["name"]})
    conn.commit()
    return {"closed_voting": closed}


# ── Уведомления о новых турнирах ──────────────────────────────────────────────

def do_notify_salons() -> dict:
    """
    Рассылает email о новых анонсированных турнирах всем активным салонам.
    Не рассылает дважды — использует флаг announced_notified.
    """
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    cur.execute(
        f"""SELECT * FROM {tbl('ch_tournaments')}
            WHERE status = 'announced'
              AND announced_notified = FALSE
            ORDER BY created_at DESC LIMIT 5"""
    )
    tournaments = cur.fetchall()
    if not tournaments:
        return {"notified": 0}

    cur.execute(
        f"""SELECT DISTINCT u.email, sl.name as salon_name
            FROM {tbl('lk_users')} u
            JOIN {tbl('salons')} sl ON sl.id = u.salon_id
            WHERE u.email IS NOT NULL AND u.email != ''
              AND u.is_active = TRUE
              AND u.salon_id IS NOT NULL"""
    )
    recipients = cur.fetchall()

    sent_total = 0
    for t in tournaments:
        for recipient in recipients:
            try:
                _send_announce_email(recipient["email"], recipient["salon_name"], t)
                sent_total += 1
            except Exception as e:
                print(f"[cron] announce email error {recipient['email']}: {e}")

        cur.execute(
            f"UPDATE {tbl('ch_tournaments')} SET announced_notified=TRUE WHERE id=%s",
            (t["id"],)
        )

    conn.commit()
    return {"notified": sent_total, "tournaments": len(tournaments)}


def _send_announce_email(to_email: str, salon_name: str, tournament: dict):
    reg_start = tournament.get("registration_starts")
    reg_end = tournament.get("registration_ends")
    reg_str = ""
    if reg_start:
        reg_str = f"Регистрация: с {reg_start.strftime('%d.%m.%Y')} по {reg_end.strftime('%d.%m.%Y') if reg_end else '...'}"

    html = f"""<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:16px;overflow:hidden">
  <tr><td style="background:linear-gradient(135deg,#0f172a,#1e3a5f);padding:28px 32px">
    <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:2px;color:rgba(255,255,255,0.4);text-transform:uppercase">Промт Диалог · Чемпионат красоты</p>
    <h1 style="margin:0;color:#fff;font-size:24px;font-weight:800">{tournament.get('emoji','🏆')} {tournament['name']}</h1>
    <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:14px">Новый турнир объявлен!</p>
  </td></tr>
  <tr><td style="padding:28px 32px">
    <p style="margin:0 0 16px;font-size:15px;color:#374151">Здравствуйте, <b>{salon_name}</b>!</p>
    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7">{tournament.get('description','')}</p>
    {'<div style="background:#eef2ff;border-radius:10px;padding:16px 20px;margin-bottom:20px"><div style="font-size:13px;color:#4338ca;font-weight:700;margin-bottom:4px">📅 Сроки</div><div style="font-size:14px;color:#374151">' + reg_str + '</div></div>' if reg_str else ''}
    <div style="background:#f0fdf4;border-radius:10px;padding:16px 20px;margin-bottom:24px">
      <div style="font-size:13px;color:#065f46;font-weight:700;margin-bottom:4px">🏅 Призовой фонд</div>
      <div style="font-size:18px;color:#064e3b;font-weight:800">{tournament.get('prize_energy', 0)} ⚡ энергии</div>
    </div>
    <a href="{SITE_URL}/championship" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;text-decoration:none;border-radius:10px;font-size:15px;font-weight:700">
      Подать заявку →
    </a>
  </td></tr>
  <tr><td style="padding:16px 32px;border-top:1px solid #f1f5f9">
    <p style="margin:0;font-size:12px;color:#9ca3af">Промт Диалог · Чемпионат красоты · <a href="{SITE_URL}/championship" style="color:#6366f1">promtdialog.ru</a></p>
  </td></tr>
</table>
</td></tr></table>
</body></html>"""
    send_email_html(to_email, f"{tournament.get('emoji','🏆')} Новый турнир — {tournament['name']}", html)