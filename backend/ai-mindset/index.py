import os
import json
import urllib.request
import urllib.error

PROXY_HOST = "185.200.177.36"
PROXY_PORT = 3128
PROXY_USER = "user"
PROXY_PASS = "pass"

SYSTEM_PROMPT = """Ты — эксперт по психологии в бьюти-бизнесе. Твоя задача — дать мастеру красоты персональный разбор его психологического профиля для работы с премиум-клиентами.

Стиль: прямой, конкретный, как разговор с личным ментором. Без воды, без общих фраз. Называй вещи своими именами. Говори "ты".

Структура ответа — строго 4 блока через разделитель "###":

### ЧТО Я ВИЖУ
2-3 предложения: честная картина текущего состояния мышления. Что сильно, что тянет вниз. Без лести и без осуждения.

### ГЛАВНЫЙ ТОРМОЗ
1-2 предложения: назови один корневой барьер, который сейчас больше всего мешает зарабатывать больше с премиум-клиентами. Конкретно.

### 3 ШАГА НА ЭТОЙ НЕДЕЛЕ
Три конкретных действия, которые мастер может сделать прямо сейчас. Каждый шаг начинается с глагола. Не "подумай о...", а "Сделай / Напиши / Откажись / Установи / Скажи...". Привязаны к слабым зонам.

### ТОЧКА РОСТА
1 вдохновляющее предложение — куда может прийти этот человек, если проработает главный тормоз. Конкретно, без банальностей.

Объём: 250-320 слов суммарно. Никаких вводных вроде "Конечно!" или "Отличные результаты!". Начинай сразу с блока."""


def build_user_prompt(data: dict) -> str:
    idx = data.get("idx", {})
    igp = data.get("igp", 0)
    type_title = data.get("type_title", "")

    lines = [
        f"Тип мышления мастера: «{type_title}»",
        f"Общий индекс готовности к премиум-клиентам (IGP): {igp}/100",
        "",
        "Детальные показатели (0-100, выше = лучше, кроме инвертированных):",
        f"• Уверенность (IU): {idx.get('IU', 0)}",
        f"• Премиальное мышление (IPM): {idx.get('IPM', 0)}",
        f"• Профессиональные границы (IPG): {idx.get('IPG', 0)}",
        f"• Ценность себя / самоценность (ICS): {idx.get('ICS', 0)}",
        f"• Зрелость коммуникации (IZK): {idx.get('IZK', 0)}",
        f"• Зависимость от одобрения (IDO, инверт.): {idx.get('IDO', 0)} — высокое значение = проблема",
        f"• Страх денег (ISD, инверт.): {idx.get('ISD', 0)} — высокое значение = проблема",
    ]

    weak = []
    if idx.get("IU", 100) < 50:
        weak.append("низкая уверенность в себе")
    if idx.get("IPM", 100) < 50:
        weak.append("слабое премиальное позиционирование")
    if idx.get("IPG", 100) < 50:
        weak.append("размытые профессиональные границы")
    if idx.get("ICS", 100) < 50:
        weak.append("низкая самоценность")
    if idx.get("IZK", 100) < 50:
        weak.append("незрелость коммуникации")
    if idx.get("IDO", 0) > 60:
        weak.append("сильная зависимость от одобрения клиентов")
    if idx.get("ISD", 0) > 60:
        weak.append("выраженный страх больших денег")

    if weak:
        lines.append("")
        lines.append("Слабые зоны: " + ", ".join(weak))

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
    """AI-анализ результатов теста 'Мышление с премиум-клиентами'"""
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
