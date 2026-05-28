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
        f"SELECT ai_result FROM {SCHEMA}.lk_barriers_results WHERE user_id = %s ORDER BY completed_at DESC LIMIT 1",
        (user_id,)
    )
    row = cur.fetchone()
    if row and row["ai_result"]:
        return row["ai_result"]
    return None


def save_ai_result(user_id: int, result: dict, conn):
    conn.cursor().execute(
        f"UPDATE {SCHEMA}.lk_barriers_results SET ai_result = %s WHERE user_id = %s AND id = ("
        f"SELECT id FROM {SCHEMA}.lk_barriers_results WHERE user_id = %s ORDER BY completed_at DESC LIMIT 1)",
        (json.dumps(result, ensure_ascii=False), user_id, user_id)
    )
    conn.commit()

SYSTEM_PROMPT = """Ты — эксперт по психологии в бьюти-бизнесе. Твоя задача — дать мастеру красоты персональный разбор его внутренних барьеров, которые мешают зарабатывать больше.

Стиль: прямой, конкретный, как разговор с личным ментором. Без воды, без общих фраз. Говори «ты». Называй вещи своими именами — не деликатничай, но и не осуждай.

Структура ответа — строго 4 блока через разделитель "###":

### ЧТО Я ВИЖУ
2-3 предложения: честная картина текущего состояния. Какие барьеры доминируют, как они влияют на доход прямо сейчас. Без лести.

### КОРЕНЬ ПРОБЛЕМЫ
1-2 предложения: один главный внутренний механизм, который запускает остальные барьеры. Конкретно и психологически точно.

### 3 ПРАКТИЧЕСКИХ ШАГА
Три конкретных действия на эту неделю. Каждый шаг начинается с глагола-действия (Сделай / Напиши / Скажи / Откажись / Установи). Привязаны к конкретным слабым показателям. Без абстракций.

### К ЧЕМУ ЭТО ПРИВЕДЁТ
1 предложение: конкретный финансовый или профессиональный результат, если проработать корень проблемы. Без банальщины типа «ты станешь лучше».

Объём: 250-320 слов суммарно. Начинай сразу с блока — никаких вводных фраз."""


def build_user_prompt(data: dict) -> str:
    idx = data.get("idx", {})
    iib = data.get("iib", 0)
    type_title = data.get("type_title", "")

    lines = [
        f"Тип внутренних барьеров мастера: «{type_title}»",
        f"Общий индекс внутренних барьеров (IIB): {iib}/100 — чем выше, тем сильнее барьеры",
        "",
        "Детальные показатели (0-100, высокое значение = сильный барьер):",
        f"• Синдром самозванца (ISS): {idx.get('ISS', 0)} — {'критично' if idx.get('ISS', 0) > 65 else 'умеренно' if idx.get('ISS', 0) > 40 else 'слабо'}",
        f"• Страх денег и продаж (ISD): {idx.get('ISD', 0)} — {'критично' if idx.get('ISD', 0) > 65 else 'умеренно' if idx.get('ISD', 0) > 40 else 'слабо'}",
        f"• Страх проявленности (ISP): {idx.get('ISP', 0)} — {'критично' if idx.get('ISP', 0) > 65 else 'умеренно' if idx.get('ISP', 0) > 40 else 'слабо'}",
        f"• Зависимость от оценки (IDO): {idx.get('IDO', 0)} — {'критично' if idx.get('IDO', 0) > 65 else 'умеренно' if idx.get('IDO', 0) > 40 else 'слабо'}",
        f"• Избегание роста (IIR): {idx.get('IIR', 0)} — {'критично' if idx.get('IIR', 0) > 65 else 'умеренно' if idx.get('IIR', 0) > 40 else 'слабо'}",
        f"• Эмоциональное истощение (IEI): {idx.get('IEI', 0)} — {'критично' if idx.get('IEI', 0) > 65 else 'умеренно' if idx.get('IEI', 0) > 40 else 'слабо'}",
        f"• Внутренняя опора (IVO): {idx.get('IVO', 0)} — {'сильная' if idx.get('IVO', 0) > 65 else 'средняя' if idx.get('IVO', 0) > 40 else 'слабая'} (высокое — хорошо)",
    ]

    critical = []
    for key, label in [("ISS", "синдром самозванца"), ("ISD", "страх денег"), ("ISP", "страх проявленности"),
                       ("IDO", "зависимость от оценки"), ("IIR", "избегание роста"), ("IEI", "выгорание")]:
        if idx.get(key, 0) > 60:
            critical.append(label)

    if idx.get("IVO", 100) < 40:
        critical.append("слабая внутренняя опора")

    if critical:
        lines.append("")
        lines.append("Критические зоны: " + ", ".join(critical))

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
    """AI-анализ результатов теста 'Внутренние барьеры'. polza.ai. Кэш в БД."""
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