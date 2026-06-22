"""
База контактов представителя: GET — список, POST — загрузить/добавить, DELETE — удалить контакт.
Данные хранятся в БД, доступны с любого устройства.
"""
import json
import os
import psycopg2
import psycopg2.extras

SCHEMA = "t_p84565078_code_expression_proj"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def get_user(session_id: str, conn):
    with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        cur.execute(
            f"SELECT u.id, u.is_representative, u.is_admin FROM {SCHEMA}.lk_sessions s "
            f"JOIN {SCHEMA}.lk_users u ON u.id = s.user_id "
            f"WHERE s.id = %s AND s.expires_at > NOW() AND u.is_active = TRUE",
            (session_id,),
        )
        return cur.fetchone()


def handler(event: dict, context) -> dict:
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    session_id = (event.get("headers") or {}).get("X-Session-Id", "") or \
                 (event.get("headers") or {}).get("x-session-id", "")
    if not session_id:
        return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Не авторизован"})}

    conn = get_conn()
    user = get_user(session_id, conn)
    if not user or (not user["is_representative"] and not user["is_admin"]):
        conn.close()
        return {"statusCode": 403, "headers": CORS, "body": json.dumps({"error": "Нет доступа"})}

    owner_id = user["id"]
    method = event.get("httpMethod", "GET")

    if method == "GET":
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(
                f"SELECT id, name, email FROM {SCHEMA}.rep_contacts WHERE owner_id = %s ORDER BY id",
                (owner_id,),
            )
            rows = cur.fetchall()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"contacts": [dict(r) for r in rows]})}

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        contacts = body.get("contacts", [])
        if not contacts:
            conn.close()
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Нет данных"})}

        with conn.cursor() as cur:
            for c in contacts:
                name = (c.get("name") or "").strip()
                email = (c.get("email") or "").strip().lower()
                if not email:
                    continue
                cur.execute(
                    f"INSERT INTO {SCHEMA}.rep_contacts (owner_id, name, email) VALUES (%s, %s, %s) "
                    f"ON CONFLICT (owner_id, email) DO UPDATE SET name = EXCLUDED.name",
                    (owner_id, name, email),
                )
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

    if method == "DELETE":
        body = json.loads(event.get("body") or "{}")
        email = (body.get("email") or "").strip().lower()
        if not email:
            conn.close()
            return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "email обязателен"})}
        with conn.cursor() as cur:
            cur.execute(
                f"DELETE FROM {SCHEMA}.rep_contacts WHERE owner_id = %s AND email = %s",
                (owner_id, email),
            )
        conn.commit()
        conn.close()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

    conn.close()
    return {"statusCode": 405, "headers": CORS, "body": json.dumps({"error": "Метод не поддерживается"})}