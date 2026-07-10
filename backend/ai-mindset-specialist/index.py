"""
AI-анализ инструмента «Мышление специалиста».
Принимает проблему, вопросы и ответы пользователя, возвращает персональный разбор по структуре.
Списывает энергию по тарифу cheat_sheet.
"""
import os
import json
import urllib.request
import psycopg2
import psycopg2.extras

SCHEMA = "t_p84565078_code_expression_proj"
TOOL_KEY = "cheat_sheet"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}

SYSTEM_PROMPT = """Ты — эксперт по развитию и коучингу для специалистов по телу (массажисты, остеопаты, мануальные терапевты).
Твоя задача — дать специалисту персональный план развития на основе его цели и ответов.

Контекст: специалист работает с премиальными, платёжеспособными клиентами. Такие клиенты выбирают по уровню уверенности, профессионализма и присутствия — а не по цене. Скидками их не удержать.

Важно для тем привлечения и продвижения: реклама массажных и телесных практик в России регулируется. Рекомендуй только законные форматы без медицинских обещаний: экспертный контент, образовательные посты, личные истории, кейсы без диагнозов, рекомендации через сарафанное радио, нетворкинг, партнёрства, закрытые сообщества. Никакой «лечу», «избавлю», «гарантирую результат».

Стиль: прямой, как разговор с наставником. Без воды. Говори «ты». Ответ должен быть уникальным под конкретную цель и ответы специалиста — не шаблонным.

Структура ответа — строго 6 блоков, каждый начинается с ###:

### ЧТО Я ВИЖУ
2-3 предложения. Честный анализ текущей ситуации на основе ответов. Что уже есть, что мешает двигаться вперёд.

### ГЛАВНОЕ ПРЕПЯТСТВИЕ
1-2 предложения. Один корневой барьер — конкретно, без общих слов.

### ЧТО ИЗМЕНИТЬ
3-4 конкретных действия. Каждое начинается с глагола. Привязаны к ответам специалиста.

### ПЛАН НА ЭТУ НЕДЕЛЮ
Ровно 5 шагов. Каждый — конкретное действие которое можно сделать прямо сейчас. Начинается с глагола. Без нумерации.

### УПРАЖНЕНИЕ
Название в кавычках, с новой строки — описание 3-5 предложений. Конкретное практическое задание под эту цель.

### ТОЧКА РОСТА
1-2 предложения. Куда конкретно может прийти этот специалист если сделает план. Вдохновляет, не банальное.

Объём: 300-400 слов суммарно. Никаких вводных. Начинай сразу с первого блока."""


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
    return row[0] if row else 2


def get_salon_balance(salon_id, conn) -> int:
    cur = conn.cursor()
    cur.execute(
        f"SELECT COALESCE(SUM(CASE WHEN type='credit' THEN amount ELSE -amount END), 0) "
        f"FROM {SCHEMA}.credit_transactions WHERE salon_id = %s",
        (salon_id,)
    )
    return cur.fetchone()[0]


def deduct_energy(salon_id, user_id, cost, conn):
    cur = conn.cursor()
    cur.execute(
        f"UPDATE {SCHEMA}.salons SET credits_balance = credits_balance - %s WHERE id = %s",
        (cost, salon_id)
    )
    cur.execute(
        f"INSERT INTO {SCHEMA}.credit_transactions (salon_id, user_id, action, amount, tool_key, type) "
        f"VALUES (%s, %s, %s, %s, %s, 'debit')",
        (salon_id, user_id, "Мышление специалиста", cost, TOOL_KEY)
    )
    conn.commit()


def refund_energy(salon_id, user_id, cost, conn):
    cur = conn.cursor()
    cur.execute(
        f"UPDATE {SCHEMA}.salons SET credits_balance = credits_balance + %s WHERE id = %s",
        (cost, salon_id)
    )
    cur.execute(
        f"INSERT INTO {SCHEMA}.credit_transactions (salon_id, user_id, action, amount, tool_key, type) "
        f"VALUES (%s, %s, %s, %s, %s, 'credit')",
        (salon_id, user_id, "Возврат: ИИ-сервис недоступен", cost, TOOL_KEY)
    )
    conn.commit()


def is_provider_error(e: Exception) -> bool:
    msg = str(e).lower()
    return any(x in msg for x in ("502", "503", "service_unavailable", "temporarily", "bad gateway"))


def build_prompt(data: dict) -> str:
    problem = data.get("problem_name", "")
    category = data.get("category_name", "")
    qa_pairs = data.get("qa_pairs", [])

    lines = [
        f"Категория: {category}",
        f"Цель специалиста: {problem}",
        "",
        "Ответы на вопросы (используй для персонализации):",
    ]
    for i, qa in enumerate(qa_pairs, 1):
        lines.append(f"{i}. {qa.get('question', '')}")
        lines.append(f"   → {qa.get('answer', '')}")

    return "\n".join(lines)


def call_openai(user_prompt: str, api_key: str) -> str:
    payload = json.dumps({
        "model": "openai/gpt-4o-mini",
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        "max_tokens": 900,
        "temperature": 0.8,
    }).encode("utf-8")

    req = urllib.request.Request(
        "https://polza.ai/api/v1/chat/completions",
        data=payload,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        result = json.loads(resp.read().decode("utf-8"))
        return result["choices"][0]["message"]["content"].strip()


def parse_sections(text: str) -> dict:
    sections = {}
    blocks = text.split("###")
    for block in blocks:
        block = block.strip()
        if not block:
            continue
        lines = block.split("\n", 1)
        title = lines[0].strip()
        content = lines[1].strip() if len(lines) > 1 else ""
        sections[title] = content
    return sections


def handler(event: dict, context) -> dict:
    """Персональный AI-анализ для инструмента Мышление специалиста. Списывает энергию cheat_sheet."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    if event.get("httpMethod") != "POST":
        return err("Method not allowed", 405)

    salon_id = None
    cost = 0
    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)

        salon_id = user.get("salon_id")
        if not salon_id:
            return err("Салон не найден", 400)

        cost = get_tool_cost(conn)
        balance = get_salon_balance(salon_id, conn)
        if balance < cost:
            return err(f"Недостаточно энергии. Доступно {balance}. Пополните баланс, чтобы продолжить.", 402)

        try:
            data = json.loads(event.get("body") or "{}")
        except Exception:
            return err("Некорректный запрос", 400)

        if not data.get("problem_name") or not data.get("qa_pairs"):
            return err("Недостаточно данных", 400)

        api_key = os.environ.get("OPENAI_API_KEY", "")
        if not api_key:
            return err("API ключ не настроен", 503)

        # Списываем ДО вызова ИИ
        deduct_energy(salon_id, user["id"], cost, conn)
        conn.close()

        user_prompt = build_prompt(data)
        text = call_openai(user_prompt, api_key)
        sections = parse_sections(text)

        return ok({"sections": sections})

    except Exception as e:
        msg = str(e)
        print(f"[ai-mindset-specialist] error: {msg}")
        if salon_id and cost and is_provider_error(e):
            try:
                conn_r = get_db()
                refund_energy(salon_id, user["id"], cost, conn_r)
                conn_r.close()
            except Exception:
                pass
            return err("ИИ-сервис временно недоступен, энергия возвращена. Попробуйте через минуту.", 503)
        if "timed out" in msg.lower() or "timeout" in msg.lower():
            return err("Сервис не ответил. Попробуйте ещё раз.", 504)
        return err(f"Ошибка: {msg}", 502)
    finally:
        try:
            conn.close()
        except Exception:
            pass