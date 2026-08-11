"""
Начисление партнёрского вознаграждения мастерам + «ПоДелам» -- ИИ-навигатор дохода в личном кабинете.
Начисление мастерам ТОЛЬКО при реальной покупке энергии через ЮКассу.
Ручное пополнение и бонусы — не считаются.
Формула: 10% от количества энергий = рубли (100 энергий → 10 ₽).
GET  ?action=podelam_get           — профиль дохода + план на сегодня, план строит ИИ (модель terra через polza.ai) (X-Session-Id).
                                       Для владельцев/администраторов салона с заполненным «Мой салон» дополнительно подмешиваются
                                       реальные данные салона и сотрудников (salon_staff), с ротацией фокус-сотрудника по дням —
                                       сегодня один специалист, завтра другой. Все доп. данные читаются ТОЛЬКО при первой генерации
                                       плана за сутки (кэш в podelam_daily_plans), повторные заходы в этот же день — без единого запроса к ИИ или доп. таблицам.
                                       ТАЙМАУТ ФУНКЦИИ ДОЛЖЕН БЫТЬ НЕ МЕНЕЕ 60с — иначе запрос к ИИ обрывается по 504 и план не сохраняется.
POST ?action=podelam_save_profile  — сохранить диагностику дохода (X-Session-Id)
POST ?action=podelam_task_done     — отметить дело выполненным, опционально с фактической суммой (X-Session-Id)
GET  ?action=podelam_stats         — статистика выполненных дел за неделю/месяц (X-Session-Id)
POST ?action=podelam_set_income    — прибавить фактический доход за день (amount, опц. date, mode="add"|"replace") (X-Session-Id)
GET/POST ?action=podelam_notify&key=ADMIN_TOKEN — cron: письмо пользователям с новым планом на сегодня, у кого ещё не отправлено.
                                       ТАЙМАУТ ФУНКЦИИ ДОЛЖЕН БЫТЬ НЕ МЕНЕЕ 60с при большом числе пользователей.
GET/POST ?action=content_daily_post&key=ADMIN_TOKEN — cron: ИИ пишет ежедневный экспертный пост и публикует в Telegram-канал.
                                       Повторно в этот же день не публикует. ТАЙМАУТ ФУНКЦИИ ДОЛЖЕН БЫТЬ НЕ МЕНЕЕ 60с.
GET  ?action=content_list          — посты для ленты на сайте с пагинацией (page, limit, category).
                                       Полный текст (body) только авторизованным (X-Session-Id), иначе только превью.
GET  ?action=content_related       — похожие посты той же категории (post_id, category, limit) для блока «Читать дальше».
POST / c телом Telegram-апдейта (есть "update_id") — вебхук модерации группы обсуждений Telegram-канала:
                                       удаляет мат/спам/ссылки/нерелевантные фото-видео (бан при повторном нарушении),
                                       коротко отвечает только если сообщение — явный вопрос/обращение к боту.
                                       Заголовок X-Telegram-Bot-Api-Secret-Token сверяется с TELEGRAM_WEBHOOK_SECRET.
GET/POST ?action=set_webhook&key=ADMIN_TOKEN&url=<URL функции> — регистрирует вебхук модерации в Telegram.
GET  ?action=webhook_info&key=ADMIN_TOKEN — текущая информация о вебхуке (диагностика).
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
    "Access-Control-Allow-Headers": "Content-Type, X-Master-Session, X-Internal-Key, X-Session-Id, X-Telegram-Bot-Api-Secret-Token",
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


# ── «ПоДелам» — навигатор дохода ────────────────────────────────────────────

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


# Тесты/инструменты раздела «Развитие персонала», для fallback-режима и ротации
DEVELOPMENT_TOOLS = [
    {"title": "Пройти тест «Мышление с премиум-клиентами»", "button": "Пройти тест", "nav": "tools"},
    {"title": "Пройти тест «Внутренние барьеры специалиста»", "button": "Пройти тест", "nav": "tools"},
    {"title": "Пройти тест «Финансовая грамотность специалиста PRO»", "button": "Пройти тест", "nav": "tools"},
    {"title": "Пройти тест «Финансовый профиль PRO»", "button": "Пройти тест", "nav": "tools"},
]


def build_today_tasks(points: list, day_seed: int = 0) -> list:
    """Из точек роста собирает 3-4 конкретных дела на сегодня со ссылкой на инструмент ЛК.
    Используется как резервный вариант, когда ИИ недоступен — чередует маркетинг, контент
    и развитие персонала (тесты), чтобы план не был однообразным день за днём."""
    task_map = {
        "return_clients": {"title": "Вернуть клиентов", "button": "Создать сообщения", "nav": "clientmsg", "minutes": 20},
        "fill_slots":     {"title": "Заполнить окна",   "button": "Создать оффер",     "nav": "marketing:offers", "minutes": 15},
        "upsell":         {"title": "Поднять чек",      "button": "Получить скрипт",   "nav": "agent", "minutes": 10},
    }
    tasks = []
    for p in points:
        meta = task_map.get(p["key"])
        if not meta:
            continue
        tasks.append({
            "key": p["key"],
            "title": meta["title"],
            "action_text": p["action"],
            "button": meta["button"],
            "nav": meta["nav"],
            "minutes": meta["minutes"],
            "potential": p["potential"],
        })

    # Чередуем два дополнительных дела по дню: контент (Reels/пост) и развитие персонала (тест)
    if day_seed % 2 == 0:
        tasks.append({
            "key": "content", "title": "Привлечь новые записи",
            "action_text": "Опубликуйте один Reels или пост под конкретную услугу и оффер",
            "button": "Создать Reels", "nav": "marketing:reel-script", "minutes": 25,
            "potential": 0,
        })
    else:
        tool = DEVELOPMENT_TOOLS[day_seed % len(DEVELOPMENT_TOOLS)]
        tasks.append({
            "key": "skill_up", "title": "Прокачать навыки",
            "action_text": tool["title"],
            "button": tool["button"], "nav": tool["nav"], "minutes": 15,
            "potential": 0,
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

PODELAM_SYSTEM_PROMPT = f"""Ты — экспертный бизнес-консультант и маркетолог-стратег, встроенный в сервис «ПоДелам» \
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

Отвечай СТРОГО в формате JSON, без markdown-обёртки, без пояснений вне JSON:
{{
  "growth_points": [
    {{"key": "верхнеуровневый_слаг_латиницей", "title": "Короткое название точки роста", "action": "Конкретное действие с цифрами", "potential": число_рублей}}
  ],
  "tasks": [
    {{"key": "тот_же_слаг_что_в_growth_points_или_content_или_skill_up_или_course", "title": "Название дела (2-4 слова)", "action_text": "Развёрнутое пояснение что и как сделать, с цифрами из диагностики (для tools/academy — назови конкретный тест или курс)", "button": "Текст кнопки перехода (2-4 слова)", "nav": "раздел_из_списка", "minutes": число_минут_на_выполнение, "potential": число_рублей_или_0}}
  ],
  "main_task_key": "key дела с наибольшим приоритетом на сегодня",
  "tomorrow_preview": "Тёплый анонс на завтра, 2-3 предложения"
}}

Правила по числам: potential — целые рубли, реалистичные исходя из среднего чека и базы клиентов, никогда не превышай \
величину разрыва между текущим и целевым доходом суммарно по всем tasks (у дел из tools/academy potential = 0). \
Дел должно быть 3-4, каждое выполнимо за 10-30 минут.
{PODELAM_SALON_MODE_PROMPT}"""


def call_podelam_ai(profile: dict, gap: float, role: str = "", courses: list | None = None,
                     yesterday_tasks: list | None = None, salon_context: dict | None = None) -> dict | None:
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
    }
    if salon_context:
        user_payload["salon_context"] = salon_context

    payload = json.dumps({
        "model": PODELAM_MODEL,
        "messages": [
            {"role": "system", "content": PODELAM_SYSTEM_PROMPT},
            {"role": "user", "content": f"Диагностика мастера/салона:\n{json.dumps(user_payload, ensure_ascii=False, indent=2)}"},
        ],
        "temperature": 0.7,
        "max_tokens": 2200 if salon_context else 2000,
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
        role = user.get("role") or "body_specialist"
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

        # Для владельца/администратора салона — подмешиваем реальные данные из «Мой салон»
        # (агрегированные показатели, услуги, сотрудники) и фокус-сотрудника дня по ротации.
        # Запрос делается ТОЛЬКО здесь — при первой генерации плана за сутки, не при каждом заходе.
        salon_context = None
        salon_id = user.get("salon_id")
        if role in ("owner", "admin") and salon_id:
            salon_context = build_salon_context(conn, salon_id, day_seed=today.toordinal())

        ai_result = call_podelam_ai(dict(profile), gap, role=role, courses=courses_for_role,
                                     yesterday_tasks=yesterday_tasks, salon_context=salon_context)
        if ai_result:
            points = ai_result["growth_points"]
            tasks = ai_result["tasks"]
            main_key = ai_result.get("main_task_key") or (tasks[0]["key"] if tasks else None)
            tomorrow_preview = ai_result.get("tomorrow_preview") or default_preview
            source = "ai"
        else:
            points = fallback_points
            tasks = build_today_tasks(points, day_seed=today.toordinal())
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


# ── Автопубликация ежедневного экспертного поста (ИИ, модель terra) в Telegram ─

CONTENT_AI_URL = "https://polza.ai/api/v1/chat/completions"
CONTENT_AI_MODEL = "openai/gpt-5.6-terra"

CONTENT_CATEGORIES = {
    "marketing": "Маркетинг",
    "upsell": "Допродажи",
    "clients": "Работа с клиентами",
}

# Строгий порядок ротации тем: сегодня — маркетинг, завтра — допродажи, послезавтра — работа
# с клиентами, затем снова по кругу. Категория следующего поста вычисляется от категории
# последнего опубликованного поста (см. get_next_content_category), а не от дня недели —
# это устойчиво к пропущенным дням публикации.
CONTENT_CATEGORY_ORDER = ["marketing", "upsell", "clients"]

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
}


def get_next_content_category(conn) -> str:
    """Определяет категорию следующего поста по строгой ротации marketing → upsell → clients,
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


def call_content_ai(topic: str, category: str) -> dict | None:
    """Просит ИИ написать продуманную экспертную статью на заданную тему строго в рамках одной
    из трёх категорий блога. Возвращает None при ошибке."""
    api_key = os.environ.get("POLZA_AI_API_KEY", "")
    if not api_key:
        return None

    category_label = CONTENT_CATEGORIES.get(category, category)

    system_prompt = f"""Ты — практикующий эксперт по бизнесу в бьюти-индустрии, ведёшь блог «Промт Диалог» (платформа \
для салонов красоты и мастеров: маркетинг, обучение, ИИ-инструменты, навигатор дохода «ПоДелам»).

Блог строго разделён на три постоянные рубрики, и сегодняшний пост должен относиться ТОЛЬКО к рубрике «{category_label}»:
- Маркетинг — привлечение новых клиентов, продвижение, соцсети, реклама, сарафанное радио, заполнение окон в записи.
- Допродажи — рост среднего чека, допуслуги, абонементы, пакеты услуг, финансовая аналитика мастера/салона.
- Работа с клиентами — удержание, возврат ушедших, отзывы, повторные визиты, коммуникация с клиентом, мотивация мастеров.
Не смешивай рубрики: если тема пограничная, раскрывай её строго под углом «{category_label}», не уходя в другие темы.

Напиши пост для владельцев салонов и мастеров красоты на тему: {topic}.

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
- В самом конце добавь 4-6 релевантных хэштегов на русском по теме поста и ниши (например #салонкрасоты #мастермаников \
#маркетингдлясалона) — без хэштегов на отвлечённые темы.

Отвечай СТРОГО в формате JSON, без markdown-обёртки:
{{
  "title": "Короткий цепляющий заголовок, до 60 знаков",
  "excerpt": "Превью-анонс на 1-2 предложения, до 150 знаков, без спойлера сути",
  "body": "Полный текст статьи, 900-1400 знаков, без хэштегов, можно с переносами строк \\n",
  "hashtags": ["хэштег1", "хэштег2"]
}}

ДОПОЛНИТЕЛЬНЫЕ ТРЕБОВАНИЯ К КАЧЕСТВУ И СТИЛЮ

Пиши так, будто текст подготовил сильный практик салонного бизнеса: управляющий, маркетолог или опытный мастер, который \
ежедневно общается с клиентами, видит ошибки коллег и понимает экономику записи. Текст должен вызывать ощущение живого \
человеческого опыта, а не шаблонной статьи, созданной ИИ.

Главная задача публикации — не просто дать информацию, а помочь мастеру или владельцу салона увидеть конкретную точку \
роста и захотеть применить совет в работе уже сегодня.

Целевая аудитория:
— частные мастера: массажисты, остеопаты, косметологи, бьюти-мастера, специалисты по телу;
— владельцы и управляющие салонов красоты, wellness-студий, массажных кабинетов;
— специалисты, у которых есть хорошие услуги, но нестабильная запись, мало повторных визитов, слабые продажи допуслуг \
или нет системы продвижения.

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
не меняй её и не указывай отдельно."""

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


def send_content_to_telegram(title: str, body: str, hashtags: str = "") -> int | None:
    """Публикует пост в Telegram-канал. Возвращает message_id или None при ошибке/отсутствии настроек."""
    bot_token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
    channel_id = os.environ.get("TELEGRAM_CHANNEL_ID", "")
    if not bot_token or not channel_id:
        return None

    def esc(text: str) -> str:
        return text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")

    tags_line = f"\n\n{esc(hashtags)}" if hashtags else ""
    text = f"<b>{esc(title)}</b>\n\n{esc(body)}{tags_line}"
    payload = json.dumps({
        "chat_id": channel_id,
        "text": text,
        "parse_mode": "HTML",
        "disable_web_page_preview": False,
        "reply_markup": {
            "inline_keyboard": [[
                {"text": "Зарегистрироваться →", "url": f"{SITE_URL}/cabinet?tab=register"}
            ]]
        },
    }).encode("utf-8")

    for attempt in range(2):
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
            print(f"[content_publisher] Telegram API вернул ok=false: {data}")
            return None
        except urllib.error.HTTPError as e:
            print(f"[content_publisher] Telegram HTTPError {e.code}: {e.read().decode('utf-8', 'ignore')}")
            return None
        except (urllib.error.URLError, TimeoutError, KeyError, ValueError, json.JSONDecodeError) as e:
            print(f"[content_publisher] Telegram send failed (attempt {attempt + 1}/2): {type(e).__name__}: {e}")
            if attempt == 0:
                time.sleep(1.5)
    return None


def handle_content_daily_post(event: dict, conn) -> dict:
    """Cron: генерирует (если ещё нет) и публикует пост дня в Telegram."""
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
        if not existing.get("telegram_message_id"):
            retry_id = send_content_to_telegram(existing["title"], existing["body"], existing.get("hashtags") or "")
            if retry_id:
                cur_retry = conn.cursor()
                cur_retry.execute(
                    f"UPDATE {SCHEMA}.content_posts SET telegram_message_id = %s, telegram_sent_at = now() WHERE id = %s",
                    (retry_id, existing["id"])
                )
                conn.commit()
                existing["telegram_message_id"] = retry_id
        return ok({"post": dict(existing), "created": False})

    category = get_next_content_category(conn)
    cur.execute(
        f"""SELECT topic FROM {SCHEMA}.content_posts
            WHERE category = %s AND topic IS NOT NULL
            ORDER BY post_date DESC LIMIT 5""",
        (category,)
    )
    recent_topics = {r["topic"] for r in cur.fetchall()}
    available_topics = [t for t in CONTENT_TOPICS_BY_CATEGORY[category] if t not in recent_topics]
    topic = random.choice(available_topics or CONTENT_TOPICS_BY_CATEGORY[category])

    ai_result = call_content_ai(topic, category)
    if not ai_result:
        return err("Не удалось сгенерировать пост", 502)

    raw_tags = ai_result.get("hashtags") or []
    hashtags_str = " ".join(
        t if t.startswith("#") else f"#{t}"
        for t in (raw_tags if isinstance(raw_tags, list) else [raw_tags])
        if t
    )

    cur2 = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur2.execute(
        f"""INSERT INTO {SCHEMA}.content_posts (post_date, title, excerpt, body, hashtags, category, topic, source)
            VALUES (%s, %s, %s, %s, %s, %s, %s, 'ai')
            ON CONFLICT (post_date) DO NOTHING
            RETURNING *""",
        (today, ai_result["title"], ai_result.get("excerpt") or "", ai_result["body"], hashtags_str, category, topic)
    )
    row = cur2.fetchone()
    conn.commit()
    if not row:
        cur.execute(f"SELECT * FROM {SCHEMA}.content_posts WHERE post_date = %s", (today,))
        row = cur.fetchone()
        return ok({"post": dict(row), "created": False})

    message_id = send_content_to_telegram(row["title"], row["body"], row.get("hashtags") or "")
    if message_id:
        cur3 = conn.cursor()
        cur3.execute(
            f"UPDATE {SCHEMA}.content_posts SET telegram_message_id = %s, telegram_sent_at = now() WHERE id = %s",
            (message_id, row["id"])
        )
        conn.commit()
        row["telegram_message_id"] = message_id

    return ok({"post": dict(row), "created": True, "telegram_sent": bool(message_id)})


def handle_content_list(event: dict, conn) -> dict:
    """Список опубликованных постов для ленты на сайте, с пагинацией (?page, ?limit) и фильтром
    по ?category=marketing|upsell|clients. Полный текст (body) отдаётся только авторизованным
    пользователям личного кабинета (X-Session-Id) — иначе только заголовок и превью."""
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

    session_id = (event.get("headers") or {}).get("X-Session-Id", "")
    is_authorized = bool(session_id and get_lk_user_by_session(session_id, conn))

    channel = os.environ.get("TELEGRAM_CHANNEL_ID", "").lstrip("@")

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    where_clause = "WHERE telegram_message_id IS NOT NULL"
    params: tuple = ()
    if category and category in CONTENT_CATEGORIES:
        where_clause += " AND category = %s"
        params = (category,)

    cur.execute(f"SELECT COUNT(*) AS total FROM {SCHEMA}.content_posts {where_clause}", params)
    total = cur.fetchone()["total"]

    cur.execute(
        f"""SELECT id, post_date, title, excerpt, body, hashtags, category, telegram_message_id, created_at
            FROM {SCHEMA}.content_posts
            {where_clause}
            ORDER BY post_date DESC
            LIMIT %s OFFSET %s""",
        params + (limit, offset)
    )
    rows = [dict(r) for r in cur.fetchall()]
    for r in rows:
        msg_id = r.get("telegram_message_id")
        r["telegram_url"] = f"https://t.me/{channel}/{msg_id}" if channel and not channel.lstrip("-").isdigit() and msg_id else None
        r["category_label"] = CONTENT_CATEGORIES.get(r.get("category"), "")
        if not is_authorized:
            r["body"] = None

    return ok({
        "posts": rows,
        "categories": CONTENT_CATEGORIES,
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
        f"""SELECT id, post_date, title, excerpt, category, telegram_message_id
            FROM {SCHEMA}.content_posts
            WHERE category = %s AND telegram_message_id IS NOT NULL AND id != %s
            ORDER BY post_date DESC
            LIMIT %s""",
        (category, post_id, limit)
    )
    rows = [dict(r) for r in cur.fetchall()]
    for r in rows:
        r["category_label"] = CONTENT_CATEGORIES.get(r.get("category"), "")
    return ok({"posts": rows})


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


# ── Модерация группы обсуждений Telegram (бот отвечает на вопросы + чистит мусор) ──────────

MODERATION_AI_MODEL = "openai/gpt-4o-mini"
MODERATION_AI_URL = "https://polza.ai/api/v1/chat/completions"

_MOD_LETTER_MAP = str.maketrans({
    "0": "о", "1": "i", "3": "е", "4": "ч", "@": "a", "$": "s",
    "!": "i", "|": "l",
})

_PROFANITY_STEMS = [
    "хуй", "хуе", "хуя", "хуё", "пизд", "ебат", "ебал", "ебан", "ебуч",
    "ёбан", "заеб", "наеб", "объеб", "разъеб", "выеб", "уеб", "еблан",
    "бляд", "мудак", "мудил", "мудоз", "гондон", "гандон", "долбоеб",
    "долбаеб", "залуп", "пидор", "пидар", "пидр", "сучар", "уебищ",
    "хуило", "хуила",
]

_SPAM_MARKERS = [
    "заработ", "подпишись", "подписывайся", "переходи по ссылк", "накрутк",
    "casino", "казино", "ставки на спорт", "crypto", "криптовалют",
    "инвестици", "продвижение канала", "работа на дому", "1xbet",
    "заработай", "пассивный доход", "airdrop",
]


def _mod_normalize(text: str) -> str:
    text = text.lower().translate(_MOD_LETTER_MAP)
    text = re.sub(r"[^a-zа-яё0-9\s]", "", text)
    text = re.sub(r"(.)\1{2,}", r"\1\1", text)
    return text


def has_profanity(text: str) -> bool:
    norm = _mod_normalize(text)
    return any(stem in norm for stem in _PROFANITY_STEMS)


def has_spam_marker(text: str) -> bool:
    norm = _mod_normalize(text)
    return any(marker in norm for marker in _SPAM_MARKERS)


_MOD_URL_RE = re.compile(
    r"(https?://|www\.|t\.me/|telegram\.me/)|"
    r"\b[a-zа-я0-9-]+\.(ru|com|net|org|рф|io|shop|store|xyz|site|online|biz|info)\b",
    re.IGNORECASE,
)


def has_link(text: str, entities: list) -> bool:
    for e in entities or []:
        if e.get("type") in ("url", "text_link", "mention"):
            return True
    return bool(_MOD_URL_RE.search(text or ""))


def tg_call(method: str, payload: dict, timeout: int = 15, retries: int = 0) -> dict | None:
    bot_token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
    if not bot_token:
        return None
    for attempt in range(retries + 1):
        req = urllib.request.Request(
            f"https://api.telegram.org/bot{bot_token}/{method}",
            data=json.dumps(payload).encode("utf-8"),
            headers={"Content-Type": "application/json"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                return json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            print(f"[tg_moderator] {method} HTTPError {e.code}: {e.read().decode('utf-8', 'ignore')}")
            return None
        except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as e:
            print(f"[tg_moderator] {method} failed (attempt {attempt + 1}/{retries + 1}): {type(e).__name__}: {e}")
    return None


def tg_delete_message(chat_id: int, message_id: int) -> None:
    tg_call("deleteMessage", {"chat_id": chat_id, "message_id": message_id}, timeout=6, retries=0)


def tg_ban_user(chat_id: int, user_id: int) -> None:
    tg_call("banChatMember", {"chat_id": chat_id, "user_id": user_id, "revoke_messages": False}, timeout=6, retries=0)


def tg_send_message(chat_id: int, text: str, reply_to_message_id: int | None = None,
                     thread_id: int | None = None) -> None:
    payload = {"chat_id": chat_id, "text": text, "parse_mode": "HTML"}
    if reply_to_message_id:
        payload["reply_parameters"] = {"message_id": reply_to_message_id, "allow_sending_without_reply": True}
    if thread_id:
        payload["message_thread_id"] = thread_id
    # Один повтор достаточно — повторные попытки при сетевых сбоях сильно повышают
    # расход вычислительного времени, не гарантируя доставку при долгой просадке сети.
    tg_call("sendMessage", payload, timeout=8, retries=1)


def tg_download_file_as_data_url(file_id: str) -> str | None:
    """Скачивает фото из Telegram и возвращает data:image/jpeg;base64,... для vision-запроса."""
    info = tg_call("getFile", {"file_id": file_id}, timeout=8)
    if not info or not info.get("ok"):
        return None
    file_path = info["result"].get("file_path")
    if not file_path:
        return None
    bot_token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
    try:
        with urllib.request.urlopen(
            f"https://api.telegram.org/file/bot{bot_token}/{file_path}", timeout=15
        ) as resp:
            raw = resp.read()
        b64 = base64.b64encode(raw).decode("ascii")
        return f"data:image/jpeg;base64,{b64}"
    except (urllib.error.URLError, TimeoutError) as e:
        print(f"[tg_moderator] file download failed: {e}")
        return None


MOD_TEXT_SYSTEM_PROMPT = """Ты — модератор и короткий помощник в группе обсуждений Telegram-канала бьюти-платформы \
«Промт Диалог» (промтдиалог.рф — инструменты и обучение для мастеров и салонов красоты).

Оцени сообщение пользователя из комментариев и верни СТРОГО JSON без markdown:
{
  "violation": true/false,
  "reason": "spam" | "rude" | "offtopic_ad" | null,
  "reply": "короткий ответ (1-2 предложения)" | null
}

Правила:
- violation=true, если сообщение — оскорбление, токсичность, грубость, скрытая реклама/спам постороннего \
бизнеса, флуд бессмысленными символами. Матерные слова уже отфильтрованы раньше, ищи именно грубость и спам.
- Обычные эмоциональные, но не оскорбительные комментарии — НЕ нарушение.
- reply заполняй ТОЛЬКО если сообщение — явный вопрос или прямое обращение к боту/администрации \
(например "а сколько стоит", "бот, подскажи", "как записаться", "работает ли для мастеров маникюра").
- Если это просто комментарий/мнение/благодарность без вопроса — reply=null, даже если оно позитивное.
- Ответ пиши дружелюбно, по-русски, на "вы", без канцелярита, максимум 2 коротких предложения, без ссылок.
- Если не уверен в ответе на вопрос — reply можно оставить null."""


def classify_text(text: str) -> dict:
    api_key = os.environ.get("OPENAI_API_KEY", "") or os.environ.get("POLZA_AI_API_KEY", "")
    if not api_key or not text.strip():
        return {"violation": False, "reason": None, "reply": None}

    payload = json.dumps({
        "model": MODERATION_AI_MODEL,
        "messages": [
            {"role": "system", "content": MOD_TEXT_SYSTEM_PROMPT},
            {"role": "user", "content": text[:2000]},
        ],
        "temperature": 0.3,
        "max_tokens": 300,
    }).encode("utf-8")

    req = urllib.request.Request(
        MODERATION_AI_URL, data=payload,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        content = data["choices"][0]["message"]["content"].strip()
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        return json.loads(content)
    except (urllib.error.URLError, TimeoutError, KeyError, ValueError, json.JSONDecodeError) as e:
        print(f"[tg_moderator] classify_text failed: {type(e).__name__}: {e}")
        return {"violation": False, "reason": None, "reply": None}


MOD_IMAGE_SYSTEM_PROMPT = """Ты — модератор фото/видео в группе обсуждений бьюти-канала «Промт Диалог» \
(мастера и салоны красоты). Посмотри на изображение и оцени, уместно ли оно в контексте обсуждения услуг \
красоты, работ мастеров, вопросов по платформе, отзывов или общения по теме салона/бьюти-индустрии.
Верни СТРОГО JSON без markdown: {"on_topic": true/false, "reason": "коротко почему, если не по теме"}
Нерелевантным считай: рекламу постороннего бизнеса, обнажённый/шокирующий контент, мемы и картинки \
никак не связанные с бьюти-темой или платформой. Фото причёсок, работ мастера, до/после, интерьера \
салона, скриншотов платформы — это ПО ТЕМЕ (on_topic=true)."""


def classify_image(data_url: str) -> dict:
    api_key = os.environ.get("OPENAI_API_KEY", "") or os.environ.get("POLZA_AI_API_KEY", "")
    if not api_key:
        return {"on_topic": True, "reason": None}

    payload = json.dumps({
        "model": MODERATION_AI_MODEL,
        "messages": [
            {"role": "system", "content": MOD_IMAGE_SYSTEM_PROMPT},
            {"role": "user", "content": [
                {"type": "text", "text": "Оцени это изображение."},
                {"type": "image_url", "image_url": {"url": data_url}},
            ]},
        ],
        "temperature": 0.2,
        "max_tokens": 200,
    }).encode("utf-8")

    req = urllib.request.Request(
        MODERATION_AI_URL, data=payload,
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
        return json.loads(content)
    except (urllib.error.URLError, TimeoutError, KeyError, ValueError, json.JSONDecodeError) as e:
        print(f"[tg_moderator] classify_image failed: {type(e).__name__}: {e}")
        return {"on_topic": True, "reason": None}


def register_violation(conn, chat_id: int, user_id: int, reason: str) -> int:
    """Увеличивает счётчик предупреждений пользователя в чате, возвращает новое значение."""
    cur = conn.cursor()
    cur.execute(
        f"""INSERT INTO {SCHEMA}.telegram_warnings (chat_id, user_id, warning_count, last_reason, last_violation_at)
            VALUES (%s, %s, 1, %s, NOW())
            ON CONFLICT (chat_id, user_id) DO UPDATE
            SET warning_count = {SCHEMA}.telegram_warnings.warning_count + 1,
                last_reason = EXCLUDED.last_reason,
                last_violation_at = NOW()
            RETURNING warning_count""",
        (chat_id, user_id, reason)
    )
    count = cur.fetchone()[0]
    conn.commit()
    return count


REASON_LABELS = {
    "profanity": "нецензурная лексика",
    "link": "ссылки/реклама",
    "spam": "спам",
    "rude": "грубость",
    "offtopic_ad": "реклама постороннего",
    "offtopic_media": "фото/видео не по теме",
}


def process_telegram_message(conn, message: dict) -> None:
    chat = message.get("chat") or {}
    chat_id = chat.get("id")
    from_user = message.get("from") or {}
    if not chat_id or from_user.get("is_bot"):
        return
    if chat.get("type") not in ("group", "supergroup"):
        return

    user_id = from_user.get("id")
    first_name = from_user.get("first_name") or "Гость"
    message_id = message.get("message_id")
    thread_id = message.get("message_thread_id")
    text = message.get("text") or message.get("caption") or ""
    entities = message.get("entities") or message.get("caption_entities") or []

    photos = message.get("photo") or []
    video = message.get("video")
    animation = message.get("animation")

    reason = None

    if text and has_profanity(text):
        reason = "profanity"
    elif has_link(text, entities):
        reason = "link"
    elif text and has_spam_marker(text):
        reason = "spam"

    ai_reply = None

    if not reason and photos:
        largest = photos[-1]
        data_url = tg_download_file_as_data_url(largest.get("file_id"))
        if data_url:
            verdict = classify_image(data_url)
            if not verdict.get("on_topic", True):
                reason = "offtopic_media"
    elif not reason and (video or animation):
        media_obj = video or animation
        thumb = (media_obj or {}).get("thumbnail") or (media_obj or {}).get("thumb")
        if thumb:
            data_url = tg_download_file_as_data_url(thumb.get("file_id"))
            if data_url:
                verdict = classify_image(data_url)
                if not verdict.get("on_topic", True):
                    reason = "offtopic_media"

    if not reason and text.strip():
        verdict = classify_text(text)
        if verdict.get("violation"):
            reason = verdict.get("reason") or "rude"
        else:
            ai_reply = verdict.get("reply")

    if reason:
        tg_delete_message(chat_id, message_id)
        count = register_violation(conn, chat_id, user_id, reason)
        label = REASON_LABELS.get(reason, "нарушение правил")
        if count >= 2:
            tg_ban_user(chat_id, user_id)
            tg_send_message(
                chat_id,
                f"🚫 {first_name} заблокирован за повторное нарушение правил ({label}).",
                thread_id=thread_id,
            )
        else:
            tg_send_message(
                chat_id,
                f"⚠️ {first_name}, сообщение удалено ({label}). При повторном нарушении — блокировка.",
                thread_id=thread_id,
            )
        return

    if ai_reply:
        tg_send_message(chat_id, ai_reply, reply_to_message_id=message_id, thread_id=thread_id)


def handle_telegram_webhook(event: dict, update: dict, conn) -> dict:
    headers = event.get("headers") or {}
    webhook_secret = os.environ.get("TELEGRAM_WEBHOOK_SECRET", "")
    incoming_secret = headers.get("X-Telegram-Bot-Api-Secret-Token", "")
    if webhook_secret and incoming_secret != webhook_secret:
        return err("Доступ запрещён", 403)

    message = update.get("message") or update.get("edited_message")
    if not message:
        return ok({"ok": True})

    process_telegram_message(conn, message)
    return ok({"ok": True})


def handle_set_webhook(event: dict) -> dict:
    qs = event.get("queryStringParameters") or {}
    url = qs.get("url", "")
    if not url:
        return err("Нужен параметр url — публичный URL этой функции")
    secret = os.environ.get("TELEGRAM_WEBHOOK_SECRET", "")
    result = tg_call("setWebhook", {
        "url": url,
        "secret_token": secret,
        "allowed_updates": ["message", "edited_message"],
    }, timeout=25)
    return ok(result or {"ok": False, "error": "Нет ответа от Telegram"})


def handle_webhook_info() -> dict:
    result = tg_call("getWebhookInfo", {}, timeout=25)
    return ok(result or {"ok": False})


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

        # ── Автопубликация ежедневного поста в Telegram ───────────────────────
        if route_action == "content_daily_post":
            return handle_content_daily_post(event, conn)
        if route_action == "content_list":
            return handle_content_list(event, conn)
        if route_action == "content_related":
            return handle_content_related(event, conn)

        # ── Модерация группы обсуждений Telegram (админ-действия) ────────────
        admin_token = os.environ.get("ADMIN_TOKEN", "")
        if route_action == "set_webhook":
            if not admin_token or qs.get("key", "") != admin_token:
                return err("Доступ запрещён", 403)
            return handle_set_webhook(event)
        if route_action == "webhook_info":
            if not admin_token or qs.get("key", "") != admin_token:
                return err("Доступ запрещён", 403)
            return handle_webhook_info()

        # ── Вебхук Telegram (POST с телом апдейта, содержащим update_id) ─────
        if method == "POST" and not route_action:
            raw_body = event.get("body") or "{}"
            try:
                parsed_body = json.loads(raw_body)
            except json.JSONDecodeError:
                parsed_body = {}
            if isinstance(parsed_body, dict) and "update_id" in parsed_body:
                return handle_telegram_webhook(event, parsed_body, conn)

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