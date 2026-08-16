"""
Автоматика чемпионата — вызывается по расписанию (cron) или вручную из админки.
GET  ?action=run               — запускает все проверки (cron trigger)
GET  ?action=open_registration — переводит announced → registration когда наступает registration_starts
GET  ?action=check_min         — проверка минимума участников за 3 дня до старта
GET  ?action=close_registration — закрывает регистрацию (registration → registration_closed) когда наступает registration_ends
GET  ?action=open_tasks        — открывает задание когда наступает task_opens_at
GET  ?action=start_voting      — переводит в статус voting когда наступает voting_starts
GET  ?action=close_voting      — переводит в статус finished_pending когда voting_ends
GET  ?action=auto_finalize     — авто-итоги: расставляет места по голосам, начисляет энергию, письма
GET  ?action=notify            — рассылает уведомления о новых турнирах
"""
import json
import os
import smtplib
import urllib.request
import psycopg2
import psycopg2.extras
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime, timezone, timedelta

S = "t_p84565078_code_expression_proj"
LK_API_URL = "https://functions.poehali.dev/1c0ad024-179b-4644-9621-377174bbeba3"
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

    # Раньше каждый шаг открывал собственное подключение к БД (до 8 подключений за один cron
    # запуск, который выполняется каждые 15 минут) — теперь одно общее подключение на весь запуск.
    conn = get_db()
    try:
        if action in ("run", "notify"):
            results["notify"] = do_notify_salons(conn)
        if action in ("run", "open_registration"):
            results["open_registration"] = do_open_registration(conn)
        if action in ("run", "check_min"):
            results["check_min"] = do_check_min_participants(conn)
        if action in ("run", "close_registration"):
            results["close_registration"] = do_close_registration(conn)
        if action in ("run", "open_tasks"):
            results["open_tasks"] = do_open_tasks(conn)
        if action in ("run", "start_voting"):
            results["start_voting"] = do_start_voting(conn)
        if action in ("run", "close_voting"):
            results["close_voting"] = do_close_voting(conn)
        if action in ("run", "auto_finalize"):
            results["auto_finalize"] = do_auto_finalize(conn)
    finally:
        conn.close()

    return ok({"ok": True, "results": results, "ran_at": now().isoformat()})


# ── Открытие регистрации ──────────────────────────────────────────────────────

def do_open_registration(conn) -> dict:
    """Переводит турниры announced → registration когда наступает registration_starts."""
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"""SELECT * FROM {tbl('ch_tournaments')}
            WHERE status = 'announced'
              AND registration_starts IS NOT NULL
              AND registration_starts <= NOW()""",
    )
    tournaments = cur.fetchall()
    opened = []
    for t in tournaments:
        cur.execute(
            f"UPDATE {tbl('ch_tournaments')} SET status='registration', updated_at=NOW() WHERE id=%s",
            (t["id"],)
        )
        opened.append({"tournament_id": t["id"], "name": t["name"]})
    conn.commit()
    return {"opened_registration": opened}


# ── Проверка минимума участников ─────────────────────────────────────────────

def do_check_min_participants(conn) -> dict:
    """
    После окончания регистрации (registration_ends) проверяет набран ли минимум участников.
    Если нет — переводит в postponed, ставит next_date и рассылает уведомление.
    Проверяет только турниры у которых регистрация уже завершилась, а задание ещё не открылось.
    """
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    cur.execute(
        f"""SELECT t.* FROM {tbl('ch_tournaments')} t
            WHERE t.status IN ('announced','registration','registration_closed')
              AND t.task_opens_at IS NOT NULL
              AND t.task_opens_at > NOW()
              AND t.registration_ends IS NOT NULL
              AND t.registration_ends <= NOW()
              AND t.postponed = FALSE""",
    )
    tournaments = cur.fetchall()
    postponed = []

    for t in tournaments:
        # Считаем одобренные и ожидающие заявки
        cur.execute(
            f"SELECT COUNT(*) as cnt FROM {tbl('ch_applications')} WHERE tournament_id=%s AND status IN ('approved','pending')",
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


# ── Закрытие регистрации ──────────────────────────────────────────────────────

def do_close_registration(conn) -> dict:
    """Переводит турниры registration → registration_closed когда наступает registration_ends."""
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"""SELECT * FROM {tbl('ch_tournaments')}
            WHERE status = 'registration'
              AND registration_ends IS NOT NULL
              AND registration_ends <= NOW()""",
    )
    tournaments = cur.fetchall()
    closed = []
    for t in tournaments:
        cur.execute(
            f"UPDATE {tbl('ch_tournaments')} SET status='registration_closed', updated_at=NOW() WHERE id=%s",
            (t["id"],)
        )
        closed.append({"tournament_id": t["id"], "name": t["name"]})
    conn.commit()
    return {"closed_registration": closed}


# ── Открытие задания ──────────────────────────────────────────────────────────

def do_open_tasks(conn) -> dict:
    """Переводит турниры в статус 'active' когда наступает task_opens_at."""
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"""SELECT * FROM {tbl('ch_tournaments')}
            WHERE status IN ('registration', 'registration_closed')
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

def do_start_voting(conn) -> dict:
    """Переводит турнир в статус 'voting' когда наступает voting_starts и рассылает письма участникам."""
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
        # Рассылаем письма только тем участникам, у кого реально есть опубликованная работа
        # (игнорируем служебные @invited.local адреса приглашённых мастеров)
        cur.execute(
            f"""SELECT DISTINCT ON (a.salon_id)
                   COALESCE(NULLIF(u.notification_email,''), u.email) as email,
                   sl.name as salon_name, w.id as work_id
                FROM {tbl('ch_applications')} a
                JOIN {tbl('lk_users')} u ON u.salon_id = a.salon_id AND u.is_active = TRUE
                JOIN {tbl('salons')} sl ON sl.id = a.salon_id
                JOIN {tbl('ch_works')} w ON w.tournament_id = a.tournament_id AND w.salon_id = a.salon_id AND w.is_public = TRUE
                WHERE a.tournament_id = %s AND a.status = 'approved'
                  AND COALESCE(NULLIF(u.notification_email,''), u.email) NOT LIKE '%%@invited.local'
                ORDER BY a.salon_id, u.is_admin DESC, u.id ASC""",
            (t["id"],)
        )
        recipients = cur.fetchall()
        sent = 0
        for r in recipients:
            try:
                _send_voting_started_email(r["email"], r["salon_name"], t)
                sent += 1
            except Exception as e:
                print(f"[cron] voting_started email error {r['email']}: {e}")
        started.append({"tournament_id": t["id"], "name": t["name"], "emails_sent": sent})
    conn.commit()
    return {"started_voting": started}


def _send_voting_started_email(to_email: str, salon_name: str, tournament: dict):
    slug = tournament.get("slug", "")
    vote_url = f"{SITE_URL}/championship/tournament/{slug}"
    html = f"""<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:16px;overflow:hidden">
  <tr><td style="background:linear-gradient(135deg,#0f172a,#1e3a5f);padding:28px 32px">
    <div style="font-size:40px;margin-bottom:10px">🗳</div>
    <h2 style="margin:0;color:#fff;font-size:22px;font-weight:900">Голосование началось!</h2>
    <p style="margin:6px 0 0;color:rgba(255,255,255,0.75);font-size:15px">{tournament['name']}</p>
  </td></tr>
  <tr><td style="padding:28px 32px">
    <p style="margin:0 0 16px;font-size:15px;color:#374151">Здравствуйте, <b>{salon_name}</b>!</p>
    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7">
      Ваша работа участвует в голосовании турнира <b>«{tournament['name']}»</b>.<br>
      Сейчас самое важное — собрать как можно больше голосов!
    </p>

    <div style="background:#f0f9ff;border-radius:12px;padding:18px 20px;margin-bottom:20px;border-left:4px solid #0ea5e9">
      <div style="font-size:13px;font-weight:800;color:#0369a1;margin-bottom:10px">💡 КАК ПОЛУЧИТЬ БОЛЬШЕ ГОЛОСОВ</div>
      <div style="font-size:13px;color:#374151;line-height:2">
        ✅ Разошлите ссылку клиентам в WhatsApp и Telegram<br>
        ✅ Опубликуйте в соцсетях — ВКонтакте, сторис<br>
        ✅ Попросите коллег и друзей поддержать<br>
        ✅ Добавьте ссылку в bio профиля<br>
        ✅ Напомните клиентам при следующем визите
      </div>
    </div>

    <div style="background:#fafafa;border-radius:10px;padding:14px 16px;margin-bottom:22px;font-size:13px;color:#64748b;line-height:1.6">
      <b style="color:#0f172a">Почему это важно?</b><br>
      Голосование — это отличный повод напомнить о себе клиентам, показать своё мастерство
      и создать «сарафанное радио»: ваши клиенты попросят проголосовать своих знакомых,
      а те узнают о вашем салоне.
    </div>

    <a href="{vote_url}" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;text-decoration:none;border-radius:10px;font-size:15px;font-weight:700;margin-bottom:12px">
      Открыть страницу голосования →
    </a>
    <br>
    <a href="{SITE_URL}/cabinet" style="display:inline-block;padding:11px 24px;background:transparent;color:#6366f1;text-decoration:none;border-radius:10px;font-size:14px;font-weight:600;border:1.5px solid #c7d2fe">
      Скопировать ссылку в ЛК →
    </a>
  </td></tr>
  <tr><td style="padding:16px 32px;border-top:1px solid #f1f5f9">
    <p style="margin:0;font-size:12px;color:#9ca3af">
      Голосование до: {tournament.get('voting_ends','').strftime('%d.%m.%Y %H:%M') if tournament.get('voting_ends') else 'см. сайт'} (МСК)<br>
      Промт Диалог · Чемпионат красоты
    </p>
  </td></tr>
</table>
</td></tr></table>
</body></html>"""
    send_email_html(to_email, f"🗳 Голосование началось — поделитесь ссылкой! «{tournament['name']}»", html)


# ── Закрытие голосования ──────────────────────────────────────────────────────

def do_close_voting(conn) -> dict:
    """Переводит турнир в статус 'finished_pending' для ручного подведения итогов."""
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


# ── Авто-финализация турниров ─────────────────────────────────────────────────

def do_auto_finalize(conn) -> dict:
    """
    Для турниров в статусе finished_pending:
    - расставляет места по количеству голосов
    - публикует итоговые места в ch_works
    - начисляет энергию победителям через lk-api
    - отправляет письма с поздравлением
    - переводит турнир в finished
    """

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    cur.execute(
        f"""SELECT * FROM {tbl('ch_tournaments')}
            WHERE status = 'finished_pending'
              AND voting_ends IS NOT NULL
              AND voting_ends <= NOW()"""
    )
    tournaments = cur.fetchall()
    finalized = []

    for t in tournaments:
        tid = t["id"]

        # Работы, одобренные к голосованию — сортируем по сумме голосов (score учитывает вес голоса)
        cur.execute(
            f"""SELECT w.id, w.salon_id,
                   (SELECT COALESCE(SUM(v.score),0) FROM {tbl('ch_votes')} v WHERE v.work_id = w.id) as votes
                FROM {tbl('ch_works')} w
                WHERE w.tournament_id = %s AND w.is_public = TRUE
                ORDER BY votes DESC, w.created_at ASC""",
            (tid,)
        )
        works = cur.fetchall()

        for place, w in enumerate(works, start=1):
            cur.execute(
                f"UPDATE {tbl('ch_works')} SET final_place=%s, updated_at=NOW() WHERE id=%s",
                (place, w["id"])
            )

            # Энергия за место
            if place == 1:
                energy = t["prize_energy"]
            elif place == 2:
                energy = t.get("prize_2nd") or 0
            elif place == 3:
                energy = t.get("prize_3rd") or 0
            else:
                energy = 0

            if energy > 0:
                # Выбираем получателя с реальным email: сначала админ/владелец салона
                # с нормальной почтой, игнорируя служебные @invited.local адреса
                cur.execute(
                    f"""SELECT id, COALESCE(NULLIF(notification_email,''), email) as email
                        FROM {tbl('lk_users')}
                        WHERE salon_id=%s AND is_active=TRUE
                          AND COALESCE(NULLIF(notification_email,''), email) NOT LIKE '%%@invited.local'
                        ORDER BY is_admin DESC, id ASC LIMIT 1""",
                    (w["salon_id"],)
                )
                u = cur.fetchone()
                if u:
                    try:
                        # Начисляем энергию напрямую в БД (у cron есть прямой доступ)
                        cur.execute(
                            f"UPDATE {tbl('salons')} SET credits_balance = credits_balance + %s WHERE id=%s",
                            (energy, w["salon_id"])
                        )
                        cur.execute(
                            f"""INSERT INTO {tbl('credit_transactions')} (salon_id, user_id, action, amount, tool_key, type)
                                VALUES (%s,%s,%s,%s,NULL,'credit')""",
                            (w["salon_id"], u["id"], f"Приз за {place} место в турнире «{t['name']}»", energy)
                        )
                    except Exception as e:
                        print(f"[cron] energy charge error salon {w['salon_id']}: {e}")

                    # Письмо победителю
                    if u.get("email"):
                        cur.execute(
                            f"SELECT name FROM {tbl('salons')} WHERE id=%s", (w["salon_id"],)
                        )
                        salon_row = cur.fetchone()
                        salon_name = salon_row["name"] if salon_row else "Ваш салон"
                        try:
                            _send_winner_email(u["email"], salon_name, t, place, energy)
                        except Exception as e:
                            print(f"[cron] winner email error {u['email']}: {e}")

            # Обновляем счётчики побед / топ-3 для рейтинга
            is_win = 1 if place == 1 else 0
            is_top3 = 1 if place <= 3 else 0
            if is_win or is_top3:
                cur.execute(
                    f"""INSERT INTO {tbl('ch_ratings')} (salon_id, wins, top3_count, participations)
                        VALUES (%s,%s,%s,0)
                        ON CONFLICT (salon_id) DO UPDATE SET
                        wins = {tbl('ch_ratings')}.wins + %s,
                        top3_count = {tbl('ch_ratings')}.top3_count + %s,
                        updated_at = NOW()""",
                    (w["salon_id"], is_win, is_top3, is_win, is_top3)
                )

        # Очки рейтинга — только участникам, которые реально сдали работу (is_public=TRUE)
        pts_participation = 20
        cur.execute(
            f"""SELECT DISTINCT a.salon_id
                FROM {tbl('ch_applications')} a
                WHERE a.tournament_id=%s AND a.status='approved'
                  AND EXISTS (
                      SELECT 1 FROM {tbl('ch_works')} w
                      WHERE w.tournament_id = a.tournament_id
                        AND w.salon_id = a.salon_id
                        AND w.is_public = TRUE
                  )""",
            (tid,)
        )
        for row in cur.fetchall():
            cur.execute(
                f"""INSERT INTO {tbl('ch_ratings')} (salon_id, total_points, season_points, participations)
                    VALUES (%s,%s,%s,1)
                    ON CONFLICT (salon_id) DO UPDATE SET
                    total_points = {tbl('ch_ratings')}.total_points + {pts_participation},
                    season_points = {tbl('ch_ratings')}.season_points + {pts_participation},
                    participations = {tbl('ch_ratings')}.participations + 1,
                    updated_at = NOW()""",
                (row["salon_id"], pts_participation, pts_participation)
            )

        cur.execute(
            f"UPDATE {tbl('ch_tournaments')} SET status='finished', updated_at=NOW() WHERE id=%s",
            (tid,)
        )
        finalized.append({"tournament_id": tid, "name": t["name"], "works_ranked": len(works)})

    conn.commit()
    return {"finalized": finalized}


def _send_winner_email(to_email: str, salon_name: str, tournament: dict, place: int, energy: int):
    place_emoji = {1: "🥇", 2: "🥈", 3: "🥉"}.get(place, "🏅")
    place_label = {1: "1-е место", 2: "2-е место", 3: "3-е место"}.get(place, f"{place}-е место")
    html = f"""<!DOCTYPE html>
<html><head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:Arial,sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:16px;overflow:hidden">
  <tr><td style="background:linear-gradient(135deg,#0f172a,#1e3a5f);padding:32px">
    <div style="font-size:48px;text-align:center;margin-bottom:12px">{place_emoji}</div>
    <h1 style="margin:0;color:#fff;font-size:24px;font-weight:900;text-align:center">Поздравляем!</h1>
    <p style="margin:8px 0 0;color:rgba(255,255,255,0.7);font-size:14px;text-align:center">
      {tournament['name']}
    </p>
  </td></tr>
  <tr><td style="padding:28px 32px">
    <p style="margin:0 0 16px;font-size:15px;color:#374151">Здравствуйте, <b>{salon_name}</b>!</p>
    <p style="margin:0 0 20px;font-size:15px;color:#374151;line-height:1.7">
      Вы заняли <b>{place_label}</b> в турнире «{tournament['name']}».<br>
      Спасибо всем, кто голосовал за вашу работу!
    </p>
    <div style="background:linear-gradient(135deg,#ecfdf5,#d1fae5);border-radius:12px;padding:20px;margin-bottom:24px;text-align:center">
      <div style="font-size:13px;color:#065f46;font-weight:700;margin-bottom:6px">ПРИЗ НАЧИСЛЕН НА БАЛАНС</div>
      <div style="font-size:32px;font-weight:900;color:#059669">{energy} ⚡</div>
      <div style="font-size:13px;color:#064e3b;margin-top:4px">энергии</div>
    </div>
    <a href="{SITE_URL}/cabinet" style="display:inline-block;padding:14px 32px;background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;text-decoration:none;border-radius:10px;font-size:15px;font-weight:700">
      Открыть личный кабинет →
    </a>
  </td></tr>
  <tr><td style="padding:16px 32px;border-top:1px solid #f1f5f9">
    <p style="margin:0;font-size:12px;color:#9ca3af">Промт Диалог · Чемпионат красоты</p>
  </td></tr>
</table>
</td></tr></table>
</body></html>"""
    send_email_html(to_email, f"{place_emoji} Вы заняли {place_label} в турнире «{tournament['name']}»!", html)


# ── Уведомления о новых турнирах ──────────────────────────────────────────────

def do_notify_salons(conn) -> dict:
    """
    Рассылает email о новых анонсированных турнирах всем активным салонам.
    Не рассылает дважды — использует флаг announced_notified.
    """
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