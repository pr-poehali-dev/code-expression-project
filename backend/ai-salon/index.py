import os
import json
import urllib.request
import psycopg2
import psycopg2.extras

SCHEMA = "t_p84565078_code_expression_proj"
TOOL_KEY = "salon_diag"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-User-Id, X-Auth-Token, X-Session-Id",
}


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def get_session_user(session_id: str, conn):
    if not session_id:
        return None
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT u.* FROM {SCHEMA}.lk_sessions s JOIN {SCHEMA}.lk_users u ON u.id=s.user_id "
        f"WHERE s.id=%s AND s.expires_at>NOW() AND u.is_active=TRUE", (session_id,)
    )
    return cur.fetchone()


def get_tool_cost(conn) -> int:
    cur = conn.cursor()
    cur.execute(f"SELECT energy_cost FROM {SCHEMA}.tool_costs WHERE tool_key=%s", (TOOL_KEY,))
    row = cur.fetchone()
    return row[0] if row else 5


def get_balance(salon_id, conn) -> int:
    cur = conn.cursor()
    cur.execute(
        f"SELECT COALESCE(SUM(CASE WHEN type='credit' THEN amount ELSE -amount END),0) "
        f"FROM {SCHEMA}.credit_transactions WHERE salon_id=%s", (salon_id,)
    )
    return cur.fetchone()[0]


def deduct(salon_id, user_id, cost, conn):
    cur = conn.cursor()
    cur.execute(f"UPDATE {SCHEMA}.salons SET credits_balance = credits_balance - %s WHERE id = %s", (cost, salon_id))
    cur.execute(
        f"INSERT INTO {SCHEMA}.credit_transactions (salon_id,user_id,action,amount,tool_key,type) "
        f"VALUES (%s,%s,%s,%s,%s,'debit')",
        (salon_id, user_id, "Диагностика роста салона", cost, TOOL_KEY)
    )
    conn.commit()


def refund(salon_id, user_id, cost, conn):
    cur = conn.cursor()
    cur.execute(f"UPDATE {SCHEMA}.salons SET credits_balance = credits_balance + %s WHERE id = %s", (cost, salon_id))
    cur.execute(
        f"INSERT INTO {SCHEMA}.credit_transactions (salon_id,user_id,action,amount,tool_key,type) "
        f"VALUES (%s,%s,%s,%s,%s,'credit')",
        (salon_id, user_id, "Возврат: ИИ-сервис недоступен", cost, TOOL_KEY)
    )
    conn.commit()


def is_provider_error(e: Exception) -> bool:
    msg = str(e).lower()
    return any(x in msg for x in ("502", "503", "service_unavailable", "temporarily", "bad gateway"))


def get_cached_ai(user_id: int, conn):
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT ai_result FROM {SCHEMA}.lk_salon_results WHERE user_id=%s ORDER BY completed_at DESC LIMIT 1",
        (user_id,)
    )
    row = cur.fetchone()
    return row["ai_result"] if row and row["ai_result"] else None


def save_ai_result(user_id: int, result: dict, conn):
    conn.cursor().execute(
        f"UPDATE {SCHEMA}.lk_salon_results SET ai_result=%s WHERE user_id=%s AND id=("
        f"SELECT id FROM {SCHEMA}.lk_salon_results WHERE user_id=%s ORDER BY completed_at DESC LIMIT 1)",
        (json.dumps(result, ensure_ascii=False), user_id, user_id)
    )
    conn.commit()


SYSTEM_PROMPT = """Ты — бизнес-консультант по бьюти-индустрии. Твоя задача — дать владельцу или управляющему салона красоты персональный разбор его бизнес-диагностики: где теряются деньги, что мешает росту и что делать прямо сейчас.

Стиль: прямой, деловой, без воды. Говори «ты». Оперируй конкретными метриками из данных.

Структура ответа — строго 4 блока через разделитель "###":

### ЧТО Я ВИЖУ В ТВОЁМ САЛОНЕ
2-3 предложения: честная бизнес-картина. Какие показатели сильные, какие критичные. Упомяни тип салона и его главную проблему. Если есть скрытый потенциал в деньгах — назови сумму.

### ГЛАВНАЯ ТОЧКА ПОТЕРЬ
1-2 предложения: один конкретный процесс в салоне, который прямо сейчас стоит денег. Назови что именно теряется и почему.

### 3 ДЕЙСТВИЯ НА ЭТОЙ НЕДЕЛЕ
Три конкретных управленческих действия, каждое начинается с глагола. Привязаны к слабым зонам. Только то, что реально сделать за 7 дней.

### ПОТЕНЦИАЛ РОСТА
1 предложение с конкретной цифрой или результатом: что изменится в выручке или потоке клиентов, если исправить главную точку потерь.

Объём: 260-330 слов суммарно. Начинай сразу с блока."""


def build_user_prompt(data: dict) -> str:
    norm = data.get("norm", {})
    ips = data.get("ips", 0)
    ipp_loss = data.get("ipp_loss", 0)
    type_title = data.get("type_title", "")
    hidden_money = data.get("hidden_money", 0)
    weak_zones = data.get("weak_zones", [])

    def lvl(val): return "сильный" if val >= 70 else "средний" if val >= 45 else "критично низкий"

    lines = [
        f"Тип салона: «{type_title}»",
        f"Главный индекс прибыльности (IPS): {ips}/100",
        f"Индекс потерь прибыли (IPP): {ipp_loss}",
        "",
        "Детальные показатели (0-100%):",
        f"• Возврат клиентов (IVK): {norm.get('IVK',0)} — {lvl(norm.get('IVK',0))}",
        f"• Средний чек (ISC): {norm.get('ISC',0)} — {lvl(norm.get('ISC',0))}",
        f"• Продажи услуг мастерами (IPU): {norm.get('IPU',0)} — {lvl(norm.get('IPU',0))}",
        f"• Загрузка (IZ): {norm.get('IZ',0)} — {lvl(norm.get('IZ',0))}",
        f"• Эффективность администраторов (IEA): {norm.get('IEA',0)} — {lvl(norm.get('IEA',0))}",
        f"• Лояльность клиентов (ILK): {norm.get('ILK',0)} — {lvl(norm.get('ILK',0))}",
    ]
    if hidden_money > 0:
        money_str = f"{round(hidden_money/1000)} тыс. ₽/мес" if hidden_money >= 1000 else f"{hidden_money} ₽/мес"
        lines.append(f"\nСкрытый потенциал роста: +{money_str}")
    if weak_zones:
        lines.append("Слабые зоны: " + ", ".join(weak_zones))
    return "\n".join(lines)


def call_openai(user_prompt: str, api_key: str) -> str:
    payload = json.dumps({
        "model": "openai/gpt-4o-mini",
        "messages": [{"role": "system", "content": SYSTEM_PROMPT}, {"role": "user", "content": user_prompt}],
        "max_tokens": 700, "temperature": 0.75,
    }).encode("utf-8")
    req = urllib.request.Request(
        "https://polza.ai/api/v1/chat/completions", data=payload,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}, method="POST",
    )
    with urllib.request.urlopen(req, timeout=25) as resp:
        return json.loads(resp.read().decode("utf-8"))["choices"][0]["message"]["content"].strip()


def parse_sections(text: str) -> dict:
    sections = {}
    for block in text.split("###"):
        block = block.strip()
        if not block:
            continue
        lines = block.split("\n", 1)
        sections[lines[0].strip()] = lines[1].strip() if len(lines) > 1 else ""
    return sections


def handler(event: dict, context) -> dict:
    """AI-анализ 'Диагностика роста салона PRO'. Списывает энергию ДО вызова AI."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    try:
        data = json.loads(event.get("body") or "{}")
    except Exception:
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "invalid json"})}

    session_id = (event.get("headers") or {}).get("X-Session-Id", "")

    cost = 0
    conn = get_db()
    try:
        user = get_session_user(session_id, conn)

        if user:
            cached = get_cached_ai(user["id"], conn)
            if cached:
                return {"statusCode": 200, "headers": CORS, "body": json.dumps(cached, ensure_ascii=False)}

            salon_id = user.get("salon_id")
            if salon_id:
                cost = get_tool_cost(conn)
                balance = get_balance(salon_id, conn)
                if balance < cost:
                    return {"statusCode": 402, "headers": CORS,
                            "body": json.dumps({"error": f"Недостаточно энергии. Доступно {balance}. Пополните баланс, чтобы продолжить."})}
                deduct(salon_id, user["id"], cost, conn)
    finally:
        conn.close()

    api_key = os.environ.get("OPENAI_API_KEY", "")
    if not api_key:
        return {"statusCode": 503, "headers": CORS, "body": json.dumps({"error": "no api key"})}

    user_prompt = build_user_prompt(data)
    try:
        text = call_openai(user_prompt, api_key)
    except Exception as e:
        if user and user.get("salon_id") and is_provider_error(e):
            conn_r = get_db()
            try:
                refund(user["salon_id"], user["id"], cost, conn_r)
            finally:
                conn_r.close()
            return {"statusCode": 503, "headers": CORS,
                    "body": json.dumps({"error": "ИИ-сервис временно недоступен, энергия возвращена. Попробуйте через минуту."}, ensure_ascii=False)}
        raise

    sections = parse_sections(text)
    result = {"text": text, "sections": sections}

    if user:
        conn2 = get_db()
        try:
            save_ai_result(user["id"], result, conn2)
        finally:
            conn2.close()

    return {"statusCode": 200, "headers": CORS, "body": json.dumps(result, ensure_ascii=False)}