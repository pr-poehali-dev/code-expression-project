import os
import json
import urllib.request
import psycopg2
import psycopg2.extras

SCHEMA = "t_p84565078_code_expression_proj"


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def get_user_id(session_id: str, conn) -> int | None:
    cur = conn.cursor()
    cur.execute(
        f"SELECT user_id FROM {SCHEMA}.lk_sessions WHERE id = %s AND expires_at > NOW()",
        (session_id,)
    )
    row = cur.fetchone()
    return row[0] if row else None


def get_cached_ai(user_id: int, conn) -> dict | None:
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT ai_result FROM {SCHEMA}.lk_profile_results WHERE user_id = %s ORDER BY completed_at DESC LIMIT 1",
        (user_id,)
    )
    row = cur.fetchone()
    if row and row["ai_result"]:
        return row["ai_result"]
    return None


def save_ai_result(user_id: int, result: dict, conn):
    conn.cursor().execute(
        f"UPDATE {SCHEMA}.lk_profile_results SET ai_result = %s WHERE user_id = %s AND id = ("
        f"SELECT id FROM {SCHEMA}.lk_profile_results WHERE user_id = %s ORDER BY completed_at DESC LIMIT 1)",
        (json.dumps(result, ensure_ascii=False), user_id, user_id)
    )
    conn.commit()

SYSTEM_PROMPT = """Ты — финансовый ментор для мастеров бьюти-индустрии. Твоя задача — дать персональный разбор финансового профиля мастера: как он думает о деньгах, что мешает зарабатывать больше и что делать прямо сейчас.

Стиль: прямой, без воды. Говори «ты». Будь конкретным — не «работай над собой», а «сделай вот это». Называй реальные цифры если они есть в данных.

Структура ответа — строго 4 блока через разделитель "###":

### ЧТО Я ВИЖУ
2-3 предложения: честная картина финансового мышления. Что работает хорошо, что тянет вниз. Упомяни доминирующий тип и его влияние на доход.

### ГЛАВНЫЙ ФИНАНСОВЫЙ БЛОК
1-2 предложения: один конкретный психологический или поведенческий паттерн, который сейчас больше всего ограничивает финансовый рост. Точно и без обиняков.

### 3 ШАГА НА ЭТОЙ НЕДЕЛЕ
Три конкретных действия, каждое начинается с глагола (Запиши / Откажись / Установи / Посчитай / Скажи / Сделай). Привязаны к слабым индексам. Без абстракций — только то, что можно сделать за 7 дней.

### ТВОЙ СЛЕДУЮЩИЙ УРОВЕНЬ
1 предложение: конкретный финансовый или профессиональный результат, который станет достижимым после проработки главного блока. Пиши про деньги, клиентов или конкретный сдвиг — не про «развитие» в целом.

Объём: 250-320 слов суммарно. Начинай сразу с блока — никаких вводных."""


def build_user_prompt(data: dict) -> str:
    norm = data.get("norm", {})
    ifl = data.get("ifl", 0)
    ifu = data.get("ifu", 0)
    type_title = data.get("type_title", "")
    type_subtitle = data.get("type_subtitle", "")
    weak_zones = data.get("weak_zones", [])

    def lvl(val, inverted=False):
        if inverted:
            return "критично" if val >= 65 else "умеренно" if val >= 40 else "норма"
        return "сильный" if val >= 70 else "средний" if val >= 45 else "слабый"

    lines = [
        f"Финансовый тип мастера: «{type_title}» — {type_subtitle}",
        f"Главный индекс финансового уровня (IFL): {ifl}/100",
        f"Индекс финансовой устойчивости (IFU): {ifu}/100",
        "",
        "Детальные показатели (0-100%):",
        f"• Финансовая зрелость (IFZ): {norm.get('IFZ', 0)} — {lvl(norm.get('IFZ', 0))}",
        f"• Финансовая дисциплина (IFD): {norm.get('IFD', 0)} — {lvl(norm.get('IFD', 0))}",
        f"• Денежная самооценка (IDS): {norm.get('IDS', 0)} — {lvl(norm.get('IDS', 0))}",
        f"• Денежная реализация (IDR): {norm.get('IDR', 0)} — {lvl(norm.get('IDR', 0))}",
        f"• Накопления (IN): {norm.get('IN', 0)} — {lvl(norm.get('IN', 0))}",
        f"• Денежная тревожность (IDT): {norm.get('IDT', 0)} — {lvl(norm.get('IDT', 0), inverted=True)} (высокое = проблема)",
        f"• Дефицитное мышление (IDM): {norm.get('IDM', 0)} — {lvl(norm.get('IDM', 0), inverted=True)} (высокое = проблема)",
        f"• Импульсивные траты (IIT): {norm.get('IIT', 0)} — {lvl(norm.get('IIT', 0), inverted=True)} (высокое = проблема)",
    ]

    if weak_zones:
        lines.append("")
        lines.append("Слабые зоны: " + ", ".join(weak_zones))

    return "\n".join(lines)


def call_openai(user_prompt: str, api_key: str) -> str:
    opener = urllib.request.build_opener()

    payload = json.dumps({
        "model": "openai/gpt-4o-mini",
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        "max_tokens": 700,
        "temperature": 0.75,
    }).encode("utf-8")

    req = urllib.request.Request(
        "https://polza.ai/api/v1/chat/completions",
        data=payload,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    with opener.open(req, timeout=25) as resp:
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
    """AI-анализ результатов теста 'Финансовый профиль PRO'. polza.ai. Кэш в БД."""
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-User-Id, X-Auth-Token, X-Session-Id",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    try:
        data = json.loads(event.get("body") or "{}")
    except Exception:
        return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "invalid json"})}

    session_id = (event.get("headers") or {}).get("X-Session-Id", "")

    if session_id:
        conn = get_db()
        try:
            user_id = get_user_id(session_id, conn)
            if user_id:
                cached = get_cached_ai(user_id, conn)
                if cached:
                    return {"statusCode": 200, "headers": cors, "body": json.dumps(cached, ensure_ascii=False)}
        finally:
            conn.close()

    api_key = os.environ.get("OPENAI_API_KEY", "")
    if not api_key:
        return {"statusCode": 503, "headers": cors, "body": json.dumps({"error": "no api key"})}

    user_prompt = build_user_prompt(data)
    text = call_openai(user_prompt, api_key)
    sections = parse_sections(text)
    result = {"text": text, "sections": sections}

    if session_id:
        conn = get_db()
        try:
            user_id = get_user_id(session_id, conn)
            if user_id:
                save_ai_result(user_id, result, conn)
        finally:
            conn.close()

    return {
        "statusCode": 200,
        "headers": cors,
        "body": json.dumps(result, ensure_ascii=False),
    }