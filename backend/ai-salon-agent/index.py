import json
import os
import urllib.request
import psycopg2
import psycopg2.extras

SCHEMA = "t_p84565078_code_expression_proj"
FREE_MESSAGES = 10
ENERGY_PER_MESSAGE = 10
TOOL_KEY = "salon_agent_chat"

def tbl(name):
    return f"{SCHEMA}.{name}"

def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}

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

def get_salon_context(conn, salon_id: int) -> str:
    """Собирает полный контекст салона для промта агента."""
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT name, city, address, description, avg_check, monthly_revenue, "
        f"clients_count, masters_count, target_audience, tone_of_voice, "
        f"social_instagram, social_vk, social_telegram, main_goal, has_medical_license "
        f"FROM {tbl('salons')} WHERE id = %s",
        (salon_id,)
    )
    salon = cur.fetchone()
    if not salon:
        return ""

    cur.execute(
        f"SELECT name, price_min, price_max, duration_min FROM {tbl('salon_services')} "
        f"WHERE salon_id = %s ORDER BY sort_order, id LIMIT 50",
        (salon_id,)
    )
    services = cur.fetchall()

    lines = [
        "════════════════════════════════════",
        "ДАННЫЕ САЛОНА (используй в каждом ответе)",
        "════════════════════════════════════",
    ]

    if salon["name"]:       lines.append(f"Название: {salon['name']}")
    if salon["city"]:       lines.append(f"Город: {salon['city']}")
    if salon["address"]:    lines.append(f"Адрес: {salon['address']}")
    if salon["description"]:lines.append(f"Описание: {salon['description']}")
    if salon["avg_check"]:  lines.append(f"Средний чек: {int(salon['avg_check'])} ₽")
    if salon["monthly_revenue"]: lines.append(f"Месячная выручка: {int(salon['monthly_revenue'])} ₽")
    if salon["clients_count"]:   lines.append(f"Количество клиентов: {salon['clients_count']}")
    if salon["masters_count"]:   lines.append(f"Количество мастеров: {salon['masters_count']}")
    if salon["target_audience"]: lines.append(f"Целевая аудитория: {salon['target_audience']}")
    if salon["tone_of_voice"]:   lines.append(f"Тон коммуникации: {salon['tone_of_voice']}")
    if salon["main_goal"]:       lines.append(f"Главная цель: {salon['main_goal']}")
    if salon["has_medical_license"] is not None:
        lines.append(f"Медицинская лицензия: {'да' if salon['has_medical_license'] else 'нет'}")

    socials = []
    if salon["social_instagram"]: socials.append(f"Instagram: {salon['social_instagram']}")
    if salon["social_vk"]:        socials.append(f"ВКонтакте: {salon['social_vk']}")
    if salon["social_telegram"]:  socials.append(f"Telegram: {salon['social_telegram']}")
    if socials:
        lines.append("Соцсети: " + ", ".join(socials))

    if services:
        lines.append("")
        lines.append("Услуги салона:")
        for s in services:
            price = ""
            if s["price_min"] and s["price_max"]:
                price = f" — {int(s['price_min'])}–{int(s['price_max'])} ₽"
            elif s["price_min"]:
                price = f" — от {int(s['price_min'])} ₽"
            duration = f", {s['duration_min']} мин" if s["duration_min"] else ""
            lines.append(f"  • {s['name']}{price}{duration}")

    lines += [
        "════════════════════════════════════",
        "Всегда учитывай эти данные. Когда пишешь контент, скрипты или рекомендации — опирайся на реальное название, услуги и цены салона.",
        "════════════════════════════════════",
    ]
    return "\n".join(lines)

def get_free_used(conn, user_id: int) -> int:
    cur = conn.cursor()
    cur.execute(
        f"SELECT free_used FROM {tbl('salon_agent_free_usage')} WHERE user_id = %s",
        (user_id,)
    )
    row = cur.fetchone()
    return row[0] if row else 0

def increment_free(conn, user_id: int):
    cur = conn.cursor()
    cur.execute(
        f"INSERT INTO {tbl('salon_agent_free_usage')} (user_id, free_used) VALUES (%s, 1) "
        f"ON CONFLICT (user_id) DO UPDATE SET free_used = salon_agent_free_usage.free_used + 1",
        (user_id,)
    )

def get_salon_balance(conn, salon_id: int) -> int:
    cur = conn.cursor()
    cur.execute(f"SELECT credits_balance FROM {tbl('salons')} WHERE id = %s", (salon_id,))
    row = cur.fetchone()
    return row[0] if row else 0

def deduct_energy(conn, salon_id: int, user_id: int, amount: int, action: str):
    cur = conn.cursor()
    cur.execute(
        f"UPDATE {tbl('salons')} SET credits_balance = credits_balance - %s WHERE id = %s",
        (amount, salon_id)
    )
    cur.execute(
        f"INSERT INTO {tbl('credit_transactions')} (salon_id, user_id, action, amount, tool_key, type) "
        f"VALUES (%s, %s, %s, %s, %s, 'debit')",
        (salon_id, user_id, action, amount, TOOL_KEY)
    )

# ── Системные промты ─────────────────────────────────────────────────────────
PROJECT_KNOWLEDGE = """
════════════════════════════════════════════════
БАЗА ЗНАНИЙ: ПРОЕКТ «ПРО ДИАЛОГ» (promtdialog.ru)
════════════════════════════════════════════════
Платформа ИИ-инструментов для специалистов по работе с телом и владельцев салонов красоты.
Автор: Сергей Водопьянов — 17+ лет практики.
Философия: 68% клиентов уходят не из-за качества услуги, а потому что чувствуют, что их не слышат.
════════════════════════════════════════════════
"""

AGENT_PROMPTS = {
    "business": PROJECT_KNOWLEDGE + """{salon_context}

Ты — бизнес-ассистент салона красоты. Работаешь с владельцем и управляющим.
Задачи: стратегия, финансы (выручка, маржа, P&L), управление командой, операционные процессы, рост, антикризис.
Стиль: как опытный партнёр-консультант. Конкретно, с цифрами. Опирайся на реальные данные салона выше.""",

    "service": PROJECT_KNOWLEDGE + """{salon_context}

Ты — эксперт по телесным практикам и сервису салона.
Задачи: разбор клиентских случаев, протоколы процедур, коммуникация с клиентом, работа с трудными клиентами, профрост мастеров, карта тела.
Стиль: как старший коллега. Используй реальные услуги и цены салона в рекомендациях.""",

    "admin": PROJECT_KNOWLEDGE + """{salon_context}

Ты — помощник администратора салона.
Задачи: ответы клиентам (телефон, мессенджеры), скрипты записи и допродаж, работа с отзывами, тексты рассылок, разрешение конфликтов.
Стиль: дружелюбный, чёткий. Всегда давай готовые формулировки с реальными услугами и ценами салона.""",

    "marketer": PROJECT_KNOWLEDGE + """{salon_context}

Ты — маркетолог салона красоты.
Задачи: контент для соцсетей (посты, сторис, Reels), акции и офферы, привлечение клиентов (Директ, ВКонтакте, 2ГИС), удержание, репутация, аналитика.
Стиль: конкретные идеи, готовые тексты. Используй реальные услуги, цены и соцсети салона.""",
}

AGENT_NAMES = {
    "business": "Бизнес-ассистент",
    "service": "Эксперт по сервису",
    "admin": "Администратор-помощник",
    "marketer": "Маркетолог",
}

MAX_HISTORY = 30

def call_ai(system_prompt: str, messages: list) -> str:
    api_key = os.environ.get("POLZA_AI_API_KEY", "")
    payload = json.dumps({
        "model": "openai/gpt-4.1",
        "messages": [{"role": "system", "content": system_prompt}] + messages,
        "temperature": 0.75,
        "max_tokens": 2000,
    }).encode("utf-8")
    req = urllib.request.Request(
        "https://polza.ai/api/v1/chat/completions",
        data=payload,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=55) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data["choices"][0]["message"]["content"].strip()


def handler(event: dict, context) -> dict:
    """ИИ-агент для салонов. 10 бесплатных сообщений на пользователя, далее 10 энергии/сообщение. Контекст салона (название, услуги, цены, геолокация) подтягивается автоматически."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")

    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)

        allowed_roles = {"owner", "admin"}
        user_role = user.get("role", "body_specialist")
        if user_role not in allowed_roles and not user.get("is_admin"):
            return err("Доступ только для владельцев, управляющих и администраторов", 403)

        user_id = user["id"]
        salon_id = user.get("salon_id")
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        # GET — история + баланс
        if method == "GET":
            agent_role = (event.get("queryStringParameters") or {}).get("agent_role", "business")
            cur.execute(
                f"SELECT role, content, created_at FROM {tbl('salon_agent_chats')} "
                f"WHERE user_id = %s AND agent_role = %s AND content != '[удалено]' "
                f"ORDER BY created_at DESC LIMIT %s",
                (user_id, agent_role, MAX_HISTORY)
            )
            rows = cur.fetchall()
            messages = [{"role": r["role"], "content": r["content"]} for r in reversed(rows)]

            free_used = get_free_used(conn, user_id)
            balance = get_salon_balance(conn, salon_id) if salon_id else 0

            return ok({
                "messages": messages,
                "agent_role": agent_role,
                "free_used": free_used,
                "free_limit": FREE_MESSAGES,
                "energy_balance": balance,
                "energy_per_message": ENERGY_PER_MESSAGE,
            })

        # POST — отправить сообщение
        if method == "POST":
            body = json.loads(event.get("body") or "{}")
            agent_role = body.get("agent_role", "business")
            user_message = (body.get("message") or "").strip()

            if not user_message:
                return err("Сообщение не может быть пустым")
            if agent_role not in AGENT_PROMPTS:
                return err("Неизвестная роль агента")

            free_used = get_free_used(conn, user_id)
            is_free = free_used < FREE_MESSAGES
            balance = get_salon_balance(conn, salon_id) if salon_id else 0

            # Проверка оплаты
            if not is_free:
                if not salon_id:
                    return err("Заполните профиль салона для использования агента", 402)
                if balance < ENERGY_PER_MESSAGE:
                    return ok({
                        "error": "no_energy",
                        "energy_balance": balance,
                        "energy_needed": ENERGY_PER_MESSAGE,
                        "free_used": free_used,
                        "free_limit": FREE_MESSAGES,
                    })

            # Загружаем историю
            cur.execute(
                f"SELECT role, content FROM {tbl('salon_agent_chats')} "
                f"WHERE user_id = %s AND agent_role = %s AND content != '[удалено]' "
                f"ORDER BY created_at DESC LIMIT %s",
                (user_id, agent_role, MAX_HISTORY)
            )
            rows = cur.fetchall()
            history = [{"role": r["role"], "content": r["content"]} for r in reversed(rows)]
            history.append({"role": "user", "content": user_message})

            # Контекст салона
            salon_context = get_salon_context(conn, salon_id) if salon_id else ""
            system_prompt = AGENT_PROMPTS[agent_role].format(salon_context=salon_context)

            reply = call_ai(system_prompt, history)

            # Списание / счётчик
            if is_free:
                increment_free(conn, user_id)
            else:
                deduct_energy(conn, salon_id, user_id, ENERGY_PER_MESSAGE,
                              f"ИИ-Агент: {AGENT_NAMES[agent_role]}")

            cur.execute(
                f"INSERT INTO {tbl('salon_agent_chats')} "
                f"(user_id, salon_id, agent_role, role, content, is_free) VALUES (%s,%s,%s,'user',%s,%s)",
                (user_id, salon_id, agent_role, user_message, is_free)
            )
            cur.execute(
                f"INSERT INTO {tbl('salon_agent_chats')} "
                f"(user_id, salon_id, agent_role, role, content, is_free) VALUES (%s,%s,%s,'assistant',%s,%s)",
                (user_id, salon_id, agent_role, reply, is_free)
            )
            conn.commit()

            new_free_used = free_used + 1 if is_free else free_used
            new_balance = balance if is_free else balance - ENERGY_PER_MESSAGE

            return ok({
                "reply": reply,
                "agent_role": agent_role,
                "agent_name": AGENT_NAMES[agent_role],
                "is_free": is_free,
                "free_used": new_free_used,
                "free_limit": FREE_MESSAGES,
                "energy_balance": new_balance,
                "energy_per_message": ENERGY_PER_MESSAGE,
            })

        # DELETE — очистка истории
        if method == "DELETE":
            agent_role = (event.get("queryStringParameters") or {}).get("agent_role", "business")
            cur.execute(
                f"UPDATE {tbl('salon_agent_chats')} SET content = '[удалено]' "
                f"WHERE user_id = %s AND agent_role = %s",
                (user_id, agent_role)
            )
            conn.commit()
            return ok({"cleared": True})

        return err("Метод не поддерживается", 405)

    finally:
        conn.close()
