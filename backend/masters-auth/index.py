"""
Авторизация мастеров салона красоты (партнёрская программа).
POST /register — регистрация, возвращает session_id
POST /login    — вход, возвращает session_id
GET  /me       — данные текущего мастера по сессии
POST /logout   — выход
"""
import json
import os
import hashlib
import secrets
import string
import re
import psycopg2
import psycopg2.extras
from datetime import datetime, timedelta, timezone

SCHEMA = "t_p84565078_code_expression_proj"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Master-Session",
}


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def ok(data):
    return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps(data, ensure_ascii=False, default=str)}


def err(msg, status=400):
    return {"statusCode": status, "headers": CORS,
            "body": json.dumps({"error": msg}, ensure_ascii=False)}


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def gen_ref_code() -> str:
    chars = string.ascii_uppercase + string.digits
    return "M" + "".join(secrets.choice(chars) for _ in range(7))


def gen_session() -> str:
    return secrets.token_hex(32)


def get_master_by_session(session_id: str, conn):
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"""SELECT m.* FROM {SCHEMA}.master_sessions s
            JOIN {SCHEMA}.masters m ON m.id = s.master_id
            WHERE s.id = %s AND s.expires_at > NOW() AND m.is_active = TRUE""",
        (session_id,)
    )
    return cur.fetchone()


def create_session(master_id, conn) -> str:
    sid = gen_session()
    expires = datetime.now(timezone.utc) + timedelta(days=30)
    cur = conn.cursor()
    cur.execute(
        f"INSERT INTO {SCHEMA}.master_sessions (id, master_id, expires_at) VALUES (%s, %s, %s)",
        (sid, master_id, expires)
    )
    conn.commit()
    return sid


def master_public(m: dict) -> dict:
    return {
        "id": str(m["id"]),
        "email": m["email"],
        "full_name": m["full_name"],
        "phone": m.get("phone"),
        "ref_code": m["ref_code"],
        "ref_url": f"https://promtdialog.ru/r/{m['ref_code']}",
        "created_at": str(m["created_at"]),
    }


def handler(event: dict, context) -> dict:
    """Регистрация, вход и профиль мастеров партнёрской программы."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    path = (event.get("path") or "/").rstrip("/")
    headers = event.get("headers") or {}
    session_id = headers.get("X-Master-Session", "")

    conn = get_db()
    try:
        # ── GET /me ──────────────────────────────────────────────────────────
        if method == "GET":
            if not session_id:
                return err("Не авторизован", 401)
            master = get_master_by_session(session_id, conn)
            if not master:
                return err("Сессия истекла", 401)
            return ok({"master": master_public(master)})

        body = json.loads(event.get("body") or "{}")

        # ── POST /register ────────────────────────────────────────────────────
        if "register" in path or body.get("action") == "register":
            full_name = (body.get("full_name") or "").strip()
            email = (body.get("email") or "").strip().lower()
            password = body.get("password") or ""
            phone = (body.get("phone") or "").strip()
            terms = body.get("terms_agreed", False)

            if not full_name or not email or not password:
                return err("Заполните имя, email и пароль")
            if not re.match(r"[^@]+@[^@]+\.[^@]+", email):
                return err("Некорректный email")
            if len(password) < 6:
                return err("Пароль должен быть не менее 6 символов")
            if not terms:
                return err("Необходимо принять условия договора-оферты")

            cur = conn.cursor()
            cur.execute(f"SELECT id FROM {SCHEMA}.masters WHERE email = %s", (email,))
            if cur.fetchone():
                return err("Этот email уже зарегистрирован")

            # Генерируем уникальный ref_code
            ref_code = gen_ref_code()
            for _ in range(10):
                cur.execute(f"SELECT id FROM {SCHEMA}.masters WHERE ref_code = %s", (ref_code,))
                if not cur.fetchone():
                    break
                ref_code = gen_ref_code()

            cur.execute(
                f"""INSERT INTO {SCHEMA}.masters
                    (email, full_name, phone, password_hash, ref_code, terms_agreed_at)
                    VALUES (%s, %s, %s, %s, %s, NOW())
                    RETURNING id""",
                (email, full_name, phone or None, hash_password(password), ref_code)
            )
            master_id = cur.fetchone()[0]

            # Создаём баланс
            cur.execute(
                f"INSERT INTO {SCHEMA}.master_balance (master_id) VALUES (%s)",
                (master_id,)
            )
            conn.commit()

            sid = create_session(master_id, conn)

            cur.execute(f"SELECT * FROM {SCHEMA}.masters WHERE id = %s", (master_id,))
            cur2 = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            cur2.execute(f"SELECT * FROM {SCHEMA}.masters WHERE id = %s", (master_id,))
            master = cur2.fetchone()

            return ok({"session_id": sid, "master": master_public(master)})

        # ── POST /login ───────────────────────────────────────────────────────
        if "login" in path or body.get("action") == "login":
            email = (body.get("email") or "").strip().lower()
            password = body.get("password") or ""

            if not email or not password:
                return err("Введите email и пароль")

            cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            cur.execute(
                f"SELECT * FROM {SCHEMA}.masters WHERE email = %s AND is_active = TRUE",
                (email,)
            )
            master = cur.fetchone()
            if not master or master["password_hash"] != hash_password(password):
                return err("Неверный email или пароль")

            sid = create_session(master["id"], conn)
            return ok({"session_id": sid, "master": master_public(master)})

        # ── POST /logout ──────────────────────────────────────────────────────
        if "logout" in path or body.get("action") == "logout":
            if session_id:
                cur = conn.cursor()
                cur.execute(f"DELETE FROM {SCHEMA}.master_sessions WHERE id = %s", (session_id,))
                conn.commit()
            return ok({"ok": True})

        return err("Неизвестный запрос", 404)

    finally:
        conn.close()
