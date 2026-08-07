"""
Начисление партнёрского вознаграждения мастерам + «ПоДелам» -- ИИ-навигатор дохода в личном кабинете.
Начисление мастерам ТОЛЬКО при реальной покупке энергии через ЮКассу.
Ручное пополнение и бонусы — не считаются.
Формула: 10% от количества энергий = рубли (100 энергий → 10 ₽).
GET  ?action=podelam_get           — профиль дохода + план на сегодня, план строит ИИ (модель terra через polza.ai) (X-Session-Id).
                                       ТАЙМАУТ ФУНКЦИИ ДОЛЖЕН БЫТЬ НЕ МЕНЕЕ 60с — иначе запрос к ИИ обрывается по 504 и план не сохраняется.
POST ?action=podelam_save_profile  — сохранить диагностику дохода (X-Session-Id)
POST ?action=podelam_task_done     — отметить дело выполненным, опционально с фактической суммой (X-Session-Id)
GET  ?action=podelam_stats         — статистика выполненных дел за неделю/месяц (X-Session-Id)
POST ?action=podelam_set_income    — прибавить фактический доход за день (amount, опц. date, mode="add"|"replace") (X-Session-Id)
GET/POST ?action=podelam_notify&key=ADMIN_TOKEN — cron: письмо пользователям с новым планом на сегодня, у кого ещё не отправлено.
                                       ТАЙМАУТ ФУНКЦИИ ДОЛЖЕН БЫТЬ НЕ МЕНЕЕ 60с при большом числе пользователей.
GET/POST ?action=content_daily_post&key=ADMIN_TOKEN — cron: ИИ пишет ежедневный экспертный пост и публикует в Telegram-канал.
                                       Повторно в этот же день не публикует. ТАЙМАУТ ФУНКЦИИ ДОЛЖЕН БЫТЬ НЕ МЕНЕЕ 60с.
GET  ?action=content_list          — последние опубликованные посты (для ленты на сайте), без авторизации.
POST / (без action или action=withdraw) — начисления мастерам (X-Master-Session)
GET  / (без action) — история начислений мастера (X-Master-Session)
"""
import json
import os
import random
import smtplib
import ssl
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


def build_today_tasks(points: list) -> list:
    """Из точек роста собирает 3-4 конкретных дела на сегодня со ссылкой на инструмент ЛК."""
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
    # Всегда добавляем контентную задачу на привлечение новых
    tasks.append({
        "key": "content", "title": "Привлечь новые записи",
        "action_text": "Опубликуйте один Reels или пост под конкретную услугу и оффер",
        "button": "Создать Reels", "nav": "marketing:reel-script", "minutes": 25,
        "potential": 0,
    })
    return tasks


# ── Генерация плана «ПоДелам» через ИИ (модель terra, polza.ai) ────────────

PODELAM_MODEL = "openai/gpt-5.6-terra"
PODELAM_AI_URL = "https://polza.ai/api/v1/chat/completions"

# Разделы ЛК, куда ИИ может направить пользователя для выполнения дела
PODELAM_NAV_CATALOG = """
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
"""

PODELAM_SYSTEM_PROMPT = f"""Ты — экспертный бизнес-консультант и маркетолог-стратег, встроенный в сервис «ПоДелам» \
внутри платформы «Промт Диалог» для мастеров и владельцев салонов красоты (парикмахеры, мастера маникюра, массажисты и т.п.).

Твоя задача — на основе диагностики конкретного мастера/салона построить ЧЁТКИЙ, ПРИЧИННО-СЛЕДСТВЕННЫЙ план роста дохода:
1. Учти АБСОЛЮТНО ВСЕ данные из диагностики (ниша, средний чек, текущий и целевой доход, клиентов в месяц, \
размер базы, % повторных визитов, свободные окна, есть ли допуслуги и их конкретный список/цены, откуда приходят записи).
2. Если указан конкретный список допуслуг/пакетов (addon_services_text) — используй ИМЕННО ЭТИ названия в действиях \
и рекомендациях по допродажам вместо общих формулировок вроде "предложить допуслугу". Учитывай их ориентировочную \
стоимость при расчёте potential, если она указана в тексте.
3. Посчитай разрыв между текущим и целевым доходом и реалистично разложи его на 3-4 точки роста — откуда именно \
возьмутся деньги (возврат клиентов, заполнение окон, допродажи конкретных допуслуг/пакетов, привлечение новых через \
конкретный канал lead_source).
4. Для каждой точки роста подбери КОНКРЕТНОЕ маркетинговое или операционное действие на сегодня, которое можно \
выполнить с помощью инструментов личного кабинета. Обязательно указывай nav — раздел ЛК, который реально решает эту \
задачу, выбирай СТРОГО из списка ниже, ничего не выдумывай:
{PODELAM_NAV_CATALOG}
5. Если lead_source указывает на конкретный канал (Instagram, Директ, сарафанное радио и т.д.) — учитывай это при \
выборе маркетинговых действий (например, если реклама не настроена, а доход не дотягивает до цели — предложи \
семантику/объявления/бюджет для Директа; если упор на контент — Reels/посты/визуалы).
6. Одно из дел сделай "главным делом дня" — тем, что даст наибольший или самый быстрый эффект.
7. Придумай короткий, тёплый, мотивирующий анонс на завтра (2-3 предложения, обращение на "вы"), который объясняет, \
что план не статичен: завтра появится новый набор дел с учётом того, что было сделано сегодня, и почему это важно \
(регулярность даёт результат). НЕ повторяй сегодняшние формулировки дословно.

Отвечай СТРОГО в формате JSON, без markdown-обёртки, без пояснений вне JSON:
{{
  "growth_points": [
    {{"key": "верхнеуровневый_слаг_латиницей", "title": "Короткое название точки роста", "action": "Конкретное действие с цифрами", "potential": число_рублей}}
  ],
  "tasks": [
    {{"key": "тот_же_слаг_что_в_growth_points_или_content", "title": "Название дела (2-4 слова)", "action_text": "Развёрнутое пояснение что и как сделать, с цифрами из диагностики", "button": "Текст кнопки перехода (2-4 слова)", "nav": "раздел_из_списка", "minutes": число_минут_на_выполнение, "potential": число_рублей_или_0}}
  ],
  "main_task_key": "key дела с наибольшим приоритетом на сегодня",
  "tomorrow_preview": "Тёплый анонс на завтра, 2-3 предложения"
}}

Правила по числам: potential — целые рубли, реалистичные исходя из среднего чека и базы клиентов, никогда не превышай \
величину разрыва между текущим и целевым доходом суммарно по всем tasks. Дел должно быть 3-4, каждое выполнимо за 10-30 минут."""


def call_podelam_ai(profile: dict, gap: float) -> dict | None:
    """Запрашивает у модели terra (polza.ai) персональный план роста дохода. Возвращает None при ошибке."""
    api_key = os.environ.get("POLZA_AI_API_KEY", "")
    if not api_key:
        return None

    user_payload = {
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
    }

    payload = json.dumps({
        "model": PODELAM_MODEL,
        "messages": [
            {"role": "system", "content": PODELAM_SYSTEM_PROMPT},
            {"role": "user", "content": f"Диагностика мастера/салона:\n{json.dumps(user_payload, ensure_ascii=False, indent=2)}"},
        ],
        "temperature": 0.6,
        "max_tokens": 2000,
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
        ai_result = call_podelam_ai(dict(profile), gap)
        if ai_result:
            points = ai_result["growth_points"]
            tasks = ai_result["tasks"]
            main_key = ai_result.get("main_task_key") or (tasks[0]["key"] if tasks else None)
            tomorrow_preview = ai_result.get("tomorrow_preview") or default_preview
            source = "ai"
        else:
            points = fallback_points
            tasks = build_today_tasks(points)
            main_key = tasks[0]["key"] if tasks else None
            tomorrow_preview = default_preview
            source = "rules"

        cur2 = conn.cursor()
        cur2.execute(
            f"""INSERT INTO {SCHEMA}.podelam_daily_plans
                (user_id, plan_date, main_task_key, gap_amount, tasks, tomorrow_preview, source, growth_points)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
                ON CONFLICT (user_id, plan_date) DO NOTHING
                RETURNING *""",
            (user["id"], today, main_key, gap, json.dumps(tasks, ensure_ascii=False),
             tomorrow_preview, source, json.dumps(points, ensure_ascii=False))
        )
        cur2.fetchone()
        conn.commit()
        plan = {
            "tasks": tasks, "main_task_key": main_key, "gap_amount": gap,
            "plan_date": str(today), "tomorrow_preview": tomorrow_preview, "source": source,
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
    with smtplib.SMTP_SSL("smtp.mail.ru", 465, context=ctx, timeout=15) as srv:
        srv.login(FROM_EMAIL, smtp_password)
        srv.sendmail(FROM_EMAIL, [to_email], msg.as_string())


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

CONTENT_TOPICS = [
    ("как удержать клиента, который давно не приходил", "clients"),
    ("как поднять средний чек через допуслуги без давления на клиента", "upsell"),
    ("как заполнить окна в расписании мастера в межсезонье", "marketing"),
    ("как получать больше отзывов и повторных визитов", "clients"),
    ("как правильно вести соцсети салона, чтобы шли записи, а не лайки", "marketing"),
    ("как посчитать реальную прибыльность мастера, а не только выручку", "upsell"),
    ("как выстроить систему допродаж в салоне без раздражения клиентов", "upsell"),
    ("как мотивировать мастеров расти в доходе, а не просто отрабатывать смену", "clients"),
    ("какие 3 метрики салону нужно смотреть каждую неделю", "upsell"),
    ("как вернуть клиентов, которые ушли к конкурентам", "clients"),
    ("как настроить сарафанное радио так, чтобы оно реально работало", "marketing"),
    ("как мастеру выйти на стабильный доход без хаотичной записи", "marketing"),
]


def call_content_ai(topic: str) -> dict | None:
    """Просит ИИ написать короткую экспертную статью на заданную тему. Возвращает None при ошибке."""
    api_key = os.environ.get("POLZA_AI_API_KEY", "")
    if not api_key:
        return None

    system_prompt = f"""Ты — практикующий эксперт по бизнесу в бьюти-индустрии, ведёшь блог «Промт Диалог» (платформа \
для салонов красоты и мастеров: маркетинг, обучение, ИИ-инструменты, навигатор дохода «ПоДелам»).

Напиши короткий полезный пост для владельцев салонов и мастеров красоты на тему: {topic}.

Требования к тексту:
- Пиши как живой человек, который сам через это прошёл — без воды, без вступлений типа "в наше время" или \
"многие сталкиваются", без канцелярита и штампов.
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
  "body": "Полный текст статьи, 800-1200 знаков, без хэштегов, можно с переносами строк \\n",
  "hashtags": ["хэштег1", "хэштег2"]
}}"""

    payload = json.dumps({
        "model": CONTENT_AI_MODEL,
        "messages": [{"role": "system", "content": system_prompt}],
        "temperature": 0.8,
        "max_tokens": 1200,
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
        return None
    except (urllib.error.URLError, TimeoutError, KeyError, ValueError, json.JSONDecodeError):
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
        return ok({"post": dict(existing), "created": False})

    topic, category = random.choice(CONTENT_TOPICS)
    ai_result = call_content_ai(topic)
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
        f"""INSERT INTO {SCHEMA}.content_posts (post_date, title, excerpt, body, hashtags, category, source)
            VALUES (%s, %s, %s, %s, %s, %s, 'ai')
            ON CONFLICT (post_date) DO NOTHING
            RETURNING *""",
        (today, ai_result["title"], ai_result.get("excerpt") or "", ai_result["body"], hashtags_str, category)
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
    """Список последних опубликованных постов для ленты на сайте, со ссылкой на полный текст в Telegram.
    Опционально фильтруется по ?category=marketing|upsell|clients."""
    qs = event.get("queryStringParameters") or {}
    try:
        limit = min(int(qs.get("limit", 20)), 50)
    except ValueError:
        limit = 20
    category = qs.get("category", "")

    channel = os.environ.get("TELEGRAM_CHANNEL_ID", "").lstrip("@")

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    if category and category in CONTENT_CATEGORIES:
        cur.execute(
            f"""SELECT id, post_date, title, excerpt, body, hashtags, category, telegram_message_id, created_at
                FROM {SCHEMA}.content_posts
                WHERE telegram_message_id IS NOT NULL AND category = %s
                ORDER BY post_date DESC
                LIMIT %s""",
            (category, limit)
        )
    else:
        cur.execute(
            f"""SELECT id, post_date, title, excerpt, body, hashtags, category, telegram_message_id, created_at
                FROM {SCHEMA}.content_posts
                WHERE telegram_message_id IS NOT NULL
                ORDER BY post_date DESC
                LIMIT %s""",
            (limit,)
        )
    rows = [dict(r) for r in cur.fetchall()]
    for r in rows:
        msg_id = r.get("telegram_message_id")
        r["telegram_url"] = f"https://t.me/{channel}/{msg_id}" if channel and not channel.lstrip("-").isdigit() and msg_id else None
        r["category_label"] = CONTENT_CATEGORIES.get(r.get("category"), "")
    return ok({"posts": rows, "categories": CONTENT_CATEGORIES})


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

        # ── Автопубликация ежедневного поста в Telegram ───────────────────────
        if route_action == "content_daily_post":
            return handle_content_daily_post(event, conn)
        if route_action == "content_list":
            return handle_content_list(event, conn)

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