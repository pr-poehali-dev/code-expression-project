"""
Генератор лендингов: чат с ИИ собирает информацию о бизнесе и генерирует готовый HTML-лендинг.
POST / — chat-сообщение (сбор данных или генерация финального HTML).
"""
import json
import os
import psycopg2
import psycopg2.extras
from openai import OpenAI

SCHEMA = "t_p84565078_code_expression_proj"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}

SYSTEM_CHAT = """Ты — помощник по созданию лендингов для бизнеса. Твоя задача — собрать всю нужную информацию через дружелюбный чат, задавая по 1-2 вопроса за раз.

Тебе нужно узнать:
1. Название бизнеса / компании
2. Что продаёт / какие услуги предоставляет (3-7 пунктов)
3. Для кого (целевая аудитория)
4. Главное преимущество или уникальность (почему выбирают именно их)
5. Контакты: телефон и/или email
6. Город или регион (если важно)
7. Цены или диапазон цен (опционально, если есть)
8. Специальная акция или оффер (опционально)

Как только у тебя есть всё необходимое (минимум пункты 1, 2, 4, 5) — спроси "Всё готово! Создать лендинг?" и жди подтверждения.

Отвечай коротко, по-русски, дружелюбно. Не задавай больше 2 вопросов за раз."""

SYSTEM_GENERATE = """Ты — профессиональный веб-разработчик и дизайнер. На основе данных о бизнесе создай полный, красивый, современный одностраничный лендинг (HTML-файл).

ТРЕБОВАНИЯ К ЛЕНДИНГУ:
- Полный HTML5 документ (<!DOCTYPE html> ... </html>)
- Весь CSS встроен в <style> тег
- Без внешних зависимостей (только Google Fonts через @import)
- Адаптивный (mobile-first, медиазапросы для 768px+)
- Современный дизайн: чистый, профессиональный

СТРУКТУРА ЛЕНДИНГА (обязательные секции):
1. <header> — шапка: логотип/название + навигация + кнопка CTA
2. #hero — главный экран: сильный заголовок, подзаголовок, кнопка действия, фоновый градиент
3. #about — коротко о компании (2-3 предложения)
4. #services — услуги/продукты (карточки в сетке)
5. #advantages — почему выбирают (3-4 блока с иконками-эмодзи)
6. #contact — форма обратной связи (имя, телефон, кнопка) + контакты
7. <footer> — копирайт

СТИЛЬ:
- Основной акцент: подбери цвет под тематику бизнеса
- Шрифт: Montserrat (импорт из Google Fonts)
- Кнопки: скруглённые, с тенью
- Секции чередуются: белый / светло-серый фон (#f8f9fa)
- Анимация: плавный scroll-behavior, hover-эффекты на кнопках и карточках

АДАПТИВНОСТЬ (КРИТИЧЕСКИ ВАЖНО — mobile-first):
- В <head> обязательно: <meta name="viewport" content="width=device-width, initial-scale=1">
- Базовые стили для мобильных (320px+): одна колонка, padding: 16px, font-size крупный
- @media (min-width: 768px) — планшет: 2 колонки в сетках, больше отступы
- @media (min-width: 1024px) — десктоп: 3-4 колонки, padding 60-80px
- header на мобильном: скрыть пункты навигации, показать только логотип + кнопку
- hero секция: на мобильном текст по центру, кнопки на всю ширину (width: 100%)
- Все изображения: max-width: 100%; height: auto
- Карточки услуг: на мобильном 1 в ряд, на планшете 2, на десктопе 3
- Никаких фиксированных px-ширин на блоках — использовать %, max-width, flexbox/grid

ФОРМА ОБРАТНОЙ СВЯЗИ:
- Поля: Имя, Телефон, кнопка "Оставить заявку"
- Форма должна быть красивой, но не функциональной (action="#")
- На мобильном поля и кнопка в колонку (flex-direction: column)
- Добавь комментарий: <!-- Подключите форму к вашему сервису -->

ВАЖНО:
- Верни ТОЛЬКО чистый HTML-код, без markdown, без объяснений
- Начинай сразу с <!DOCTYPE html>
- Используй реальные данные из описания бизнеса"""


def get_user(session_id: str):
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            cur.execute(
                f"SELECT u.id FROM {SCHEMA}.lk_sessions s "
                f"JOIN {SCHEMA}.lk_users u ON u.id = s.user_id "
                f"WHERE s.id = %s AND s.expires_at > NOW() AND u.is_active = TRUE",
                (session_id,),
            )
            return cur.fetchone()
    finally:
        conn.close()


def handler(event: dict, context) -> dict:
    """Генератор лендингов — чат с ИИ для сбора данных и создания HTML"""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    session_id = (event.get("headers") or {}).get("X-Session-Id", "") or \
                 (event.get("headers") or {}).get("x-session-id", "")
    if not session_id:
        return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Не авторизован"})}

    user = get_user(session_id)
    if not user:
        return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Сессия не найдена"})}

    body = json.loads(event.get("body") or "{}")
    messages = body.get("messages", [])
    mode = body.get("mode", "chat")  # "chat" или "generate"

    if not messages:
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "messages обязателен"})}

    client = OpenAI(
        base_url="https://polza.ai/api/v1",
        api_key=os.environ["OPENAI_API_KEY"],
    )

    if mode == "generate":
        system = SYSTEM_GENERATE
        max_tokens = 8000
    else:
        system = SYSTEM_CHAT
        max_tokens = 600

    response = client.chat.completions.create(
        model="openai/gpt-4.1-mini",
        messages=[{"role": "system", "content": system}] + messages,
        max_tokens=max_tokens,
        temperature=0.7,
    )

    reply = response.choices[0].message.content or ""

    return {
        "statusCode": 200,
        "headers": {**CORS, "Content-Type": "application/json"},
        "body": json.dumps({"reply": reply, "mode": mode}, ensure_ascii=False),
    }