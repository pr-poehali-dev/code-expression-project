"""
Генерирует 3 портрета целевой аудитории для салона красоты на основе его профиля и услуг.
POST / — возвращает список портретов ЦА. Бесплатно.
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
        f"SELECT name, city, description, avg_check, target_audience, tone_of_voice, main_goal, has_medical_license "
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


def call_ai(messages, max_tokens=1800) -> str:
    api_key = os.environ.get("POLZA_AI_API_KEY", "")
    payload = json.dumps({
        "model": "openai/gpt-4.1-mini",
        "messages": messages,
        "temperature": 0.8,
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


MEDICAL_SERVICES = [
    "остеопатия", "массаж", "лечебный массаж", "мануальная терапия",
    "физиотерапия", "рефлексотерапия", "иглоукалывание",
]

BANNED_SOCIAL = ["instagram", "инстаграм", "facebook", "фейсбук", "meta", "мета"]


TOOL_KEY = "mkt_audience"


def package_covers_usage(conn, user_id: int, tool_key: str) -> bool:
    """Если у пользователя активен пакет развития и лимит использований этого инструмента
    в сутки (скользящее окно 24ч) не исчерпан — использование бесплатное, логируем и
    возвращаем True (энергия при этом не списывается)."""
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"""SELECT pp.daily_limit_per_tool FROM {SCHEMA}.user_packages up
            JOIN {SCHEMA}.package_plans pp ON pp.code = up.plan_code
            WHERE up.user_id=%s AND up.status='active' AND up.expires_at > NOW()
            ORDER BY up.expires_at DESC LIMIT 1""",
        (user_id,)
    )
    pkg = cur.fetchone()
    if not pkg:
        return False
    cur2 = conn.cursor()
    cur2.execute(
        f"SELECT COUNT(*) FROM {SCHEMA}.tool_usage_log WHERE user_id=%s AND tool_key=%s AND used_at > NOW() - INTERVAL '24 hours'",
        (user_id, tool_key)
    )
    used = cur2.fetchone()[0] or 0
    if used >= pkg["daily_limit_per_tool"]:
        return False
    cur2.execute(f"INSERT INTO {SCHEMA}.tool_usage_log (user_id, tool_key) VALUES (%s,%s)", (user_id, tool_key))
    conn.commit()
    return True


def deduct_energy(salon_id, user_id, conn) -> tuple[bool, int]:
    cur = conn.cursor()
    cur.execute(f"SELECT energy_cost FROM {SCHEMA}.tool_costs WHERE tool_key=%s", (TOOL_KEY,))
    row = cur.fetchone()
    cost = row[0] if row else 1
    cur.execute(f"SELECT credits_balance FROM {SCHEMA}.salons WHERE id=%s FOR UPDATE", (salon_id,))
    bal = cur.fetchone()
    if not bal or int(bal[0]) < cost:
        return False, int(bal[0]) if bal else 0
    cur.execute(f"UPDATE {SCHEMA}.salons SET credits_balance=credits_balance-%s WHERE id=%s", (cost, salon_id))
    cur.execute(f"INSERT INTO {SCHEMA}.credit_transactions (salon_id,user_id,action,amount,tool_key,type) VALUES (%s,%s,%s,%s,%s,'debit')", (salon_id, user_id, "Портрет ЦА", cost, TOOL_KEY))
    conn.commit()
    return True, cost


def has_medical_services(services) -> bool:
    for s in services:
        name_lower = s["name"].lower()
        if any(med in name_lower for med in MEDICAL_SERVICES):
            return True
    return False


def build_prompt(salon, services):
    salon_name = salon["name"]
    city = salon["city"] or "не указан"
    description = salon["description"] or ""
    avg_check = f"{int(salon['avg_check'])} руб." if salon["avg_check"] else "не указан"
    target_audience_hint = salon["target_audience"] or ""
    main_goal = salon["main_goal"] or ""
    has_license = bool(salon.get("has_medical_license"))
    med_services_present = has_medical_services(services)

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

    # Блок про медицинские услуги
    if med_services_present and has_license:
        med_note = (
            "ВАЖНО: Среди услуг есть медицинские (массаж, остеопатия и подобные). "
            "У салона есть медицинская лицензия, поэтому в каналах охвата можно указывать "
            "медицинские агрегаторы (ПроДокторов, НаПоправку, Zoon), Яндекс.Директ с медицинской тематикой, "
            "SEO по медицинским запросам. Для аудитории указывай, что её привлекает именно медицинский подход."
        )
    elif med_services_present and not has_license:
        med_note = (
            "ВАЖНО: Среди услуг есть медицинские (массаж, остеопатия и подобные), "
            "но у салона НЕТ медицинской лицензии. "
            "Поэтому: НЕ предлагай медицинские агрегаторы и медицинскую рекламу. "
            "В каналах охвата предлагай только wellness/beauty-форматы: ВКонтакте, Telegram, "
            "Яндекс.Директ по wellness-запросам (без слова «лечение»), локальные каталоги салонов. "
            "В hook и мотивациях используй формулировки «расслабление», «восстановление», «уход за телом» — "
            "без медицинских терминов."
        )
    else:
        med_note = ""

    russia_note = (
        "ОБЯЗАТЕЛЬНО: Аудитория из России. "
        "В каналах охвата НИКОГДА не упоминай Instagram, Facebook, Meta и другие заблокированные в России соцсети. "
        "Используй только: ВКонтакте, Telegram, Одноклассники, Яндекс.Директ, 2ГИС, Авито, "
        "локальные каталоги, сарафанное радио, мессенджеры."
    )

    return f"""Ты — эксперт по маркетингу салонов красоты.

Данные салона:
- Название: {salon_name}
- Город: {city}
- Средний чек: {avg_check}
- Описание: {description or 'не заполнено'}
- Основная цель: {main_goal or 'не указана'}
- Подсказка по аудитории от владельца: {target_audience_hint or 'нет'}
- Услуги:
{services_text}

{russia_note}

{med_note}

Составь ровно 3 детальных портрета целевой аудитории этого салона.
Каждый портрет — отдельный сегмент клиентов, которые реально придут именно в этот салон.

Верни ТОЛЬКО валидный JSON массив без markdown-обёртки, без пояснений, без ```json``` — только сам массив:
[
  {{
    "archetype": "короткое имя-архетип, например «Анна, 34, мама в декрете»",
    "age_range": "диапазон возраста, например «28–38 лет»",
    "occupation": "занятость / образ жизни",
    "income": "уровень дохода относительно среднего",
    "pains": ["боль 1", "боль 2", "боль 3"],
    "motivations": ["мотивация 1", "мотивация 2"],
    "services_interest": ["услуга 1", "услуга 2"],
    "channels": ["канал охвата 1", "канал охвата 2", "канал охвата 3"],
    "hook": "ключевое послание, которое зацепит именно её — 1 предложение"
  }},
  ...
]"""


def handler(event: dict, context) -> dict:
    """Генерирует 3 портрета целевой аудитории на основе профиля салона. Стоимость: 1 энергия."""
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

        if not package_covers_usage(conn, user["id"], TOOL_KEY):
            ok_deduct, val = deduct_energy(salon_id, user["id"], conn)
            if not ok_deduct:
                return err(f"Недостаточно энергии. Доступно {val}. Пополните баланс, чтобы продолжить.", 402)
    finally:
        conn.close()

    prompt = build_prompt(salon, services)
    raw = call_ai([
        {"role": "system", "content": "Ты маркетолог-эксперт. Всегда отвечаешь строго валидным JSON без лишнего текста."},
        {"role": "user", "content": prompt},
    ])

    # Убираем возможную markdown-обёртку
    clean = raw.strip()
    if clean.startswith("```"):
        clean = clean.split("```")[1]
        if clean.startswith("json"):
            clean = clean[4:]
        clean = clean.strip()

    portraits = json.loads(clean)
    return ok({"portraits": portraits, "salon_name": salon["name"]})