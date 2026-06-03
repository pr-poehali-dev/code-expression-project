"""
Генерирует семантическое ядро для Яндекс.Директ на основе профиля салона и услуг.
POST / — возвращает сгруппированные поисковые запросы. Бесплатно.
"""
import json
import os
import urllib.request
import psycopg2
import psycopg2.extras

SCHEMA = "t_p84565078_code_expression_proj"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}

MEDICAL_KEYWORDS = [
    "остеопатия", "массаж", "лечебный массаж", "мануальная терапия",
    "физиотерапия", "рефлексотерапия", "иглоукалывание",
]


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


def get_salon_data(salon_id, conn):
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT name, city, description, avg_check, has_medical_license "
        f"FROM {SCHEMA}.salons WHERE id = %s", (salon_id,)
    )
    salon = cur.fetchone()
    if not salon:
        return None, []
    cur.execute(
        f"SELECT name FROM {SCHEMA}.salon_services "
        f"WHERE salon_id = %s ORDER BY sort_order LIMIT 20", (salon_id,)
    )
    services = cur.fetchall()
    return salon, services


def call_ai(messages, max_tokens=3000) -> str:
    api_key = os.environ.get("POLZA_AI_API_KEY", "")
    payload = json.dumps({
        "model": "openai/gpt-4.1-mini",
        "messages": messages,
        "temperature": 0.5,
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


def has_medical(services):
    for s in services:
        if any(kw in s["name"].lower() for kw in MEDICAL_KEYWORDS):
            return True
    return False


def build_prompt(salon, services):
    salon_name = salon["name"]
    city = salon["city"] or "не указан"
    has_license = bool(salon.get("has_medical_license"))
    is_medical = has_medical(services)

    services_list = [s["name"] for s in services] if services else []
    services_text = "\n".join(f"- {s}" for s in services_list) if services_list else "не указаны"

    BANNED_WITHOUT_LICENSE = [
        "остеопатия", "остеопат", "мануальная терапия", "мануальный терапевт",
        "рефлексотерапия", "иглоукалывание", "физиотерапия",
        "лечебный массаж", "лечение", "лечить", "медицинский массаж",
    ]

    if not has_license:
        banned_list = ", ".join(f"«{w}»" for w in BANNED_WITHOUT_LICENSE)
        med_note = (
            f"КРИТИЧЕСКИ ВАЖНО: У салона НЕТ медицинской лицензии. "
            f"КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО использовать в запросах слова: {banned_list}. "
            f"Если в услугах есть остеопатия или мануальная терапия — называй их только как "
            f"«коррекция осанки», «работа с телом», «телесные практики», «оздоровительные процедуры». "
            f"Все запросы только в wellness/beauty-формате. Нарушение приведёт к отклонению рекламы."
        )
    else:
        med_note = (
            "У салона есть медицинская лицензия — можно включать медицинские запросы: "
            "«лечебный массаж», «остеопатия», «мануальная терапия» и т.п."
        )

    return f"""Ты — эксперт по контекстной рекламе в Яндекс.Директ для салонов красоты и велнес.

Данные салона:
- Название: {salon_name}
- Город: {city}
- Услуги: 
{services_text}

{med_note}

ТРЕБОВАНИЯ:
- Только российские пользователи, только Яндекс
- Все запросы на русском языке
- Указывай город там, где это органично (геозависимые запросы)
- НЕ включай Instagram, Facebook и другие заблокированные соцсети

Сгенерируй семантическое ядро — поисковые запросы, разбитые на группы.

Для каждой услуги (или группы похожих услуг) создай группу с запросами трёх частотностей:
- Высокочастотные (ВЧ): общие, широкие запросы (1-2 слова + город)
- Среднечастотные (СЧ): более конкретные (2-4 слова)  
- Низкочастотные (НЧ): детальные, «длинный хвост» (4+ слов, специфичные)

Также добавь группу «Брендовые / Геолокационные» — запросы с названием или адресом.
И группу «Конкурентные намерения» — запросы, которые пишут люди, ищущие похожие услуги.

Верни ТОЛЬКО валидный JSON без markdown-обёртки:
[
  {{
    "group": "название группы (например: Массаж)",
    "service_tag": "короткий тег услуги для фильтра",
    "keywords": [
      {{
        "query": "текст поискового запроса",
        "frequency": "high",
        "frequency_label": "Высокочастотный",
        "intent": "коротко о намерении пользователя (2-4 слова)"
      }},
      ...
    ]
  }},
  ...
]

frequency может быть: "high", "medium", "low"
Генерируй 4-6 запросов на группу (1-2 ВЧ, 2 СЧ, 1-2 НЧ).
Всего должно быть 5-8 групп."""


def handler(event: dict, context) -> dict:
    """Генерирует семантическое ядро для Яндекс.Директ на основе профиля салона. Бесплатно."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)

        salon_id = user.get("salon_id")
        if not salon_id:
            return err("Сначала заполните профиль салона", 402)

        salon, services = get_salon_data(salon_id, conn)
        if not salon:
            return err("Салон не найден", 404)
    finally:
        conn.close()

    prompt = build_prompt(salon, services)
    raw = call_ai([
        {"role": "system", "content": "Ты эксперт по SEO и контекстной рекламе. Отвечаешь строго валидным JSON без лишнего текста."},
        {"role": "user", "content": prompt},
    ])

    clean = raw.strip()
    if clean.startswith("```"):
        clean = clean.split("```")[1]
        if clean.startswith("json"):
            clean = clean[4:]
        clean = clean.strip()

    groups = json.loads(clean)
    return ok({"groups": groups, "salon_name": salon["name"], "city": salon["city"] or ""})