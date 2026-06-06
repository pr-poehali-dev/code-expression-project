"""
Генератор постов для салона красоты. v3 — списание ДО AI.
Шаг 1: POST ?action=titles  — генерирует 5 заголовков по теме/цели/тону + контекст салона (бесплатно)
Шаг 2: POST ?action=text    — генерирует текст поста по выбранному заголовку (списывает 1 эн.)
"""
import json
import os
import urllib.request
import urllib.error
import psycopg2
import psycopg2.extras

SCHEMA = "t_p84565078_code_expression_proj"
TOOL_KEY = "post_gen"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def ok(data, status=200):
    return {"statusCode": status, "headers": CORS, "body": json.dumps(data, ensure_ascii=False, default=str)}


def err(msg, status=400):
    return {"statusCode": status, "headers": CORS, "body": json.dumps({"error": msg}, ensure_ascii=False)}


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
        f"SELECT COALESCE(SUM(CASE WHEN type='credit' THEN amount ELSE -amount END), 0) "
        f"FROM {SCHEMA}.credit_transactions WHERE salon_id = %s",
        (salon_id,)
    )
    return cur.fetchone()[0]


def deduct_energy(salon_id, user_id, cost, action, conn):
    cur = conn.cursor()
    cur.execute(f"UPDATE {SCHEMA}.salons SET credits_balance = credits_balance - %s WHERE id = %s", (cost, salon_id))
    cur.execute(
        f"INSERT INTO {SCHEMA}.credit_transactions (salon_id, user_id, action, amount, tool_key, type) "
        f"VALUES (%s, %s, %s, %s, %s, 'debit')",
        (salon_id, user_id, action, cost, TOOL_KEY)
    )
    conn.commit()


def get_salon_context(user, conn):
    if not user.get("salon_id"):
        return None
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT name, description, target_audience, tone_of_voice, main_goal, website_url FROM {SCHEMA}.salons WHERE id=%s",
        (user["salon_id"],)
    )
    return cur.fetchone()


def call_ai(messages, max_tokens=1000):
    api_key = os.environ.get("POLZA_AI_API_KEY", "")
    if not api_key:
        raise ValueError("POLZA_AI_API_KEY не задан")

    payload = json.dumps({
        "model": "openai/gpt-4.1-mini",
        "messages": messages,
        "temperature": 0.85,
        "max_tokens": max_tokens,
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


def handle_titles(event, user, conn):
    """Генерирует 5 заголовков постов — бесплатно."""
    body = json.loads(event.get("body") or "{}")
    topic = (body.get("topic") or "").strip()
    goal  = (body.get("goal")  or "").strip()
    tone  = (body.get("tone")  or "").strip()

    if not topic:
        return err("Укажите тему поста")

    salon = get_salon_context(user, conn)
    conn.close()

    salon_ctx = ""
    if salon:
        parts = []
        if salon.get("name"):            parts.append(f"Салон: {salon['name']}")
        if salon.get("target_audience"): parts.append(f"Аудитория: {salon['target_audience']}")
        if salon.get("description"):     parts.append(f"О салоне: {salon['description']}")
        if salon.get("website_url"):     parts.append(f"Сайт: {salon['website_url']}")
        if parts:
            salon_ctx = "\n".join(parts)

    prompt = f"""Ты — копирайтер для салона красоты. Придумай 5 цепляющих заголовков для поста.

Тема: {topic}
{f"Цель поста: {goal}" if goal else ""}
{f"Тон: {tone}" if tone else ""}
{f"Контекст салона:\n{salon_ctx}" if salon_ctx else ""}

Требования к заголовкам:
- Короткие (до 10 слов)
- Цепляют с первой строки
- Разные по подаче (вопрос, факт, обещание, интрига, польза)
- Без хэштегов
- На русском языке

Верни ТОЛЬКО пронумерованный список из 5 заголовков, без пояснений:
1. ...
2. ...
3. ...
4. ...
5. ..."""

    content = call_ai([
        {"role": "system", "content": "Ты профессиональный копирайтер для бьюти-бизнеса. Пиши живо и по делу."},
        {"role": "user", "content": prompt}
    ], max_tokens=400)

    titles = []
    for line in content.split("\n"):
        line = line.strip()
        if not line:
            continue
        import re
        line = re.sub(r"^\d+[\.\)]\s*", "", line)
        line = re.sub(r"^[-–]\s*", "", line)
        if line:
            titles.append(line)

    return ok({"titles": titles[:5]})


def handle_text(event, user, conn):
    """Генерирует текст поста — списывает 1 энергию."""
    salon_id = user.get("salon_id")
    if not salon_id:
        return err("Салон не найден", 400)

    cost = get_tool_cost(conn)
    balance = get_salon_balance(salon_id, conn)
    if balance < cost:
        return err(f"Недостаточно энергии. Нужно {cost}, доступно {balance}.", 402)

    body  = json.loads(event.get("body") or "{}")
    title = (body.get("title") or "").strip()
    topic = (body.get("topic") or "").strip()
    goal  = (body.get("goal")  or "").strip()
    tone  = (body.get("tone")  or "").strip()

    if not title:
        return err("Заголовок не передан")

    # Списываем ДО вызова ИИ
    deduct_energy(salon_id, user["id"], cost, "Генерация поста", conn)

    salon = get_salon_context(user, conn)
    conn.close()

    salon_ctx = ""
    if salon:
        parts = []
        if salon.get("name"):            parts.append(f"Салон: {salon['name']}")
        if salon.get("target_audience"): parts.append(f"Аудитория: {salon['target_audience']}")
        if salon.get("tone_of_voice"):   parts.append(f"Стиль общения: {salon['tone_of_voice']}")
        if salon.get("main_goal"):       parts.append(f"Главная задача: {salon['main_goal']}")
        if salon.get("website_url"):     parts.append(f"Сайт: {salon['website_url']}")
        if parts:
            salon_ctx = "\n".join(parts)

    prompt = f"""Напиши текст поста для социальной сети салона красоты.

Заголовок: {title}
{f"Тема: {topic}" if topic else ""}
{f"Цель поста: {goal}" if goal else ""}
{f"Тон: {tone}" if tone else ""}
{f"Контекст салона:\n{salon_ctx}" if salon_ctx else ""}

Структура поста:
1. Первая строка = заголовок (уже дан, используй его)
2. 2-3 абзаца основного текста (польза, история или факт)
3. Призыв к действию в конце
4. 5-7 релевантных хэштегов

Требования:
- Живой, не рекламный язык
- Без воды и клише ("уникальный", "лучший")
- Эмодзи — умеренно, только по делу
- Длина: 150-250 слов
- Хэштеги отдельной строкой в конце"""

    content = call_ai([
        {"role": "system", "content": "Ты профессиональный SMM-копирайтер для бьюти-бизнеса. Пишешь живые, вовлекающие тексты."},
        {"role": "user", "content": prompt}
    ], max_tokens=800)

    salon_name = salon["name"] if salon and salon.get("name") else ""
    image_prompt = f"Красивое фото для поста салона красоты. Тема: {title}. {f'Салон: {salon_name}.' if salon_name else ''} Стиль: светлый, эстетичный, профессиональный. Вертикальный формат."

    return ok({"text": content, "image_prompt": image_prompt})


def handler(event: dict, context) -> dict:
    """Генератор постов для салона — заголовки и текст через ИИ."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}
    if event.get("httpMethod") != "POST":
        return err("Method not allowed", 405)

    qs     = event.get("queryStringParameters") or {}
    action = qs.get("action", "")

    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)

        if action == "titles":
            return handle_titles(event, user, conn)
        elif action == "text":
            return handle_text(event, user, conn)
        else:
            return err("Неизвестное действие", 404)

    except Exception as e:
        msg = str(e)
        print(f"[post-generator] error: {msg}")
        if "timed out" in msg.lower():
            return err("Сервис не ответил. Попробуйте ещё раз.", 504)
        return err(f"Ошибка: {msg}", 502)
    finally:
        try:
            conn.close()
        except Exception:
            pass