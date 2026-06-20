"""
Генератор материалов тренинга для администратора.
Принимает сценарий (текст или файл), разбивает на главы,
генерирует контент (психология+философия+маркетинг) и изображения под каждую главу.
Таймаут функции: 300 секунд.
"""
import json
import os
import base64
import uuid
import io
import re
from datetime import datetime

import boto3
import psycopg2
import psycopg2.extras
import urllib.request
import urllib.error

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p84565078_code_expression_proj")
ADMIN_TOKEN = os.environ.get("ADMIN_TOKEN", "")

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id, X-Admin-Token",
}

OPENAI_BASE = "https://polza.ai/api/v1"
OPENAI_KEY = os.environ.get("POLZA_AI_API_KEY") or os.environ.get("OPENAI_API_KEY", "")


def ok(data):
    return {"statusCode": 200, "headers": CORS, "body": json.dumps(data, ensure_ascii=False, default=str)}


def err(msg, code=400):
    return {"statusCode": code, "headers": CORS, "body": json.dumps({"error": msg}, ensure_ascii=False)}


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def get_session_user(event, conn):
    session_id = (event.get("headers") or {}).get("X-Session-Id", "")
    if not session_id:
        return None
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT * FROM {SCHEMA}.lk_users u "
        f"JOIN {SCHEMA}.lk_sessions s ON s.user_id = u.id "
        f"WHERE s.id = %s AND s.expires_at > NOW() AND u.is_active = TRUE",
        (session_id,)
    )
    return cur.fetchone()


def check_admin(event, conn):
    admin_token = (event.get("headers") or {}).get("X-Admin-Token", "")
    if admin_token and ADMIN_TOKEN and admin_token == ADMIN_TOKEN:
        return True
    user = get_session_user(event, conn)
    return bool(user and user.get("is_admin"))


def openai_chat(messages: list, model: str = "openai/gpt-4.1", max_tokens: int = 4000) -> str:
    payload = json.dumps({
        "model": model,
        "messages": messages,
        "max_tokens": max_tokens,
        "temperature": 0.85,
    }).encode("utf-8")
    req = urllib.request.Request(
        f"{OPENAI_BASE}/chat/completions",
        data=payload,
        headers={
            "Authorization": f"Bearer {OPENAI_KEY}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=120) as resp:
        result = json.loads(resp.read().decode("utf-8"))
    return result["choices"][0]["message"]["content"]


def generate_image(prompt: str) -> str | None:
    """Генерирует изображение через polza.ai, загружает в S3, возвращает CDN URL."""
    payload = json.dumps({
        "model": "openai/gpt-image-1.5",
        "prompt": prompt,
        "n": 1,
        "size": "1024x1024",
        "response_format": "b64_json",
    }).encode("utf-8")
    try:
        print(f"[IMG] Генерирую изображение: {prompt[:80]}...")
        req = urllib.request.Request(
            f"{OPENAI_BASE}/images/generations",
            data=payload,
            headers={
                "Authorization": f"Bearer {OPENAI_KEY}",
                "Content-Type": "application/json",
            },
            method="POST",
        )
        with urllib.request.urlopen(req, timeout=180) as resp:
            raw = resp.read().decode("utf-8")
        result = json.loads(raw)
        print(f"[IMG] Ответ polza.ai: {str(result)[:200]}")
        # polza.ai может вернуть b64_json или url
        item = result["data"][0]
        if item.get("b64_json"):
            return upload_image_to_s3(item["b64_json"])
        if item.get("url"):
            return item["url"]
        print(f"[IMG] Нет b64_json и url в ответе: {item}")
        return None
    except Exception as e:
        print(f"[IMG] Ошибка генерации изображения: {e}")
        return None


def upload_image_to_s3(b64: str) -> str:
    data = base64.b64decode(b64)
    ts = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    uid = uuid.uuid4().hex[:8]
    key = f"training-gen/{ts}_{uid}.png"
    s3 = boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )
    s3.put_object(Bucket="files", Key=key, Body=data, ContentType="image/png")
    return f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"


def parse_docx(data: bytes) -> str:
    from docx import Document
    doc = Document(io.BytesIO(data))
    return "\n".join(p.text for p in doc.paragraphs if p.text.strip())


def parse_pdf(data: bytes) -> str:
    import pdfplumber
    parts = []
    with pdfplumber.open(io.BytesIO(data)) as pdf:
        for page in pdf.pages[:30]:
            text = page.extract_text()
            if text:
                parts.append(text.strip())
    return "\n\n".join(parts)


def split_into_chapters(scenario_text: str) -> list[dict]:
    """Просит ИИ разбить сценарий на главы и вернуть JSON."""
    prompt = f"""Ты — помощник по структурированию тренинговых материалов.

Разбей следующий сценарий тренинга на логические главы/модули.
Верни ТОЛЬКО валидный JSON-массив без лишнего текста, каждый элемент:
{{"num": 1, "title": "Название главы", "summary": "Краткое содержание главы (2-3 предложения)"}}

Сценарий:
{scenario_text[:12000]}"""

    response = openai_chat([{"role": "user", "content": prompt}], max_tokens=2000)
    json_match = re.search(r'\[.*\]', response, re.DOTALL)
    if json_match:
        return json.loads(json_match.group(0))
    return [{"num": 1, "title": "Глава 1", "summary": scenario_text[:500]}]


def generate_chapter_content(chapter: dict, scenario_context: str, chapter_index: int, total_chapters: int) -> dict:
    """Генерирует полный контент главы: текст + 1 изображение."""

    image_types = ["illustration", "scheme", "infographic"]
    img_type = image_types[chapter_index % len(image_types)]

    if img_type == "illustration":
        img_instruction = "an evocative illustration conveying the emotional and psychological meaning"
    elif img_type == "scheme":
        img_instruction = "a clean structural diagram or mindmap visualizing the key concept"
    else:
        img_instruction = "a modern infographic with visual accents and key thesis elements"

    structure_variants = [
        "Открытие → Концепция → Практика → Вызов → Итог",
        "Провокация → История → Теория → Инструмент → Рефлексия",
        "Кейс → Разбор → Принцип → Применение → Трансформация",
        "Философский вопрос → Исследование → Маркетинговый угол → Действие → Интеграция",
        "Парадокс → Психологический слой → Инструментарий → Пример → Закрепление",
    ]
    structure = structure_variants[chapter_index % len(structure_variants)]

    text_prompt = f"""Ты — ведущий тренер по трансформации мышления, психологии продаж и философии бизнеса.

Контекст всего тренинга:
{scenario_context[:3000]}

Твоя задача — написать полный материал для Главы {chapter['num']} из {total_chapters}: «{chapter['title']}»
Краткое содержание: {chapter['summary']}

Структура ЭТОЙ главы (строго следуй): {structure}

ПРАВИЛА:
— Объём: 600-900 слов
— Без вводных фраз ("В этой главе мы...", "Итак,", "Таким образом,")
— Без слов-паразитов (очевидно, безусловно, конечно, несомненно, важно отметить)
— Каждый абзац — самостоятельная мысль
— Вплетай психологию, философию и маркетинг органично, не называя их по именам
— Текст не должен обрываться — заканчивай полным смысловым блоком
— Уникальная структура: не повторяй подход предыдущих глав

Напиши только текст главы, без заголовка, без комментариев."""

    print(f"[CHAPTER] Генерирую текст для главы {chapter['num']}: {chapter['title']}")
    chapter_text = openai_chat([{"role": "user", "content": text_prompt}], max_tokens=1500)
    print(f"[CHAPTER] Текст готов ({len(chapter_text)} символов), генерирую изображение...")

    img_prompt = (
        f"Create {img_instruction} for a business training module. "
        f"Title: '{chapter['title']}'. "
        f"Theme: {chapter['summary'][:150]}. "
        f"Professional, modern, high quality. No text in image."
    )

    image_url = generate_image(img_prompt)
    print(f"[CHAPTER] Изображение: {image_url}")

    return {
        "num": chapter["num"],
        "title": chapter["title"],
        "summary": chapter["summary"],
        "text": chapter_text,
        "images": [image_url] if image_url else [],
        "structure_used": structure,
    }


def handle_parse_file(body: dict) -> dict:
    """Парсит загруженный файл и возвращает текст."""
    file_b64 = body.get("file_base64", "")
    filename = body.get("filename", "file")
    if not file_b64:
        return {"error": "no_file"}
    data = base64.b64decode(file_b64)
    name_lower = filename.lower()
    if name_lower.endswith(".docx") or name_lower.endswith(".doc"):
        text = parse_docx(data)
    elif name_lower.endswith(".pdf"):
        text = parse_pdf(data)
    elif name_lower.endswith(".txt"):
        text = data.decode("utf-8", errors="replace")
    else:
        return {"error": "unsupported_format"}
    return {"text": text, "filename": filename}


def handle_split(body: dict) -> dict:
    """Разбивает сценарий на главы."""
    scenario = (body.get("scenario") or "").strip()
    if not scenario:
        return {"error": "no_scenario"}
    chapters = split_into_chapters(scenario)
    return {"chapters": chapters, "total": len(chapters)}


def handle_generate_chapter(body: dict) -> dict:
    """Генерирует контент одной главы."""
    chapter = body.get("chapter")
    scenario_context = body.get("scenario_context", "")
    chapter_index = body.get("chapter_index", 0)
    total_chapters = body.get("total_chapters", 1)
    if not chapter:
        return {"error": "no_chapter"}
    result = generate_chapter_content(chapter, scenario_context, chapter_index, total_chapters)
    return result


def handler(event: dict, context) -> dict:
    """Генератор материалов тренинга: парсинг сценария, разбивка на главы, генерация текста и изображений."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    if event.get("httpMethod") != "POST":
        return err("Method not allowed", 405)

    conn = get_db()
    try:
        if not check_admin(event, conn):
            return err("Доступ запрещён", 403)
    finally:
        conn.close()

    body = json.loads(event.get("body") or "{}")
    action = body.get("action", "")

    if action == "parse_file":
        result = handle_parse_file(body)
    elif action == "split":
        result = handle_split(body)
    elif action == "generate_chapter":
        result = handle_generate_chapter(body)
    else:
        return err("Неизвестное действие")

    if "error" in result:
        return err(result["error"])
    return ok(result)