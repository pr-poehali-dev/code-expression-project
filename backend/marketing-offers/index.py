"""
Генерирует офферы (предложения) для каждого сегмента ЦА салона.
POST / — принимает список портретов ЦА, возвращает офферы. Бесплатно.
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
        f"SELECT name, city, description, avg_check, tone_of_voice, has_medical_license "
        f"FROM {SCHEMA}.salons WHERE id = %s", (salon_id,)
    )
    salon = cur.fetchone()
    if not salon:
        return None, []
    cur.execute(
        f"SELECT name, price_min, price_max FROM {SCHEMA}.salon_services "
        f"WHERE salon_id = %s ORDER BY sort_order LIMIT 20", (salon_id,)
    )
    services = cur.fetchall()
    return salon, services


def call_ai(messages, max_tokens=2400) -> str:
    api_key = os.environ.get("POLZA_AI_API_KEY", "")
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


def build_prompt(salon, services, portraits):
    salon_name = salon["name"]
    avg_check = f"{int(salon['avg_check'])} руб." if salon["avg_check"] else "не указан"
    tone = salon["tone_of_voice"] or "тёплый, профессиональный"
    has_license = bool(salon.get("has_medical_license"))

    services_text = ""
    if services:
        lines = []
        for s in services:
            price = ""
            if s["price_min"] and s["price_max"]:
                price = f" ({int(s['price_min'])}–{int(s['price_max'])} руб.)"
            elif s["price_min"]:
                price = f" (от {int(s['price_min'])} руб.)"
            lines.append(f"- {s['name']}{price}")
        services_text = "\n".join(lines)
    else:
        services_text = "услуги не указаны"

    med_note = ""
    if has_license:
        med_note = "У салона есть медицинская лицензия — можно использовать медицинские формулировки в офферах."
    else:
        med_note = "У салона нет медицинской лицензии — в офферах используй только wellness-формулировки (расслабление, уход, восстановление), без слова «лечение»."

    # Сериализуем портреты для промта
    portraits_text = ""
    for i, p in enumerate(portraits, 1):
        portraits_text += f"\nСегмент {i}: {p.get('archetype', '')}\n"
        portraits_text += f"  Возраст: {p.get('age_range', '')}, {p.get('occupation', '')}\n"
        portraits_text += f"  Боли: {', '.join(p.get('pains', []))}\n"
        portraits_text += f"  Мотивации: {', '.join(p.get('motivations', []))}\n"
        portraits_text += f"  Услуги интереса: {', '.join(p.get('services_interest', []))}\n"
        portraits_text += f"  Ключевое послание: {p.get('hook', '')}\n"

    return f"""Ты — эксперт по маркетингу и копирайтингу для салонов красоты.

Салон: «{salon_name}»
Средний чек: {avg_check}
Тон коммуникации: {tone}
{med_note}

Услуги салона:
{services_text}

Портреты целевой аудитории:
{portraits_text}

Для каждого сегмента ЦА создай 3 оффера разного типа:
1. «Первый визит» — предложение для привлечения новых клиентов
2. «Акция/Спецпредложение» — ограниченное по времени или условию предложение
3. «Пакет/Комплекс» — объединение услуг в выгодный пакет

Требования к офферам:
- Конкретные цифры (скидка %, бонус, подарок) — не «выгодно», а «-20%»
- Под боль и мотивацию именно этого сегмента
- Тон: {tone}
- Длина заголовка: 5-8 слов. Длина описания: 1-2 предложения.
- НИКАКИХ медицинских обещаний без лицензии

Верни ТОЛЬКО валидный JSON массив без markdown-обёртки:
[
  {{
    "segment_index": 0,
    "archetype": "название сегмента",
    "offers": [
      {{
        "type": "first_visit",
        "type_label": "Первый визит",
        "title": "заголовок оффера",
        "description": "описание 1-2 предложения",
        "cta": "текст кнопки призыва к действию (3-5 слов)",
        "mechanics": "механика акции одной строкой (например: скидка 20% на первый визит)"
      }},
      {{
        "type": "promo",
        "type_label": "Акция",
        "title": "...",
        "description": "...",
        "cta": "...",
        "mechanics": "..."
      }},
      {{
        "type": "package",
        "type_label": "Пакет",
        "title": "...",
        "description": "...",
        "cta": "...",
        "mechanics": "..."
      }}
    ]
  }},
  ...
]"""


def handler(event: dict, context) -> dict:
    """Генерирует офферы для каждого сегмента ЦА салона. Бесплатно."""
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
        portraits = body.get("portraits")
        if not portraits or not isinstance(portraits, list):
            return err("Передайте список портретов ЦА (portraits)")

        salon, services = get_salon_data(salon_id, conn)
        if not salon:
            return err("Салон не найден", 404)
    finally:
        conn.close()

    prompt = build_prompt(salon, services, portraits)
    raw = call_ai([
        {"role": "system", "content": "Ты копирайтер-маркетолог. Отвечаешь строго валидным JSON без лишнего текста."},
        {"role": "user", "content": prompt},
    ])

    clean = raw.strip()
    if clean.startswith("```"):
        clean = clean.split("```")[1]
        if clean.startswith("json"):
            clean = clean[4:]
        clean = clean.strip()

    offers = json.loads(clean)
    return ok({"offers": offers, "salon_name": salon["name"]})
