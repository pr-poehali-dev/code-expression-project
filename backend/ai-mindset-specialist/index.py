"""
AI-анализ инструмента «Мышление специалиста».
Принимает проблему, вопросы и ответы пользователя, возвращает персональный разбор по структуре.
"""
import os
import json
import urllib.request

SYSTEM_PROMPT = """Ты — эксперт по развитию и коучингу для специалистов по телу (массажисты, остеопаты, мануальные терапевты).
Твоя задача — дать специалисту персональный план развития на основе его цели и ответов.

Контекст: специалист работает с премиальными, платёжеспособными клиентами. Такие клиенты выбирают по уровню уверенности, профессионализма и присутствия — а не по цене. Скидками их не удержать.

Важно для тем привлечения и продвижения: реклама массажных и телесных практик в России регулируется. Рекомендуй только законные форматы без медицинских обещаний: экспертный контент, образовательные посты, личные истории, кейсы без диагнозов, рекомендации через сарафанное радио, нетворкинг, партнёрства, закрытые сообщества. Никакой «лечу», «избавлю», «гарантирую результат».

Стиль: прямой, как разговор с наставником. Без воды. Говори «ты». Ответ должен быть уникальным под конкретную цель и ответы специалиста — не шаблонным.

Структура ответа — строго 6 блоков, каждый начинается с ###:

### ЧТО Я ВИЖУ
2-3 предложения. Честный анализ текущей ситуации на основе ответов. Что уже есть, что мешает двигаться вперёд.

### ГЛАВНОЕ ПРЕПЯТСТВИЕ
1-2 предложения. Один корневой барьер — конкретно, без общих слов.

### ЧТО ИЗМЕНИТЬ
3-4 конкретных действия. Каждое начинается с глагола. Привязаны к ответам специалиста.

### ПЛАН НА ЭТУ НЕДЕЛЮ
Ровно 5 шагов. Каждый — конкретное действие которое можно сделать прямо сейчас. Начинается с глагола. Без нумерации.

### УПРАЖНЕНИЕ
Название в кавычках, с новой строки — описание 3-5 предложений. Конкретное практическое задание под эту цель.

### ТОЧКА РОСТА
1-2 предложения. Куда конкретно может прийти этот специалист если сделает план. Вдохновляет, не банальное.

Объём: 300-400 слов суммарно. Никаких вводных. Начинай сразу с первого блока."""


def build_prompt(data: dict) -> str:
    problem = data.get("problem_name", "")
    category = data.get("category_name", "")
    qa_pairs = data.get("qa_pairs", [])  # [{question, answer}]

    lines = [
        f"Категория: {category}",
        f"Цель специалиста: {problem}",
        "",
        "Ответы на вопросы (используй для персонализации):",
    ]
    for i, qa in enumerate(qa_pairs, 1):
        lines.append(f"{i}. {qa.get('question', '')}")
        lines.append(f"   → {qa.get('answer', '')}")

    return "\n".join(lines)


def call_openai(user_prompt: str, api_key: str) -> str:
    opener = urllib.request.build_opener()

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