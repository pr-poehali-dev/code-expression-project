"""
Автопубликация ежедневного экспертного поста для салонов красоты и мастеров.
GET/POST ?action=daily_post&key=ADMIN_TOKEN — cron: ИИ (модель terra, polza.ai) пишет пост,
    сохраняет в БД (t_p84565078_code_expression_proj.content_posts) и публикует в Telegram-канал.
    Если пост на сегодня уже есть — просто возвращает его (повторно в Telegram не шлёт).
GET ?action=list — последние опубликованные посты (для будущей ленты на сайте), без авторизации.
"""
import json
import os
import random
import urllib.request
import urllib.error
import psycopg2
import psycopg2.extras
from datetime import date

SCHEMA = "t_p84565078_code_expression_proj"
AI_URL = "https://polza.ai/api/v1/chat/completions"
AI_MODEL = "openai/gpt-5.6-terra"
SITE_URL = "https://promtdialog.ru"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Internal-Key",
}

TOPICS = [
    "как удержать клиента, который давно не приходил",
    "как поднять средний чек через допуслуги без давления на клиента",
    "как заполнить окна в расписании мастера в межсезонье",
    "как получать больше отзывов и повторных визитов",
    "как правильно вести соцсети салона, чтобы шли записи, а не лайки",
    "как посчитать реальную прибыльность мастера, а не только выручку",
    "как выстроить систему допродаж в салоне без раздражения клиентов",
    "как мотивировать мастеров расти в доходе, а не просто отрабатывать смену",
    "какие 3 метрики салону нужно смотреть каждую неделю",
    "как вернуть клиентов, которые ушли к конкурентам",
    "как настроить сарафанное радио так, чтобы оно реально работало",
    "как мастеру выйти на стабильный доход без хаотичной записи",
]


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def ok(data):
    return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps(data, ensure_ascii=False, default=str)}


def err(msg, status=400):
    return {"statusCode": status, "headers": CORS,
            "body": json.dumps({"error": msg}, ensure_ascii=False)}


def call_ai(topic: str) -> dict | None:
    """Просит ИИ написать короткую экспертную статью на заданную тему. Возвращает None при ошибке."""
    api_key = os.environ.get("POLZA_AI_API_KEY", "")
    if not api_key:
        return None

    system_prompt = f"""Ты — экспертный автор блога сервиса «Промт Диалог» (платформа для салонов красоты и мастеров: \
маркетинг, обучение, ИИ-инструменты, навигатор дохода «ПоДелам»).

Напиши короткую полезную статью для владельцев салонов и мастеров красоты на тему: {topic}.

Требования:
- Конкретика и практические советы, без воды, без общих фраз.
- Тон — дружелюбный эксперт, на "вы", без канцелярита.
- В конце статьи органично, без давления, можно упомянуть, что похожие задачи в один клик решает навигатор \
дохода «ПоДелам» в личном кабинете «Промт Диалог» — но только если это уместно по теме, не в каждом посте.

Отвечай СТРОГО в формате JSON, без markdown-обёртки:
{{
  "title": "Короткий цепляющий заголовок, до 60 знаков",
  "excerpt": "Превью-анонс на 1-2 предложения, до 150 знаков, без спойлера сути",
  "body": "Полный текст статьи, 800-1200 знаков, можно с переносами строк \\n"
}}"""

    payload = json.dumps({
        "model": AI_MODEL,
        "messages": [{"role": "system", "content": system_prompt}],
        "temperature": 0.8,
        "max_tokens": 1200,
    }).encode("utf-8")

    req = urllib.request.Request(
        AI_URL, data=payload,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        content = data["choices"][0]["message"]["content"].strip()
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
            content = content.strip()
        parsed = json.loads(content)
        if not parsed.get("title") or not parsed.get("body"):
            return None
        return parsed
    except (urllib.error.URLError, TimeoutError, KeyError, ValueError, json.JSONDecodeError):
        return None


def send_to_telegram(title: str, body: str) -> int | None:
    """Публикует пост в Telegram-канал. Возвращает message_id или None при ошибке/отсутствии настроек."""
    bot_token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
    channel_id = os.environ.get("TELEGRAM_CHANNEL_ID", "")
    if not bot_token or not channel_id:
        return None

    def esc(text: str) -> str:
        return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

    text = f"<b>{esc(title)}</b>\n\n{esc(body)}\n\n🔗 {SITE_URL}"
    payload = json.dumps({
        "chat_id": channel_id,
        "text": text,
        "parse_mode": "HTML",
        "disable_web_page_preview": False,
    }).encode("utf-8")

    req = urllib.request.Request(
        f"https://api.telegram.org/bot{bot_token}/sendMessage",
        data=payload,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        if data.get("ok"):
            return data["result"]["message_id"]
        return None
    except (urllib.error.URLError, TimeoutError, KeyError, ValueError, json.JSONDecodeError):
        return None


def handle_daily_post(event: dict, conn) -> dict:
    admin_token = os.environ.get("ADMIN_TOKEN", "")
    qs = event.get("queryStringParameters") or {}
    key = (event.get("headers") or {}).get("X-Internal-Key", "") or qs.get("key", "")
    if not admin_token or key != admin_token:
        return err("Доступ запрещён", 403)

    today = date.today()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT * FROM {SCHEMA}.content_posts WHERE post_date = %s",
        (today,)
    )
    existing = cur.fetchone()
    if existing:
        return ok({"post": dict(existing), "created": False})

    topic = random.choice(TOPICS)
    ai_result = call_ai(topic)
    if not ai_result:
        return err("Не удалось сгенерировать пост", 502)

    cur2 = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur2.execute(
        f"""INSERT INTO {SCHEMA}.content_posts (post_date, title, excerpt, body, source)
            VALUES (%s, %s, %s, %s, 'ai')
            ON CONFLICT (post_date) DO NOTHING
            RETURNING *""",
        (today, ai_result["title"], ai_result.get("excerpt") or "", ai_result["body"])
    )
    row = cur2.fetchone()
    conn.commit()
    if not row:
        cur.execute(f"SELECT * FROM {SCHEMA}.content_posts WHERE post_date = %s", (today,))
        row = cur.fetchone()
        return ok({"post": dict(row), "created": False})

    message_id = send_to_telegram(row["title"], row["body"])
    if message_id:
        cur3 = conn.cursor()
        cur3.execute(
            f"UPDATE {SCHEMA}.content_posts SET telegram_message_id = %s, telegram_sent_at = now() WHERE id = %s",
            (message_id, row["id"])
        )
        conn.commit()
        row["telegram_message_id"] = message_id

    return ok({"post": dict(row), "created": True, "telegram_sent": bool(message_id)})


def handle_list(event: dict, conn) -> dict:
    qs = event.get("queryStringParameters") or {}
    limit = min(int(qs.get("limit", 20)), 50)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"""SELECT id, post_date, title, excerpt, created_at
            FROM {SCHEMA}.content_posts
            ORDER BY post_date DESC
            LIMIT %s""",
        (limit,)
    )
    rows = [dict(r) for r in cur.fetchall()]
    return ok({"posts": rows})


def handler(event: dict, context) -> dict:
    """Автопубликация ежедневного экспертного поста (ИИ-текст) в Telegram-канал сервиса."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    qs = event.get("queryStringParameters") or {}
    action = qs.get("action", "")

    conn = get_db()
    try:
        if action == "daily_post":
            return handle_daily_post(event, conn)
        if action == "list":
            return handle_list(event, conn)
        return err("Неизвестное действие", 404)
    finally:
        conn.close()
