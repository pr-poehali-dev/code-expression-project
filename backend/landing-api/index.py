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


def get_user(session_id: str):
    conn = get_conn()
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            safe_id = session_id.replace("'", "''")
            cur.execute(
                f"SELECT u.id FROM {SCHEMA}.lk_sessions s "
                f"JOIN {SCHEMA}.lk_users u ON u.id = s.user_id "
                f"WHERE s.id = '{safe_id}' AND s.expires_at > NOW() AND u.is_active = TRUE"
            )
            return cur.fetchone()
    finally:
        conn.close()


def handler(event: dict, context) -> dict:
    """CRUD лендингов: список, получение, создание, обновление"""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    session_id = (event.get("headers") or {}).get("X-Session-Id", "") or \
                 (event.get("headers") or {}).get("x-session-id", "")
    if not session_id:
        return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Не авторизован"})}

    user = get_user(session_id)
    if not user:
        return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Сессия не найдена"})}

    user_id = user["id"]
    method = event.get("httpMethod", "GET")
    params = event.get("queryStringParameters") or {}

    # ── GET — список или один лендинг ──
    if method == "GET":
        project_id = params.get("id")
        conn = get_conn()
        try:
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
                        return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Не найдено"})}
                    row = dict(row)
                    row["created_at"] = str(row["created_at"])
                    row["updated_at"] = str(row["updated_at"])
                    return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"},
                            "body": json.dumps({"project": row}, ensure_ascii=False)}
                else:
                    cur.execute(
                        f"SELECT id, title, landing_type, created_at, updated_at, "
                        f"LEFT(html, 100) as html_preview "
                        f"FROM {SCHEMA}.landing_projects "
                        f"WHERE user_id = {user_id} "
                        f"ORDER BY updated_at DESC"
                    )
                    rows = cur.fetchall()
                    result = []
                    for r in rows:
                        d = dict(r)
                        d["created_at"] = str(d["created_at"])
                        d["updated_at"] = str(d["updated_at"])
                        result.append(d)
                    return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"},
                            "body": json.dumps({"projects": result}, ensure_ascii=False)}
        finally:
            conn.close()

    # ── POST — создать или обновить ──
    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        project_id = body.get("id")
        title = (body.get("title") or "Без названия")[:255].replace("'", "''")
        landing_type = "premium" if body.get("landingType") == "premium" else "budget"
        html = body.get("html", "")
        messages = json.dumps(body.get("messages", []), ensure_ascii=False)

        conn = get_conn()
        try:
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                if project_id:
                    safe_pid = project_id.replace("'", "''")
                    safe_html = html.replace("'", "''")
                    safe_messages = messages.replace("'", "''")
                    cur.execute(
                        f"UPDATE {SCHEMA}.landing_projects "
                        f"SET title='{title}', landing_type='{landing_type}', "
                        f"html='{safe_html}', messages='{safe_messages}'::jsonb, updated_at=NOW() "
                        f"WHERE id='{safe_pid}' AND user_id={user_id} "
                        f"RETURNING id"
                    )
                    row = cur.fetchone()
                    if not row:
                        return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Не найдено"})}
                    conn.commit()
                    return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"},
                            "body": json.dumps({"id": str(row["id"]), "saved": True}, ensure_ascii=False)}
                else:
                    safe_html = html.replace("'", "''")
                    safe_messages = messages.replace("'", "''")
                    cur.execute(
                        f"INSERT INTO {SCHEMA}.landing_projects (user_id, title, landing_type, html, messages) "
                        f"VALUES ({user_id}, '{title}', '{landing_type}', '{safe_html}', '{safe_messages}'::jsonb) "
                        f"RETURNING id"
                    )
                    row = cur.fetchone()
                    conn.commit()
                    return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"},
                            "body": json.dumps({"id": str(row["id"]), "saved": True}, ensure_ascii=False)}
        finally:
            conn.close()

    return {"statusCode": 405, "headers": CORS, "body": json.dumps({"error": "Method not allowed"})}
