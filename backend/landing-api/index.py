"""
CRUD лендингов + версии.
GET /          — список лендингов пользователя
GET /?id=...   — получить один лендинг (html, blocks, style, messages, versions)
POST /         — создать/обновить лендинг
POST / action=save-version   — сохранить текущее состояние как версию (ручное)
POST / action=restore-version — откатить к версии по индексу
POST / action=download       — списать энергию за скачивание
"""
import json
import os
import psycopg2
import psycopg2.extras
from datetime import datetime, timezone

SCHEMA = "t_p84565078_code_expression_proj"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}
MAX_VERSIONS = 5


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


def get_tool_cost(conn, tool_key, default):
    with conn.cursor() as cur:
        cur.execute(f"SELECT energy_cost FROM {SCHEMA}.tool_costs WHERE tool_key = %s", (tool_key,))
        row = cur.fetchone()
        return row[0] if row else default


def get_balance(conn, salon_id):
    with conn.cursor() as cur:
        cur.execute(f"SELECT credits_balance FROM {SCHEMA}.salons WHERE id = %s", (salon_id,))
        row = cur.fetchone()
        return row[0] if row else 0


def deduct(conn, salon_id, user_id, tool_key, cost, action):
    with conn.cursor() as cur:
        cur.execute(f"UPDATE {SCHEMA}.salons SET credits_balance = credits_balance - %s WHERE id = %s", (cost, salon_id))
        cur.execute(
            f"INSERT INTO {SCHEMA}.credit_transactions (salon_id, user_id, action, amount, tool_key, type) "
            f"VALUES (%s, %s, %s, %s, %s, 'debit')",
            (salon_id, user_id, action, cost, tool_key)
        )
    conn.commit()


def handler(event: dict, context) -> dict:
    """CRUD лендингов: список, открыть, сохранить, версии, скачать"""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    conn = get_conn()
    try:
        method = event.get("httpMethod", "GET")
        params = event.get("queryStringParameters") or {}

        # ── ПУБЛИЧНЫЙ ПРОСМОТР: GET /?public=id ──────────────────────────────
        if method == "GET" and params.get("public"):
            safe_pid = params["public"].replace("'", "''")
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                cur.execute(
                    f"SELECT id, title, html, blocks, style "
                    f"FROM {SCHEMA}.landing_projects WHERE id = '{safe_pid}'"
                )
                row = cur.fetchone()
            if not row:
                return err("Лендинг не найден", 404)
            d = dict(row)
            d["blocks"] = d["blocks"] or []
            d["style"] = d["style"] or {}
            return ok(d)

        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)

        user_id = user["id"]

        # ── GET ──────────────────────────────────────────────────────────────
        if method == "GET":
            project_id = params.get("id")
            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                if project_id:
                    safe_pid = project_id.replace("'", "''")
                    cur.execute(
                        f"SELECT id, title, landing_type, html, html_backup, "
                        f"blocks, style, versions, messages, created_at, updated_at "
                        f"FROM {SCHEMA}.landing_projects "
                        f"WHERE id = '{safe_pid}' AND user_id = {user_id}"
                    )
                    row = cur.fetchone()
                    if not row:
                        return err("Не найдено", 404)
                    d = dict(row)
                    d["created_at"] = str(d["created_at"])
                    d["updated_at"] = str(d["updated_at"])
                    return ok({"project": d})
                else:
                    cur.execute(
                        f"SELECT id, title, landing_type, created_at, updated_at "
                        f"FROM {SCHEMA}.landing_projects "
                        f"WHERE user_id = {user_id} ORDER BY updated_at DESC"
                    )
                    rows = [dict(r) for r in cur.fetchall()]
                    for r in rows:
                        r["created_at"] = str(r["created_at"])
                        r["updated_at"] = str(r["updated_at"])

                    # Инфо о плане и лимите
                    salon_id = user.get("salon_id")
                    plan_info = {"plan": 1, "plan_name": "Старт", "max_landings": 3}
                    if salon_id:
                        cur.execute(
                            f"SELECT s.subscription_plan AS plan, l.plan_name, l.max_landings "
                            f"FROM {SCHEMA}.salons s "
                            f"LEFT JOIN {SCHEMA}.landing_plan_limits l ON l.plan = s.subscription_plan "
                            f"WHERE s.id = %s",
                            (salon_id,)
                        )
                        pr = cur.fetchone()
                        if pr and pr.get("max_landings") is not None:
                            plan_info = {"plan": pr["plan"], "plan_name": pr["plan_name"] or "Старт", "max_landings": pr["max_landings"]}

                    return ok({"projects": rows, "plan": plan_info, "used": len(rows)})

        # ── POST ─────────────────────────────────────────────────────────────
        if method == "POST":
            body = json.loads(event.get("body") or "{}")
            action = body.get("action")

            # Удаление проекта
            if action == "delete":
                project_id = body.get("id")
                if not project_id:
                    return err("id обязателен", 400)
                safe_pid = project_id.replace("'", "''")
                with conn.cursor() as cur:
                    cur.execute(
                        f"DELETE FROM {SCHEMA}.landing_projects "
                        f"WHERE id='{safe_pid}' AND user_id={user_id}"
                    )
                    deleted = cur.rowcount
                conn.commit()
                if deleted == 0:
                    return err("Не найдено", 404)
                return ok({"deleted": True})

            # Скачивание
            if action == "download":
                salon_id = user.get("salon_id")
                if not salon_id:
                    return err("Необходим профиль салона", 402)
                cost = get_tool_cost(conn, "landing_download", 5)
                balance = get_balance(conn, salon_id)
                if balance < cost:
                    return err(f"Недостаточно энергии. Нужно {cost} ⚡, доступно {balance} ⚡.", 402)
                deduct(conn, salon_id, user_id, "landing_download", cost, "Скачивание лендинга")
                return ok({"ok": True, "spent": cost, "user_id": user_id, "notification_email": user.get("notification_email")})

            # Ручное сохранение версии
            if action == "save-version":
                project_id = body.get("id")
                if not project_id:
                    return err("id обязателен", 400)
                safe_pid = project_id.replace("'", "''")
                with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                    cur.execute(
                        f"SELECT html, blocks, style, versions FROM {SCHEMA}.landing_projects "
                        f"WHERE id='{safe_pid}' AND user_id={user_id}"
                    )
                    row = cur.fetchone()
                    if not row:
                        return err("Не найдено", 404)
                    versions = list(row["versions"] or [])
                    new_version = {
                        "savedAt": datetime.now(timezone.utc).isoformat(),
                        "html": row["html"],
                        "blocks": row["blocks"],
                        "style": row["style"],
                    }
                    versions = [new_version] + versions
                    versions = versions[:MAX_VERSIONS]
                    versions_json = json.dumps(versions, ensure_ascii=False).replace("'", "''")
                    cur.execute(
                        f"UPDATE {SCHEMA}.landing_projects SET versions='{versions_json}'::jsonb "
                        f"WHERE id='{safe_pid}' AND user_id={user_id}"
                    )
                    conn.commit()
                    return ok({"saved": True, "versionsCount": len(versions)})

            # Откат к версии
            if action == "restore-version":
                project_id = body.get("id")
                version_idx = body.get("versionIdx", 0)
                if not project_id:
                    return err("id обязателен", 400)
                safe_pid = project_id.replace("'", "''")
                with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                    cur.execute(
                        f"SELECT versions FROM {SCHEMA}.landing_projects "
                        f"WHERE id='{safe_pid}' AND user_id={user_id}"
                    )
                    row = cur.fetchone()
                    if not row:
                        return err("Не найдено", 404)
                    versions = list(row["versions"] or [])
                    if version_idx >= len(versions):
                        return err("Версия не найдена", 404)
                    v = versions[version_idx]
                    safe_html = (v.get("html") or "").replace("'", "''")
                    blocks_json = json.dumps(v.get("blocks") or [], ensure_ascii=False).replace("'", "''")
                    style_json = json.dumps(v.get("style") or {}, ensure_ascii=False).replace("'", "''")
                    cur.execute(
                        f"UPDATE {SCHEMA}.landing_projects "
                        f"SET html='{safe_html}', blocks='{blocks_json}'::jsonb, "
                        f"style='{style_json}'::jsonb, updated_at=NOW() "
                        f"WHERE id='{safe_pid}' AND user_id={user_id}"
                    )
                    conn.commit()
                    return ok({
                        "html": v.get("html", ""),
                        "blocks": v.get("blocks", []),
                        "style": v.get("style", {}),
                        "restored": True,
                    })

            # Сохранение / создание проекта
            project_id = body.get("id")
            title = (body.get("title") or "Без названия")[:255].replace("'", "''")
            lt = body.get("landingType", "classic")
            valid_types = ("classic", "storytelling", "sales", "portfolio", "b2b", "event", "restaurant", "realty", "product", "ai", "premium", "multipage", "budget")
            landing_type = lt if lt in valid_types else "classic"
            html = body.get("html", "")
            blocks = body.get("blocks", [])
            style = body.get("style", {})
            messages_data = body.get("messages", [])

            safe_html = html.replace("'", "''")
            safe_msg = json.dumps(messages_data, ensure_ascii=False).replace("'", "''")
            safe_blocks = json.dumps(blocks, ensure_ascii=False).replace("'", "''")
            safe_style = json.dumps(style, ensure_ascii=False).replace("'", "''")

            with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
                if project_id:
                    safe_pid = project_id.replace("'", "''")
                    cur.execute(
                        f"UPDATE {SCHEMA}.landing_projects "
                        f"SET title='{title}', landing_type='{landing_type}', "
                        f"html='{safe_html}', blocks='{safe_blocks}'::jsonb, "
                        f"style='{safe_style}'::jsonb, messages='{safe_msg}'::jsonb, "
                        f"updated_at=NOW() "
                        f"WHERE id='{safe_pid}' AND user_id={user_id} RETURNING id"
                    )
                    row = cur.fetchone()
                    if not row:
                        return err("Не найдено", 404)
                    conn.commit()
                    return ok({"id": str(row["id"]), "saved": True})
                else:
                    # Проверяем лимит лендингов по тарифу
                    salon_id = user.get("salon_id")
                    with conn.cursor() as lim_cur:
                        lim_cur.execute(
                            f"SELECT s.subscription_plan, l.max_landings "
                            f"FROM {SCHEMA}.salons s "
                            f"LEFT JOIN {SCHEMA}.landing_plan_limits l ON l.plan = s.subscription_plan "
                            f"WHERE s.id = %s",
                            (salon_id,)
                        )
                        plan_row = lim_cur.fetchone()
                        max_landings = (plan_row[1] if plan_row and plan_row[1] is not None else 3)

                        lim_cur.execute(
                            f"SELECT COUNT(*) FROM {SCHEMA}.landing_projects WHERE user_id = %s",
                            (user_id,)
                        )
                        current_count = lim_cur.fetchone()[0]

                    if current_count >= max_landings:
                        return err(f"Достигнут лимит лендингов для вашего тарифа ({max_landings} шт.). Повысьте тариф для создания новых.", 402)

                    cur.execute(
                        f"INSERT INTO {SCHEMA}.landing_projects "
                        f"(user_id, title, landing_type, html, blocks, style, messages) "
                        f"VALUES ({user_id}, '{title}', '{landing_type}', '{safe_html}', "
                        f"'{safe_blocks}'::jsonb, '{safe_style}'::jsonb, '{safe_msg}'::jsonb) "
                        f"RETURNING id"
                    )
                    row = cur.fetchone()
                    conn.commit()
                    return ok({"id": str(row["id"]), "saved": True})

        return err("Method not allowed", 405)

    finally:
        conn.close()