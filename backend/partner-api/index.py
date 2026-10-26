"""Партнёрский кабинет «Промт Диалог»: регистрация и вход партнёров, профиль, предложения услуг,
подтверждение размещения о платформе (автопроверка страницы), статистика и модерация для администратора.
Партнёр входит по X-Session-Id из таблицы partner_sessions, администратор — по обычной сессии кабинета (lk_sessions).
Показы партнёра включаются после одного подтверждённого размещения о платформе и далее не ограничены по сроку."""
import json
import os
import re
import secrets
import hashlib
import smtplib
import socket
import ipaddress
import urllib.request
import urllib.error
import urllib.parse
from datetime import datetime, timedelta, timezone
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

import bcrypt
import psycopg2
import psycopg2.extras

S = "t_p84565078_code_expression_proj"
FROM_EMAIL = "massopro@mail.ru"
ADMIN_EMAIL = "webmanager5@yandex.ru"
SITE_URL = "https://promtdialog.ru"
DOCS_VERSION = "2026-10-27"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
    "Access-Control-Max-Age": "86400",
}

SEGMENTS = {
    "salon_owner": "Владельцы салонов красоты",
    "master": "Частные мастера индустрии красоты",
    "massage": "Массажисты и специалисты по телу",
    "psychologist": "Психологи и консультанты",
    "other_specialist": "Другие специалисты, работающие с клиентами",
}
FORMATS = {"online": "Онлайн", "offline": "Офлайн", "both": "Онлайн и офлайн"}

OFFER_FIELDS = {
    "title": ("Название услуги", 150, True),
    "description": ("Описание услуги", 2000, True),
    "customer_needs": ("Задачи клиента", 1200, True),
    "expected_result": ("Ожидаемый результат", 1000, True),
    "service_format": ("Формат работы", 200, True),
    "geography": ("География", 200, True),
    "price": ("Цена и условия", 500, True),
    "limitations": ("Ограничения", 1000, True),
    "qualification": ("Опыт и квалификация", 1000, False),
    "booking_terms": ("Условия записи", 500, False),
}


def tbl(n):
    return f"{S}.{n}"


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def ok(data, status=200):
    return {"statusCode": status, "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps(data, ensure_ascii=False, default=str)}


def err(msg, status=400):
    return {"statusCode": status, "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps({"error": msg}, ensure_ascii=False)}


def now():
    return datetime.now(timezone.utc)


def clean(v, limit):
    v = re.sub(r"[\x00-\x08\x0b\x0c\x0e-\x1f]", "", str(v or "")).strip()
    return v[:limit]


def send_mail(to: str, subject: str, html: str) -> None:
    """Отправка письма через SMTP Mail.ru. Сбой почты не должен ломать основную операцию."""
    pw = os.environ.get("SMTP_PASSWORD", "")
    if not pw or not to:
        return
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = subject
        msg["From"] = FROM_EMAIL
        msg["To"] = to
        msg.attach(MIMEText(html, "html", "utf-8"))
        with smtplib.SMTP_SSL("smtp.mail.ru", 465, timeout=6) as s:
            s.login(FROM_EMAIL, pw)
            s.sendmail(FROM_EMAIL, to, msg.as_string())
    except Exception as e:
        print(f"[mail] {to}: {e}")


def mail_html(title: str, text: str, btn: str = "", link: str = "") -> str:
    b = (f'<p><a href="{link}" style="display:inline-block;background:#14B8A6;color:#0F172A;padding:12px 22px;'
         f'border-radius:6px;text-decoration:none;font-weight:700">{btn}</a></p>') if link else ""
    return (f'<div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#0F172A">'
            f'<h2 style="margin:0 0 12px">{title}</h2><p style="line-height:1.6;white-space:pre-line">{text}</p>{b}'
            f'<p style="color:#64748B;font-size:12px">Промт Диалог · партнёрская программа</p></div>')


def body_of(event) -> dict:
    try:
        return json.loads(event.get("body") or "{}")
    except ValueError:
        return {}


def rows(cur):
    return [dict(r) for r in cur.fetchall()]


def valid_url(url: str):
    """Только http/https, без внутренних адресов. Возвращает (url, ошибка)."""
    url = (url or "").strip()
    if len(url) > 1000:
        return None, "Слишком длинная ссылка"
    p = urllib.parse.urlparse(url)
    if p.scheme not in ("http", "https") or not p.hostname:
        return None, "Ссылка должна начинаться с http:// или https://"
    host = p.hostname.lower()
    if host in ("localhost",) or host.endswith(".local") or host.endswith(".internal"):
        return None, "Эта ссылка не подходит"
    try:
        ipaddress.ip_address(host)
        return None, "Укажите ссылку с названием сайта, а не IP-адрес"
    except ValueError:
        pass
    if "." not in host:
        return None, "Ссылка указана некорректно"
    return url, None


def host_is_public(host: str) -> bool:
    try:
        for info in socket.getaddrinfo(host, None):
            ip = ipaddress.ip_address(info[4][0])
            if ip.is_private or ip.is_loopback or ip.is_link_local or ip.is_reserved or ip.is_multicast:
                return False
        return True
    except Exception:
        return False


class _NoRedirect(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *a, **k):
        return None


def fetch_page(url: str):
    """Безопасно читает страницу (до 3 переходов, без внутренних адресов). Возвращает текст или None."""
    opener = urllib.request.build_opener(_NoRedirect)
    cur_url = url
    for _ in range(4):
        p = urllib.parse.urlparse(cur_url)
        if p.scheme not in ("http", "https") or not p.hostname or not host_is_public(p.hostname):
            return None
        req = urllib.request.Request(cur_url, headers={"User-Agent": "Mozilla/5.0 (compatible; PromtDialogBot/1.0)",
                                                       "Accept": "text/html,*/*", "Accept-Language": "ru"})
        try:
            with opener.open(req, timeout=4) as r:
                raw = r.read(600000)
                charset = r.headers.get_content_charset() or "utf-8"
                return raw.decode(charset, errors="ignore")
        except urllib.error.HTTPError as e:
            if e.code in (301, 302, 303, 307, 308) and e.headers.get("Location"):
                cur_url = urllib.parse.urljoin(cur_url, e.headers["Location"])
                continue
            return None
        except Exception:
            return None
    return None


def check_publication(html: str, ref_code: str):
    """Возвращает (результат, причина): ok / fail / unknown."""
    if html is None:
        return "unknown", "Не удалось открыть страницу автоматически"
    low = html.lower()
    text = re.sub(r"<[^>]+>", " ", low)
    if len(text) < 400:
        return "unknown", "На странице слишком мало текста для автоматической проверки"
    if ref_code.lower() not in low:
        return "fail", "На странице не найдена ваша персональная ссылка на «Промт Диалог»"
    if "промт диалог" not in text and "promtdialog" not in low:
        return "fail", "На странице нет текста о «Промт Диалог» рядом со ссылкой"
    return "ok", ""


def url_key(url: str) -> str:
    p = urllib.parse.urlparse(url.strip())
    return (p.hostname or "").lower().removeprefix("www.") + (p.path or "").rstrip("/").lower() + (("?" + p.query) if p.query else "")


def log(cur, partner_id, action, comment=None, offer_id=None, submission_id=None, actor="admin", actor_id=None):
    cur.execute(
        f"INSERT INTO {tbl('partner_moderation_history')} (partner_id, offer_id, submission_id, action, comment, actor, actor_id) "
        f"VALUES (%s,%s,%s,%s,%s,%s,%s)", (partner_id, offer_id, submission_id, action, comment, actor, actor_id))


# ── Авторизация ─────────────────────────────────────────────────────────────

def get_partner(event, conn):
    sid = (event.get("headers") or {}).get("X-Session-Id", "") or (event.get("headers") or {}).get("x-session-id", "")
    if not sid:
        return None
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT p.* FROM {tbl('partner_sessions')} s JOIN {tbl('partners')} p ON p.id = s.partner_id "
                f"WHERE s.id = %s AND s.expires_at > NOW()", (sid,))
    return cur.fetchone()


def get_admin(event, conn):
    sid = (event.get("headers") or {}).get("X-Session-Id", "") or (event.get("headers") or {}).get("x-session-id", "")
    if not sid:
        return None
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT u.id, u.email FROM {tbl('lk_sessions')} s JOIN {tbl('lk_users')} u ON u.id = s.user_id "
                f"WHERE s.id = %s AND s.expires_at > NOW() AND u.is_active = TRUE AND u.is_admin = TRUE", (sid,))
    return cur.fetchone()


def gen_ref_code(cur) -> str:
    alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
    for _ in range(20):
        code = "PT-" + "".join(secrets.choice(alphabet) for _ in range(6))
        cur.execute(f"SELECT 1 FROM {tbl('partners')} WHERE ref_code=%s", (code,))
        if not cur.fetchone():
            return code
    raise RuntimeError("ref code")


def new_session(cur, partner_id) -> str:
    sid = secrets.token_hex(32)
    cur.execute(f"INSERT INTO {tbl('partner_sessions')} (id, partner_id) VALUES (%s,%s)", (sid, partner_id))
    return sid


def handle_register(event, conn):
    b = body_of(event)
    email = clean(b.get("email"), 255).lower()
    pw = b.get("password") or ""
    name = clean(b.get("business_name"), 255)
    contact = clean(b.get("contact_name"), 255)
    if not name or not contact:
        return err("Укажите название и контактное лицо")
    if "@" not in email or "." not in email:
        return err("Укажите корректный email")
    if len(pw) < 8:
        return err("Пароль должен быть не короче 8 символов")
    if not (b.get("consent_rules") is True and b.get("consent_privacy") is True and b.get("consent_offer") is True):
        return err("Для создания кабинета нужно принять правила, политику конфиденциальности и договор-оферту")
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT 1 FROM {tbl('partners')} WHERE email=%s", (email,))
    if cur.fetchone():
        return err("Партнёр с таким email уже зарегистрирован")
    code = gen_ref_code(cur)
    h = bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()
    ip = ((event.get("requestContext") or {}).get("identity") or {}).get("sourceIp", "")[:64]
    cur.execute(f"INSERT INTO {tbl('partners')} (email, password_hash, business_name, contact_name, ref_code, consent_at, "
                f"consent_rules_at, consent_privacy_at, consent_offer_at, consent_docs_version, consent_ip) "
                f"VALUES (%s,%s,%s,%s,%s,NOW(),NOW(),NOW(),NOW(),%s,%s) RETURNING id",
                (email, h, name, contact, code, DOCS_VERSION, ip))
    pid = cur.fetchone()["id"]
    log(cur, pid, "registered", actor="partner", actor_id=pid)
    sid = new_session(cur, pid)
    conn.commit()
    send_mail(email, "Вы зарегистрированы в партнёрской программе «Промт Диалог»",
              mail_html("Добро пожаловать в партнёрскую программу",
                        "Ваш кабинет готов. Заполните профиль и создайте первое предложение: после проверки модератором оно сможет участвовать в рекомендациях.",
                        "Открыть кабинет", f"{SITE_URL}/partner"))
    send_mail(ADMIN_EMAIL, "Новый партнёр: " + name, mail_html("Новый партнёр", f"{name}\n{contact}\n{email}"))
    return ok({"session": sid})


def handle_login(event, conn):
    b = body_of(event)
    email = clean(b.get("email"), 255).lower()
    pw = b.get("password") or ""
    if not email or not pw:
        return err("Введите email и пароль")
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT * FROM {tbl('partners')} WHERE email=%s", (email,))
    p = cur.fetchone()
    try:
        valid = bool(p) and bcrypt.checkpw(pw.encode(), p["password_hash"].encode())
    except Exception:
        valid = False
    if not valid:
        return err("Неверный email или пароль", 401)
    sid = new_session(cur, p["id"])
    conn.commit()
    return ok({"session": sid})


def handle_password_forgot(event, conn):
    b = body_of(event)
    email = clean(b.get("email"), 255).lower()
    if "@" not in email:
        return err("Укажите email, на который зарегистрирован кабинет")
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT id FROM {tbl('partners')} WHERE email=%s", (email,))
    p = cur.fetchone()
    if p:
        cur.execute(f"SELECT COUNT(*) AS c FROM {tbl('partner_password_resets')} WHERE partner_id=%s AND created_at > NOW() - INTERVAL '1 hour'", (p["id"],))
        if cur.fetchone()["c"] < 3:
            token = secrets.token_urlsafe(32)
            th = hashlib.sha256(token.encode()).hexdigest()
            cur.execute(f"INSERT INTO {tbl('partner_password_resets')} (partner_id, token_hash, expires_at) VALUES (%s,%s,NOW() + INTERVAL '1 hour')", (p["id"], th))
            log(cur, p["id"], "password_reset_requested", actor="partner", actor_id=p["id"])
            conn.commit()
            send_mail(email, "Восстановление пароля в партнёрском кабинете",
                      mail_html("Восстановление пароля",
                                "Чтобы задать новый пароль, нажмите на кнопку. Ссылка действует 1 час. Если вы не запрашивали восстановление, просто проигнорируйте письмо.",
                                "Задать новый пароль", f"{SITE_URL}/partner?reset={token}"))
    return ok({"ok": True})


def handle_password_reset(event, conn):
    b = body_of(event)
    token = clean(b.get("token"), 200)
    pw = b.get("password") or ""
    if len(pw) < 8:
        return err("Пароль должен быть не короче 8 символов")
    th = hashlib.sha256(token.encode()).hexdigest()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT id, partner_id FROM {tbl('partner_password_resets')} WHERE token_hash=%s AND used_at IS NULL AND expires_at > NOW() FOR UPDATE", (th,))
    r = cur.fetchone()
    if not r:
        return err("Ссылка недействительна или устарела. Запросите восстановление ещё раз", 400)
    h = bcrypt.hashpw(pw.encode(), bcrypt.gensalt()).decode()
    cur.execute(f"UPDATE {tbl('partners')} SET password_hash=%s, updated_at=NOW() WHERE id=%s", (h, r["partner_id"]))
    cur.execute(f"UPDATE {tbl('partner_password_resets')} SET used_at=NOW() WHERE partner_id=%s AND used_at IS NULL", (r["partner_id"],))
    cur.execute(f"UPDATE {tbl('partner_sessions')} SET expires_at=NOW() WHERE partner_id=%s AND expires_at > NOW()", (r["partner_id"],))
    log(cur, r["partner_id"], "password_reset_done", actor="partner", actor_id=r["partner_id"])
    sid = new_session(cur, r["partner_id"])
    conn.commit()
    return ok({"session": sid})


def handle_password_change(event, conn):
    p = get_partner(event, conn)
    if not p:
        return err("Не авторизован", 401)
    b = body_of(event)
    old = b.get("old_password") or ""
    new = b.get("new_password") or ""
    if len(new) < 8:
        return err("Новый пароль должен быть не короче 8 символов")
    try:
        valid = bcrypt.checkpw(old.encode(), p["password_hash"].encode())
    except Exception:
        valid = False
    if not valid:
        return err("Текущий пароль указан неверно", 403)
    h = bcrypt.hashpw(new.encode(), bcrypt.gensalt()).decode()
    cur = conn.cursor()
    cur.execute(f"UPDATE {tbl('partners')} SET password_hash=%s, updated_at=NOW() WHERE id=%s", (h, p["id"]))
    sid = (event.get("headers") or {}).get("X-Session-Id", "") or (event.get("headers") or {}).get("x-session-id", "")
    cur.execute(f"UPDATE {tbl('partner_sessions')} SET expires_at=NOW() WHERE partner_id=%s AND id<>%s AND expires_at > NOW()", (p["id"], sid))
    conn.commit()
    return ok({"ok": True})


def handle_logout(event, conn):
    sid = (event.get("headers") or {}).get("X-Session-Id", "")
    if sid:
        cur = conn.cursor()
        cur.execute(f"UPDATE {tbl('partner_sessions')} SET expires_at = NOW() WHERE id=%s", (sid,))
        conn.commit()
    return ok({"ok": True})


# ── Сроки и показы ──────────────────────────────────────────────────────────

def obligation(cur, p) -> dict:
    cur.execute(f"SELECT COUNT(*) FILTER (WHERE status='accepted') AS acc, COUNT(*) FILTER (WHERE status='pending') AS pend "
                f"FROM {tbl('partner_submissions')} WHERE partner_id=%s", (p["id"],))
    r = cur.fetchone()
    if p["status"] == "suspended":
        state = "blocked"
    elif r["acc"] > 0:
        state = "done"
    elif r["pend"] > 0:
        state = "awaiting_review"
    else:
        state = "required"
    return {"state": state, "pending_submission": r["pend"] > 0, "shows_allowed": state == "done"}


def partner_public(p) -> dict:
    keys = ("id", "email", "business_name", "contact_name", "website", "description", "specializations",
            "audience_segments", "geography", "work_format", "phone", "status", "ref_code", "created_at")
    return {k: p[k] for k in keys}


def handle_me(event, conn):
    p = get_partner(event, conn)
    if not p:
        return err("Не авторизован", 401)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT status, COUNT(*) AS c FROM {tbl('partner_offers')} WHERE partner_id=%s GROUP BY status", (p["id"],))
    counts = {r["status"]: r["c"] for r in cur.fetchall()}
    cur.execute(f"SELECT COUNT(*) AS c FROM {tbl('lk_users')} WHERE referred_by_partner=%s", (p["id"],))
    registrations = cur.fetchone()["c"]
    cur.execute(f"SELECT COUNT(*) FILTER (WHERE event_type='partner_recommendation_shown') AS shown, "
                f"COUNT(*) FILTER (WHERE event_type='partner_offer_clicked') AS clicked "
                f"FROM {tbl('partner_analytics_events')} WHERE partner_id=%s", (p["id"],))
    ev = cur.fetchone()
    shown, clicked = ev["shown"], ev["clicked"]
    cur.execute(f"SELECT action, comment, created_at FROM {tbl('partner_moderation_history')} "
                f"WHERE partner_id=%s AND actor='admin' ORDER BY id DESC LIMIT 5", (p["id"],))
    notes = rows(cur)
    return ok({
        "partner": partner_public(p),
        "obligation": obligation(cur, p),
        "offers_total": sum(counts.values()),
        "offers_counts": counts,
        "stats": {"shown": shown, "clicked": clicked, "ctr": round(clicked * 100 / shown, 1) if shown else 0,
                  "registrations": registrations},
        "ref_link": f"{SITE_URL}/?ref={p['ref_code']}",
        "notifications": notes,
    })


def handle_profile_save(event, conn):
    p = get_partner(event, conn)
    if not p:
        return err("Не авторизован", 401)
    b = body_of(event)
    name = clean(b.get("business_name"), 255)
    contact = clean(b.get("contact_name"), 255)
    if not name or not contact:
        return err("Укажите название и контактное лицо")
    website = clean(b.get("website"), 500)
    if website:
        website, e = valid_url(website)
        if e:
            return err("Сайт: " + e)
    segs = [x for x in (b.get("audience_segments") or []) if x in SEGMENTS]
    fmt = b.get("work_format") if b.get("work_format") in FORMATS else ""
    cur = conn.cursor()
    cur.execute(
        f"UPDATE {tbl('partners')} SET business_name=%s, contact_name=%s, website=%s, description=%s, specializations=%s, "
        f"audience_segments=%s, geography=%s, work_format=%s, phone=%s, updated_at=NOW() WHERE id=%s",
        (name, contact, website or "", clean(b.get("description"), 1500), clean(b.get("specializations"), 500),
         json.dumps(segs), clean(b.get("geography"), 255), fmt, clean(b.get("phone"), 100), p["id"]))
    conn.commit()
    return ok({"ok": True})


# ── Предложения ─────────────────────────────────────────────────────────────

EDITABLE = ("draft", "rejected", "changes_requested", "approved")


def offer_row(o, with_data=True) -> dict:
    d = {k: o[k] for k in ("id", "title", "status", "last_admin_comment", "created_at", "updated_at", "approved_at",
                           "approved_version_id", "pending_version_id")}
    if with_data:
        d["data"] = o["data"]
    return d


def parse_offer(b):
    """Проверка и очистка полей предложения. Возвращает (data, errors)."""
    data, errors = {}, []
    for key, (label, limit, required) in OFFER_FIELDS.items():
        v = clean(b.get(key), limit)
        data[key] = v
        if required and len(v) < 3:
            errors.append(f"Заполните поле «{label}»")
    segs = [x for x in (b.get("audience_segments") or []) if x in SEGMENTS]
    data["audience_segments"] = segs
    if not segs:
        errors.append("Выберите, для кого предложение")
    url, e = valid_url(b.get("destination_url"))
    data["destination_url"] = url or clean(b.get("destination_url"), 1000)
    if e:
        errors.append("Ссылка на страницу услуги: " + e)
    if len(data.get("description", "")) < 40 and data.get("description"):
        errors.append("Опишите услугу подробнее: что входит и как проходит (минимум 40 знаков)")
    return data, errors


def handle_offers_list(event, conn):
    p = get_partner(event, conn)
    if not p:
        return err("Не авторизован", 401)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT * FROM {tbl('partner_offers')} WHERE partner_id=%s ORDER BY updated_at DESC", (p["id"],))
    return ok({"offers": [offer_row(o, False) for o in cur.fetchall()]})


def handle_offer_get(event, conn):
    p = get_partner(event, conn)
    if not p:
        return err("Не авторизован", 401)
    oid = int((event.get("queryStringParameters") or {}).get("id") or 0)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT * FROM {tbl('partner_offers')} WHERE id=%s AND partner_id=%s", (oid, p["id"]))
    o = cur.fetchone()
    if not o:
        return err("Предложение не найдено", 404)
    cur.execute(f"SELECT version_no, status, admin_comment, created_at, reviewed_at FROM {tbl('partner_offer_versions')} "
                f"WHERE offer_id=%s ORDER BY id DESC", (oid,))
    return ok({"offer": offer_row(o), "versions": rows(cur)})


def handle_offer_save(event, conn):
    p = get_partner(event, conn)
    if not p:
        return err("Не авторизован", 401)
    b = body_of(event)
    data = {}
    for key, (label, limit, _) in OFFER_FIELDS.items():
        data[key] = clean(b.get(key), limit)
    data["audience_segments"] = [x for x in (b.get("audience_segments") or []) if x in SEGMENTS]
    data["destination_url"] = clean(b.get("destination_url"), 1000)
    title = data["title"] or "Без названия"
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    oid = int(b.get("id") or 0)
    if oid:
        cur.execute(f"SELECT * FROM {tbl('partner_offers')} WHERE id=%s AND partner_id=%s", (oid, p["id"]))
        o = cur.fetchone()
        if not o:
            return err("Предложение не найдено", 404)
        if o["status"] not in EDITABLE:
            return err("Предложение нельзя изменить в текущем статусе")
        if o["pending_version_id"]:
            return err("Правки уже на проверке. Дождитесь решения модератора")
        cur.execute(f"UPDATE {tbl('partner_offers')} SET data=%s, title=%s, updated_at=NOW() WHERE id=%s",
                    (json.dumps(data), title, oid))
    else:
        cur.execute(f"SELECT COUNT(*) AS c FROM {tbl('partner_offers')} WHERE partner_id=%s AND status <> 'archived'", (p["id"],))
        if cur.fetchone()["c"] >= 20:
            return err("Достигнут лимит предложений. Архивируйте ненужные")
        cur.execute(f"INSERT INTO {tbl('partner_offers')} (partner_id, title, data) VALUES (%s,%s,%s) RETURNING id",
                    (p["id"], title, json.dumps(data)))
        oid = cur.fetchone()["id"]
        log(cur, p["id"], "offer_created", offer_id=oid, actor="partner", actor_id=p["id"])
    conn.commit()
    return ok({"id": oid})


def handle_offer_submit(event, conn):
    p = get_partner(event, conn)
    if not p:
        return err("Не авторизован", 401)
    if p["status"] == "suspended":
        return err("Участие приостановлено. Обратитесь в поддержку", 403)
    b = body_of(event)
    oid = int(b.get("id") or 0)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT * FROM {tbl('partner_offers')} WHERE id=%s AND partner_id=%s FOR UPDATE", (oid, p["id"]))
    o = cur.fetchone()
    if not o:
        return err("Предложение не найдено", 404)
    if o["status"] not in EDITABLE or o["pending_version_id"]:
        return err("Это предложение уже на проверке или недоступно для отправки")
    data, errors = parse_offer(o["data"] or {})
    if errors:
        return err(errors[0])
    cur.execute(f"SELECT COALESCE(MAX(version_no),0)+1 AS n FROM {tbl('partner_offer_versions')} WHERE offer_id=%s", (oid,))
    n = cur.fetchone()["n"]
    cur.execute(f"INSERT INTO {tbl('partner_offer_versions')} (offer_id, version_no, data) VALUES (%s,%s,%s) RETURNING id",
                (oid, n, json.dumps(data)))
    vid = cur.fetchone()["id"]
    new_status = "approved" if o["approved_version_id"] else "pending_review"
    cur.execute(f"UPDATE {tbl('partner_offers')} SET pending_version_id=%s, status=%s, title=%s, data=%s, last_admin_comment=NULL, "
                f"updated_at=NOW() WHERE id=%s", (vid, new_status, data["title"], json.dumps(data), oid))
    log(cur, p["id"], "offer_submitted", offer_id=oid, actor="partner", actor_id=p["id"])
    conn.commit()
    send_mail(p["email"], "Предложение отправлено на модерацию",
              mail_html("Предложение на модерации", f"«{data['title']}» отправлено на проверку. Мы сообщим о решении по почте и в кабинете."))
    send_mail(ADMIN_EMAIL, "Новое предложение на модерации", mail_html("Предложение на модерации", f"{p['business_name']}: {data['title']}",
              "Открыть админку", f"{SITE_URL}/cabinet"))
    return ok({"ok": True})


def handle_offer_archive(event, conn):
    p = get_partner(event, conn)
    if not p:
        return err("Не авторизован", 401)
    oid = int(body_of(event).get("id") or 0)
    cur = conn.cursor()
    cur.execute(f"UPDATE {tbl('partner_offers')} SET status='archived', updated_at=NOW() WHERE id=%s AND partner_id=%s AND pending_version_id IS NULL",
                (oid, p["id"]))
    log(cur, p["id"], "offer_archived", offer_id=oid, actor="partner", actor_id=p["id"])
    conn.commit()
    return ok({"ok": True})


# ── Подтверждение размещения ────────────────────────────────────────────────

def handle_submission_create(event, conn):
    p = get_partner(event, conn)
    if not p:
        return err("Не авторизован", 401)
    if p["status"] == "suspended":
        return err("Участие приостановлено. Обратитесь в поддержку", 403)
    b = body_of(event)
    url, e = valid_url(b.get("publication_url"))
    if e:
        return err("Ссылка на публикацию: " + e)
    platform = clean(b.get("platform"), 100)
    if not platform:
        return err("Укажите, где опубликован материал")
    pub_date = None
    if b.get("publication_date"):
        try:
            pub_date = datetime.strptime(str(b["publication_date"])[:10], "%Y-%m-%d").date()
        except ValueError:
            return err("Дата указана некорректно")
        if pub_date > now().date():
            return err("Дата публикации не может быть в будущем")
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT 1 FROM {tbl('partner_submissions')} WHERE partner_id=%s AND status='accepted'", (p["id"],))
    if cur.fetchone():
        return err("Размещение уже подтверждено. Повторно отправлять публикации не нужно")
    cur.execute(f"SELECT COUNT(*) AS c FROM {tbl('partner_submissions')} WHERE partner_id=%s AND submitted_at > NOW() - INTERVAL '1 day'", (p["id"],))
    if cur.fetchone()["c"] >= 6:
        return err("Слишком много попыток за сутки. Попробуйте завтра", 429)
    cur.execute(f"SELECT 1 FROM {tbl('partner_submissions')} WHERE partner_id=%s AND status='pending'", (p["id"],))
    if cur.fetchone():
        return err("Предыдущее подтверждение ещё проверяется")
    key = url_key(url)
    cur.execute(f"SELECT 1 FROM {tbl('partner_submissions')} WHERE url_key=%s AND status IN ('accepted','pending')", (key,))
    if cur.fetchone():
        return err("Эта публикация уже засчитывалась. Нужна новая публикация")

    manual = bool(b.get("manual"))
    result, reason = ("unknown", "Вы отправили публикацию на ручную проверку") if manual else check_publication(fetch_page(url), p["ref_code"])
    comment = clean(b.get("partner_comment"), 1000)
    if result == "fail":
        cur.execute(f"INSERT INTO {tbl('partner_submissions')} (partner_id, publication_url, url_key, platform, publication_date, partner_comment, "
                    f"status, admin_comment, reviewed_at) VALUES (%s,%s,%s,%s,%s,%s,'rejected',%s,NOW()) RETURNING id",
                    (p["id"], url, key, platform, pub_date, comment, reason))
        sid = cur.fetchone()["id"]
        log(cur, p["id"], "submission_auto_rejected", reason, submission_id=sid, actor="system")
        conn.commit()
        return ok({"result": "rejected", "reason": reason})
    status = "accepted" if result == "ok" else "pending"
    cur.execute(f"INSERT INTO {tbl('partner_submissions')} (partner_id, publication_url, url_key, platform, publication_date, partner_comment, "
                f"status, admin_comment, reviewed_at) VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id",
                (p["id"], url, key, platform, pub_date, comment, status,
                 "Принято автоматически" if status == "accepted" else reason, now() if status == "accepted" else None))
    sid = cur.fetchone()["id"]
    if status == "accepted":
        log(cur, p["id"], "submission_auto_accepted", submission_id=sid, actor="system")
    else:
        log(cur, p["id"], "submission_pending", reason, submission_id=sid, actor="partner", actor_id=p["id"])
    conn.commit()
    if status == "accepted":
        send_mail(p["email"], "Размещение подтверждено", mail_html("Размещение подтверждено",
                  "Спасибо! Размещение подтверждено, показы ваших предложений включены. Повторно публиковать материалы не требуется."))
        return ok({"result": "accepted"})
    send_mail(ADMIN_EMAIL, "Подтверждение размещения на проверку", mail_html("Нужна проверка", f"{p['business_name']}\n{url}\n{reason}"))
    return ok({"result": "pending", "reason": reason})


def handle_submissions_list(event, conn):
    p = get_partner(event, conn)
    if not p:
        return err("Не авторизован", 401)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT id, publication_url, platform, publication_date, status, admin_comment, submitted_at "
                f"FROM {tbl('partner_submissions')} WHERE partner_id=%s ORDER BY id DESC LIMIT 50", (p["id"],))
    return ok({"submissions": rows(cur)})


def handle_history(event, conn):
    p = get_partner(event, conn)
    if not p:
        return err("Не авторизован", 401)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT action, comment, actor, created_at, offer_id FROM {tbl('partner_moderation_history')} "
                f"WHERE partner_id=%s ORDER BY id DESC LIMIT 100", (p["id"],))
    return ok({"history": rows(cur)})


# ── Администратор ───────────────────────────────────────────────────────────

def handle_admin_overview(event, conn):
    a = get_admin(event, conn)
    if not a:
        return err("Нет доступа", 403)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT p.id, p.business_name, p.contact_name, p.email, p.website, p.status, p.ref_code, p.created_at, "
                f"(SELECT COUNT(*) FROM {tbl('partner_submissions')} s WHERE s.partner_id=p.id AND s.status='accepted') AS placements, "
                f"(SELECT COUNT(*) FROM {tbl('partner_offers')} o WHERE o.partner_id=p.id AND o.status='approved') AS approved_offers, "
                f"(SELECT COUNT(*) FROM {tbl('partner_offers')} o WHERE o.partner_id=p.id AND o.status <> 'archived') AS offers, "
                f"(SELECT COUNT(*) FROM {tbl('lk_users')} u WHERE u.referred_by_partner=p.id) AS registrations, "
                f"(SELECT COUNT(*) FROM {tbl('partner_analytics_events')} e WHERE e.partner_id=p.id AND e.event_type='partner_recommendation_shown') AS shown, "
                f"(SELECT COUNT(*) FROM {tbl('partner_analytics_events')} e WHERE e.partner_id=p.id AND e.event_type='partner_offer_clicked') AS clicked "
                f"FROM {tbl('partners')} p ORDER BY p.id DESC LIMIT 300")
    partners = rows(cur)
    for x in partners:
        x["shows_active"] = x["placements"] > 0 and x["status"] != "suspended"
    cur.execute(f"SELECT v.id AS version_id, v.version_no, v.data, v.created_at, o.id AS offer_id, o.title, o.status AS offer_status, "
                f"o.approved_version_id, p.id AS partner_id, p.business_name, p.status AS partner_status "
                f"FROM {tbl('partner_offer_versions')} v JOIN {tbl('partner_offers')} o ON o.id=v.offer_id "
                f"JOIN {tbl('partners')} p ON p.id=o.partner_id WHERE v.status='pending' ORDER BY v.id")
    pending_offers = rows(cur)
    cur.execute(f"SELECT o.id, o.title, o.status, o.approved_at, p.business_name, p.id AS partner_id FROM {tbl('partner_offers')} o "
                f"JOIN {tbl('partners')} p ON p.id=o.partner_id WHERE o.status IN ('approved','suspended') ORDER BY o.updated_at DESC LIMIT 200")
    live_offers = rows(cur)
    cur.execute(f"SELECT s.id, s.publication_url, s.platform, s.publication_date, s.partner_comment, s.admin_comment, s.submitted_at, "
                f"p.business_name, p.id AS partner_id FROM {tbl('partner_submissions')} s JOIN {tbl('partners')} p ON p.id=s.partner_id "
                f"WHERE s.status='pending' ORDER BY s.id")
    submissions = rows(cur)
    return ok({"partners": partners, "pending_offers": pending_offers, "live_offers": live_offers, "pending_submissions": submissions})


def handle_admin_offer_decide(event, conn):
    a = get_admin(event, conn)
    if not a:
        return err("Нет доступа", 403)
    b = body_of(event)
    vid = int(b.get("version_id") or 0)
    decision = b.get("decision")
    comment = clean(b.get("comment"), 1000)
    if decision not in ("approve", "reject", "changes"):
        return err("Неизвестное решение")
    if decision != "approve" and not comment:
        return err("Укажите комментарий для партнёра")
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT v.*, o.partner_id, o.approved_version_id, o.title FROM {tbl('partner_offer_versions')} v "
                f"JOIN {tbl('partner_offers')} o ON o.id=v.offer_id WHERE v.id=%s AND v.status='pending' FOR UPDATE", (vid,))
    v = cur.fetchone()
    if not v:
        return err("Версия уже обработана или не найдена", 404)
    cur.execute(f"SELECT * FROM {tbl('partners')} WHERE id=%s", (v["partner_id"],))
    partner = cur.fetchone()
    new_v_status = {"approve": "approved", "reject": "rejected", "changes": "changes_requested"}[decision]
    cur.execute(f"UPDATE {tbl('partner_offer_versions')} SET status=%s, admin_comment=%s, reviewed_at=NOW(), reviewed_by=%s WHERE id=%s",
                (new_v_status, comment or None, a["id"], vid))
    title = v["data"].get("title", v["title"])
    if decision == "approve":
        cur.execute(f"UPDATE {tbl('partner_offers')} SET status='approved', approved_version_id=%s, pending_version_id=NULL, "
                    f"approved_at=NOW(), last_admin_comment=NULL, title=%s, updated_at=NOW() WHERE id=%s", (vid, title, v["offer_id"]))
        if partner["first_approved_at"] is None:
            cur.execute(f"UPDATE {tbl('partners')} SET first_approved_at=NOW(), updated_at=NOW() WHERE id=%s", (partner["id"],))
    else:
        st = "approved" if v["approved_version_id"] else new_v_status
        cur.execute(f"UPDATE {tbl('partner_offers')} SET status=%s, pending_version_id=NULL, last_admin_comment=%s, updated_at=NOW() WHERE id=%s",
                    (st, comment, v["offer_id"]))
    log(cur, partner["id"], "offer_" + new_v_status, comment or None, offer_id=v["offer_id"], actor="admin", actor_id=a["id"])
    conn.commit()
    if decision == "approve":
        send_mail(partner["email"], "Предложение одобрено", mail_html("Предложение одобрено",
                  f"«{title}» прошло модерацию и может участвовать в рекомендациях. Это не гарантирует показ каждому пользователю: ИИ предлагает услугу только когда она действительно подходит.",
                  "Открыть кабинет", f"{SITE_URL}/partner"))
    else:
        send_mail(partner["email"], "Предложение требует доработки", mail_html("Нужны правки",
                  f"«{title}»\n\nКомментарий модератора:\n{comment}", "Открыть кабинет", f"{SITE_URL}/partner"))
    return ok({"ok": True})


def handle_admin_offer_toggle(event, conn):
    a = get_admin(event, conn)
    if not a:
        return err("Нет доступа", 403)
    b = body_of(event)
    oid = int(b.get("offer_id") or 0)
    action = b.get("action")
    if action not in ("suspend", "resume"):
        return err("Неизвестное действие")
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT * FROM {tbl('partner_offers')} WHERE id=%s", (oid,))
    o = cur.fetchone()
    if not o:
        return err("Предложение не найдено", 404)
    if action == "suspend":
        cur.execute(f"UPDATE {tbl('partner_offers')} SET status='suspended', updated_at=NOW() WHERE id=%s AND status='approved'", (oid,))
    else:
        if not o["approved_version_id"]:
            return err("Нет одобренной версии для возобновления")
        cur.execute(f"UPDATE {tbl('partner_offers')} SET status='approved', updated_at=NOW() WHERE id=%s AND status='suspended'", (oid,))
    log(cur, o["partner_id"], "offer_" + action, clean(b.get("comment"), 500) or None, offer_id=oid, actor="admin", actor_id=a["id"])
    conn.commit()
    return ok({"ok": True})


def handle_admin_submission_decide(event, conn):
    a = get_admin(event, conn)
    if not a:
        return err("Нет доступа", 403)
    b = body_of(event)
    sid = int(b.get("id") or 0)
    decision = b.get("decision")
    comment = clean(b.get("comment"), 1000)
    if decision not in ("approve", "reject"):
        return err("Неизвестное решение")
    if decision == "reject" and not comment:
        return err("Укажите причину отказа")
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT * FROM {tbl('partner_submissions')} WHERE id=%s AND status='pending' FOR UPDATE", (sid,))
    s = cur.fetchone()
    if not s:
        return err("Подтверждение уже обработано", 404)
    cur.execute(f"SELECT * FROM {tbl('partners')} WHERE id=%s", (s["partner_id"],))
    partner = cur.fetchone()
    status = "accepted" if decision == "approve" else "rejected"
    cur.execute(f"UPDATE {tbl('partner_submissions')} SET status=%s, admin_comment=%s, reviewed_at=NOW(), reviewed_by=%s WHERE id=%s",
                (status, comment or None, a["id"], sid))
    log(cur, partner["id"], "submission_" + status, comment or None, submission_id=sid, actor="admin", actor_id=a["id"])
    conn.commit()
    if decision == "approve":
        send_mail(partner["email"], "Размещение подтверждено", mail_html("Размещение подтверждено",
                  "Спасибо! Размещение подтверждено, показы ваших предложений включены. Повторно публиковать материалы не требуется."))
    else:
        send_mail(partner["email"], "Подтверждение не принято", mail_html("Подтверждение не принято",
                  f"Причина:\n{comment}\n\nОтправьте другую публикацию в кабинете.", "Открыть кабинет", f"{SITE_URL}/partner"))
    return ok({"ok": True})


def handle_admin_partner_block(event, conn):
    a = get_admin(event, conn)
    if not a:
        return err("Нет доступа", 403)
    b = body_of(event)
    pid = int(b.get("partner_id") or 0)
    blocked = bool(b.get("blocked"))
    cur = conn.cursor()
    cur.execute(f"UPDATE {tbl('partners')} SET status=%s, updated_at=NOW() WHERE id=%s", ("suspended" if blocked else "active", pid))
    log(cur, pid, "partner_blocked" if blocked else "partner_unblocked", clean(b.get("comment"), 500) or None, actor="admin", actor_id=a["id"])
    conn.commit()
    return ok({"ok": True})


def handle_admin_partner_history(event, conn):
    a = get_admin(event, conn)
    if not a:
        return err("Нет доступа", 403)
    pid = int((event.get("queryStringParameters") or {}).get("partner_id") or 0)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT action, comment, actor, created_at, offer_id FROM {tbl('partner_moderation_history')} "
                f"WHERE partner_id=%s ORDER BY id DESC LIMIT 100", (pid,))
    return ok({"history": rows(cur)})


def handle_admin_view_session(event, conn):
    """Выдаёт администратору временную сессию партнёра ТОЛЬКО для просмотра (2 часа, без права изменений)."""
    a = get_admin(event, conn)
    if not a:
        return err("Нет доступа", 403)
    pid = int(body_of(event).get("partner_id") or 0)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT id FROM {tbl('partners')} WHERE id=%s", (pid,))
    if not cur.fetchone():
        return err("Партнёр не найден", 404)
    sid = secrets.token_hex(32)
    cur.execute(f"INSERT INTO {tbl('partner_sessions')} (id, partner_id, expires_at, view_only, created_by_admin) "
                f"VALUES (%s,%s,NOW() + INTERVAL '2 hours',TRUE,%s)", (sid, pid, a["id"]))
    conn.commit()
    return ok({"session": sid})


WRITE_ACTIONS = {"password_change", "profile_save", "offer_save", "offer_submit", "offer_archive", "submission_create"}


def is_view_only(event, conn) -> bool:
    sid = (event.get("headers") or {}).get("X-Session-Id", "") or (event.get("headers") or {}).get("x-session-id", "")
    if not sid:
        return False
    cur = conn.cursor()
    cur.execute(f"SELECT view_only FROM {tbl('partner_sessions')} WHERE id=%s AND expires_at > NOW()", (sid,))
    row = cur.fetchone()
    return bool(row and row[0])


ROUTES = {
    "register": handle_register, "login": handle_login, "password_forgot": handle_password_forgot,
    "password_reset": handle_password_reset, "password_change": handle_password_change, "logout": handle_logout, "me": handle_me,
    "profile_save": handle_profile_save, "offers_list": handle_offers_list, "offer_get": handle_offer_get,
    "offer_save": handle_offer_save, "offer_submit": handle_offer_submit, "offer_archive": handle_offer_archive,
    "submission_create": handle_submission_create, "submissions_list": handle_submissions_list, "history": handle_history,
    "admin_overview": handle_admin_overview, "admin_offer_decide": handle_admin_offer_decide,
    "admin_offer_toggle": handle_admin_offer_toggle, "admin_submission_decide": handle_admin_submission_decide,
    "admin_partner_block": handle_admin_partner_block, "admin_partner_history": handle_admin_partner_history,
    "admin_view_session": handle_admin_view_session,
}


def handler(event: dict, context) -> dict:
    """Единая точка партнёрского кабинета: маршрутизация по ?action=."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}
    action = (event.get("queryStringParameters") or {}).get("action", "")
    fn = ROUTES.get(action)
    if not fn:
        return err("Неизвестное действие", 404)
    conn = get_db()
    try:
        if action in WRITE_ACTIONS and is_view_only(event, conn):
            return err("Режим просмотра: изменения недоступны", 403)
        return fn(event, conn)
    finally:
        conn.close()
