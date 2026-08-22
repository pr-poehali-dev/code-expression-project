"""
Быстрые действия ИИ-агента салона — вынесены из ai-salon-agent, чтобы не тарифицироваться
по его высокому таймауту (нужен ai-salon-agent для развёрнутых ИИ-ответов, ≥100с). Эта функция
дёргается ГОРАЗДО чаще (история чата открывается при каждом заходе на главный экран «ПоДелам»,
где встроен агент) и всегда отвечает быстро — таймаут по умолчанию (5-10с) полностью достаточен.
GET    /?chat_mode=salon|free — история переписки + баланс энергии + счётчик бесплатных сообщений
DELETE /?chat_mode=salon|free — очистить историю переписки (soft-delete: content='[удалено]')
"""
import json
import os
import psycopg2
import psycopg2.extras

SCHEMA = "t_p84565078_code_expression_proj"
FREE_MESSAGES = 10
ENERGY_PER_MESSAGE = 10
MAX_HISTORY = 30

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}


def tbl(name):
    return f"{SCHEMA}.{name}"


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def ok(data):
    return {"statusCode": 200, "headers": CORS, "body": json.dumps(data, ensure_ascii=False, default=str)}


def err(msg, code=400):
    return {"statusCode": code, "headers": CORS, "body": json.dumps({"error": msg}, ensure_ascii=False)}


def get_session_user(event, conn):
    session_id = (event.get("headers") or {}).get("X-Session-Id", "")
    if not session_id:
        return None
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT u.* FROM {tbl('lk_sessions')} s "
        f"JOIN {tbl('lk_users')} u ON u.id = s.user_id "
        f"WHERE s.id = %s AND s.expires_at > NOW() AND u.is_active = TRUE",
        (session_id,)
    )
    return cur.fetchone()


def get_free_used(conn, user_id: int) -> int:
    cur = conn.cursor()
    cur.execute(
        f"SELECT free_used FROM {tbl('salon_agent_free_usage')} WHERE user_id = %s",
        (user_id,)
    )
    row = cur.fetchone()
    return row[0] if row else 0


def get_salon_balance(conn, salon_id: int) -> int:
    cur = conn.cursor()
    cur.execute(f"SELECT credits_balance FROM {tbl('salons')} WHERE id = %s", (salon_id,))
    row = cur.fetchone()
    return row[0] if row else 0


def handler(event: dict, context) -> dict:
    """История чата ИИ-агента салона (GET) и очистка истории (DELETE) — быстрые операции."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)

        allowed_roles = {"owner", "admin", "solo_master"}
        user_role = user.get("role", "body_specialist")
        if user_role not in allowed_roles and not user.get("is_admin"):
            return err("Доступ только для владельцев, управляющих и администраторов", 403)

        user_id = user["id"]
        salon_id = user.get("salon_id")
        qs = event.get("queryStringParameters") or {}
        chat_mode = qs.get("chat_mode", "salon")
        if chat_mode not in ("salon", "free"):
            chat_mode = "salon"

        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        if method == "GET":
            cur.execute(
                f"SELECT role, content, created_at FROM {tbl('salon_agent_chats')} "
                f"WHERE user_id = %s AND chat_mode = %s AND content != '[удалено]' "
                f"ORDER BY created_at DESC LIMIT %s",
                (user_id, chat_mode, MAX_HISTORY)
            )
            rows = cur.fetchall()
            messages = [{"role": r["role"], "content": r["content"]} for r in reversed(rows)]

            free_used = get_free_used(conn, user_id)
            balance = get_salon_balance(conn, salon_id) if salon_id else 0

            return ok({
                "messages": messages,
                "chat_mode": chat_mode,
                "free_used": free_used,
                "free_limit": FREE_MESSAGES,
                "energy_balance": balance,
                "energy_per_message": ENERGY_PER_MESSAGE,
            })

        if method == "DELETE":
            cur.execute(
                f"UPDATE {tbl('salon_agent_chats')} SET content = '[удалено]' "
                f"WHERE user_id = %s AND chat_mode = %s",
                (user_id, chat_mode)
            )
            conn.commit()
            return ok({"cleared": True})

        return err("Метод не поддерживается", 405)
    finally:
        conn.close()
