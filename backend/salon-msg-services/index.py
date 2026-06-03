"""
CRUD списка услуг салона для генератора сообщений.
GET /      — список услуг салона
POST /     — добавить услугу { name }
POST /?action=delete&id=N — скрыть услугу (soft-delete)
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


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def ok(data):
    return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps(data, ensure_ascii=False, default=str)}


def err(msg, status=400):
    return {"statusCode": status, "headers": CORS,
            "body": json.dumps({"error": msg}, ensure_ascii=False)}


def get_session_user(event, conn):
    sid = (event.get("headers") or {}).get("X-Session-Id", "")
    if not sid:
        return None
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT u.* FROM {SCHEMA}.lk_sessions s JOIN {SCHEMA}.lk_users u ON u.id=s.user_id "
        f"WHERE s.id=%s AND s.expires_at>NOW() AND u.is_active=TRUE", (sid,)
    )
    return cur.fetchone()


def handler(event: dict, context) -> dict:
    """Управление списком услуг салона для генератора персональных сообщений."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)

        salon_id = user.get("salon_id")
        if not salon_id:
            return err("Привяжите профиль салона", 403)

        method = event.get("httpMethod", "GET")
        params = event.get("queryStringParameters") or {}
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        if method == "GET":
            cur.execute(
                f"SELECT id, name FROM {SCHEMA}.salon_msg_services "
                f"WHERE salon_id = %s AND is_active = TRUE ORDER BY created_at",
                (salon_id,)
            )
            rows = cur.fetchall()
            return ok({"services": [dict(r) for r in rows]})

        elif method == "POST":
            action = params.get("action", "add")

            if action == "delete":
                service_id = params.get("id")
                if not service_id:
                    return err("Укажите id услуги")
                cur.execute(
                    f"UPDATE {SCHEMA}.salon_msg_services SET is_active = FALSE "
                    f"WHERE id = %s AND salon_id = %s",
                    (int(service_id), salon_id)
                )
                conn.commit()
                return ok({"ok": True, "deleted_id": int(service_id)})

            body = json.loads(event.get("body") or "{}")
            name = (body.get("name") or "").strip()
            if not name:
                return err("Укажите название услуги")
            if len(name) > 100:
                return err("Название слишком длинное (макс. 100 символов)")

            cur.execute(
                f"SELECT COUNT(*) as cnt FROM {SCHEMA}.salon_msg_services "
                f"WHERE salon_id = %s AND is_active = TRUE",
                (salon_id,)
            )
            count = cur.fetchone()["cnt"]
            if count >= 50:
                return err("Максимум 50 услуг")

            cur.execute(
                f"INSERT INTO {SCHEMA}.salon_msg_services (salon_id, name) VALUES (%s, %s) RETURNING id",
                (salon_id, name)
            )
            new_id = cur.fetchone()["id"]
            conn.commit()
            return ok({"id": new_id, "name": name})

        return err("Метод не поддерживается", 405)
    finally:
        conn.close()
