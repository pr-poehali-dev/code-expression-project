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


TOOL_KEY_MKT = "mkt_direct"


def deduct_energy(salon_id, user_id, conn) -> tuple[bool, int]:
    cur = conn.cursor()
    cur.execute(f"SELECT energy_cost FROM {SCHEMA}.tool_costs WHERE tool_key=%s", (TOOL_KEY_MKT,))
    row = cur.fetchone()
    cost = row[0] if row else 1
    cur.execute(f"SELECT credits_balance FROM {SCHEMA}.salons WHERE id=%s FOR UPDATE", (salon_id,))
    bal = cur.fetchone()
    if not bal or int(bal[0]) < cost:
        return False, int(bal[0]) if bal else 0
    cur.execute(f"UPDATE {SCHEMA}.salons SET credits_balance=credits_balance-%s WHERE id=%s", (cost, salon_id))
    cur.execute(f"INSERT INTO {SCHEMA}.credit_transactions (salon_id,user_id,action,amount,tool_key,type) VALUES (%s,%s,%s,%s,%s,'debit')", (salon_id, user_id, "Объявления Директ", cost, TOOL_KEY_MKT))
    conn.commit()
    return True, cost


def call_ai(messages, max_tokens=1800) -> str:
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
    for g in groups[:5]:
        kws = [k["query"] for k in g.get("keywords", [])]
        groups_text += f"\nГруппа: {g['group']}\nКлючевые запросы: {', '.join(kws[:5])}\n"

    return f"""Ты — специалист по контекстной рекламе Яндекс.Директ.

Салон: «{salon_name}»{f', {city}' if city else ''}
{f'Средний чек: {avg_check}' if avg_check else ''}

{med_rule}

Группы семантики (для каждой нужно объявление):
{groups_text}

ЗАДАЧА: Для каждой группы создай:
1. 1 вариант объявления
2. Список ключевых запросов (3-5 фраз для этой группы)
3. Список минус-слов (5-8 слов, которые отсекают нецелевой трафик)

ЖЁСТКИЕ ТРЕБОВАНИЯ к символам (считай точно!):
- title1: не более 35 символов (основной заголовок)
- title2: не более 30 символов (дополнительный заголовок)
- text: не более 81 символа (текст объявления)

Правила объявлений:
- Заголовки с большой буквы, цепляющие, конкретные
- В тексте — выгода клиента, призыв к действию
- Используй цифры где уместно (скидка %, количество услуг)
- Город органично вписывай только в title1 или title2
- Без восклицательных знаков подряд
- Русский язык

Правила минус-слов:
- Включай слова, которые ищут люди с другими намерениями (бесплатно, видео, книга, курс, обучение, своими руками, реферат, wikipedia и т.п.)
- Добавляй конкурирующие тематики, которые не относятся к услуге
- Форматируй минус-слова через запятую, без минуса перед словом

Верни ТОЛЬКО валидный JSON без markdown:
[
  {{
    "group": "название группы",
    "service_tag": "тег из семантики",
    "keywords": ["запрос 1", "запрос 2", "запрос 3"],
    "minus_words": ["бесплатно", "видео", "обучение"],
    "ads": [
      {{
        "title1": "до 35 симв",
        "title2": "до 30 симв",
        "text": "до 81 символа текст объявления",
        "url_path": "kratkiy-slug"
      }}
    ]
  }}
]"""


def handler(event: dict, context) -> dict:
    """Генерирует объявления для Яндекс.Директ по группам семантического ядра. Стоимость: 1 энергия."""
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

        ok_deduct, val = deduct_energy(salon_id, user["id"], conn)
        if not ok_deduct:
            return err(f"Недостаточно энергии. Доступно {val}. Пополните баланс, чтобы продолжить.", 402)
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