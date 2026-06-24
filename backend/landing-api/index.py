"""
API для управления проектами лендингов пользователя.
GET /        — список всех лендингов пользователя
GET /?id=... — получить один лендинг по id
POST /       — создать или обновить лендинг (если передан id — обновляем, иначе создаём)
"""
import json
import os
import psycopg2
import psycopg2.extras

SCHEMA = "t_p84565078_code_expression_proj"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def ok(data):
    return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps(data, ensure_ascii=False, default=str)}


def err(msg, status=400):
    return {"statusCode": status, "headers": CORS,
            "body": json.dumps({"error": msg}, ensure_ascii=False)}


def get_session_user(event, conn):
    sid = (event.get("headers") or {}).get("X-Session-Id", "") or \
          (event.get("headers") or {}).get("x-session-id", "")
    if not sid:
        return None
    with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        safe_id = sid.replace("'", "''")
        cur.execute(
            f"SELECT u.id, u.salon_id FROM {SCHEMA}.lk_sessions s "
            f"JOIN {SCHEMA}.lk_users u ON u.id = s.user_id "
            f"WHERE s.id = '{safe_id}' AND s.expires_at > NOW() AND u.is_active = TRUE"
        )
        return cur.fetchone()


def get_tool_cost(conn, tool_key: str, default: int) -> int:
    with conn.cursor() as cur:
        cur.execute(f"SELECT energy_cost FROM {SCHEMA}.tool_costs WHERE tool_key = %s", (tool_key,))
        row = cur.fetchone()
        return row[0] if row else default


def get_balance(conn, salon_id: int) -> int:
    with conn.cursor() as cur:
        cur.execute(f"SELECT credits_balance FROM {SCHEMA}.salons WHERE id = %s", (salon_id,))
        row = cur.fetchone()
        return row[0] if row else 0


def deduct(conn, salon_id: int, user_id: int, tool_key: str, cost: int, action: str):
    with conn.cursor() as cur:
        cur.execute(
            f"UPDATE {SCHEMA}.salons SET credits_balance = credits_balance - %s WHERE id = %s",
            (cost, salon_id)
        )
        cur.execute(
            f"INSERT INTO {SCHEMA}.credit_transactions (salon_id, user_id, action, amount, tool_key, type) "
            f"VALUES (%s, %s, %s, %s, %s, 'debit')",
            (salon_id, user_id, action, cost, tool_key)
        )
    conn.commit()


def handler(event: dict, context) -> dict:
    """CRUD лендингов + списание энергии за скачивание"""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    conn = get_conn()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)

        user_id = user["id"]
        method = event.get("httpMethod", "GET")
        params = event.get("queryStringParameters") or {}

        # ── GET — список или один лендинг ──
        if method == "GET":
            project_id = params.get("id")
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                if project_id:
                    safe_pid = project_id.replace("'", "''")
                    cur.execute(
                        f"SELECT id, title, landing_type, html, messages, created_at, updated_at "
                        f"FROM {SCHEMA}.landing_projects "
                        f"WHERE id = '{safe_pid}' AND user_id = {user_id}"
                    )
                    row = cur.fetchone()
                    if not row:
                        return err("Не найдено", 404)
                    row = dict(row)
                    row["created_at"] = str(row["created_at"])
                    row["updated_at"] = str(row["updated_at"])
                    return ok({"project": row})
                else:
                    cur.execute(
                        f"SELECT id, title, landing_type, created_at, updated_at "
                        f"FROM {SCHEMA}.landing_projects "
                        f"WHERE user_id = {user_id} ORDER BY updated_at DESC"
                    )
                    rows = cur.fetchall()
                    result = []
                    for r in rows:
                        d = dict(r)
                        d["created_at"] = str(d["created_at"])
                        d["updated_at"] = str(d["updated_at"])
                        result.append(d)
                    return ok({"projects": result})

        # ── POST — создать/обновить или списать за скачивание ──
        if method == "POST":
            body = json.loads(event.get("body") or "{}")
            action = body.get("action")

            # Специальный action: списание за скачивание
            if action == "download":
                salon_id = user.get("salon_id")
                if not salon_id:
                    return err("Необходим профиль салона", 402)
                cost = get_tool_cost(conn, "landing_download", 5)
                balance = get_balance(conn, salon_id)
                if balance < cost:
                    return err(f"Недостаточно энергии. Нужно {cost} ⚡, доступно {balance} ⚡. Пополните баланс.", 402)
                deduct(conn, salon_id, user_id, "landing_download", cost, "Скачивание готового лендинга")
                return ok({"ok": True, "spent": cost})

            # Сохранение проекта (без списания)
            project_id = body.get("id")
            title = (body.get("title") or "Без названия")[:255].replace("'", "''")
            landing_type = "premium" if body.get("landingType") == "premium" else "budget"
            html = body.get("html", "")
            messages_json = json.dumps(body.get("messages", []), ensure_ascii=False)

            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                if project_id:
                    safe_pid = project_id.replace("'", "''")
                    safe_html = html.replace("'", "''")
                    safe_msg = messages_json.replace("'", "''")
                    cur.execute(
                        f"UPDATE {SCHEMA}.landing_projects "
                        f"SET title='{title}', landing_type='{landing_type}', "
                        f"html='{safe_html}', messages='{safe_msg}'::jsonb, updated_at=NOW() "
                        f"WHERE id='{safe_pid}' AND user_id={user_id} RETURNING id"
                    )
                    row = cur.fetchone()
                    if not row:
                        return err("Не найдено", 404)
                    conn.commit()
                    return ok({"id": str(row["id"]), "saved": True})
                else:
                    safe_html = html.replace("'", "''")
                    safe_msg = messages_json.replace("'", "''")
                    cur.execute(
                        f"INSERT INTO {SCHEMA}.landing_projects (user_id, title, landing_type, html, messages) "
                        f"VALUES ({user_id}, '{title}', '{landing_type}', '{safe_html}', '{safe_msg}'::jsonb) "
                        f"RETURNING id"
                    )
                    row = cur.fetchone()
                    conn.commit()
                    return ok({"id": str(row["id"]), "saved": True})

        return err("Method not allowed", 405)

    finally:
        conn.close()