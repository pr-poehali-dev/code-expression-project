"""
AI-рекомендации для инструмента «Системная диагностика клиента».
Принимает зону тела и жалобу, возвращает персональные рекомендации по диагностике,
психосоматике и техникам работы.
"""
import os
import json
import urllib.request

PROXY_HOST = "185.200.177.36"
PROXY_PORT = 3128
PROXY_USER = "user"
PROXY_PASS = "pass"

SYSTEM_PROMPT = """Ты — эксперт по телесно-ориентированной работе, остеопатии и психосоматике.
Твоя задача — дать специалисту по телу конкретные практические рекомендации по работе с клиентом на основе его жалобы и зоны тела.

Контекст: специалист работает с телом (массажист, остеопат, мануальный терапевт). Клиент — платёжеспособный, ценит профессионализм и системный подход.
Рекомендации должны помочь специалисту провести грамотную диагностику и выстроить логику работы.

Важно: не описывай конкретные видео-техники с названиями — специалист добавит их сам. Описывай принципы, подходы, зоны внимания и логику работы.

Стиль: профессиональный, конкретный, как разговор с опытным коллегой. Без воды. Говори «специалист» или обращайся напрямую на «ты».

Структура ответа — строго 4 блока, каждый начинается с ###:

### КАК ПРОВОДИТЬ ДИАГНОСТИКУ
3-5 конкретных шагов: что смотреть, в какой последовательности, на что обращать внимание при осмотре и пальпации. Конкретно и по делу.

### ПСИХОСОМАТИКА
2-3 абзаца. Какие эмоциональные и психологические паттерны связаны с этой зоной и жалобой. Что стоит за симптомом на глубинном уровне. Как это влияет на тело. Практически применимая информация.

### ЛОГИКА РАБОТЫ
3-4 пункта. Как выстроить последовательность работы: с чего начать, что за чем, какие принципы соблюдать. Не техники — а логика и подход.

### ЧТО ОБЪЯСНИТЬ КЛИЕНТУ
2-3 предложения. Как доступно объяснить клиенту суть его состояния и логику работы, чтобы он понял ценность процесса и был готов к продолжению.

Объём: 350-450 слов суммарно. Никаких вводных. Начинай сразу с первого блока."""


def build_prompt(data: dict) -> str:
    zone_name = data.get("zone_name", "")
    symptom = data.get("symptom", "")
    possible_causes = data.get("possible_causes", "")
    compensation_zones = data.get("compensation_zones", "")
    emotional_factors = data.get("emotional_factors", "")

    lines = [
        f"Зона тела: {zone_name}",
        f"Жалоба клиента: {symptom}" if symptom else "",
        f"Возможные причины (из базы): {possible_causes}" if possible_causes else "",
        f"Компенсаторные зоны: {compensation_zones}" if compensation_zones else "",
        f"Эмоциональные факторы: {emotional_factors}" if emotional_factors else "",
    ]
    return "\n".join(l for l in lines if l)


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
        "max_tokens": 1000,
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

    with opener.open(req, timeout=30) as resp:
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


CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}


def handler(event: dict, context) -> dict:
    """AI-рекомендации для системной диагностики клиента."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    try:
        data = json.loads(event.get("body") or "{}")
    except Exception:
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "invalid json"})}

    api_key = os.environ.get("OPENAI_API_KEY", "")
    if not api_key:
        return {"statusCode": 503, "headers": CORS, "body": json.dumps({"error": "no api key"})}

    if not data.get("zone_name"):
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "missing zone_name"})}

    user_prompt = build_prompt(data)
    text = call_openai(user_prompt, api_key)
    sections = parse_sections(text)

    return {
        "statusCode": 200,
        "headers": CORS,
        "body": json.dumps({"sections": sections}, ensure_ascii=False),
    }
