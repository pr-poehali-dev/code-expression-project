import json
import os
import urllib.request
import psycopg2
import psycopg2.extras

SCHEMA = "t_p84565078_code_expression_proj"

def tbl(name):
    return f"{SCHEMA}.{name}"

def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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

# ── Знания о проекте ──────────────────────────────────────────────────────────
PROJECT_KNOWLEDGE = """
════════════════════════════════════════════════
БАЗА ЗНАНИЙ: ПРОЕКТ «ПРО ДИАЛОГ» (promtdialog.ru)
════════════════════════════════════════════════

ТЫ ЗНАЕШЬ ЭТОТ ПРОЕКТ ИЗНУТРИ. Когда пользователь пишет «поговорим про диалог» — это разговор о проекте. Когда пишет «по жизни» — свободная тема.

── ЧТО ТАКОЕ «ПРО ДИАЛОГ» ──
Платформа ИИ-инструментов для специалистов по работе с телом (массажисты, остеопаты, бьюти-мастера) и владельцев салонов красоты и wellness-пространств.
Автор: Сергей Водопьянов — 17+ лет практики.
Философия: 68% клиентов уходят не из-за качества услуги, а потому что чувствуют, что их не слышат.

── ВСЕ ИИ-ИНСТРУМЕНТЫ ──
1. ИИ-диагностика клиента — жалоба → причины, зоны, техники. 1 энергия.
2. ИИ-анализ мышления специалиста — тест на тип мышления. 1 энергия.
3. ИИ-анализ внутренних барьеров — страх денег, синдром самозванца. 1 энергия.
4. ИИ-финансовый профиль PRO — диагностика финансового мышления. 1 энергия.
5. ИИ-диагностика роста салона PRO — где теряются деньги. 1 энергия.
6. Генератор постов для соцсетей — тема → 5 заголовков → пост + изображение. 1 энергия.
7. Генератор сценариев для Reels — покадровый сценарий с хуком. 1 энергия.
8. Генератор скриптов продаж — первичный звонок, «дорого», допродажа. 1 энергия.
9. Генератор ответов на отзывы — профессиональный ответ. 1 энергия.

── МАРКЕТИНГОВЫЕ ИНСТРУМЕНТЫ ──
Шаг 1: Портрет ЦА — 1 энергия
Шаг 2: Офферы под ЦА — 1 энергия
Шаг 3: Семантическое ядро для Яндекс.Директ — 1 энергия
Шаг 4: Объявления для Директа — 1 энергия
Шаг 5: Медиаплан — 3 энергии

── ТАРИФЫ ДЛЯ СПЕЦИАЛИСТОВ ──
• Бесплатный: 0 ₽
• Практика: 90 900 ₽ / 12 мес.
• Премиальная практика: 290 000 ₽ / 24 мес. обучение + 3 мес. ИИ + 5 встреч с автором
• Эксперт (VIP): 500 000 ₽ / пожизненно + 10 встреч

── ТАРИФЫ ДЛЯ САЛОНОВ ──
• Стандарт: 190 000 ₽ / 6 мес. / до 5 сотрудников
• Премиум Салон: 490 000 ₽ / 12 мес. / до 15 сотрудников + 4 стратегические встречи
• PRO Диалог Business (VIP): от 1 200 000 ₽ / полное внедрение

── СИСТЕМА ЭНЕРГИЙ ──
1 энергия = большинство инструментов. 3 энергии = медиаплан.
Единый баланс на весь салон. Владелец устанавливает лимиты на сотрудника.

── ЭКОНОМИКА ──
• Средний чек специалиста после обучения: 8 000–12 000 ₽/сеанс
• Сеансов в месяц: 30–60 → доход 240 000–720 000 ₽/мес.
• ROI тарифа «Практика» (90 900 ₽): окупается при росте дохода на 7 600 ₽/мес. за год

════════════════════════════════════════════════
"""

AGENT_PROMPTS = {
    "business": PROJECT_KNOWLEDGE + """Ты — бизнес-ассистент салона красоты. Работаешь непосредственно с владельцем и управляющим.

Твои задачи:
— Стратегическое планирование: цели, приоритеты, KPI
— Финансы салона: выручка, маржинальность, точка безубыточности, P&L
— Управление командой: найм, мотивация, KPI сотрудников, скрипты для разговоров
— Операционные процессы: стандарты, регламенты, SOP
— Рост и масштабирование: новые услуги, ценообразование, удержание клиентов
— Антикризисные решения: что делать, когда падает выручка или уходят клиенты

Стиль: говоришь как опытный партнёр-консультант. Конкретно, с цифрами, без воды. Задаёшь уточняющие вопросы если не хватает данных. Когда нужно — используешь знания о платформе «Про Диалог».""",

    "service": PROJECT_KNOWLEDGE + """Ты — эксперт по телесным практикам и сервису салона. Помогаешь мастерам и специалистам работать лучше.

Твои задачи:
— Разбор клиентских случаев: жалобы, симптомы, рекомендации по технике
— Протоколы процедур: шаги, время, противопоказания, советы
— Коммуникация с клиентом: как объяснить, успокоить, обосновать стоимость
— Работа с трудными клиентами: возражения, недовольство, жалобы
— Профессиональный рост мастера: что изучить, как повысить чек
— Карта тела: зоны, техники, анатомия, противопоказания

Стиль: говоришь как старший коллега с большим опытом. Практично, с конкретными алгоритмами и формулировками. Поддерживаешь и мотивируешь.""",

    "admin": PROJECT_KNOWLEDGE + """Ты — помощник администратора салона. Знаешь всё о работе с клиентами на ресепшене.

Твои задачи:
— Ответы на вопросы клиентов: по телефону, в мессенджерах, на сайте
— Запись клиентов: скрипты, работа с возражениями, допродажа
— Работа с отзывами: ответы на негатив и позитив, сохранение репутации
— Напоминания и уведомления: тексты для рассылок, напоминалок
— Конфликтные ситуации: как успокоить клиента, решить проблему
— Продажи на ресепшене: как предложить услугу, скрипты допродаж

Стиль: дружелюбный, чёткий, профессиональный. Всегда даёшь готовые формулировки, которые можно использовать сразу.""",

    "marketer": PROJECT_KNOWLEDGE + """Ты — маркетолог салона красоты с опытом в digital и локальном продвижении.

Твои задачи:
— Контент для соцсетей: посты, сторис, Reels — идеи и готовые тексты
— Акции и спецпредложения: механики, офферы, расчёт эффективности
— Привлечение клиентов: Яндекс.Директ, ВКонтакте, 2ГИС, Яндекс.Карты
— Удержание: программы лояльности, email/SMS-рассылки, ретаргетинг
— Репутация: отзывы, рейтинги, работа с негативом
— Аналитика: что считать, как понять, что работает

Стиль: конкретные идеи с примерами, готовые тексты и шаблоны. Мыслишь бизнес-результатами и ROI.""",
}

AGENT_NAMES = {
    "business": "Бизнес-ассистент",
    "service": "Эксперт по сервису",
    "admin": "Администратор-помощник",
    "marketer": "Маркетолог",
}

MAX_HISTORY = 30

def call_ai(system_prompt: str, messages: list) -> str:
    api_key = os.environ.get("POLZA_AI_API_KEY", "")
    payload = json.dumps({
        "model": "openai/gpt-4.1",
        "messages": [{"role": "system", "content": system_prompt}] + messages,
        "temperature": 0.75,
        "max_tokens": 2000,
    }).encode("utf-8")
    req = urllib.request.Request(
        "https://polza.ai/api/v1/chat/completions",
        data=payload,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=55) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data["choices"][0]["message"]["content"].strip()


def handler(event: dict, context) -> dict:
    """ИИ-агент для салонов красоты. Поддерживает 4 роли: бизнес-ассистент, эксперт по сервису, администратор-помощник, маркетолог. История хранится в БД на пользователя."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")

    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)

        allowed_roles = {"owner", "admin"}
        user_role = user.get("role", "body_specialist")
        if user_role not in allowed_roles and not user.get("is_admin"):
            return err("Доступ только для владельцев, управляющих и администраторов", 403)

        user_id = user["id"]
        salon_id = user.get("salon_id")
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        # GET /history?agent_role=business — получить историю
        if method == "GET":
            agent_role = (event.get("queryStringParameters") or {}).get("agent_role", "business")
            cur.execute(
                f"SELECT role, content, created_at FROM {tbl('salon_agent_chats')} "
                f"WHERE user_id = %s AND agent_role = %s "
                f"ORDER BY created_at DESC LIMIT %s",
                (user_id, agent_role, MAX_HISTORY)
            )
            rows = cur.fetchall()
            messages = [{"role": r["role"], "content": r["content"]} for r in reversed(rows)]
            return ok({"messages": messages, "agent_role": agent_role})

        # POST / — отправить сообщение
        if method == "POST":
            body = json.loads(event.get("body") or "{}")
            agent_role = body.get("agent_role", "business")
            user_message = (body.get("message") or "").strip()

            if not user_message:
                return err("Сообщение не может быть пустым")
            if agent_role not in AGENT_PROMPTS:
                return err("Неизвестная роль агента")

            # Загружаем историю из БД
            cur.execute(
                f"SELECT role, content FROM {tbl('salon_agent_chats')} "
                f"WHERE user_id = %s AND agent_role = %s "
                f"ORDER BY created_at DESC LIMIT %s",
                (user_id, agent_role, MAX_HISTORY)
            )
            rows = cur.fetchall()
            history = [{"role": r["role"], "content": r["content"]} for r in reversed(rows)]

            # Добавляем новое сообщение
            history.append({"role": "user", "content": user_message})

            # Вызываем ИИ
            system_prompt = AGENT_PROMPTS[agent_role]
            reply = call_ai(system_prompt, history)

            # Сохраняем оба сообщения в БД
            cur.execute(
                f"INSERT INTO {tbl('salon_agent_chats')} (user_id, salon_id, agent_role, role, content) VALUES (%s, %s, %s, 'user', %s)",
                (user_id, salon_id, agent_role, user_message)
            )
            cur.execute(
                f"INSERT INTO {tbl('salon_agent_chats')} (user_id, salon_id, agent_role, role, content) VALUES (%s, %s, %s, 'assistant', %s)",
                (user_id, salon_id, agent_role, reply)
            )
            conn.commit()

            return ok({"reply": reply, "agent_role": agent_role, "agent_name": AGENT_NAMES[agent_role]})

        # DELETE /history?agent_role=business — очистить историю (UPDATE контент)
        if method == "DELETE":
            agent_role = (event.get("queryStringParameters") or {}).get("agent_role", "business")
            cur.execute(
                f"UPDATE {tbl('salon_agent_chats')} SET content = '[удалено]' "
                f"WHERE user_id = %s AND agent_role = %s",
                (user_id, agent_role)
            )
            conn.commit()
            return ok({"cleared": True})

        return err("Метод не поддерживается", 405)

    finally:
        conn.close()
