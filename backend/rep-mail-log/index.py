"""
История отправленных писем.
GET /  — представитель видит свои письма, админ видит все с именем отправителя.
"""
import json
import os
import psycopg2
import psycopg2.extras

SCHEMA = "t_p84565078_code_expression_proj"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}


def ok(data):
    return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps(data, ensure_ascii=False, default=str)}


def err(msg, status=400):
    return {"statusCode": status, "headers": CORS,
            "body": json.dumps({"error": msg}, ensure_ascii=False)}


def get_user(event):
    session_id = (event.get("headers") or {}).get("X-Session-Id", "")
    if not session_id:
        return None
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"SELECT u.* FROM {SCHEMA}.lk_sessions s "
            f"JOIN {SCHEMA}.lk_users u ON u.id = s.user_id "
            f"WHERE s.id = %s AND s.expires_at > NOW() AND u.is_active = TRUE",
            (session_id,)
        )
        return cur.fetchone()
    finally:
        conn.close()


def handler(event: dict, context) -> dict:
    """История отправленных писем для представителей и админа"""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    user = get_user(event)
    if not user:
        return err("Не авторизован", 401)
    if not user.get("is_representative") and not user.get("is_admin"):
        return err("Нет доступа", 403)

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        if user.get("is_admin"):
            cur.execute(
                f"""SELECT l.id, l.to_email, l.to_name, l.subject, l.template_label,
                           l.sent_at,
                           COALESCE(u.full_name, u.username) AS sender_name
                    FROM {SCHEMA}.rep_mail_log l
                    JOIN {SCHEMA}.lk_users u ON u.id = l.sender_id
                    ORDER BY l.sent_at DESC
                    LIMIT 500"""
            )
        else:
            cur.execute(
                f"""SELECT id, to_email, to_name, subject, template_label,
                           sent_at, NULL AS sender_name
                    FROM {SCHEMA}.rep_mail_log
                    WHERE sender_id = %s
                    ORDER BY sent_at DESC
                    LIMIT 200""",
                (user["id"],)
            )

        rows = cur.fetchall()
    finally:
        conn.close()

    return ok({"logs": [dict(r) for r in rows], "is_admin": bool(user.get("is_admin"))})
