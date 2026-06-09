"""
API личного кабинета: авторизация, профиль, тесты, зоны тела, управление пользователями (админ).
Маршруты: ?action=login|logout|me|tests|test_detail|submit_test|body_zones|body_zone|
           admin_users|admin_create_user|admin_update_user|admin_set_password|
           admin_body_zone_save|admin_technique_save
"""
import json
import os
import secrets
import hashlib
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
from email.utils import formataddr
from datetime import datetime, timezone

FROM_EMAIL = "massopro@mail.ru"
SITE_URL = "https://promtdialog.ru"
MASTERS_ACCRUAL_URL = "https://functions.poehali.dev/2907ddb5-140b-429e-a5b0-30b5bd898074"

import bcrypt
import psycopg2
import psycopg2.extras
import urllib.request


def _notify_master_accrual(salon_id: int, amount: float, action: str):
    """Асинхронно уведомляет сервис начислений о реальной оплате салона."""
    try:
        payload = json.dumps({"salon_id": salon_id, "amount": amount, "action": action}).encode()
        req = urllib.request.Request(MASTERS_ACCRUAL_URL, data=payload,
                                     headers={"Content-Type": "application/json"}, method="POST")
        urllib.request.urlopen(req, timeout=5)
    except Exception:
        pass

SCHEMA = "t_p84565078_code_expression_proj"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}


def tbl(name: str) -> str:
    return f"{SCHEMA}.{name}"


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def ok(data: dict | list, status: int = 200) -> dict:
    return {"statusCode": status, "headers": CORS, "body": json.dumps(data, ensure_ascii=False, default=str)}


def err(msg: str, status: int = 400) -> dict:
    return {"statusCode": status, "headers": CORS, "body": json.dumps({"error": msg}, ensure_ascii=False)}


def get_session_user(event: dict, conn) -> dict | None:
    session_id = (event.get("headers") or {}).get("X-Session-Id", "")
    if not session_id:
        return None
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT u.* FROM {tbl('lk_sessions')} s JOIN {tbl('lk_users')} u ON u.id = s.user_id "
        f"WHERE s.id = %s AND s.expires_at > NOW() AND u.is_active = TRUE",
        (session_id,)
    )
    return cur.fetchone()


# ── Обработчики ──────────────────────────────────────────────────────────────

def handle_login(event: dict) -> dict:
    body = json.loads(event.get("body") or "{}")
    username = body.get("username", "").strip()
    password = body.get("password", "")
    if not username or not password:
        return err("Введите логин и пароль")

    conn = get_db()
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"SELECT * FROM {tbl('lk_users')} WHERE (username = %s OR email = %s) AND is_active = TRUE",
            (username, username)
        )
        user = cur.fetchone()
        if not user:
            return err("Неверный логин или пароль", 401)

        ph = user["password_hash"]
        # Поддержка первоначальной установки пароля
        if ph == "SETUP_REQUIRED":
            return err("Пароль не установлен. Обратитесь к администратору.", 403)

        try:
            valid = bcrypt.checkpw(password.encode(), ph.encode())
        except Exception:
            valid = False
        if not valid:
            return err("Неверный логин или пароль", 401)

        # Проверяем срок доступа (NULL = безлимит, иначе проверяем дату)
        if user["access_expires_at"] and user["access_expires_at"] < datetime.now(timezone.utc):
            return err("Срок доступа к кабинету истёк. Обратитесь к администратору.", 403)

        session_id = secrets.token_hex(32)
        ua = (event.get("headers") or {}).get("User-Agent", "")
        cur.execute(
            f"INSERT INTO {tbl('lk_sessions')} (id, user_id, user_agent) VALUES (%s, %s, %s)",
            (session_id, user["id"], ua)
        )
        conn.commit()

        salon = None
        if user.get("salon_id"):
            cur.execute(f"SELECT id, name, logo_url FROM {tbl('salons')} WHERE id = %s", (user["salon_id"],))
            s = cur.fetchone()
            if s:
                salon = dict(s)

        cur.execute(
            f"SELECT course_id FROM {tbl('course_access')} WHERE user_id = %s",
            (user["id"],)
        )
        course_ids = [r["course_id"] for r in cur.fetchall()]

        return ok({
            "session_id": session_id,
            "user": {
                "id": user["id"],
                "username": user["username"],
                "full_name": user["full_name"],
                "email": user["email"],
                "is_admin": user["is_admin"],
                "is_representative": user.get("is_representative", False),
                "rep_permissions": user.get("rep_permissions"),
                "access_expires_at": user["access_expires_at"],
                "segment": user.get("segment", "specialist"),
                "role": user.get("role", "body_specialist"),
                "salon_id": user.get("salon_id"),
                "salon": salon,
                "course_ids": course_ids,
            }
        })
    finally:
        conn.close()


def handle_register(event: dict) -> dict:
    """Самостоятельная регистрация нового владельца салона."""
    body = json.loads(event.get("body") or "{}")
    full_name = (body.get("full_name") or "").strip()
    email = (body.get("email") or "").strip().lower()
    password = body.get("password") or ""

    if not full_name:
        return err("Укажите ваше имя")
    if not email or "@" not in email:
        return err("Укажите корректный email")
    if len(password) < 6:
        return err("Пароль должен содержать минимум 6 символов")

    # username = email до @
    username = email.split("@")[0]

    conn = get_db()
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # Проверяем уникальность email
        cur.execute(f"SELECT id FROM {tbl('lk_users')} WHERE email = %s", (email,))
        if cur.fetchone():
            return err("Пользователь с таким email уже зарегистрирован")
        # Уникальный username
        base = username
        suffix = 0
        while True:
            cur.execute(f"SELECT id FROM {tbl('lk_users')} WHERE username = %s", (username,))
            if not cur.fetchone():
                break
            suffix += 1
            username = f"{base}{suffix}"

        pw_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
        cur.execute(
            f"INSERT INTO {tbl('lk_users')} (username, email, password_hash, full_name, is_active, segment, role, welcome_bonus_given) "
            f"VALUES (%s,%s,%s,%s,TRUE,'salon','owner',FALSE) RETURNING id",
            (username, email, pw_hash, full_name)
        )
        user_id = cur.fetchone()["id"]

        session_id = secrets.token_hex(32)
        ua = (event.get("headers") or {}).get("User-Agent", "")
        cur.execute(
            f"INSERT INTO {tbl('lk_sessions')} (id, user_id, user_agent) VALUES (%s, %s, %s)",
            (session_id, user_id, ua)
        )
        conn.commit()

        return ok({
            "session_id": session_id,
            "user": {
                "id": user_id,
                "username": username,
                "full_name": full_name,
                "email": email,
                "is_admin": False,
                "is_representative": False,
                "rep_permissions": None,
                "access_expires_at": None,
                "segment": "salon",
                "role": "owner",
                "salon_id": None,
                "salon": None,
            }
        })
    finally:
        conn.close()


def handle_logout(event: dict) -> dict:
    session_id = (event.get("headers") or {}).get("X-Session-Id", "")
    if not session_id:
        return ok({"ok": True})
    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute(f"UPDATE {tbl('lk_sessions')} SET expires_at = NOW() WHERE id = %s", (session_id,))
        conn.commit()
        return ok({"ok": True})
    finally:
        conn.close()


def handle_me(event: dict) -> dict:
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        salon = None
        if user.get("salon_id"):
            cur.execute(f"SELECT id, name, logo_url FROM {tbl('salons')} WHERE id = %s", (user["salon_id"],))
            s = cur.fetchone()
            if s:
                salon = dict(s)
        cur.execute(
            f"SELECT course_id FROM {tbl('course_access')} WHERE user_id = %s",
            (user["id"],)
        )
        course_ids = [r["course_id"] for r in cur.fetchall()]
        return ok({
            "id": user["id"],
            "username": user["username"],
            "full_name": user["full_name"],
            "email": user["email"],
            "is_admin": user["is_admin"],
            "is_representative": user.get("is_representative", False),
            "rep_permissions": user.get("rep_permissions"),
            "access_expires_at": user["access_expires_at"],
            "segment": user.get("segment", "specialist"),
            "role": user.get("role", "body_specialist"),
            "salon_id": user.get("salon_id"),
            "salon": salon,
            "course_ids": course_ids,
        })
    finally:
        conn.close()


def handle_tests(event: dict) -> dict:
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(f"SELECT id, slug, title, description, icon FROM {tbl('lk_tests')} WHERE is_active = TRUE ORDER BY sort_order")
        tests = cur.fetchall()
        # Добавляем результат пользователя если есть
        cur.execute(
            f"SELECT test_id, score, result_id, completed_at FROM {tbl('lk_user_test_results')} "
            f"WHERE user_id = %s ORDER BY completed_at DESC",
            (user["id"],)
        )
        done = {r["test_id"]: r for r in cur.fetchall()}
        result = []
        for t in tests:
            entry = dict(t)
            if t["id"] in done:
                entry["completed"] = True
                entry["score"] = done[t["id"]]["score"]
                entry["completed_at"] = done[t["id"]]["completed_at"]
            else:
                entry["completed"] = False
            result.append(entry)
        return ok(result)
    finally:
        conn.close()


def handle_test_detail(event: dict) -> dict:
    qs = event.get("queryStringParameters") or {}
    slug = qs.get("slug", "")
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(f"SELECT * FROM {tbl('lk_tests')} WHERE slug = %s AND is_active = TRUE", (slug,))
        test = cur.fetchone()
        if not test:
            return err("Тест не найден", 404)
        cur.execute(f"SELECT * FROM {tbl('lk_test_questions')} WHERE test_id = %s ORDER BY sort_order", (test["id"],))
        questions = cur.fetchall()
        for q in questions:
            cur.execute(f"SELECT * FROM {tbl('lk_test_options')} WHERE question_id = %s ORDER BY sort_order", (q["id"],))
            q["options"] = cur.fetchall()
        return ok({"test": dict(test), "questions": [dict(q) for q in questions]})
    finally:
        conn.close()


def handle_submit_test(event: dict) -> dict:
    body = json.loads(event.get("body") or "{}")
    test_id = body.get("test_id")
    answers = body.get("answers", {})  # {question_id: option_id}
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # Считаем баллы
        total = 0
        for q_id, opt_id in answers.items():
            cur.execute(f"SELECT score FROM {tbl('lk_test_options')} WHERE id = %s AND question_id = %s", (opt_id, q_id))
            row = cur.fetchone()
            if row:
                total += row["score"]
        # Находим интерпретацию
        cur.execute(
            f"SELECT * FROM {tbl('lk_test_results')} WHERE test_id = %s AND score_min <= %s AND score_max >= %s LIMIT 1",
            (test_id, total, total)
        )
        result = cur.fetchone()
        result_id = result["id"] if result else None
        # Сохраняем результат (заменяем предыдущий)
        cur.execute(
            f"SELECT id FROM {tbl('lk_user_test_results')} WHERE user_id = %s AND test_id = %s",
            (user["id"], test_id)
        )
        existing = cur.fetchone()
        if existing:
            cur.execute(
                f"UPDATE {tbl('lk_user_test_results')} SET score = %s, result_id = %s, answers = %s, completed_at = NOW() WHERE id = %s",
                (total, result_id, json.dumps(answers), existing["id"])
            )
        else:
            cur.execute(
                f"INSERT INTO {tbl('lk_user_test_results')} (user_id, test_id, score, result_id, answers) VALUES (%s, %s, %s, %s, %s)",
                (user["id"], test_id, total, result_id, json.dumps(answers))
            )
        conn.commit()
        return ok({"score": total, "result": dict(result) if result else None})
    finally:
        conn.close()


def handle_body_zones(event: dict) -> dict:
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(f"SELECT id, slug, name, sort_order FROM {tbl('lk_body_zones')} WHERE is_active = TRUE ORDER BY sort_order")
        return ok([dict(r) for r in cur.fetchall()])
    finally:
        conn.close()


def handle_body_zone(event: dict) -> dict:
    qs = event.get("queryStringParameters") or {}
    slug = qs.get("slug", "")
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(f"SELECT * FROM {tbl('lk_body_zones')} WHERE slug = %s AND is_active = TRUE", (slug,))
        zone = cur.fetchone()
        if not zone:
            return err("Зона не найдена", 404)
        cur.execute(f"SELECT * FROM {tbl('lk_body_techniques')} WHERE zone_id = %s ORDER BY sort_order", (zone["id"],))
        techniques = [dict(r) for r in cur.fetchall()]
        return ok({"zone": dict(zone), "techniques": techniques})
    finally:
        conn.close()


# ── Админка ───────────────────────────────────────────────────────────────────

def require_admin(event: dict, conn) -> dict | None:
    user = get_session_user(event, conn)
    if not user or not user["is_admin"]:
        return None
    return user


def handle_admin_users(event: dict) -> dict:
    conn = get_db()
    try:
        if not require_admin(event, conn):
            return err("Нет доступа", 403)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(f"SELECT id, username, email, full_name, is_admin, is_active, created_at, notes, access_expires_at, segment FROM {tbl('lk_users')} ORDER BY created_at DESC")
        return ok([dict(r) for r in cur.fetchall()])
    finally:
        conn.close()


def handle_admin_create_user(event: dict) -> dict:
    body = json.loads(event.get("body") or "{}")
    username = body.get("username", "").strip()
    email = body.get("email", "").strip()
    password = body.get("password", "").strip()
    full_name = body.get("full_name", "").strip()
    notes = body.get("notes", "").strip()
    is_admin = bool(body.get("is_admin", False))
    access_type = body.get("access_type", "unlimited")  # "12months" или "unlimited"
    segment = body.get("segment", "specialist")  # "specialist" или "salon"

    if not username or not email or not password:
        return err("Заполните логин, email и пароль")

    from datetime import timedelta
    access_expires_at = None
    if access_type == "12months":
        access_expires_at = (datetime.now(timezone.utc) + timedelta(days=365)).isoformat()

    conn = get_db()
    try:
        if not require_admin(event, conn):
            return err("Нет доступа", 403)
        pw_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"INSERT INTO {tbl('lk_users')} (username, email, password_hash, full_name, notes, is_admin, access_expires_at, segment) VALUES (%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id",
            (username, email, pw_hash, full_name, notes, is_admin, access_expires_at, segment)
        )
        new_id = cur.fetchone()["id"]
        conn.commit()
        return ok({"id": new_id, "ok": True})
    except psycopg2.errors.UniqueViolation:
        conn.rollback()
        return err("Пользователь с таким логином или email уже существует")
    finally:
        conn.close()


def handle_admin_update_user(event: dict) -> dict:
    body = json.loads(event.get("body") or "{}")
    user_id = body.get("id")
    access_type = body.get("access_type")  # "12months", "unlimited" или None (не менять)
    segment = body.get("segment")  # "specialist" или "salon" или None (не менять)

    from datetime import timedelta
    conn = get_db()
    try:
        if not require_admin(event, conn):
            return err("Нет доступа", 403)
        cur = conn.cursor()
        seg_sql = ", segment=%s" if segment else ""
        seg_val = (segment,) if segment else ()
        if access_type == "unlimited":
            cur.execute(
                f"UPDATE {tbl('lk_users')} SET full_name=%s, email=%s, notes=%s, is_active=%s, is_admin=%s, access_expires_at=NULL{seg_sql} WHERE id=%s",
                (body.get("full_name"), body.get("email"), body.get("notes"), body.get("is_active", True), body.get("is_admin", False)) + seg_val + (user_id,)
            )
        elif access_type == "12months":
            new_expires = (datetime.now(timezone.utc) + timedelta(days=365)).isoformat()
            cur.execute(
                f"UPDATE {tbl('lk_users')} SET full_name=%s, email=%s, notes=%s, is_active=%s, is_admin=%s, access_expires_at=%s{seg_sql} WHERE id=%s",
                (body.get("full_name"), body.get("email"), body.get("notes"), body.get("is_active", True), body.get("is_admin", False), new_expires) + seg_val + (user_id,)
            )
        else:
            cur.execute(
                f"UPDATE {tbl('lk_users')} SET full_name=%s, email=%s, notes=%s, is_active=%s, is_admin=%s{seg_sql} WHERE id=%s",
                (body.get("full_name"), body.get("email"), body.get("notes"), body.get("is_active", True), body.get("is_admin", False)) + seg_val + (user_id,)
            )
        conn.commit()
        return ok({"ok": True})
    finally:
        conn.close()


def handle_admin_update_rep(event: dict) -> dict:
    body = json.loads(event.get("body") or "{}")
    user_id = body.get("user_id")
    conn = get_db()
    try:
        if not require_admin(event, conn):
            return err("Нет доступа", 403)
        cur = conn.cursor()
        cur.execute(
            f"UPDATE {tbl('lk_users')} SET is_representative=%s, rep_permissions=%s WHERE id=%s",
            (body.get("is_representative", False), json.dumps(body.get("rep_permissions", [])), user_id)
        )
        conn.commit()
        return ok({"ok": True})
    finally:
        conn.close()


def handle_admin_set_password(event: dict) -> dict:
    body = json.loads(event.get("body") or "{}")
    user_id = body.get("user_id")
    new_password = body.get("password", "")
    if not new_password or len(new_password) < 6:
        return err("Пароль минимум 6 символов")
    conn = get_db()
    try:
        if not require_admin(event, conn):
            return err("Нет доступа", 403)
        pw_hash = bcrypt.hashpw(new_password.encode(), bcrypt.gensalt()).decode()
        cur = conn.cursor()
        cur.execute(f"UPDATE {tbl('lk_users')} SET password_hash=%s WHERE id=%s", (pw_hash, user_id))
        conn.commit()
        return ok({"ok": True})
    finally:
        conn.close()


def handle_admin_delete_user(event: dict) -> dict:
    """Полное удаление пользователя и всех его данных из БД."""
    body = json.loads(event.get("body") or "{}")
    user_id = body.get("user_id")
    if not user_id:
        return err("Не указан user_id")
    conn = get_db()
    try:
        admin = require_admin(event, conn)
        if not admin:
            return err("Нет доступа", 403)
        # Запрещаем удалять самого себя
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(f"SELECT id FROM {tbl('lk_users')} WHERE id=%s", (user_id,))
        if not cur.fetchone():
            return err("Пользователь не найден", 404)
        if admin["id"] == user_id:
            return err("Нельзя удалить самого себя")
        # Удаляем сессии
        cur.execute(f"DELETE FROM {tbl('lk_sessions')} WHERE user_id=%s", (user_id,))
        # Удаляем транзакции и данные салона если пользователь — владелец
        cur.execute(f"SELECT salon_id, role FROM {tbl('lk_users')} WHERE id=%s", (user_id,))
        u = cur.fetchone()
        if u and u["salon_id"] and u["role"] == "owner":
            salon_id = u["salon_id"]
            cur.execute(f"DELETE FROM {tbl('credit_transactions')} WHERE salon_id=%s", (salon_id,))
            cur.execute(f"DELETE FROM {tbl('salon_services')} WHERE salon_id=%s", (salon_id,))
            cur.execute(f"DELETE FROM {tbl('salon_members')} WHERE salon_id=%s", (salon_id,))
            cur.execute(f"DELETE FROM {tbl('salons')} WHERE id=%s", (salon_id,))
        # Удаляем самого пользователя
        cur.execute(f"DELETE FROM {tbl('lk_users')} WHERE id=%s", (user_id,))
        conn.commit()
        return ok({"ok": True})
    finally:
        conn.close()


def handle_profile_update(event: dict) -> dict:
    """Обновление данных собственного профиля: имя и email."""
    body = json.loads(event.get("body") or "{}")
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        full_name = (body.get("full_name") or "").strip()
        email = (body.get("email") or "").strip().lower()
        if not full_name:
            return err("Укажите имя")
        if not email or "@" not in email:
            return err("Укажите корректный email")
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # Проверяем уникальность email (исключая себя)
        cur.execute(f"SELECT id FROM {tbl('lk_users')} WHERE email=%s AND id!=%s", (email, user["id"]))
        if cur.fetchone():
            return err("Этот email уже используется другим пользователем")
        cur.execute(
            f"UPDATE {tbl('lk_users')} SET full_name=%s, email=%s WHERE id=%s",
            (full_name, email, user["id"])
        )
        conn.commit()
        return ok({"ok": True})
    finally:
        conn.close()


def handle_change_password(event: dict) -> dict:
    """Смена пароля текущего пользователя."""
    body = json.loads(event.get("body") or "{}")
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        current_pw = body.get("current_password") or ""
        new_pw = body.get("new_password") or ""
        if not current_pw:
            return err("Введите текущий пароль")
        if len(new_pw) < 6:
            return err("Новый пароль должен содержать минимум 6 символов")
        # Проверяем текущий пароль
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(f"SELECT password_hash FROM {tbl('lk_users')} WHERE id=%s", (user["id"],))
        row = cur.fetchone()
        try:
            valid = bcrypt.checkpw(current_pw.encode(), row["password_hash"].encode())
        except Exception:
            valid = False
        if not valid:
            return err("Неверный текущий пароль")
        pw_hash = bcrypt.hashpw(new_pw.encode(), bcrypt.gensalt()).decode()
        cur.execute(f"UPDATE {tbl('lk_users')} SET password_hash=%s WHERE id=%s", (pw_hash, user["id"]))
        conn.commit()
        return ok({"ok": True})
    finally:
        conn.close()


def handle_admin_body_zone_save(event: dict) -> dict:
    body = json.loads(event.get("body") or "{}")
    conn = get_db()
    try:
        if not require_admin(event, conn):
            return err("Нет доступа", 403)
        cur = conn.cursor()
        zone_id = body.get("id")
        if zone_id:
            cur.execute(
                f"UPDATE {tbl('lk_body_zones')} SET name=%s, description=%s, diagnosis=%s, video_url=%s, updated_at=NOW() WHERE id=%s",
                (body.get("name"), body.get("description"), body.get("diagnosis"), body.get("video_url"), zone_id)
            )
        else:
            cur.execute(
                f"INSERT INTO {tbl('lk_body_zones')} (slug, name, description, diagnosis, video_url, sort_order) VALUES (%s,%s,%s,%s,%s,%s)",
                (body.get("slug"), body.get("name"), body.get("description"), body.get("diagnosis"), body.get("video_url"), body.get("sort_order", 0))
            )
        conn.commit()
        return ok({"ok": True})
    finally:
        conn.close()


def handle_admin_technique_save(event: dict) -> dict:
    body = json.loads(event.get("body") or "{}")
    conn = get_db()
    try:
        if not require_admin(event, conn):
            return err("Нет доступа", 403)
        cur = conn.cursor()
        tech_id = body.get("id")
        if tech_id:
            cur.execute(
                f"UPDATE {tbl('lk_body_techniques')} SET title=%s, description=%s, video_url=%s, sort_order=%s, updated_at=NOW() WHERE id=%s",
                (body.get("title"), body.get("description"), body.get("video_url"), body.get("sort_order", 0), tech_id)
            )
        else:
            cur.execute(
                f"INSERT INTO {tbl('lk_body_techniques')} (zone_id, title, description, video_url, sort_order) VALUES (%s,%s,%s,%s,%s)",
                (body.get("zone_id"), body.get("title"), body.get("description"), body.get("video_url"), body.get("sort_order", 0))
            )
        conn.commit()
        return ok({"ok": True})
    finally:
        conn.close()


def handle_admin_body_zones(event: dict) -> dict:
    conn = get_db()
    try:
        if not require_admin(event, conn):
            return err("Нет доступа", 403)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(f"SELECT * FROM {tbl('lk_body_zones')} ORDER BY sort_order")
        zones = []
        for z in cur.fetchall():
            cur.execute(f"SELECT * FROM {tbl('lk_body_techniques')} WHERE zone_id = %s ORDER BY sort_order", (z["id"],))
            zd = dict(z)
            zd["techniques"] = [dict(t) for t in cur.fetchall()]
            zones.append(zd)
        return ok(zones)
    finally:
        conn.close()


# ── Mindset результаты ───────────────────────────────────────────────────────

def handle_mindset_save(event: dict) -> dict:
    body = json.loads(event.get("body") or "{}")
    conn = get_db()
    try:
        energy_err = check_and_spend_energy(event, conn, "mindset_analysis")
        if energy_err:
            return energy_err
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        idx = body.get("indexes", {})
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"INSERT INTO {tbl('lk_mindset_results')} "
            f"(user_id, igp, iu, ipm, ido, ipg, ics, isd, izk, type_title, answers) "
            f"VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id",
            (
                user["id"],
                body.get("igp", 0),
                idx.get("IU", 0), idx.get("IPM", 0), idx.get("IDO", 0),
                idx.get("IPG", 0), idx.get("ICS", 0), idx.get("ISD", 0), idx.get("IZK", 0),
                body.get("type_title", ""),
                json.dumps(body.get("answers", {})),
            )
        )
        new_id = cur.fetchone()["id"]
        cur.execute(
            f"DELETE FROM {tbl('lk_mindset_results')} WHERE user_id = %s AND id NOT IN "
            f"(SELECT id FROM {tbl('lk_mindset_results')} WHERE user_id = %s ORDER BY completed_at DESC LIMIT 3)",
            (user["id"], user["id"])
        )
        conn.commit()
        return ok({"id": new_id, "ok": True})
    finally:
        conn.close()


def handle_mindset_history(event: dict) -> dict:
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"SELECT id, igp, iu, ipm, ido, ipg, ics, isd, izk, type_title, completed_at "
            f"FROM {tbl('lk_mindset_results')} WHERE user_id = %s ORDER BY completed_at DESC LIMIT 10",
            (user["id"],)
        )
        return ok([dict(r) for r in cur.fetchall()])
    finally:
        conn.close()


# ── Barriers результаты ──────────────────────────────────────────────────────

def handle_barriers_save(event: dict) -> dict:
    body = json.loads(event.get("body") or "{}")
    conn = get_db()
    try:
        energy_err = check_and_spend_energy(event, conn, "barriers_analysis")
        if energy_err:
            return energy_err
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        idx = body.get("indexes", {})
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"INSERT INTO {tbl('lk_barriers_results')} "
            f"(user_id, iib, ivo, iss, isd, ido, iir, iei, isp, type_title, answers) "
            f"VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id",
            (
                user["id"],
                body.get("iib", 0),
                idx.get("IVO", 0), idx.get("ISS", 0), idx.get("ISD", 0),
                idx.get("IDO", 0), idx.get("IIR", 0), idx.get("IEI", 0), idx.get("ISP", 0),
                body.get("type_title", ""),
                json.dumps(body.get("answers", {})),
            )
        )
        new_id = cur.fetchone()["id"]
        cur.execute(
            f"DELETE FROM {tbl('lk_barriers_results')} WHERE user_id = %s AND id NOT IN "
            f"(SELECT id FROM {tbl('lk_barriers_results')} WHERE user_id = %s ORDER BY completed_at DESC LIMIT 3)",
            (user["id"], user["id"])
        )
        conn.commit()
        return ok({"id": new_id, "ok": True})
    finally:
        conn.close()


def handle_barriers_history(event: dict) -> dict:
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"SELECT id, iib, ivo, iss, isd, ido, iir, iei, isp, type_title, completed_at "
            f"FROM {tbl('lk_barriers_results')} WHERE user_id = %s ORDER BY completed_at DESC LIMIT 10",
            (user["id"],)
        )
        return ok([dict(r) for r in cur.fetchall()])
    finally:
        conn.close()


# ── Finance результаты ───────────────────────────────────────────────────────

def handle_finance_save(event: dict) -> dict:
    body = json.loads(event.get("body") or "{}")
    conn = get_db()
    try:
        energy_err = check_and_spend_energy(event, conn, "finance_analysis")
        if energy_err:
            return energy_err
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        idx = body.get("indexes", {})
        summary = body.get("summary", {})
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"INSERT INTO {tbl('lk_finance_results')} "
            f"(user_id, ifr, ifj, ifu, ipn, idm, ifp, jlj, fr, mpd, nsc, nck, data) "
            f"VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id",
            (
                user["id"],
                body.get("ifr", 0),
                idx.get("ifj", 0), idx.get("ifu", 0), idx.get("ipn", 0),
                idx.get("idm", 0), idx.get("ifp", 0),
                summary.get("jlj", 0), summary.get("fr", 0), summary.get("mpd", 0),
                summary.get("nsc", 0), summary.get("nck", 0),
                json.dumps(body.get("data", {})),
            )
        )
        new_id = cur.fetchone()["id"]
        cur.execute(
            f"DELETE FROM {tbl('lk_finance_results')} WHERE user_id = %s AND id NOT IN "
            f"(SELECT id FROM {tbl('lk_finance_results')} WHERE user_id = %s ORDER BY completed_at DESC LIMIT 3)",
            (user["id"], user["id"])
        )
        conn.commit()
        return ok({"id": new_id, "ok": True})
    finally:
        conn.close()


def handle_finance_history(event: dict) -> dict:
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"SELECT id, ifr, ifj, ifu, ipn, idm, ifp, jlj, fr, mpd, nsc, nck, data, completed_at "
            f"FROM {tbl('lk_finance_results')} WHERE user_id = %s ORDER BY completed_at DESC LIMIT 10",
            (user["id"],)
        )
        return ok([dict(r) for r in cur.fetchall()])
    finally:
        conn.close()


# ── Profile результаты ───────────────────────────────────────────────────────

def handle_profile_save(event: dict) -> dict:
    body = json.loads(event.get("body") or "{}")
    conn = get_db()
    try:
        energy_err = check_and_spend_energy(event, conn, "profile_analysis")
        if energy_err:
            return energy_err
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        idx = body.get("indexes", {})
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"INSERT INTO {tbl('lk_profile_results')} "
            f"(user_id, ifl, ifu, type_title, ifz, idt, in_idx, ifd, idm, idr, iit, ids, answers) "
            f"VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id",
            (
                user["id"],
                body.get("ifl", 0),
                body.get("ifu", 0),
                body.get("type_title", ""),
                idx.get("IFZ", 0), idx.get("IDT", 0), idx.get("IN", 0), idx.get("IFD", 0),
                idx.get("IDM", 0), idx.get("IDR", 0), idx.get("IIT", 0), idx.get("IDS", 0),
                json.dumps(body.get("answers", {})),
            )
        )
        new_id = cur.fetchone()["id"]
        cur.execute(
            f"DELETE FROM {tbl('lk_profile_results')} WHERE user_id = %s AND id NOT IN "
            f"(SELECT id FROM {tbl('lk_profile_results')} WHERE user_id = %s ORDER BY completed_at DESC LIMIT 3)",
            (user["id"], user["id"])
        )
        conn.commit()
        return ok({"id": new_id, "ok": True})
    finally:
        conn.close()


def handle_profile_history(event: dict) -> dict:
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"SELECT id, ifl, ifu, type_title, ifz, idt, in_idx, ifd, idm, idr, iit, ids, answers, completed_at "
            f"FROM {tbl('lk_profile_results')} WHERE user_id = %s ORDER BY completed_at DESC LIMIT 10",
            (user["id"],)
        )
        rows = []
        for r in cur.fetchall():
            d = dict(r)
            d["in_idx"] = d.get("in_idx", 0)  # нормализуем имя поля
            rows.append(d)
        return ok(rows)
    finally:
        conn.close()


# ── Salon результаты ─────────────────────────────────────────────────────────

def handle_salon_save(event: dict) -> dict:
    body = json.loads(event.get("body") or "{}")
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        idx = body.get("indexes", {})
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"INSERT INTO {tbl('lk_salon_results')} "
            f"(user_id, ips, ipp_loss, type_title, ivk, isc, iz, iea, ipu, ilk, ips_idx, hidden_money, answers, numeric_data) "
            f"VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id",
            (
                user["id"],
                body.get("ips", 0),
                body.get("ipp_loss", 0),
                body.get("type_title", ""),
                idx.get("IVK", 0), idx.get("ISC", 0), idx.get("IZ", 0),
                idx.get("IEA", 0), idx.get("IPU", 0), idx.get("ILK", 0),
                idx.get("IPS", 0),
                body.get("hidden_money", 0),
                json.dumps(body.get("answers", {})),
                json.dumps(body.get("numeric", {})),
            )
        )
        new_id = cur.fetchone()["id"]
        cur.execute(
            f"DELETE FROM {tbl('lk_salon_results')} WHERE user_id = %s AND id NOT IN "
            f"(SELECT id FROM {tbl('lk_salon_results')} WHERE user_id = %s ORDER BY completed_at DESC LIMIT 3)",
            (user["id"], user["id"])
        )
        conn.commit()
        return ok({"id": new_id, "ok": True})
    finally:
        conn.close()


def handle_salon_history(event: dict) -> dict:
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"SELECT id, ips, ipp_loss, type_title, ivk, isc, iz, iea, ipu, ilk, ips_idx, hidden_money, completed_at "
            f"FROM {tbl('lk_salon_results')} WHERE user_id = %s ORDER BY completed_at DESC LIMIT 10",
            (user["id"],)
        )
        return ok([dict(r) for r in cur.fetchall()])
    finally:
        conn.close()


# ── Удаление истории ─────────────────────────────────────────────────────────

def handle_mindset_delete(event: dict) -> dict:
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        cur = conn.cursor()
        cur.execute(f"DELETE FROM {tbl('lk_mindset_results')} WHERE user_id = %s", (user["id"],))
        conn.commit()
        return ok({"ok": True})
    finally:
        conn.close()


def handle_barriers_delete(event: dict) -> dict:
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        cur = conn.cursor()
        cur.execute(f"DELETE FROM {tbl('lk_barriers_results')} WHERE user_id = %s", (user["id"],))
        conn.commit()
        return ok({"ok": True})
    finally:
        conn.close()


def handle_finance_delete(event: dict) -> dict:
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        cur = conn.cursor()
        cur.execute(f"DELETE FROM {tbl('lk_finance_results')} WHERE user_id = %s", (user["id"],))
        conn.commit()
        return ok({"ok": True})
    finally:
        conn.close()


def handle_profile_delete(event: dict) -> dict:
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        cur = conn.cursor()
        cur.execute(f"DELETE FROM {tbl('lk_profile_results')} WHERE user_id = %s", (user["id"],))
        conn.commit()
        return ok({"ok": True})
    finally:
        conn.close()


def handle_salon_delete(event: dict) -> dict:
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        cur = conn.cursor()
        cur.execute(f"DELETE FROM {tbl('lk_salon_results')} WHERE user_id = %s", (user["id"],))
        conn.commit()
        return ok({"ok": True})
    finally:
        conn.close()


# ── Мышление специалиста ─────────────────────────────────────────────────────

def handle_ms_categories(event: dict) -> dict:
    """Возвращает категории, проблемы и вопросы с вариантами для инструмента Мышление специалиста."""
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        # Категории
        cur.execute(f"SELECT * FROM {tbl('ms_categories')} ORDER BY sort_order")
        categories = [dict(c) for c in cur.fetchall()]

        # Проблемы
        cur.execute(f"SELECT * FROM {tbl('ms_problems')} ORDER BY sort_order")
        problems = [dict(p) for p in cur.fetchall()]

        # Вопросы
        cur.execute(f"SELECT * FROM {tbl('ms_questions')} ORDER BY sort_order")
        questions = [dict(q) for q in cur.fetchall()]

        # Варианты
        cur.execute(f"SELECT * FROM {tbl('ms_options')} ORDER BY sort_order")
        options = [dict(o) for o in cur.fetchall()]

        return ok({"categories": categories, "problems": problems, "questions": questions, "options": options})
    finally:
        conn.close()


def handle_ms_analyze(event: dict) -> dict:
    """Анализирует ответы пользователя и возвращает сценарий."""
    body = json.loads(event.get("body") or "{}")
    # answers: {question_id: option_id}
    answers = body.get("answers", {})

    conn = get_db()
    try:
        energy_err = check_and_spend_energy(event, conn, "ms_analyze")
        if energy_err:
            return energy_err
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)

        if not answers:
            return err("Нет ответов")

        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        # Собираем теги по выбранным опциям
        option_ids = list(answers.values())
        if not option_ids:
            return err("Нет ответов")

        placeholders = ','.join(['%s'] * len(option_ids))
        cur.execute(
            f"SELECT scenario_tag FROM {tbl('ms_options')} WHERE id IN ({placeholders})",
            option_ids
        )
        tags = [r["scenario_tag"] for r in cur.fetchall()]

        # Подсчитываем частоту тегов (исключаем 'ok')
        from collections import Counter
        tag_counts = Counter(t for t in tags if t != 'ok')

        if not tag_counts:
            # Все ответы позитивные
            slug = 'no_system'  # fallback
        else:
            slug = tag_counts.most_common(1)[0][0]

        cur.execute(f"SELECT * FROM {tbl('ms_scenarios')} WHERE slug = %s", (slug,))
        scenario = cur.fetchone()
        if not scenario:
            return err("Сценарий не найден", 404)

        return ok({"scenario": dict(scenario), "tag_counts": dict(tag_counts)})
    finally:
        conn.close()


# ── Диагностика ──────────────────────────────────────────────────────────────

def handle_diag_symptoms(event: dict) -> dict:
    """Возвращает список всех симптомов для выбора из списка."""
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"SELECT id, slug, name, zone_slug FROM {tbl('diag_symptoms')} "
            f"WHERE is_active = TRUE ORDER BY sort_order"
        )
        return ok([dict(r) for r in cur.fetchall()])
    finally:
        conn.close()


def handle_diag_search(event: dict) -> dict:
    """Поиск по жалобе клиента. Возвращает карточку диагностики + техники из шпаргалки."""
    qs = event.get("queryStringParameters") or {}
    query = qs.get("q", "").strip().lower()
    symptom_slug = qs.get("slug", "").strip()

    conn = get_db()
    try:
        energy_err = check_and_spend_energy(event, conn, "diagnostic")
        if energy_err:
            return energy_err
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)

        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        # Поиск симптома: по slug зоны, по slug симптома или по ключевым словам в тексте
        zone_slug_param = qs.get("zone", "").strip()
        zone_slug = None
        matched_symptom = None

        if zone_slug_param:
            # Прямой поиск по zone_slug в diag_cards
            zone_slug = zone_slug_param
        elif symptom_slug:
            cur.execute(
                f"SELECT * FROM {tbl('diag_symptoms')} WHERE slug = %s AND is_active = TRUE",
                (symptom_slug,)
            )
            row = cur.fetchone()
            if row:
                zone_slug = row["zone_slug"]
                matched_symptom = row["name"]
        elif query:
            # Полнотекстовый поиск по keywords array
            cur.execute(
                f"SELECT *, "
                f"(SELECT COUNT(*) FROM unnest(keywords) k WHERE %s ILIKE '%%' || k || '%%' OR k ILIKE '%%' || %s || '%%') AS match_count "
                f"FROM {tbl('diag_symptoms')} WHERE is_active = TRUE "
                f"ORDER BY match_count DESC, sort_order LIMIT 1",
                (query, query)
            )
            row = cur.fetchone()
            if row and row["match_count"] > 0:
                zone_slug = row["zone_slug"]
                matched_symptom = row["name"]
            else:
                # Fallback: ищем по частичному совпадению названия симптома
                cur.execute(
                    f"SELECT * FROM {tbl('diag_symptoms')} WHERE is_active = TRUE "
                    f"AND (name ILIKE %s OR %s = ANY(keywords)) ORDER BY sort_order LIMIT 1",
                    (f"%{query}%", query)
                )
                row = cur.fetchone()
                if row:
                    zone_slug = row["zone_slug"]
                    matched_symptom = row["name"]

        if not zone_slug:
            return ok({"found": False, "query": query})

        # Получаем диагностическую карточку
        cur.execute(
            f"SELECT * FROM {tbl('diag_cards')} WHERE zone_slug = %s",
            (zone_slug,)
        )
        card = cur.fetchone()
        if not card:
            return ok({"found": False, "query": query})

        card = dict(card)

        # Получаем техники из шпаргалки для основной зоны
        techniques_by_zone = {}

        all_slugs = [zone_slug] + list(card.get("compensation_slugs") or [])
        for slug in all_slugs:
            cur.execute(
                f"SELECT bz.name as zone_name, bt.title, bt.description, bt.video_url "
                f"FROM {tbl('lk_body_zones')} bz "
                f"JOIN {tbl('lk_body_techniques')} bt ON bt.zone_id = bz.id "
                f"WHERE bz.slug = %s ORDER BY bt.sort_order",
                (slug,)
            )
            rows = cur.fetchall()
            if rows:
                techniques_by_zone[slug] = {
                    "zone_name": rows[0]["zone_name"],
                    "techniques": [{"title": r["title"], "description": r["description"], "video_url": r["video_url"]} for r in rows]
                }

        return ok({
            "found": True,
            "query": query,
            "matched_symptom": matched_symptom,
            "zone_slug": zone_slug,
            "card": card,
            "techniques_by_zone": techniques_by_zone,
        })
    finally:
        conn.close()


# ── Шпаргалка по телу — просмотр зоны ───────────────────────────────────────

def handle_body_zone_view(event: dict) -> dict:
    """Просмотр зоны тела: списывает 1 энергию (cheat_sheet), возвращает данные зоны."""
    qs = event.get("queryStringParameters") or {}
    slug = qs.get("slug", "").strip()
    if not slug:
        return err("Не передан slug зоны")

    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)

        energy_err = check_and_spend_energy(event, conn, "cheat_sheet")
        if energy_err:
            return energy_err

        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"SELECT * FROM {tbl('lk_body_zones')} WHERE slug=%s", (slug,)
        )
        zone = cur.fetchone()
        if not zone:
            return err("Зона не найдена", 404)

        cur.execute(
            f"SELECT title, description, video_url, sort_order FROM {tbl('lk_body_techniques')} "
            f"WHERE zone_id=%s ORDER BY sort_order",
            (zone["id"],)
        )
        techniques = [dict(t) for t in cur.fetchall()]
        return ok({"zone": dict(zone), "techniques": techniques})
    finally:
        conn.close()


# ── История сгенерированных изображений ──────────────────────────────────────

def handle_image_history(event: dict) -> dict:
    """Получить последние 20 сгенерированных изображений пользователя."""
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"SELECT id, url, prompt, aspect_ratio, created_at FROM {tbl('ai_generated_images')} "
            f"WHERE user_id = %s ORDER BY created_at DESC LIMIT 20",
            (user["id"],)
        )
        return ok([dict(r) for r in cur.fetchall()])
    finally:
        conn.close()


def handle_image_delete(event: dict) -> dict:
    """Удалить изображение из истории по id."""
    body = json.loads(event.get("body") or "{}")
    image_id = body.get("id")
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        cur = conn.cursor()
        cur.execute(
            f"UPDATE {tbl('ai_generated_images')} SET url='' WHERE id=%s AND user_id=%s",
            (image_id, user["id"])
        )
        conn.commit()
        return ok({"ok": True})
    finally:
        conn.close()


# ── Аудит салона ─────────────────────────────────────────────────────────────

def handle_audit_save(event: dict) -> dict:
    """Сохранить анкету аудита и результат ИИ."""
    body = json.loads(event.get("body") or "{}")
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        energy_err = check_and_spend_energy(event, conn, "salon_audit")
        if energy_err: return energy_err
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        answers = body.get("answers", {})
        result  = body.get("result")
        audit_id = body.get("id")
        scores = {k: body.get(k) for k in ("score_clients","score_marketing","score_sales","score_staff","score_management","score_total")}
        status = "completed" if result else "draft"
        if audit_id:
            cur.execute(
                f"""UPDATE {tbl('salon_audits')} SET
                    answers=%s, result=%s, status=%s, updated_at=NOW(),
                    score_clients=%s, score_marketing=%s, score_sales=%s,
                    score_staff=%s, score_management=%s, score_total=%s
                WHERE id=%s AND user_id=%s RETURNING id""",
                (json.dumps(answers), json.dumps(result) if result else None, status,
                 scores["score_clients"], scores["score_marketing"], scores["score_sales"],
                 scores["score_staff"], scores["score_management"], scores["score_total"],
                 audit_id, user["id"])
            )
            row = cur.fetchone()
            audit_id = row["id"] if row else audit_id
        else:
            cur.execute(
                f"""INSERT INTO {tbl('salon_audits')}
                    (user_id, salon_id, answers, result, status,
                     score_clients, score_marketing, score_sales, score_staff, score_management, score_total)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id""",
                (user["id"], user.get("salon_id"), json.dumps(answers),
                 json.dumps(result) if result else None, status,
                 scores["score_clients"], scores["score_marketing"], scores["score_sales"],
                 scores["score_staff"], scores["score_management"], scores["score_total"])
            )
            audit_id = cur.fetchone()["id"]
        conn.commit()
        return ok({"ok": True, "id": audit_id})
    finally:
        conn.close()


def handle_audit_history(event: dict) -> dict:
    """История аудитов пользователя (последние 10)."""
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"""SELECT id, status, score_total, score_clients, score_marketing,
                score_sales, score_staff, score_management, created_at
                FROM {tbl('salon_audits')} WHERE user_id=%s AND status='completed'
                ORDER BY created_at DESC LIMIT 10""",
            (user["id"],)
        )
        return ok([dict(r) for r in cur.fetchall()])
    finally:
        conn.close()


def handle_audit_get(event: dict) -> dict:
    """Получить конкретный аудит по id."""
    qs = event.get("queryStringParameters") or {}
    audit_id = qs.get("id")
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"SELECT * FROM {tbl('salon_audits')} WHERE id=%s AND user_id=%s",
            (audit_id, user["id"])
        )
        row = cur.fetchone()
        if not row:
            return err("Не найдено", 404)
        return ok(dict(row))
    finally:
        conn.close()


# ── Профиль салона ───────────────────────────────────────────────────────────

def handle_salon_profile_get(event: dict) -> dict:
    """Получить профиль салона текущего пользователя."""
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        salon_id = user.get("salon_id")
        if not salon_id:
            return ok({"salon": None, "services": []})
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(f"SELECT * FROM {tbl('salons')} WHERE id = %s", (salon_id,))
        salon = cur.fetchone()
        if not salon:
            return ok({"salon": None, "services": []})
        cur.execute(
            f"SELECT * FROM {tbl('salon_services')} WHERE salon_id = %s ORDER BY sort_order, id",
            (salon_id,)
        )
        services = [dict(r) for r in cur.fetchall()]
        return ok({"salon": dict(salon), "services": services})
    finally:
        conn.close()


def handle_salon_profile_save(event: dict) -> dict:
    """Сохранить профиль салона (создать или обновить). Только для owner."""
    body = json.loads(event.get("body") or "{}")
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)

        name = (body.get("name") or "").strip()
        if not name:
            return err("Укажите название салона")

        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        salon_id = user.get("salon_id")
        if salon_id:
            cur.execute(
                f"""UPDATE {tbl('salons')} SET
                    name=%s, city=%s, address=%s, description=%s,
                    avg_check=%s, monthly_revenue=%s, clients_count=%s, masters_count=%s,
                    target_audience=%s, tone_of_voice=%s,
                    social_instagram=%s, social_vk=%s, social_telegram=%s, main_goal=%s,
                    has_medical_license=%s, website_url=%s,
                    updated_at=NOW()
                WHERE id=%s""",
                (
                    name,
                    body.get("city"), body.get("address"), body.get("description"),
                    body.get("avg_check") or None, body.get("monthly_revenue") or None,
                    body.get("clients_count") or None, body.get("masters_count") or None,
                    body.get("target_audience"), body.get("tone_of_voice"),
                    body.get("social_instagram"), body.get("social_vk"), body.get("social_telegram"),
                    body.get("main_goal"),
                    bool(body.get("has_medical_license", False)),
                    body.get("website_url") or None,
                    salon_id,
                )
            )
        else:
            cur.execute(
                f"""INSERT INTO {tbl('salons')}
                    (owner_id, name, city, address, description,
                     avg_check, monthly_revenue, clients_count, masters_count,
                     target_audience, tone_of_voice,
                     social_instagram, social_vk, social_telegram, main_goal,
                     has_medical_license, website_url)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id""",
                (
                    user["id"], name,
                    body.get("city"), body.get("address"), body.get("description"),
                    body.get("avg_check") or None, body.get("monthly_revenue") or None,
                    body.get("clients_count") or None, body.get("masters_count") or None,
                    body.get("target_audience"), body.get("tone_of_voice"),
                    body.get("social_instagram"), body.get("social_vk"), body.get("social_telegram"),
                    body.get("main_goal"),
                    bool(body.get("has_medical_license", False)),
                    body.get("website_url") or None,
                )
            )
            salon_id = cur.fetchone()["id"]
            cur.execute(
                f"UPDATE {tbl('lk_users')} SET salon_id=%s, role='owner' WHERE id=%s",
                (salon_id, user["id"])
            )

            # Приветственный бонус 100 ⚡ — только если ещё не получал
            welcome_bonus = False
            if not user.get("welcome_bonus_given"):
                WELCOME_BONUS = 100
                cur.execute(
                    f"UPDATE {tbl('salons')} SET credits_balance=%s WHERE id=%s",
                    (WELCOME_BONUS, salon_id)
                )
                cur.execute(
                    f"INSERT INTO {tbl('credit_transactions')} "
                    f"(salon_id, user_id, action, amount, tool_key, type) "
                    f"VALUES (%s,%s,'Приветственный подарок 🎁',%s,NULL,'credit')",
                    (salon_id, user["id"], WELCOME_BONUS)
                )
                cur.execute(
                    f"UPDATE {tbl('lk_users')} SET welcome_bonus_given=TRUE WHERE id=%s",
                    (user["id"],)
                )
                welcome_bonus = True

        # Сохраняем услуги (полная замена)
        services = body.get("services", [])
        cur.execute(f"SELECT id FROM {tbl('salon_services')} WHERE salon_id = %s", (salon_id,))
        existing_ids = {r["id"] for r in cur.fetchall()}
        incoming_ids = {s["id"] for s in services if s.get("id")}

        # Удаляем убранные (через UPDATE is_deleted не нужен, просто ставим пустое название)
        for old_id in existing_ids - incoming_ids:
            cur.execute(f"UPDATE {tbl('salon_services')} SET name='' WHERE id=%s", (old_id,))

        for i, svc in enumerate(services):
            svc_name = (svc.get("name") or "").strip()
            if not svc_name:
                continue
            if svc.get("id") and svc["id"] in existing_ids:
                cur.execute(
                    f"UPDATE {tbl('salon_services')} SET name=%s, price_min=%s, price_max=%s, duration_min=%s, sort_order=%s WHERE id=%s",
                    (svc_name, svc.get("price_min") or None, svc.get("price_max") or None,
                     svc.get("duration_min") or None, i, svc["id"])
                )
            else:
                cur.execute(
                    f"INSERT INTO {tbl('salon_services')} (salon_id, name, price_min, price_max, duration_min, sort_order) VALUES (%s,%s,%s,%s,%s,%s)",
                    (salon_id, svc_name, svc.get("price_min") or None, svc.get("price_max") or None,
                     svc.get("duration_min") or None, i)
                )

        conn.commit()
        return ok({"ok": True, "salon_id": salon_id, "welcome_bonus": locals().get("welcome_bonus", False)})
    finally:
        conn.close()


def handle_salon_logo_upload(event: dict) -> dict:
    """Загрузить логотип салона в S3. Принимает base64 в JSON."""
    import base64
    import boto3
    import mimetypes
    body = json.loads(event.get("body") or "{}")
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        salon_id = user.get("salon_id")
        if not salon_id:
            return err("Сначала создайте профиль салона")

        file_b64 = body.get("file_base64", "")
        file_name = body.get("file_name", "logo.png")
        if not file_b64:
            return err("Файл не передан")

        data = base64.b64decode(file_b64)
        ext = file_name.rsplit(".", 1)[-1].lower() if "." in file_name else "png"
        content_type = mimetypes.types_map.get(f".{ext}", "image/png")
        key = f"salons/{salon_id}/logo.{ext}"

        s3 = boto3.client(
            "s3",
            endpoint_url="https://bucket.poehali.dev",
            aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
            aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
        )
        s3.put_object(Bucket="files", Key=key, Body=data, ContentType=content_type)
        logo_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"

        cur = conn.cursor()
        cur.execute(f"UPDATE {tbl('salons')} SET logo_url=%s, updated_at=NOW() WHERE id=%s", (logo_url, salon_id))
        conn.commit()
        return ok({"ok": True, "logo_url": logo_url})
    finally:
        conn.close()


# ── Роутер ───────────────────────────────────────────────────────────────────

# ── Анализ персонала ─────────────────────────────────────────────────────────

def _calc_employee_score(emp: dict, avg_revenue: float, avg_check: float) -> dict:
    """Считает Employee Score и Loss Index по формуле из ТЗ."""
    revenue       = float(emp.get("revenue") or 0)
    check         = float(emp.get("avg_check") or 0)
    clients       = float(emp.get("clients_count") or 1)
    return_pct    = float(emp.get("return_pct") or 0) / 100
    rebooking_pct = float(emp.get("rebooking_pct") or 0) / 100
    service_score = float(emp.get("service_score") or 5) / 10

    # Нормализуем (0–1)
    rev_index    = min(revenue / avg_revenue, 2) / 2 if avg_revenue > 0 else 0.5
    check_index  = min(check / avg_check, 2) / 2 if avg_check > 0 else 0.5
    retention    = return_pct
    rebooking    = rebooking_pct

    # Employee Score (0–100)
    score = round((
        rev_index    * 0.40 +
        retention    * 0.25 +
        check_index  * 0.15 +
        rebooking    * 0.10 +
        service_score * 0.10
    ) * 100)
    score = max(0, min(100, score))

    # Loss Index (потери в рублях)
    # 1. Потери от низкого возврата
    ideal_return = 0.70
    actual_return = return_pct
    loss_return = max(0, (ideal_return - actual_return) * clients * check)

    # 2. Потери от низкого чека
    loss_check = max(0, (avg_check - check) * clients) if avg_check > check else 0

    # 3. Потери от слабых допродаж
    has_upsell = bool(emp.get("has_upsell"))
    loss_upsell = revenue * 0.15 if not has_upsell else 0

    total_loss = round(loss_return + loss_check + loss_upsell)

    # Потенциал роста
    potential = round(
        (ideal_return - actual_return) * clients * check * 0.5 +
        loss_check * 0.5 +
        loss_upsell * 0.5
    )

    # Категория
    if score >= 80:   category = "star"
    elif score >= 60: category = "strong"
    elif score >= 40: category = "average"
    else:             category = "problem"

    return {
        "score": score,
        "category": category,
        "loss_return":  round(loss_return),
        "loss_check":   round(loss_check),
        "loss_upsell":  round(loss_upsell),
        "total_loss":   total_loss,
        "potential":    potential,
    }


def handle_staff_analyze(event: dict) -> dict:
    """Анализирует персонал салона: считает метрики и генерирует ИИ-отчёт."""
    body = json.loads(event.get("body") or "{}")
    staff = body.get("staff", [])
    if not staff or len(staff) == 0:
        return err("Добавьте хотя бы одного сотрудника")
    if len(staff) > 15:
        return err("Максимум 15 сотрудников за раз")

    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        energy_err = check_and_spend_energy(event, conn, "staff_audit")
        if energy_err: return energy_err

        salon = _get_salon_ctx(user, conn, ("name", "avg_check", "monthly_revenue"))
        salon_avg_revenue = float(salon["monthly_revenue"] or 0) / max(len(staff), 1) if salon and salon.get("monthly_revenue") else 0
        salon_avg_check   = float(salon["avg_check"] or 0) if salon and salon.get("avg_check") else 0

        # Считаем средние по введённым данным если нет данных салона
        revenues = [float(e.get("revenue") or 0) for e in staff if e.get("revenue")]
        checks   = [float(e.get("avg_check") or 0) for e in staff if e.get("avg_check")]
        avg_rev   = (sum(revenues) / len(revenues)) if revenues else salon_avg_revenue or 1
        avg_check = (sum(checks) / len(checks)) if checks else salon_avg_check or 1

        # Рассчитываем метрики по каждому
        scored = []
        for emp in staff:
            metrics = _calc_employee_score(emp, avg_rev, avg_check)
            scored.append({**emp, **metrics})

        total_loss = sum(e["total_loss"] for e in scored)
        total_potential = sum(e["potential"] for e in scored)
        stars   = [e for e in scored if e["category"] == "star"]
        problem = [e for e in scored if e["category"] == "problem"]
        avg_score = round(sum(e["score"] for e in scored) / len(scored))

        # ИИ-текст
        staff_summary = "\n".join([
            f"- {e.get('name','Сотрудник')}: роль={e.get('role','')}, выручка={e.get('revenue',0)}₽, "
            f"чек={e.get('avg_check',0)}₽, возврат={e.get('return_pct',0)}%, "
            f"Score={e['score']}, потери={e['total_loss']}₽"
            for e in scored
        ])
        salon_name = salon["name"] if salon and salon.get("name") else "салон"

        prompt = (
            f"Ты бизнес-консультант по салонам красоты. Сделай финансовый разбор команды.\n\n"
            f"Салон: {salon_name}\n"
            f"Сотрудников: {len(scored)}\n"
            f"Средний Employee Score: {avg_score}/100\n"
            f"Общие потери в месяц: {total_loss:,} ₽\n"
            f"Потенциал роста: +{total_potential:,} ₽/мес\n\n"
            f"Данные по сотрудникам:\n{staff_summary}\n\n"
            f"Напиши отчёт в 4 блоках:\n\n"
            f"1. ОБЩАЯ КАРТИНА (2-3 предложения — что происходит с командой в целом)\n\n"
            f"2. ГЛАВНАЯ ПРОБЛЕМА (1 ключевая проблема команды с цифрами)\n\n"
            f"3. ТОП-3 ДЕЙСТВИЯ (конкретные шаги для быстрого роста выручки, каждое с оценкой эффекта в ₽)\n\n"
            f"4. ПО КАЖДОМУ СОТРУДНИКУ (для каждого: 1 сильная сторона + 1 конкретное действие)\n\n"
            f"Пиши как личный советник владельца — прямо, конкретно, с цифрами. Без воды."
        )
        ai_text = _call_ai_text([
            {"role": "system", "content": "Ты финансовый консультант по бьюти-бизнесу. Даёшь конкретные советы с цифрами."},
            {"role": "user", "content": prompt}
        ], max_tokens=1500)

        result = {
            "staff": scored,
            "summary": {
                "avg_score": avg_score,
                "total_loss": total_loss,
                "total_potential": total_potential,
                "stars_count":   len(stars),
                "problem_count": len(problem),
            },
            "ai_text": ai_text,
        }

        # Сохраняем в БД
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO {tbl('staff_audits')} (user_id, salon_id, staff_data, result) VALUES (%s,%s,%s,%s) RETURNING id",
            (user["id"], user.get("salon_id"), json.dumps(staff), json.dumps(result))
        )
        audit_id = cur.fetchone()[0]
        conn.commit()

        return ok({"id": audit_id, "result": result})
    finally:
        conn.close()


def handle_staff_audit_history(event: dict) -> dict:
    """История анализов персонала."""
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"SELECT id, result->>'summary' as summary_json, created_at FROM {tbl('staff_audits')} "
            f"WHERE user_id=%s ORDER BY created_at DESC LIMIT 10",
            (user["id"],)
        )
        rows = []
        for r in cur.fetchall():
            d = dict(r)
            try:
                d["summary"] = json.loads(d.pop("summary_json") or "{}")
            except Exception:
                d["summary"] = {}
            rows.append(d)
        return ok(rows)
    finally:
        conn.close()


def handle_staff_audit_get(event: dict) -> dict:
    """Получить конкретный анализ персонала."""
    qs = event.get("queryStringParameters") or {}
    audit_id = qs.get("id")
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"SELECT * FROM {tbl('staff_audits')} WHERE id=%s AND user_id=%s",
            (audit_id, user["id"])
        )
        row = cur.fetchone()
        if not row:
            return err("Не найдено", 404)
        return ok(dict(row))
    finally:
        conn.close()


# ── Команда / приглашения ─────────────────────────────────────────────────────

# Права по умолчанию для каждой роли
ROLE_DEFAULT_PERMISSIONS = {
    "owner": {
        "ai_tools": True, "analytics": True, "finance": True,
        "team": True, "salon_profile": True, "diagnostics": True,
    },
    "admin": {
        "ai_tools": True, "analytics": False, "finance": False,
        "team": False, "salon_profile": False, "diagnostics": True,
    },
    "master": {
        "ai_tools": True, "analytics": False, "finance": False,
        "team": False, "salon_profile": False, "diagnostics": True,
    },
    "body_specialist": {
        "ai_tools": True, "analytics": False, "finance": False,
        "team": False, "salon_profile": False, "diagnostics": True,
    },
}

ROLE_LABELS = {
    "owner": "Владелец", "admin": "Администратор",
    "master": "Мастер", "body_specialist": "Специалист по телу",
}


def _require_owner(user: dict, conn) -> dict | None:
    """Возвращает salon если пользователь — владелец, иначе None."""
    if user.get("role") != "owner" or not user.get("salon_id"):
        return None
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT * FROM {tbl('salons')} WHERE id=%s AND owner_id=%s", (user["salon_id"], user["id"]))
    return cur.fetchone()


def _send_invite_email(to_email: str, full_name: str, salon_name: str, role_label: str, invite_url: str) -> None:
    """Отправляет письмо-приглашение сотруднику через SMTP Mail.ru."""
    import smtplib
    import ssl
    from email.mime.multipart import MIMEMultipart
    from email.mime.text import MIMEText
    from email.header import Header

    smtp_password = os.environ.get("SMTP_PASSWORD", "")
    if not smtp_password:
        return

    sender = "massopro@mail.ru"
    subject = f"Priglashenie v komandu - Pro Dialog"

    html = f"""<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f0;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:520px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#1a9fae,#136e7a);padding:28px 32px;">
      <div style="font-size:22px;font-weight:800;color:#fff;">Pro Dialog</div>
    </div>
    <div style="padding:32px 32px 24px;">
      <p style="font-size:16px;font-weight:700;color:#1a1a1a;margin:0 0 8px;">
        {full_name}, vas priglashayut v komandu!
      </p>
      <p style="font-size:14px;color:#555;line-height:1.7;margin:0 0 8px;">
        Salon: <strong>{salon_name}</strong>
      </p>
      <p style="font-size:14px;color:#555;line-height:1.7;margin:0 0 20px;">
        Rol: <strong>{role_label}</strong>
      </p>
      <a href="{invite_url}"
         style="display:inline-block;background:#1a9fae;color:#fff;text-decoration:none;
                font-size:14px;font-weight:700;padding:14px 28px;border-radius:12px;">
        Prinyat priglashenie
      </a>
      <p style="font-size:12px;color:#aaa;margin:20px 0 0;line-height:1.6;">
        Ssylka deystvitelna 7 dney.<br>
        Esli knopka ne rabotaet, skopiruyte adres:<br>
        <a href="{invite_url}" style="color:#1a9fae;word-break:break-all;">{invite_url}</a>
      </p>
    </div>
    <div style="padding:16px 32px;background:#f8f8f5;border-top:1px solid #eee;">
      <p style="font-size:11px;color:#bbb;margin:0;">Pro Dialog — platforma dlya byuti-biznesa</p>
    </div>
  </div>
</body>
</html>"""

    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"]    = f"Pro Dialog <{sender}>"
    msg["To"]      = to_email
    msg["MIME-Version"] = "1.0"
    msg.attach(MIMEText(html, "html", "utf-8"))

    ctx = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.mail.ru", 465, context=ctx) as srv:
        srv.login(sender, smtp_password)
        srv.sendmail(sender, [to_email], msg.as_string())


def handle_team_invite(event: dict) -> dict:
    """Владелец создаёт приглашение для сотрудника."""
    body      = json.loads(event.get("body") or "{}")
    full_name = (body.get("full_name") or "").strip()
    email     = (body.get("email") or "").strip().lower()
    phone     = (body.get("phone") or "").strip()
    role_code = (body.get("role_code") or "master").strip()

    if not full_name:
        return err("Укажите имя сотрудника")
    if role_code not in ROLE_DEFAULT_PERMISSIONS or role_code == "owner":
        return err("Недопустимая роль")

    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        salon = _require_owner(user, conn)
        if not salon:
            return err("Только владелец салона может приглашать сотрудников", 403)

        token = secrets.token_urlsafe(32)
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO {tbl('salon_invites')} (salon_id, invited_by, token, full_name, email, phone, role_code) "
            f"VALUES (%s,%s,%s,%s,%s,%s,%s) RETURNING id",
            (salon["id"], user["id"], token, full_name, email or None, phone or None, role_code)
        )
        invite_id = cur.fetchone()[0]
        conn.commit()

        invite_url  = f"https://promtdialog.ru/join?token={token}"
        salon_name  = salon.get("name") or "салон"
        role_label  = ROLE_LABELS.get(role_code, role_code)
        email_sent  = False

        email_error = None
        if email:
            try:
                _send_invite_email(email, full_name, salon_name, role_label, invite_url)
                email_sent = True
            except Exception as ex:
                email_error = str(ex)
                print(f"[team_invite] email error to {email}: {ex}")

        return ok({
            "id": invite_id, "token": token,
            "invite_url": invite_url,
            "full_name": full_name, "role_code": role_code,
            "email_sent": email_sent,
            "email_error": email_error,
        })
    finally:
        conn.close()


def handle_team_list(event: dict) -> dict:
    """Список участников команды + активные приглашения."""
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        salon = _require_owner(user, conn)
        if not salon:
            return err("Только владелец может просматривать команду", 403)

        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        # Участники
        cur.execute(
            f"SELECT sm.id, sm.user_id, sm.role_code, sm.permissions, sm.monthly_credit_limit, sm.is_active, sm.joined_at, "
            f"u.full_name, u.email, u.username "
            f"FROM {tbl('salon_members')} sm "
            f"JOIN {tbl('lk_users')} u ON u.id = sm.user_id "
            f"WHERE sm.salon_id=%s ORDER BY sm.joined_at",
            (salon["id"],)
        )
        members = [dict(r) for r in cur.fetchall()]

        # Ожидающие приглашения
        cur.execute(
            f"SELECT id, token, full_name, email, phone, role_code, status, created_at, expires_at "
            f"FROM {tbl('salon_invites')} "
            f"WHERE salon_id=%s AND status='pending' AND expires_at > NOW() ORDER BY created_at DESC",
            (salon["id"],)
        )
        invites = [dict(r) for r in cur.fetchall()]

        # Баланс
        credits = salon.get("credits_balance", 0)
        return ok({"members": members, "invites": invites, "credits_balance": credits})
    finally:
        conn.close()


def handle_team_member_update(event: dict) -> dict:
    """Владелец меняет роль / права / лимит сотруднику."""
    body       = json.loads(event.get("body") or "{}")
    member_id  = body.get("member_id")
    role_code  = body.get("role_code")
    permissions = body.get("permissions")   # dict или None
    limit      = body.get("monthly_credit_limit")  # int или None

    if not member_id:
        return err("Не передан member_id")

    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        salon = _require_owner(user, conn)
        if not salon:
            return err("Нет прав", 403)

        # Проверяем что member принадлежит этому салону
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(f"SELECT * FROM {tbl('salon_members')} WHERE id=%s AND salon_id=%s", (member_id, salon["id"]))
        member = cur.fetchone()
        if not member:
            return err("Сотрудник не найден", 404)

        sets, vals = [], []
        if role_code and role_code in ROLE_DEFAULT_PERMISSIONS and role_code != "owner":
            sets.append("role_code=%s"); vals.append(role_code)
            # Обновляем роль и в lk_users
            cur.execute(f"UPDATE {tbl('lk_users')} SET role=%s WHERE id=%s", (role_code, member["user_id"]))
        if permissions is not None:
            sets.append("permissions=%s"); vals.append(json.dumps(permissions))
        if limit is not None:
            sets.append("monthly_credit_limit=%s"); vals.append(limit if limit > 0 else None)

        if sets:
            vals += [member_id]
            cur.execute(f"UPDATE {tbl('salon_members')} SET {','.join(sets)} WHERE id=%s", vals)
            conn.commit()

        return ok({"ok": True})
    finally:
        conn.close()


def handle_team_member_remove(event: dict) -> dict:
    """Владелец удаляет сотрудника из команды (деактивирует, не удаляет пользователя)."""
    body      = json.loads(event.get("body") or "{}")
    member_id = body.get("member_id")
    if not member_id:
        return err("Не передан member_id")

    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        salon = _require_owner(user, conn)
        if not salon:
            return err("Нет прав", 403)

        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(f"SELECT * FROM {tbl('salon_members')} WHERE id=%s AND salon_id=%s", (member_id, salon["id"]))
        member = cur.fetchone()
        if not member:
            return err("Сотрудник не найден", 404)

        # Деактивируем, не удаляем
        cur.execute(f"UPDATE {tbl('salon_members')} SET is_active=FALSE WHERE id=%s", (member_id,))
        # Отвязываем пользователя от салона
        cur.execute(f"UPDATE {tbl('lk_users')} SET salon_id=NULL WHERE id=%s", (member["user_id"],))
        conn.commit()
        return ok({"ok": True})
    finally:
        conn.close()


def handle_invite_cancel(event: dict) -> dict:
    """Владелец отзывает/удаляет pending-приглашение."""
    body      = json.loads(event.get("body") or "{}")
    invite_id = body.get("invite_id")
    if not invite_id:
        return err("Не передан invite_id")

    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        salon = _require_owner(user, conn)
        if not salon:
            return err("Нет прав", 403)

        cur = conn.cursor()
        cur.execute(
            f"UPDATE {tbl('salon_invites')} SET status='cancelled' "
            f"WHERE id=%s AND salon_id=%s AND status='pending'",
            (invite_id, salon["id"])
        )
        conn.commit()
        return ok({"ok": True})
    finally:
        conn.close()


def handle_invite_info(event: dict) -> dict:
    """Публичная: информация по токену приглашения (без авторизации)."""
    qs    = event.get("queryStringParameters") or {}
    token = qs.get("token", "").strip()
    if not token:
        return err("Токен не передан")

    conn = get_db()
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"SELECT i.*, s.name AS salon_name, s.logo_url AS salon_logo "
            f"FROM {tbl('salon_invites')} i "
            f"JOIN {tbl('salons')} s ON s.id = i.salon_id "
            f"WHERE i.token=%s",
            (token,)
        )
        invite = cur.fetchone()
        if not invite:
            return err("Приглашение не найдено", 404)
        if invite["status"] != "pending":
            return err("Это приглашение уже использовано или недействительно", 410)
        if invite["expires_at"] < datetime.now(timezone.utc):
            return err("Срок действия приглашения истёк", 410)

        return ok({
            "full_name":   invite["full_name"],
            "role_code":   invite["role_code"],
            "role_label":  ROLE_LABELS.get(invite["role_code"], invite["role_code"]),
            "salon_name":  invite["salon_name"],
            "salon_logo":  invite["salon_logo"],
            "expires_at":  str(invite["expires_at"]),
        })
    finally:
        conn.close()


def handle_invite_accept(event: dict) -> dict:
    """Сотрудник принимает приглашение: создаётся аккаунт или привязывается существующий."""
    body     = json.loads(event.get("body") or "{}")
    token    = (body.get("token") or "").strip()
    username = (body.get("username") or "").strip().lower()
    password = (body.get("password") or "")
    full_name_override = (body.get("full_name") or "").strip()
    email_input = (body.get("email") or "").strip().lower()

    if not token:
        return err("Токен не передан")
    if not username or not password:
        return err("Введите логин и пароль")
    if len(password) < 6:
        return err("Пароль не менее 6 символов")

    conn = get_db()
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"SELECT i.*, s.name AS salon_name FROM {tbl('salon_invites')} i "
            f"JOIN {tbl('salons')} s ON s.id = i.salon_id "
            f"WHERE i.token=%s AND i.status='pending' AND i.expires_at > NOW()",
            (token,)
        )
        invite = cur.fetchone()
        if not invite:
            return err("Приглашение недействительно или истекло", 410)

        # Проверяем уникальность логина
        cur.execute(f"SELECT id FROM {tbl('lk_users')} WHERE username=%s", (username,))
        if cur.fetchone():
            return err("Логин уже занят, выберите другой")

        full_name = full_name_override or invite["full_name"] or username
        pw_hash   = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
        role_code = invite["role_code"]
        salon_id  = invite["salon_id"]
        email     = email_input or f"{username}_{invite['id']}@invited.local"

        # Создаём пользователя
        cur.execute(
            f"INSERT INTO {tbl('lk_users')} (username, email, password_hash, full_name, role, salon_id, is_active, segment) "
            f"VALUES (%s,%s,%s,%s,%s,%s,TRUE,'salon') RETURNING id",
            (username, email, pw_hash, full_name, role_code, salon_id)
        )
        new_user_id = cur.fetchone()["id"]

        # Добавляем в salon_members
        default_perms = ROLE_DEFAULT_PERMISSIONS.get(role_code, {})
        cur.execute(
            f"INSERT INTO {tbl('salon_members')} (salon_id, user_id, role_code, invited_by, permissions) "
            f"VALUES (%s,%s,%s,%s,%s) "
            f"ON CONFLICT (salon_id, user_id) DO UPDATE SET role_code=EXCLUDED.role_code, is_active=TRUE",
            (salon_id, new_user_id, role_code, invite["invited_by"], json.dumps(default_perms))
        )

        # Закрываем приглашение
        cur.execute(
            f"UPDATE {tbl('salon_invites')} SET status='accepted', used_by=%s WHERE id=%s",
            (new_user_id, invite["id"])
        )
        conn.commit()

        # Автоматически входим
        session_id = secrets.token_hex(32)
        ua = (event.get("headers") or {}).get("User-Agent", "")
        cur.execute(
            f"INSERT INTO {tbl('lk_sessions')} (id, user_id, user_agent) VALUES (%s,%s,%s)",
            (session_id, new_user_id, ua)
        )
        conn.commit()

        return ok({
            "session_id": session_id,
            "user": {
                "id": new_user_id, "username": username, "full_name": full_name,
                "role": role_code, "salon_id": salon_id,
                "salon": {"id": salon_id, "name": invite["salon_name"]},
                "is_admin": False, "segment": "salon",
            }
        })
    finally:
        conn.close()


def handle_credits_history(event: dict) -> dict:
    """История расхода кредитов по команде (для владельца)."""
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        salon = _require_owner(user, conn)
        if not salon:
            return err("Нет прав", 403)

        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"SELECT ct.id, ct.action, ct.amount, ct.created_at, u.full_name "
            f"FROM {tbl('credit_transactions')} ct "
            f"JOIN {tbl('lk_users')} u ON u.id = ct.user_id "
            f"WHERE ct.salon_id=%s ORDER BY ct.created_at DESC LIMIT 50",
            (salon["id"],)
        )
        rows = [dict(r) for r in cur.fetchall()]
        return ok({"transactions": rows, "credits_balance": salon.get("credits_balance", 0)})
    finally:
        conn.close()


def handle_member_course_access_get(event: dict) -> dict:
    """Получить список купленных курсов салона + у каких сотрудников есть доступ."""
    qs = event.get("queryStringParameters") or {}
    member_id = qs.get("member_id")
    if not member_id:
        return err("Не передан member_id")

    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        salon = _require_owner(user, conn)
        if not salon:
            return err("Нет прав", 403)

        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        # Проверяем что member принадлежит этому салону
        cur.execute(f"SELECT id FROM {tbl('salon_members')} WHERE id=%s AND salon_id=%s", (member_id, salon["id"]))
        if not cur.fetchone():
            return err("Сотрудник не найден", 404)

        # Все купленные курсы салона (course_access владельца)
        cur.execute(
            f"SELECT c.id, c.title, c.category "
            f"FROM {tbl('courses')} c "
            f"JOIN {tbl('course_access')} ca ON ca.course_id = c.id "
            f"WHERE ca.user_id = %s "
            f"ORDER BY c.sort_order, c.id",
            (salon["owner_id"],)
        )
        courses = [dict(r) for r in cur.fetchall()]

        # Какие курсы уже выданы этому сотруднику
        cur.execute(
            f"SELECT course_id FROM {tbl('member_course_access')} WHERE member_id=%s",
            (member_id,)
        )
        granted = {r["course_id"] for r in cur.fetchall()}

        for c in courses:
            c["granted"] = c["id"] in granted

        return ok({"courses": courses})
    finally:
        conn.close()


def handle_member_course_access_set(event: dict) -> dict:
    """Владелец выдаёт или отзывает доступ сотрудника к курсу."""
    body = json.loads(event.get("body") or "{}")
    member_id = body.get("member_id")
    course_id = body.get("course_id")
    granted = body.get("granted")

    if not member_id or not course_id or granted is None:
        return err("Не переданы member_id, course_id или granted")

    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        salon = _require_owner(user, conn)
        if not salon:
            return err("Нет прав", 403)

        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        # Проверяем что member принадлежит этому салону
        cur.execute(f"SELECT id FROM {tbl('salon_members')} WHERE id=%s AND salon_id=%s", (member_id, salon["id"]))
        if not cur.fetchone():
            return err("Сотрудник не найден", 404)

        if granted:
            cur.execute(
                f"INSERT INTO {tbl('member_course_access')} (member_id, course_id, granted_by) "
                f"VALUES (%s, %s, %s) ON CONFLICT (member_id, course_id) DO UPDATE SET granted_by=%s",
                (member_id, course_id, user["id"], user["id"])
            )
        else:
            cur.execute(
                f"UPDATE {tbl('member_course_access')} SET granted_by=granted_by "
                f"WHERE member_id=%s AND course_id=%s AND 1=2",
                (member_id, course_id)
            )
            cur_del = conn.cursor()
            cur_del.execute(
                f"DELETE FROM {tbl('member_course_access')} WHERE member_id=%s AND course_id=%s",
                (member_id, course_id)
            )

        conn.commit()
        return ok({"ok": True})
    finally:
        conn.close()


# ── Скрипты общения с клиентом ───────────────────────────────────────────────

def handle_script_generate(event: dict) -> dict:
    """Генерирует скрипт диалога с клиентом по роли и описанию ситуации."""
    body      = json.loads(event.get("body") or "{}")
    role      = (body.get("role") or "").strip()
    situation = (body.get("situation") or "").strip()

    if not role:
        return err("Укажите роль сотрудника")
    if not situation:
        return err("Опишите ситуацию")
    if len(situation) > 1000:
        return err("Описание слишком длинное (максимум 1000 символов)")

    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        energy_err = check_and_spend_energy(event, conn, "client_scripts")
        if energy_err: return energy_err

        salon = _get_salon_ctx(user, conn, ("name", "target_audience", "tone_of_voice"))
        salon_name     = salon["name"] if salon and salon.get("name") else "салон красоты"
        salon_audience = salon.get("target_audience", "") if salon else ""

        ROLE_CONTEXT = {
            "admin":   "Администратор салона. Отвечает на звонки, записывает клиентов, встречает их, работает с возражениями и ценой.",
            "master":  "Мастер (специалист). Общается с клиентом во время процедуры: консультирует, допродаёт уход, предлагает повторную запись.",
            "manager": "Управляющий / директор. Решает конфликтные ситуации, работает с VIP-клиентами, разбирает жалобы и претензии.",
        }

        role_desc = ROLE_CONTEXT.get(role, role)

        prompt = (
            f"Ты — бизнес-тренер по сервису для салонов красоты.\n"
            f"Напиши готовый скрипт диалога с клиентом.\n\n"
            f"Салон: «{salon_name}»\n"
            + (f"Аудитория клиентов: {salon_audience}\n" if salon_audience else "")
            + f"Роль сотрудника: {role_desc}\n"
            f"Ситуация: {situation}\n\n"
            f"Требования к скрипту:\n"
            f"- Формат: пошаговый диалог с репликами сотрудника (выдели жирным: **Сотрудник:**)\n"
            f"- Добавь пометки в скобках: что делать, какую интонацию держать\n"
            f"- Включи 1–2 варианта ответа на возможные возражения клиента\n"
            f"- Завершай скрипт конкретным целевым действием (запись, допродажа, благодарность)\n"
            f"- Живой, человечный язык — никаких канцеляризмов\n"
            f"- На русском языке\n"
            f"- Только текст скрипта, без заголовков типа «Скрипт:»"
        )

        script = _call_ai_text([
            {"role": "system", "content": "Ты эксперт по клиентскому сервису в бьюти-бизнесе. Пишешь живые, практичные скрипты которые реально работают."},
            {"role": "user",   "content": prompt}
        ], max_tokens=800)

        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO {tbl('client_scripts')} (user_id, role, situation, script_text) VALUES (%s,%s,%s,%s) RETURNING id",
            (user["id"], role, situation, script)
        )
        row_id = cur.fetchone()[0]
        conn.commit()
        return ok({"script": script, "id": row_id})
    finally:
        conn.close()


def handle_script_history(event: dict) -> dict:
    """История сгенерированных скриптов."""
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"SELECT id, role, situation, script_text, created_at FROM {tbl('client_scripts')} "
            f"WHERE user_id=%s ORDER BY created_at DESC LIMIT 20",
            (user["id"],)
        )
        return ok([dict(r) for r in cur.fetchall()])
    finally:
        conn.close()


# ── Ответы на отзывы ─────────────────────────────────────────────────────────

def handle_review_reply(event: dict) -> dict:
    """Генерирует профессиональный ответ на отзыв клиента."""
    body = json.loads(event.get("body") or "{}")
    review_text = (body.get("review_text") or "").strip()
    sentiment   = body.get("sentiment") or "positive"
    tone        = body.get("tone") or "warm"
    platform    = body.get("platform") or None

    if not review_text:
        return err("Вставьте текст отзыва")
    if len(review_text) > 3000:
        return err("Отзыв слишком длинный (максимум 3000 символов)")

    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        energy_err = check_and_spend_energy(event, conn, "review_reply")
        if energy_err: return energy_err

        salon = _get_salon_ctx(user, conn, ("name", "target_audience", "tone_of_voice"))
        salon_name     = salon["name"] if salon and salon.get("name") else "наш салон"
        salon_audience = salon.get("target_audience", "") if salon else ""

        TONE_PROMPTS = {
            "professional": "Пиши официально и профессионально, без лишних эмоций. Чётко и по делу.",
            "warm":         "Пиши тепло, с заботой и личным отношением. Немного эмоций, но без пафоса.",
            "brief":        "Пиши очень кратко — 2–3 предложения. Только суть, без воды.",
        }
        SENTIMENT_HINTS = {
            "positive": "Это положительный отзыв. Поблагодари, выдели конкретный плюс из отзыва, пригласи снова.",
            "negative": "Это негативный отзыв. Прими критику с достоинством, извинись, объясни что будет сделано, пригласи вернуться.",
            "neutral":  "Это нейтральный отзыв. Поблагодари за обратную связь, ответь на суть, пригласи снова.",
        }
        PLATFORM_HINTS = {
            "2gis":   "Площадка: 2ГИС. Лимит ответа — до 1000 символов. Будь краток.",
            "yandex": "Площадка: Яндекс Карты. Лимит — до 1000 символов. Официальный, живой тон.",
            "google": "Площадка: Google Maps. Лимит до 4096 символов, можно чуть подробнее.",
            "avito":  "Площадка: Авито. Лимит — до 2000 символов. Разговорный, живой стиль.",
        }
        platform_hint = PLATFORM_HINTS.get(platform, "") if platform else ""

        prompt = (
            f"Ты — менеджер по работе с клиентами салона красоты «{salon_name}».\n"
            + (f"Аудитория салона: {salon_audience}\n" if salon_audience else "")
            + f"\nОтзыв клиента:\n«{review_text}»\n\n"
            f"Задача: написать ответ от лица салона.\n\n"
            f"Тип отзыва: {SENTIMENT_HINTS.get(sentiment, '')}\n"
            f"Стиль: {TONE_PROMPTS.get(tone, '')}\n"
            + (f"{platform_hint}\n" if platform_hint else "")
            + f"\nТребования:\n"
            f"- Обращайся к клиенту уважительно (не называй по имени если оно не указано)\n"
            f"- Подпись: команда салона «{salon_name}» или просто название\n"
            f"- Без шаблонных фраз вроде «Уважаемый клиент» в начале\n"
            f"- На русском языке\n"
            f"- Только текст ответа, без заголовков и пояснений"
        )

        max_tok = 200 if tone == "brief" or platform in ("2gis", "yandex") else 500
        reply = _call_ai_text([
            {"role": "system", "content": "Ты эксперт по клиентскому сервису в бьюти-индустрии. Пишешь живые, человечные ответы на отзывы."},
            {"role": "user",   "content": prompt}
        ], max_tokens=max_tok)

        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO {tbl('review_replies')} (user_id, review_text, reply_text, sentiment, tone) "
            f"VALUES (%s,%s,%s,%s,%s) RETURNING id",
            (user["id"], review_text, reply, sentiment, tone)
        )
        row_id = cur.fetchone()[0]
        conn.commit()
        return ok({"reply": reply, "id": row_id})
    finally:
        conn.close()


def handle_review_reply_delete(event: dict) -> dict:
    """Удаляет запись из истории ответов на отзывы."""
    body    = json.loads(event.get("body") or "{}")
    item_id = body.get("id")
    if not item_id:
        return err("Не передан id")
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        cur = conn.cursor()
        cur.execute(
            f"DELETE FROM {tbl('review_replies')} WHERE id=%s AND user_id=%s",
            (item_id, user["id"])
        )
        conn.commit()
        return ok({"deleted": cur.rowcount > 0})
    finally:
        conn.close()


def handle_review_reply_history(event: dict) -> dict:
    """История ответов на отзывы."""
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"SELECT id, review_text, reply_text, sentiment, created_at "
            f"FROM {tbl('review_replies')} WHERE user_id=%s ORDER BY created_at DESC LIMIT 20",
            (user["id"],)
        )
        return ok([dict(r) for r in cur.fetchall()])
    finally:
        conn.close()


# ── Сотрудники салона (CRUD) ──────────────────────────────────────────────────

def handle_staff_list(event: dict) -> dict:
    """Список сотрудников салона."""
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"SELECT * FROM {tbl('salon_staff')} WHERE owner_id=%s AND is_active=TRUE ORDER BY created_at",
            (user["id"],)
        )
        return ok([dict(r) for r in cur.fetchall()])
    finally:
        conn.close()


def handle_staff_save(event: dict) -> dict:
    """Создать или обновить сотрудника."""
    body = json.loads(event.get("body") or "{}")
    name = (body.get("name") or "").strip()
    if not name:
        return err("Укажите имя сотрудника")
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        staff_id = body.get("id")
        fields = ("role","experience","clients_count","new_clients","return_pct",
                  "revenue","avg_check","has_upsell","rebooking_pct","has_rebooking_offer",
                  "service_score","has_sales_script")
        vals = {f: body.get(f) or None for f in fields}
        if staff_id:
            cur.execute(
                f"""UPDATE {tbl('salon_staff')} SET
                    name=%s, role=%s, experience=%s, clients_count=%s, new_clients=%s,
                    return_pct=%s, revenue=%s, avg_check=%s, has_upsell=%s,
                    rebooking_pct=%s, has_rebooking_offer=%s, service_score=%s,
                    has_sales_script=%s, updated_at=NOW()
                WHERE id=%s AND owner_id=%s RETURNING id""",
                (name, vals["role"], vals["experience"], vals["clients_count"], vals["new_clients"],
                 vals["return_pct"], vals["revenue"], vals["avg_check"], vals["has_upsell"],
                 vals["rebooking_pct"], vals["has_rebooking_offer"], vals["service_score"],
                 vals["has_sales_script"], staff_id, user["id"])
            )
        else:
            cur.execute(
                f"""INSERT INTO {tbl('salon_staff')}
                    (owner_id, salon_id, name, role, experience, clients_count, new_clients,
                     return_pct, revenue, avg_check, has_upsell, rebooking_pct,
                     has_rebooking_offer, service_score, has_sales_script)
                VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id""",
                (user["id"], user.get("salon_id"), name, vals["role"], vals["experience"],
                 vals["clients_count"], vals["new_clients"], vals["return_pct"],
                 vals["revenue"], vals["avg_check"], vals["has_upsell"],
                 vals["rebooking_pct"], vals["has_rebooking_offer"], vals["service_score"],
                 vals["has_sales_script"])
            )
        row = cur.fetchone()
        conn.commit()
        return ok({"ok": True, "id": row["id"] if row else staff_id})
    finally:
        conn.close()


def handle_staff_delete(event: dict) -> dict:
    """Мягкое удаление сотрудника."""
    body = json.loads(event.get("body") or "{}")
    staff_id = body.get("id")
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        cur = conn.cursor()
        cur.execute(
            f"UPDATE {tbl('salon_staff')} SET is_active=FALSE WHERE id=%s AND owner_id=%s",
            (staff_id, user["id"])
        )
        conn.commit()
        return ok({"ok": True})
    finally:
        conn.close()


def handle_admin_salons(event: dict) -> dict:
    """Список всех салонов с балансом (для админки)."""
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user or not user.get("is_admin"):
            return err("Только для администраторов", 403)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"SELECT s.id, s.name, s.credits_balance, u.username, u.full_name "
            f"FROM {tbl('salons')} s "
            f"JOIN {tbl('lk_users')} u ON u.id = s.owner_id "
            f"WHERE s.is_active=TRUE ORDER BY s.id"
        )
        return ok([dict(r) for r in cur.fetchall()])
    finally:
        conn.close()


# ── Система энергии ──────────────────────────────────────────────────────────

def _get_tool_cost(conn, tool_key: str) -> dict | None:
    """Возвращает запись стоимости инструмента."""
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT * FROM {tbl('tool_costs')} WHERE tool_key=%s", (tool_key,))
    return cur.fetchone()


def _get_salon_energy(conn, salon_id: int) -> int:
    """Текущий баланс энергии салона."""
    cur = conn.cursor()
    cur.execute(f"SELECT credits_balance FROM {tbl('salons')} WHERE id=%s", (salon_id,))
    row = cur.fetchone()
    return row[0] if row else 0


def _get_member_monthly_spent(conn, salon_id: int, user_id: int) -> int:
    """Сколько энергии потратил сотрудник в текущем месяце."""
    cur = conn.cursor()
    cur.execute(
        f"SELECT COALESCE(SUM(amount),0) FROM {tbl('credit_transactions')} "
        f"WHERE salon_id=%s AND user_id=%s AND type='debit' "
        f"AND date_trunc('month', created_at) = date_trunc('month', NOW())",
        (salon_id, user_id)
    )
    return cur.fetchone()[0]


def _spend_energy(conn, salon_id: int, user_id: int, tool_key: str, amount: int, action: str):
    """Списывает энергию с баланса салона и записывает транзакцию."""
    cur = conn.cursor()
    cur.execute(
        f"UPDATE {tbl('salons')} SET credits_balance = credits_balance - %s WHERE id=%s",
        (amount, salon_id)
    )
    cur.execute(
        f"INSERT INTO {tbl('credit_transactions')} (salon_id, user_id, action, amount, tool_key, type) "
        f"VALUES (%s,%s,%s,%s,%s,'debit')",
        (salon_id, user_id, action, amount, tool_key)
    )


def check_and_spend_energy(event: dict, conn, tool_key: str) -> dict | None:
    """
    Проверяет баланс и лимиты, списывает энергию.
    Возвращает None если всё ок, или err-ответ если недостаточно энергии.
    """
    user = get_session_user(event, conn)
    if not user:
        return err("Не авторизован", 401)

    # Пользователь без салона не может использовать платные инструменты
    if not user.get("salon_id"):
        return err("Сначала создайте профиль салона, чтобы использовать инструменты.", 402)

    salon_id = user["salon_id"]
    tool = _get_tool_cost(conn, tool_key)
    if not tool or tool["is_free"] or tool["energy_cost"] == 0:
        return None  # Бесплатный инструмент

    cost = tool["energy_cost"]
    balance = _get_salon_energy(conn, salon_id)
    if balance <= 0:
        return err(
            f"Баланс энергий исчерпан. Пополните баланс, чтобы продолжить.",
            402
        )
    if balance < cost:
        return err(
            f"Недостаточно энергии. Нужно {cost} ⚡, доступно {balance} ⚡. Пополните баланс.",
            402
        )

    # Проверяем лимит сотрудника
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT monthly_credit_limit FROM {tbl('salon_members')} "
        f"WHERE salon_id=%s AND user_id=%s AND is_active=TRUE",
        (salon_id, user["id"])
    )
    member = cur.fetchone()
    if member and member["monthly_credit_limit"]:
        spent = _get_member_monthly_spent(conn, salon_id, user["id"])
        if spent + cost > member["monthly_credit_limit"]:
            return err(
                f"Достигнут месячный лимит энергии ({member['monthly_credit_limit']} ⚡). "
                f"Обратитесь к владельцу салона.",
                402
            )

    _spend_energy(conn, salon_id, user["id"], tool_key, cost, tool["name"])
    conn.commit()
    return None


def handle_energy_balance(event: dict) -> dict:
    """Баланс энергии салона + расход сотрудника за месяц."""
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        if not user.get("salon_id"):
            return ok({"balance": 0, "monthly_spent": 0, "packages": []})

        balance = _get_salon_energy(conn, user["salon_id"])
        monthly_spent = _get_member_monthly_spent(conn, user["salon_id"], user["id"])

        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"SELECT code, name, price_rub, energy_amount FROM {tbl('energy_packages')} "
            f"WHERE is_active=TRUE ORDER BY sort_order"
        )
        packages = [dict(r) for r in cur.fetchall()]

        cur.execute(
            f"SELECT COUNT(*) AS cnt FROM {tbl('payments')} "
            f"WHERE salon_id=%s AND status='succeeded'",
            (user["salon_id"],)
        )
        has_paid = (cur.fetchone()["cnt"] or 0) > 0

        return ok({"balance": balance, "monthly_spent": monthly_spent, "packages": packages, "has_paid": has_paid})
    finally:
        conn.close()


def handle_energy_history(event: dict) -> dict:
    """История транзакций энергии по салону (для владельца)."""
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        salon = _require_owner(user, conn)
        if not salon:
            return err("Только для владельца", 403)

        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"SELECT ct.id, ct.type, ct.action, ct.amount, ct.tool_key, ct.created_at, "
            f"u.full_name "
            f"FROM {tbl('credit_transactions')} ct "
            f"LEFT JOIN {tbl('lk_users')} u ON u.id = ct.user_id "
            f"WHERE ct.salon_id=%s ORDER BY ct.created_at DESC LIMIT 100",
            (salon["id"],)
        )
        rows = [dict(r) for r in cur.fetchall()]
        return ok({"transactions": rows, "balance": salon.get("credits_balance", 0)})
    finally:
        conn.close()


def handle_energy_topup(event: dict) -> dict:
    """Администратор: ручное пополнение баланса (для тестирования до ЮКассы)."""
    body = json.loads(event.get("body") or "{}")
    amount = int(body.get("amount") or 0)
    if amount <= 0:
        return err("Укажите количество энергии")
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user or not user.get("is_admin"):
            return err("Только для администраторов", 403)
        salon_id = body.get("salon_id") or user.get("salon_id")
        if not salon_id:
            return err("Укажите salon_id")
        cur = conn.cursor()
        cur.execute(
            f"UPDATE {tbl('salons')} SET credits_balance = credits_balance + %s WHERE id=%s",
            (amount, salon_id)
        )
        cur.execute(
            f"INSERT INTO {tbl('credit_transactions')} (salon_id, user_id, action, amount, tool_key, type) "
            f"VALUES (%s,%s,'Пополнение баланса',%s,NULL,'credit')",
            (salon_id, user["id"], amount)
        )
        conn.commit()

        cur.execute(f"SELECT credits_balance FROM {tbl('salons')} WHERE id=%s", (salon_id,))
        new_balance = cur.fetchone()[0]
        return ok({"ok": True, "new_balance": new_balance})
    finally:
        conn.close()


def _yookassa_request(method: str, path: str, body: dict = None) -> dict:
    """Выполнить запрос к API ЮКассы."""
    import urllib.request as urlreq
    import urllib.error as urlerr
    import base64
    import uuid as uuid_mod
    shop_id = os.environ.get("YOOKASSA_SHOP_ID", "")
    secret_key = os.environ.get("YOOKASSA_SECRET_KEY", "")
    credentials = base64.b64encode(f"{shop_id}:{secret_key}".encode()).decode()
    url = f"https://api.yookassa.ru/v3{path}"
    payload = json.dumps(body).encode("utf-8") if body else None
    req = urlreq.Request(url, data=payload, headers={
        "Authorization": f"Basic {credentials}",
        "Content-Type": "application/json",
        "Idempotence-Key": str(uuid_mod.uuid4()),
    }, method=method)
    try:
        with urlreq.urlopen(req, timeout=15) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urlerr.HTTPError as e:
        error_body = e.read().decode("utf-8")
        print(f"[YooKassa Error] {method} {path} status={e.code} body={error_body}")
        raise


def handle_payment_create(event: dict) -> dict:
    """Создать платёж в ЮКассе для покупки пакета энергии. Поддерживает save_payment_method для автоплатежа."""
    import uuid as uuid_mod
    body = json.loads(event.get("body") or "{}")
    package_code = (body.get("package_code") or "").strip()
    return_url = (body.get("return_url") or "https://promtdialog.ru/cabinet").strip()
    enable_autopay = bool(body.get("enable_autopay", False))
    threshold = int(body.get("threshold") or 50)

    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        if not user.get("salon_id"):
            return err("Сначала создайте профиль салона", 402)

        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"SELECT * FROM {tbl('energy_packages')} WHERE code=%s AND is_active=TRUE",
            (package_code,)
        )
        pkg = cur.fetchone()
        if not pkg:
            return err("Пакет не найден")

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
                    "description": f"Пакет энергии «{pkg['name']}» ({pkg['energy_amount']} единиц)",
                    "quantity": "1.00",
                    "amount": {"value": f"{pkg['price_rub']}.00", "currency": "RUB"},
                    "vat_code": 1,
                    "payment_mode": "full_payment",
                    "payment_subject": "service",
                }]
            }

        recurring_enabled = os.environ.get("YOOKASSA_RECURRING_ENABLED", "").lower() == "true"
        payment_body = {
            "amount": {"value": f"{pkg['price_rub']}.00", "currency": "RUB"},
            "confirmation": {"type": "redirect", "return_url": return_url},
            "capture": True,
            "description": f"Пакет энергии «{pkg['name']}» — {pkg['energy_amount']} единиц",
            "metadata": {
                "salon_id": user["salon_id"],
                "user_id": user["id"],
                "package_code": package_code,
                "energy_amount": pkg["energy_amount"],
                "enable_autopay": "1" if enable_autopay else "0",
                "threshold": str(threshold),
            }
        }
        if enable_autopay and recurring_enabled:
            payment_body["save_payment_method"] = True
        if receipt:
            payment_body["receipt"] = receipt

        try:
            payment = _yookassa_request("POST", "/payments", payment_body)
        except Exception as e:
            return err(f"Ошибка ЮКассы: {e}")

        cur.execute(
            f"INSERT INTO {tbl('payments')} (salon_id, user_id, package_code, amount_rub, energy_amount, yookassa_id, status) "
            f"VALUES (%s,%s,%s,%s,%s,%s,'pending')",
            (user["salon_id"], user["id"], package_code, pkg["price_rub"], pkg["energy_amount"], payment["id"])
        )
        conn.commit()

        confirmation_url = payment.get("confirmation", {}).get("confirmation_url", "")
        return ok({"confirmation_url": confirmation_url, "payment_id": payment["id"]})
    finally:
        conn.close()


def handle_admin_payments(event: dict) -> dict:
    """Список всех платежей для админа с информацией о пользователе и салоне."""
    user = require_admin(event)
    if "statusCode" in user:
        return user

    conn = get_db()
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(f"""
            SELECT
                p.id, p.amount_rub, p.energy_amount, p.package_code,
                p.status, p.yookassa_id, p.created_at, p.updated_at,
                u.full_name AS user_name, u.email AS user_email,
                s.name AS salon_name
            FROM {tbl('payments')} p
            LEFT JOIN {tbl('lk_users')} u ON u.id = p.user_id
            LEFT JOIN {tbl('salons')} s ON s.id = p.salon_id
            ORDER BY p.created_at DESC
            LIMIT 500
        """)
        rows = cur.fetchall()
        payments = []
        for r in rows:
            payments.append({
                "id": r["id"],
                "amount_rub": r["amount_rub"],
                "energy_amount": r["energy_amount"],
                "package_code": r["package_code"],
                "status": r["status"],
                "yookassa_id": r["yookassa_id"],
                "created_at": r["created_at"].isoformat() if r["created_at"] else None,
                "user_name": r["user_name"] or "—",
                "user_email": r["user_email"] or "—",
                "salon_name": r["salon_name"] or "—",
            })
        total_rub = sum(p["amount_rub"] for p in payments if p["status"] == "succeeded")
        total_energy = sum(p["energy_amount"] for p in payments if p["status"] == "succeeded")
        return ok({"payments": payments, "total_rub": total_rub, "total_energy": total_energy})
    finally:
        conn.close()


def _do_autopay(conn, cur, salon_id: int, user_id: int, package_code: str, payment_method_id: str, pkg: dict):
    """Выполнить автосписание через сохранённый метод оплаты ЮКассы."""
    user_email = ""
    cur.execute(f"SELECT email FROM {tbl('lk_users')} WHERE id=%s", (user_id,))
    u = cur.fetchone()
    if u:
        user_email = u.get("email") or ""

    receipt = None
    if user_email:
        receipt = {
            "customer": {"email": user_email},
            "items": [{
                "description": f"Автопополнение: пакет энергии «{pkg['name']}» ({pkg['energy_amount']} единиц)",
                "quantity": "1.00",
                "amount": {"value": f"{pkg['price_rub']}.00", "currency": "RUB"},
                "vat_code": 1,
                "payment_mode": "full_payment",
                "payment_subject": "service",
            }]
        }

    payment_body = {
        "amount": {"value": f"{pkg['price_rub']}.00", "currency": "RUB"},
        "capture": True,
        "payment_method_id": payment_method_id,
        "description": f"Автопополнение: пакет энергии «{pkg['name']}» — {pkg['energy_amount']} единиц",
        "metadata": {
            "salon_id": salon_id,
            "user_id": user_id,
            "package_code": package_code,
            "energy_amount": pkg["energy_amount"],
            "is_autopay": "1",
        }
    }
    if receipt:
        payment_body["receipt"] = receipt

    payment = _yookassa_request("POST", "/payments", payment_body)
    cur.execute(
        f"INSERT INTO {tbl('payments')} (salon_id, user_id, package_code, amount_rub, energy_amount, yookassa_id, status, is_autopay) "
        f"VALUES (%s,%s,%s,%s,%s,%s,'pending',TRUE)",
        (salon_id, user_id, package_code, pkg["price_rub"], pkg["energy_amount"], payment["id"])
    )
    cur.execute(
        f"UPDATE {tbl('autopay_settings')} SET last_triggered_at=NOW(), updated_at=NOW() WHERE salon_id=%s",
        (salon_id,)
    )
    conn.commit()
    print(f"[Autopay] Triggered for salon_id={salon_id}, payment_id={payment['id']}")


def handle_payment_webhook(event: dict) -> dict:
    """Вебхук от ЮКассы — зачисляем энергию при успешной оплате, сохраняем метод для автоплатежа."""
    body = json.loads(event.get("body") or "{}")
    event_type = body.get("event", "")
    payment_obj = body.get("object", {})

    if event_type != "payment.succeeded":
        return ok({"ok": True})

    yookassa_id = payment_obj.get("id")
    meta = payment_obj.get("metadata", {})
    salon_id = meta.get("salon_id")
    user_id = meta.get("user_id")
    energy_amount = meta.get("energy_amount")
    enable_autopay = meta.get("enable_autopay") == "1"
    threshold = int(meta.get("threshold") or 50)
    package_code = meta.get("package_code") or ""

    if not yookassa_id or not salon_id or not energy_amount:
        return ok({"ok": True})

    conn = get_db()
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(f"SELECT * FROM {tbl('payments')} WHERE yookassa_id=%s", (yookassa_id,))
        payment = cur.fetchone()
        if not payment:
            return ok({"ok": True})
        if payment["status"] == "succeeded":
            return ok({"ok": True})

        payment_method_id = (payment_obj.get("payment_method") or {}).get("id")
        payment_method_saved = (payment_obj.get("payment_method") or {}).get("saved", False)

        cur.execute(
            f"UPDATE {tbl('payments')} SET status='succeeded', updated_at=NOW(), payment_method_id=%s WHERE yookassa_id=%s",
            (payment_method_id, yookassa_id)
        )
        cur.execute(
            f"UPDATE {tbl('salons')} SET credits_balance = credits_balance + %s WHERE id=%s",
            (int(energy_amount), int(salon_id))
        )
        cur.execute(
            f"INSERT INTO {tbl('credit_transactions')} (salon_id, user_id, action, amount, tool_key, type) "
            f"VALUES (%s,%s,'Покупка пакета энергии',%s,NULL,'credit')",
            (int(salon_id), int(user_id), int(energy_amount))
        )
        conn.commit()

        if enable_autopay and payment_method_saved and payment_method_id and package_code:
            cur.execute(
                f"INSERT INTO {tbl('autopay_settings')} (salon_id, is_enabled, package_code, threshold, payment_method_id) "
                f"VALUES (%s, TRUE, %s, %s, %s) "
                f"ON CONFLICT (salon_id) DO UPDATE SET is_enabled=TRUE, package_code=%s, threshold=%s, payment_method_id=%s, updated_at=NOW()",
                (int(salon_id), package_code, threshold, payment_method_id, package_code, threshold, payment_method_id)
            )
            conn.commit()
            print(f"[Autopay] Settings saved for salon_id={salon_id}, method={payment_method_id}")

        _notify_master_accrual(int(salon_id), int(energy_amount), "Покупка пакета энергии")

        cur.execute(f"SELECT email, full_name FROM {tbl('lk_users')} WHERE id=%s", (int(user_id),))
        user_row = cur.fetchone()
        if user_row and user_row.get("email"):
            amount_rub = payment_obj.get("amount", {}).get("value", "—")
            _send_payment_success_email(user_row["email"], user_row.get("full_name") or "", amount_rub, int(energy_amount))

        return ok({"ok": True})
    finally:
        conn.close()


def handle_autopay_get(event: dict) -> dict:
    """Получить настройки автоплатежа для салона."""
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        if not user.get("salon_id"):
            return ok({"autopay": None})
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"SELECT is_enabled, package_code, threshold, payment_method_id, last_triggered_at "
            f"FROM {tbl('autopay_settings')} WHERE salon_id=%s",
            (user["salon_id"],)
        )
        row = cur.fetchone()
        if not row:
            return ok({"autopay": None})
        return ok({"autopay": {
            "is_enabled": row["is_enabled"],
            "package_code": row["package_code"],
            "threshold": row["threshold"],
            "has_payment_method": bool(row["payment_method_id"]),
            "last_triggered_at": row["last_triggered_at"].isoformat() if row["last_triggered_at"] else None,
        }})
    finally:
        conn.close()


def handle_autopay_disable(event: dict) -> dict:
    """Отключить автоплатёж для салона."""
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        if not user.get("salon_id"):
            return err("Салон не найден")
        cur = conn.cursor()
        cur.execute(
            f"UPDATE {tbl('autopay_settings')} SET is_enabled=FALSE, payment_method_id=NULL, updated_at=NOW() WHERE salon_id=%s",
            (user["salon_id"],)
        )
        conn.commit()
        return ok({"ok": True})
    finally:
        conn.close()


def handle_autopay_check(event: dict) -> dict:
    """Проверить баланс салона и запустить автоплатёж если баланс ниже порога."""
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        if not user.get("salon_id"):
            return ok({"triggered": False})

        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"SELECT * FROM {tbl('autopay_settings')} WHERE salon_id=%s AND is_enabled=TRUE",
            (user["salon_id"],)
        )
        settings = cur.fetchone()
        if not settings or not settings.get("payment_method_id"):
            return ok({"triggered": False})

        balance = _get_salon_energy(conn, user["salon_id"])
        if balance > settings["threshold"]:
            return ok({"triggered": False, "balance": balance, "threshold": settings["threshold"]})

        cur.execute(
            f"SELECT * FROM {tbl('energy_packages')} WHERE code=%s AND is_active=TRUE",
            (settings["package_code"],)
        )
        pkg = cur.fetchone()
        if not pkg:
            return ok({"triggered": False, "error": "Пакет не найден"})

        _do_autopay(conn, cur, user["salon_id"], user["id"], settings["package_code"], settings["payment_method_id"], pkg)
        return ok({"triggered": True, "balance": balance, "threshold": settings["threshold"]})
    finally:
        conn.close()


def _send_payment_success_email(to_email: str, full_name: str, amount_rub: str, energy: int):
    """Письмо пользователю об успешном пополнении энергии."""
    smtp_password = os.environ.get("SMTP_PASSWORD", "")
    if not smtp_password:
        return
    name = full_name or "Уважаемый пользователь"
    msg = MIMEMultipart("alternative")
    msg["Subject"] = Header("Баланс энергии пополнен", "utf-8")
    msg["From"] = formataddr((str(Header("ПромтДиалог", "utf-8")), FROM_EMAIL))
    msg["To"] = to_email

    html = f"""
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#1a1a1a;">
      <h2 style="color:#0ea5a0;margin-bottom:8px;">⚡ Баланс пополнен!</h2>
      <p>Здравствуйте, {name}!</p>
      <p>Ваш платёж успешно обработан, и энергия зачислена на баланс.</p>
      <table cellpadding="10" style="background:#f8fafc;border-radius:10px;width:100%;margin:20px 0;">
        <tr>
          <td style="font-size:14px;color:#64748b;">Сумма платежа</td>
          <td style="font-size:16px;font-weight:700;">{amount_rub} ₽</td>
        </tr>
        <tr>
          <td style="font-size:14px;color:#64748b;">Начислено энергии</td>
          <td style="font-size:16px;font-weight:700;color:#0ea5a0;">+{energy} ⚡</td>
        </tr>
      </table>
      <p>Теперь вы можете использовать ИИ-инструменты платформы.</p>
      <a href="{SITE_URL}/cabinet" style="display:inline-block;background:#0ea5a0;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:8px;">
        Перейти в кабинет
      </a>
      <p style="margin-top:28px;font-size:12px;color:#aaa;">
        Если у вас возникли вопросы — напишите нам на {FROM_EMAIL}
      </p>
    </div>
    """
    msg.attach(MIMEText(html, "html", "utf-8"))
    try:
        with smtplib.SMTP_SSL("smtp.mail.ru", 465) as server:
            server.login(FROM_EMAIL, smtp_password)
            server.sendmail(FROM_EMAIL, to_email, msg.as_string())
        print(f"[Email] Sent payment success to {to_email}")
    except Exception as e:
        print(f"[Email Error] {e}")


def handle_tool_costs_list(event: dict) -> dict:
    """Список стоимостей всех инструментов."""
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(f"SELECT * FROM {tbl('tool_costs')} ORDER BY category, id")
        return ok([dict(r) for r in cur.fetchall()])
    finally:
        conn.close()


def handle_tool_costs_update(event: dict) -> dict:
    """Админ: обновить стоимость инструмента."""
    body = json.loads(event.get("body") or "{}")
    tool_key = body.get("tool_key")
    energy_cost = body.get("energy_cost")
    is_free = body.get("is_free")
    if not tool_key:
        return err("tool_key обязателен")
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user or not user.get("is_admin"):
            return err("Только для администраторов", 403)
        cur = conn.cursor()
        sets, vals = [], []
        if energy_cost is not None:
            sets.append("energy_cost=%s"); vals.append(int(energy_cost))
        if is_free is not None:
            sets.append("is_free=%s"); vals.append(bool(is_free))
        if not sets:
            return err("Нечего обновлять")
        sets.append("updated_at=NOW()")
        vals.append(tool_key)
        cur.execute(f"UPDATE {tbl('tool_costs')} SET {','.join(sets)} WHERE tool_key=%s", vals)
        conn.commit()
        return ok({"ok": True})
    finally:
        conn.close()


# ── Генератор постов ─────────────────────────────────────────────────────────

def _call_ai_text(messages: list, max_tokens: int = 800) -> str:
    import urllib.request as urlreq
    api_key = os.environ.get("POLZA_AI_API_KEY", "")
    if not api_key:
        raise ValueError("POLZA_AI_API_KEY не задан")
    payload = json.dumps({"model": "openai/gpt-4.1-mini", "messages": messages, "temperature": 0.85, "max_tokens": max_tokens}).encode("utf-8")
    req = urlreq.Request("https://polza.ai/api/v1/chat/completions", data=payload, headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}, method="POST")
    with urlreq.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data["choices"][0]["message"]["content"].strip()


def _get_salon_ctx(user: dict, conn, fields=("name","target_audience","description","tone_of_voice","main_goal")) -> dict | None:
    if not user.get("salon_id"):
        return None
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT {','.join(fields)} FROM {tbl('salons')} WHERE id=%s", (user["salon_id"],))
    return cur.fetchone()


# ── Сценарий для рилса ───────────────────────────────────────────────────────

def handle_reel_ideas(event: dict) -> dict:
    """Генерирует 5 идей для рилса по теме, цели и тону."""
    body    = json.loads(event.get("body") or "{}")
    service = (body.get("service") or "").strip()
    goal    = (body.get("goal")    or "").strip()
    tone    = (body.get("tone")    or "").strip()
    if not service:
        return err("Укажите услугу или тему")
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        salon = _get_salon_ctx(user, conn, ("name", "target_audience", "description"))
        salon_ctx = ""
        if salon:
            parts = [p for p in [
                f"Салон: {salon['name']}" if salon.get("name") else "",
                f"Аудитория: {salon['target_audience']}" if salon.get("target_audience") else "",
            ] if p]
            salon_ctx = "\n".join(parts)
        prompt = (
            f"Ты — SMM-специалист для салона красоты. Придумай 5 идей для короткого рилса (15–60 сек).\n\n"
            f"Услуга/тема: {service}\n"
            + (f"Цель рилса: {goal}\n" if goal else "")
            + (f"Стиль: {tone}\n" if tone else "")
            + (f"Контекст салона:\n{salon_ctx}\n" if salon_ctx else "")
            + "\nКаждая идея — это 1 строка: цепляющий заголовок + в скобках краткая суть (что происходит в видео).\n"
            "Примеры формата:\n"
            "Почему маникюр облетает за 3 дня (показываем 3 главные ошибки при уходе)\n"
            "До/после: реальное преображение за 60 минут (тайм-лапс процедуры)\n\n"
            "Верни ТОЛЬКО пронумерованный список из 5 идей, без пояснений:\n1. ...\n2. ...\n3. ...\n4. ...\n5. ..."
        )
        content = _call_ai_text([
            {"role": "system", "content": "Ты SMM-специалист для бьюти-бизнеса. Придумываешь вирусные идеи для коротких видео."},
            {"role": "user", "content": prompt}
        ], max_tokens=400)
        import re
        ideas = []
        for line in content.split("\n"):
            line = re.sub(r"^\d+[\.\)]\s*", "", line.strip())
            line = re.sub(r"^[-–]\s*", "", line)
            if line:
                ideas.append(line)
        return ok({"ideas": ideas[:5]})
    finally:
        conn.close()


def handle_reel_script(event: dict) -> dict:
    """Генерирует полный сценарий рилса по выбранной идее."""
    body    = json.loads(event.get("body") or "{}")
    idea    = (body.get("idea")    or "").strip()
    service = (body.get("service") or "").strip()
    goal    = (body.get("goal")    or "").strip()
    tone    = (body.get("tone")    or "").strip()
    if not idea:
        return err("Идея не передана")
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        energy_err = check_and_spend_energy(event, conn, "reel_script")
        if energy_err: return energy_err
        salon = _get_salon_ctx(user, conn, ("name", "target_audience", "tone_of_voice"))
        salon_ctx = ""
        if salon:
            parts = [p for p in [
                f"Салон: {salon['name']}" if salon.get("name") else "",
                f"Аудитория: {salon['target_audience']}" if salon.get("target_audience") else "",
                f"Стиль общения: {salon['tone_of_voice']}" if salon.get("tone_of_voice") else "",
            ] if p]
            salon_ctx = "\n".join(parts)
        prompt = (
            f"Напиши полный сценарий короткого рилса (15–45 секунд) для салона красоты.\n\n"
            f"Идея: {idea}\n"
            + (f"Услуга/тема: {service}\n" if service else "")
            + (f"Цель: {goal}\n" if goal else "")
            + (f"Стиль: {tone}\n" if tone else "")
            + (f"Контекст салона:\n{salon_ctx}\n" if salon_ctx else "")
            + """
Структура сценария:

🎬 КРЮЧОК (0–3 сек)
[Что показываем на экране]
[Текст/голос]

🎥 КАДР 1 (3–10 сек)
[Что показываем]
[Текст/голос]

🎥 КАДР 2 (10–25 сек)
[Что показываем]
[Текст/голос]

🎥 КАДР 3 (25–40 сек)
[Что показываем]
[Текст/голос]

📌 ФИНАЛ (40–45 сек)
[Что показываем]
[Призыв к действию]

🎵 МУЗЫКА: [рекомендация жанра/настроения]
📝 ОПИСАНИЕ ПОД ВИДЕО: [готовый текст 2-3 предложения + хэштеги]

Требования:
- Каждый кадр — конкретная инструкция оператору
- Текст/голос — дословно что говорить или показывать титром
- Живо, без канцелярита
- На русском языке"""
        )
        content = _call_ai_text([
            {"role": "system", "content": "Ты режиссёр коротких вертикальных видео для бьюти-бизнеса. Пишешь конкретные покадровые сценарии."},
            {"role": "user", "content": prompt}
        ], max_tokens=1200)
        # Промпт для превью
        salon_name = salon["name"] if salon and salon.get("name") else ""
        image_prompt = (
            f"Обложка для рилса салона красоты. Тема: {idea}."
            f"{' Салон: ' + salon_name + '.' if salon_name else ''}"
            " Стиль: яркий, привлекательный, вертикальный формат 9:16."
            " Профессиональная фотография, красивое освещение, бьюти-эстетика."
        )
        return ok({"script": content, "image_prompt": image_prompt})
    finally:
        conn.close()


def handle_post_titles(event: dict) -> dict:
    """Генерирует 5 заголовков поста по теме, цели и тону."""
    body  = json.loads(event.get("body") or "{}")
    topic = (body.get("topic") or "").strip()
    goal  = (body.get("goal")  or "").strip()
    tone  = (body.get("tone")  or "").strip()
    if not topic:
        return err("Укажите тему поста")
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        salon = _get_salon_ctx(user, conn, ("target_audience","description"))
        salon_ctx = ""
        if salon:
            parts = [p for p in [
                f"Аудитория: {salon['target_audience']}" if salon.get("target_audience") else "",
                f"О салоне: {salon['description']}" if salon.get("description") else "",
            ] if p]
            salon_ctx = "\n".join(parts)
        prompt = (
            f"Ты — копирайтер для салона красоты. Придумай 5 цепляющих заголовков для поста.\n\n"
            f"Тема: {topic}\n"
            + (f"Цель поста: {goal}\n" if goal else "")
            + (f"Тон: {tone}\n" if tone else "")
            + (f"Контекст салона:\n{salon_ctx}\n" if salon_ctx else "")
            + "\nТребования:\n- До 10 слов\n- Разные по подаче (вопрос, факт, обещание, интрига, польза)\n- Без хэштегов\n- На русском языке\n\n"
            "Верни ТОЛЬКО список из 5 заголовков:\n1. ...\n2. ...\n3. ...\n4. ...\n5. ..."
        )
        content = _call_ai_text([
            {"role": "system", "content": "Ты профессиональный копирайтер для бьюти-бизнеса."},
            {"role": "user", "content": prompt}
        ], max_tokens=400)
        import re
        titles = []
        for line in content.split("\n"):
            line = re.sub(r"^\d+[\.\)]\s*", "", line.strip())
            line = re.sub(r"^[-–]\s*", "", line)
            if line:
                titles.append(line)
        return ok({"titles": titles[:5]})
    finally:
        conn.close()


def handle_post_text(event: dict) -> dict:
    """Генерирует текст поста по выбранному заголовку."""
    body  = json.loads(event.get("body") or "{}")
    title = (body.get("title") or "").strip()
    topic = (body.get("topic") or "").strip()
    goal  = (body.get("goal")  or "").strip()
    tone  = (body.get("tone")  or "").strip()
    if not title:
        return err("Заголовок не передан")
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)
        energy_err = check_and_spend_energy(event, conn, "post_gen")
        if energy_err: return energy_err
        salon = _get_salon_ctx(user, conn, ("target_audience","tone_of_voice","main_goal"))
        salon_ctx = ""
        if salon:
            parts = [p for p in [
                f"Аудитория: {salon['target_audience']}" if salon.get("target_audience") else "",
                f"Стиль: {salon['tone_of_voice']}" if salon.get("tone_of_voice") else "",
                f"Цель бизнеса: {salon['main_goal']}" if salon.get("main_goal") else "",
            ] if p]
            salon_ctx = "\n".join(parts)
        prompt = (
            f"Напиши текст поста для социальной сети салона красоты.\n\n"
            f"Заголовок: {title}\n"
            + (f"Тема: {topic}\n" if topic else "")
            + (f"Цель поста: {goal}\n" if goal else "")
            + (f"Тон: {tone}\n" if tone else "")
            + (f"Контекст салона:\n{salon_ctx}\n" if salon_ctx else "")
            + "\nСтруктура: заголовок → 2-3 абзаца → призыв → хэштеги.\n"
            "Требования: живой язык, без клише, 150-250 слов, хэштеги отдельной строкой. "
            "Не упоминай название салона в тексте. Не используй никаких брендовых названий.\n"
            "Эмодзи: ровно 2-3 штуки на весь текст, не больше. Ставь их точно по смыслу — там, где важный факт, ключевая мысль или эмоциональный момент. Никаких эмодзи в начале каждой строки, никаких списков из эмодзи."
        )
        content = _call_ai_text([
            {"role": "system", "content": "Ты SMM-копирайтер для бьюти-бизнеса. Пишешь живые тексты."},
            {"role": "user", "content": prompt}
        ], max_tokens=800)
        image_prompt = (
            f"Реалистичная профессиональная фотография для поста салона красоты, тема: {title}. "
            f"Если есть люди — только славянская внешность: светлая или русая кожа, разнообразные натуральные цвета волос (блонд, русый, каштановый, тёмный), разные черты лица — не копии друг друга. "
            f"Естественные позы и мимика, живой взгляд, не постановочно, не глянцево. "
            f"Съёмка в реальном интерьере: мягкий естественный свет, красивое боке, тёплая атмосфера. "
            f"Стиль: светлый, уютный, минималистичный, как в хорошем Instagram-аккаунте. "
            f"Только фотография — без текста, без надписей, без логотипов, без watermark, без слов на изображении."
        )
        return ok({"text": content, "image_prompt": image_prompt})
    finally:
        conn.close()


ROUTES = {
    ("POST", "login"): handle_login,
    ("POST", "register"): handle_register,
    ("POST", "logout"): handle_logout,
    ("GET",  "me"): handle_me,
    ("GET",  "tests"): handle_tests,
    ("GET",  "test_detail"): handle_test_detail,
    ("POST", "submit_test"): handle_submit_test,
    ("GET",  "body_zones"): handle_body_zones,
    ("GET",  "body_zone"): handle_body_zone,
    ("GET",  "admin_users"): handle_admin_users,
    ("POST", "admin_create_user"): handle_admin_create_user,
    ("POST", "admin_update_user"): handle_admin_update_user,
    ("POST", "admin_set_password"): handle_admin_set_password,
    ("POST", "admin_update_rep"): handle_admin_update_rep,
    ("POST", "admin_delete_user"): handle_admin_delete_user,
    ("POST", "profile_update"): handle_profile_update,
    ("POST", "change_password"): handle_change_password,
    ("POST", "admin_body_zone_save"): handle_admin_body_zone_save,
    ("POST", "admin_technique_save"): handle_admin_technique_save,
    ("GET",  "admin_body_zones"): handle_admin_body_zones,
    ("POST", "mindset_save"): handle_mindset_save,
    ("GET",  "mindset_history"): handle_mindset_history,
    ("POST", "mindset_delete"): handle_mindset_delete,
    ("POST", "barriers_save"): handle_barriers_save,
    ("GET",  "barriers_history"): handle_barriers_history,
    ("POST", "barriers_delete"): handle_barriers_delete,
    ("POST", "finance_save"): handle_finance_save,
    ("GET",  "finance_history"): handle_finance_history,
    ("POST", "finance_delete"): handle_finance_delete,
    ("POST", "profile_save"): handle_profile_save,
    ("GET",  "profile_history"): handle_profile_history,
    ("POST", "profile_delete"): handle_profile_delete,
    ("POST", "salon_save"): handle_salon_save,
    ("GET",  "salon_history"): handle_salon_history,
    ("POST", "salon_delete"): handle_salon_delete,
    ("GET",  "diag_symptoms"): handle_diag_symptoms,
    ("GET",  "diag_search"): handle_diag_search,
    ("GET",  "ms_categories"): handle_ms_categories,
    ("POST", "ms_analyze"): handle_ms_analyze,
    ("GET",  "salon_profile"): handle_salon_profile_get,
    ("POST", "salon_profile_save"): handle_salon_profile_save,
    ("POST", "salon_logo_upload"): handle_salon_logo_upload,
    ("GET",  "body_zone_view"): handle_body_zone_view,
    ("GET",  "image_history"): handle_image_history,
    ("POST", "image_delete"): handle_image_delete,
    ("POST", "audit_save"): handle_audit_save,
    ("GET",  "audit_history"): handle_audit_history,
    ("GET",  "audit_get"): handle_audit_get,
    ("POST", "post_titles"): handle_post_titles,
    ("POST", "post_text"): handle_post_text,
    ("POST", "reel_ideas"): handle_reel_ideas,
    ("POST", "reel_script"): handle_reel_script,
    ("POST", "staff_analyze"): handle_staff_analyze,
    ("GET",  "staff_audit_history"): handle_staff_audit_history,
    ("GET",  "staff_audit_get"): handle_staff_audit_get,
    ("GET",  "staff_list"): handle_staff_list,
    ("POST", "staff_save"): handle_staff_save,
    ("POST", "staff_delete"): handle_staff_delete,
    ("POST", "review_reply"): handle_review_reply,
    ("GET",  "review_reply_history"): handle_review_reply_history,
    ("POST", "review_reply_delete"): handle_review_reply_delete,
    ("POST", "script_generate"): handle_script_generate,
    ("GET",  "script_history"): handle_script_history,
    # Энергия
    ("GET",  "admin_salons"): handle_admin_salons,
    ("GET",  "energy_balance"): handle_energy_balance,
    ("GET",  "energy_history"): handle_energy_history,
    ("POST", "energy_topup"): handle_energy_topup,
    ("GET",  "tool_costs"): handle_tool_costs_list,
    ("POST", "tool_costs_update"): handle_tool_costs_update,
    # Платежи ЮКасса
    ("POST", "payment_create"): handle_payment_create,
    ("POST", "payment_webhook"): handle_payment_webhook,
    ("GET",  "admin_payments"): handle_admin_payments,
    # Автоплатёж
    ("GET",  "autopay_get"): handle_autopay_get,
    ("POST", "autopay_disable"): handle_autopay_disable,
    ("POST", "autopay_check"): handle_autopay_check,
    # Команда / приглашения
    ("POST", "team_invite"): handle_team_invite,
    ("GET",  "team_list"): handle_team_list,
    ("POST", "team_member_update"): handle_team_member_update,
    ("POST", "team_member_remove"): handle_team_member_remove,
    ("POST", "invite_cancel"): handle_invite_cancel,
    ("GET",  "invite_info"): handle_invite_info,
    ("POST", "invite_accept"): handle_invite_accept,
    ("GET",  "credits_history"): handle_credits_history,
    ("GET",  "member_course_access"): handle_member_course_access_get,
    ("POST", "member_course_access_set"): handle_member_course_access_set,
}


def handler(event: dict, context) -> dict:
    """Единое API для личного кабинета DoqDialog."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    qs = event.get("queryStringParameters") or {}
    action = qs.get("action", "")

    route = ROUTES.get((method, action))
    if route:
        return route(event)

    return err("Not found", 404)