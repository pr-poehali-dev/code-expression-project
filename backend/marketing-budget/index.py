"""
Медиапланировщик для Яндекс.Директ.
ИИ рассчитывает ДРР, сравнивает стратегии (CPC / CPA / ДРР),
даёт рекомендацию и прогноз по бюджету — без API Директа,
на основе средних показателей beauty-ниши и данных салона.
Стоимость: 1 энергия.
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
        f"SELECT name, city, description, avg_check FROM {SCHEMA}.salons WHERE id=%s", (salon_id,)
    )
    salon = cur.fetchone()
    if not salon:
        return None, []
    cur.execute(
        f"SELECT name, price_min, price_max FROM {SCHEMA}.salon_services "
        f"WHERE salon_id=%s ORDER BY sort_order LIMIT 15", (salon_id,)
    )
    services = cur.fetchall()
    return salon, services


TOOL_KEY = "mkt_budget"


def deduct_energy(salon_id, user_id, conn):
    cur = conn.cursor()
    cur.execute(f"SELECT energy_cost FROM {SCHEMA}.tool_costs WHERE tool_key=%s", (TOOL_KEY,))
    row = cur.fetchone()
    cost = row[0] if row else 1
    cur.execute(f"SELECT credits_balance FROM {SCHEMA}.salons WHERE id=%s FOR UPDATE", (salon_id,))
    bal = cur.fetchone()
    if not bal or int(bal[0]) < cost:
        return False, int(bal[0]) if bal else 0
    cur.execute(f"UPDATE {SCHEMA}.salons SET credits_balance=credits_balance-%s WHERE id=%s", (cost, salon_id))
    cur.execute(
        f"INSERT INTO {SCHEMA}.credit_transactions (salon_id,user_id,action,amount,tool_key,type) "
        f"VALUES (%s,%s,%s,%s,%s,'debit')",
        (salon_id, user_id, "Медиаплан Директ", cost, TOOL_KEY)
    )
    conn.commit()
    return True, cost


def call_ai(messages, max_tokens=3000) -> str:
    api_key = os.environ.get("POLZA_AI_API_KEY", "")
    payload = json.dumps({
        "model": "openai/gpt-4.1-mini",
        "messages": messages,
        "temperature": 0.3,
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


def build_prompt(salon, services, avg_check: int, target_clients: int, budget: int):
    salon_name = salon["name"]
    city = salon.get("city") or "не указан"
    services_list = [
        f"- {s['name']}" + (f" ({s['price_min']}–{s['price_max']} ₽)" if s.get('price_min') else "")
        for s in services
    ] if services else ["не указаны"]

    return f"""Ты — эксперт по контекстной рекламе для салонов красоты и велнес в России. Делаешь медиаплан для Яндекс.Директ.

Данные салона:
- Название: {salon_name}
- Город: {city}
- Средний чек: {avg_check} ₽
- Услуги:
{chr(10).join(services_list)}

Запрос клиента:
- Хочет привлечь новых клиентов: {target_clients} в месяц
- Бюджет на рекламу: {budget} ₽/мес

Отраслевые бенчмарки beauty-ниши (используй для расчётов):
- CTR в поиске: 4–8%
- Конверсия сайта в заявку: 2–5%
- Конверсия заявки в визит: 60–75%
- CPL (стоимость лида) в beauty: 300–900 ₽
- Средний CPC (цена клика) в beauty: 25–80 ₽
- Рекомендуемый ДРР для beauty: 10–20%

Задача: составь полный медиаплан в формате JSON.

Верни ТОЛЬКО валидный JSON без markdown:
{{
  "drr_analysis": {{
    "current_drr": число (бюджет/avg_check/target_clients*100, округли до 1 знака),
    "recommended_drr_min": 10,
    "recommended_drr_max": 20,
    "drr_status": "ok" | "high" | "low",
    "drr_comment": "короткий вывод про ДРР клиента (1-2 предложения)"
  }},
  "strategies": [
    {{
      "id": "cpc",
      "name": "Оплата за клик (CPC)",
      "description": "Платите за каждый переход на сайт. Подходит для старта — полный контроль расходов.",
      "pros": ["список 3 преимущества"],
      "cons": ["список 2 недостатка"],
      "recommended_for": "для кого подходит (1 предложение)",
      "forecast": {{
        "clicks": число (budget / avg_cpc, используй средний CPC 45 ₽),
        "leads": число (clicks * 0.035),
        "clients": число (leads * 0.67),
        "cpl": число (budget / leads),
        "cpa": число (budget / clients)
      }}
    }},
    {{
      "id": "cpa",
      "name": "Оплата за конверсию (CPA)",
      "description": "Платите только за целевые действия (звонок, заявка). Эффективнее, но нужна история данных.",
      "pros": ["список 3 преимущества"],
      "cons": ["список 2 недостатка"],
      "recommended_for": "для кого подходит (1 предложение)",
      "forecast": {{
        "target_cpa": число (рекомендуемая ставка за конверсию = avg_check * 0.15),
        "conversions": число (budget / target_cpa),
        "clients": число (conversions * 0.67),
        "cpl": число (target_cpa),
        "cpa": число (budget / clients)
      }}
    }},
    {{
      "id": "drr",
      "name": "Стратегия ДРР (доля рекламных расходов)",
      "description": "Яндекс автоматически управляет ставками, чтобы ДРР не превышал заданный процент. Для масштабирования.",
      "pros": ["список 3 преимущества"],
      "cons": ["список 2 недостатка"],
      "recommended_for": "для кого подходит (1 предложение)",
      "forecast": {{
        "drr_target": число (рекомендуемый ДРР % = 15),
        "revenue_needed": число (budget / drr_target * 100),
        "clients_needed": число (revenue_needed / avg_check),
        "viable": true | false (viable если clients_needed <= target_clients * 1.3)
      }}
    }}
  ],
  "recommendation": {{
    "best_strategy": "cpc" | "cpa" | "drr",
    "reason": "почему именно эта стратегия подходит данному салону (2-3 предложения)",
    "action_plan": [
      "шаг 1 (конкретное действие)",
      "шаг 2",
      "шаг 3",
      "шаг 4"
    ]
  }},
  "budget_breakdown": {{
    "minimum_recommended": число (минимальный бюджет для старта в этой нише и городе),
    "optimal": число (оптимальный бюджет для достижения target_clients),
    "breakdown": [
      {{"item": "Поиск Яндекс", "percent": 60, "amount": число}},
      {{"item": "РСЯ (сети)", "percent": 30, "amount": число}},
      {{"item": "Ретаргетинг", "percent": 10, "amount": число}}
    ],
    "tips": ["совет 1 по оптимизации бюджета", "совет 2", "совет 3"]
  }},
  "kpi": {{
    "monthly_clicks_target": число,
    "monthly_leads_target": число,
    "monthly_clients_target": {target_clients},
    "target_cpl": число (рекомендуемая максимальная стоимость лида),
    "target_cpa": число (рекомендуемая максимальная стоимость клиента),
    "payback_months": число (за сколько месяцев окупится реклама при LTV = avg_check * 6)
  }}
}}"""


def handler(event: dict, context) -> dict:
    """Медиаплан для Яндекс.Директ: ДРР, стратегии, прогноз бюджета без API. Стоимость: 1 энергия."""
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
        avg_check = int(body.get("avg_check") or 0)
        target_clients = int(body.get("target_clients") or 0)
        budget = int(body.get("budget") or 0)

        if not avg_check or not target_clients or not budget:
            return err("Заполните все поля: средний чек, цель по клиентам и бюджет")
        if avg_check < 500 or avg_check > 100000:
            return err("Средний чек должен быть от 500 до 100 000 ₽")
        if target_clients < 1 or target_clients > 500:
            return err("Цель по клиентам: от 1 до 500 в месяц")
        if budget < 5000 or budget > 5000000:
            return err("Бюджет должен быть от 5 000 до 5 000 000 ₽")

        salon, services = get_salon_data(salon_id, conn)
        if not salon:
            return err("Салон не найден", 404)

        ok_deduct, val = deduct_energy(salon_id, user["id"], conn)
        if not ok_deduct:
            return err(f"Недостаточно энергии. Доступно {val}. Пополните баланс, чтобы продолжить.", 402)
    finally:
        conn.close()

    prompt = build_prompt(salon, services, avg_check, target_clients, budget)
    raw = call_ai([
        {"role": "system", "content": "Ты эксперт по медиапланированию. Отвечаешь строго валидным JSON без лишнего текста."},
        {"role": "user", "content": prompt},
    ])

    clean = raw.strip()
    if clean.startswith("```"):
        clean = clean.split("```")[1]
        if clean.startswith("json"):
            clean = clean[4:]
        clean = clean.strip()

    result = json.loads(clean)
    result["salon_name"] = salon["name"]
    result["inputs"] = {"avg_check": avg_check, "target_clients": target_clients, "budget": budget}
    return ok(result)
