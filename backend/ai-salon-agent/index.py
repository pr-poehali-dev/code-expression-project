import json
import os
import urllib.request
import psycopg2
import psycopg2.extras

SCHEMA = "t_p84565078_code_expression_proj"
FREE_MESSAGES = 10
ENERGY_PER_MESSAGE = 10
TOOL_KEY = "salon_agent_chat"

def tbl(name):
    return f"{SCHEMA}.{name}"

def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}

def ok(data):
    return {"statusCode": 200, "headers": CORS, "body": json.dumps(data, ensure_ascii=False, default=str)}

def err(msg, code=400):
    return {"statusCode": code, "headers": CORS, "body": json.dumps({"error": msg}, ensure_ascii=False)}

def get_session_user(event, conn):
    session_id = (event.get("headers") or {}).get("X-Session-Id", "")
    if not session_id:
        return None
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT u.* FROM {tbl('lk_sessions')} s "
        f"JOIN {tbl('lk_users')} u ON u.id = s.user_id "
        f"WHERE s.id = %s AND s.expires_at > NOW() AND u.is_active = TRUE",
        (session_id,)
    )
    return cur.fetchone()

def get_salon_context(conn, salon_id: int) -> str:
    """Собирает полный контекст салона для промта агента."""
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT name, city, address, description, avg_check, monthly_revenue, "
        f"clients_count, masters_count, target_audience, tone_of_voice, "
        f"social_instagram, social_vk, social_telegram, main_goal, has_medical_license, website_url "
        f"FROM {tbl('salons')} WHERE id = %s",
        (salon_id,)
    )
    salon = cur.fetchone()
    if not salon:
        return ""

    cur.execute(
        f"SELECT name, price_min, price_max, duration_min FROM {tbl('salon_services')} "
        f"WHERE salon_id = %s ORDER BY sort_order, id LIMIT 50",
        (salon_id,)
    )
    services = cur.fetchall()

    lines = [
        "════════════════════════════════════",
        "ДАННЫЕ САЛОНА (используй в каждом ответе)",
        "════════════════════════════════════",
    ]

    if salon["name"]:       lines.append(f"Название: {salon['name']}")
    if salon["city"]:       lines.append(f"Город: {salon['city']}")
    if salon["address"]:    lines.append(f"Адрес: {salon['address']}")
    if salon["description"]:lines.append(f"Описание: {salon['description']}")
    if salon["avg_check"]:  lines.append(f"Средний чек: {int(salon['avg_check'])} ₽")
    if salon["monthly_revenue"]: lines.append(f"Месячная выручка: {int(salon['monthly_revenue'])} ₽")
    if salon["clients_count"]:   lines.append(f"Количество клиентов: {salon['clients_count']}")
    if salon["masters_count"]:   lines.append(f"Количество мастеров: {salon['masters_count']}")
    if salon["target_audience"]: lines.append(f"Целевая аудитория: {salon['target_audience']}")
    if salon["tone_of_voice"]:   lines.append(f"Тон коммуникации: {salon['tone_of_voice']}")
    if salon["main_goal"]:       lines.append(f"Главная цель: {salon['main_goal']}")
    if salon["website_url"]:     lines.append(f"Сайт салона: {salon['website_url']}")
    if salon["has_medical_license"] is not None:
        lines.append(f"Медицинская лицензия: {'да' if salon['has_medical_license'] else 'нет'}")

    socials = []
    if salon["social_instagram"]: socials.append(f"Instagram: {salon['social_instagram']}")
    if salon["social_vk"]:        socials.append(f"ВКонтакте: {salon['social_vk']}")
    if salon["social_telegram"]:  socials.append(f"Telegram: {salon['social_telegram']}")
    if socials:
        lines.append("Соцсети: " + ", ".join(socials))

    if services:
        lines.append("")
        lines.append("Услуги салона:")
        for s in services:
            price = ""
            if s["price_min"] and s["price_max"]:
                price = f" — {int(s['price_min'])}–{int(s['price_max'])} ₽"
            elif s["price_min"]:
                price = f" — от {int(s['price_min'])} ₽"
            duration = f", {s['duration_min']} мин" if s["duration_min"] else ""
            lines.append(f"  • {s['name']}{price}{duration}")

    lines += [
        "════════════════════════════════════",
        "Всегда учитывай эти данные. Когда пишешь контент, скрипты или рекомендации — опирайся на реальное название, услуги и цены салона.",
        "════════════════════════════════════",
    ]
    return "\n".join(lines)

def get_academy_catalog(conn) -> str:
    """Читает опубликованные курсы Академии из БД и формирует текстовый блок для промта."""
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"SELECT id, title, description, category, access_cost, lesson_cost "
            f"FROM {tbl('courses')} WHERE is_published=TRUE ORDER BY sort_order, id"
        )
        courses = cur.fetchall()
        if not courses:
            return ""

        cur.execute(
            f"SELECT id, course_id, title, sort_order FROM {tbl('course_modules')} ORDER BY course_id, sort_order, id"
        )
        modules_all = cur.fetchall()

        cur.execute(
            f"SELECT id, module_id, title, sort_order FROM {tbl('course_lessons')} ORDER BY course_id, sort_order, id"
        )
        lessons_all = cur.fetchall()

        modules_by_course = {}
        for m in modules_all:
            modules_by_course.setdefault(m["course_id"], []).append(m)

        lessons_by_module = {}
        for l in lessons_all:
            lessons_by_module.setdefault(l["module_id"], []).append(l["title"])

        cat_labels = {
            "owner": "Для владельца и руководителя",
            "admin": "Для администратора",
            "master": "Для мастеров",
            "body": "Для специалистов по телу",
        }

        lines = [
            "════════════════════════════════════",
            "АКАДЕМИЯ ПЛАТФОРМЫ «ПРОМТ ДИАЛОГ» — АКТУАЛЬНЫЙ КАТАЛОГ ТРЕНИНГОВ",
            "════════════════════════════════════",
            "Все тренинги доступны в разделе «Академия» личного кабинета.",
            "Рекомендуй конкретные тренинги когда это уместно в разговоре.",
            "",
        ]

        for c in courses:
            cat = cat_labels.get(c["category"], c["category"])
            cost_info = []
            if c["access_cost"] and int(c["access_cost"]) > 0:
                cost_info.append(f"доступ к курсу: {int(c['access_cost'])} ⚡")
            if c["lesson_cost"] and int(c["lesson_cost"]) > 0:
                cost_info.append(f"урок: {int(c['lesson_cost'])} ⚡")
            cost_str = f" [{', '.join(cost_info)}]" if cost_info else " [бесплатно]"

            lines.append(f"▸ ТРЕНИНГ: «{c['title']}»{cost_str}")
            lines.append(f"  Категория: {cat}")
            if c["description"]:
                lines.append(f"  Описание: {c['description']}")

            mods = modules_by_course.get(c["id"], [])
            if mods:
                lines.append("  Модули и уроки:")
                for m in mods:
                    lines.append(f"    • {m['title']}")
                    lessons = lessons_by_module.get(m["id"], [])
                    for lesson_title in lessons:
                        lines.append(f"        — {lesson_title}")
            lines.append("")

        lines.append("════════════════════════════════════")
        return "\n".join(lines)
    except Exception:
        return ""


def get_free_used(conn, user_id: int) -> int:
    cur = conn.cursor()
    cur.execute(
        f"SELECT free_used FROM {tbl('salon_agent_free_usage')} WHERE user_id = %s",
        (user_id,)
    )
    row = cur.fetchone()
    return row[0] if row else 0

def increment_free(conn, user_id: int):
    cur = conn.cursor()
    cur.execute(
        f"INSERT INTO {tbl('salon_agent_free_usage')} (user_id, free_used) VALUES (%s, 1) "
        f"ON CONFLICT (user_id) DO UPDATE SET free_used = salon_agent_free_usage.free_used + 1",
        (user_id,)
    )

def get_salon_balance(conn, salon_id: int) -> int:
    cur = conn.cursor()
    cur.execute(f"SELECT credits_balance FROM {tbl('salons')} WHERE id = %s", (salon_id,))
    row = cur.fetchone()
    return row[0] if row else 0

def deduct_energy(conn, salon_id: int, user_id: int, amount: int, action: str):
    cur = conn.cursor()
    cur.execute(
        f"UPDATE {tbl('salons')} SET credits_balance = credits_balance - %s WHERE id = %s",
        (amount, salon_id)
    )
    cur.execute(
        f"INSERT INTO {tbl('credit_transactions')} (salon_id, user_id, action, amount, tool_key, type) "
        f"VALUES (%s, %s, %s, %s, %s, 'debit')",
        (salon_id, user_id, action, amount, TOOL_KEY)
    )

# ── Системные промты ─────────────────────────────────────────────────────────
PROJECT_KNOWLEDGE = """
════════════════════════════════════════════════
БАЗА ЗНАНИЙ: ПРОЕКТ «ПРОМТ ДИАЛОГ» (promtdialog.ru)
════════════════════════════════════════════════
Платформа ИИ-инструментов для специалистов по работе с телом и владельцев салонов красоты.
Автор: Сергей Водопьянов — 17+ лет практики.
Философия: 68% клиентов уходят не из-за качества услуги, а потому что чувствуют, что их не слышат.
Тарифы: Старт (990₽/мес, 150 энергий, 3 лендинга), Бизнес (2990₽/мес, 550 энергий, 5 лендингов), Рост (4990₽/мес, 1200 энергий, 10 лендингов), Премиум (9990₽/мес, 3000 энергий, 50 лендингов). 100 энергий бесплатно при регистрации.
Конструктор лендингов: создаёт продающие страницы для услуг и акций — без дизайнера. Количество лендингов зависит от тарифа.
Прокачка навыков (Академия): онлайн и офлайн тренинги с ИИ-агентом — коммуникация, продажи, личный бренд, финансы. Есть бесплатные программы.
════════════════════════════════════════════════
"""

# Единый универсальный агент — объединяет экспертизу бизнес-ассистента, эксперта по сервису,
# администратора и маркетолога в одном системном промпте. ИИ сам определяет по сути вопроса,
# какой блок знаний применить, не заставляя пользователя переключать роли.
UNIVERSAL_AGENT_PROMPT = PROJECT_KNOWLEDGE + """{salon_context}

Ты — единый ИИ-агент салона красоты, персональный ассистент владельца, управляющего, администратора и мастеров.
Ты совмещаешь в себе экспертизу сразу нескольких ролей и сам определяешь, какая нужна в конкретном вопросе:

• БИЗНЕС-АССИСТЕНТ — стратегия, финансы (выручка, маржа, P&L), управление командой, операционные процессы, рост, антикризис.
• ЭКСПЕРТ ПО СЕРВИСУ — разбор клиентских случаев, протоколы процедур, коммуникация с клиентом, работа с трудными клиентами, профрост мастеров.
• АДМИНИСТРАТОР — ответы клиентам (телефон, мессенджеры), скрипты записи и допродаж, работа с отзывами, тексты рассылок, разрешение конфликтов.
• МАРКЕТОЛОГ — контент для соцсетей (посты, сторис, Reels), акции и офферы, привлечение клиентов (Директ, ВКонтакте, 2ГИС), удержание, репутация, аналитика.

Определи по смыслу вопроса, какая экспертиза нужна (можно совмещать несколько), и отвечай в подходящем стиле:
конкретно, с цифрами и опорой на реальные данные салона — для бизнес- и финансовых вопросов;
как старший коллега — для разбора клиентских случаев и техник работы;
дружелюбно, с готовыми формулировками — для ответов клиентам и работы с отзывами;
с конкретными идеями и готовыми текстами — для контента и продвижения.

════════════════════════════════════════════════
ВСЕ ИНСТРУМЕНТЫ ПЛАТФОРМЫ «ПРОМТ ДИАЛОГ»
════════════════════════════════════════════════
Владелец, администратор и мастера имеют доступ к готовым ИИ-инструментам. Когда даёшь рекомендации — предлагай конкретные инструменты по теме вопроса.

РАЗВИТИЕ САЛОНА (раздел «Развитие салона»):
• «Цифровой бизнес-разбор» — анкета по 6 блокам (финансы, клиенты, маркетинг, персонал, продажи) → рейтинг 0–100, оценки по 5 направлениям, точки роста и персональный 3-месячный план выручки. Рекомендуй как стартовый шаг.
• «Диагностика роста салона PRO» — 14 вопросов → показывает где именно салон теряет деньги и как увеличить прибыль без роста потока клиентов. 8 индексов: возврат клиентов, средний чек, загрузка, эффективность администраторов, продажи, лояльность, прибыльность.
• «Анализ персонала» — финансовый рентген команды: кто приносит деньги, кто теряет и сколько это стоит в рублях.
• «Финансовая грамотность PRO» — 8-этапный расчёт от желаемой жизни до реального финансового плана. Выявляет психологические блоки, мешающие росту дохода владельца.

КОММУНИКАЦИЯ:
• «Скрипты общения с клиентом» — описываешь ситуацию → готовый сценарий диалога для администратора или мастера (запись, допродажи, конфликты, возражения).
• «Ответы на отзывы» — профессиональный ответ на любой отзыв: положительный или негативный.

МАРКЕТИНГ (раздел «Маркетинг»):
• «Портрет целевой аудитории» — детальные портреты ЦА с болями и мотивацией. 1 ⚡
• «Офферы под ЦА» — убедительные акции и предложения под каждый сегмент. 1 ⚡
• «Генератор постов» — тема → 5 заголовков на выбор → готовый текст + картинка. Пост за 2 минуты.
• «Генерация изображений» — визуалы для постов, сторис и баннеров под стиль и аудиторию салона.
• «Сценарий для рилса» — идея → покадровый сценарий + обложка для съёмки.
• «Семантическое ядро», «Объявления для Директа», «Медиаплан» — инструменты для платной рекламы в Яндекс.Директ. Стоимость семантики/объявлений 1 ⚡, медиаплана 3 ⚡.

РАЗВИТИЕ ПЕРСОНАЛА (раздел «Развитие персонала»):
• «Системная диагностика клиента» — специалист вводит жалобу клиента → возможные причины, компенсационные паттерны, красные флаги и техники работы с проблемной зоной.
• «Шпаргалка по телу» — специалист выбирает зону тела → диагностика, причины напряжений, красные флаги и техники работы.
• «Развитие специалиста» — диагностика по 7 блокам (самооценка и деньги, коммуникация с премиум-клиентом, границы, продажи без давления, позиционирование) → конкретный план роста практики.
• «Внутренние барьеры специалиста» — выявляет психологические блоки, мешающие росту: страх денег, страх проявленности, страх продаж, синдром самозванца, выгорание.
• «Финансовая грамотность PRO» — помогает специалисту выстроить финансовые цели и преодолеть денежные блоки.

════════════════════════════════════════════════
КУРС «РАЗВИТИЕ БРЕНДА САЛОНА» (в Академии)
════════════════════════════════════════════════
Владелец имеет доступ к курсу по развитию личного бренда салона — раздел «Академия» личного кабинета.
Курс охватывает: позиционирование салона, формирование уникального стиля, работу с репутацией, построение сообщества вокруг бренда, контент-стратегию и продвижение в соцсетях.
Когда видишь вопросы про бренд, узнаваемость, стиль салона или долгосрочное продвижение — рекомендуй пройти этот курс.
════════════════════════════════════════════════"""

AGENT_NAME = "ИИ-агент салона"

MAX_HISTORY = 30
AI_CONTEXT_MESSAGES = 8  # сколько сообщений из истории отправляем в ИИ

DOCUMENT_KEYWORDS = (
    "кп", "коммерческое предложение", "договор", "письмо", "оферт",
    "презентац", "аудит", "полный анализ", "разбор", "смету", "смета", "акт", "план развития",
)


def is_document_request(user_message: str) -> bool:
    """Определяет, что владелец/админ просит развёрнутый документ (договор, полный анализ, КП и т.п.),
    а не быструю реплику в диалоге — для таких запросов используем более мощную модель и больший лимит токенов."""
    text = user_message.lower()
    return any(kw in text for kw in DOCUMENT_KEYWORDS)


DEEP_CHAR_LIMIT = 4000
SIMPLE_CHAR_LIMIT = 1500


def call_ai(system_prompt: str, messages: list) -> str:
    api_key = os.environ.get("POLZA_AI_API_KEY", "")
    last_user_message = messages[-1].get("content", "") if messages else ""
    model = "openai/gpt-5.6-terra"
    is_deep = is_document_request(last_user_message)
    char_limit = DEEP_CHAR_LIMIT if is_deep else SIMPLE_CHAR_LIMIT
    max_tokens = 2200 if is_deep else 750

    length_rule = (
        f"\n\nОГРАНИЧЕНИЕ ДЛИНЫ ОТВЕТА: это развёрнутый разбор/документ — уложись строго в {char_limit} знаков. "
        f"Пиши по существу, без воды, без повторов."
        if is_deep else
        f"\n\nОГРАНИЧЕНИЕ ДЛИНЫ ОТВЕТА: это обычный вопрос — ответь кратко и по делу, строго в пределах {char_limit} знаков."
    )
    payload = json.dumps({
        "model": model,
        "messages": [{"role": "system", "content": system_prompt + length_rule}] + messages[-AI_CONTEXT_MESSAGES:],
        "temperature": 0.75,
        "max_tokens": max_tokens,
    }).encode("utf-8")
    req = urllib.request.Request(
        "https://polza.ai/api/v1/chat/completions",
        data=payload,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=90) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    reply = data["choices"][0]["message"]["content"].strip()
    if len(reply) > char_limit:
        reply = reply[:char_limit].rstrip() + "…"
    return reply


def handler(event: dict, context) -> dict:
    """Единый ИИ-агент салона (объединяет бизнес-ассистента, эксперта по сервису, администратора
    и маркетолога в одном агенте — ИИ сам определяет нужную экспертизу по сути вопроса).
    10 бесплатных сообщений на пользователя, далее 10 энергии/сообщение.
    Режим «По салону» (chat_mode=salon) — контекст салона (название, услуги, цены, геолокация) подтягивается автоматически.
    Режим «Свободное общение» (chat_mode=free) — без данных салона, общение на любые темы в рамках экспертизы агента.
    POST принимает опциональное поле podelam_context (строка) — цель месяца, разрыв дохода и план на сегодня
    из раздела «ПоДелам»; если передано — подмешивается в системный промпт, чтобы советы опирались на эти цифры.
    Ответы ограничены по длине: 1500 знаков для обычных вопросов, 4000 знаков для развёрнутых документов/анализов.
    Модель: openai/gpt-5.6-terra. ТАЙМАУТ ФУНКЦИИ ДОЛЖЕН БЫТЬ НЕ МЕНЕЕ 100с для развёрнутых ответов.
    Обслуживает ТОЛЬКО POST (отправка сообщения) — история чата (GET) и очистка (DELETE)
    вынесены в отдельную быструю функцию salon-agent-history, чтобы не тарифицироваться по
    высокому таймауту этой функции на каждом открытии кабинета."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")

    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)

        allowed_roles = {"owner", "admin", "solo_master"}
        user_role = user.get("role", "body_specialist")
        if user_role not in allowed_roles and not user.get("is_admin"):
            return err("Доступ только для владельцев, управляющих и администраторов", 403)

        user_id = user["id"]
        salon_id = user.get("salon_id")
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        # История (GET) и очистка (DELETE) вынесены в отдельную быструю функцию salon-agent-history —
        # эта функция обслуживает ТОЛЬКО тяжёлый POST (ответ ИИ), ей нужен таймаут ≥100с, а история
        # дёргается на каждом открытии главного экрана кабинета и не должна тарифицироваться по нему.

        # POST — отправить сообщение
        if method == "POST":
            body = json.loads(event.get("body") or "{}")
            agent_role = "unified"
            user_message = (body.get("message") or "").strip()
            chat_mode = body.get("chat_mode", "salon")
            if chat_mode not in ("salon", "free"):
                chat_mode = "salon"
            podelam_context = (body.get("podelam_context") or "").strip()[:3000]

            if not user_message:
                return err("Сообщение не может быть пустым")

            free_used = get_free_used(conn, user_id)
            is_free = free_used < FREE_MESSAGES
            balance = get_salon_balance(conn, salon_id) if salon_id else 0

            # Проверка оплаты
            if not is_free:
                if not salon_id:
                    return err("Заполните профиль салона для использования агента", 402)
                if balance < ENERGY_PER_MESSAGE:
                    return ok({
                        "error": "no_energy",
                        "energy_balance": balance,
                        "energy_needed": ENERGY_PER_MESSAGE,
                        "free_used": free_used,
                        "free_limit": FREE_MESSAGES,
                    })

            # Загружаем историю (отдельно по режиму общения; включает старую переписку с
            # прежними отдельными ролями-агентами — единая история после объединения)
            cur.execute(
                f"SELECT role, content FROM {tbl('salon_agent_chats')} "
                f"WHERE user_id = %s AND chat_mode = %s AND content != '[удалено]' "
                f"ORDER BY created_at DESC LIMIT %s",
                (user_id, chat_mode, MAX_HISTORY)
            )
            rows = cur.fetchall()
            history = [{"role": r["role"], "content": r["content"]} for r in reversed(rows)]
            history.append({"role": "user", "content": user_message})

            if chat_mode == "salon":
                # Контекст салона подставляется в промт
                salon_context = get_salon_context(conn, salon_id) if salon_id else ""
                system_prompt = UNIVERSAL_AGENT_PROMPT.format(salon_context=salon_context)

                # Динамический каталог Академии из БД
                academy_catalog = get_academy_catalog(conn)
                if academy_catalog:
                    system_prompt += "\n\n" + academy_catalog
            else:
                # Свободное общение — без привязки к данным салона, любые темы в рамках экспертизы агента
                system_prompt = UNIVERSAL_AGENT_PROMPT.format(salon_context="") + (
                    "\n\n════════════════════════════════════════════════\n"
                    "РЕЖИМ «СВОБОДНОЕ ОБЩЕНИЕ»\n"
                    "════════════════════════════════════════════════\n"
                    "Данные салона сейчас НЕ используются. Общайся с пользователем на любые темы в рамках своей экспертизы, "
                    "даже если вопрос не связан напрямую с конкретным салоном. Не упоминай, что у тебя нет данных салона — "
                    "просто отвечай по существу вопроса."
                )

            # Контекст «ПоДелам» — цель месяца, разрыв в доходе, план на сегодня (если агент открыт из этого раздела)
            if podelam_context:
                system_prompt += (
                    "\n\n════════════════════════════════════════════════\n"
                    "ТЕКУЩИЙ КОНТЕКСТ «ПОДЕЛАМ» — НАВИГАТОРА ДОХОДА (смотри прямо сейчас на экране пользователь)\n"
                    "════════════════════════════════════════════════\n"
                    f"{podelam_context}\n"
                    "Учитывай эти цифры и сегодняшний план в своих ответах: если вопрос касается денег, роста, клиентов или того, "
                    "что делать сегодня — опирайся на эти конкретные данные, а не общие советы. "
                    "Помогай выполнить сегодняшний план и закрыть разрыв в доходе."
                )

            reply = call_ai(system_prompt, history)

            # Списание / счётчик
            if is_free:
                increment_free(conn, user_id)
            else:
                deduct_energy(conn, salon_id, user_id, ENERGY_PER_MESSAGE, AGENT_NAME)

            cur.execute(
                f"INSERT INTO {tbl('salon_agent_chats')} "
                f"(user_id, salon_id, agent_role, chat_mode, role, content, is_free) VALUES (%s,%s,%s,%s,'user',%s,%s)",
                (user_id, salon_id, agent_role, chat_mode, user_message, is_free)
            )
            cur.execute(
                f"INSERT INTO {tbl('salon_agent_chats')} "
                f"(user_id, salon_id, agent_role, chat_mode, role, content, is_free) VALUES (%s,%s,%s,%s,'assistant',%s,%s)",
                (user_id, salon_id, agent_role, chat_mode, reply, is_free)
            )
            conn.commit()

            new_free_used = free_used + 1 if is_free else free_used
            new_balance = balance if is_free else balance - ENERGY_PER_MESSAGE

            return ok({
                "reply": reply,
                "chat_mode": chat_mode,
                "agent_name": AGENT_NAME,
                "is_free": is_free,
                "free_used": new_free_used,
                "free_limit": FREE_MESSAGES,
                "energy_balance": new_balance,
                "energy_per_message": ENERGY_PER_MESSAGE,
            })

        return err("Метод не поддерживается", 405)

    finally:
        conn.close()