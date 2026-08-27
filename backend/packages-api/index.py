"""
Пакеты развития «ПоДелам» — платная подписка поверх бесплатной механики.
Не заменяет систему энергии (lk-api) — это отдельный слой монетизации:
пакет даёт ежедневный расширенный ИИ-анализ + лимит использований КАЖДОГО инструмента
в сутки, энергия остаётся способом доплатить за использование сверх лимита пакета.

GET  ?action=packages_list         — список тарифов с ценами по периодам + текущий активный пакет пользователя
POST ?action=package_create_payment — создать платёж в ЮКассе на покупку/продление пакета
                                       body: {plan_code, period_months, enable_autorenew}
POST ?action=package_webhook       — вебхук ЮКассы: активирует пакет при payment.succeeded
GET  ?action=package_status        — текущий активный пакет + лимиты использования инструментов сегодня
POST ?action=package_autorenew_off — отключить автопродление текущего пакета
GET/POST ?action=package_autorenew_check&key=ADMIN_TOKEN — cron: продлевает пакеты с auto_renew=true,
                                       у которых istёк срок, через сохранённый payment_method_id

Админка:
GET  ?action=admin_packages_list   — список тарифов и цен для редактирования
POST ?action=admin_package_update  — обновить лимит/описание/активность тарифа
POST ?action=admin_package_price_update — обновить цену тарифа на конкретный период
GET  ?action=admin_packages_stats  — статистика продаж пакетов
"""
import json
import os
import secrets
import urllib.request
import urllib.error
import base64
from datetime import datetime, timedelta, timezone
import psycopg2
import psycopg2.extras

SCHEMA = "t_p84565078_code_expression_proj"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id, X-Internal-Key",
}


def tbl(name: str) -> str:
    return f"{SCHEMA}.{name}"


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def ok(data, status=200):
    return {"statusCode": status, "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps(data, ensure_ascii=False, default=str)}


def err(msg, status=400):
    return {"statusCode": status, "headers": CORS, "body": json.dumps({"error": msg}, ensure_ascii=False)}


def get_session_user(event, conn):
    sid = (event.get("headers") or {}).get("X-Session-Id", "")
    if not sid:
        return None
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT u.* FROM {tbl('lk_sessions')} s JOIN {tbl('lk_users')} u ON u.id=s.user_id "
        f"WHERE s.id=%s AND s.expires_at>NOW() AND u.is_active=TRUE", (sid,)
    )
    return cur.fetchone()


def require_admin(event, conn):
    user = get_session_user(event, conn)
    if not user or not user.get("is_admin"):
        return None
    return user


# ── ЮКасса ────────────────────────────────────────────────────────────────────

def _yookassa_request(method: str, path: str, body: dict = None) -> dict:
    shop_id = os.environ.get("YOOKASSA_SHOP_ID", "")
    secret_key = os.environ.get("YOOKASSA_SECRET_KEY", "")
    credentials = base64.b64encode(f"{shop_id}:{secret_key}".encode()).decode()
    url = f"https://api.yookassa.ru/v3{path}"
    payload = json.dumps(body).encode("utf-8") if body else None
    req = urllib.request.Request(url, data=payload, headers={
        "Authorization": f"Basic {credentials}",
        "Content-Type": "application/json",
        "Idempotence-Key": str(secrets.token_hex(16)),
    }, method=method)
    with urllib.request.urlopen(req, timeout=15) as resp:
        return json.loads(resp.read().decode("utf-8"))


# ── Тарифы ────────────────────────────────────────────────────────────────────

def _get_plans(conn) -> list:
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT * FROM {tbl('package_plans')} WHERE is_active=TRUE ORDER BY sort_order"
    )
    plans = [dict(r) for r in cur.fetchall()]
    for p in plans:
        cur.execute(
            f"SELECT period_months, price_rub FROM {tbl('package_plan_prices')} WHERE plan_code=%s ORDER BY period_months",
            (p["code"],)
        )
        p["prices"] = [dict(r) for r in cur.fetchall()]
    return plans


def _get_active_package(conn, user_id: int) -> dict | None:
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"""SELECT * FROM {tbl('user_packages')}
            WHERE user_id=%s AND status='active' AND expires_at > NOW()
            ORDER BY expires_at DESC LIMIT 1""",
        (user_id,)
    )
    return cur.fetchone()


def _get_plan_by_code(conn, plan_code: str) -> dict | None:
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT * FROM {tbl('package_plans')} WHERE code=%s AND is_active=TRUE", (plan_code,))
    return cur.fetchone()


def handle_packages_list(event: dict) -> dict:
    """Список тарифов с ценами по периодам + текущий активный пакет пользователя (если авторизован)."""
    conn = get_db()
    try:
        plans = _get_plans(conn)
        active = None
        user = get_session_user(event, conn)
        if user:
            row = _get_active_package(conn, user["id"])
            if row:
                active = {
                    "plan_code": row["plan_code"],
                    "period_months": row["period_months"],
                    "expires_at": row["expires_at"],
                    "auto_renew": row["auto_renew"],
                }
        return ok({"plans": plans, "active_package": active})
    finally:
        conn.close()


# ── Использование инструментов в рамках лимита пакета ──────────────────────────

def get_tool_daily_usage(conn, user_id: int, tool_key: str) -> int:
    """Сколько раз инструмент использован за последние 24 часа (скользящее окно, не 00:00)."""
    cur = conn.cursor()
    cur.execute(
        f"SELECT COUNT(*) FROM {tbl('tool_usage_log')} WHERE user_id=%s AND tool_key=%s AND used_at > NOW() - INTERVAL '24 hours'",
        (user_id, tool_key)
    )
    return cur.fetchone()[0] or 0


def log_tool_usage(conn, user_id: int, tool_key: str):
    cur = conn.cursor()
    cur.execute(f"INSERT INTO {tbl('tool_usage_log')} (user_id, tool_key) VALUES (%s, %s)", (user_id, tool_key))


def get_package_daily_limit(conn, user_id: int) -> int | None:
    """Лимит использований КАЖДОГО инструмента в сутки для активного пакета пользователя.
    Возвращает None если пакета нет (используется энергия без ограничения по инструменту)."""
    pkg = _get_active_package(conn, user_id)
    if not pkg:
        return None
    plan = _get_plan_by_code(conn, pkg["plan_code"])
    if not plan:
        return None
    return plan["daily_limit_per_tool"]


def handle_package_status(event: dict) -> dict:
    """Текущий активный пакет пользователя + сколько раз сегодня использован каждый инструмент."""
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        pkg = _get_active_package(conn, user["id"])
        if not pkg:
            return ok({"has_package": False})
        plan = _get_plan_by_code(conn, pkg["plan_code"])
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(f"SELECT tool_key, name FROM {tbl('tool_costs')} WHERE is_free=FALSE ORDER BY name")
        tools = cur.fetchall()
        usage = []
        for t in tools:
            used = get_tool_daily_usage(conn, user["id"], t["tool_key"])
            usage.append({"tool_key": t["tool_key"], "name": t["name"], "used": used, "limit": plan["daily_limit_per_tool"] if plan else 0})
        days_left = (pkg["expires_at"] - datetime.now(timezone.utc)).days
        return ok({
            "has_package": True,
            "plan_code": pkg["plan_code"],
            "plan_name": plan["name"] if plan else pkg["plan_code"],
            "expires_at": pkg["expires_at"],
            "days_left": max(0, days_left),
            "auto_renew": pkg["auto_renew"],
            "usage": usage,
        })
    finally:
        conn.close()


def check_package_tool_limit(conn, user_id: int, tool_key: str) -> tuple[bool, int, int | None]:
    """Проверяет, не исчерпан ли лимит инструмента в рамках активного пакета.
    Возвращает (allowed_within_package, used, limit). Если пакета нет — (False, 0, None),
    вызывающий код должен в этом случае перейти на списание энергии как обычно."""
    limit = get_package_daily_limit(conn, user_id)
    if limit is None:
        return False, 0, None
    used = get_tool_daily_usage(conn, user_id, tool_key)
    return used < limit, used, limit


# ── Покупка пакета ──────────────────────────────────────────────────────────────

def handle_package_create_payment(event: dict) -> dict:
    """Создаёт платёж в ЮКассе на покупку/продление пакета развития."""
    body = json.loads(event.get("body") or "{}")
    plan_code = (body.get("plan_code") or "").strip()
    period_months = int(body.get("period_months") or 1)
    enable_autorenew = bool(body.get("enable_autorenew", False))
    return_url = (body.get("return_url") or "https://promtdialog.ru/cabinet").strip()

    if period_months not in (1, 3, 6, 12):
        return err("Некорректный период подписки")

    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        if not user.get("salon_id"):
            return err("Сначала заполните профиль", 402)

        plan = _get_plan_by_code(conn, plan_code)
        if not plan:
            return err("Тариф не найден")

        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"SELECT price_rub FROM {tbl('package_plan_prices')} WHERE plan_code=%s AND period_months=%s",
            (plan_code, period_months)
        )
        price_row = cur.fetchone()
        if not price_row:
            return err("Цена для этого периода не настроена")
        price_rub = price_row["price_rub"]

        shop_id = os.environ.get("YOOKASSA_SHOP_ID", "")
        secret_key = os.environ.get("YOOKASSA_SECRET_KEY", "")
        if not shop_id or not secret_key:
            return err("Платёжная система не настроена")

        user_email = user.get("email") or ""
        receipt = None
        if user_email:
            receipt = {
                "customer": {"email": user_email},
                "items": [{
                    "description": f"Пакет развития «{plan['name']}» на {period_months} мес.",
                    "quantity": "1.00",
                    "amount": {"value": f"{price_rub}.00", "currency": "RUB"},
                    "vat_code": 1,
                    "payment_mode": "full_payment",
                    "payment_subject": "service",
                }]
            }

        recurring_enabled = os.environ.get("YOOKASSA_RECURRING_ENABLED", "").lower() == "true"
        payment_body = {
            "amount": {"value": f"{price_rub}.00", "currency": "RUB"},
            "confirmation": {"type": "redirect", "return_url": return_url},
            "capture": True,
            "description": f"Пакет развития «{plan['name']}» — {period_months} мес.",
            "metadata": {
                "kind": "package",
                "user_id": user["id"],
                "salon_id": user["salon_id"],
                "plan_code": plan_code,
                "period_months": period_months,
                "enable_autorenew": "1" if enable_autorenew else "0",
            }
        }
        if enable_autorenew and recurring_enabled:
            payment_body["save_payment_method"] = True
        if receipt:
            payment_body["receipt"] = receipt

        try:
            payment = _yookassa_request("POST", "/payments", payment_body)
        except urllib.error.HTTPError as e:
            return err(f"Ошибка ЮКассы: {e.read().decode('utf-8')}")

        cur2 = conn.cursor()
        cur2.execute(
            f"""INSERT INTO {tbl('payments')} (salon_id, user_id, package_code, amount_rub, yookassa_id, status, payment_type, period_months)
                VALUES (%s,%s,%s,%s,%s,'pending','package',%s)""",
            (user["salon_id"], user["id"], plan_code, price_rub, payment["id"], period_months)
        )
        conn.commit()

        confirmation_url = payment.get("confirmation", {}).get("confirmation_url", "")
        return ok({"confirmation_url": confirmation_url, "payment_id": payment["id"]})
    finally:
        conn.close()


def _activate_package(conn, user_id: int, salon_id: int, plan_code: str, period_months: int, price_rub: int,
                       auto_renew: bool, payment_method_id: str | None, yookassa_payment_id: str | None):
    """Активирует пакет: если у пользователя уже есть активный пакет — продлевает срок от даты
    его окончания (чтобы не терять оплаченное время), иначе — от текущего момента."""
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    existing = _get_active_package(conn, user_id)
    base_dt = existing["expires_at"] if existing and existing["plan_code"] == plan_code else datetime.now(timezone.utc)
    if base_dt < datetime.now(timezone.utc):
        base_dt = datetime.now(timezone.utc)
    expires_at = base_dt + timedelta(days=30 * period_months)

    if existing:
        cur.execute(
            f"UPDATE {tbl('user_packages')} SET status='replaced', updated_at=NOW() WHERE id=%s",
            (existing["id"],)
        )

    cur2 = conn.cursor()
    cur2.execute(
        f"""INSERT INTO {tbl('user_packages')}
            (user_id, salon_id, plan_code, period_months, price_rub, status, expires_at, auto_renew, payment_method_id, yookassa_payment_id)
            VALUES (%s,%s,%s,%s,%s,'active',%s,%s,%s,%s)""",
        (user_id, salon_id, plan_code, period_months, price_rub, expires_at, auto_renew, payment_method_id, yookassa_payment_id)
    )
    conn.commit()


def handle_package_webhook(event: dict) -> dict:
    """Вебхук ЮКассы для платежей за пакеты (kind=package в metadata)."""
    body = json.loads(event.get("body") or "{}")
    if body.get("event") != "payment.succeeded":
        return ok({"ok": True})

    payment_obj = body.get("object", {})
    meta = payment_obj.get("metadata", {})
    if meta.get("kind") != "package":
        return ok({"ok": True})

    yookassa_id = payment_obj.get("id")
    user_id = meta.get("user_id")
    salon_id = meta.get("salon_id")
    plan_code = meta.get("plan_code")
    period_months = int(meta.get("period_months") or 1)
    enable_autorenew = meta.get("enable_autorenew") == "1"
    if not yookassa_id or not user_id or not plan_code:
        return ok({"ok": True})

    conn = get_db()
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(f"SELECT * FROM {tbl('payments')} WHERE yookassa_id=%s", (yookassa_id,))
        payment = cur.fetchone()
        if not payment or payment["status"] == "succeeded":
            return ok({"ok": True})

        payment_method_id = (payment_obj.get("payment_method") or {}).get("id")
        payment_method_saved = (payment_obj.get("payment_method") or {}).get("saved", False)

        cur.execute(
            f"UPDATE {tbl('payments')} SET status='succeeded', updated_at=NOW(), payment_method_id=%s WHERE yookassa_id=%s",
            (payment_method_id, yookassa_id)
        )
        conn.commit()

        _activate_package(
            conn, int(user_id), int(salon_id) if salon_id else None, plan_code, period_months,
            payment["amount_rub"], enable_autorenew and payment_method_saved,
            payment_method_id if (enable_autorenew and payment_method_saved) else None,
            yookassa_id,
        )

        cur.execute(f"SELECT email, full_name FROM {tbl('lk_users')} WHERE id=%s", (int(user_id),))
        u = cur.fetchone()
        if u and u.get("email"):
            _send_package_activated_email(u["email"], u.get("full_name") or "", plan_code, period_months)

        return ok({"ok": True})
    finally:
        conn.close()


def handle_package_autorenew_off(event: dict) -> dict:
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        cur = conn.cursor()
        cur.execute(
            f"UPDATE {tbl('user_packages')} SET auto_renew=FALSE, payment_method_id=NULL, updated_at=NOW() "
            f"WHERE user_id=%s AND status='active'",
            (user["id"],)
        )
        conn.commit()
        return ok({"ok": True})
    finally:
        conn.close()


def handle_package_autorenew_check(event: dict) -> dict:
    """Cron: продлевает пакеты с auto_renew=TRUE, у которых истёк срок, через сохранённый payment_method_id."""
    admin_token = os.environ.get("ADMIN_TOKEN", "")
    key = (event.get("queryStringParameters") or {}).get("key", "")
    if not admin_token or key != admin_token:
        return err("Доступ запрещён", 403)

    conn = get_db()
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"""SELECT * FROM {tbl('user_packages')}
                WHERE status='active' AND auto_renew=TRUE AND payment_method_id IS NOT NULL
                AND expires_at <= NOW() + INTERVAL '1 hour'"""
        )
        due = cur.fetchall()
        renewed, failed = 0, 0
        for pkg in due:
            try:
                cur.execute(
                    f"SELECT price_rub FROM {tbl('package_plan_prices')} WHERE plan_code=%s AND period_months=%s",
                    (pkg["plan_code"], pkg["period_months"])
                )
                price_row = cur.fetchone()
                if not price_row:
                    failed += 1
                    continue
                price_rub = price_row["price_rub"]

                cur.execute(f"SELECT email FROM {tbl('lk_users')} WHERE id=%s", (pkg["user_id"],))
                u = cur.fetchone()
                receipt = None
                if u and u.get("email"):
                    receipt = {
                        "customer": {"email": u["email"]},
                        "items": [{
                            "description": f"Автопродление пакета «{pkg['plan_code']}»",
                            "quantity": "1.00",
                            "amount": {"value": f"{price_rub}.00", "currency": "RUB"},
                            "vat_code": 1, "payment_mode": "full_payment", "payment_subject": "service",
                        }]
                    }
                payment_body = {
                    "amount": {"value": f"{price_rub}.00", "currency": "RUB"},
                    "capture": True,
                    "payment_method_id": pkg["payment_method_id"],
                    "description": f"Автопродление пакета «{pkg['plan_code']}»",
                    "metadata": {
                        "kind": "package", "user_id": pkg["user_id"], "salon_id": pkg["salon_id"],
                        "plan_code": pkg["plan_code"], "period_months": pkg["period_months"],
                        "enable_autorenew": "1",
                    },
                }
                if receipt:
                    payment_body["receipt"] = receipt
                payment = _yookassa_request("POST", "/payments", payment_body)
                cur.execute(
                    f"""INSERT INTO {tbl('payments')} (salon_id, user_id, package_code, amount_rub, yookassa_id, status, payment_type, period_months, is_autopay)
                        VALUES (%s,%s,%s,%s,%s,'pending','package',%s,TRUE)""",
                    (pkg["salon_id"], pkg["user_id"], pkg["plan_code"], price_rub, payment["id"], pkg["period_months"])
                )
                conn.commit()
                renewed += 1
            except Exception as e:
                print(f"[package_autorenew] failed for user {pkg['user_id']}: {e}")
                failed += 1
        return ok({"checked": len(due), "renewal_payments_created": renewed, "failed": failed})
    finally:
        conn.close()


# ── Email ────────────────────────────────────────────────────────────────────

def _send_package_activated_email(to_email: str, full_name: str, plan_code: str, period_months: int) -> None:
    smtp_password = os.environ.get("SMTP_PASSWORD", "")
    if not smtp_password:
        return
    import smtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart

    name = (full_name or "Здравствуйте").split(" ")[0]
    plan_names = {"start": "Старт", "growth": "Развитие", "pro": "Профессионал", "max": "Максимум"}
    plan_name = plan_names.get(plan_code, plan_code)
    html = f"""
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;padding:24px;">
      <h2 style="color:#0F172A;">Пакет «{plan_name}» активирован</h2>
      <p style="color:#334155;line-height:1.6;">
        {name}, ваш пакет развития на {period_months} мес. активирован. Теперь в ПоДелам доступен
        расширенный ежедневный анализ, прогноз, точки роста и увеличенные лимиты использования
        всех ИИ-инструментов.
      </p>
      <p style="color:#64748B;font-size:13px;">Промт Диалог</p>
    </div>
    """
    try:
        msg = MIMEMultipart("alternative")
        msg["Subject"] = f"Пакет «{plan_name}» активирован — Промт Диалог"
        msg["From"] = os.environ.get("SMTP_FROM", "no-reply@promtdialog.ru")
        msg["To"] = to_email
        msg.attach(MIMEText(html, "html", "utf-8"))
        with smtplib.SMTP_SSL(os.environ.get("SMTP_HOST", "smtp.yandex.ru"), int(os.environ.get("SMTP_PORT", "465"))) as server:
            server.login(os.environ.get("SMTP_USER", ""), smtp_password)
            server.sendmail(msg["From"], [to_email], msg.as_string())
    except Exception as e:
        print(f"[package email] failed: {e}")


# ── Админка ─────────────────────────────────────────────────────────────────

def handle_admin_packages_list(event: dict) -> dict:
    conn = get_db()
    try:
        admin = require_admin(event, conn)
        if not admin:
            return err("Доступ запрещён", 403)
        return ok({"plans": _get_plans(conn)})
    finally:
        conn.close()


def handle_admin_package_update(event: dict) -> dict:
    conn = get_db()
    try:
        admin = require_admin(event, conn)
        if not admin:
            return err("Доступ запрещён", 403)
        body = json.loads(event.get("body") or "{}")
        code = body.get("code")
        if not code:
            return err("Не передан код тарифа")
        cur = conn.cursor()
        cur.execute(
            f"""UPDATE {tbl('package_plans')} SET
                name=COALESCE(%s,name), description=COALESCE(%s,description),
                daily_limit_per_tool=COALESCE(%s,daily_limit_per_tool),
                is_active=COALESCE(%s,is_active), updated_at=NOW()
                WHERE code=%s""",
            (body.get("name"), body.get("description"), body.get("daily_limit_per_tool"), body.get("is_active"), code)
        )
        conn.commit()
        return ok({"ok": True})
    finally:
        conn.close()


def handle_admin_package_price_update(event: dict) -> dict:
    conn = get_db()
    try:
        admin = require_admin(event, conn)
        if not admin:
            return err("Доступ запрещён", 403)
        body = json.loads(event.get("body") or "{}")
        plan_code = body.get("plan_code")
        period_months = body.get("period_months")
        price_rub = body.get("price_rub")
        if not plan_code or not period_months or price_rub is None:
            return err("Не хватает параметров")
        cur = conn.cursor()
        cur.execute(
            f"""INSERT INTO {tbl('package_plan_prices')} (plan_code, period_months, price_rub)
                VALUES (%s,%s,%s)
                ON CONFLICT (plan_code, period_months) DO UPDATE SET price_rub=EXCLUDED.price_rub""",
            (plan_code, int(period_months), int(price_rub))
        )
        conn.commit()
        return ok({"ok": True})
    finally:
        conn.close()


def handle_admin_packages_stats(event: dict) -> dict:
    conn = get_db()
    try:
        admin = require_admin(event, conn)
        if not admin:
            return err("Доступ запрещён", 403)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"""SELECT plan_code, COUNT(*) AS purchases, SUM(price_rub) AS revenue
                FROM {tbl('payments')} WHERE payment_type='package' AND status='succeeded'
                GROUP BY plan_code ORDER BY revenue DESC"""
        )
        by_plan = [dict(r) for r in cur.fetchall()]
        cur.execute(
            f"""SELECT COUNT(*) AS active_count FROM {tbl('user_packages')}
                WHERE status='active' AND expires_at > NOW()"""
        )
        active_count = cur.fetchone()["active_count"]
        cur.execute(
            f"""SELECT COUNT(DISTINCT user_id) AS total_users FROM {tbl('lk_users')}"""
        )
        total_users = cur.fetchone()["total_users"]
        cur.execute(
            f"""SELECT COUNT(DISTINCT user_id) AS ever_bought FROM {tbl('user_packages')}"""
        )
        ever_bought = cur.fetchone()["ever_bought"]
        conversion = round(ever_bought / total_users * 100, 1) if total_users else 0
        return ok({
            "by_plan": by_plan,
            "active_packages": active_count,
            "total_users": total_users,
            "ever_bought_package": ever_bought,
            "conversion_pct": conversion,
        })
    finally:
        conn.close()


# ── Router ──────────────────────────────────────────────────────────────────

ROUTES = {
    ("GET", "packages_list"): handle_packages_list,
    ("GET", "package_status"): handle_package_status,
    ("POST", "package_create_payment"): handle_package_create_payment,
    ("POST", "package_webhook"): handle_package_webhook,
    ("POST", "package_autorenew_off"): handle_package_autorenew_off,
    ("GET", "package_autorenew_check"): handle_package_autorenew_check,
    ("POST", "package_autorenew_check"): handle_package_autorenew_check,
    ("GET", "admin_packages_list"): handle_admin_packages_list,
    ("POST", "admin_package_update"): handle_admin_package_update,
    ("POST", "admin_package_price_update"): handle_admin_package_price_update,
    ("GET", "admin_packages_stats"): handle_admin_packages_stats,
}


def handler(event: dict, context) -> dict:
    """Пакеты развития «ПоДелам»: тарифы, оплата, лимиты инструментов, автопродление, админка."""
    method = event.get("httpMethod", "GET")
    if method == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    params = event.get("queryStringParameters") or {}
    action = params.get("action", "")
    route_fn = ROUTES.get((method, action))
    if not route_fn:
        return err(f"Неизвестное действие: {method} {action}", 404)
    try:
        return route_fn(event)
    except Exception as e:
        print(f"[packages-api] error: {e}")
        return err("Внутренняя ошибка сервера", 500)
