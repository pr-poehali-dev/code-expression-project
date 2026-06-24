"""
Генератор лендингов: чат с ИИ собирает информацию о бизнесе и генерирует готовый HTML-лендинг.
POST / — chat-сообщение (сбор данных или генерация финального HTML).
Поддерживает два типа: budget (стандартный) и premium (премиальный).
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

SYSTEM_CHAT_BUDGET = """Ты — помощник по созданию стандартных (бюджетных) лендингов для бизнеса. Твоя задача — собрать нужную информацию через дружелюбный чат, задавая по 1–2 вопроса за раз.

Тебе нужно узнать:
1. Название бизнеса / компании
2. Что продаёт / какие услуги предоставляет (3–5 пунктов)
3. Главное преимущество или уникальность
4. Контакты: телефон и/или email
5. Город или регион (если важно)
6. Цены или диапазон цен (опционально)

Как только у тебя есть всё необходимое (минимум пункты 1, 2, 3, 4) — спроси "Отлично, всё готово! Создать лендинг?" и жди подтверждения.

Отвечай коротко, по-русски, дружелюбно. Не задавай больше 2 вопросов за раз."""

SYSTEM_CHAT_PREMIUM = """Ты — помощник по созданию премиальных лендингов для бизнеса. Твоя задача — собрать максимально подробную информацию через дружелюбный чат, задавая по 1–2 вопроса за раз.

Тебе нужно узнать:
1. Название бизнеса / компании
2. Что продаёт / какие услуги предоставляет (5–8 пунктов с деталями)
3. Для кого (целевая аудитория — конкретно)
4. Главное преимущество или уникальность (почему выбирают именно их)
5. Контакты: телефон, email, соцсети, мессенджеры
6. Город или регион
7. Цены или диапазон цен
8. Специальная акция или оффер для новых клиентов
9. Есть ли реальные кейсы или отзывы клиентов? (краткое описание)
10. Есть ли команда? Сколько специалистов, опыт?

Как только у тебя есть всё необходимое (минимум пункты 1–6) — спроси "Отлично, данных достаточно для премиального лендинга! Создать?" и жди подтверждения.

Отвечай по-русски, дружелюбно и профессионально. Не задавай больше 2 вопросов за раз."""

SYSTEM_GENERATE_BUDGET = """Ты — профессиональный веб-разработчик. На основе данных о бизнесе создай чистый, современный, минималистичный одностраничный лендинг (HTML-файл).

СТИЛЬ — СТАНДАРТНЫЙ (БЮДЖЕТНЫЙ):
- Чистый минимализм: много белого пространства, нет лишних деталей
- Один акцентный цвет + белый + светло-серый (#f8f9fa) — больше ничего
- Простые кнопки с мягким скруглением (border-radius: 8px)
- Шрифт: Inter (Google Fonts) — один шрифт для всего
- Без анимаций (только hover на кнопках — небольшое затемнение opacity: 0.9)
- Ровные симметричные сетки, строгий порядок

ОБЯЗАТЕЛЬНАЯ СТРУКТУРА (5 блоков) — БЕЗ НАВИГАЦИОННОГО МЕНЮ:
1. <header> — только логотип/название компании + кнопка CTA справа. Никаких ссылок-меню.
2. #hero — сильный заголовок, подзаголовок, кнопка, чистый цветной фон (акцентный цвет)
3. #services — услуги/продукты (карточки 1–3 в ряд, простые, белый фон с тонкой рамкой)
4. #advantages — 3 преимущества (иконки-эмодзи + заголовок + текст, горизонтально)
5. #contact — форма (имя, телефон, кнопка) + контакты
6. <footer> — копирайт, серый фон

ВАЖНО ПРО НАВИГАЦИЮ: никакого меню, гамбургера, навигационных ссылок — ни на desktop, ни на mobile. Пользователь просто скроллит страницу.

ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ:
- Полный HTML5 документ (<!DOCTYPE html> ... </html>)
- <meta name="viewport" content="width=device-width, initial-scale=1">
- Весь CSS в <style>. Никакого JS.
- Без внешних зависимостей (только Google Fonts через @import)
- Mobile-first: базовые стили для 320px+, медиазапросы для 768px и 1024px
- Форма action="#" — только визуал, добавь комментарий <!-- Подключите форму к вашему сервису -->

ВАЖНО: Верни ТОЛЬКО чистый HTML-код, без markdown, без объяснений. Начинай сразу с <!DOCTYPE html>."""

SYSTEM_GENERATE_PREMIUM = """Ты — топовый веб-дизайнер уровня Awwwards. На основе данных о бизнесе создай выдающийся, премиальный одностраничный лендинг (HTML-файл) — такой, за который не стыдно просить дорого.

СТИЛЬ — ПРЕМИУМ-КЛАСС:
- Индивидуальная цветовая палитра под тематику бизнеса: 1 тёмный фон, 1 светлый фон, 1–2 акцентных цвета. Задай их как CSS-переменные (--color-primary, --color-accent, --color-bg-dark, --color-bg-light, --color-text) и используй везде только через переменные.
- Шрифты: Playfair Display для заголовков + Montserrat для текста (Google Fonts)
- Градиентные фоны в hero и CTA (linear-gradient из цветовых переменных)
- Асимметричные секции: чередуй расположение (текст слева/декор справа и наоборот)
- Плавные CSS-анимации: fadeIn + slideUp при загрузке hero, hover на карточках (translateY(-6px) + box-shadow)
- Кастомные кнопки: градиент из переменных + box-shadow + scale(1.03) при наведении
- Декоративные элементы: SVG-фигуры или clip-path волны/диагонали между секциями
- Фиксированный хедер: backdrop-filter: blur(12px) + полупрозрачный фон из --color-bg-dark

ИКОНКИ И ЭМОДЗИ — ПРЕМИАЛЬНЫЙ ПОДХОД:
- НЕ использовать разношерстные цветные эмодзи (❤️🔥💰 и т.п.)
- Вместо этого: SVG-иконки встроенные (простые, монохромные, цвет = var(--color-accent)) ИЛИ нейтральные символы (→ ✦ ◆ ▸) в цвет акцента
- Если используешь эмодзи — только монохромные/нейтральные (✓ ★ ◉), стилизованные через CSS (font-size, color: var(--color-accent))
- Иконки в карточках услуг: SVG-круг с акцентным фоном + простой SVG-путь внутри

ОБЯЗАТЕЛЬНАЯ СТРУКТУРА (8 блоков):
1. <header> — логотип + навигация (Desktop: горизонтальная; Mobile: гамбургер-аккордеон) + CTA-кнопка. Фиксированный, blur-эффект.
2. #hero — полноэкранный (min-height: 100vh): крупный заголовок, подзаголовок, 2 кнопки, декоративный SVG-элемент или градиентный блок справа
3. #about — о компании: заглушка фото слева (серый блок "Фото 600x400" с border-radius) + текст справа + 3 цифры-достижения внизу
4. #services — услуги: карточки в сетке, SVG-иконка в акцентном круге, hover-эффект, цветная полоска сверху карточки
5. #cases — кейсы/преимущества: 3–4 блока с крупным номером в цвет акцента + заголовок + текст
6. #reviews — отзывы: 2–3 карточки с декоративной кавычкой «», именем и ролью (придумай реалистичные для сферы бизнеса)
7. #contact — тёмный фон, форма (имя, телефон, сообщение, кнопка) + контакты + соцсети если есть
8. <footer> — тёмный фон, логотип + навигация + копирайт

НАВИГАЦИЯ (ОБЯЗАТЕЛЬНО):
- Desktop (768px+): горизонтальное меню, ссылки на якоря, hover подчёркивание акцентом
- Mobile: гамбургер (три полоски → крест при открытии), меню раскрывается аккордеоном (max-height transition), ссылки в столбик, при клике на ссылку — меню закрывается

JS (встроенный <script>):
- Гамбургер: toggle класса .nav-open, анимация max-height
- Хедер: при прокрутке > 60px добавляет класс .scrolled (фон становится непрозрачным)
- Плавный скролл к секциям

ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ:
- Полный HTML5 документ (<!DOCTYPE html> ... </html>)
- <meta name="viewport" content="width=device-width, initial-scale=1">
- CSS-переменные в :root для всей палитры
- Весь CSS в <style>, JS в <script> перед </body>
- Только Google Fonts через @import
- Mobile-first: 320px → 768px → 1024px+
- Форма action="#" — только визуал
- scroll-behavior: smooth на html

ВАЖНО: Верни ТОЛЬКО чистый HTML-код, без markdown, без объяснений. Начинай сразу с <!DOCTYPE html>."""


def get_user(session_id: str):
    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    try:
        with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
            safe_id = session_id.replace("'", "''")
            cur.execute(
                f"SELECT u.id FROM {SCHEMA}.lk_sessions s "
                f"JOIN {SCHEMA}.lk_users u ON u.id = s.user_id "
                f"WHERE s.id = '{safe_id}' AND s.expires_at > NOW() AND u.is_active = TRUE"
            )
            return cur.fetchone()
    finally:
        conn.close()


def handler(event: dict, context) -> dict:
    """Генератор лендингов — чат с ИИ для сбора данных и создания HTML (бюджетный/премиальный)"""
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
    mode = body.get("mode", "chat")
    landing_type = body.get("landingType", "budget")  # "budget" или "premium"
    html = body.get("html", "")
    refine_task = body.get("refineTask", "")

    # refine не требует messages
    if mode != "refine" and not messages:
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "messages обязателен"})}

    if mode == "refine" and not (html and refine_task):
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "html и refineTask обязательны"})}

    client = OpenAI(
        base_url="https://polza.ai/api/v1",
        api_key=os.environ["POLZA_AI_API_KEY"],
    )

    is_premium = landing_type == "premium"

    if mode == "refine":
        system = """Ты — профессиональный веб-разработчик. Пользователь просит доработать готовый HTML-лендинг.

ЗАДАЧА: Выполни конкретное изменение, которое просит пользователь. Всё остальное оставь без изменений.

ПРАВИЛА:
- Верни ТОЛЬКО полный HTML-код с внесёнными правками, без объяснений и markdown
- Начинай сразу с <!DOCTYPE html>
- Не меняй то, о чём пользователь не просил
- Если просят поменять цвет — меняй во всём документе через CSS-переменную или все вхождения
- Если просят добавить блок — добавляй в логичное место
- Если просят удалить блок — удаляй полностью вместе с CSS
- Сохраняй все встроенные стили, шрифты, адаптивность"""

        refine_messages = [
            {"role": "user", "content": f"Вот текущий HTML лендинга:\n\n{html}\n\nЧто нужно изменить: {refine_task}"}
        ]
        ai_messages = refine_messages
        max_tokens = 12000
    elif mode == "generate":
        system = SYSTEM_GENERATE_PREMIUM if is_premium else SYSTEM_GENERATE_BUDGET
        ai_messages = messages
        max_tokens = 10000 if is_premium else 7000
    else:
        system = SYSTEM_CHAT_PREMIUM if is_premium else SYSTEM_CHAT_BUDGET
        ai_messages = messages
        max_tokens = 600

    try:
        response = client.chat.completions.create(
            model="openai/gpt-4.1-mini",
            messages=[{"role": "system", "content": system}] + ai_messages,
            max_tokens=max_tokens,
            temperature=0.7,
        )
        reply = response.choices[0].message.content or ""
    except Exception as e:
        print(f"[ai-landing] ИИ ошибка: {e}")
        return {
            "statusCode": 502,
            "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps({"error": str(e)}, ensure_ascii=False),
        }

    return {
        "statusCode": 200,
        "headers": {**CORS, "Content-Type": "application/json"},
        "body": json.dumps({"reply": reply, "mode": mode, "landingType": landing_type}, ensure_ascii=False),
    }