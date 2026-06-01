"""
AI-рекомендации для инструмента «Системная диагностика клиента».
Принимает зону тела и жалобу, возвращает персональные рекомендации по диагностике,
психосоматике и техникам работы. Списывает энергию по тарифу diagnostic.
"""
import os
import json
import urllib.request
import psycopg2
import psycopg2.extras

SCHEMA = "t_p84565078_code_expression_proj"
TOOL_KEY = "diagnostic"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}

SYSTEM_PROMPT = """Ты — эксперт по телесно-ориентированной работе, остеопатии и психосоматике.
Твоя задача — дать специалисту конкретные персональные рекомендации по работе с конкретным клиентом.

Контекст: специалист работает с телом (массажист, остеопат, мануальный терапевт). Клиент — платёжеспособный, ценит профессионализм и системный подход.
Тебе передаётся максимум информации о случае: зона тела, жалоба, возможные причины, компенсаторные зоны, что проверить визуально и руками, эмоциональные факторы, красные флаги.
Используй ВСЮ эту информацию — твой ответ должен быть уникальным для каждой комбинации зоны и жалобы.

Критически важно: ответ на жалобу «тревога» в зоне «Голова» должен ПОЛНОСТЬЮ отличаться от ответа на жалобу «боль в шее» в зоне «Шея». Всегда отталкивайся от конкретной зоны и жалобы, не давай универсальных шаблонных советов.

Важно: не описывай конкретные видео-техники с названиями — специалист добавит их сам. Описывай принципы, механизмы, анатомические акценты и логику работы.

Стиль: профессиональный, конкретный, как разговор с опытным коллегой. Без воды. Обращайся на «ты».

Структура ответа — строго 4 блока, каждый начинается с ###:

### КАК ПРОВОДИТЬ ДИАГНОСТИКУ
4-6 конкретных шагов специфичных для данной зоны и жалобы: что смотреть, в какой последовательности, какие структуры пальпировать, на что обращать внимание. Упоминай конкретные анатомические структуры (мышцы, связки, суставы) характерные именно для этой зоны.

### ПСИХОСОМАТИКА
3 абзаца. Первый — какие эмоциональные и психологические паттерны специфически связаны именно с этой зоной тела. Второй — как конкретная жалоба клиента соотносится с этими паттернами, что стоит за симптомом. Третий — как это практически влияет на тело и что это означает для работы специалиста.

### ЛОГИКА РАБОТЫ
4-5 пунктов. Конкретная последовательность подхода к работе с учётом зоны, жалобы и компенсаторных паттернов. Что делать первым, что вторым, на что обратить особое внимание. Не техники — принципы, анатомические акценты, последовательность.

### ЧТО ОБЪЯСНИТЬ КЛИЕНТУ
2-3 предложения, написанные как прямая речь специалиста к клиенту. Объяснение должно быть простым, конкретным и формировать у клиента понимание ценности продолжения работы.

Объём: 450-550 слов суммарно. Никаких вводных фраз. Начинай сразу с первого блока."""


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
    return row[0] if row else 3


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
        (salon_id, user_id, "Диагностический помощник", cost, TOOL_KEY)
    )
    conn.commit()


def build_prompt(data: dict) -> str:
    zone_name = data.get("zone_name", "")
    symptom = data.get("symptom", "")
    possible_causes = data.get("possible_causes", "")
    compensation_zones = data.get("compensation_zones", "")
    check_visual = data.get("check_visual", "")
    check_tactile = data.get("check_tactile", "")
    emotional_factors = data.get("emotional_factors", "")
    red_flags = data.get("red_flags", "")
    recommendations = data.get("recommendations", "")

    lines = [
        f"=== ДАННЫЕ О КЛИЕНТЕ ===",
        f"Зона тела: {zone_name}",
        f"Жалоба клиента: {symptom}" if symptom else "",
        "",
        f"=== СИСТЕМНАЯ ИНФОРМАЦИЯ (используй при ответе) ===",
        f"Возможные причины: {possible_causes}" if possible_causes else "",
        f"Компенсаторные зоны: {compensation_zones}" if compensation_zones else "",
        f"Что проверить визуально: {check_visual}" if check_visual else "",
        f"Что проверить руками (пальпация): {check_tactile}" if check_tactile else "",
        f"Эмоциональные и психосоматические факторы: {emotional_factors}" if emotional_factors else "",
        f"Красные флаги: {red_flags}" if red_flags else "",
        f"Базовые рекомендации по работе: {recommendations}" if recommendations else "",
        "",
        f"=== ЗАДАЧА ===",
        f"Дай персональные рекомендации специалисту для работы с клиентом у которого жалоба «{symptom}» в зоне «{zone_name}». Ответ должен быть уникальным именно для этой комбинации.",
    ]
    return "\n".join(l for l in lines if l is not None)


def call_openai(user_prompt: str, api_key: str) -> str:
    payload = json.dumps({
        "model": "openai/gpt-4o-mini",
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        "max_tokens": 1200,
        "temperature": 0.75,
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
    """AI-рекомендации для системной диагностики клиента. Списывает энергию diagnostic."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    if event.get("httpMethod") != "POST":
        return err("Method not allowed", 405)

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
            return err(f"Недостаточно энергии. Нужно {cost}, доступно {balance}.", 402)

        try:
            data = json.loads(event.get("body") or "{}")
        except Exception:
            return err("Некорректный запрос", 400)

        if not data.get("zone_name"):
            return err("Не указана зона тела", 400)

        api_key = os.environ.get("OPENAI_API_KEY", "")
        if not api_key:
            return err("API ключ не настроен", 503)

        conn.close()

        user_prompt = build_prompt(data)
        text = call_openai(user_prompt, api_key)
        sections = parse_sections(text)

        # Списываем после успешного ответа
        conn2 = get_db()
        try:
            deduct_energy(salon_id, user["id"], cost, conn2)
        finally:
            conn2.close()

        return ok({"sections": sections})

    except Exception as e:
        msg = str(e)
        print(f"[ai-diagnostic] error: {msg}")
        if "timed out" in msg.lower() or "timeout" in msg.lower():
            return err("Сервис не ответил. Попробуйте ещё раз.", 504)
        return err(f"Ошибка: {msg}", 502)
    finally:
        try:
            conn.close()
        except Exception:
            pass