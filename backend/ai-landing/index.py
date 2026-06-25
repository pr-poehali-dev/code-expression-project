"""
Генератор лендингов: чат → блочная генерация → редактирование блоков.
Режимы:
  chat        — диалог для сбора данных о бизнесе
  gen-style   — генерирует CSS-тему (переменные + шрифты) на основе бизнеса
  gen-block   — генерирует один HTML-блок (blockId: header/hero/about/services/reviews/contact/footer)
  edit-block  — переделывает один блок по запросу пользователя
  refine      — доработка всего HTML (старый режим для совместимости)
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

# ── CHAT ПРОМПТЫ ──────────────────────────────────────────────────────────────

SYSTEM_CHAT_BUDGET = """Ты — помощник по созданию лендингов. Собери информацию о бизнесе через дружелюбный чат, задавая по 1–2 вопроса за раз.

Нужно узнать:
1. Название бизнеса
2. Услуги/продукты (3–5 пунктов)
3. Главное преимущество или уникальность
4. Контакты: телефон и/или email
5. Город или регион

Когда есть пункты 1–4 — скажи "Отлично, данных достаточно! Создать лендинг?" и жди подтверждения.
Отвечай коротко, по-русски, дружелюбно."""

SYSTEM_CHAT_PREMIUM = """Ты — помощник по созданию премиальных лендингов. Собери информацию через дружелюбный чат, задавая по 1–2 вопроса за раз.

Нужно узнать:
1. Название бизнеса
2. Услуги (5–8 пунктов с деталями)
3. Целевая аудитория
4. Главное преимущество (почему выбирают именно их)
5. Контакты: телефон, email, соцсети
6. Город
7. Цены или диапазон цен
8. Акция для новых клиентов
9. Отзывы клиентов (краткое описание)
10. Команда (количество, опыт)

Когда есть пункты 1–6 — скажи "Отлично, данных достаточно! Создать лендинг?" и жди подтверждения.
Отвечай по-русски, дружелюбно и профессионально."""

# ── БЛОЧНАЯ ГЕНЕРАЦИЯ: СТИЛЬ ──────────────────────────────────────────────────

SYSTEM_GEN_STYLE = """На основе данных о бизнесе придумай CSS-тему для лендинга и верни ТОЛЬКО JSON (без markdown, без объяснений).

Формат ответа:
{
  "primary": "#HEX",
  "accent": "#HEX",
  "dark": "#HEX",
  "light": "#HEX",
  "text": "#HEX",
  "headingFont": "Название шрифта Google Fonts",
  "bodyFont": "Название шрифта Google Fonts"
}

Правила:
- Подбери палитру под тематику бизнеса (не используй дефолтный синий #2563eb)
- primary — основной цвет бренда
- accent — яркий акцент для кнопок и выделений
- dark — тёмный фон для hero и footer
- light — очень светлый фон для секций (#f8f9fa или похожий)
- text — цвет основного текста (тёмный)
- headingFont — красивый заголовочный шрифт (Playfair Display, Cormorant Garamond, Raleway и тп)
- bodyFont — читаемый шрифт для текста (Montserrat, Inter, Open Sans и тп)

Верни ТОЛЬКО JSON без каких-либо других символов."""

# ── БЛОЧНАЯ ГЕНЕРАЦИЯ: ПРОМПТЫ ДЛЯ КАЖДОГО БЛОКА ────────────────────────────

BLOCK_PROMPTS = {
    "header": """Сгенерируй HTML-блок <header> для лендинга.

Требования:
- position:fixed, top:0, width:100%, z-index:100
- backdrop-filter:blur(12px), background: rgba({dark_rgb}, 0.85)
- Логотип (название компании) слева, nav-ссылки на якоря справа, кнопка «Связаться» крайняя справа
- Мобильный гамбургер (три полоски) — показывается на <768px, nav скрыт
- JS: toggle класса .nav-open, меню раскрывается max-height анимацией
- При scroll > 60px добавляй класс .scrolled (фон непрозрачный)
- Используй CSS-переменные из :root

Верни ТОЛЬКО HTML фрагмент от <header> до </header> + нужные <style> в <style data-block="header"> + JS в <script data-block="header">.""",

    "hero": """Сгенерируй HTML-блок #hero для лендинга.

Требования:
- min-height: 100vh, padding-top: 80px (под фиксированный хедер)
- Фон: linear-gradient(135deg, var(--c-dark) 0%, var(--c-primary) 100%)
- Цвет текста: #fff
- Слева: крупный h1 (главный оффер), подзаголовок p, 2 кнопки (основная с var(--c-accent), вторичная outline)
- Справа: декоративный блок — градиентный прямоугольник с border-radius или абстрактные SVG-окружности
- Анимация при загрузке: fadeInUp для текста (CSS @keyframes)
- Mobile: колонка, декор скрыт на <768px

Верни ТОЛЬКО HTML фрагмент <section id="hero"> + <style data-block="hero">.""",

    "about": """Сгенерируй HTML-блок #about для лендинга.

Требования:
- Светлый фон var(--c-light)
- Заголовок секции h2 (по центру)
- Асимметричная сетка: слева — серый плейсхолдер фото (aspect-ratio 4/3, border-radius 12px, background #ddd, текст "Фото команды"), справа — 2-3 абзаца текста о компании
- Под сеткой: 3 цифры-достижения (число крупное var(--c-accent) + подпись), в ряд
- padding: 80px 0

Верни ТОЛЬКО HTML фрагмент <section id="about"> + <style data-block="about">.""",

    "services": """Сгенерируй HTML-блок #services для лендинга.

Требования:
- Белый фон
- Заголовок h2 по центру + краткий подзаголовок
- Grid карточек: repeat(auto-fit, minmax(260px, 1fr)), gap 20px
- Каждая карточка div.card: border-radius 12px, box-shadow, border-top 3px solid var(--c-accent), padding 28px
  - Иконка (простой монохромный SVG или Unicode-символ в круге var(--c-accent))
  - h3 — название услуги
  - p — описание 2-3 предложения
  - Ссылка/кнопка «Подробнее» цвет var(--c-accent)
- hover: translateY(-5px) + усиленная тень
- padding секции: 80px 0

Верни ТОЛЬКО HTML фрагмент <section id="services"> + <style data-block="services">.""",

    "reviews": """Сгенерируй HTML-блок #reviews для лендинга.

Требования:
- Фон var(--c-light)
- Заголовок h2 по центру
- 3 карточки отзывов в ряд (на mobile — колонка): background #fff, border-radius 12px, padding 24px, box-shadow
  - Декоративная кавычка «» — position absolute, font-size 80px, color var(--c-accent), opacity 0.12
  - Текст отзыва (придумай реалистичные для тематики бизнеса)
  - Имя + должность/город внизу
  - 5 звёзд ★★★★★ цвет var(--c-accent)
- padding секции: 80px 0

Верни ТОЛЬКО HTML фрагмент <section id="reviews"> + <style data-block="reviews">.""",

    "contact": """Сгенерируй HTML-блок #contact для лендинга.

Требования:
- Тёмный фон var(--c-dark), цвет текста #fff
- Двухколоночная сетка: слева — форма, справа — контакты
- Форма: поля input (имя, телефон), textarea (сообщение), кнопка var(--c-accent)
  - Поля: border:none, border-bottom 2px solid rgba(255,255,255,0.3), background transparent, color #fff, padding 12px 0
  - Форма action="#"
- Справа: адрес, телефон, email, время работы, иконки соцсетей (SVG или Unicode)
- padding секции: 80px 0
- Mobile: одна колонка

Верни ТОЛЬКО HTML фрагмент <section id="contact"> + <style data-block="contact">.""",

    "footer": """Сгенерируй HTML-блок <footer> для лендинга.

Требования:
- background #111, color #aaa
- Три колонки: логотип + краткое описание | навигационные ссылки | соцсети
- Снизу: горизонтальная линия + копирайт © 2025
- padding: 40px 0 20px
- Mobile: одна колонка, всё по центру

Верни ТОЛЬКО HTML фрагмент <footer>...</footer> + <style data-block="footer">.""",
}

SYSTEM_GEN_BLOCK = """Ты — профессиональный верстальщик. Генерируешь один HTML-блок для лендинга строго по инструкции.

КОНТЕКСТ САЙТА (используй везде):
{context}

CSS-ПЕРЕМЕННЫЕ (уже заданы в :root, используй их):
--c-primary: {primary}
--c-accent: {accent}
--c-dark: {dark}
--c-light: {light}
--c-text: {text}
--font-heading: '{heading_font}', serif
--font-body: '{body_font}', sans-serif

ПРАВИЛА:
- Используй ТОЛЬКО CSS-переменные из :root, не хардкоди цвета
- Весь CSS блока помести в <style data-block="НАЗВАНИЕ"> (чтобы потом можно заменить)
- Весь JS блока помести в <script data-block="НАЗВАНИЕ">
- Класс контейнера: .container (max-width: 1200px; margin: 0 auto; padding: 0 20px)
- Текст — реальный, на основе данных о бизнесе
- ЛИМИТ: 1500 токенов на блок
- Верни ТОЛЬКО HTML-фрагмент, без <!DOCTYPE>, без <html>, без <head>"""

SYSTEM_EDIT_BLOCK = """Ты — профессиональный верстальщик. Перепиши один блок лендинга согласно пожеланию пользователя.

ТЕКУЩИЙ HTML БЛОКА:
{block_html}

CSS-ПЕРЕМЕННЫЕ сайта (не меняй):
--c-primary: {primary}; --c-accent: {accent}; --c-dark: {dark}; --c-light: {light}; --c-text: {text}

ПРАВИЛА:
- Сохрани id и data-block атрибуты
- Используй только CSS-переменные, не хардкоди цвета
- ЛИМИТ: 1500 токенов
- Верни ТОЛЬКО новый HTML-фрагмент блока, без объяснений"""


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def ok(data):
    return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps(data, ensure_ascii=False)}


def err(msg, status=400):
    return {"statusCode": status, "headers": CORS,
            "body": json.dumps({"error": msg}, ensure_ascii=False)}


def get_session_user(event, conn):
    sid = (event.get("headers") or {}).get("X-Session-Id", "") or \
          (event.get("headers") or {}).get("x-session-id", "")
    if not sid:
        return None
    with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        safe_id = sid.replace("'", "''")
        cur.execute(
            f"SELECT u.id, u.salon_id FROM {SCHEMA}.lk_sessions s "
            f"JOIN {SCHEMA}.lk_users u ON u.id = s.user_id "
            f"WHERE s.id = '{safe_id}' AND s.expires_at > NOW() AND u.is_active = TRUE"
        )
        return cur.fetchone()


def check_and_spend(conn, user, tool_key, default_cost, action_name):
    salon_id = user.get("salon_id")
    if not salon_id:
        return err("Необходим профиль салона для использования ИИ", 402)
    with conn.cursor() as cur:
        cur.execute(f"SELECT energy_cost FROM {SCHEMA}.tool_costs WHERE tool_key = %s", (tool_key,))
        row = cur.fetchone()
        cost = row[0] if row else default_cost
        cur.execute(f"SELECT credits_balance FROM {SCHEMA}.salons WHERE id = %s", (salon_id,))
        row = cur.fetchone()
        balance = row[0] if row else 0
        if balance < cost:
            return err(f"Недостаточно энергии. Нужно {cost} ⚡, доступно {balance} ⚡. Пополните баланс.", 402)
        cur.execute(f"UPDATE {SCHEMA}.salons SET credits_balance = credits_balance - %s WHERE id = %s", (cost, salon_id))
        cur.execute(
            f"INSERT INTO {SCHEMA}.credit_transactions (salon_id, user_id, action, amount, tool_key, type) "
            f"VALUES (%s, %s, %s, %s, %s, 'debit')",
            (salon_id, user["id"], action_name, cost, tool_key)
        )
    conn.commit()
    return None


def hex_to_rgb(h):
    h = h.lstrip("#")
    try:
        r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
        return f"{r},{g},{b}"
    except Exception:
        return "0,0,0"


def handler(event: dict, context) -> dict:
    """Генератор лендингов: чат + блочная генерация + редактирование блоков"""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)

        body = json.loads(event.get("body") or "{}")
        mode = body.get("mode", "chat")
        landing_type = body.get("landingType", "budget")
        messages = body.get("messages", [])

        client = OpenAI(
            base_url="https://polza.ai/api/v1",
            api_key=os.environ["POLZA_AI_API_KEY"],
        )

        # ── ЧАТ: сбор данных о бизнесе ──────────────────────────────────────
        if mode == "chat":
            energy_err = check_and_spend(conn, user, "landing_chat", 4, "Сообщение в чате конструктора лендингов")
            if energy_err:
                return energy_err
            system = SYSTEM_CHAT_PREMIUM if landing_type == "premium" else SYSTEM_CHAT_BUDGET
            resp = client.chat.completions.create(
                model="openai/gpt-4.1-mini",
                messages=[{"role": "system", "content": system}] + messages,
                max_tokens=700, temperature=0.7,
            )
            return ok({"reply": resp.choices[0].message.content or "", "mode": "chat"})

        # ── GEN-STYLE: генерация CSS-темы ────────────────────────────────────
        if mode == "gen-style":
            energy_err = check_and_spend(conn, user, "landing_generate", 16, "Генерация стиля лендинга")
            if energy_err:
                return energy_err
            context_text = "\n".join([f"{m['role']}: {m['content']}" for m in messages[-10:]])
            resp = client.chat.completions.create(
                model="openai/gpt-4.1-mini",
                messages=[
                    {"role": "system", "content": SYSTEM_GEN_STYLE},
                    {"role": "user", "content": f"Данные о бизнесе:\n{context_text}"}
                ],
                max_tokens=300, temperature=0.8,
            )
            raw = resp.choices[0].message.content or "{}"
            # Извлекаем JSON если обёрнут в markdown
            if "```" in raw:
                raw = raw.split("```")[1]
                if raw.startswith("json"):
                    raw = raw[4:]
            try:
                style = json.loads(raw.strip())
            except Exception:
                style = {
                    "primary": "#1a3a4a", "accent": "#e67e22", "dark": "#0f2030",
                    "light": "#f8f9fa", "text": "#2c3e50",
                    "headingFont": "Playfair Display", "bodyFont": "Montserrat"
                }
            return ok({"style": style, "mode": "gen-style"})

        # ── GEN-BLOCK: генерация одного блока ────────────────────────────────
        if mode == "gen-block":
            block_id = body.get("blockId", "")
            style = body.get("style", {})
            if not block_id or block_id not in BLOCK_PROMPTS:
                return err(f"Неизвестный blockId: {block_id}", 400)

            energy_err = check_and_spend(conn, user, "landing_generate", 20, f"Генерация блока {block_id}")
            if energy_err:
                return energy_err

            context_parts = [f"{m['role']}: {m['content']}" for m in messages[-12:]]
            context_text = "\n".join(context_parts)

            dark_rgb = hex_to_rgb(style.get("dark", "#0f2030"))
            system = SYSTEM_GEN_BLOCK.format(
                context=context_text,
                primary=style.get("primary", "#1a3a4a"),
                accent=style.get("accent", "#e67e22"),
                dark=style.get("dark", "#0f2030"),
                light=style.get("light", "#f8f9fa"),
                text=style.get("text", "#2c3e50"),
                heading_font=style.get("headingFont", "Playfair Display"),
                body_font=style.get("bodyFont", "Montserrat"),
                dark_rgb=dark_rgb,
            )
            block_prompt = BLOCK_PROMPTS[block_id].format(dark_rgb=dark_rgb)

            resp = client.chat.completions.create(
                model="openai/gpt-4.1-mini",
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": block_prompt}
                ],
                max_tokens=1800, temperature=0.7,
            )
            html_fragment = resp.choices[0].message.content or ""
            return ok({"html": html_fragment, "blockId": block_id, "mode": "gen-block"})

        # ── EDIT-BLOCK: переделать один блок ─────────────────────────────────
        if mode == "edit-block":
            block_id = body.get("blockId", "")
            block_html = body.get("blockHtml", "")
            edit_task = body.get("editTask", "")
            style = body.get("style", {})
            if not block_html or not edit_task:
                return err("blockHtml и editTask обязательны", 400)

            energy_err = check_and_spend(conn, user, "landing_refine", 24, f"Редактирование блока {block_id}")
            if energy_err:
                return energy_err

            system = SYSTEM_EDIT_BLOCK.format(
                block_html=block_html,
                primary=style.get("primary", "#1a3a4a"),
                accent=style.get("accent", "#e67e22"),
                dark=style.get("dark", "#0f2030"),
                light=style.get("light", "#f8f9fa"),
                text=style.get("text", "#2c3e50"),
            )
            resp = client.chat.completions.create(
                model="openai/gpt-4.1-mini",
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": f"Измени этот блок: {edit_task}"}
                ],
                max_tokens=1800, temperature=0.7,
            )
            html_fragment = resp.choices[0].message.content or ""
            return ok({"html": html_fragment, "blockId": block_id, "mode": "edit-block"})

        # ── REFINE: доработка всего HTML (совместимость) ─────────────────────
        if mode == "refine":
            html = body.get("html", "")
            refine_task = body.get("refineTask", "")
            if not html or not refine_task:
                return err("html и refineTask обязательны", 400)
            energy_err = check_and_spend(conn, user, "landing_refine", 80, "ИИ-доработка лендинга")
            if energy_err:
                return energy_err
            resp = client.chat.completions.create(
                model="openai/gpt-4.1-mini",
                messages=[
                    {"role": "system", "content": "Ты — профессиональный верстальщик. Выполни конкретное изменение в HTML-лендинге. Верни ТОЛЬКО полный HTML без markdown. Начинай с <!DOCTYPE html>."},
                    {"role": "user", "content": f"HTML:\n{html}\n\nЧто изменить: {refine_task}"}
                ],
                max_tokens=6000, temperature=0.7,
            )
            return ok({"reply": resp.choices[0].message.content or "", "mode": "refine"})

        return err(f"Неизвестный mode: {mode}", 400)

    finally:
        conn.close()
