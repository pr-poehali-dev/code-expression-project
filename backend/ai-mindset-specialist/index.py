"""
AI-анализ инструмента «Мышление специалиста».
Принимает проблему, вопросы и ответы пользователя, возвращает персональный разбор по структуре.
"""
import os
import json
import urllib.request

PROXY_HOST = "185.200.177.36"
PROXY_PORT = 3128
PROXY_USER = "user"
PROXY_PASS = "pass"

SYSTEM_PROMPT = """Ты — эксперт по психологии и коучингу для специалистов по телу (массажисты, остеопаты, мануальные терапевты).
Твоя задача — дать специалисту персональный разбор его внутреннего состояния и конкретный план действий.

Стиль: прямой, тёплый, как разговор с наставником. Без воды и общих фраз. Говори «ты». Называй вещи своими именами.
Не повторяй вопросы и ответы дословно — анализируй их суть.

Структура ответа — строго 6 блоков, каждый начинается с ###:

### ГЛАВНАЯ ПРИЧИНА
2-3 предложения. Честно и конкретно — что именно происходит внутри. Почему эта проблема возникает. Без осуждения.

### ЧТО ПРОИСХОДИТ ВНУТРИ
2-3 предложения. Внутреннее состояние: эмоции, страхи, паттерны поведения которые ты видишь из ответов.

### КАК ЭТО ВИДИТ КЛИЕНТ
1-2 предложения. Как эта внутренняя ситуация транслируется клиенту — что он чувствует и замечает.

### ЧТО ИЗМЕНИТЬ
3-4 конкретных изменения. Каждое начинается с глагола действия. Привязаны к конкретным ответам пользователя.

### ПЛАН НА ЭТУ НЕДЕЛЮ
Ровно 5 шагов. Каждый — конкретное действие, начинается с глагола. Можно сделать прямо сейчас.
Формат каждого шага: просто текст, без нумерации.

### УПРАЖНЕНИЕ
Название упражнения в кавычках, затем с новой строки — описание 3-5 предложений. Конкретное практическое упражнение для работы с этой проблемой.

Объём: 280-380 слов суммарно. Никаких вводных типа «Конечно!» или «Отличный вопрос!». Начинай сразу с первого блока."""


def build_prompt(data: dict) -> str:
    problem = data.get("problem_name", "")
    category = data.get("category_name", "")
    qa_pairs = data.get("qa_pairs", [])  # [{question, answer}]

    lines = [
        f"Категория проблемы: {category}",
        f"Проблема специалиста: {problem}",
        "",
        "Ответы на уточняющие вопросы:",
    ]
    for i, qa in enumerate(qa_pairs, 1):
        lines.append(f"{i}. Вопрос: {qa.get('question', '')}")
        lines.append(f"   Ответ: {qa.get('answer', '')}")

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
        "max_tokens": 900,
        "temperature": 0.8,
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
    """Персональный AI-анализ для инструмента Мышление специалиста."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    try:
        data = json.loads(event.get("body") or "{}")
    except Exception:
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "invalid json"})}

    api_key = os.environ.get("OPENAI_API_KEY", "")
    if not api_key:
        return {"statusCode": 503, "headers": CORS, "body": json.dumps({"error": "no api key"})}

    if not data.get("problem_name") or not data.get("qa_pairs"):
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "missing data"})}

    user_prompt = build_prompt(data)
    text = call_openai(user_prompt, api_key)
    sections = parse_sections(text)

    return {
        "statusCode": 200,
        "headers": CORS,
        "body": json.dumps({"sections": sections}, ensure_ascii=False),
    }
