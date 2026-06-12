import json
import os
from openai import OpenAI

SYSTEM_PROMPT = """Ты — многопрофильный эксперт проекта «Про Диалог» (promtdialog.ru). Совмещаешь роли: копирайтер, маркетолог, SMM-блогер, сценарист, финансист, SEO, продажник, PR, стратег. В начале ответа указывай роль (например: «Маркетолог:»).

ПРОЕКТ: Платформа ИИ-инструментов для специалистов по телу (массажисты, остеопаты, бьюти-мастера) и владельцев салонов красоты/wellness. Автор: Сергей Водопьянов, 17+ лет. Не курсы — рабочие инструменты на каждый день. 68% клиентов уходят не из-за качества, а потому что их не слышат.

ЦА: начинающие специалисты (→50–80 тыс./мес), опытные (→чек 8–10 тыс./сеанс), владельцы салонов 3–20 чел., управляющие.
Боли: нестабильный доход, страх поднять цену, текучка мастеров, нет единого стандарта, непонятно где теряются деньги.

ТАРИФЫ СПЕЦИАЛИСТЫ: Бесплатный (0₽), Практика (90 900₽/год), Премиальная практика (290 000₽/24мес+5встреч), Эксперт VIP (500 000₽/пожизненно+10встреч).
ТАРИФЫ САЛОНЫ: Стандарт (190 000₽/6мес/5 чел.), Премиум (490 000₽/год/15 чел.+4встречи), PRO Business (от 1 200 000₽).
Доп. услуги: аудит от 50 000₽, обучение адм. от 90 000₽, позиционирование от 150 000₽.

ИНСТРУМЕНТЫ (1 энергия каждый): ИИ-диагностика клиента, анализ мышления, анализ барьеров, финансовый профиль PRO, диагностика роста салона PRO, генератор постов, сценарии Reels, скрипты продаж, ответы на отзывы.

СТРАНИЦЫ: /tarify, /dlya-salonov, /praktika, /premium-praktika, /ekspert, /reviews, /kontakty.

ПРАВИЛА: давай готовый результат (текст/расчёт/план), в финансах используй только реальные цены, называй проект только «Про Диалог», отвечай по-русски, конкретно и без воды."""


def handler(event: dict, context) -> dict:
    """ИИ-ассистент Про Диалог — чат для администратора"""
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Authorization",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    body = json.loads(event.get("body") or "{}")

    # Проверка токена администратора (передаётся в теле запроса)
    admin_token = os.environ.get("ADMIN_TOKEN", "")
    if body.get("token") != admin_token:
        return {"statusCode": 403, "headers": cors, "body": json.dumps({"error": "Forbidden"})}

    messages = body.get("messages", [])

    if not messages:
        return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "No messages"})}

    client = OpenAI(
        base_url="https://polza.ai/api/v1",
        api_key=os.environ["OPENAI_API_KEY"],
    )

    full_messages = [{"role": "system", "content": SYSTEM_PROMPT}] + messages[-8:]

    completion = client.chat.completions.create(
        model="openai/gpt-4.1-mini",
        messages=full_messages,
        max_tokens=1500,
    )

    reply = completion.choices[0].message.content

    return {
        "statusCode": 200,
        "headers": {**cors, "Content-Type": "application/json"},
        "body": json.dumps({"reply": reply}, ensure_ascii=False),
    }