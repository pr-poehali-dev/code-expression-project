"""
Цифровой бизнес-разбор салона красоты.
Принимает заполненную анкету, анализирует через polza.ai (GPT-4o),
возвращает структурированный отчёт в стиле бизнес-консультанта.
"""
import json
import os
import urllib.request
import urllib.error
import psycopg2
import psycopg2.extras

SCHEMA = "t_p84565078_code_expression_proj"
TOOL_KEY = "salon_audit"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}


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
    return row[0] if row else 10


def get_salon_balance(salon_id, conn) -> int:
    cur = conn.cursor()
    cur.execute(
        f"SELECT COALESCE(SUM(CASE WHEN type='credit' THEN amount ELSE -amount END), 0) "
        f"FROM {SCHEMA}.credit_transactions WHERE salon_id = %s",
        (salon_id,)
    )
    return cur.fetchone()[0]


def deduct_energy(salon_id, user_id, cost, action, conn):
    cur = conn.cursor()
    cur.execute(
        f"INSERT INTO {SCHEMA}.credit_transactions (salon_id, user_id, action, amount, tool_key, type) "
        f"VALUES (%s, %s, %s, %s, %s, 'debit')",
        (salon_id, user_id, action, cost, TOOL_KEY)
    )
    conn.commit()


def build_prompt(answers: dict, salon_name: str) -> str:
    a = answers

    def yn(v): return "Да" if v else "Нет"
    def val(k, default=""): return a.get(k) or default

    return f"""Ты — опытный бизнес-консультант по салонам красоты и спа. Проведи глубокий анализ бизнеса на основе данных анкеты.

## Данные салона

**Название:** {salon_name or val("salon_name", "не указано")}
**Город:** {val("city", "не указан")}
**Стаж работы:** {val("age_years", "не указан")} лет
**Сотрудников:** {val("staff_count")}
**Кабинетов:** {val("rooms_count")}
**Основные услуги:** {val("main_services")}

### Финансы
- Выручка в месяц: {val("monthly_revenue")} руб.
- Чистая прибыль: {val("monthly_profit")} руб.
- Средний чек: {val("avg_check")} руб.
- Клиентов в месяц: {val("clients_per_month")}

### Клиенты
- Новых клиентов: {val("new_clients_pct")}%
- Постоянных: {val("returning_clients_pct")}%
- Программа лояльности: {yn(val("has_loyalty"))}
- Повторная запись: {yn(val("has_rebooking"))}
- База клиентов: {yn(val("has_client_base"))}

### Маркетинг
- Каналы рекламы: {val("ad_channels")}
- Соцсети: {yn(val("has_social"))}
- Регулярный контент: {yn(val("has_content"))}
- Акции: {yn(val("has_promo"))}
- Партнёрские программы: {yn(val("has_partners"))}

### Персонал
- Стандарты общения: {yn(val("has_standards"))}
- Обучение: {yn(val("has_training"))}
- Система мотивации: {yn(val("has_motivation"))}
- Контроль качества: {yn(val("has_quality_control"))}

### Продажи
- Допродажи: {yn(val("has_upsell"))}
- Комплексные программы: {yn(val("has_packages"))}
- Домашний уход: {yn(val("sells_homecare"))}
- Скрипты продаж: {yn(val("has_scripts"))}

---

Сформируй анализ строго в следующем JSON-формате. Никакого текста вне JSON:

{{
  "consultant_summary": "2-3 абзаца в стиле личной консультации владельца. Говори конкретно, называй цифры потерь и потенциала. Стиль: профессиональный, прямой, без воды.",
  "scores": {{
    "clients": <число 1-10>,
    "marketing": <число 1-10>,
    "sales": <число 1-10>,
    "staff": <число 1-10>,
    "management": <число 1-10>
  }},
  "score_total": <взвешенная сумма 0-100>,
  "sections": {{
    "clients": {{
      "score": <1-10>,
      "strengths": ["..."],
      "weaknesses": ["..."],
      "risks": ["..."]
    }},
    "marketing": {{
      "score": <1-10>,
      "strengths": ["..."],
      "weaknesses": ["..."],
      "risks": ["..."]
    }},
    "sales": {{
      "score": <1-10>,
      "strengths": ["..."],
      "weaknesses": ["..."],
      "risks": ["..."]
    }},
    "staff": {{
      "score": <1-10>,
      "strengths": ["..."],
      "weaknesses": ["..."],
      "risks": ["..."]
    }},
    "management": {{
      "score": <1-10>,
      "strengths": ["..."],
      "weaknesses": ["..."],
      "risks": ["..."]
    }}
  }},
  "main_problems": ["проблема 1", "проблема 2", "проблема 3", "проблема 4"],
  "growth_points": ["точка роста 1", "точка роста 2", "точка роста 3"],
  "revenue_potential": "Конкретная оценка: на сколько % можно вырасти и за счёт чего",
  "plan": {{
    "week_1": ["действие 1", "действие 2", "действие 3"],
    "month_1": ["шаг 1", "шаг 2", "шаг 3", "шаг 4"],
    "month_3": ["стратегия 1", "стратегия 2", "стратегия 3"]
  }},
  "recommended_products": [
    {{"problem": "название проблемы", "course": "название курса", "description": "1 предложение зачем"}}
  ]
}}"""


def call_ai(prompt: str) -> dict:
    api_key = os.environ.get("POLZA_AI_API_KEY", "")
    if not api_key:
        raise ValueError("POLZA_AI_API_KEY не задан")

    payload = json.dumps({
        "model": "openai/gpt-4.1",
        "messages": [
            {"role": "system", "content": "Ты бизнес-консультант по салонам красоты. Отвечай только валидным JSON без markdown-блоков."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.7,
        "max_tokens": 4000,
    }).encode("utf-8")

    req = urllib.request.Request(
        "https://polza.ai/api/v1/chat/completions",
        data=payload,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=90) as resp:
        data = json.loads(resp.read().decode("utf-8"))

    content = data["choices"][0]["message"]["content"].strip()
    if content.startswith("```"):
        content = content.split("```")[1]
        if content.startswith("json"):
            content = content[4:]
    return json.loads(content)


def handler(event: dict, context) -> dict:
    """Цифровой бизнес-разбор салона — анализ анкеты через ИИ."""
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

        # Проверяем баланс до запуска ИИ
        cost = get_tool_cost(conn)
        balance = get_salon_balance(salon_id, conn)
        if balance < cost:
            return err(f"Недостаточно энергии. Нужно {cost}, доступно {balance}.", 402)

        body = json.loads(event.get("body") or "{}")
        answers = body.get("answers", {})
        if not answers:
            return err("Анкета не заполнена")

        salon_name = ""
        if salon_id:
            cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            cur.execute(f"SELECT name FROM {SCHEMA}.salons WHERE id=%s", (salon_id,))
            row = cur.fetchone()
            if row:
                salon_name = row["name"]

        conn.close()

        prompt = build_prompt(answers, salon_name)
        result = call_ai(prompt)

        # Списываем энергию после успешного ответа ИИ
        conn2 = get_db()
        try:
            deduct_energy(salon_id, user["id"], cost, "Анализ салона", conn2)
        finally:
            conn2.close()

        return ok({"result": result})

    except json.JSONDecodeError as e:
        return err(f"ИИ вернул некорректный ответ. Попробуйте ещё раз. ({e})", 502)
    except Exception as e:
        msg = str(e)
        print(f"[ai-salon-audit] error: {msg}")
        if "timed out" in msg.lower() or "timeout" in msg.lower():
            return err("Анализ занял слишком много времени. Попробуйте ещё раз.", 504)
        return err(f"Ошибка анализа: {msg}", 502)
    finally:
        try:
            conn.close()
        except Exception:
            pass
