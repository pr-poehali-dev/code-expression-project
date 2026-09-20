"""
«ПоДелам» — быстрые операции личного кабинета, вынесенные из masters-accrual в отдельную функцию
с низким таймаутом (15с), чтобы часто вызываемые лёгкие запросы (сохранить диагностику, отметить
дело, статистика, доход за день) не тарифицировались по цене тяжёлых ИИ-операций (построение
плана дня, генерация поста в блог) — те остались в masters-accrual с таймаутом 60-100с.
Публичного контракта action'ов не меняли — фронт бьёт по тем же именам, что и раньше.

POST ?action=podelam_save_profile — сохранить диагностику дохода (X-Session-Id). Поле conversion_rate (опционально,
                                      % обращений, доходящих до первой консультации/записи) актуально в первую очередь
                                      для частной практики (психологи/телесные психологи, см. lk_users.specialization).
                                      Доп. поля (все опциональны): about_me (свободный текст — образование, опыт),
                                      personal_goals (массив кодов немонетарных целей — new_skill/certification/
                                      confidence/personal_brand/public_speaking/team_growth/burnout/networking/
                                      work_life_balance/other, см. PERSONAL_GOAL_OPTIONS на фронте), personal_goals_other
                                      (текст, если выбран код "other"). Используются ИИ для более точных рекомендаций
                                      курсов/тренингов Академии — не только на основе финансового разрыва.
POST ?action=podelam_task_done    — отметить дело выполненным, опционально с фактической суммой (X-Session-Id)
GET  ?action=podelam_stats        — статистика выполненных дел, дохода и новых/вернувшихся клиентов за неделю/месяц (X-Session-Id)
POST ?action=podelam_set_income   — прибавить фактический доход за день и опционально кол-во новых/вернувшихся клиентов
                                      (amount, опц. new_clients, returned_clients, date, mode="add"|"replace") (X-Session-Id)
GET  ?action=podelam_resources_get  — постоянный чек-лист «Мои ресурсы» (Яндекс Бизнес/Карты, сайт, соцсети и т.п.,
                                      см. RESOURCE_DEFS) — статус подключён/не подключён + опциональная ссылка на профиль.
                                      Не привязан к конкретному дню/плану — используется «Пульсом бизнеса», чтобы ИИ не
                                      советовал завести то, что уже подключено, и подсказывал, что размещать там, где
                                      пользователь уже присутствует (X-Session-Id).
POST ?action=podelam_resources_save — сохранить статус ресурса: {resource_key, connected, url?, note?} (X-Session-Id)
POST ?action=podelam_pulse_action_done — отметить рекомендацию «Пульса бизнеса» (главное действие/доп. рекомендацию/
                                      канал из карты привлечения клиентов) выполненной — {action_key, action_text} (X-Session-Id).
                                      Ключ действия и текст сохраняются вместе, т.к. Пульс пересчитывается раз в сутки
                                      и не имеет постоянных task_key как обычный план дня — ИИ получает историю по тексту.
GET  ?action=podelam_pulse_actions_done — список action_key уже отмеченных выполненными рекомендаций Пульса (для
                                      восстановления состояния кнопок "Выполнено" после перезагрузки страницы) (X-Session-Id)
"""
import json
import os
from datetime import date
import psycopg2
import psycopg2.extras

SCHEMA = "t_p84565078_code_expression_proj"

# «Мои ресурсы» — фиксированный список площадок, которые пользователь может отметить как
# подключённые (со ссылкой на свой профиль/страницу). Общий список для всех, фронт показывает
# только те, что подходят категории пользователя (см. categories аналогично traffic_sources).
RESOURCE_DEFS = [
    {"key": "yandex_maps",   "label": "Яндекс Карты / Яндекс Бизнес", "categories": ["salon", "solo_master"]},
    {"key": "yandex_search", "label": "Сайт (для поиска в Яндексе)",  "categories": ["salon", "solo_master", "psychologist", "body_psychologist"]},
    {"key": "vk",            "label": "VK",                           "categories": ["salon", "solo_master", "psychologist", "body_psychologist"]},
    {"key": "telegram",      "label": "Telegram-канал",                "categories": ["salon", "solo_master", "psychologist", "body_psychologist"]},
    {"key": "instagram",     "label": "Instagram*",                    "categories": ["salon", "solo_master", "psychologist", "body_psychologist"]},
    {"key": "dzen",          "label": "Дзен",                          "categories": ["salon", "solo_master", "psychologist", "body_psychologist"]},
    {"key": "yandex_uslugi", "label": "Яндекс Услуги",                 "categories": ["salon", "solo_master"]},
    {"key": "profi_ru",      "label": "Профи.ру",                      "categories": ["solo_master", "psychologist", "body_psychologist"]},
    {"key": "b17",           "label": "B17.ru",                        "categories": ["psychologist", "body_psychologist"]},
]

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

    about_me = (body.get("about_me") or "").strip()[:800] or None
    personal_goals = body.get("personal_goals") or []
    if not isinstance(personal_goals, list):
        personal_goals = []
    personal_goals = [str(g)[:50] for g in personal_goals][:10]
    personal_goals_other = (body.get("personal_goals_other") or "").strip()[:300] or None

    cur = conn.cursor()
    cur.execute(
        f"""INSERT INTO {SCHEMA}.podelam_profiles
            (user_id, salon_id, niche, avg_check, current_revenue, target_revenue,
             clients_per_month, base_size, repeat_rate, free_slots_per_week, has_addon_services,
             addon_services_text, lead_source, conversion_rate, about_me, personal_goals, personal_goals_other, updated_at)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,NOW())
            ON CONFLICT (user_id) DO UPDATE SET
                salon_id=EXCLUDED.salon_id, niche=EXCLUDED.niche, avg_check=EXCLUDED.avg_check,
                current_revenue=EXCLUDED.current_revenue, target_revenue=EXCLUDED.target_revenue,
                clients_per_month=EXCLUDED.clients_per_month, base_size=EXCLUDED.base_size,
                repeat_rate=EXCLUDED.repeat_rate, free_slots_per_week=EXCLUDED.free_slots_per_week,
                has_addon_services=EXCLUDED.has_addon_services, addon_services_text=EXCLUDED.addon_services_text,
                lead_source=EXCLUDED.lead_source, conversion_rate=EXCLUDED.conversion_rate,
                about_me=EXCLUDED.about_me, personal_goals=EXCLUDED.personal_goals,
                personal_goals_other=EXCLUDED.personal_goals_other,
                updated_at=NOW()""",
        (
            user["id"], user.get("salon_id"), body.get("niche", ""),
            float(body["avg_check"]), float(body["current_revenue"]), float(body["target_revenue"]),
            int(body.get("clients_per_month") or 0), int(body.get("base_size") or 0),
            int(body.get("repeat_rate") or 0), int(body.get("free_slots_per_week") or 0),
            bool(body.get("has_addon_services") or False), (body.get("addon_services_text") or "").strip() or None,
            body.get("lead_source", ""), conversion_rate,
            about_me, personal_goals, personal_goals_other,
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


def handle_podelam_resources_get(event: dict, conn) -> dict:
    """Чек-лист «Мои ресурсы»: фиксированный список площадок (RESOURCE_DEFS) + сохранённый
    статус пользователя (подключён/нет, ссылка). Площадки без сохранённой записи возвращаются
    со значением connected=false — фронт всегда получает полный список, а не только то, что
    пользователь уже сохранил."""
    session_id = (event.get("headers") or {}).get("X-Session-Id", "")
    if not session_id:
        return err("Не авторизован", 401)
    user = get_lk_user_by_session(session_id, conn)
    if not user:
        return err("Сессия истекла", 401)

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT resource_key, connected, url, note FROM {SCHEMA}.podelam_resources WHERE user_id=%s",
        (user["id"],)
    )
    saved = {r["resource_key"]: r for r in cur.fetchall()}

    resources = []
    for d in RESOURCE_DEFS:
        s = saved.get(d["key"])
        resources.append({
            "key": d["key"], "label": d["label"], "categories": d["categories"],
            "connected": bool(s["connected"]) if s else False,
            "url": s["url"] if s else None,
            "note": s["note"] if s else None,
        })
    return ok({"resources": resources})


def handle_podelam_resources_save(event: dict, conn) -> dict:
    """Сохраняет статус одного ресурса (подключён/не подключён, опциональная ссылка/заметка)."""
    session_id = (event.get("headers") or {}).get("X-Session-Id", "")
    if not session_id:
        return err("Не авторизован", 401)
    user = get_lk_user_by_session(session_id, conn)
    if not user:
        return err("Сессия истекла", 401)

    body = json.loads(event.get("body") or "{}")
    resource_key = (body.get("resource_key") or "").strip()
    if not resource_key or resource_key not in {d["key"] for d in RESOURCE_DEFS}:
        return err("Некорректный ресурс")
    connected = bool(body.get("connected", True))
    url = (body.get("url") or "").strip()[:500] or None
    note = (body.get("note") or "").strip()[:300] or None

    cur = conn.cursor()
    cur.execute(
        f"""INSERT INTO {SCHEMA}.podelam_resources (user_id, resource_key, connected, url, note, updated_at)
            VALUES (%s,%s,%s,%s,%s,NOW())
            ON CONFLICT (user_id, resource_key) DO UPDATE SET
                connected=EXCLUDED.connected, url=EXCLUDED.url, note=EXCLUDED.note, updated_at=NOW()""",
        (user["id"], resource_key, connected, url, note)
    )
    conn.commit()
    return ok({"ok": True})


def handle_podelam_pulse_action_done(event: dict, conn) -> dict:
    """Отмечает рекомендацию «Пульса бизнеса» (главное действие/доп. рекомендацию/канал из
    карты привлечения клиентов) выполненной. action_key — стабильный короткий хэш текста
    рекомендации (считается на фронте), чтобы одна и та же рекомендация не задваивалась в логе,
    если ИИ вернул её снова в следующем пересчёте."""
    session_id = (event.get("headers") or {}).get("X-Session-Id", "")
    if not session_id:
        return err("Не авторизован", 401)
    user = get_lk_user_by_session(session_id, conn)
    if not user:
        return err("Сессия истекла", 401)

    body = json.loads(event.get("body") or "{}")
    action_key = (body.get("action_key") or "").strip()[:64]
    action_text = (body.get("action_text") or "").strip()[:1000]
    if not action_key or not action_text:
        return err("Нужны action_key и action_text")
    done = bool(body.get("done", True))

    cur = conn.cursor()
    if done:
        cur.execute(
            f"""INSERT INTO {SCHEMA}.podelam_pulse_action_log (user_id, action_key, action_text, done)
                VALUES (%s,%s,%s,TRUE)
                ON CONFLICT (user_id, action_key) DO UPDATE SET done=TRUE, action_text=EXCLUDED.action_text""",
            (user["id"], action_key, action_text)
        )
    else:
        cur.execute(
            f"DELETE FROM {SCHEMA}.podelam_pulse_action_log WHERE user_id=%s AND action_key=%s",
            (user["id"], action_key)
        )
    conn.commit()
    return ok({"ok": True})


def handle_podelam_pulse_actions_done(event: dict, conn) -> dict:
    """Список action_key уже отмеченных выполненными рекомендаций Пульса — фронт восстанавливает
    состояние кнопок "Выполнено" после перезагрузки страницы."""
    session_id = (event.get("headers") or {}).get("X-Session-Id", "")
    if not session_id:
        return err("Не авторизован", 401)
    user = get_lk_user_by_session(session_id, conn)
    if not user:
        return err("Сессия истекла", 401)

    cur = conn.cursor()
    cur.execute(
        f"SELECT action_key FROM {SCHEMA}.podelam_pulse_action_log WHERE user_id=%s AND done=TRUE",
        (user["id"],)
    )
    return ok({"done_keys": [r[0] for r in cur.fetchall()]})


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
        if route_action == "podelam_resources_get":
            return handle_podelam_resources_get(event, conn)
        if route_action == "podelam_resources_save":
            return handle_podelam_resources_save(event, conn)
        if route_action == "podelam_pulse_action_done":
            return handle_podelam_pulse_action_done(event, conn)
        if route_action == "podelam_pulse_actions_done":
            return handle_podelam_pulse_actions_done(event, conn)

        return err("Неизвестное действие", 404)
    finally:
        conn.close()