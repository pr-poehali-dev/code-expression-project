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
        f"SELECT ai_result FROM {SCHEMA}.lk_finance_results WHERE user_id = %s ORDER BY completed_at DESC LIMIT 1",
        (user_id,)
    )
    row = cur.fetchone()
    if row and row["ai_result"]:
        return row["ai_result"]
    return None


def save_ai_result(user_id: int, result: dict, conn):
    conn.cursor().execute(
        f"UPDATE {SCHEMA}.lk_finance_results SET ai_result = %s WHERE user_id = %s AND id = ("
        f"SELECT id FROM {SCHEMA}.lk_finance_results WHERE user_id = %s ORDER BY completed_at DESC LIMIT 1)",
        (json.dumps(result, ensure_ascii=False), user_id, user_id)
    )
    conn.commit()

SYSTEM_PROMPT = """Ты — финансовый наставник для специалистов бьюти-индустрии (мастера, косметологи, массажисты, тренеры). Твоя задача — дать специалисту честный, конкретный разбор его финансовой диагностики: где он застрял, что реально мешает зарабатывать больше, и что сделать прямо сейчас.

Стиль: прямой, тёплый, без воды. Говори «ты». Используй конкретные цифры из данных — это делает анализ живым. Не объясняй что такое IFR — просто называй «индекс реализации» или используй % из данных.

Структура ответа — строго 4 блока через разделитель "###":

### ТВОЯ ФИНАНСОВАЯ КАРТИНА
2-3 предложения: честная и точная картина на основе цифр. Назови уровень (из данных), ключевые сильные стороны и самое критичное слабое место. Если есть финансовый разрыв — упомяни его как конкретную сумму.

### ГДЕ ЗАСТРЯЛИ ДЕНЬГИ
1-2 предложения: одна главная причина, почему специалист не выходит на желаемый доход. Привяжи к конкретному показателю (перегрузка, дефицитное мышление, потолок модели, неправильный чек и т.д.). Будь прямым — это самое ценное.

### 3 ДЕЙСТВИЯ НА ЭТОЙ НЕДЕЛЕ
Три конкретных шага, каждый начинается с глагола (Подними / Посчитай / Убери / Запусти / Поставь / Ограничь / Переговори). Привязаны к слабым индексам из диагностики. Только реалистичные действия на 7 дней.

### ПРОГНОЗ РОСТА
1-2 предложения: что изменится в доходе или нагрузке, если исправить главную точку. Пиши конкретно — «+20-30% к выручке за 2 месяца», «выход на X ₽ без увеличения часов». Опирайся на цифры из диагностики (текущий доход, нужный чек, разрыв).

Объём: 270-340 слов суммарно. Начинай сразу с блока, без вступлений."""


def fmt(n: float) -> str:
    return f"{round(n):,}".replace(",", " ") + " ₽"


def lvl(val: float, invert: bool = False) -> str:
    v = (100 - val) if invert else val
    if v >= 75:
        return "высокий"
    if v >= 45:
        return "средний"
    return "низкий"


def build_user_prompt(d: dict) -> str:
    ifr = d.get("ifr", 0)
    ifj = d.get("ifj", 0)
    ifu = d.get("ifu", 0)
    ipn = d.get("ipn", 0)
    idm = d.get("idm", 0)
    ifp = d.get("ifp", 0)
    label = d.get("label", "")

    current = d.get("current_income", 0)
    desired = d.get("desired_income", 0)
    gap = d.get("gap", 0)
    mpd = d.get("mpd", 0)
    avg_check = d.get("avg_check", 0)
    nsc = d.get("nsc", 0)
    nck = d.get("nck", 0)
    clients = d.get("clients_per_month", 0)
    hours = d.get("hours_per_week", 0)
    cp = d.get("clean_profit", 0)
    ceiling_reached = d.get("ceiling_reached", False)
    goal_desc = d.get("goal_description", "")
    goal_months = d.get("goal_months", 0)
    mindset_blocks = d.get("mindset_blocks", [])

    lines = [
        f"Уровень специалиста: «{label}» (IFR = {ifr}/100)",
        "",
        "Финансовые цифры:",
        f"• Текущий доход: {fmt(current)}/мес",
        f"• Желаемый доход: {fmt(desired)}/мес",
        f"• Финансовый разрыв: {fmt(gap)}",
        f"• Потолок текущей модели: {fmt(mpd)}/мес" + (" ⚠️ ПОТОЛОК ДОСТИГНУТ — модель не позволяет достичь цели" if ceiling_reached else ""),
        f"• Чистая прибыль: {fmt(cp)}/мес",
        f"• Средний чек сейчас: {fmt(avg_check)} → нужен чек {fmt(nsc)}",
        f"• Клиентов сейчас: {clients} → нужно {nck} при текущем чеке",
        f"• Рабочих часов в неделю: {hours}",
    ]

    if goal_desc:
        lines.append(f"• Цель: «{goal_desc}»" + (f" за {goal_months} месяцев" if goal_months else ""))

    lines += [
        "",
        "Индексы (0-100%):",
        f"• Финансовая ясность (IFJ): {ifj} — {lvl(ifj)}",
        f"• Финансовая устойчивость (IFU): {ifu} — {lvl(ifu)}",
        f"• Перегрузка (IPN): {ipn} — " + ("критично высокая" if ipn > 70 else "умеренная" if ipn > 40 else "низкая"),
        f"• Дефицитное мышление (IDM): {idm} — {lvl(idm, invert=True)}",
        f"• Потенциал модели (IFP): {ifp} — {lvl(ifp)}",
    ]

    if mindset_blocks:
        lines.append(f"• Психологические блоки: {', '.join(mindset_blocks)}")

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
    opener = urllib.request.build_opener()

    payload = json.dumps({
        "model": "openai/gpt-4o-mini",
        "messages": [
            {"role": "system", "content": system_prompt},
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
    """AI-анализ результатов 'Финансовая грамотность специалиста PRO'. polza.ai. Кэш в БД."""
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
    conn_cat = get_db()
    try:
        catalog = get_academy_catalog(conn_cat)
    finally:
        conn_cat.close()
    system_prompt = SYSTEM_PROMPT + catalog
    text = call_openai(user_prompt, api_key, system_prompt)
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