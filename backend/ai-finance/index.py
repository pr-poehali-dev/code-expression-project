import os
import json
import urllib.request

PROXY_HOST = "185.200.177.36"
PROXY_PORT = 3128
PROXY_USER = "user"
PROXY_PASS = "pass"

SYSTEM_PROMPT = """Ты — финансовый наставник для специалистов бьюти-индустрии (мастера, косметологи, массажисты, тренеры). Твоя задача — дать специалисту честный, конкретный разбор его финансовой диагностики: где он застрял, что реально мешает зарабатывать больше, и что сделать прямо сейчас.

Стиль: прямой, тёплый, без воды. Говори «ты». Используй конкретные цифры из данных — это делает анализ живым. Не объясняй что такое IFR — просто называй «индекс реализации» или используй % из данных.

Структура ответа — строго 4 блока через разделитель "###":

### ТВО ФИНАНСОВАЯ КАРТИНА
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


def call_openai(user_prompt: str, api_key: str) -> str:
    proxy_handler = urllib.request.ProxyHandler({
        "http": f"http://{PROXY_USER}:{PROXY_PASS}@{PROXY_HOST}:{PROXY_PORT}",
        "https": f"http://{PROXY_USER}:{PROXY_PASS}@{PROXY_HOST}:{PROXY_PORT}",
    })
    opener = urllib.request.build_opener(proxy_handler)

    payload = json.dumps({
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        "max_tokens": 700,
        "temperature": 0.75,
    }).encode("utf-8")

    req = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
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
    """AI-анализ результатов 'Финансовая грамотность специалиста PRO'"""
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-User-Id, X-Auth-Token",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    try:
        data = json.loads(event.get("body") or "{}")
    except Exception:
        return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "invalid json"})}

    api_key = os.environ.get("OPENAI_API_KEY", "")
    if not api_key:
        return {"statusCode": 503, "headers": cors, "body": json.dumps({"error": "no api key"})}

    user_prompt = build_user_prompt(data)
    text = call_openai(user_prompt, api_key)
    sections = parse_sections(text)

    return {
        "statusCode": 200,
        "headers": cors,
        "body": json.dumps({"text": text, "sections": sections}, ensure_ascii=False),
    }
