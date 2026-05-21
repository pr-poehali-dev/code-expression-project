"""
Одноразовая утилита: установить пароль для пользователя по username.
Используется только при первоначальной настройке.
"""
import json, os
import bcrypt
import psycopg2

SCHEMA = "t_p84565078_code_expression_proj"
CORS = {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS", "Access-Control-Allow-Headers": "Content-Type"}


def handler(event: dict, context) -> dict:
    """Установить пароль пользователю (только POST, секретный токен)."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    if event.get("httpMethod") != "POST":
        return {"statusCode": 405, "headers": CORS, "body": json.dumps({"error": "Method not allowed"})}

    body = json.loads(event.get("body") or "{}")
    token = body.get("token", "")
    secret = os.environ.get("LK_SETUP_TOKEN", "")

    if not secret or token != secret:
        return {"statusCode": 403, "headers": CORS, "body": json.dumps({"error": "Forbidden"})}

    username = body.get("username", "admin")
    password = body.get("password", "")
    if len(password) < 6:
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Password too short"})}

    pw_hash = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    try:
        cur = conn.cursor()
        cur.execute(f"UPDATE {SCHEMA}.lk_users SET password_hash = %s WHERE username = %s", (pw_hash, username))
        conn.commit()
        return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True, "updated": cur.rowcount})}
    finally:
        conn.close()
