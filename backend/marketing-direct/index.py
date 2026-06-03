"""
Генерирует объявления для Яндекс.Директ: заголовок ≤56 символов, текст ≤81 символ.
POST / — принимает группы семантики, возвращает объявления. Бесплатно.
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

BANNED_WITHOUT_LICENSE = [
    "остеопатия", "остеопат", "мануальная терапия", "мануальный терапевт",
    "рефлексотерапия", "иглоукалывание", "физиотерапия",
    "лечебный", "лечение", "лечить", "медицинский",
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
        f"SELECT name, city, avg_check, tone_of_voice, has_medical_license "
        f"FROM {SCHEMA}.salons WHERE id = %s", (salon_id,)
    )
    return cur.fetchone()


def call_ai(messages, max_tokens=3000) -> str:
    api_key = os.environ.get("POLZA_AI_API_KEY", "")
    payload = json.dumps({
        "model": "openai/gpt-4.1-mini",
        "messages": messages,
        "temperature": 0.75,
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


def build_prompt(salon, groups, has_license):
    salon_name = salon["name"]
    city = salon["city"] or ""
    avg_check = f"{int(salon['avg_check'])} руб." if salon.get("avg_check") else ""

    if not has_license:
        banned = ", ".join(f"«{w}»" for w in BANNED_WITHOUT_LICENSE)
        med_rule = (
            f"СТРОГО ЗАПРЕЩЕНО использовать слова: {banned}. "
            f"Вместо них: «коррекция осанки», «работа с телом», «оздоровительные процедуры»."
        )
    else:
        med_rule = "Можно использовать медицинские термины — есть лицензия."

    groups_text = ""
    for g in groups:
        kws = [k["query"] for k in g.get("keywords", [])]
        groups_text += f"\nГруппа: {g['group']}\nКлючевые запросы: {', '.join(kws[:5])}\n"

    return f"""Ты — специалист по контекстной рекламе Яндекс.Директ.

Салон: «{salon_name}»{f', {city}' if city else ''}
{f'Средний чек: {avg_check}' if avg_check else ''}

{med_rule}

Группы семантики (для каждой нужно объявление):
{groups_text}

ЗАДАЧА: Для каждой группы создай 2 варианта объявления.

ЖЁСТКИЕ ТРЕБОВАНИЯ к символам (считай точно!):
- title1: не более 35 символов (основной заголовок)
- title2: не более 30 символов (дополнительный заголовок)
- text: не более 81 символа (текст объявления)

Правила:
- Заголовки с большой буквы, цепляющие, конкретные
- В тексте — выгода клиента, призыв к действию
- Используй цифры где уместно (скидка %, количество услуг)
- Город органично вписывай только в title1 или title2
- Без восклицательных знаков подряд
- Русский язык

Верни ТОЛЬКО валидный JSON без markdown:
[
  {{
    "group": "название группы",
    "service_tag": "тег из семантики",
    "ads": [
      {{
        "title1": "до 35 симв",
        "title1_len": 25,
        "title2": "до 30 симв",
        "title2_len": 18,
        "text": "до 81 символа текст объявления",
        "text_len": 55,
        "url_path": "kratkiy-slug-dlya-url"
      }},
      {{
        "title1": "...",
        "title1_len": 0,
        "title2": "...",
        "title2_len": 0,
        "text": "...",
        "text_len": 0,
        "url_path": "..."
      }}
    ]
  }},
  ...
]"""


def handler(event: dict, context) -> dict:
    """Генерирует объявления для Яндекс.Директ по группам семантического ядра. Бесплатно."""
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

        body = json.loads(event.get("body") or "{}")
        groups = body.get("groups")
        if not groups or not isinstance(groups, list):
            return err("Передайте список групп семантики (groups)")

        salon = get_salon_data(salon_id, conn)
        if not salon:
            return err("Салон не найден", 404)
        has_license = bool(salon.get("has_medical_license"))
    finally:
        conn.close()

    prompt = build_prompt(salon, groups, has_license)
    raw = call_ai([
        {"role": "system", "content": "Ты специалист Яндекс.Директ. Строго соблюдаешь лимиты символов. Отвечаешь только валидным JSON."},
        {"role": "user", "content": prompt},
    ])

    clean = raw.strip()
    if clean.startswith("```"):
        clean = clean.split("```")[1]
        if clean.startswith("json"):
            clean = clean[4:]
        clean = clean.strip()

    ads = json.loads(clean)
    return ok({"ads": ads, "salon_name": salon["name"]})
