"""
Начисление партнёрского вознаграждения мастерам + «ПоДелам» -- ИИ-навигатор дохода в личном кабинете.
Начисление мастерам ТОЛЬКО при реальной покупке энергии через ЮКассу.
Ручное пополнение и бонусы — не считаются.
Формула: 10% от количества энергий = рубли (100 энергий → 10 ₽).
GET  ?action=podelam_get           — профиль дохода + план на сегодня, план строит ИИ (модель terra через polza.ai) (X-Session-Id).
                                       Для владельцев/администраторов салона с заполненным «Мой салон» (указаны средний чек и
                                       выручка) дополнительно подмешиваются реальные данные салона и сотрудников (salon_staff),
                                       с ротацией фокус-сотрудника по дням — сегодня один специалист, завтра другой. Пока «Мой
                                       салон» не заполнен — план строится по карточке диагностики ПоДелам (как раньше), а в ответе
                                       флаг salon_profile_filled=false — фронт показывает напоминание заполнить профиль салона.
                                       Построение НОВОГО плана на день платное — списывается ОДИН РАЗ В СУТКИ с баланса салона:
                                       3 энергии для владельца/администратора, 1 энергия для мастера/специалиста. Если энергии не
                                       хватает — план не строится, ответ содержит energy_insufficient=true. Все доп. данные читаются
                                       ТОЛЬКО при первой генерации плана за сутки (кэш в podelam_daily_plans), повторные заходы в
                                       этот же день — без единого запроса к ИИ, доп. таблицам или повторного списания энергии.
                                       ТАЙМАУТ ФУНКЦИИ ДОЛЖЕН БЫТЬ НЕ МЕНЕЕ 60с — иначе запрос к ИИ обрывается по 504 и план не сохраняется.
POST ?action=podelam_save_profile  — сохранить диагностику дохода (X-Session-Id)
POST ?action=podelam_task_done     — отметить дело выполненным, опционально с фактической суммой (X-Session-Id)
GET  ?action=podelam_stats         — статистика выполненных дел за неделю/месяц (X-Session-Id)
POST ?action=podelam_set_income    — прибавить фактический доход за день (amount, опц. date, mode="add"|"replace") (X-Session-Id)
GET/POST ?action=podelam_notify&key=ADMIN_TOKEN — cron: письмо пользователям с новым планом на сегодня, у кого ещё не отправлено.
                                       ТАЙМАУТ ФУНКЦИИ ДОЛЖЕН БЫТЬ НЕ МЕНЕЕ 60с при большом числе пользователей.
GET/POST ?action=content_daily_post&key=ADMIN_TOKEN — cron: ИИ пишет ежедневный экспертный пост и публикует в блог сайта
                                       (простой INSERT в БД, ничего внешнего). Категория ротируется по кругу marketing →
                                       upsell → clients → tools, а роль читателя — НЕЗАВИСИМО от категории по кругу
                                       owner → admin → master → massage (см. CONTENT_ROLES/CONTENT_ROLE_GUIDANCE) — один
                                       пост пишется строго для одной роли, а не «для всех». ТАЙМАУТ ФУНКЦИИ ДОЛЖЕН БЫТЬ
                                       НЕ МЕНЕЕ 60с.
GET  ?action=content_list          — посты для ленты на сайте с пагинацией (page, limit, category). Полный текст (body)
                                       доступен ВСЕМ читателям, без авторизации. Каждый пост содержит role/role_label
                                       (владелец/администратор/мастер/массажист), под кого он написан. Посты категории
                                       «tools» дополнительно содержат tool_link_* (заметная ссылка на инструмент/курс
                                       Академии, о котором пост) — tool_link_label, tool_link_desc, tool_link_icon,
                                       tool_link_target (куда вести после клика: {"tab": "...", "tool": "..."} или
                                       {"route": "/blog"} и т.п.).
GET  ?action=content_related       — похожие посты той же категории (post_id, category, limit) для блока «Читать дальше».
GET  ?action=comments_list&post_id=N — список комментариев к посту (дерево: комментарий + ответы), включая ответы
                                       Админ Светланы (ИИ, модель gpt-4o-mini через polza.ai), с количеством лайков
                                       (likes_count) и флагом liked_by_me для авторизованного читателя (X-Session-Id опц.).
POST ?action=comment_add           — оставить комментарий к посту (только авторизованным, X-Session-Id). body: post_id,
                                       text, опц. parent_id (ответ на комментарий). Если комментарий — вопрос/обращение
                                       по теме статьи, Админ Светлана отвечает автоматически (без пометки, что это ИИ).
                                       Вопросы не по теме платформы/статьи получают ответ с просьбой обратиться в
                                       техподдержку личного кабинета вместо содержательного ответа.
POST ?action=comment_like          — поставить/снять свой лайк на комментарии (только авторизованным, X-Session-Id).
                                       body: comment_id. Возвращает liked_by_me и итоговый likes_count.
POST / (без action или action=withdraw) — начисления мастерам (X-Master-Session)
GET  / (без action) — история начислений мастера (X-Master-Session)
"""
import base64
import json
import os
import random
import re
import smtplib
import ssl
import time
import urllib.request
import urllib.error
import psycopg2
import psycopg2.extras
from datetime import datetime, timedelta, timezone, date
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
from email.utils import formataddr

SCHEMA = "t_p84565078_code_expression_proj"
REFERRAL_PERCENT = 10
DAYS_HOLD = 30
FROM_EMAIL = "massopro@mail.ru"
SITE_URL = "https://promtdialog.ru"

# ТОЛЬКО реальная оплата через ЮКассу даёт начисление
PAID_ACTIONS = {"Покупка пакета энергии"}

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Master-Session, X-Internal-Key, X-Session-Id",
}


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def ok(data):
    return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps(data, ensure_ascii=False, default=str)}


def err(msg, status=400):
    return {"statusCode": status, "headers": CORS,
            "body": json.dumps({"error": msg}, ensure_ascii=False)}


def get_master_by_session(session_id: str, conn):
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"""SELECT m.* FROM {SCHEMA}.master_sessions s
            JOIN {SCHEMA}.masters m ON m.id = s.master_id
            WHERE s.id = %s AND s.expires_at > NOW() AND m.is_active = TRUE""",
        (session_id,)
    )
    return cur.fetchone()


def get_lk_user_by_session(session_id: str, conn):
    """Пользователь личного кабинета «Промт Диалог» по X-Session-Id (lk_sessions/lk_users)."""
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"""SELECT u.* FROM {SCHEMA}.lk_sessions s JOIN {SCHEMA}.lk_users u ON u.id = s.user_id
            WHERE s.id = %s AND s.expires_at > NOW() AND u.is_active = TRUE""",
        (session_id,)
    )
    return cur.fetchone()


# ── Энергия за построение плана «ПоДелам» ───────────────────────────────────
# Списывается ОДИН РАЗ в сутки — только когда план на день реально строится (первый заход
# после полуночи и после заполнения диагностики), а не при каждом повторном заходе в течение дня.
PODELAM_TOOL_KEY = "podelam_daily_plan"
PODELAM_COST_SALON = 3   # владелец/администратор салона (owner/admin)
PODELAM_COST_MASTER = 1  # мастер-одиночка и остальные роли


def get_salon_balance(conn, salon_id: int) -> int:
    cur = conn.cursor()
    cur.execute(f"SELECT credits_balance FROM {SCHEMA}.salons WHERE id = %s", (salon_id,))
    row = cur.fetchone()
    return row[0] if row else 0


def deduct_podelam_energy(conn, salon_id: int, user_id: int, amount: int):
    cur = conn.cursor()
    cur.execute(
        f"UPDATE {SCHEMA}.salons SET credits_balance = credits_balance - %s WHERE id = %s",
        (amount, salon_id)
    )
    cur.execute(
        f"INSERT INTO {SCHEMA}.credit_transactions (salon_id, user_id, action, amount, tool_key, type) "
        f"VALUES (%s, %s, 'План «ПоДелам» на день', %s, %s, 'debit')",
        (salon_id, user_id, amount, PODELAM_TOOL_KEY)
    )


def is_salon_profile_filled(conn, salon_id: int | None) -> bool:
    """Считаем «Мой салон» заполненным, если указаны ключевые бизнес-показатели
    (средний чек и месячная выручка) — именно они подмешиваются в план ПоДелам."""
    if not salon_id:
        return False
    cur = conn.cursor()
    cur.execute(f"SELECT avg_check, monthly_revenue FROM {SCHEMA}.salons WHERE id = %s", (salon_id,))
    row = cur.fetchone()
    return bool(row and row[0] is not None and row[1] is not None)


# ── «ПоДелам» — навигатор дохода ────────────────────────────────────────────

def extract_service_names(niche: str, addon_text: str, salon_services: list | None = None) -> list[str]:
    """Достаёт реальные названия услуг пользователя из диагностики (ниша + допуслуги) и,
    если есть, из раздела «Мой салон» — чтобы темы контента строились строго вокруг того,
    чем человек реально занимается (психолог, остеопат, массажист и т.д.), а не вокруг
    случайных формулировок про маникюр/кутикулу."""
    names: list[str] = []
    niche = (niche or "").strip()
    if niche and niche.lower() not in ("не указана", "не указан"):
        names.append(niche)
    if salon_services:
        for s in salon_services:
            name = (s.get("name") or "").strip() if isinstance(s, dict) else str(s).strip()
            if name and name.lower() not in [n.lower() for n in names]:
                names.append(name)
    if addon_text:
        # Убираем упоминания цены («8000 рублей», «от 5000 руб.», «15 000 ₽») перед разбивкой на пункты
        cleaned = re.sub(r'[-–—]?\s*\d[\d\s]*\s*(?:руб(?:лей|ль)?|₽|р\.)', '', addon_text, flags=re.IGNORECASE)
        for part in re.split(r'[,;\n]+', cleaned):
            part = part.strip(" .-–—")
            if part and part.lower() not in [n.lower() for n in names]:
                names.append(part)
    if not names:
        names.append("вашу услугу")
    return names[:6]


# Шаблоны тем для контента в fallback-режиме (когда ИИ недоступен) — формат «Услуга: тема»
# работает грамматически корректно для ЛЮБОЙ ниши (психолог, остеопат, маникюр, массаж и т.п.),
# без необходимости склонять название услуги.
FALLBACK_CONTENT_TEMPLATES = [
    "{s}: частый вопрос клиентов — отвечаем подробно",
    "{s}: реальный кейс клиента до/после",
    "{s}: 3 признака, что вам это нужно уже сейчас",
    "{s}: что входит, а что клиенты часто путают",
    "{s}: личный лайфхак, который помогает между визитами",
    "{s}: отзыв клиента с разбором результата",
    "{s}: частая ошибка, которая мешает получить результат",
    "{s}: как понять, что формат работы вам подходит",
    "{s}: разовая встреча или курс/абонемент — что выгоднее",
    "{s}: история одного клиента от запроса до результата",
    "{s}: вопросы, которые стоит задать специалисту перед первой встречей",
    "{s}: повод обратиться именно сейчас",
]


def build_fallback_content_topics(services: list[str], day_seed: int) -> list[str]:
    """Собирает 3 готовые темы для поста/Reels на основе РЕАЛЬНЫХ услуг пользователя,
    ротируя и шаблоны, и сами услуги по дню, чтобы темы не повторялись день за днём."""
    n = len(FALLBACK_CONTENT_TEMPLATES)
    start = (day_seed * 3) % n
    topics = []
    for i in range(3):
        tmpl = FALLBACK_CONTENT_TEMPLATES[(start + i) % n]
        service = services[(day_seed + i) % len(services)]
        topics.append(tmpl.format(s=service))
    return topics


def build_growth_points(profile: dict) -> list:
    """Раскладывает разрыв между текущим и целевым доходом на 3 точки роста с потенциалом в рублях."""
    avg_check = float(profile["avg_check"])
    base_size = int(profile["base_size"])
    repeat_rate = int(profile["repeat_rate"])
    free_slots = int(profile["free_slots_per_week"])
    has_addon = bool(profile["has_addon_services"])
    addon_text = (profile.get("addon_services_text") or "").strip()

    points = []

    # 1. Возврат клиентов из базы, которые не возвращаются (оцениваем как base_size * (1 - repeat_rate/100))
    inactive = max(0, round(base_size * (1 - repeat_rate / 100)))
    to_return = min(inactive, max(5, round(inactive * 0.3)))
    if to_return > 0:
        potential = round(to_return * avg_check * 0.7)
        points.append({
            "key": "return_clients", "title": "Вернуть клиентов из базы",
            "action": f"Написать {to_return} клиентам, которые давно не были",
            "potential": potential, "count": to_return,
        })

    # 2. Заполнение свободных окон (за неделю, считаем на месяц ×4)
    slots_month = free_slots * 4
    to_fill = min(slots_month, max(2, round(slots_month * 0.6)))
    if to_fill > 0:
        potential = round(to_fill * avg_check)
        points.append({
            "key": "fill_slots", "title": "Заполнить свободные окна",
            "action": f"Заполнить {to_fill} окон в этом месяце спецпредложением",
            "potential": potential, "count": to_fill,
        })

    # 3. Поднять средний чек допуслугами
    if has_addon:
        addon_count = max(5, round(base_size * 0.15))
    else:
        addon_count = max(3, round(base_size * 0.08))
    addon_check = round(avg_check * 0.3)
    potential = addon_count * addon_check
    action = f"Предложить {addon_text} {addon_count} клиентам" if addon_text else f"Предложить допуслугу {addon_count} клиентам"
    points.append({
        "key": "upsell", "title": "Поднять средний чек",
        "action": action,
        "potential": potential, "count": addon_count,
    })

    return points


# Тесты/инструменты раздела «Развитие персонала», для fallback-режима и ротации.
# why — почему важно пройти именно этот тест сейчас (объясняем пользу и накопление динамики).
DEVELOPMENT_TOOLS = [
    {"title": "Пройти тест «Мышление с премиум-клиентами»", "button": "Пройти тест", "nav": "tools",
     "why": "Тест фиксирует ваш текущий уровень уверенности в общении с дорогими клиентами. Пройдите его повторно через месяц — увидите личную динамику и поймёте, что действительно изменилось."},
    {"title": "Пройти тест «Внутренние барьеры специалиста»", "button": "Пройти тест", "nav": "tools",
     "why": "Часто разрыв в доходе объясняется не отсутствием клиентов, а внутренними ограничениями — страхом называть цену, неловкостью в допродажах. Тест показывает, какие именно барьеры сейчас мешают вам больше всего."},
    {"title": "Пройти тест «Финансовая грамотность специалиста PRO»", "button": "Пройти тест", "nav": "tools",
     "why": "Управление доходом — отдельный навык, который редко преподают мастерам. Результат теста покажет слабые места в финансовых привычках, из-за которых деньги «утекают» несмотря на хороший поток клиентов."},
    {"title": "Пройти тест «Финансовый профиль PRO»", "button": "Пройти тест", "nav": "tools",
     "why": "Финансовое мышление влияет на то, как вы ставите цены и распоряжаетесь доходом. Зафиксировав профиль сейчас, вы сможете через пару месяцев сравнить результат и увидеть реальный прогресс."},
]

def build_today_tasks(points: list, day_seed: int = 0, profile: dict | None = None, is_first_plan: bool = False,
                       salon_services: list | None = None) -> list:
    """Из точек роста собирает 3-4 конкретных дела на сегодня со ссылкой на инструмент ЛК.
    Используется как резервный вариант, когда ИИ недоступен — чередует маркетинг, контент
    и развитие персонала (тесты), чтобы план не был однообразным день за днём. При первом
    плане (is_first_plan) вместо контента включает изучение ЦА и создание офферов. Темы контента
    строятся строго на реальных услугах из диагностики/«Мой салон» (salon_services)."""
    addon_text = ((profile or {}).get("addon_services_text") or "").strip()
    niche_raw = ((profile or {}).get("niche") or "").strip()
    services = extract_service_names(niche_raw, addon_text, salon_services)
    niche = niche_raw or services[0]

    task_map = {
        "return_clients": {
            "title": "Вернуть клиентов", "button": "Создать сообщения", "nav": "clientmsg", "minutes": 20,
        },
        "fill_slots": {
            "title": "Заполнить окна", "button": "Создать оффер", "nav": "marketing:offers", "minutes": 15,
        },
        "upsell": {
            "title": "Поднять чек", "button": "Получить скрипт", "nav": "agent", "minutes": 10,
        },
    }
    action_hints = {
        "return_clients": " Пример сообщения: «Здравствуйте! Давно вас не видели — соскучились 🙂 Если актуально, у меня есть удобное время на этой неделе». Пишите тепло, без давления, и указывайте конкретный срок записи.",
        "fill_slots": " Сформулируйте предложение с чёткой выгодой и сроком действия — например, скидка 15% при записи на свободные часы буднего дня. Разместите его там, где его увидят именно те, кто уже давно у вас не был.",
        "upsell": f" Предлагайте{f' {addon_text}' if addon_text else ' дополнительную услугу'} не как навязывание, а как решение конкретной задачи клиента — спросите о его цели и предложите то, что реально её закрывает.",
    }
    tasks = []
    for p in points:
        meta = task_map.get(p["key"])
        if not meta:
            continue
        tasks.append({
            "key": p["key"],
            "title": meta["title"],
            "action_text": p["action"] + action_hints.get(p["key"], ""),
            "button": meta["button"],
            "nav": meta["nav"],
            "minutes": meta["minutes"],
            "potential": p["potential"],
            "topic_options": None,
            "why": None,
        })

    if is_first_plan:
        # Первый план — сначала фундамент: изучить аудиторию и собрать под неё офферы,
        # прежде чем звать публиковать контент или запускать рекламу.
        tasks.append({
            "key": "audience", "title": "Изучить свою аудиторию",
            "action_text": "ИИ за 5-10 минут соберёт портреты ваших клиентов: их боли, мотивацию и то, на что они реагируют при выборе мастера. Это фундамент — весь дальнейший маркетинг (посты, офферы, реклама) будет точнее, если вы понимаете, кому именно продаёте.",
            "button": "Изучить аудиторию", "nav": "marketing:audience", "minutes": 10, "potential": 0,
            "topic_options": None, "why": None,
        })
        tasks.append({
            "key": "offers", "title": "Создать офферы под аудиторию",
            "action_text": "На основе портретов ИИ соберёт конкретные предложения под каждый сегмент клиентов. Эти офферы дальше используются в постах, сообщениях клиентам и рекламе — не придётся придумывать заново.",
            "button": "Создать оффер", "nav": "marketing:offers", "minutes": 10, "potential": 0,
            "topic_options": None, "why": None,
        })
    else:
        # Каждый день — конкретные готовые темы для контента на основе РЕАЛЬНЫХ услуг
        # пользователя, чтобы не думать, о чём писать, и не получать темы не по своей нише
        topics = build_fallback_content_topics(services, day_seed)
        content_nav = "marketing:reel-script" if day_seed % 2 == 0 else "marketing:post-gen"
        content_label = "Reels" if content_nav == "marketing:reel-script" else "пост"
        tasks.append({
            "key": "content", "title": "Привлечь новые записи",
            "action_text": f"Опубликуйте один {content_label} по вашему направлению «{niche}» — ниже готовые темы на выбор, не нужно придумывать самим. Выберите ту, что ближе к текущей ситуации клиентов, и переходите в генератор.",
            "button": f"Создать {content_label}", "nav": content_nav, "minutes": 25, "potential": 0,
            "topic_options": topics, "why": None,
        })

    tool = DEVELOPMENT_TOOLS[day_seed % len(DEVELOPMENT_TOOLS)]
    tasks.append({
        "key": "skill_up", "title": "Прокачать навыки",
        "action_text": tool["title"],
        "button": tool["button"], "nav": tool["nav"], "minutes": 15, "potential": 0,
        "topic_options": None, "why": tool["why"],
    })
    return tasks


def build_salon_context(conn, salon_id: int, day_seed: int) -> dict | None:
    """Для владельца/администратора салона собирает реальные данные из раздела «Мой салон»:
    агрегированные показатели салона, услуги и (если заполнены) сотрудников из «Анализ персонала».
    Фокус-сотрудник дня выбирается ротацией по day_seed — каждый день другой специалист.
    Вызывается ТОЛЬКО при первой генерации плана за сутки (кэшируется вместе с планом),
    повторные заходы в течение дня не делают дополнительных запросов к БД."""
    if not salon_id:
        return None
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"""SELECT name, city, avg_check, monthly_revenue, clients_count, masters_count,
                   target_audience, main_goal
            FROM {SCHEMA}.salons WHERE id = %s""",
        (salon_id,)
    )
    salon = cur.fetchone()
    if not salon:
        return None

    cur.execute(
        f"""SELECT name, price_min, price_max FROM {SCHEMA}.salon_services
            WHERE salon_id = %s ORDER BY sort_order LIMIT 20""",
        (salon_id,)
    )
    services = [
        {"name": s["name"], "price_min": float(s["price_min"]) if s["price_min"] else None,
         "price_max": float(s["price_max"]) if s["price_max"] else None}
        for s in cur.fetchall()
    ]

    cur.execute(
        f"""SELECT id, name, role, experience, clients_count, new_clients, return_pct,
                   revenue, avg_check, has_upsell, rebooking_pct, has_rebooking_offer,
                   service_score, has_sales_script
            FROM {SCHEMA}.salon_staff
            WHERE salon_id = %s AND is_active = TRUE ORDER BY id""",
        (salon_id,)
    )
    staff_rows = cur.fetchall()

    staff_list = []
    focus_staff = None
    if staff_rows:
        for s in staff_rows:
            staff_list.append({
                "name": s["name"], "role": s["role"] or "не указана",
                "experience_years": float(s["experience"]) if s["experience"] else None,
                "clients_per_month": s["clients_count"], "new_clients": s["new_clients"],
                "return_pct": float(s["return_pct"]) if s["return_pct"] else None,
                "revenue": float(s["revenue"]) if s["revenue"] else None,
                "avg_check": float(s["avg_check"]) if s["avg_check"] else None,
                "has_upsell": s["has_upsell"], "rebooking_pct": float(s["rebooking_pct"]) if s["rebooking_pct"] else None,
                "has_rebooking_offer": s["has_rebooking_offer"], "service_score": s["service_score"],
                "has_sales_script": s["has_sales_script"],
            })
        # Ротация фокус-сотрудника по дню: каждый день — следующий по кругу
        focus_row = staff_rows[day_seed % len(staff_rows)]
        focus_staff = {
            "name": focus_row["name"], "role": focus_row["role"] or "не указана",
            "clients_per_month": focus_row["clients_count"], "revenue": float(focus_row["revenue"]) if focus_row["revenue"] else None,
            "avg_check": float(focus_row["avg_check"]) if focus_row["avg_check"] else None,
            "return_pct": float(focus_row["return_pct"]) if focus_row["return_pct"] else None,
            "has_upsell": focus_row["has_upsell"], "has_rebooking_offer": focus_row["has_rebooking_offer"],
            "service_score": focus_row["service_score"], "has_sales_script": focus_row["has_sales_script"],
        }

    return {
        "salon": {
            "name": salon["name"], "city": salon["city"],
            "avg_check": float(salon["avg_check"]) if salon["avg_check"] else None,
            "monthly_revenue": float(salon["monthly_revenue"]) if salon["monthly_revenue"] else None,
            "clients_count": salon["clients_count"], "masters_count": salon["masters_count"],
            "target_audience": salon["target_audience"] or None, "main_goal": salon["main_goal"] or None,
        },
        "services": services,
        "staff_list": staff_list,
        "focus_staff": focus_staff,
    }


# ── Генерация плана «ПоДелам» через ИИ (модель terra, polza.ai) ────────────

PODELAM_MODEL = "openai/gpt-5.6-terra"
PODELAM_AI_URL = "https://polza.ai/api/v1/chat/completions"

# Разделы ЛК, куда ИИ может направить пользователя для выполнения дела
PODELAM_NAV_CATALOG = """
Маркетинг и клиенты:
- clientmsg — генератор сообщений клиентам (напоминания, возврат ушедших, акции, поздравления, просьба отзыва)
- marketing:audience — портрет целевой аудитории
- marketing:offers — офферы/спецпредложения под сегменты клиентов
- marketing:semantics — семантическое ядро (ключевые слова) для Яндекс.Директ
- marketing:direct — готовые тексты объявлений для Яндекс.Директ
- marketing:budget — расчёт медиабюджета для Директа
- marketing:post-gen — генератор постов для соцсетей
- marketing:image-gen — генерация визуалов/картинок для контента
- marketing:reel-script — сценарий для Reels/видео-контента
- marketing:video-gen — генерация видео-ролика
- marketing:photo-fitting — примерочная (ИИ показывает результат услуги на фото клиента)
- marketing:seo — SEO-анализ сайта и рекомендации
- agent — ИИ-агент: скрипты продаж, допродаж, работы с возражениями

Развитие персонала (раздел «Развитие персонала» в ЛК, tools) — тесты и диагностики специалиста:
- tools — открывает раздел с тестами: «Мышление с премиум-клиентами» (уверенность и навыки общения с VIP-клиентами), \
«Внутренние барьеры специалиста» (психологические блоки, мешающие росту), «Финансовая грамотность специалиста PRO» \
(управление доходом), «Финансовый профиль PRO» (финансовое мышление и привычки). Используй, когда причина низкого \
дохода может быть не только в маркетинге, но и в мышлении/уверенности/финансовых привычках специалиста.

Академия (раздел «Академия» в ЛК, academy) — курсы и тренинги, конкретный список ниже в payload (course_catalog). \
Рекомендуй курс, ТОЧНО подходящий по категории роли пользователя (owner/admin/master/body) и по теме, которая \
реально поможет с текущим разрывом в доходе (продажи, личный бренд, психология общения, ИИ-инструменты и т.д.).
- academy — открывает раздел Академии со списком курсов

Сотрудники (раздел «Сотрудники» в ЛК, employees) — команда и приглашения:
- employees — открывает раздел управления командой (пригласить сотрудника, роли, доступы)
"""

# Разделы, которые являются генераторами контента — для дел с этими nav ИИ обязан придумать
# 3 конкретные готовые темы (topic_options), а не просто написать «сделайте пост»
PODELAM_CONTENT_NAVS = ["marketing:post-gen", "marketing:reel-script", "marketing:image-gen"]

# Разделы развития — для дел с этими nav ИИ обязан объяснить пользу через поле "why"
PODELAM_DEVELOPMENT_NAVS = ["tools", "academy"]

# Инструкция для владельцев/администраторов салона с заполненными реальными данными
# (профиль салона + список сотрудников из раздела «Мой салон» / «Анализ персонала»)
PODELAM_SALON_MODE_PROMPT = """
════════════════════════════════════════════════
РЕЖИМ ВЛАДЕЛЬЦА/АДМИНИСТРАТОРА САЛОНА (передан salon_context)
════════════════════════════════════════════════
Пользователь — владелец или администратор салона, в payload дополнительно передан salon_context с реальными \
данными из раздела «Мой салон» личного кабинета: агрегированные показатели салона (salon), список услуг (services) \
и, если заполнен раздел «Анализ персонала», список сотрудников (staff_list) с их личными метриками (выручка, средний \
чек, % повторных визитов, оценка сервиса, наличие допродаж и скриптов продаж).

- Если staff_list НЕ пуст (салон с несколькими сотрудниками): обязательно посвяти 1-2 дела из плана КОНКРЕТНОМУ \
фокус-сотруднику дня — он указан в salon_context.focus_staff (имя, специализация/роль и его личные метрики). \
Используй его имя и специализацию прямо в title и action_text дела (например: «Massаж: разбор с Анной» вместо общих \
формулировок), опирайся на ЕГО конкретные цифры (выручка, чек, % возврата, оценка сервиса, есть ли допродажи/скрипты) \
чтобы предложить точечное действие именно для роста ЕГО показателей. Остальные 2-3 дела делай ОБЩИМИ по салону в целом \
(заполнение расписания всего салона, акции и офферы на основе услуг services, отзывы, привлечение новых клиентов, \
контент) на основе агрегированных данных salon_context.salon и его услуг. Фокус-сотрудник меняется автоматически \
каждый день ротацией — не пытайся выбрать другого сотрудника сам, всегда используй именно focus_staff.
- Если staff_list пуст (сотрудники ещё не добавлены) — работай только с агрегированными данными salon_context.salon \
и services, как в обычном режиме, без выдуманных имён сотрудников. Никогда не выдумывай сотрудников, которых нет \
в staff_list.
- Приоритет данных: если salon_context.salon содержит monthly_revenue/avg_check — используй их как более точные \
и актуальные, чем ручная диагностика профиля, но саму цель (target_revenue) и разрыв (gap_amount) бери из диагностики.
════════════════════════════════════════════════
"""

PODELAM_FIRST_PLAN_PROMPT = """
════════════════════════════════════════════════
ПЕРВЫЙ ПЛАН (payload.is_first_plan = true)
════════════════════════════════════════════════
Это ПЕРВЫЙ раз, когда пользователь получает план от «ПоДелам» — истории вчерашних дел ещё нет. Прежде чем предлагать \
маркетинговые действия (посты, Reels, реклама), человек должен понимать, КОМУ он продаёт и ЧТО именно предлагать. \
Поэтому ОБЯЗАТЕЛЬНО включи в план первым/главным делом связку из двух шагов подряд, которые вместе объясняются как \
фундамент: 1) «Изучить свою аудиторию» — nav: marketing:audience, объясни в action_text, что за 5-10 минут ИИ соберёт \
портреты клиентов с их болями и мотивацией, и весь дальнейший маркетинг (посты, офферы, реклама) будет точнее. \
2) «Создать офферы под аудиторию» — nav: marketing:offers, action_text объясни, что на основе портретов ИИ соберёт \
конкретные предложения, которые дальше используются в постах, рассылках и рекламе. Остальные 1-2 дела в плане — как \
обычно (возврат клиентов/заполнение окон/тест из «Развитие персонала»), но БЕЗ дел на публикацию контента (посты/ \
Reels) — их полезно делать ПОСЛЕ того как аудитория и офферы готовы, это будет предложено уже завтра.
════════════════════════════════════════════════
"""

def build_podelam_system_prompt(is_first_plan: bool = False) -> str:
    """Собирает системный промпт для генерации плана. При первом плане (is_first_plan=True)
    добавляет отдельный блок инструкций про изучение ЦА и создание офферов первым делом."""
    return f"""Ты — экспертный бизнес-консультант и маркетолог-стратег, встроенный в сервис «ПоДелам» \
внутри платформы «Промт Диалог» для мастеров и владельцев салонов красоты (парикмахеры, мастера маникюра, массажисты и т.п.).

Твоя задача — на основе диагностики конкретного мастера/салона построить ЧЁТКИЙ, ПРИЧИННО-СЛЕДСТВЕННЫЙ план роста дохода:
1. Учти АБСОЛЮТНО ВСЕ данные из диагностики (ниша, средний чек, текущий и целевой доход, клиентов в месяц, \
размер базы, % повторных визитов, свободные окна, есть ли допуслуги и их конкретный список/цены, откуда приходят записи, \
роль пользователя role, доступные курсы Академии course_catalog). Если в payload передан salon_context — это владелец/\
администратор салона с реальными данными из раздела «Мой салон», действуй согласно отдельной инструкции ниже \
(РЕЖИМ ВЛАДЕЛЬЦА/АДМИНИСТРАТОРА САЛОНА).
2. Если указан конкретный список допуслуг/пакетов (addon_services_text) — используй ИМЕННО ЭТИ названия в действиях \
и рекомендациях по допродажам вместо общих формулировок вроде "предложить допуслугу". Учитывай их ориентировочную \
стоимость при расчёте potential, если она указана в тексте.
3. Посчитай разрыв между текущим и целевым доходом и реалистично разложи его на 3-4 точки роста — откуда именно \
возьмутся деньги (возврат клиентов, заполнение окон, допродажи конкретных допуслуг/пакетов, привлечение новых через \
конкретный канал lead_source, рост навыков/уверенности специалиста).
4. Для каждой точки роста подбери КОНКРЕТНОЕ действие на сегодня, которое можно выполнить с помощью инструментов \
личного кабинета. Обязательно указывай nav — раздел ЛК, который реально решает эту задачу, выбирай СТРОГО из \
категорий ниже, ничего не выдумывай:
{PODELAM_NAV_CATALOG}
5. ВАЖНО — РАЗНООБРАЗИЕ: план из 3-4 дел НЕ должен состоять только из маркетинговых разделов. Как правило включай: \
1-2 дела из блока «Маркетинг и клиенты», РОВНО 1 дело из блока «Развитие персонала» (tools) — конкретный тест из \
списка, подходящий под ситуацию, и когда есть подходящий курс в course_catalog — 1 дело из блока «Академия» (academy) \
с названием конкретного курса. Если сегодня уже был другой набор — не повторяй вчерашние формулировки и разделы \
(смотри yesterday_tasks в payload), чередуй их день ото дня.
6. Если lead_source указывает на конкретный канал (Instagram, Директ, сарафанное радио и т.д.) — учитывай это при \
выборе маркетинговых действий (например, если реклама не настроена, а доход не дотягивает до цели — предложи \
семантику/объявления/бюджет для Директа; если упор на контент — Reels/посты/визуалы).
7. Одно из дел сделай "главным делом дня" — тем, что даст наибольший или самый быстрый эффект (обычно из блока \
«Маркетинг и клиенты», но может быть и тест/курс, если явно видно, что причина разрыва — не в маркетинге).
8. Придумай короткий, тёплый, мотивирующий анонс на завтра (2-3 предложения, обращение на "вы"), который объясняет, \
что план не статичен: завтра появится новый набор дел с учётом того, что было сделано сегодня, и почему это важно \
(регулярность даёт результат). НЕ повторяй сегодняшние формулировки дословно.
9. КОНКРЕТНЫЕ ТЕМЫ ДЛЯ КОНТЕНТА: если дело ведёт в раздел-генератор контента (nav = marketing:post-gen, \
marketing:reel-script или marketing:image-gen) — НЕДОСТАТОЧНО написать «опубликуйте пост». Заполни поле topic_options \
массивом из РОВНО 3 готовых, конкретных тем на выбор. КРИТИЧЕСКИ ВАЖНО: темы должны строиться СТРОГО вокруг реальной \
ниши и услуг пользователя из поля service_names в payload (и, если передан salon_context, из salon_context.services) \
— НЕ придумывай услуги, которых нет в этом списке, и НЕ используй тематику другой отрасли (например, если ниша \
«психолог» или «остеопат» — темы должны быть про психологическую консультацию/телесную терапию, а НЕ про маникюр, \
причёски или любую бьюти-тематику, даже если платформа в целом ориентирована на индустрию красоты). Формулируй тему \
как законченную мысль 4-10 слов, привязанную к конкретной услуге из service_names (например, если услуга «Массаж \
спины» — «Массаж спины: как понять, что пора на процедуру», если услуга «Психолог» — «Психолог: как отличить усталость \
от выгорания»), НЕ общую фразу вроде "полезный пост об услуге". Темы не должны повторять то, что уже публиковалось — \
смотри recent_content_topics в payload и никогда не предлагай темы, близкие по смыслу к уже использованным. Такие \
дела (контент) старайся включать в план КАЖДЫЙ ДЕНЬ (кроме первого плана — см. правило ниже про is_first_plan), \
чередуя nav между post-gen и reel-script, чтобы соцсети пополнялись регулярно.
10. ПОДРОБНЫЕ ШАГИ: action_text каждого дела должен быть НЕ ОДНОЙ строкой, а мини-инструкцией на 2-4 предложения: \
что именно сделать, с конкретным примером или вариантом формулировки (например, готовый текст сообщения клиенту или \
пример оффера), и на что обратить внимание, чтобы не ошибиться (тайминг, тон, кому подходит/не подходит). Пиши по \
существу, без воды, как будто объясняешь занятому человеку, а не пишешь маркетинговый слоган.
11. ОБЪЯСНЕНИЕ ПОЛЬЗЫ РАЗВИТИЯ: для дел с nav = tools или academy заполни отдельное поле why (1-2 предложения) — \
объясни, ПОЧЕМУ важно пройти именно это (например: тест фиксирует текущий уровень барьеров/уверенности, при повторном \
прохождении через месяц-два будет видна личная динамика роста; или: курс даёт конкретный навык, который сразу решает \
затык, из-за которого сейчас теряются деньги). Без общих фраз "это полезно" — привязывай к текущей ситуации человека.
12. АНТИ-ПОВТОР: НИКОГДА не повторяй буквально или почти буквально формулировки title/action_text/topic_options из \
yesterday_tasks и recent_content_topics (последние темы контента за 14 дней, если переданы в payload) — каждый день \
план должен ощущаться как новый шаг вперёд, а не копия вчерашнего.
{PODELAM_FIRST_PLAN_PROMPT if is_first_plan else ""}
Отвечай СТРОГО в формате JSON, без markdown-обёртки, без пояснений вне JSON:
{{
  "growth_points": [
    {{"key": "верхнеуровневый_слаг_латиницей", "title": "Короткое название точки роста", "action": "Конкретное действие с цифрами", "potential": число_рублей}}
  ],
  "tasks": [
    {{"key": "тот_же_слаг_что_в_growth_points_или_content_или_skill_up_или_course", "title": "Название дела (2-4 слова)", "action_text": "Развёрнутая мини-инструкция 2-4 предложения с примером/вариантом и на что обратить внимание, с цифрами из диагностики (для tools/academy — назови конкретный тест или курс)", "button": "Текст кнопки перехода (2-4 слова)", "nav": "раздел_из_списка", "minutes": число_минут_на_выполнение, "potential": число_рублей_или_0, "topic_options": ["тема 1", "тема 2", "тема 3"] или null если nav не контентный, "why": "почему важно, 1-2 предложения" или null если nav не tools/academy}}
  ],
  "main_task_key": "key дела с наибольшим приоритетом на сегодня",
  "tomorrow_preview": "Тёплый анонс на завтра, 2-3 предложения"
}}

Правила по числам: potential — целые рубли, реалистичные исходя из среднего чека и базы клиентов, никогда не превышай \
величину разрыва между текущим и целевым доходом суммарно по всем tasks (у дел из tools/academy potential = 0). \
Дел должно быть 3-4, каждое выполнимо за 10-30 минут.
{PODELAM_SALON_MODE_PROMPT}"""


def call_podelam_ai(profile: dict, gap: float, role: str = "", courses: list | None = None,
                     yesterday_tasks: list | None = None, salon_context: dict | None = None,
                     is_first_plan: bool = False, recent_content_topics: list | None = None) -> dict | None:
    """Запрашивает у модели terra (polza.ai) персональный план роста дохода. Возвращает None при ошибке."""
    api_key = os.environ.get("POLZA_AI_API_KEY", "")
    if not api_key:
        return None

    user_payload = {
        "role": role or "не указана",
        "niche": profile.get("niche") or "не указана",
        "avg_check": float(profile["avg_check"]),
        "current_revenue": float(profile["current_revenue"]),
        "target_revenue": float(profile["target_revenue"]),
        "gap_amount": round(gap),
        "clients_per_month": int(profile.get("clients_per_month") or 0),
        "base_size": int(profile.get("base_size") or 0),
        "repeat_rate": int(profile.get("repeat_rate") or 0),
        "free_slots_per_week": int(profile.get("free_slots_per_week") or 0),
        "has_addon_services": bool(profile.get("has_addon_services")),
        "addon_services_text": profile.get("addon_services_text") or "не указан",
        "lead_source": profile.get("lead_source") or "не указан",
        "course_catalog": courses or [],
        "yesterday_tasks": yesterday_tasks or [],
        "is_first_plan": is_first_plan,
        "recent_content_topics": recent_content_topics or [],
        # Явный список реальных услуг пользователя (ниша + допуслуги, плюс услуги салона, если есть) —
        # именно из этого списка ИИ обязан брать темы для постов/Reels, а не из общей тематики платформы.
        "service_names": extract_service_names(
            profile.get("niche") or "",
            profile.get("addon_services_text") or "",
            salon_context.get("services") if salon_context else None,
        ),
    }
    if salon_context:
        user_payload["salon_context"] = salon_context

    payload = json.dumps({
        "model": PODELAM_MODEL,
        "messages": [
            {"role": "system", "content": build_podelam_system_prompt(is_first_plan)},
            {"role": "user", "content": f"Диагностика мастера/салона:\n{json.dumps(user_payload, ensure_ascii=False, indent=2)}"},
        ],
        "temperature": 0.7,
        "max_tokens": 2600 if salon_context else 2400,
    }).encode("utf-8")

    req = urllib.request.Request(
        PODELAM_AI_URL,
        data=payload,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=45) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        content = data["choices"][0]["message"]["content"].strip()
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
            content = content.strip()
        parsed = json.loads(content)
        if not parsed.get("tasks") or not parsed.get("growth_points"):
            return None
        return parsed
    except (urllib.error.URLError, TimeoutError, KeyError, ValueError, json.JSONDecodeError):
        return None


def handle_podelam_get(event: dict, conn) -> dict:
    """Возвращает сохранённый профиль дохода, финансовую карту и план на сегодня."""
    session_id = (event.get("headers") or {}).get("X-Session-Id", "")
    if not session_id:
        return err("Не авторизован", 401)
    user = get_lk_user_by_session(session_id, conn)
    if not user:
        return err("Сессия истекла", 401)

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT * FROM {SCHEMA}.podelam_profiles WHERE user_id = %s",
        (user["id"],)
    )
    profile = cur.fetchone()
    if not profile:
        return ok({"has_profile": False})

    role = user.get("role") or "body_specialist"
    salon_id = user.get("salon_id")

    # «Мой салон» считается заполненным, если указаны ключевые показатели (чек и выручка) —
    # именно эти данные подмешиваются в план. Проверяем только для владельца/администратора,
    # чтобы показать напоминание заполнить профиль, пока план строится по анкете ПоДелам.
    salon_profile_filled = None
    if role in ("owner", "admin") and salon_id:
        salon_profile_filled = is_salon_profile_filled(conn, salon_id)

    gap = float(profile["target_revenue"]) - float(profile["current_revenue"])
    fallback_points = build_growth_points(profile)
    default_preview = (
        "Завтра здесь появится новый набор дел — ИИ пересчитает план с учётом того, что вы выполните сегодня. "
        "Регулярные небольшие шаги дают самый устойчивый рост дохода."
    )

    today = date.today()
    cur.execute(
        f"SELECT * FROM {SCHEMA}.podelam_daily_plans WHERE user_id = %s AND plan_date = %s",
        (user["id"], today)
    )
    plan_row = cur.fetchone()
    if not plan_row:
        # Энергия списывается ОДИН РАЗ в сутки — только в момент реальной постройки нового
        # плана на день (карточка диагностики уже точно заполнена, иначе вышли бы раньше).
        # Проверяем баланс ДО дорогих запросов (курсы/данные салона/вызов ИИ), чтобы не тратить
        # вычисления, если энергии не хватает.
        podelam_cost = PODELAM_COST_SALON if role in ("owner", "admin") else PODELAM_COST_MASTER
        balance = get_salon_balance(conn, salon_id) if salon_id else 0
        if salon_id and balance < podelam_cost:
            return ok({
                "has_profile": True,
                "profile": dict(profile),
                "growth_points": fallback_points,
                "gap_amount": gap,
                "plan": None,
                "task_log": {},
                "today_income": None,
                "energy_insufficient": True,
                "energy_balance": balance,
                "energy_needed": podelam_cost,
                "salon_profile_filled": salon_profile_filled,
            })

        cur.execute(
            f"""SELECT title, category, categories, description FROM {SCHEMA}.courses
                WHERE is_published = TRUE ORDER BY sort_order LIMIT 20"""
        )
        role_map = {"owner": "owner", "admin": "admin", "master": "master",
                    "solo_master": "master", "body_specialist": "body"}
        role_cat = role_map.get(role, "body")
        all_courses = cur.fetchall()
        courses_for_role = [
            {"title": c["title"], "description": c["description"] or ""}
            for c in all_courses
            if role_cat in (c.get("categories") or [c.get("category")])
        ][:8]

        cur.execute(
            f"""SELECT tasks FROM {SCHEMA}.podelam_daily_plans
                WHERE user_id = %s AND plan_date = %s""",
            (user["id"], today - timedelta(days=1))
        )
        yesterday_row = cur.fetchone()
        yesterday_tasks = []
        if yesterday_row and yesterday_row.get("tasks"):
            yt = yesterday_row["tasks"] if isinstance(yesterday_row["tasks"], list) else json.loads(yesterday_row["tasks"])
            yesterday_tasks = [{"title": t.get("title"), "nav": t.get("nav")} for t in yt]

        # Первый ли это план вообще у пользователя — если раньше планов не было, ИИ сперва
        # предложит изучить ЦА и собрать офферы, прежде чем звать публиковать контент.
        cur.execute(
            f"SELECT 1 FROM {SCHEMA}.podelam_daily_plans WHERE user_id = %s LIMIT 1",
            (user["id"],)
        )
        is_first_plan = cur.fetchone() is None

        # Темы постов/Reels за последние 14 дней — чтобы ИИ не предлагал те же темы снова.
        cur.execute(
            f"""SELECT tasks FROM {SCHEMA}.podelam_daily_plans
                WHERE user_id = %s AND plan_date >= %s AND plan_date < %s""",
            (user["id"], today - timedelta(days=14), today)
        )
        recent_content_topics: list = []
        for row in cur.fetchall():
            rt = row["tasks"] if isinstance(row["tasks"], list) else json.loads(row["tasks"] or "[]")
            for t in rt:
                if t.get("nav") in PODELAM_CONTENT_NAVS and t.get("topic_options"):
                    recent_content_topics.extend(t["topic_options"])
        recent_content_topics = recent_content_topics[-30:]

        # Для владельца/администратора салона — подмешиваем реальные данные из «Мой салон»
        # (агрегированные показатели, услуги, сотрудники) и фокус-сотрудника дня по ротации.
        # Если «Мой салон» ещё не заполнен — данные берём из карточки диагностики ПоДелам (fallback).
        # Запрос делается ТОЛЬКО здесь — при первой генерации плана за сутки, не при каждом заходе.
        salon_context = None
        if role in ("owner", "admin") and salon_id and salon_profile_filled:
            salon_context = build_salon_context(conn, salon_id, day_seed=today.toordinal())

        ai_result = call_podelam_ai(dict(profile), gap, role=role, courses=courses_for_role,
                                     yesterday_tasks=yesterday_tasks, salon_context=salon_context,
                                     is_first_plan=is_first_plan, recent_content_topics=recent_content_topics)
        if ai_result:
            points = ai_result["growth_points"]
            tasks = ai_result["tasks"]
            main_key = ai_result.get("main_task_key") or (tasks[0]["key"] if tasks else None)
            tomorrow_preview = ai_result.get("tomorrow_preview") or default_preview
            source = "ai"
        else:
            points = fallback_points
            tasks = build_today_tasks(points, day_seed=today.toordinal(), profile=dict(profile), is_first_plan=is_first_plan,
                                       salon_services=salon_context.get("services") if salon_context else None)
            main_key = tasks[0]["key"] if tasks else None
            tomorrow_preview = default_preview
            source = "rules"

        salon_focus = salon_context.get("focus_staff") if salon_context else None

        cur2 = conn.cursor()
        cur2.execute(
            f"""INSERT INTO {SCHEMA}.podelam_daily_plans
                (user_id, plan_date, main_task_key, gap_amount, tasks, tomorrow_preview, source, growth_points, salon_focus)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (user_id, plan_date) DO NOTHING
                RETURNING *""",
            (user["id"], today, main_key, gap, json.dumps(tasks, ensure_ascii=False),
             tomorrow_preview, source, json.dumps(points, ensure_ascii=False),
             json.dumps(salon_focus, ensure_ascii=False) if salon_focus else None)
        )
        cur2.fetchone()
        if salon_id:
            deduct_podelam_energy(conn, salon_id, user["id"], podelam_cost)
        conn.commit()
        plan = {
            "tasks": tasks, "main_task_key": main_key, "gap_amount": gap,
            "plan_date": str(today), "tomorrow_preview": tomorrow_preview, "source": source,
            "salon_focus": salon_focus,
        }
        growth_points = points
    else:
        plan = dict(plan_row)
        saved_points = plan.get("growth_points")
        growth_points = saved_points if saved_points else fallback_points
        if not plan.get("tomorrow_preview"):
            plan["tomorrow_preview"] = default_preview
            cur_fix = conn.cursor()
            cur_fix.execute(
                f"UPDATE {SCHEMA}.podelam_daily_plans SET tomorrow_preview = %s WHERE user_id = %s AND plan_date = %s",
                (default_preview, user["id"], today)
            )
            conn.commit()

    cur.execute(
        f"SELECT task_key, done, actual_amount FROM {SCHEMA}.podelam_task_log WHERE user_id = %s AND plan_date = %s",
        (user["id"], today)
    )
    log = {r["task_key"]: {"done": r["done"], "actual_amount": float(r["actual_amount"]) if r["actual_amount"] else None} for r in cur.fetchall()}

    cur.execute(
        f"SELECT amount FROM {SCHEMA}.podelam_daily_income WHERE user_id = %s AND income_date = %s",
        (user["id"], today)
    )
    income_row = cur.fetchone()
    today_income = float(income_row["amount"]) if income_row else None

    return ok({
        "has_profile": True,
        "profile": dict(profile),
        "growth_points": growth_points,
        "gap_amount": gap,
        "plan": plan,
        "task_log": log,
        "today_income": today_income,
        "salon_profile_filled": salon_profile_filled,
    })


def handle_podelam_save_profile(event: dict, conn) -> dict:
    """Сохраняет/обновляет диагностику дохода пользователя (8-12 вопросов)."""
    session_id = (event.get("headers") or {}).get("X-Session-Id", "")
    if not session_id:
        return err("Не авторизован", 401)
    user = get_lk_user_by_session(session_id, conn)
    if not user:
        return err("Сессия истекла", 401)

    body = json.loads(event.get("body") or "{}")
    required = ["avg_check", "current_revenue", "target_revenue"]
    for f in required:
        if body.get(f) in (None, ""):
            return err(f"Заполните поле: {f}")

    cur = conn.cursor()
    cur.execute(
        f"""INSERT INTO {SCHEMA}.podelam_profiles
            (user_id, salon_id, niche, avg_check, current_revenue, target_revenue,
             clients_per_month, base_size, repeat_rate, free_slots_per_week, has_addon_services,
             addon_services_text, lead_source, updated_at)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,NOW())
            ON CONFLICT (user_id) DO UPDATE SET
                salon_id=EXCLUDED.salon_id, niche=EXCLUDED.niche, avg_check=EXCLUDED.avg_check,
                current_revenue=EXCLUDED.current_revenue, target_revenue=EXCLUDED.target_revenue,
                clients_per_month=EXCLUDED.clients_per_month, base_size=EXCLUDED.base_size,
                repeat_rate=EXCLUDED.repeat_rate, free_slots_per_week=EXCLUDED.free_slots_per_week,
                has_addon_services=EXCLUDED.has_addon_services, addon_services_text=EXCLUDED.addon_services_text,
                lead_source=EXCLUDED.lead_source,
                updated_at=NOW()""",
        (
            user["id"], user.get("salon_id"), body.get("niche", ""),
            float(body["avg_check"]), float(body["current_revenue"]), float(body["target_revenue"]),
            int(body.get("clients_per_month") or 0), int(body.get("base_size") or 0),
            int(body.get("repeat_rate") or 0), int(body.get("free_slots_per_week") or 0),
            bool(body.get("has_addon_services") or False), (body.get("addon_services_text") or "").strip() or None,
            body.get("lead_source", ""),
        )
    )
    # Сбрасываем план на сегодня, чтобы пересчитать с новыми данными
    cur.execute(
        f"DELETE FROM {SCHEMA}.podelam_daily_plans WHERE user_id = %s AND plan_date = %s",
        (user["id"], date.today())
    )
    conn.commit()
    return ok({"ok": True})


def handle_podelam_task_done(event: dict, conn) -> dict:
    """Отмечает дело дня выполненным/невыполненным, опционально с фактической суммой."""
    session_id = (event.get("headers") or {}).get("X-Session-Id", "")
    if not session_id:
        return err("Не авторизован", 401)
    user = get_lk_user_by_session(session_id, conn)
    if not user:
        return err("Сессия истекла", 401)

    body = json.loads(event.get("body") or "{}")
    task_key = body.get("task_key")
    if not task_key:
        return err("Нужен task_key")
    done = bool(body.get("done", True))
    actual_amount = body.get("actual_amount")

    cur = conn.cursor()
    cur.execute(
        f"""INSERT INTO {SCHEMA}.podelam_task_log (user_id, plan_date, task_key, done, actual_amount, updated_at)
            VALUES (%s, %s, %s, %s, %s, NOW())
            ON CONFLICT (user_id, plan_date, task_key) DO UPDATE SET
                done=EXCLUDED.done, actual_amount=EXCLUDED.actual_amount, updated_at=NOW()""",
        (user["id"], date.today(), task_key, done, actual_amount)
    )
    conn.commit()
    return ok({"ok": True})


def handle_podelam_set_income(event: dict, conn) -> dict:
    """Прибавляет фактический доход мастера за конкретный день (по умолчанию — сегодня) к уже накопленной сумме.
    Если передан mode="replace" — заменяет сумму целиком (используется при исправлении ошибочного ввода)."""
    session_id = (event.get("headers") or {}).get("X-Session-Id", "")
    if not session_id:
        return err("Не авторизован", 401)
    user = get_lk_user_by_session(session_id, conn)
    if not user:
        return err("Сессия истекла", 401)

    body = json.loads(event.get("body") or "{}")
    if body.get("amount") in (None, ""):
        return err("Укажите сумму")
    try:
        amount = float(body["amount"])
    except (TypeError, ValueError):
        return err("Некорректная сумма")
    if amount < 0:
        return err("Сумма не может быть отрицательной")

    income_date = body.get("date") or str(date.today())
    mode = body.get("mode") or "add"

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    if mode == "replace":
        cur.execute(
            f"""INSERT INTO {SCHEMA}.podelam_daily_income (user_id, income_date, amount, updated_at)
                VALUES (%s, %s, %s, NOW())
                ON CONFLICT (user_id, income_date) DO UPDATE SET
                    amount=EXCLUDED.amount, updated_at=NOW()
                RETURNING amount""",
            (user["id"], income_date, amount)
        )
    else:
        cur.execute(
            f"""INSERT INTO {SCHEMA}.podelam_daily_income (user_id, income_date, amount, updated_at)
                VALUES (%s, %s, %s, NOW())
                ON CONFLICT (user_id, income_date) DO UPDATE SET
                    amount=podelam_daily_income.amount + EXCLUDED.amount, updated_at=NOW()
                RETURNING amount""",
            (user["id"], income_date, amount)
        )
    total_amount = float(cur.fetchone()["amount"])
    conn.commit()
    return ok({"ok": True, "amount": total_amount})


def _compute_period_stats(conn, user_id: int, days: int) -> dict:
    """Считает статистику по выполненным делам и потенциалу/факту за последние N дней."""
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    since = date.today() - timedelta(days=days - 1)

    # Все задачи из планов за период (для подсчёта общего количества и потенциала)
    cur.execute(
        f"""SELECT plan_date, tasks FROM {SCHEMA}.podelam_daily_plans
            WHERE user_id = %s AND plan_date >= %s AND plan_date <= %s""",
        (user_id, since, date.today())
    )
    plans = cur.fetchall()

    total_tasks = 0
    potential_total = 0.0
    for p in plans:
        tasks = p["tasks"] if isinstance(p["tasks"], list) else json.loads(p["tasks"])
        total_tasks += len(tasks)
        potential_total += sum(float(t.get("potential") or 0) for t in tasks)

    # Выполненные дела за период (для счётчика "дел выполнено")
    cur.execute(
        f"""SELECT done FROM {SCHEMA}.podelam_task_log
            WHERE user_id = %s AND plan_date >= %s AND plan_date <= %s""",
        (user_id, since, date.today())
    )
    logs = cur.fetchall()
    done_count = sum(1 for r in logs if r["done"])

    # Фактический доход, указанный мастером по дням
    cur.execute(
        f"""SELECT amount FROM {SCHEMA}.podelam_daily_income
            WHERE user_id = %s AND income_date >= %s AND income_date <= %s""",
        (user_id, since, date.today())
    )
    income_rows = cur.fetchall()
    actual_total = sum(float(r["amount"]) for r in income_rows)

    return {
        "days": days,
        "total_tasks": total_tasks,
        "done_tasks": done_count,
        "completion_rate": round(done_count / total_tasks * 100) if total_tasks > 0 else 0,
        "potential_total": round(potential_total),
        "actual_total": round(actual_total),
    }


def _send_podelam_notify_email(to_email: str, full_name: str, main_task: dict | None, gap_amount: float) -> None:
    """Письмо о новых шагах ПоДелам на сегодня."""
    smtp_password = os.environ.get("SMTP_PASSWORD", "")
    if not smtp_password:
        return

    name = (full_name or "Здравствуйте").split(" ")[0]
    task_html = ""
    if main_task:
        task_html = f"""
      <div style="background:#f8f8f5;border-radius:12px;padding:18px 20px;margin:0 0 24px;">
        <div style="font-size:11px;color:#1a9fae;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;margin-bottom:6px;">Сегодня главное</div>
        <div style="font-size:16px;font-weight:700;color:#1a1a1a;margin-bottom:6px;">{main_task.get('title','')}</div>
        <div style="font-size:13px;color:#555;line-height:1.6;">{main_task.get('action_text','')}</div>
      </div>"""

    gap_line = f"Чтобы дойти до цели месяца, не хватает {round(max(0, gap_amount)):,} ₽.".replace(",", " ") if gap_amount else ""

    html = f"""<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f4f0;font-family:'Helvetica Neue',Arial,sans-serif;">
  <div style="max-width:520px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
    <div style="background:linear-gradient(135deg,#1a9fae,#136e7a);padding:28px 32px;">
      <div style="font-size:22px;font-weight:800;color:#fff;letter-spacing:-0.5px;">ПоДелам</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.7);margin-top:4px;">Навигатор дохода — Промт Диалог</div>
    </div>
    <div style="padding:32px 32px 24px;">
      <p style="font-size:18px;font-weight:700;color:#1a1a1a;margin:0 0 12px;">
        {name}, на сегодня готов новый план
      </p>
      <p style="font-size:14px;color:#555;line-height:1.7;margin:0 0 20px;">
        {gap_line} Загляните в кабинет — там уже ждут конкретные шаги на сегодня.
      </p>
      {task_html}
      <a href="{SITE_URL}/cabinet"
         style="display:inline-block;background:linear-gradient(135deg,#1a9fae,#136e7a);color:#fff;text-decoration:none;
                font-size:15px;font-weight:700;padding:16px 32px;border-radius:12px;letter-spacing:0.2px;">
        Посмотреть план
      </a>
    </div>
    <div style="padding:16px 32px;background:#f8f8f5;border-top:1px solid #eee;">
      <p style="font-size:11px;color:#bbb;margin:0;">Промт Диалог — платформа для бьюти-бизнеса.</p>
    </div>
  </div>
</body>
</html>"""

    msg = MIMEMultipart("alternative")
    msg["Subject"] = str(Header(f"{name}, новые шаги в ПоДелам на сегодня", "utf-8"))
    msg["From"]    = formataddr((str(Header("Промт Диалог", "utf-8")), FROM_EMAIL))
    msg["To"]      = to_email
    msg["MIME-Version"] = "1.0"
    msg.attach(MIMEText(html, "html", "utf-8"))

    ctx = ssl.create_default_context()
    for attempt in range(2):
        try:
            with smtplib.SMTP_SSL("smtp.mail.ru", 465, context=ctx, timeout=15) as srv:
                srv.login(FROM_EMAIL, smtp_password)
                srv.sendmail(FROM_EMAIL, [to_email], msg.as_string())
            return
        except (smtplib.SMTPException, TimeoutError, OSError):
            if attempt == 1:
                raise
            time.sleep(1.5)


def handle_podelam_notify(event: dict, conn) -> dict:
    """Cron: рассылает письмо всем пользователям, у которых сегодня уже есть план, но письмо ещё не отправлено."""
    admin_token = os.environ.get("ADMIN_TOKEN", "")
    qs = event.get("queryStringParameters") or {}
    key = (event.get("headers") or {}).get("X-Internal-Key", "") or qs.get("key", "")
    if not admin_token or key != admin_token:
        return err("Доступ запрещён", 403)

    today = date.today()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"""SELECT p.id AS plan_id, p.user_id, p.main_task_key, p.gap_amount, p.tasks,
                   u.email, u.full_name
            FROM {SCHEMA}.podelam_daily_plans p
            JOIN {SCHEMA}.lk_users u ON u.id = p.user_id
            WHERE p.plan_date = %s AND p.notified_at IS NULL AND u.is_active = TRUE""",
        (today,)
    )
    rows = cur.fetchall()

    sent, failed = [], []
    for row in rows:
        tasks = row["tasks"] if isinstance(row["tasks"], list) else json.loads(row["tasks"])
        main_task = next((t for t in tasks if t.get("key") == row["main_task_key"]), tasks[0] if tasks else None)
        try:
            _send_podelam_notify_email(row["email"], row["full_name"], main_task, float(row["gap_amount"] or 0))
            cur2 = conn.cursor()
            cur2.execute(
                f"UPDATE {SCHEMA}.podelam_daily_plans SET notified_at = NOW() WHERE id = %s",
                (row["plan_id"],)
            )
            conn.commit()
            sent.append(row["user_id"])
        except Exception as e:
            conn.rollback()
            failed.append({"user_id": row["user_id"], "error": str(e)})

    return ok({"ok": True, "sent": sent, "failed": failed, "total_found": len(rows)})


def handle_podelam_stats(event: dict, conn) -> dict:
    """Возвращает статистику выполненных дел и денег (потенциал/факт) за неделю и месяц."""
    session_id = (event.get("headers") or {}).get("X-Session-Id", "")
    if not session_id:
        return err("Не авторизован", 401)
    user = get_lk_user_by_session(session_id, conn)
    if not user:
        return err("Сессия истекла", 401)

    week = _compute_period_stats(conn, user["id"], 7)
    month = _compute_period_stats(conn, user["id"], 30)

    return ok({"week": week, "month": month})


# ── Автопубликация ежедневного экспертного поста (ИИ, модель terra) в блог ────

CONTENT_AI_URL = "https://polza.ai/api/v1/chat/completions"
CONTENT_AI_MODEL = "openai/gpt-5.6-terra"

CONTENT_CATEGORIES = {
    "marketing": "Маркетинг",
    "upsell": "Допродажи",
    "clients": "Работа с клиентами",
    "tools": "Инструменты платформы",
}

# Строгий порядок ротации тем: сегодня — маркетинг, завтра — допродажи, послезавтра — работа
# с клиентами, послепослезавтра — инструменты платформы, затем снова по кругу. Категория
# следующего поста вычисляется от категории последнего опубликованного поста (см.
# get_next_content_category), а не от дня недели — это устойчиво к пропущенным дням публикации.
CONTENT_CATEGORY_ORDER = ["marketing", "upsell", "clients", "tools"]

# Каждый пост пишется для ОДНОЙ конкретной роли читателя (не «для всех сразу»), роль ротируется
# независимо от категории по тому же принципу — от роли последнего опубликованного поста.
CONTENT_ROLES = {
    "owner": "Владелец салона",
    "admin": "Администратор салона",
    "master": "Мастер",
    "massage": "Массажист",
}
CONTENT_ROLE_ORDER = ["owner", "admin", "master", "massage"]

# Что именно волнует каждую роль и под каким углом раскрывать ЛЮБУЮ тему/категорию именно для неё —
# этот блок подставляется в промпт ИИ вместе с темой и категорией, чтобы получить разные,
# не взаимозаменяемые посты из одной и той же категории для разных ролей.
CONTENT_ROLE_GUIDANCE = {
    "owner": """Пишешь для ВЛАДЕЛЬЦА САЛОНА — человека, который отвечает за бизнес в целом, а не за одну процедуру.
Его волнует: выручка и рентабельность салона целиком, загрузка расписания у ВСЕХ мастеров, наём и мотивация команды, \
системы и процессы (а не разовые действия), инвестиции в рекламу и их окупаемость, репутация салона, масштабирование.
Раскрывай тему через призму управления: что владельцу нужно ВНЕДРИТЬ или НАСТРОИТЬ на уровне салона, а не что сделать \
руками самому. Пример разницы: не «напишите клиенту сообщение», а «выстройте систему возврата клиентов через админа \
и шаблоны сообщений с контролем выполнения».""",
    "admin": """Пишешь для АДМИНИСТРАТОРА САЛОНА — человека, который встречает и записывает клиентов, отвечает на \
звонки и сообщения, но обычно не проводит процедуры сам.
Его волнует: как правильно вести переписку и звонки, как не потерять запись, как мягко предлагать допуслуги на \
ресепшене без ощущения впаривания, как работать с недовольным клиентом на входе, как заполнять окна в расписании \
мастеров, как отвечать на отзывы. Раскрывай тему через конкретные фразы и сценарии диалога у стойки/в переписке — \
администратору нужны готовые формулировки, а не общая стратегия.""",
    "master": """Пишешь для МАСТЕРА (парикмахер, косметолог, мастер маникюра, бровист и т.п.) — человека, который сам \
выполняет процедуру и лично общается с клиентом во время визита.
Его волнует: личный доход и загрузка СВОЕГО расписания, как аккуратно предложить допуслугу прямо во время процедуры, \
как построить доверие с клиентом за один визит, как получить повторную запись и рекомендацию, личный бренд в соцсетях, \
как не «продавать», а по-настоящему помогать клиенту выбрать решение. Раскрывай тему через личное общение мастера \
с клиентом один на один, а не через процессы всего салона.""",
    "massage": """Пишешь для МАССАЖИСТА / СПЕЦИАЛИСТА ПО ТЕЛУ (массаж, остеопатия, телесные практики) — человека, \
чья работа завязана на длительном тактильном контакте и телесном комфорте клиента, а не на визуальном результате.
Его волнует: как выстроить доверие через телесный контакт и профессиональные границы, как объяснить клиенту курсовой \
характер лечения (а не разовую процедуру), как предложить курс сеансов или абонемент без давления, как реагировать \
на дискомфорт или стеснение клиента, как объяснить противопоказания и подготовку к сеансу, как удерживать клиента на \
регулярный уход, а не разовый визит «когда прихватит спину». Раскрывай тему с учётом специфики телесной работы, а не \
общих бьюти-процедур, и без медицинских диагнозов/обещаний лечения.""",
}


def get_next_content_role(conn) -> str:
    """Определяет роль читателя для следующего поста по ротации owner → admin → master → massage,
    отталкиваясь от роли последнего опубликованного поста (независимо от категории)."""
    cur = conn.cursor()
    cur.execute(
        f"SELECT role FROM {SCHEMA}.content_posts WHERE role IS NOT NULL ORDER BY post_date DESC LIMIT 1"
    )
    row = cur.fetchone()
    last_role = row[0] if row else None
    if last_role not in CONTENT_ROLE_ORDER:
        return CONTENT_ROLE_ORDER[0]
    idx = CONTENT_ROLE_ORDER.index(last_role)
    return CONTENT_ROLE_ORDER[(idx + 1) % len(CONTENT_ROLE_ORDER)]

CONTENT_TOPICS_BY_CATEGORY = {
    "marketing": [
        "как заполнить окна в расписании мастера в межсезонье",
        "как правильно вести соцсети салона, чтобы шли записи, а не лайки",
        "как настроить сарафанное радио так, чтобы оно реально работало",
        "как мастеру выйти на стабильный доход без хаотичной записи",
        "с чего начать продвижение нового салона в районе без бюджета на рекламу",
        "как посчитать, сколько реально стоит один новый клиент из рекламы",
        "какие офферы работают лучше скидок для привлечения новых клиентов",
        "как использовать сторис и Reels, чтобы они приводили именно записи",
    ],
    "upsell": [
        "как поднять средний чек через допуслуги без давления на клиента",
        "как посчитать реальную прибыльность мастера, а не только выручку",
        "как выстроить систему допродаж в салоне без раздражения клиентов",
        "какие 3 метрики салону нужно смотреть каждую неделю",
        "как предлагать абонементы и пакеты услуг так, чтобы их покупали",
        "как обучить администратора допродажам без скриптов-роботов",
        "как формировать комплекты услуг, которые увеличивают чек на 20-30%",
    ],
    "clients": [
        "как удержать клиента, который давно не приходил",
        "как получать больше отзывов и повторных визитов",
        "как мотивировать мастеров расти в доходе, а не просто отрабатывать смену",
        "как вернуть клиентов, которые ушли к конкурентам",
        "как выстроить систему напоминаний о записи, чтобы снизить неявки",
        "как разговаривать с недовольным клиентом, чтобы он остался",
        "как превратить разовых клиентов в постоянных за первые три визита",
    ],
    # Каждый инструмент платформы можно раскрывать не одним постом, а серией: обзор — для кого —
    # как пользоваться — какую задачу решает. Список тем расширяется по мере роста платформы,
    # ротация тем внутри категории (как и у остальных категорий) исключает повтор последних 5 тем.
    "tools": [
        "ПоДелам: обзор навигатора дохода — как ИИ строит план на день по вашим реальным данным",
        "ПоДелам: для кого этот навигатор и как он подстраивается под роль — владелец, администратор, мастер",
        "ПоДелам: как правильно пользоваться навигатором каждый день, чтобы он реально приносил доход",
        "Академия Промт Диалог: чем обучение внутри платформы отличается от курсов на сторонних площадках",
        "Академия: почему удобно применять знания сразу на месте, не отходя от урока, и задавать вопросы ИИ по ходу занятия",
        "Академия: для кого подойдут курсы — от новичка-мастера до владельца сети салонов",
        "Академия: как устроены уроки и домашние задания и почему это не просто видео",
        "Мой салон: зачем заполнять профиль салона и как это раскрывает все ИИ-инструменты платформы",
        "Аудит салона: как ИИ за пару минут находит слабые места в работе салона и точки роста дохода",
        "Аудит персонала: как понять, кто из мастеров недорабатывает, а кто тянет команду вперёд",
        "Генератор ответов на отзывы: как отвечать на отзывы так, чтобы это работало на репутацию",
        "Скрипты общения с клиентом: готовые сценарии для администратора и мастера на сложные ситуации",
        "Портрет целевой аудитории и офферы: как ИИ помогает понять, кому и что предлагать",
        "Семантика и объявления для Яндекс.Директ: как запустить рекламу салона без агентства",
        "Медиаплан для рекламы: как ИИ считает бюджет и прогнозирует поток клиентов",
        "Генератор постов для соцсетей: как за пару минут получить готовый пост с картинкой",
        "Генерация изображений и видео для соцсетей: как оформлять сторис и рилс без дизайнера",
        "Конструктор лендингов: как собрать продающую страницу салона без программиста",
        "Диагностика мышления, барьеров и финансов: зачем мастеру и владельцу знать свои слабые места",
        "ИИ-агент салона: как задать вопрос по бизнесу и получить разбор с учётом данных вашего салона",
        "Диагностика тела клиента: как инструмент помогает мастеру точнее находить причину проблемы",
        "Чемпионат салонов: как участие в конкурсе приносит новых клиентов и узнаваемость",
    ],
}

# Карта «тема поста категории tools → карточка перехода к инструменту/курсу». Ссылка строго
# детерминирована (не выдумывается ИИ), чтобы вести читателя ровно в тот раздел личного кабинета,
# о котором рассказывает пост. tab — вкладка кабинета (Tab), tool — id инструмента внутри неё
# (открывается автоматически через sessionStorage), None — просто открыть вкладку целиком.
CONTENT_TOOLS_TOPIC_LINKS: dict[str, dict] = {
    "ПоДелам: обзор навигатора дохода — как ИИ строит план на день по вашим реальным данным": {
        "label": "Открыть навигатор «ПоДелам»", "desc": "Персональный план дел на сегодня уже ждёт в кабинете",
        "icon": "Compass", "tab": "home", "tool": None,
    },
    "ПоДелам: для кого этот навигатор и как он подстраивается под роль — владелец, администратор, мастер": {
        "label": "Открыть навигатор «ПоДелам»", "desc": "План строится под вашу роль и данные вашего салона",
        "icon": "Compass", "tab": "home", "tool": None,
    },
    "ПоДелам: как правильно пользоваться навигатором каждый день, чтобы он реально приносил доход": {
        "label": "Открыть навигатор «ПоДелам»", "desc": "Загляните и отметьте первое дело на сегодня",
        "icon": "Compass", "tab": "home", "tool": None,
    },
    "Академия Промт Диалог: чем обучение внутри платформы отличается от курсов на сторонних площадках": {
        "label": "Перейти в Академию", "desc": "Курсы по ролям — смотрите урок и сразу закрепляйте на практике",
        "icon": "GraduationCap", "tab": "academy", "tool": None,
    },
    "Академия: почему удобно применять знания сразу на месте, не отходя от урока, и задавать вопросы ИИ по ходу занятия": {
        "label": "Перейти в Академию", "desc": "Задайте вопрос по уроку прямо на странице обучения",
        "icon": "GraduationCap", "tab": "academy", "tool": None,
    },
    "Академия: для кого подойдут курсы — от новичка-мастера до владельца сети салонов": {
        "label": "Перейти в Академию", "desc": "Курсы для владельца, администратора, мастера и специалиста по телу",
        "icon": "GraduationCap", "tab": "academy", "tool": None,
    },
    "Академия: как устроены уроки и домашние задания и почему это не просто видео": {
        "label": "Перейти в Академию", "desc": "Модули, домашние задания и отслеживание прогресса обучения",
        "icon": "GraduationCap", "tab": "academy", "tool": None,
    },
    "Мой салон: зачем заполнять профиль салона и как это раскрывает все ИИ-инструменты платформы": {
        "label": "Заполнить профиль салона", "desc": "Откройте персонализацию всех ИИ-инструментов платформы",
        "icon": "Building2", "tab": "salon", "tool": None,
    },
    "Аудит салона: как ИИ за пару минут находит слабые места в работе салона и точки роста дохода": {
        "label": "Пройти аудит салона", "desc": "Найдите узкие места и точки роста дохода за пару минут",
        "icon": "ClipboardCheck", "tab": "ai", "tool": "salon-audit",
    },
    "Аудит персонала: как понять, кто из мастеров недорабатывает, а кто тянет команду вперёд": {
        "label": "Открыть аудит персонала", "desc": "Разбор по каждому мастеру и расчёт потенциала роста",
        "icon": "Users", "tab": "ai", "tool": "staff-audit",
    },
    "Генератор ответов на отзывы: как отвечать на отзывы так, чтобы это работало на репутацию": {
        "label": "Открыть генератор ответов на отзывы", "desc": "Готовый ответ под площадку и тон за несколько секунд",
        "icon": "MessageCircle", "tab": "ai", "tool": "review-reply",
    },
    "Скрипты общения с клиентом: готовые сценарии для администратора и мастера на сложные ситуации": {
        "label": "Открыть скрипты общения с клиентом", "desc": "Готовые сценарии диалогов под вашу ситуацию",
        "icon": "MessagesSquare", "tab": "ai", "tool": "client-scripts",
    },
    "Портрет целевой аудитории и офферы: как ИИ помогает понять, кому и что предлагать": {
        "label": "Открыть портрет аудитории", "desc": "Первый шаг маркетинговой цепочки — портреты клиентов и офферы",
        "icon": "Users", "tab": "marketing", "tool": "audience",
    },
    "Семантика и объявления для Яндекс.Директ: как запустить рекламу салона без агентства": {
        "label": "Открыть семантику для Директа", "desc": "Список запросов и готовые объявления под ваши услуги",
        "icon": "Search", "tab": "marketing", "tool": "semantics",
    },
    "Медиаплан для рекламы: как ИИ считает бюджет и прогнозирует поток клиентов": {
        "label": "Рассчитать медиаплан", "desc": "Бюджет, стратегия и прогноз клиентов по данным вашего салона",
        "icon": "Calculator", "tab": "marketing", "tool": "budget",
    },
    "Генератор постов для соцсетей: как за пару минут получить готовый пост с картинкой": {
        "label": "Открыть генератор постов", "desc": "Тема → заголовки → готовый текст с картинкой за пару минут",
        "icon": "FileText", "tab": "marketing", "tool": "post-gen",
    },
    "Генерация изображений и видео для соцсетей: как оформлять сторис и рилс без дизайнера": {
        "label": "Открыть генерацию изображений", "desc": "Визуалы под пост, сторис или баннер без дизайнера",
        "icon": "Image", "tab": "marketing", "tool": "image-gen",
    },
    "Конструктор лендингов: как собрать продающую страницу салона без программиста": {
        "label": "Смотреть «Развитие салона»", "desc": "Здесь появится конструктор лендингов и другие ИИ-инструменты",
        "icon": "LayoutTemplate", "tab": "ai", "tool": None,
    },
    "Диагностика мышления, барьеров и финансов: зачем мастеру и владельцу знать свои слабые места": {
        "label": "Пройти диагностику", "desc": "Тесты мышления, барьеров и финансовых привычек с рекомендациями",
        "icon": "Brain", "tab": "tools", "tool": None,
    },
    "ИИ-агент салона: как задать вопрос по бизнесу и получить разбор с учётом данных вашего салона": {
        "label": "Задать вопрос ИИ-агенту", "desc": "Чат с ИИ-ассистентом прямо в навигаторе «ПоДелам»",
        "icon": "Sparkles", "tab": "home", "tool": None,
    },
    "Диагностика тела клиента: как инструмент помогает мастеру точнее находить причину проблемы": {
        "label": "Открыть диагностику тела клиента", "desc": "Возможные причины, зоны компенсации и рекомендации",
        "icon": "Stethoscope", "tab": "tools", "tool": None,
    },
    "Чемпионат салонов: как участие в конкурсе приносит новых клиентов и узнаваемость": {
        "label": "Открыть чемпионат салонов", "desc": "Турниры, голосование и рейтинг — узнаваемость для вашего салона",
        "icon": "Trophy", "tab": "championship", "tool": None,
    },
}


def get_next_content_category(conn) -> str:
    """Определяет категорию следующего поста по строгой ротации marketing → upsell → clients → tools,
    отталкиваясь от категории последнего опубликованного поста."""
    cur = conn.cursor()
    cur.execute(
        f"SELECT category FROM {SCHEMA}.content_posts WHERE category IS NOT NULL ORDER BY post_date DESC LIMIT 1"
    )
    row = cur.fetchone()
    last_category = row[0] if row else None
    if last_category not in CONTENT_CATEGORY_ORDER:
        return CONTENT_CATEGORY_ORDER[0]
    idx = CONTENT_CATEGORY_ORDER.index(last_category)
    return CONTENT_CATEGORY_ORDER[(idx + 1) % len(CONTENT_CATEGORY_ORDER)]


CONTENT_TOOLS_REFERENCE = """СПРАВКА ПО ИНСТРУМЕНТАМ И ПРОДУКТАМ ПЛАТФОРМЫ «ПРОМТ ДИАЛОГ» (используй ТОЛЬКО эти факты, \
ничего не выдумывай и не дописывай функции, которых здесь нет):

— ПоДелам (навигатор дохода) — стартовая страница личного кабинета. ИИ анализирует доход, средний чек, базу клиентов \
и роль пользователя (владелец/администратор/мастер) и строит персональный план дел на день с конкретными задачами, \
показывает прогресс к цели месяца. У владельцев и администраторов с заполненным профилем салона план учитывает \
реальные данные сотрудников с ротацией фокус-сотрудника по дням.

— Академия — курсы и уроки внутри личного кабинета, разбиты по ролям: для владельца, для администратора, для мастера, \
для специалиста по телу. Уроки — не просто видео: есть модули, домашние задания, отслеживание прогресса. Главное \
отличие от курсов на сторонних площадках — можно применить знание сразу на практике и задать вопрос по уроку, не \
уходя со страницы обучения, без необходимости искать ответы в интернете или ждать вебинара.

— Мой салон — раздел профиля салона: название, город, адрес, средний чек, выручка, количество клиентов и мастеров, \
услуги с ценами и длительностью, целевая аудитория, тон общения, логотип. После заполнения открывается персонализация \
всех ИИ-инструментов платформы под конкретный салон.

— Аудит салона — владелец отвечает на вопросы о салоне (доход, чек, штат, клиенты), ИИ за короткое время находит \
узкие места и точки роста дохода, даёт конкретные рекомендации.

— Аудит персонала — владелец вносит данные по каждому мастеру (опыт, клиенты, возврат, доход, апселл, сервис), ИИ \
анализирует и показывает, кто из команды тянет результат, а кому нужна поддержка и развитие, считает потенциал роста.

— Генератор ответов на отзывы — готовит ответ на отзыв клиента с учётом площадки (2ГИС, Яндекс, Google, Авито), тона \
и характера отзыва (позитивный/негативный/нейтральный).

— Скрипты общения с клиентом — готовые сценарии диалогов для администратора (звонки, запись), мастера (общение во \
время процедуры) и управляющего (сложные ситуации, VIP-клиенты) под конкретную ситуацию.

— Маркетинговая цепочка для рекламы: портрет целевой аудитории → офферы под сегмент аудитории → семантическое ядро \
запросов → готовые объявления для Яндекс.Директ → медиаплан с расчётом бюджета и прогнозом клиентов. Каждый шаг \
использует результат предыдущего.

— Маркетинговая цепочка для соцсетей: генератор постов (тема → заголовки → готовый текст), генерация изображений под \
формат (пост, сторис, баннер), генерация коротких видео для сторис и рилс.

— Конструктор лендингов — сборка продающей страницы салона по типу (классический, сторителлинг, портфолио и т.д.) без \
участия программиста, с готовыми блоками (шапка, услуги, галерея, отзывы, контакты).

— Диагностика мышления, барьеров, финансов и профиля личности — тесты для владельца и мастера, которые показывают \
психологические и деловые ограничения, мешающие расти в доходе, и дают персональные рекомендации.

— ИИ-агент салона — чат с ИИ-ассистентом, который отвечает на вопросы по бизнесу с учётом данных конкретного салона \
(режим «По салону») или в свободном режиме, поддерживает загрузку файлов и таблиц для анализа.

— Диагностика тела клиента — карточка для мастера с возможными причинами проблемы, зонами компенсации, способами \
проверки и рекомендациями, помогает точнее определить, в чём истинная причина запроса клиента.

— Чемпионат салонов — конкурс среди салонов с турнирами по направлениям, загрузкой работ, голосованием и рейтингом \
уровней (от «Новичок» до «Легенда»), победители получают призы; участие даёт салону дополнительную узнаваемость и \
доверие у клиентов.
"""


def call_content_ai(topic: str, category: str, role: str) -> dict | None:
    """Просит ИИ написать продуманную экспертную статью на заданную тему строго в рамках одной
    из четырёх категорий блога и для ОДНОЙ конкретной роли читателя (владелец/администратор/
    мастер/массажист). Возвращает None при ошибке."""
    api_key = os.environ.get("POLZA_AI_API_KEY", "")
    if not api_key:
        return None

    category_label = CONTENT_CATEGORIES.get(category, category)
    role_label = CONTENT_ROLES.get(role, role)
    role_guidance = CONTENT_ROLE_GUIDANCE.get(role, "")
    tools_reference_block = f"\n{CONTENT_TOOLS_REFERENCE}\n" if category == "tools" else ""

    system_prompt = f"""Ты — практикующий эксперт по бизнесу в бьюти-индустрии, ведёшь блог «Промт Диалог» (платформа \
для салонов красоты и мастеров: маркетинг, обучение, ИИ-инструменты, навигатор дохода «ПоДелам»).

Блог строго разделён на четыре постоянные рубрики, и сегодняшний пост должен относиться ТОЛЬКО к рубрике «{category_label}»:
- Маркетинг — привлечение новых клиентов, продвижение, соцсети, реклама, сарафанное радио, заполнение окон в записи.
- Допродажи — рост среднего чека, допуслуги, абонементы, пакеты услуг, финансовая аналитика мастера/салона.
- Работа с клиентами — удержание, возврат ушедших, отзывы, повторные визиты, коммуникация с клиентом, мотивация мастеров.
- Инструменты платформы — обзоры и практическое применение конкретных инструментов и разделов личного кабинета \
«Промт Диалог»: для кого инструмент, какую задачу решает, как им пользоваться. Один инструмент можно раскрывать \
разными постами под разным углом (обзор, для кого, как пользоваться пошагово, какую проблему решает) — сегодняшний \
пост должен раскрывать только ОДИН инструмент или один шаг работы с ним, а не пересказывать весь список сразу.
Не смешивай рубрики: если тема пограничная, раскрывай её строго под углом «{category_label}», не уходя в другие темы.
{tools_reference_block}
КРИТИЧЕСКИ ВАЖНО — ОДИН ПОСТ, ОДНА РОЛЬ ЧИТАТЕЛЯ: сегодняшний пост пишется СТРОГО для роли «{role_label}», а не \
«для всех сразу». Обращайся к читателю так, будто он один конкретный человек в этой роли, а не абстрактный «мастер \
или владелец». Не пытайся охватить сразу все роли в одном посте — раскрывай тему ТОЛЬКО под углом «{role_label}»:
{role_guidance}

Напиши пост на тему «{topic}» именно для роли «{role_label}» строго в рамках рубрики «{category_label}».

Требования к тексту:
- Пиши как живой человек, который сам через это прошёл — без воды, без вступлений типа "в наше время" или \
"многие сталкиваются", без канцелярита и штампов.
- Текст должен быть продуманным и структурным: сначала суть проблемы в 1-2 фразах, затем 3-4 конкретных шага или приёма, \
которые можно применить уже сегодня.
- Там, где уместно, используй конкретные цифры для примера (проценты, суммы в рублях, количество клиентов, сроки) — \
это должны быть реалистичные ориентиры, а не выдуманная точность. Не в каждом предложении, а там, где цифра усиливает совет.
- Каждое предложение — по делу: конкретный совет, цифра, пример или чёткий шаг. Никаких общих фраз "нужно улучшать \
сервис" — только конкретика типа "что именно сделать".
- Тон — дружелюбный эксперт, на "вы", простыми словами, будто объясняешь коллеге за чашкой кофе.
- В конце можно органично, без давления, упомянуть, что похожие задачи в один клик решает навигатор дохода \
«ПоДелам» в личном кабинете «Промт Диалог» — но только если это уместно по теме, не в каждом посте.
- В самом конце добавь 4-6 релевантных хэштегов на русском по теме поста, роли и ниши (например #салонкрасоты \
#владелецсалона #маркетингдлясалона) — без хэштегов на отвлечённые темы.

Отвечай СТРОГО в формате JSON, без markdown-обёртки:
{{
  "title": "Короткий цепляющий заголовок, до 60 знаков",
  "excerpt": "Превью-анонс на 1-2 предложения, до 150 знаков, без спойлера сути",
  "body": "Полный текст статьи, 900-1400 знаков, без хэштегов, можно с переносами строк \\n",
  "hashtags": ["хэштег1", "хэштег2"]
}}

ДОПОЛНИТЕЛЬНЫЕ ТРЕБОВАНИЯ К КАЧЕСТВУ И СТИЛЮ

Пиши так, будто текст подготовил сильный практик салонного бизнеса, который сам работал в роли «{role_label}», \
ежедневно общается с клиентами или командой в этой роли, видит типичные ошибки и понимает экономику записи именно \
с этой позиции. Текст должен вызывать ощущение живого человеческого опыта, а не шаблонной статьи, созданной ИИ.

Главная задача публикации — не просто дать информацию, а помочь читателю в роли «{role_label}» увидеть конкретную \
точку роста именно в своей зоне ответственности и захотеть применить совет в работе уже сегодня.

Целевая аудитория ЭТОГО поста — ТОЛЬКО «{role_label}» (см. полное описание роли выше). Не адресуй советы другим \
ролям и не пытайся быть полезным «для всех сразу» — специалист в другой роли должен читать этот пост и понимать, \
что он написан не совсем про его ситуацию, а другой читатель в роли «{role_label}» должен узнать себя с первых строк.

КАТЕГОРИИ И УГЛЫ РАСКРЫТИЯ

1. «Маркетинг»
Раскрывай практические способы получать обращения и записи: позиционирование, упаковка услуг, офферы, контент, \
Telegram, соцсети, реклама, отзывы, повторные визиты, сегментация клиентской базы, акции без обесценивания, личный \
бренд мастера, маркетинг салона.
Показывай разницу между «просто выкладывать посты» и выстраивать понятный путь клиента к записи.

2. «Допуслуги»
Рассказывай, как экологично и профессионально предлагать дополнительные услуги, комплексы, абонементы, домашний уход, \
подарочные сертификаты и повторные визиты.
Главный принцип: не навязывать и не давить, а подбирать решение под задачу клиента. Объясняй, как увеличить средний \
чек через заботу, диагностику потребностей, понятную рекомендацию и корректную коммуникацию.

3. «Работа с клиентами»
Раскрывай темы первого контакта, доверия, переписки, консультации, диагностики запроса, возражений, опозданий, \
отмен, конфликтов, удержания, повторных записей, сервиса и рекомендаций.
Показывай, что клиент возвращается не только из-за качества процедуры, но и из-за ощущения: его услышали, поняли и \
предложили подходящее решение.

4. «Инструменты платформы»
Раскрывай конкретный инструмент или раздел личного кабинета «Промт Диалог» строго по фактам из СПРАВКИ ПО \
ИНСТРУМЕНТАМ выше — не придумывай функции и цифры результата, которых там нет.
Выбирай один из ракурсов под тему поста: что это за инструмент и зачем он нужен (обзор); для кого он подходит и в \
какой ситуации им стоит воспользоваться; как им пользоваться пошагово; какую конкретную проблему салона или мастера \
он снимает. Один пост — один инструмент и один ракурс, не пытайся пересказать весь функционал сразу.
Пиши не как рекламный буклет с перечислением фич, а как разбор конкретной ситуации: специалист сталкивается с \
проблемой — и показываешь, каким шагом в кабинете эта проблема снимается, что человек увидит и сделает на экране.
Для темы про Академию отдельно подчеркни: обучение устроено так, что не нужно уходить с урока в поиск ответа — можно \
сразу закрепить материал на практике и задать вопрос по ходу занятия, это и есть главное отличие от курсов на \
сторонних площадках.

ПРИНЦИПЫ СОДЕРЖАНИЯ

— Начинай с сильного, узнаваемого наблюдения, типичной ошибки, короткой ситуации из практики или неудобного вопроса. \
Не начинай с общих фраз вроде «в современном мире», «каждый мастер знает», «важно понимать».
— Выбирай одну главную мысль на публикацию и раскрывай её глубоко, без попытки охватить всё сразу.
— Используй конкретику: примеры формулировок, мини-диалоги, чек-листы, сценарии, ошибки, последовательность действий, \
варианты фраз для клиента.
— Добавляй профессиональные нюансы, о которых редко говорят открыто: почему акция не даёт записей, почему клиент \
молчит после консультации, почему дорогая услуга не продаётся, почему мастер боится рекомендовать допуслугу, почему \
красивый контент не превращается в выручку.
— Не выдумывай статистику, исследования, кейсы, отзывы, доходы, результаты клиентов или личный опыт автора. Если \
нужен пример — используй реалистичную обезличенную ситуацию: «например», «представьте ситуацию», «часто бывает так».
— Не обещай гарантированный результат, быстрые деньги, поток клиентов или рост дохода. Вместо этого показывай \
действия, которые повышают вероятность записи, доверия и возвращаемости.
— Не используй манипулятивные, агрессивные или обесценивающие продажи. Не обвиняй мастеров и владельцев салонов.
— Не давай медицинских диагнозов, обещаний лечения или опасных рекомендаций. Для тем, связанных со здоровьем и \
процедурами, сохраняй профессиональную этику и при необходимости рекомендуй направить клиента к профильному врачу.

СТИЛЬ «НАПИСАНО ЧЕЛОВЕКОМ»

— Пиши естественным, уверенным, профессиональным русским языком.
— Чередуй короткие и средние предложения. Допускаются живые фразы, уместные вопросы, аккуратные авторские наблюдения.
— Не злоупотребляй канцеляритом, англицизмами, пафосом, штампами и «инфобизнесовыми» формулировками.
— Не используй слишком много эмодзи. Если формат Telegram требует эмодзи, используй максимум 1–3 и только по смыслу.
— Не повторяй одну мысль разными словами ради объёма.
— Избегай шаблонных конструкций: «это не просто…, это…», «важно помнить», «ключ к успеху», «в условиях высокой \
конкуренции», «прокачать», «выйти на новый уровень», «увеличить прибыль в разы».
— Не используй чрезмерно рекламный тон. Сначала польза и профессиональный разбор, затем — мягкое, логичное \
приглашение воспользоваться инструментом.
— Пиши не «для всех», а так, чтобы читатель узнавал себя: мастера с окнами в записи, владельца салона с нестабильной \
загрузкой, администратора, который отвечает клиентам слишком формально, специалиста, который стесняется предложить \
следующий шаг.

ИНТЕГРАЦИЯ «ПРОМТ ДИАЛОГ» И НАВИГАТОРА «ПО ДЕЛАМ»

Органично связывай тему статьи с возможностями платформы «Промт Диалог» и навигатора «ПоДелам», но не превращай \
каждую публикацию в рекламный текст.

Передавай ключевую идею: хорошего специалиста недостаточно «просто ждать», пока о нём узнают. Качественная работа, \
рекомендации и профессионализм важны, но клиенту нужно помочь сделать следующий шаг: заметить специалиста, понять \
ценность услуги, почувствовать доверие и записаться.

«Промт Диалог» и навигатор «ПоДелам» — это практические инструменты, которые помогают специалистам и салонам не \
ждать случайного потока клиентов, а системно выстраивать коммуникацию, контент, предложения, рекламу, запись и \
возврат клиентов.

Упоминай продукт только там, где он действительно помогает решить описанную проблему. Например:
— если речь о портрете аудитории, офферах, контенте или рекламе — можно упомянуть ИИ-инструменты «Промт Диалог»;
— если тема касается конкретных действий для роста, порядка в продвижении и следующих шагов — можно упомянуть \
навигатор «ПоДелам»;
— если речь о продаже услуг, работе с возражениями, сценариях общения, повторной записи — можно упомянуть скрипты, \
диагностику клиента, генератор контента или программы Академии;
— если тема о продвижении салона — можно упомянуть маркетинговую цепочку, медиаплан, объявления или конструктор \
лендингов.

Используй мягкие варианты CTA:
— «Если хотите не гадать, что делать с продвижением дальше, начните с навигатора "ПоДелам".»
— «В "Промт Диалог" можно собрать оффер, идеи для контента и сценарии общения под вашу конкретную услугу.»
— «Необязательно делать всё вручную: часть маркетинговой рутины можно собрать в инструментах "Промт Диалог".»
— «Когда есть понятный следующий шаг, продвижение перестаёт быть хаотичной попыткой "что-нибудь выложить".»
— «Навигатор "ПоДелам" помогает увидеть, какое действие сейчас действительно приблизит вас к записи, а не просто \
создаст ощущение занятости.»

Не используй одинаковый призыв в каждой статье. В части публикаций CTA может быть очень коротким, а в части — \
отсутствовать, если это ухудшает естественность материала.

РЕКОМЕНДУЕМАЯ СТРУКТУРА ПУБЛИКАЦИИ

1. Заголовок. Короткий, конкретный, вызывающий интерес. Без кликбейта и ложных обещаний. Пример логики: проблема + \
причина, ошибка + последствия, ситуация + практическое решение.
2. Сильное вступление. 2–5 предложений: узнаваемая ситуация, мысль или вопрос, который сразу вовлекает читателя.
3. Основной разбор. Объясни, почему возникает проблема. Покажи неочевидную причину, типичные ошибки и последствия.
4. Практическая часть. Дай 3–7 конкретных действий, фраз, шагов, примеров или мини-сценариев, которые можно применить.
5. Короткий вывод. Зафиксируй главную мысль простыми словами.
6. Нативный следующий шаг. При необходимости мягко свяжи материал с «Промт Диалог» или навигатором «ПоДелам». Не \
повторяй описание платформы целиком.

ТРЕБОВАНИЯ К УНИКАЛЬНОСТИ

Перед написанием мысленно проверь, что публикация не похожа на типовую статью из интернета:
— у неё есть конкретный угол зрения;
— в ней нет набора банальных советов.

ВАЖНО ПРО ФОРМАТ ОТВЕТА: несмотря на структуру публикации, описанную выше, финальный ответ всё равно должен быть \
строго тем JSON-объектом с полями title/excerpt/body/hashtags, который задан в инструкции выше — без markdown, без \
служебных полей SEO_TITLE/CATEGORY/TAGS и без текста вне JSON. Категория уже зафиксирована выше как «{category_label}», \
не меняй её и не указывай отдельно. Роль читателя уже зафиксирована выше как «{role_label}», не меняй её и не \
пытайся расширить пост на другие роли."""

    payload = json.dumps({
        "model": CONTENT_AI_MODEL,
        "messages": [{"role": "system", "content": system_prompt}],
        "temperature": 0.75,
        "max_tokens": 1400,
    }).encode("utf-8")

    req = urllib.request.Request(
        CONTENT_AI_URL, data=payload,
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


def handle_content_daily_post(event: dict, conn) -> dict:
    """Cron: генерирует (если ещё нет) и публикует пост дня в блог сайта."""
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

    category = get_next_content_category(conn)
    role = get_next_content_role(conn)
    cur.execute(
        f"""SELECT topic FROM {SCHEMA}.content_posts
            WHERE category = %s AND topic IS NOT NULL
            ORDER BY post_date DESC LIMIT 5""",
        (category,)
    )
    recent_topics = {r["topic"] for r in cur.fetchall()}
    available_topics = [t for t in CONTENT_TOPICS_BY_CATEGORY[category] if t not in recent_topics]
    topic = random.choice(available_topics or CONTENT_TOPICS_BY_CATEGORY[category])

    ai_result = call_content_ai(topic, category, role)
    if not ai_result:
        return err("Не удалось сгенерировать пост", 502)

    raw_tags = ai_result.get("hashtags") or []
    hashtags_str = " ".join(
        t if t.startswith("#") else f"#{t}"
        for t in (raw_tags if isinstance(raw_tags, list) else [raw_tags])
        if t
    )

    # Для категории «tools» подмешиваем детерминированную карточку перехода к инструменту/курсу —
    # ссылка строго из справочника CONTENT_TOOLS_TOPIC_LINKS, ИИ её не придумывает.
    tool_link = CONTENT_TOOLS_TOPIC_LINKS.get(topic) if category == "tools" else None

    # Единственное действие — сохранить статью в блог. Простой INSERT, ничего внешнего.
    cur2 = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur2.execute(
        f"""INSERT INTO {SCHEMA}.content_posts
            (post_date, title, excerpt, body, hashtags, category, topic, role, source,
             tool_link_label, tool_link_desc, tool_link_icon, tool_link_tab, tool_link_tool)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, 'ai', %s, %s, %s, %s, %s)
            ON CONFLICT (post_date) DO NOTHING
            RETURNING *""",
        (today, ai_result["title"], ai_result.get("excerpt") or "", ai_result["body"], hashtags_str, category, topic, role,
         tool_link["label"] if tool_link else None, tool_link["desc"] if tool_link else None,
         tool_link["icon"] if tool_link else None, tool_link["tab"] if tool_link else None,
         tool_link["tool"] if tool_link else None)
    )
    row = cur2.fetchone()
    conn.commit()
    if not row:
        cur.execute(f"SELECT * FROM {SCHEMA}.content_posts WHERE post_date = %s", (today,))
        row = cur.fetchone()
        return ok({"post": dict(row), "created": False})

    return ok({"post": dict(row), "created": True})


def handle_content_list(event: dict, conn) -> dict:
    """Список опубликованных постов для ленты на сайте, с пагинацией (?page, ?limit) и фильтром
    по ?category=marketing|upsell|clients|tools. Полный текст (body) доступен всем читателям без
    авторизации. Посты категории «tools» дополнительно содержат tool_link (заметная карточка-ссылка
    на инструмент/курс Академии, которому посвящён пост) — в формате {label, desc, icon, tab, tool}
    или null, если для темы ссылка не задана. Поле authorized (авторизован ли читатель) остаётся в
    ответе — фронт использует его, чтобы решить, куда вести по клику на tool_link: в кабинет или
    на форму регистрации. ?post_id=N — вернуть конкретный пост по id (для перехода по прямой ссылке
    на статью), игнорируя пагинацию и фильтр категории."""
    qs = event.get("queryStringParameters") or {}
    try:
        limit = min(max(int(qs.get("limit", 6)), 1), 50)
    except ValueError:
        limit = 6
    try:
        page = max(int(qs.get("page", 1)), 1)
    except ValueError:
        page = 1
    offset = (page - 1) * limit
    category = qs.get("category", "")
    try:
        post_id = int(qs.get("post_id", 0)) or None
    except ValueError:
        post_id = None

    session_id = (event.get("headers") or {}).get("X-Session-Id", "")
    is_authorized = bool(session_id and get_lk_user_by_session(session_id, conn))

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    if post_id:
        where_clause = "WHERE id = %s"
        params: tuple = (post_id,)
    else:
        where_clause = ""
        params = ()
        if category and category in CONTENT_CATEGORIES:
            where_clause = "WHERE category = %s"
            params = (category,)

    cur.execute(f"SELECT COUNT(*) AS total FROM {SCHEMA}.content_posts {where_clause}", params)
    total = cur.fetchone()["total"]

    cur.execute(
        f"""SELECT id, post_date, title, excerpt, body, hashtags, category, role, created_at,
                   tool_link_label, tool_link_desc, tool_link_icon, tool_link_tab, tool_link_tool
            FROM {SCHEMA}.content_posts
            {where_clause}
            ORDER BY post_date DESC
            LIMIT %s OFFSET %s""",
        params + (limit if not post_id else 1, offset if not post_id else 0)
    )
    rows = [dict(r) for r in cur.fetchall()]
    for r in rows:
        r["category_label"] = CONTENT_CATEGORIES.get(r.get("category"), "")
        r["role_label"] = CONTENT_ROLES.get(r.get("role"), "")
        if r.get("tool_link_label"):
            r["tool_link"] = {
                "label": r["tool_link_label"], "desc": r["tool_link_desc"],
                "icon": r["tool_link_icon"], "tab": r["tool_link_tab"], "tool": r["tool_link_tool"],
            }
        else:
            r["tool_link"] = None
        for key in ("tool_link_label", "tool_link_desc", "tool_link_icon", "tool_link_tab", "tool_link_tool"):
            r.pop(key, None)

    return ok({
        "posts": rows,
        "categories": CONTENT_CATEGORIES,
        "roles": CONTENT_ROLES,
        "page": page,
        "limit": limit,
        "total": total,
        "has_more": offset + len(rows) < total,
        "authorized": is_authorized,
    })


def handle_content_related(event: dict, conn) -> dict:
    """Похожие посты той же категории для блока «Читать дальше» (?post_id, ?category, ?limit)."""
    qs = event.get("queryStringParameters") or {}
    category = qs.get("category", "")
    try:
        post_id = int(qs.get("post_id", 0))
    except ValueError:
        post_id = 0
    try:
        limit = min(max(int(qs.get("limit", 3)), 1), 10)
    except ValueError:
        limit = 3

    if category not in CONTENT_CATEGORIES:
        return ok({"posts": []})

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"""SELECT id, post_date, title, excerpt, category
            FROM {SCHEMA}.content_posts
            WHERE category = %s AND id != %s
            ORDER BY post_date DESC
            LIMIT %s""",
        (category, post_id, limit)
    )
    rows = [dict(r) for r in cur.fetchall()]
    for r in rows:
        r["category_label"] = CONTENT_CATEGORIES.get(r.get("category"), "")
    return ok({"posts": rows})


# ── Комментарии к постам блога + ответы «Админ Светлана» (ИИ, gpt-4o-mini) ─────

COMMENTS_AI_MODEL = "openai/gpt-4o-mini"
COMMENTS_AI_URL = "https://polza.ai/api/v1/chat/completions"
ADMIN_NAME = "Светлана"

SUPPORT_REDIRECT_REPLY = (
    "По вопросам работы платформы, оплаты или доступа лучше сразу написать в техподдержку "
    "личного кабинета — там быстрее разберутся и подскажут точно по вашему аккаунту."
)


def build_comment_ai_prompt(post_title: str, post_body: str, category_label: str) -> str:
    return f"""Ты — Светлана, администратор блога платформы «Промт Диалог» (инструменты для салонов красоты и мастеров: \
маркетинг, обучение, ИИ-инструменты, навигатор дохода «ПоДелам»). Ты отвечаешь на комментарии читателей под конкретной \
статьёй блога. Никогда, ни при каких условиях не сообщай и не намекай, что ты ИИ, бот, нейросеть или автоматический \
ответ — ты живой администратор блога по имени Светлана.

СТАТЬЯ, ПОД КОТОРОЙ ОСТАВЛЕН КОММЕНТАРИЙ (рубрика «{category_label}»):
Заголовок: {post_title}
Текст: {post_body}

Твоя задача — оценить комментарий читателя и ответить СТРОГО в формате JSON без markdown-обёртки:
{{
  "should_reply": true/false,
  "reply": "текст ответа" | null,
  "redirect_to_support": true/false
}}

Правила:
- should_reply=true, если комментарий — вопрос, просьба уточнить, несогласие по теме статьи или прямое обращение \
к администрации по теме статьи. should_reply=false для простых благодарностей, согласия, эмоциональных реплик без \
вопроса — на них отвечать не нужно (reply тогда null).
- Если вопрос ПО ТЕМЕ СТАТЬИ (уточнение совета, как применить, почему так, личный опыт по теме) — дай развёрнутый, \
полезный, дружелюбный ответ на 2-5 предложений, как живой человек-эксперт, по-русски, на "вы", без канцелярита. \
Можно вести диалог, уточнять детали ситуации читателя, давать дополнительные советы по теме статьи.
- Если вопрос НЕ по теме статьи и не по бьюти-бизнесу вообще, а касается работы самой платформы «Промт Диалог» \
(оплата, доступ, техническая проблема, тарифы, личный кабинет, баг) — redirect_to_support=true, reply = null \
(программно подставится стандартная фраза с просьбой обратиться в техподдержку).
- Если вопрос явно оскорбительный, спам или реклама постороннего — should_reply=false, reply=null.
- Никогда не упоминай, что ты ИИ, модель, бот или автоматика. Ты — Светлана, администратор блога."""


def call_comment_ai(comment_text: str, post_title: str, post_body: str, category_label: str) -> dict | None:
    """Просит ИИ (от имени Админ Светланы) оценить комментарий и сформировать ответ. None при ошибке."""
    api_key = os.environ.get("POLZA_AI_API_KEY", "") or os.environ.get("OPENAI_API_KEY", "")
    if not api_key:
        return None

    system_prompt = build_comment_ai_prompt(post_title, post_body[:2000], category_label)
    payload = json.dumps({
        "model": COMMENTS_AI_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": comment_text[:1500]},
        ],
        "temperature": 0.6,
        "max_tokens": 400,
    }).encode("utf-8")

    req = urllib.request.Request(
        COMMENTS_AI_URL, data=payload,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        content = data["choices"][0]["message"]["content"].strip()
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
            content = content.strip()
        return json.loads(content)
    except (urllib.error.URLError, TimeoutError, KeyError, ValueError, json.JSONDecodeError) as e:
        print(f"[comments_ai] failed: {type(e).__name__}: {e}")
        return None


def handle_comments_list(event: dict, conn) -> dict:
    """Список комментариев к посту (плоский список с parent_id для отображения дерева ответов),
    с количеством лайков на каждом и флагом liked_by_me для авторизованного читателя.
    Ответы Админ Светланы скрыты до наступления visible_at — создаётся видимость, что она
    печатает ответ не мгновенно, а с обычной человеческой задержкой (см. handle_comment_add)."""
    qs = event.get("queryStringParameters") or {}
    try:
        post_id = int(qs.get("post_id", 0))
    except ValueError:
        post_id = 0
    if not post_id:
        return err("Не указан post_id")

    session_id = (event.get("headers") or {}).get("X-Session-Id", "")
    viewer = get_lk_user_by_session(session_id, conn) if session_id else None
    viewer_id = viewer["id"] if viewer else 0

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"""SELECT c.id, c.post_id, c.parent_id, c.author_name, c.is_admin_reply, c.body, c.created_at,
                   COUNT(l.id) AS likes_count,
                   COUNT(l.id) FILTER (WHERE l.user_id = %s) > 0 AS liked_by_me
            FROM {SCHEMA}.content_comments c
            LEFT JOIN {SCHEMA}.content_comment_likes l ON l.comment_id = c.id
            WHERE c.post_id = %s AND c.visible_at <= NOW()
            GROUP BY c.id
            ORDER BY c.created_at ASC""",
        (viewer_id, post_id)
    )
    rows = [dict(r) for r in cur.fetchall()]
    return ok({"comments": rows})


def handle_comment_like(event: dict, conn) -> dict:
    """Переключает лайк текущего пользователя на комментарии (поставить/снять). Требует авторизации."""
    session_id = (event.get("headers") or {}).get("X-Session-Id", "")
    if not session_id:
        return err("Не авторизован", 401)
    user = get_lk_user_by_session(session_id, conn)
    if not user:
        return err("Сессия истекла", 401)

    body = json.loads(event.get("body") or "{}")
    try:
        comment_id = int(body.get("comment_id", 0))
    except (TypeError, ValueError):
        comment_id = 0
    if not comment_id:
        return err("Не указан comment_id")

    cur = conn.cursor()
    cur.execute(
        f"SELECT id FROM {SCHEMA}.content_comments WHERE id = %s",
        (comment_id,)
    )
    if not cur.fetchone():
        return err("Комментарий не найден", 404)

    cur.execute(
        f"SELECT id FROM {SCHEMA}.content_comment_likes WHERE comment_id = %s AND user_id = %s",
        (comment_id, user["id"])
    )
    existing = cur.fetchone()
    if existing:
        cur.execute(
            f"DELETE FROM {SCHEMA}.content_comment_likes WHERE comment_id = %s AND user_id = %s",
            (comment_id, user["id"])
        )
        liked = False
    else:
        cur.execute(
            f"INSERT INTO {SCHEMA}.content_comment_likes (comment_id, user_id) VALUES (%s, %s) "
            f"ON CONFLICT (comment_id, user_id) DO NOTHING",
            (comment_id, user["id"])
        )
        liked = True
    conn.commit()

    cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.content_comment_likes WHERE comment_id = %s", (comment_id,))
    likes_count = cur.fetchone()[0]

    return ok({"comment_id": comment_id, "liked_by_me": liked, "likes_count": likes_count})


def handle_comment_add(event: dict, conn) -> dict:
    """Добавляет комментарий авторизованного пользователя к посту. Если это вопрос/обращение по теме
    статьи — Админ Светлана (ИИ, gpt-4o-mini) отвечает развёрнуто в том же треде; вопросы по работе
    платформы получают ответ с просьбой обратиться в техподдержку личного кабинета вместо содержательного ответа."""
    session_id = (event.get("headers") or {}).get("X-Session-Id", "")
    if not session_id:
        return err("Не авторизован", 401)
    user = get_lk_user_by_session(session_id, conn)
    if not user:
        return err("Сессия истекла", 401)

    body = json.loads(event.get("body") or "{}")
    try:
        post_id = int(body.get("post_id", 0))
    except (TypeError, ValueError):
        post_id = 0
    text = (body.get("text") or "").strip()
    parent_id = body.get("parent_id")
    try:
        parent_id = int(parent_id) if parent_id else None
    except (TypeError, ValueError):
        parent_id = None

    if not post_id:
        return err("Не указан post_id")
    if not text:
        return err("Комментарий не может быть пустым")
    if len(text) > 2000:
        return err("Комментарий слишком длинный")

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT id, title, body, category FROM {SCHEMA}.content_posts WHERE id = %s",
        (post_id,)
    )
    post = cur.fetchone()
    if not post:
        return err("Пост не найден", 404)

    author_name = (user.get("full_name") or "").strip() or "Читатель"

    cur2 = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur2.execute(
        f"""INSERT INTO {SCHEMA}.content_comments (post_id, user_id, parent_id, author_name, is_admin_reply, body)
            VALUES (%s, %s, %s, %s, FALSE, %s)
            RETURNING id, post_id, parent_id, author_name, is_admin_reply, body, created_at""",
        (post_id, user["id"], parent_id, author_name, text)
    )
    new_comment = dict(cur2.fetchone())
    conn.commit()

    # Ответ Админ Светланы — best-effort: если ИИ недоступен или сбой, комментарий пользователя
    # всё равно уже сохранён и опубликован, диалог просто не продолжится автоматически.
    category_label = CONTENT_CATEGORIES.get(post.get("category"), "")
    ai_verdict = call_comment_ai(text, post["title"], post.get("body") or "", category_label)

    admin_reply = None
    # redirect_to_support обрабатываем независимо от should_reply — модель иногда возвращает
    # should_reply=false вместе с redirect_to_support=true (расценивает вопрос не по теме статьи
    # как "не требующий содержательного ответа"), но это тоже полноценный повод ответить.
    if ai_verdict and (ai_verdict.get("should_reply") or ai_verdict.get("redirect_to_support")):
        reply_text = None
        if ai_verdict.get("redirect_to_support"):
            reply_text = SUPPORT_REDIRECT_REPLY
        elif ai_verdict.get("reply"):
            reply_text = ai_verdict["reply"]

        if reply_text:
            # Ответ уже сгенерирован, но публикуется не мгновенно, а с человеческой задержкой
            # (1-2.5 минуты) — иначе видно, что комментарий и ответ появляются одновременно,
            # что выдаёт автоматику. created_at = visible_at (момент фактической публикации),
            # чтобы читатель видел время "написания" таким же, как момент появления в ленте,
            # а не момент, когда ИИ сгенерировал текст на сервере.
            delay_seconds = random.randint(60, 150)
            cur3 = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            cur3.execute(
                f"""INSERT INTO {SCHEMA}.content_comments
                    (post_id, user_id, parent_id, author_name, is_admin_reply, body, created_at, visible_at)
                    VALUES (%s, %s, %s, %s, TRUE, %s,
                            NOW() + (%s || ' seconds')::interval, NOW() + (%s || ' seconds')::interval)
                    RETURNING id, post_id, parent_id, author_name, is_admin_reply, body, created_at, visible_at""",
                (post_id, user["id"], new_comment["id"], ADMIN_NAME, reply_text, delay_seconds, delay_seconds)
            )
            admin_reply = dict(cur3.fetchone())
            conn.commit()

    # admin_reply возвращаем фронту сразу (чтобы можно было показать «печатает…»), но реальный
    # текст ответа станет доступен через comments_list только после visible_at.
    return ok({"comment": new_comment, "admin_reply_pending": admin_reply is not None,
               "admin_reply_delay_seconds": (admin_reply["visible_at"] - admin_reply["created_at"]).total_seconds() if admin_reply else None})


def process_accruals(conn):
    """Переводит pending-начисления в available после 30 дней ожидания."""
    cur = conn.cursor()
    cur.execute(
        f"""UPDATE {SCHEMA}.master_accruals
            SET status = 'available'
            WHERE status = 'pending' AND available_at <= NOW()"""
    )
    if cur.rowcount > 0:
        cur.execute(
            f"""UPDATE {SCHEMA}.master_balance mb
                SET available_amount = available_amount + sub.total,
                    updated_at = NOW()
                FROM (
                    SELECT master_id, SUM(amount) as total
                    FROM {SCHEMA}.master_accruals
                    WHERE status = 'available'
                    GROUP BY master_id
                ) sub
                WHERE mb.master_id = sub.master_id"""
        )
        cur.execute(
            f"UPDATE {SCHEMA}.master_accruals SET status = 'credited' WHERE status = 'available'"
        )
    conn.commit()


def handler(event: dict, context) -> dict:
    """Начисление и просмотр партнёрских вознаграждений мастеров + ПоДелам (навигатор дохода)."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    qs = event.get("queryStringParameters") or {}
    route_action = qs.get("action", "")

    conn = get_db()
    try:
        # ── ПоДелам — навигатор дохода (личный кабинет, X-Session-Id) ────────
        if route_action == "podelam_get":
            return handle_podelam_get(event, conn)
        if route_action == "podelam_save_profile":
            return handle_podelam_save_profile(event, conn)
        if route_action == "podelam_task_done":
            return handle_podelam_task_done(event, conn)
        if route_action == "podelam_stats":
            return handle_podelam_stats(event, conn)
        if route_action == "podelam_set_income":
            return handle_podelam_set_income(event, conn)
        if route_action == "podelam_notify":
            return handle_podelam_notify(event, conn)

        # ── Автопубликация ежедневного поста в блог ───────────────────────────
        if route_action == "content_daily_post":
            return handle_content_daily_post(event, conn)
        if route_action == "content_list":
            return handle_content_list(event, conn)
        if route_action == "content_related":
            return handle_content_related(event, conn)

        # ── Комментарии к постам блога (личный кабинет, X-Session-Id) ────────
        if route_action == "comments_list":
            return handle_comments_list(event, conn)
        if route_action == "comment_add":
            return handle_comment_add(event, conn)
        if route_action == "comment_like":
            return handle_comment_like(event, conn)

        headers = event.get("headers") or {}
        session_id = headers.get("X-Master-Session", "")
        internal_key = headers.get("X-Internal-Key", "")

        # ── GET — история начислений мастера ─────────────────────────────────
        if method == "GET":
            if not session_id:
                return err("Не авторизован", 401)
            master = get_master_by_session(session_id, conn)
            if not master:
                return err("Сессия истекла", 401)

            process_accruals(conn)

            cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

            # Баланс
            cur.execute(
                f"SELECT * FROM {SCHEMA}.master_balance WHERE master_id = %s",
                (master["id"],)
            )
            balance = cur.fetchone() or {}

            # История начислений (последние 50)
            cur.execute(
                f"""SELECT a.amount, a.source_amount, a.source_type, a.status,
                           a.created_at, a.available_at,
                           s.name as salon_name
                    FROM {SCHEMA}.master_accruals a
                    LEFT JOIN {SCHEMA}.salons s ON s.id = a.salon_id
                    WHERE a.master_id = %s
                    ORDER BY a.created_at DESC LIMIT 50""",
                (master["id"],)
            )
            accruals = cur.fetchall()

            # Рефералы (сколько салонов привлёк)
            cur.execute(
                f"""SELECT COUNT(*) as count FROM {SCHEMA}.master_referrals
                    WHERE master_id = %s""",
                (master["id"],)
            )
            referral_count = cur.fetchone()["count"]

            # Запросы на вывод
            cur.execute(
                f"""SELECT * FROM {SCHEMA}.master_withdrawals
                    WHERE master_id = %s ORDER BY created_at DESC LIMIT 10""",
                (master["id"],)
            )
            withdrawals = cur.fetchall()

            return ok({
                "balance": {
                    "pending_amount": float(balance.get("pending_amount") or 0),
                    "available_amount": float(balance.get("available_amount") or 0),
                    "total_earned": float(balance.get("total_earned") or 0),
                    "total_withdrawn": float(balance.get("total_withdrawn") or 0),
                },
                "accruals": [dict(a) for a in accruals],
                "referral_count": int(referral_count),
                "withdrawals": [dict(w) for w in withdrawals],
            })

        # ── POST ─────────────────────────────────────────────────────────────
        if method == "POST":
            body = json.loads(event.get("body") or "{}")
            action = body.get("action") or ""

            # ── Запрос на вывод ───────────────────────────────────────────────
            if action == "withdraw":
                if not session_id:
                    return err("Не авторизован", 401)
                master = get_master_by_session(session_id, conn)
                if not master:
                    return err("Сессия истекла", 401)

                inn = (body.get("inn") or "").strip()
                bank_details = (body.get("bank_details") or "").strip()
                if not inn or len(inn) < 10:
                    return err("Введите корректный ИНН")
                if not bank_details:
                    return err("Укажите реквизиты для перевода")

                cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
                cur.execute(
                    f"SELECT available_amount FROM {SCHEMA}.master_balance WHERE master_id = %s",
                    (master["id"],)
                )
                bal = cur.fetchone()
                available = float(bal["available_amount"]) if bal else 0
                if available < 5000:
                    return err(f"Недостаточно средств. Доступно: {available} ₽, минимум 5 000 ₽")

                cur2 = conn.cursor()
                cur2.execute(
                    f"""INSERT INTO {SCHEMA}.master_withdrawals
                        (master_id, amount, inn, bank_details, status)
                        VALUES (%s, %s, %s, %s, 'pending')""",
                    (master["id"], available, inn, bank_details)
                )
                cur2.execute(
                    f"""UPDATE {SCHEMA}.master_balance
                        SET available_amount = 0,
                            total_withdrawn = total_withdrawn + %s,
                            updated_at = NOW()
                        WHERE master_id = %s""",
                    (available, master["id"])
                )
                conn.commit()
                return ok({"ok": True, "amount": available})

            # ── Внутреннее начисление при покупке энергии ────────────────────
            salon_id = body.get("salon_id")
            amount = float(body.get("amount") or 0)
            source_type = body.get("source_type") or action

            if not salon_id or not amount:
                return err("Нужны salon_id и amount")

            # Проверяем — только реальные платёжные транзакции
            if action not in PAID_ACTIONS:
                return ok({"skipped": True, "reason": f"action '{action}' не является платёжной"})

            # Ищем реферера салона
            cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            cur.execute(
                f"SELECT master_id FROM {SCHEMA}.master_referrals WHERE salon_id = %s",
                (salon_id,)
            )
            ref = cur.fetchone()
            if not ref:
                return ok({"skipped": True, "reason": "Нет реферера для этого салона"})

            master_id = ref["master_id"]
            accrual = round(amount * REFERRAL_PERCENT / 100, 2)
            if accrual <= 0:
                return ok({"skipped": True, "reason": "Сумма слишком мала"})

            available_at = datetime.now(timezone.utc) + timedelta(days=DAYS_HOLD)

            # Записываем начисление
            cur2 = conn.cursor()
            cur2.execute(
                f"""INSERT INTO {SCHEMA}.master_accruals
                    (master_id, salon_id, amount, percent, source_amount, source_type, status, available_at)
                    VALUES (%s, %s, %s, %s, %s, %s, 'pending', %s)""",
                (master_id, salon_id, accrual, REFERRAL_PERCENT, amount, source_type, available_at)
            )

            # Обновляем баланс (pending + total_earned)
            cur2.execute(
                f"""UPDATE {SCHEMA}.master_balance
                    SET pending_amount = pending_amount + %s,
                        total_earned = total_earned + %s,
                        updated_at = NOW()
                    WHERE master_id = %s""",
                (accrual, accrual, master_id)
            )
            conn.commit()

            return ok({
                "accrued": accrual,
                "master_id": str(master_id),
                "salon_id": salon_id,
                "available_at": str(available_at),
            })

    finally:
        conn.close()