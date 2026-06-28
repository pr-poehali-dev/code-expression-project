import os
import json
import urllib.request
import psycopg2
import psycopg2.extras

SCHEMA = "t_p84565078_code_expression_proj"
TOOL_KEY = "barriers_analysis"

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
    return row[0] if row else 3


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
        (salon_id, user_id, "Анализ внутренних барьеров", cost, TOOL_KEY)
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
        f"SELECT ai_result FROM {SCHEMA}.lk_barriers_results WHERE user_id=%s ORDER BY completed_at DESC LIMIT 1",
        (user_id,)
    )
    row = cur.fetchone()
    return row["ai_result"] if row and row["ai_result"] else None


def save_ai_result(user_id: int, result: dict, conn):
    conn.cursor().execute(
        f"UPDATE {SCHEMA}.lk_barriers_results SET ai_result=%s WHERE user_id=%s AND id=("
        f"SELECT id FROM {SCHEMA}.lk_barriers_results WHERE user_id=%s ORDER BY completed_at DESC LIMIT 1)",
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
        f"• Синдром самозванца (ISS): {idx.get('ISS', 0)}",
        f"• Страх денег и продаж (ISD): {idx.get('ISD', 0)}",
        f"• Страх проявленности (ISP): {idx.get('ISP', 0)}",
        f"• Зависимость от оценки (IDO): {idx.get('IDO', 0)}",
        f"• Избегание роста (IIR): {idx.get('IIR', 0)}",
        f"• Эмоциональное истощение (IEI): {idx.get('IEI', 0)}",
        f"• Внутренняя опора (IVO): {idx.get('IVO', 0)} (высокое — хорошо)",
    ]
    critical = [l for k, l in [("ISS","синдром самозванца"),("ISD","страх денег"),("ISP","страх проявленности"),
                                ("IDO","зависимость от оценки"),("IIR","избегание роста"),("IEI","выгорание")]
                if idx.get(k, 0) > 60]
    if idx.get("IVO", 100) < 40:
        critical.append("слабая внутренняя опора")
    if critical:
        lines += ["", "Критические зоны: " + ", ".join(critical)]
    return "\n".join(lines)


def get_academy_catalog(conn) -> str:
    """Читает опубликованные курсы Академии из БД для включения в промт."""
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"SELECT id, title, description, category, access_cost, lesson_cost "
            f"FROM {SCHEMA}.courses WHERE is_published=TRUE ORDER BY sort_order, id"
        )
        courses = cur.fetchall()
        if not courses:
            return ""
        cur.execute(f"SELECT id, course_id, title FROM {SCHEMA}.course_modules ORDER BY course_id, sort_order, id")
        modules_all = cur.fetchall()
        cur.execute(f"SELECT module_id, title FROM {SCHEMA}.course_lessons ORDER BY course_id, sort_order, id")
        lessons_all = cur.fetchall()

        modules_by_course = {}
        for m in modules_all:
            modules_by_course.setdefault(m["course_id"], []).append(m)
        lessons_by_module = {}
        for l in lessons_all:
            lessons_by_module.setdefault(l["module_id"], []).append(l["title"])

        cat_labels = {"owner": "Для владельца и руководителя", "admin": "Для администратора",
                      "master": "Для мастеров", "body": "Для специалистов по телу"}
        lines = ["", "════════════════════════════════════",
                 "ТРЕНИНГИ АКАДЕМИИ «ПРОМТ ДИАЛОГ» (актуальный список)",
                 "════════════════════════════════════",
                 "Когда даёшь рекомендации — упоминай конкретные тренинги из этого списка. Они доступны в разделе «Академия» личного кабинета.", ""]
        for c in courses:
            cost = []
            if c["access_cost"] and int(c["access_cost"]) > 0:
                cost.append(f"доступ: {int(c['access_cost'])} ⚡")
            if c["lesson_cost"] and int(c["lesson_cost"]) > 0:
                cost.append(f"урок: {int(c['lesson_cost'])} ⚡")
            cost_str = f" [{', '.join(cost)}]" if cost else " [бесплатно]"
            lines.append(f"▸ «{c['title']}»{cost_str} — {cat_labels.get(c['category'], c['category'])}")
            if c["description"]:
                lines.append(f"  {c['description']}")
            for m in modules_by_course.get(c["id"], []):
                lines.append(f"  Модуль: {m['title']}")
                for lt in lessons_by_module.get(m["id"], []):
                    lines.append(f"    — {lt}")
            lines.append("")
        lines.append("════════════════════════════════════")
        return "\n".join(lines)
    except Exception:
        return ""


def call_openai(user_prompt: str, api_key: str, system_prompt: str = SYSTEM_PROMPT) -> str:
    payload = json.dumps({
        "model": "openai/gpt-4o-mini",
        "messages": [{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}],
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
    """AI-анализ 'Внутренние барьеры'. Списывает энергию ДО вызова AI."""
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

        # Если авторизован — проверяем кэш и списываем энергию
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
                            "body": json.dumps({"error": f"Недостаточно энергии. Нужно {cost}, доступно {balance}."})}
                # Списываем ДО вызова AI
                deduct(salon_id, user["id"], cost, conn)
    finally:
        conn.close()

    api_key = os.environ.get("OPENAI_API_KEY", "")
    if not api_key:
        return {"statusCode": 503, "headers": CORS, "body": json.dumps({"error": "no api key"})}

    user_prompt = build_user_prompt(data)
    conn3 = get_db()
    try:
        catalog = get_academy_catalog(conn3)
    finally:
        conn3.close()
    system_prompt = SYSTEM_PROMPT + catalog
    try:
        text = call_openai(user_prompt, api_key, system_prompt)
    except Exception as e:
        if user and user.get("salon_id") and cost and is_provider_error(e):
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