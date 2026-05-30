import json
import os
from openai import OpenAI

SYSTEM_PROMPT = """Ты — ИИ-ассистент проекта Dok Диалог.

О проекте:
Dok Диалог — образовательная платформа для массажистов и владельцев салонов красоты. 
Помогает специалистам развить практику, повысить чек, выстроить поток клиентов.
Помогает салонам обучить команду и вырасти в прибыли.

Тарифы для специалистов (страница /dlya-specialistov):
- Базовый — системный старт, базовые техники, первые результаты
- Профи — углублённая работа с телом, рост чека  
- Премиум — полная трансформация практики, личный бренд, масштаб

Тарифы для салонов (страница /dlya-salonov):
- Старт — базовые инструменты для выстраивания работы команды
- Бизнес — стандарты сервиса, удержание клиентов, управление командой
- Премиум — полное сопровождение от обучения персонала до системы роста

Онлайн-курсы для специалистов:
- Массажист с потоком клиентов — привлечение клиентов, стабильный доход
- Диагностика клиента — системный подход к работе со сложными случаями
- Техники и протоколы — готовые алгоритмы работы

Форматы обучения:
- Онлайн-курсы с видеоуроками и практическими заданиями
- Личный кабинет с инструментами: диагностика клиента, карта тела, тесты
- Инструменты в ЛК: системная диагностика, мышление с премиум-клиентами, барьеры, финансовая грамотность, финансовый профиль PRO, диагностика роста салона PRO

Целевая аудитория:
- Начинающие массажисты — хотят стартовать и быстро выйти на доход
- Опытные массажисты — хотят поднять чек (до 8 000–10 000 ₽ за сеанс), найти специализацию
- Владельцы и управляющие салонов — хотят обучить команду, снизить текучку, вырасти в прибыли

Контакты и страницы:
- Главная: /
- Для специалистов: /dlya-specialistov
- Для салонов: /dlya-salonov
- Отзывы: /reviews
- Контакты: /kontakty

Твоя задача: помогать администратору проекта готовить контент, тексты, стратегии, отвечать на вопросы о проекте, 
писать коммерческие предложения, посты, описания курсов, скрипты продаж и любые другие материалы.
Отвечай на русском языке. Будь конкретным и практичным."""


def handler(event: dict, context) -> dict:
    """ИИ-ассистент Dok Диалог — чат для администратора"""
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

    full_messages = [{"role": "system", "content": SYSTEM_PROMPT}] + messages

    completion = client.chat.completions.create(
        model="openai/gpt-4.1-mini",
        messages=full_messages,
        max_tokens=4096,
    )

    reply = completion.choices[0].message.content

    return {
        "statusCode": 200,
        "headers": {**cors, "Content-Type": "application/json"},
        "body": json.dumps({"reply": reply}, ensure_ascii=False),
    }