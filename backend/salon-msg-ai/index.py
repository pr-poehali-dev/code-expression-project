"""
ИИ-генератор персональных сообщений для клиентов салона.
POST /  — генерирует текст сообщения, списывает 1 энергию.
Типы: appointment_reminder, win_back, new_service, birthday, review_request, seasonal
"""
import json
import os
import urllib.request
import psycopg2
import psycopg2.extras

SCHEMA = "t_p84565078_code_expression_proj"
TOOL_KEY = "client_msg_gen"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}

MSG_TYPES = {
    "appointment_reminder": "напоминание о предстоящей записи",
    "win_back": "возврат клиента (давно не приходил)",
    "new_service": "анонс новой услуги или акции",
    "birthday": "поздравление с днём рождения",
    "review_request": "просьба оставить отзыв после визита",
    "seasonal": "сезонное предложение / праздник",
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


def get_tool_cost(conn) -> int:
    cur = conn.cursor()
    cur.execute(f"SELECT energy_cost FROM {SCHEMA}.tool_costs WHERE tool_key = %s", (TOOL_KEY,))
    row = cur.fetchone()
    return row[0] if row else 1


def get_salon_balance(salon_id, conn) -> int:
    cur = conn.cursor()
    cur.execute(
        f"SELECT COALESCE(credits_balance, 0) FROM {SCHEMA}.salons WHERE id = %s", (salon_id,)
    )
    return cur.fetchone()[0]


def deduct_energy(salon_id, user_id, cost, action, conn):
    cur = conn.cursor()
    cur.execute(
        f"UPDATE {SCHEMA}.salons SET credits_balance = credits_balance - %s WHERE id = %s",
        (cost, salon_id)
    )
    cur.execute(
        f"INSERT INTO {SCHEMA}.credit_transactions (salon_id, user_id, action, amount, tool_key, type) "
        f"VALUES (%s, %s, %s, %s, %s, 'debit')",
        (salon_id, user_id, action, cost, TOOL_KEY)
    )
    conn.commit()


def call_ai(messages) -> str:
    api_key = os.environ.get("POLZA_AI_API_KEY", "")
    payload = json.dumps({
        "model": "openai/gpt-4.1-mini",
        "messages": messages,
        "temperature": 0.9,
        "max_tokens": 400,
    }).encode("utf-8")
    req = urllib.request.Request(
        "https://polza.ai/api/v1/chat/completions",
        data=payload,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data["choices"][0]["message"]["content"].strip()


def build_prompt(msg_type: str, body: dict, salon_name: str) -> str:
    client_name = body.get("client_name", "").strip()
    service = body.get("service", "").strip()
    date_time = body.get("date_time", "").strip()
    extra = body.get("extra", "").strip()
    tone = body.get("tone", "тёплый и дружелюбный").strip()

    base = (
        f"Ты — администратор салона красоты «{salon_name}». "
        f"Напиши короткое персональное сообщение клиенту в мессенджер (WhatsApp/Telegram). "
        f"Тон: {tone}. Без лишних слов, без восклицательных знаков через строчку. "
        f"Не используй шаблонные фразы вроде «Уважаемый клиент». Сообщение должно звучать живо и по-человечески. "
        f"Длина: 3-5 предложений. Не добавляй подпись и название салона в конце — они уже есть в мессенджере.\n\n"
    )

    if msg_type == "appointment_reminder":
        return base + (
            f"Задача: напомнить клиенту {client_name or 'клиенту'} о записи.\n"
            f"Дата и время: {date_time or 'уточните у клиента'}.\n"
            f"Услуга: {service or 'не указана'}.\n"
            f"Доп. пожелания: {extra or 'нет'}.\n"
            f"Добавь просьбу предупредить заранее, если планы изменятся."
        )
    elif msg_type == "win_back":
        return base + (
            f"Задача: ненавязчиво напомнить о себе клиенту {client_name or ''}, который давно не приходил. "
            f"Покажи, что скучаем. Предложи записаться.\n"
            f"Услуга, которой интересовался: {service or 'не указана'}.\n"
            f"Доп. пожелания: {extra or 'нет'}."
        )
    elif msg_type == "new_service":
        return base + (
            f"Задача: рассказать клиенту {client_name or ''} о новой услуге или акции.\n"
            f"Услуга / акция: {service or 'новинка в салоне'}.\n"
            f"Доп. детали: {extra or 'нет'}.\n"
            f"Пригласи записаться, без давления."
        )
    elif msg_type == "birthday":
        return base + (
            f"Задача: поздравить клиента {client_name or ''} с днём рождения.\n"
            f"Можно намекнуть на подарок или скидку для именинника.\n"
            f"Доп. пожелания: {extra or 'нет'}."
        )
    elif msg_type == "review_request":
        return base + (
            f"Задача: после визита попросить клиента {client_name or ''} оставить отзыв.\n"
            f"Услуга: {service or 'не указана'}.\n"
            f"Сделай просьбу лёгкой, без давления. Дай понять, что мнение важно.\n"
            f"Доп. пожелания: {extra or 'нет'}."
        )
    elif msg_type == "seasonal":
        return base + (
            f"Задача: сезонное/праздничное предложение для клиента {client_name or ''}.\n"
            f"Тема: {extra or service or 'сезонная акция'}.\n"
            f"Услуга: {service or 'не указана'}."
        )
    return base + f"Задача: написать клиенту {client_name or ''} по поводу: {extra or service or 'визита в салон'}."


def handler(event: dict, context) -> dict:
    """Генерирует персональное сообщение клиенту салона красоты через ИИ. Стоимость: 1 энергия."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)

        salon_id = user.get("salon_id")
        if not salon_id:
            return err("Привяжите профиль салона, чтобы пользоваться инструментом", 402)

        body = json.loads(event.get("body") or "{}")
        msg_type = (body.get("msg_type") or "").strip()
        if msg_type not in MSG_TYPES:
            return err(f"Неизвестный тип сообщения. Допустимые: {', '.join(MSG_TYPES.keys())}")

        cost = get_tool_cost(conn)
        balance = get_salon_balance(salon_id, conn)
        if balance < cost:
            return err(f"Недостаточно энергии. Нужно {cost}, доступно {balance}.", 402)

        cur = conn.cursor()
        cur.execute(f"SELECT name FROM {SCHEMA}.salons WHERE id = %s", (salon_id,))
        salon_row = cur.fetchone()
        salon_name = salon_row[0] if salon_row else "салон"

        deduct_energy(salon_id, user["id"], cost, f"Генерация сообщения: {MSG_TYPES[msg_type]}", conn)
    finally:
        conn.close()

    prompt = build_prompt(msg_type, body, salon_name)
    text = call_ai([
        {"role": "system", "content": "Ты опытный администратор салона красоты. Пишешь живые, персональные сообщения клиентам."},
        {"role": "user", "content": prompt},
    ])

    conn2 = get_db()
    try:
        new_balance = get_salon_balance(salon_id, conn2)
    finally:
        conn2.close()

    return ok({"text": text, "balance": new_balance, "cost": cost})