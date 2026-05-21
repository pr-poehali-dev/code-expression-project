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
from datetime import datetime, timezone

import bcrypt
import psycopg2
import psycopg2.extras

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
        cur.execute(f"SELECT * FROM {tbl('lk_users')} WHERE username = %s AND is_active = TRUE", (username,))
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

        session_id = secrets.token_hex(32)
        ua = (event.get("headers") or {}).get("User-Agent", "")
        cur.execute(
            f"INSERT INTO {tbl('lk_sessions')} (id, user_id, user_agent) VALUES (%s, %s, %s)",
            (session_id, user["id"], ua)
        )
        conn.commit()

        return ok({
            "session_id": session_id,
            "user": {
                "id": user["id"],
                "username": user["username"],
                "full_name": user["full_name"],
                "email": user["email"],
                "is_admin": user["is_admin"],
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
        return ok({
            "id": user["id"],
            "username": user["username"],
            "full_name": user["full_name"],
            "email": user["email"],
            "is_admin": user["is_admin"],
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
        cur.execute(f"SELECT id, username, email, full_name, is_admin, is_active, created_at, notes FROM {tbl('lk_users')} ORDER BY created_at DESC")
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

    if not username or not email or not password:
        return err("Заполните логин, email и пароль")

    conn = get_db()
    try:
        if not require_admin(event, conn):
            return err("Нет доступа", 403)
        pw_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"INSERT INTO {tbl('lk_users')} (username, email, password_hash, full_name, notes, is_admin) VALUES (%s,%s,%s,%s,%s,%s) RETURNING id",
            (username, email, pw_hash, full_name, notes, is_admin)
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
    conn = get_db()
    try:
        if not require_admin(event, conn):
            return err("Нет доступа", 403)
        cur = conn.cursor()
        cur.execute(
            f"UPDATE {tbl('lk_users')} SET full_name=%s, email=%s, notes=%s, is_active=%s, is_admin=%s WHERE id=%s",
            (body.get("full_name"), body.get("email"), body.get("notes"), body.get("is_active", True), body.get("is_admin", False), user_id)
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


# ── Роутер ───────────────────────────────────────────────────────────────────

ROUTES = {
    ("POST", "login"): handle_login,
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
    ("POST", "admin_body_zone_save"): handle_admin_body_zone_save,
    ("POST", "admin_technique_save"): handle_admin_technique_save,
    ("GET",  "admin_body_zones"): handle_admin_body_zones,
    ("POST", "mindset_save"): handle_mindset_save,
    ("GET",  "mindset_history"): handle_mindset_history,
    ("POST", "barriers_save"): handle_barriers_save,
    ("GET",  "barriers_history"): handle_barriers_history,
    ("POST", "finance_save"): handle_finance_save,
    ("GET",  "finance_history"): handle_finance_history,
    ("POST", "profile_save"): handle_profile_save,
    ("GET",  "profile_history"): handle_profile_history,
    ("POST", "salon_save"): handle_salon_save,
    ("GET",  "salon_history"): handle_salon_history,
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