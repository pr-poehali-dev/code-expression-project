"""
«ПоДелам» — быстрые операции личного кабинета, вынесенные из masters-accrual в отдельную функцию
с низким таймаутом (15с), чтобы часто вызываемые лёгкие запросы (сохранить диагностику, отметить
дело, статистика, доход за день) не тарифицировались по цене тяжёлых ИИ-операций (построение
плана дня, генерация поста в блог) — те остались в masters-accrual с таймаутом 60-100с.
Публичного контракта action'ов не меняли — фронт бьёт по тем же именам, что и раньше.

POST ?action=podelam_save_profile — сохранить диагностику дохода (X-Session-Id). Поле conversion_rate (опционально,
                                      % обращений, доходящих до первой консультации/записи) актуально в первую очередь
                                      для частной практики (психологи/телесные психологи, см. lk_users.specialization).
POST ?action=podelam_task_done    — отметить дело выполненным, опционально с фактической суммой (X-Session-Id)
GET  ?action=podelam_stats        — статистика выполненных дел, дохода и новых/вернувшихся клиентов за неделю/месяц (X-Session-Id)
POST ?action=podelam_set_income   — прибавить фактический доход за день и опционально кол-во новых/вернувшихся клиентов
                                      (amount, опц. new_clients, returned_clients, date, mode="add"|"replace") (X-Session-Id)
"""
import json
import os
from datetime import date
import psycopg2
import psycopg2.extras

SCHEMA = "t_p84565078_code_expression_proj"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Internal-Key, X-Session-Id",
}


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def ok(data):
    return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps(data, ensure_ascii=False, default=str)}


def err(msg, status=400):
    return {"statusCode": status, "headers": CORS,
            "body": json.dumps({"error": msg}, ensure_ascii=False)}


def get_lk_user_by_session(session_id: str, conn):
    """Пользователь личного кабинета «Промт Диалог» по X-Session-Id (lk_sessions/lk_users)."""
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"""SELECT u.* FROM {SCHEMA}.lk_sessions s JOIN {SCHEMA}.lk_users u ON u.id = s.user_id
            WHERE s.id = %s AND s.expires_at > NOW() AND u.is_active = TRUE""",
        (session_id,)
    )
    return cur.fetchone()


def handle_podelam_save_profile(event: dict, conn) -> dict:
    """Сохраняет/обновляет диагностику дохода пользователя (8-12 вопросов)."""
    session_id = (event.get("headers") or {}).get("X-Session-Id", "")
    if not session_id:
        return err("Не авторизован", 401)
    user = get_lk_user_by_session(session_id, conn)
    if not user:
        return err("Сессия истекла", 401)

    body = json.loads(event.get("body") or "{}")
    required = ["avg_check", "current_revenue", "target_revenue"]
    for f in required:
        if body.get(f) in (None, ""):
            return err(f"Заполните поле: {f}")

    conversion_rate = body.get("conversion_rate")
    conversion_rate = int(conversion_rate) if conversion_rate not in (None, "") else None

    cur = conn.cursor()
    cur.execute(
        f"""INSERT INTO {SCHEMA}.podelam_profiles
            (user_id, salon_id, niche, avg_check, current_revenue, target_revenue,
             clients_per_month, base_size, repeat_rate, free_slots_per_week, has_addon_services,
             addon_services_text, lead_source, conversion_rate, updated_at)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,NOW())
            ON CONFLICT (user_id) DO UPDATE SET
                salon_id=EXCLUDED.salon_id, niche=EXCLUDED.niche, avg_check=EXCLUDED.avg_check,
                current_revenue=EXCLUDED.current_revenue, target_revenue=EXCLUDED.target_revenue,
                clients_per_month=EXCLUDED.clients_per_month, base_size=EXCLUDED.base_size,
                repeat_rate=EXCLUDED.repeat_rate, free_slots_per_week=EXCLUDED.free_slots_per_week,
                has_addon_services=EXCLUDED.has_addon_services, addon_services_text=EXCLUDED.addon_services_text,
                lead_source=EXCLUDED.lead_source, conversion_rate=EXCLUDED.conversion_rate,
                updated_at=NOW()""",
        (
            user["id"], user.get("salon_id"), body.get("niche", ""),
            float(body["avg_check"]), float(body["current_revenue"]), float(body["target_revenue"]),
            int(body.get("clients_per_month") or 0), int(body.get("base_size") or 0),
            int(body.get("repeat_rate") or 0), int(body.get("free_slots_per_week") or 0),
            bool(body.get("has_addon_services") or False), (body.get("addon_services_text") or "").strip() or None,
            body.get("lead_source", ""), conversion_rate,
        )
    )
    # Сбрасываем план на сегодня, чтобы пересчитать с новыми данными
    cur.execute(
        f"DELETE FROM {SCHEMA}.podelam_daily_plans WHERE user_id = %s AND plan_date = %s",
        (user["id"], date.today())
    )
    conn.commit()
    return ok({"ok": True})


def handle_podelam_task_done(event: dict, conn) -> dict:
    """Отмечает дело дня выполненным/невыполненным, опционально с фактической суммой."""
    session_id = (event.get("headers") or {}).get("X-Session-Id", "")
    if not session_id:
        return err("Не авторизован", 401)
    user = get_lk_user_by_session(session_id, conn)
    if not user:
        return err("Сессия истекла", 401)

    body = json.loads(event.get("body") or "{}")
    task_key = body.get("task_key")
    if not task_key:
        return err("Нужен task_key")
    done = bool(body.get("done", True))
    actual_amount = body.get("actual_amount")

    cur = conn.cursor()
    cur.execute(
        f"""INSERT INTO {SCHEMA}.podelam_task_log (user_id, plan_date, task_key, done, actual_amount, updated_at)
            VALUES (%s, %s, %s, %s, %s, NOW())
            ON CONFLICT (user_id, plan_date, task_key) DO UPDATE SET
                done=EXCLUDED.done, actual_amount=EXCLUDED.actual_amount, updated_at=NOW()""",
        (user["id"], date.today(), task_key, done, actual_amount)
    )
    conn.commit()
    return ok({"ok": True})


def handle_podelam_set_income(event: dict, conn) -> dict:
    """Прибавляет фактический доход мастера за конкретный день (по умолчанию — сегодня) к уже накопленной
    сумме, а также опционально количество новых клиентов (new_clients) и вернувшихся клиентов
    (returned_clients) за этот день — тоже прибавляются к уже накопленным. Если передан mode="replace" —
    заменяет сумму и счётчики клиентов целиком (используется при исправлении ошибочного ввода).
    Сохранённые new_clients/returned_clients учитываются ИИ при построении СЛЕДУЮЩЕГО плана в
    masters-accrual — показывают, какие действия реально сработали."""
    session_id = (event.get("headers") or {}).get("X-Session-Id", "")
    if not session_id:
        return err("Не авторизован", 401)
    user = get_lk_user_by_session(session_id, conn)
    if not user:
        return err("Сессия истекла", 401)

    body = json.loads(event.get("body") or "{}")
    if body.get("amount") in (None, ""):
        return err("Укажите сумму")
    try:
        amount = float(body["amount"])
    except (TypeError, ValueError):
        return err("Некорректная сумма")
    if amount < 0:
        return err("Сумма не может быть отрицательной")

    def _parse_count(key: str) -> int:
        v = body.get(key)
        if v in (None, ""):
            return 0
        try:
            n = int(v)
        except (TypeError, ValueError):
            return 0
        return max(0, n)

    new_clients = _parse_count("new_clients")
    returned_clients = _parse_count("returned_clients")

    income_date = body.get("date") or str(date.today())
    mode = body.get("mode") or "add"

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    if mode == "replace":
        cur.execute(
            f"""INSERT INTO {SCHEMA}.podelam_daily_income (user_id, income_date, amount, new_clients, returned_clients, updated_at)
                VALUES (%s, %s, %s, %s, %s, NOW())
                ON CONFLICT (user_id, income_date) DO UPDATE SET
                    amount=EXCLUDED.amount, new_clients=EXCLUDED.new_clients,
                    returned_clients=EXCLUDED.returned_clients, updated_at=NOW()
                RETURNING amount, new_clients, returned_clients""",
            (user["id"], income_date, amount, new_clients, returned_clients)
        )
    else:
        cur.execute(
            f"""INSERT INTO {SCHEMA}.podelam_daily_income (user_id, income_date, amount, new_clients, returned_clients, updated_at)
                VALUES (%s, %s, %s, %s, %s, NOW())
                ON CONFLICT (user_id, income_date) DO UPDATE SET
                    amount=podelam_daily_income.amount + EXCLUDED.amount,
                    new_clients=COALESCE(podelam_daily_income.new_clients, 0) + EXCLUDED.new_clients,
                    returned_clients=COALESCE(podelam_daily_income.returned_clients, 0) + EXCLUDED.returned_clients,
                    updated_at=NOW()
                RETURNING amount, new_clients, returned_clients""",
            (user["id"], income_date, amount, new_clients, returned_clients)
        )
    row = cur.fetchone()
    conn.commit()
    return ok({
        "ok": True, "amount": float(row["amount"]),
        "new_clients": row["new_clients"] or 0, "returned_clients": row["returned_clients"] or 0,
    })


def _compute_period_stats(conn, user_id: int, days: int) -> dict:
    """Считает статистику по выполненным делам и потенциалу/факту за последние N дней."""
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    from datetime import timedelta
    since = date.today() - timedelta(days=days - 1)

    # Все задачи из планов за период (для подсчёта общего количества и потенциала)
    cur.execute(
        f"""SELECT plan_date, tasks FROM {SCHEMA}.podelam_daily_plans
            WHERE user_id = %s AND plan_date >= %s AND plan_date <= %s""",
        (user_id, since, date.today())
    )
    plans = cur.fetchall()

    total_tasks = 0
    potential_total = 0.0
    for p in plans:
        tasks = p["tasks"] if isinstance(p["tasks"], list) else json.loads(p["tasks"])
        total_tasks += len(tasks)
        potential_total += sum(float(t.get("potential") or 0) for t in tasks)

    # Выполненные дела за период (для счётчика "дел выполнено")
    cur.execute(
        f"""SELECT done FROM {SCHEMA}.podelam_task_log
            WHERE user_id = %s AND plan_date >= %s AND plan_date <= %s""",
        (user_id, since, date.today())
    )
    logs = cur.fetchall()
    done_count = sum(1 for r in logs if r["done"])

    # Фактический доход и клиенты, указанные мастером по дням
    cur.execute(
        f"""SELECT amount, new_clients, returned_clients FROM {SCHEMA}.podelam_daily_income
            WHERE user_id = %s AND income_date >= %s AND income_date <= %s""",
        (user_id, since, date.today())
    )
    income_rows = cur.fetchall()
    actual_total = sum(float(r["amount"]) for r in income_rows)
    new_clients_total = sum(r["new_clients"] or 0 for r in income_rows)
    returned_clients_total = sum(r["returned_clients"] or 0 for r in income_rows)

    return {
        "days": days,
        "total_tasks": total_tasks,
        "done_tasks": done_count,
        "completion_rate": round(done_count / total_tasks * 100) if total_tasks > 0 else 0,
        "potential_total": round(potential_total),
        "actual_total": round(actual_total),
        "new_clients_total": new_clients_total,
        "returned_clients_total": returned_clients_total,
    }


def handle_podelam_stats(event: dict, conn) -> dict:
    """Возвращает статистику выполненных дел и денег (потенциал/факт) за неделю и месяц."""
    session_id = (event.get("headers") or {}).get("X-Session-Id", "")
    if not session_id:
        return err("Не авторизован", 401)
    user = get_lk_user_by_session(session_id, conn)
    if not user:
        return err("Сессия истекла", 401)

    week = _compute_period_stats(conn, user["id"], 7)
    month = _compute_period_stats(conn, user["id"], 30)

    return ok({"week": week, "month": month})


def handler(event: dict, context) -> dict:
    """«ПоДелам» — быстрые операции личного кабинета (сохранение диагностики, отметка дел, статистика, доход за день)."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    qs = event.get("queryStringParameters") or {}
    route_action = qs.get("action", "")

    conn = get_db()
    try:
        if route_action == "podelam_save_profile":
            return handle_podelam_save_profile(event, conn)
        if route_action == "podelam_task_done":
            return handle_podelam_task_done(event, conn)
        if route_action == "podelam_stats":
            return handle_podelam_stats(event, conn)
        if route_action == "podelam_set_income":
            return handle_podelam_set_income(event, conn)

        return err("Неизвестное действие", 404)
    finally:
        conn.close()