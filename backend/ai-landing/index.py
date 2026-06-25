"""
Генератор лендингов: чат с ИИ собирает информацию о бизнесе и генерирует готовый HTML-лендинг.
POST / — chat-сообщение (сбор данных или генерация финального HTML).
Поддерживает три типа: budget (стандартный), premium (премиальный), multipage (мини-сайт до 6 страниц).
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

SYSTEM_CHAT_MULTIPAGE = """Ты — помощник по созданию мини-сайтов для бизнеса (до 6 страниц в одном HTML-файле). Твоя задача — собрать подробную информацию и согласовать структуру сайта с пользователем.

ПЕРВЫЙ шаг — обязательно спроси какие страницы нужны. Предложи на выбор:
- Главная (home) — всегда включается
- Услуги (services) — что предлагает компания
- О нас (about) — история, команда, ценности
- Портфолио (portfolio) — примеры работ, кейсы
- FAQ (faq) — частые вопросы и ответы
- Контакты (contacts) — форма, карта, реквизиты

Максимум 6 страниц включая Главную. Запомни выбранные страницы — они понадобятся при генерации.

После согласования структуры собери информацию:
1. Название бизнеса / компании
2. Что продаёт / какие услуги (5–8 пунктов с деталями)
3. Для кого (целевая аудитория)
4. Главное преимущество или уникальность
5. Контакты: телефон, email, соцсети, мессенджеры
6. Город или регион
7. Цены или диапазон цен (опционально)
8. Кейсы / портфолио — если выбрана эта страница
9. FAQ — 5–7 частых вопросов — если выбрана эта страница
10. Команда — имена, должности — если выбрана страница «О нас»

Как только у тебя есть структура и минимальные данные (пункты 1–5) — спроси "Отлично! Создать мини-сайт?" и жди подтверждения.

Отвечай по-русски, дружелюбно. Не задавай больше 2 вопросов за раз."""

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

SYSTEM_GENERATE_PREMIUM = """Создай HTML-скелет лендинга. ТОЛЬКО структура и тексты, БЕЗ дизайна.

СЕКЦИИ (все в одном файле):
- header: nav с логотипом и ссылками на якоря, кнопка «Связаться»
- #hero: h1 с главным заголовком, p с подзаголовком, 2 кнопки-ссылки
- #about: заголовок, 2-3 абзаца текста о компании, 3 числа-достижения (число + подпись)
- #services: заголовок, 3-6 карточек div.card (каждая: h3 + p с описанием)
- #reviews: заголовок, 2-3 div.review (цитата + имя + должность — придумай реалистичные)
- #contact: заголовок, form (input name, input tel, button), p с телефоном и email
- footer: p с копирайтом

CSS: ТОЛЬКО минимальный reset + body{font-family:sans-serif;margin:0} + display:flex/grid для карточек. Никакого дизайна.
JS: только гамбургер-меню (toggle класса .open).

Заполни всё РЕАЛЬНЫМ текстом на основе данных о бизнесе.

Верни только <!DOCTYPE html>…</html>. ЛИМИТ: 2500 токенов."""

SYSTEM_STYLE_PREMIUM = """Ты — топовый веб-дизайнер. Тебе дан HTML-скелет лендинга с текстом. Добавь премиальный дизайн — перепиши ТОЛЬКО блок <style> и дополни <script>. HTML и тексты не трогай.

НОВЫЙ <style> должен содержать:
:root { --c-primary: [цвет под тематику]; --c-accent: [яркий акцент]; --c-dark: [тёмный]; --c-light: [светлый фон]; --c-text: [текст]; }
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700&family=Montserrat:wght@400;600&display=swap');

Стили:
- body: font-family Montserrat, background var(--c-light)
- h1,h2,h3: font-family Playfair Display
- header: position:fixed, width:100%, backdrop-filter:blur(12px), background rgba темный 80%, z-index:100
- #hero: min-height:100vh, background linear-gradient(135deg, var(--c-dark), var(--c-primary)), color:#fff, display:flex align center, padding-top:80px
- кнопки: background var(--c-accent), color:#fff, border:none, padding:14px 32px, border-radius:6px, transition 0.2s; hover: transform scale(1.03) box-shadow
- .card: background:#fff, border-radius:12px, padding:28px, box-shadow 0 2px 16px rgba(0,0,0,.08), border-top:3px solid var(--c-accent); hover: transform translateY(-5px)
- #services .cards: display:grid, grid-template-columns repeat(auto-fit,minmax(240px,1fr)), gap:20px
- .review: background:#fff, border-radius:12px, padding:24px, position:relative; ::before content '«' font-size:80px color var(--c-accent) opacity .15
- #contact: background var(--c-dark), color:#fff
- form input: width:100%, padding:12px, margin-bottom:12px, border-radius:6px, border:1px solid #ddd
- footer: background #111, color:#aaa, text-align:center, padding:20px

Адаптив @media(max-width:768px): nav скрыт, .hamburger виден, grid 1 колонка.

Добавь в <script>: при scroll > 60px добавляй класс .scrolled на header (фон становится непрозрачным).

Верни ПОЛНЫЙ HTML-файл. ЛИМИТ: 3500 токенов. Только чистый HTML без markdown."""

SYSTEM_GENERATE_MULTIPAGE = """Ты — топовый веб-разработчик. На основе данных о бизнесе создай многостраничный мини-сайт (SPA) в одном HTML-файле. Все страницы — в одном файле, переключение через JS без перезагрузки.

АРХИТЕКТУРА (СТРОГО ОБЯЗАТЕЛЬНО):
Каждая страница — это <div> с атрибутом data-page="ИД_СТРАНИЦЫ", по умолчанию скрытая (display:none), видна только активная.

Структура HTML:
```
<body>
  <header>...</header>
  <div data-page="home" class="page active">...</div>
  <div data-page="services" class="page">...</div>
  <div data-page="about" class="page">...</div>
  ... другие страницы по выбору пользователя ...
  <footer>...</footer>
</body>
```

CSS для страниц:
```css
.page { display: none; }
.page.active { display: block; }
```

JS-роутер (встроенный, обязательно перед </body>):
```javascript
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  var el = document.querySelector('[data-page="' + id + '"]');
  if (el) { el.classList.add('active'); window.scrollTo(0, 0); }
  // Обновляем активный пункт навигации
  document.querySelectorAll('[data-nav]').forEach(n => {
    n.classList.toggle('nav-active', n.dataset.nav === id);
  });
}
// Обработка кликов на навигацию
document.querySelectorAll('[data-nav]').forEach(function(el) {
  el.addEventListener('click', function(e) {
    e.preventDefault();
    showPage(this.dataset.nav);
    // Закрыть мобильное меню если открыто
    document.querySelector('.nav-menu')?.classList.remove('open');
  });
});
// Слушаем переключение из родительского окна (для превью)
window.addEventListener('message', function(e) {
  if (e.data && e.data.type === 'landing-switch-page') showPage(e.data.pageId);
});
showPage('home');
```

НАВИГАЦИЯ (ОБЯЗАТЕЛЬНО):
- Desktop: горизонтальное меню, каждый пункт имеет data-nav="ИД_СТРАНИЦЫ" (например data-nav="home")
- Mobile: гамбургер → выпадающее меню с теми же data-nav ссылками
- Активный пункт: класс .nav-active (подчёркивание или другой акцент)
- В footer тоже повторить навигацию

СТИЛЬ — ПРЕМИАЛЬНЫЙ (единая палитра для всех страниц):
- CSS-переменные в :root: --color-primary, --color-accent, --color-bg-dark, --color-bg-light, --color-text
- Шрифты: Playfair Display для заголовков + Montserrat для текста (Google Fonts)
- Градиентные hero-блоки на Главной и CTA-секциях
- SVG-иконки монохромные в цвет --color-accent
- Плавные hover-эффекты на карточках и кнопках
- Фиксированный хедер с backdrop-filter: blur(12px)

СТРАНИЦЫ — генерируй ТОЛЬКО те, которые выбрал пользователь в чате:
- home: Hero (полный экран), краткое о компании, ключевые услуги (3 шт.), CTA
- services: все услуги с описанием, карточки с иконками, цены если есть
- about: история, миссия, команда (фото-заглушки), цифры-достижения
- portfolio: сетка кейсов/работ с фото-заглушками и описанием
- faq: аккордеон с вопросами и ответами (JS expand/collapse)
- contacts: форма (имя, телефон, сообщение), контакты, соцсети

ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ:
- Полный HTML5: <!DOCTYPE html> ... </html>
- <meta name="viewport" content="width=device-width, initial-scale=1">
- Весь CSS в <style>, весь JS в <script> перед </body>
- Только Google Fonts через @import
- Mobile-first: 320px → 768px → 1024px+
- scroll-behavior: smooth на html
- Форма action="#" — только визуал

ВАЖНО: Верни ТОЛЬКО чистый HTML-код, без markdown, без объяснений. Начинай сразу с <!DOCTYPE html>.
ЛИМИТ: код должен уложиться в 7500 токенов. Пиши компактный CSS, не повторяй стили — используй классы. Генерируй только те страницы, которые выбрал пользователь."""


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


def get_tool_cost(conn, tool_key: str, default: int) -> int:
    with conn.cursor() as cur:
        cur.execute(f"SELECT energy_cost FROM {SCHEMA}.tool_costs WHERE tool_key = %s", (tool_key,))
        row = cur.fetchone()
        return row[0] if row else default


def get_balance(conn, salon_id: int) -> int:
    with conn.cursor() as cur:
        cur.execute(f"SELECT credits_balance FROM {SCHEMA}.salons WHERE id = %s", (salon_id,))
        row = cur.fetchone()
        return row[0] if row else 0


def deduct(conn, salon_id: int, user_id: int, tool_key: str, cost: int, action: str):
    with conn.cursor() as cur:
        cur.execute(
            f"UPDATE {SCHEMA}.salons SET credits_balance = credits_balance - %s WHERE id = %s",
            (cost, salon_id)
        )
        cur.execute(
            f"INSERT INTO {SCHEMA}.credit_transactions (salon_id, user_id, action, amount, tool_key, type) "
            f"VALUES (%s, %s, %s, %s, %s, 'debit')",
            (salon_id, user_id, action, cost, tool_key)
        )
    conn.commit()


def check_and_spend(conn, user, tool_key: str, default_cost: int, action: str):
    """Проверяет баланс и списывает. Возвращает err-ответ или None."""
    salon_id = user.get("salon_id")
    if not salon_id:
        return err("Для использования конструктора лендингов необходим профиль салона.", 402)
    cost = get_tool_cost(conn, tool_key, default_cost)
    balance = get_balance(conn, salon_id)
    if balance < cost:
        return err(f"Недостаточно энергии. Нужно {cost} ⚡, доступно {balance} ⚡. Пополните баланс.", 402)
    deduct(conn, salon_id, user["id"], tool_key, cost, action)
    return None


def handler(event: dict, context) -> dict:
    """Генератор лендингов — чат с ИИ, генерация и доработка HTML. Списывает энергию за каждое действие."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)

        body = json.loads(event.get("body") or "{}")
        messages = body.get("messages", [])
        mode = body.get("mode", "chat")
        landing_type = body.get("landingType", "budget")
        html = body.get("html", "")
        refine_task = body.get("refineTask", "")

        needs_messages = mode not in ("refine", "style")
        if needs_messages and not messages:
            return err("messages обязателен", 400)
        if mode == "refine" and not (html and refine_task):
            return err("html и refineTask обязательны", 400)
        if mode == "style" and not html:
            return err("html обязателен для style", 400)

        is_premium = landing_type == "premium"
        is_multipage = landing_type == "multipage"

        # Определяем tool_key и стоимость
        if mode in ("generate", "style"):
            if is_multipage:
                tool_key = "landing_generate_premium"
                default_cost = 48
                action_name = "Генерация мини-сайта (этап)" if mode == "generate" else "Стилизация мини-сайта"
            elif is_premium:
                tool_key = "landing_generate_premium"
                default_cost = 48
                action_name = "Генерация лендинга (этап)" if mode == "generate" else "Стилизация премиум-лендинга"
            else:
                tool_key = "landing_generate"
                default_cost = 64
                action_name = "Генерация лендинга (стандартный)"
        elif mode == "refine":
            tool_key = "landing_refine"
            default_cost = 80
            action_name = "ИИ-доработка лендинга"
        else:
            tool_key = "landing_chat"
            default_cost = 4
            action_name = "Сообщение в чате конструктора лендингов"

        # Проверяем баланс и списываем
        energy_err = check_and_spend(conn, user, tool_key, default_cost, action_name)
        if energy_err:
            return energy_err

        client = OpenAI(
            base_url="https://polza.ai/api/v1",
            api_key=os.environ["POLZA_AI_API_KEY"],
        )

        if mode == "refine":
            system = """Ты — профессиональный веб-разработчик. Пользователь просит доработать готовый HTML-лендинг или мини-сайт.

ЗАДАЧА: Выполни конкретное изменение, которое просит пользователь. Всё остальное оставь без изменений.

ПРАВИЛА:
- Верни ТОЛЬКО полный HTML-код с внесёнными правками, без объяснений и markdown
- Начинай сразу с <!DOCTYPE html>
- Не меняй то, о чём пользователь не просил
- Если это мини-сайт (есть data-page атрибуты) — сохраняй структуру страниц и JS-роутер
- Если просят поменять цвет — меняй через CSS-переменные (:root) или все вхождения
- Если просят добавить блок — добавляй в логичное место на нужной странице
- Сохраняй все встроенные стили, шрифты, адаптивность"""
            ai_messages = [{"role": "user", "content": f"Вот текущий HTML:\n\n{html}\n\nЧто нужно изменить: {refine_task}"}]
            max_tokens = 5000
        elif mode == "style":
            system = SYSTEM_STYLE_PREMIUM
            ai_messages = [{"role": "user", "content": f"Вот HTML-скелет для стилизации:\n\n{html}"}]
            max_tokens = 3500
        elif mode == "generate":
            if is_multipage:
                system = SYSTEM_GENERATE_MULTIPAGE
                max_tokens = 5000
            elif is_premium:
                system = SYSTEM_GENERATE_PREMIUM  # этап 1: только скелет
                max_tokens = 2500
            else:
                system = SYSTEM_GENERATE_BUDGET
                max_tokens = 4500
            ai_messages = messages
        else:
            if is_multipage:
                system = SYSTEM_CHAT_MULTIPAGE
            elif is_premium:
                system = SYSTEM_CHAT_PREMIUM
            else:
                system = SYSTEM_CHAT_BUDGET
            ai_messages = messages
            max_tokens = 700

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
            return err(str(e), 502)

        return ok({"reply": reply, "mode": mode, "landingType": landing_type})

    finally:
        conn.close()