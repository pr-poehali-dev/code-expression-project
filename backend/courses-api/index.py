"""
API для системы курсов Академии.
Маршруты (?action=...):
  Витрина (пользователь):
    courses_list        — список опубликованных курсов
    course_detail       — курс + модули + уроки (с учётом доступа)
    course_access       — купить доступ к курсу (списать энергию)
    lesson_open         — открыть урок (списать энергию)
    lesson_ask_ai       — задать вопрос ИИ по уроку (2 энергии)
  Админ:
    admin_courses_list        — все курсы
    admin_course_save         — создать/обновить курс
    admin_module_save         — создать/обновить модуль
    admin_module_delete       — удалить модуль
    admin_lesson_save         — создать/обновить урок
    admin_lesson_delete       — удалить урок
    admin_lesson_photo_add    — добавить фото к уроку (base64)
    admin_lesson_photo_delete — удалить фото урока
    admin_lesson_file_add     — добавить файл к уроку (base64)
    admin_lesson_file_delete  — удалить файл урока
    admin_grant_access        — вручную выдать доступ к курсу пользователю
"""
import json
import os
import base64
import hashlib
import re
import urllib.request
import psycopg2
import psycopg2.extras
import boto3

SCHEMA = "t_p84565078_code_expression_proj"
LESSON_AI_COST = 2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}


def tbl(name): return f"{SCHEMA}.{name}"
def get_db(): return psycopg2.connect(os.environ["DATABASE_URL"])
def ok(data, status=200): return {"statusCode": status, "headers": CORS, "body": json.dumps(data, ensure_ascii=False, default=str)}
def err(msg, status=400): return {"statusCode": status, "headers": CORS, "body": json.dumps({"error": msg}, ensure_ascii=False)}


def get_session_user(event, conn):
    sid = (event.get("headers") or {}).get("X-Session-Id", "")
    if not sid:
        return None
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT u.* FROM {tbl('lk_sessions')} s JOIN {tbl('lk_users')} u ON u.id=s.user_id "
        f"WHERE s.id=%s AND s.expires_at>NOW() AND u.is_active=TRUE", (sid,)
    )
    return cur.fetchone()


def get_salon_balance(salon_id, conn) -> int:
    cur = conn.cursor()
    cur.execute(
        f"SELECT COALESCE(SUM(CASE WHEN type='credit' THEN amount ELSE -amount END),0) "
        f"FROM {tbl('credit_transactions')} WHERE salon_id=%s", (salon_id,)
    )
    return int(cur.fetchone()[0])


def deduct_energy(salon_id, user_id, cost, action, conn):
    cur = conn.cursor()
    cur.execute(
        f"UPDATE {tbl('salons')} SET credits_balance=credits_balance-%s WHERE id=%s",
        (cost, salon_id)
    )
    cur.execute(
        f"INSERT INTO {tbl('credit_transactions')} (salon_id, user_id, action, amount, tool_key, type) "
        f"VALUES (%s,%s,%s,%s,'course','debit')",
        (salon_id, user_id, action, cost)
    )
    conn.commit()


def s3_client():
    return boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )


def cdn_url(key):
    return f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"


# ── Витрина ──────────────────────────────────────────────────────────────────

def handle_courses_list(event, conn):
    user = get_session_user(event, conn)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT id,title,description,cover_url,category,access_cost,lesson_cost,sort_order "
        f"FROM {tbl('courses')} WHERE is_published=TRUE ORDER BY sort_order,id"
    )
    courses = [dict(r) for r in cur.fetchall()]

    if user:
        cur.execute(
            f"SELECT course_id FROM {tbl('course_access')} WHERE user_id=%s", (user["id"],)
        )
        accessible = {r["course_id"] for r in cur.fetchall()}

        # Доступ через member_course_access (владелец выдал сотруднику)
        salon_id = user.get("salon_id")
        if salon_id:
            cur.execute(
                f"SELECT mca.course_id FROM {tbl('member_course_access')} mca "
                f"JOIN {tbl('salon_members')} sm ON sm.id=mca.member_id "
                f"WHERE sm.user_id=%s AND sm.salon_id=%s AND sm.is_active=TRUE",
                (user["id"], salon_id)
            )
            for r in cur.fetchall():
                accessible.add(r["course_id"])

        for c in courses:
            c["has_access"] = c["id"] in accessible
    else:
        for c in courses:
            c["has_access"] = False

    return ok(courses)


def handle_course_detail(event, conn):
    user = get_session_user(event, conn)
    if not user:
        return err("Не авторизован", 401)

    qs = event.get("queryStringParameters") or {}
    course_id = qs.get("course_id")
    if not course_id:
        return err("course_id обязателен")

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT * FROM {tbl('courses')} WHERE id=%s AND is_published=TRUE", (course_id,)
    )
    course = cur.fetchone()
    if not course:
        return err("Курс не найден", 404)

    course = dict(course)

    cur.execute(
        f"SELECT id FROM {tbl('course_access')} WHERE user_id=%s AND course_id=%s",
        (user["id"], course_id)
    )
    has_direct = cur.fetchone() is not None

    has_member = False
    if not has_direct:
        salon_id = user.get("salon_id")
        if salon_id:
            cur.execute(
                f"SELECT mca.id FROM {tbl('member_course_access')} mca "
                f"JOIN {tbl('salon_members')} sm ON sm.id=mca.member_id "
                f"WHERE sm.user_id=%s AND sm.salon_id=%s AND mca.course_id=%s AND sm.is_active=TRUE",
                (user["id"], salon_id, course_id)
            )
            has_member = cur.fetchone() is not None

    course["has_access"] = has_direct or has_member

    cur.execute(
        f"SELECT id,title,sort_order FROM {tbl('course_modules')} WHERE course_id=%s ORDER BY sort_order,id",
        (course_id,)
    )
    modules = [dict(r) for r in cur.fetchall()]

    cur.execute(
        f"SELECT id FROM {tbl('lesson_access')} WHERE user_id=%s", (user["id"],)
    )
    opened_lessons = {r["id"] for r in cur.fetchall()}

    for m in modules:
        cur.execute(
            f"SELECT id,title,sort_order FROM {tbl('course_lessons')} "
            f"WHERE module_id=%s ORDER BY sort_order,id", (m["id"],)
        )
        lessons = []
        for row in cur.fetchall():
            l = dict(row)
            l["is_opened"] = l["id"] in opened_lessons
            lessons.append(l)
        m["lessons"] = lessons

    course["modules"] = modules
    return ok(course)


def handle_course_access(event, conn):
    user = get_session_user(event, conn)
    if not user:
        return err("Не авторизован", 401)

    body = json.loads(event.get("body") or "{}")
    course_id = body.get("course_id")
    if not course_id:
        return err("course_id обязателен")

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT * FROM {tbl('courses')} WHERE id=%s AND is_published=TRUE", (course_id,))
    course = cur.fetchone()
    if not course:
        return err("Курс не найден", 404)

    cur.execute(
        f"SELECT id FROM {tbl('course_access')} WHERE user_id=%s AND course_id=%s",
        (user["id"], course_id)
    )
    if cur.fetchone():
        return ok({"ok": True, "already": True})

    cost = course["access_cost"]
    if cost > 0:
        salon_id = user.get("salon_id")
        if not salon_id:
            return err("Нет привязанного аккаунта")
        balance = get_salon_balance(salon_id, conn)
        if balance < cost:
            return err(f"Недостаточно энергии. Нужно {cost}, доступно {balance}", 402)
        deduct_energy(salon_id, user["id"], cost, f"Доступ к курсу «{course['title']}»", conn)

    cur.execute(
        f"INSERT INTO {tbl('course_access')} (user_id, course_id) VALUES (%s,%s) ON CONFLICT DO NOTHING",
        (user["id"], course_id)
    )
    conn.commit()
    return ok({"ok": True})


def handle_lesson_open(event, conn):
    user = get_session_user(event, conn)
    if not user:
        return err("Не авторизован", 401)

    body = json.loads(event.get("body") or "{}")
    lesson_id = body.get("lesson_id")
    if not lesson_id:
        return err("lesson_id обязателен")

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT l.*, c.lesson_cost, c.title as course_title, c.id as cid "
        f"FROM {tbl('course_lessons')} l "
        f"JOIN {tbl('courses')} c ON c.id=l.course_id "
        f"WHERE l.id=%s", (lesson_id,)
    )
    lesson = cur.fetchone()
    if not lesson:
        return err("Урок не найден", 404)

    # Проверяем доступ к курсу: либо user сам купил, либо владелец дал доступ через member_course_access
    cur.execute(
        f"SELECT id FROM {tbl('course_access')} WHERE user_id=%s AND course_id=%s",
        (user["id"], lesson["cid"])
    )
    has_direct_access = cur.fetchone()

    if not has_direct_access:
        # Сотрудник: проверяем разрешение от владельца через salon_members + member_course_access
        salon_id = user.get("salon_id")
        if salon_id:
            cur.execute(
                f"SELECT mca.id FROM {tbl('member_course_access')} mca "
                f"JOIN {tbl('salon_members')} sm ON sm.id = mca.member_id "
                f"WHERE sm.user_id=%s AND sm.salon_id=%s AND mca.course_id=%s AND sm.is_active=TRUE",
                (user["id"], salon_id, lesson["cid"])
            )
            has_member_access = cur.fetchone()
        else:
            has_member_access = None

        if not has_member_access:
            return err("Нет доступа к курсу", 403)

    cur.execute(
        f"SELECT id FROM {tbl('lesson_access')} WHERE user_id=%s AND lesson_id=%s",
        (user["id"], lesson_id)
    )
    if cur.fetchone():
        pass
    else:
        cost = lesson["lesson_cost"]
        if cost > 0:
            salon_id = user.get("salon_id")
            if not salon_id:
                return err("Нет привязанного аккаунта")
            balance = get_salon_balance(salon_id, conn)
            if balance < cost:
                return err(f"Недостаточно энергии. Нужно {cost}, доступно {balance}", 402)
            deduct_energy(salon_id, user["id"], cost, f"Урок «{lesson['title']}»", conn)

        cur.execute(
            f"INSERT INTO {tbl('lesson_access')} (user_id, lesson_id) VALUES (%s,%s) ON CONFLICT DO NOTHING",
            (user["id"], lesson_id)
        )
        conn.commit()

    cur.execute(
        f"SELECT id,name,url FROM {tbl('lesson_files')} WHERE lesson_id=%s ORDER BY id", (lesson_id,)
    )
    files = [dict(r) for r in cur.fetchall()]

    cur.execute(
        f"SELECT id,url,sort_order FROM {tbl('lesson_photos')} WHERE lesson_id=%s ORDER BY sort_order,id", (lesson_id,)
    )
    photos = [dict(r) for r in cur.fetchall()]

    cur.execute(
        f"SELECT tool_slug FROM {tbl('lesson_tools')} WHERE lesson_id=%s ORDER BY sort_order, id", (lesson_id,)
    )
    tools = [r["tool_slug"] for r in cur.fetchall()]

    result = dict(lesson)
    result["files"] = files
    result["photos"] = photos
    result["video_urls"] = json.loads(lesson["video_urls"]) if isinstance(lesson["video_urls"], str) else (lesson["video_urls"] or [])
    result["links"] = json.loads(lesson["links"]) if isinstance(lesson["links"], str) else (lesson["links"] or [])
    result["tools"] = tools
    return ok(result)


def handle_lesson_ask_ai(event, conn):
    user = get_session_user(event, conn)
    if not user:
        return err("Не авторизован", 401)

    body = json.loads(event.get("body") or "{}")
    lesson_id = body.get("lesson_id")
    question = (body.get("question") or "").strip()
    is_preview = body.get("preview") is True
    if not question:
        return err("question обязателен")

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    if is_preview:
        # Режим предпросмотра для администратора — проверяем что админ, данные берём из тела запроса
        admin, e = require_admin(event, conn)
        if e: return e
        lesson = {
            "title": body.get("title") or "",
            "content": body.get("content") or "",
            "ai_context": body.get("ai_context") or "",
        }
    else:
        if not lesson_id:
            return err("lesson_id обязателен")
        cur.execute(
            f"SELECT l.*, c.id as cid, c.title as course_title "
            f"FROM {tbl('course_lessons')} l JOIN {tbl('courses')} c ON c.id=l.course_id "
            f"WHERE l.id=%s", (lesson_id,)
        )
        lesson = cur.fetchone()
        if not lesson:
            return err("Урок не найден", 404)

        cur.execute(
            f"SELECT id FROM {tbl('lesson_access')} WHERE user_id=%s AND lesson_id=%s",
            (user["id"], lesson_id)
        )
        if not cur.fetchone():
            return err("Урок не открыт", 403)

    if not is_preview:
        salon_id = user.get("salon_id")
        if not salon_id:
            return err("Нет привязанного аккаунта")
        balance = get_salon_balance(salon_id, conn)
        if balance < LESSON_AI_COST:
            return err(f"Недостаточно энергии. Нужно {LESSON_AI_COST}, доступно {balance}", 402)
    else:
        salon_id = None

    context_parts = []
    if lesson.get("title"):
        context_parts.append(f"Урок: {lesson['title']}")
    if lesson.get("content"):
        context_parts.append(f"Содержание урока:\n{lesson['content']}")
    if lesson.get("ai_context"):
        context_parts.append(f"Дополнительный контекст:\n{lesson['ai_context']}")

    system_prompt = (
        "Ты — преподаватель и эксперт курса. Отвечай на вопрос ученика строго на основе материала урока. "
        "Отвечай ёмко, конкретно, профессионально. Если вопрос выходит за рамки урока — мягко об этом скажи. "
        "Обращайся на «ты»."
    )
    if context_parts:
        system_prompt += "\n\n" + "\n\n".join(context_parts)

    api_key = os.environ.get("OPENAI_API_KEY", "")
    payload = json.dumps({
        "model": "openai/gpt-4o-mini",
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": question},
        ],
        "max_tokens": 800,
        "temperature": 0.5,
    }).encode()

    req = urllib.request.Request(
        "https://api.polza.ai/v1/chat/completions",
        data=payload,
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=25) as resp:
        data = json.loads(resp.read())
    answer = data["choices"][0]["message"]["content"]

    if salon_id:
        deduct_energy(salon_id, user["id"], LESSON_AI_COST, f"ИИ-ответ в уроке «{lesson['title']}»", conn)
    return ok({"answer": answer})


def handle_lesson_homework_ai(event, conn):
    user = get_session_user(event, conn)
    if not user:
        return err("Не авторизован", 401)

    body = json.loads(event.get("body") or "{}")
    lesson_id = body.get("lesson_id")
    message = (body.get("message") or "").strip()
    is_preview = body.get("preview") is True
    # История диалога: [{role: "user"|"assistant", content: "..."}]
    history = body.get("history") or []
    if not message:
        return err("message обязателен")

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    if is_preview:
        admin, e = require_admin(event, conn)
        if e: return e
        lesson = {
            "title": body.get("title") or "",
            "content": body.get("content") or "",
            "ai_context": body.get("ai_context") or "",
            "homework": body.get("homework") or "",
        }
        salon_id = None
    else:
        if not lesson_id:
            return err("lesson_id обязателен")
        cur.execute(
            f"SELECT l.*, c.id as cid, c.title as course_title "
            f"FROM {tbl('course_lessons')} l JOIN {tbl('courses')} c ON c.id=l.course_id "
            f"WHERE l.id=%s", (lesson_id,)
        )
        lesson = cur.fetchone()
        if not lesson:
            return err("Урок не найден", 404)

        cur.execute(
            f"SELECT id FROM {tbl('lesson_access')} WHERE user_id=%s AND lesson_id=%s",
            (user["id"], lesson_id)
        )
        if not cur.fetchone():
            return err("Урок не открыт", 403)

        salon_id = user.get("salon_id")
        if not salon_id:
            return err("Нет привязанного аккаунта")
        balance = get_salon_balance(salon_id, conn)
        if balance < LESSON_AI_COST:
            return err(f"Недостаточно энергии. Нужно {LESSON_AI_COST}, доступно {balance}", 402)

    homework_text = lesson.get("homework") or ""
    lesson_title = lesson.get("title") or ""
    lesson_content = lesson.get("content") or ""
    ai_context = lesson.get("ai_context") or ""

    system_prompt = (
        "Ты — куратор-наставник онлайн-курса. Твоя задача — помочь ученику выполнить домашнее задание.\n\n"
        "Правила работы:\n"
        "- Не давай готовый ответ сразу. Направляй ученика вопросами и подсказками.\n"
        "- Если ученик написал свой ответ или размышление — оцени его, укажи что хорошо и что можно улучшить.\n"
        "- Задавай по одному уточняющему вопросу за раз, не перегружай.\n"
        "- Если ученик явно выполнил задание — подведи итог и похвали.\n"
        "- Отвечай на языке ученика. Обращайся на «ты».\n"
        "- Будь тёплым, поддерживающим, профессиональным.\n\n"
    )
    if lesson_title:
        system_prompt += f"Урок: {lesson_title}\n"
    if lesson_content:
        system_prompt += f"\nМатериал урока:\n{lesson_content}\n"
    if ai_context:
        system_prompt += f"\nДополнительный контекст:\n{ai_context}\n"
    if homework_text:
        system_prompt += f"\nДОМАШНЕЕ ЗАДАНИЕ:\n{homework_text}\n"
    system_prompt += "\nВеди диалог пока ученик не выполнит задание полностью."

    # Ограничиваем историю последними 10 сообщениями чтобы не выйти за лимит токенов
    trimmed_history = history[-10:] if len(history) > 10 else history
    messages = [{"role": "system", "content": system_prompt}]
    for h in trimmed_history:
        if h.get("role") in ("user", "assistant") and h.get("content"):
            messages.append({"role": h["role"], "content": h["content"]})
    messages.append({"role": "user", "content": message})

    api_key = os.environ.get("OPENAI_API_KEY", "")
    payload = json.dumps({
        "model": "openai/gpt-4o-mini",
        "messages": messages,
        "max_tokens": 700,
        "temperature": 0.6,
    }).encode()

    req = urllib.request.Request(
        "https://api.polza.ai/v1/chat/completions",
        data=payload,
        headers={"Content-Type": "application/json", "Authorization": f"Bearer {api_key}"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=25) as resp:
        data = json.loads(resp.read())
    answer = data["choices"][0]["message"]["content"]

    if salon_id:
        deduct_energy(salon_id, user["id"], LESSON_AI_COST, f"Домашнее задание «{lesson_title}»", conn)
    return ok({"answer": answer})


# ── Админ ─────────────────────────────────────────────────────────────────────

def require_admin(event, conn):
    user = get_session_user(event, conn)
    if not user or not user.get("is_admin"):
        return None, err("Нет доступа", 403)
    return user, None


def handle_admin_courses_list(event, conn):
    _, e = require_admin(event, conn)
    if e: return e
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT c.*, "
        f"(SELECT COUNT(*) FROM {tbl('course_modules')} WHERE course_id=c.id) as modules_count, "
        f"(SELECT COUNT(*) FROM {tbl('course_lessons')} WHERE course_id=c.id) as lessons_count "
        f"FROM {tbl('courses')} c ORDER BY c.sort_order, c.id"
    )
    return ok([dict(r) for r in cur.fetchall()])


def handle_admin_course_save(event, conn):
    _, e = require_admin(event, conn)
    if e: return e
    body = json.loads(event.get("body") or "{}")
    cid = body.get("id")
    title = (body.get("title") or "").strip()
    if not title:
        return err("Название обязательно")

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    fields = {
        "title": title,
        "description": body.get("description", ""),
        "cover_url": body.get("cover_url", ""),
        "category": body.get("category", "body"),
        "is_published": bool(body.get("is_published", False)),
        "sort_order": int(body.get("sort_order", 0)),
        "access_cost": int(body.get("access_cost", 0)),
        "lesson_cost": int(body.get("lesson_cost", 1)),
    }
    if cid:
        sets = ", ".join(f"{k}=%s" for k in fields)
        cur.execute(
            f"UPDATE {tbl('courses')} SET {sets}, updated_at=NOW() WHERE id=%s RETURNING id",
            list(fields.values()) + [cid]
        )
        row = cur.fetchone()
        conn.commit()
        return ok({"id": row["id"], "ok": True})
    else:
        cols = ", ".join(fields.keys())
        placeholders = ", ".join(["%s"] * len(fields))
        cur.execute(
            f"INSERT INTO {tbl('courses')} ({cols}) VALUES ({placeholders}) RETURNING id",
            list(fields.values())
        )
        new_id = cur.fetchone()["id"]
        conn.commit()
        return ok({"id": new_id, "ok": True})


def handle_admin_module_save(event, conn):
    _, e = require_admin(event, conn)
    if e: return e
    body = json.loads(event.get("body") or "{}")
    mid = body.get("id")
    title = (body.get("title") or "").strip()
    course_id = body.get("course_id")
    if not title or not course_id:
        return err("title и course_id обязательны")

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    if mid:
        cur.execute(
            f"UPDATE {tbl('course_modules')} SET title=%s, sort_order=%s WHERE id=%s RETURNING id",
            (title, int(body.get("sort_order", 0)), mid)
        )
    else:
        cur.execute(
            f"INSERT INTO {tbl('course_modules')} (course_id,title,sort_order) VALUES (%s,%s,%s) RETURNING id",
            (course_id, title, int(body.get("sort_order", 0)))
        )
    row = cur.fetchone()
    conn.commit()
    return ok({"id": row["id"], "ok": True})


def handle_admin_module_delete(event, conn):
    _, e = require_admin(event, conn)
    if e: return e
    body = json.loads(event.get("body") or "{}")
    mid = body.get("id")
    if not mid:
        return err("id обязателен")
    cur = conn.cursor()
    cur.execute(f"UPDATE {tbl('course_lessons')} SET module_id=NULL WHERE module_id=%s", (mid,))
    cur.execute(f"DELETE FROM {tbl('course_modules')} WHERE id=%s", (mid,))
    conn.commit()
    return ok({"ok": True})


def handle_admin_lesson_save(event, conn):
    _, e = require_admin(event, conn)
    if e: return e
    body = json.loads(event.get("body") or "{}")
    lid = body.get("id")
    title = (body.get("title") or "").strip()
    module_id = body.get("module_id")
    course_id = body.get("course_id")
    if not title or not module_id or not course_id:
        return err("title, module_id, course_id обязательны")

    video_urls = json.dumps(body.get("video_urls") or [])
    links = json.dumps(body.get("links") or [])

    homework = body.get("homework", "")

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    if lid:
        cur.execute(
            f"UPDATE {tbl('course_lessons')} SET title=%s, content=%s, video_urls=%s, links=%s, "
            f"ai_context=%s, homework=%s, sort_order=%s, module_id=%s WHERE id=%s RETURNING id",
            (title, body.get("content", ""), video_urls, links,
             body.get("ai_context", ""), homework, int(body.get("sort_order", 0)), module_id, lid)
        )
    else:
        cur.execute(
            f"INSERT INTO {tbl('course_lessons')} (module_id,course_id,title,content,video_urls,links,ai_context,homework,sort_order) "
            f"VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id",
            (module_id, course_id, title, body.get("content", ""), video_urls, links,
             body.get("ai_context", ""), homework, int(body.get("sort_order", 0)))
        )
    row = cur.fetchone()
    conn.commit()
    return ok({"id": row["id"], "ok": True})


def handle_admin_lesson_delete(event, conn):
    _, e = require_admin(event, conn)
    if e: return e
    body = json.loads(event.get("body") or "{}")
    lid = body.get("id")
    if not lid:
        return err("id обязателен")
    cur = conn.cursor()
    cur.execute(f"DELETE FROM {tbl('lesson_files')} WHERE lesson_id=%s", (lid,))
    cur.execute(f"DELETE FROM {tbl('lesson_photos')} WHERE lesson_id=%s", (lid,))
    cur.execute(f"DELETE FROM {tbl('lesson_access')} WHERE lesson_id=%s", (lid,))
    cur.execute(f"DELETE FROM {tbl('course_lessons')} WHERE id=%s", (lid,))
    conn.commit()
    return ok({"ok": True})


def handle_admin_lesson_photo_add(event, conn):
    _, e = require_admin(event, conn)
    if e: return e
    body = json.loads(event.get("body") or "{}")
    lesson_id = body.get("lesson_id")
    data_b64 = body.get("data")
    filename = body.get("filename", "photo.jpg")
    if not lesson_id or not data_b64:
        return err("lesson_id и data обязательны")

    file_bytes = base64.b64decode(data_b64)
    key = f"courses/lessons/{lesson_id}/photos/{filename}"
    s3 = s3_client()
    mime = "image/jpeg"
    if filename.lower().endswith(".png"):
        mime = "image/png"
    elif filename.lower().endswith(".webp"):
        mime = "image/webp"
    s3.put_object(Bucket="files", Key=key, Body=file_bytes, ContentType=mime)
    url = cdn_url(key)

    cur = conn.cursor()
    cur.execute(
        f"SELECT COALESCE(MAX(sort_order),0)+1 FROM {tbl('lesson_photos')} WHERE lesson_id=%s", (lesson_id,)
    )
    sort_order = cur.fetchone()[0]
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"INSERT INTO {tbl('lesson_photos')} (lesson_id,url,sort_order) VALUES (%s,%s,%s) RETURNING id",
        (lesson_id, url, sort_order)
    )
    new_id = cur.fetchone()["id"]
    conn.commit()
    return ok({"id": new_id, "url": url, "ok": True})


def handle_admin_lesson_photo_delete(event, conn):
    _, e = require_admin(event, conn)
    if e: return e
    body = json.loads(event.get("body") or "{}")
    photo_id = body.get("id")
    if not photo_id:
        return err("id обязателен")
    cur = conn.cursor()
    cur.execute(f"DELETE FROM {tbl('lesson_photos')} WHERE id=%s", (photo_id,))
    conn.commit()
    return ok({"ok": True})


def handle_admin_lesson_file_add(event, conn):
    _, e = require_admin(event, conn)
    if e: return e
    body = json.loads(event.get("body") or "{}")
    lesson_id = body.get("lesson_id")
    data_b64 = body.get("data")
    filename = body.get("filename", "file")
    if not lesson_id or not data_b64:
        return err("lesson_id и data обязательны")

    file_bytes = base64.b64decode(data_b64)
    key = f"courses/lessons/{lesson_id}/files/{filename}"
    s3 = s3_client()
    s3.put_object(Bucket="files", Key=key, Body=file_bytes, ContentType="application/octet-stream")
    url = cdn_url(key)

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"INSERT INTO {tbl('lesson_files')} (lesson_id,name,url,size_bytes,mime_type) "
        f"VALUES (%s,%s,%s,%s,%s) RETURNING id",
        (lesson_id, filename, url, len(file_bytes), "application/octet-stream")
    )
    new_id = cur.fetchone()["id"]
    conn.commit()
    return ok({"id": new_id, "url": url, "ok": True})


def handle_admin_lesson_file_delete(event, conn):
    _, e = require_admin(event, conn)
    if e: return e
    body = json.loads(event.get("body") or "{}")
    file_id = body.get("id")
    if not file_id:
        return err("id обязателен")
    cur = conn.cursor()
    cur.execute(f"DELETE FROM {tbl('lesson_files')} WHERE id=%s", (file_id,))
    conn.commit()
    return ok({"ok": True})


def handle_admin_lesson_tools_save(event, conn):
    _, e = require_admin(event, conn)
    if e: return e
    body = json.loads(event.get("body") or "{}")
    lesson_id = body.get("lesson_id")
    tools = body.get("tools") or []
    if not lesson_id:
        return err("lesson_id обязателен")
    cur = conn.cursor()
    cur.execute(f"DELETE FROM {tbl('lesson_tools')} WHERE lesson_id=%s", (lesson_id,))
    for i, slug in enumerate(tools):
        cur.execute(
            f"INSERT INTO {tbl('lesson_tools')} (lesson_id, tool_slug, sort_order) VALUES (%s,%s,%s)",
            (lesson_id, slug, i)
        )
    conn.commit()
    return ok({"ok": True})


def handle_admin_grant_access(event, conn):
    _, e = require_admin(event, conn)
    if e: return e
    body = json.loads(event.get("body") or "{}")
    user_id = body.get("user_id")
    course_id = body.get("course_id")
    if not user_id or not course_id:
        return err("user_id и course_id обязательны")
    cur = conn.cursor()
    cur.execute(
        f"INSERT INTO {tbl('course_access')} (user_id,course_id) VALUES (%s,%s) ON CONFLICT DO NOTHING",
        (user_id, course_id)
    )
    conn.commit()
    return ok({"ok": True})


def handle_admin_course_cover_upload(event, conn):
    _, e = require_admin(event, conn)
    if e: return e
    body = json.loads(event.get("body") or "{}")
    course_id = body.get("course_id")
    data_b64 = body.get("data")
    filename = body.get("filename", "cover.jpg")
    if not data_b64:
        return err("data обязателен")

    file_bytes = base64.b64decode(data_b64)
    ext = filename.rsplit(".", 1)[-1].lower() if "." in filename else "jpg"
    mime = {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png", "webp": "image/webp"}.get(ext, "image/jpeg")
    key = f"courses/covers/{course_id or 'new'}/{filename}"
    s3 = s3_client()
    s3.put_object(Bucket="files", Key=key, Body=file_bytes, ContentType=mime)
    url = cdn_url(key)
    return ok({"url": url, "ok": True})


def handle_admin_course_detail(event, conn):
    _, e = require_admin(event, conn)
    if e: return e
    qs = event.get("queryStringParameters") or {}
    course_id = qs.get("course_id")
    if not course_id:
        return err("course_id обязателен")

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT * FROM {tbl('courses')} WHERE id=%s", (course_id,))
    course = cur.fetchone()
    if not course:
        return err("Курс не найден", 404)
    course = dict(course)

    cur.execute(
        f"SELECT id, title, sort_order FROM {tbl('course_modules')} WHERE course_id=%s ORDER BY sort_order, id",
        (course_id,)
    )
    modules = [dict(r) for r in cur.fetchall()]
    module_ids = [m["id"] for m in modules]

    if not module_ids:
        course["modules"] = []
        return ok(course)

    # Загружаем уроки без тяжёлых полей (content/ai_context/homework грузятся при открытии урока)
    cur.execute(
        f"SELECT id, module_id, course_id, title, video_urls, links, sort_order "
        f"FROM {tbl('course_lessons')} WHERE course_id=%s ORDER BY sort_order, id",
        (course_id,)
    )
    all_lessons = [dict(r) for r in cur.fetchall()]
    lesson_ids = [l["id"] for l in all_lessons]

    # Собираем уроки по модулям
    lessons_by_module = {}
    for l in all_lessons:
        l["photos"] = []
        l["files"] = []
        l["tools"] = []
        lessons_by_module.setdefault(l["module_id"], []).append(l)

    for m in modules:
        m["lessons"] = lessons_by_module.get(m["id"], [])

    course["modules"] = modules
    return ok(course)


def handle_admin_lesson_detail(event, conn):
    _, e = require_admin(event, conn)
    if e: return e
    qs = event.get("queryStringParameters") or {}
    lesson_id = qs.get("lesson_id")
    if not lesson_id:
        return err("lesson_id обязателен")

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT id, module_id, course_id, title, content, video_urls, links, ai_context, homework, sort_order "
        f"FROM {tbl('course_lessons')} WHERE id=%s", (lesson_id,)
    )
    row = cur.fetchone()
    if not row:
        return err("Урок не найден", 404)
    lesson = dict(row)
    lesson["video_urls"] = json.loads(lesson["video_urls"]) if isinstance(lesson["video_urls"], str) else (lesson["video_urls"] or [])
    lesson["links"] = json.loads(lesson["links"]) if isinstance(lesson["links"], str) else (lesson["links"] or [])

    cur.execute(f"SELECT id, url, sort_order FROM {tbl('lesson_photos')} WHERE lesson_id=%s ORDER BY sort_order, id", (lesson_id,))
    lesson["photos"] = [dict(r) for r in cur.fetchall()]

    cur.execute(f"SELECT id, name, url FROM {tbl('lesson_files')} WHERE lesson_id=%s ORDER BY id", (lesson_id,))
    lesson["files"] = [dict(r) for r in cur.fetchall()]

    cur.execute(f"SELECT tool_slug FROM {tbl('lesson_tools')} WHERE lesson_id=%s ORDER BY sort_order, id", (lesson_id,))
    lesson["tools"] = [r["tool_slug"] for r in cur.fetchall()]

    return ok(lesson)


def handle_admin_rehost_images(event, conn):
    """Скачивает внешние картинки из HTML, загружает в S3 и возвращает HTML с заменёнными URL."""
    _, e = require_admin(event, conn)
    if e: return e

    body = json.loads(event.get("body") or "{}")
    html = body.get("html") or ""
    lesson_id = body.get("lesson_id") or "tmp"

    if not html:
        return err("html обязателен")

    s3 = s3_client()
    access_key = os.environ["AWS_ACCESS_KEY_ID"]

    img_urls = re.findall(r'<img[^>]+src=["\']([^"\']+)["\']', html, re.IGNORECASE)
    replaced = 0
    errors = []

    for src in img_urls:
        if not src.startswith("http"):
            continue
        if "cdn.poehali.dev" in src:
            continue
        try:
            req = urllib.request.Request(src, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = resp.read()
                content_type = resp.headers.get("Content-Type", "image/jpeg").split(";")[0].strip()

            ext_map = {
                "image/jpeg": "jpg", "image/jpg": "jpg",
                "image/png": "png", "image/webp": "webp",
                "image/gif": "gif", "image/svg+xml": "svg",
            }
            ext = ext_map.get(content_type, "jpg")
            filename = hashlib.md5(src.encode()).hexdigest()[:12] + "." + ext
            key = f"courses/lessons/{lesson_id}/images/{filename}"

            s3.put_object(Bucket="files", Key=key, Body=data, ContentType=content_type)
            new_url = f"https://cdn.poehali.dev/projects/{access_key}/bucket/{key}"
            html = html.replace(src, new_url)
            replaced += 1
        except Exception as ex:
            errors.append(str(ex)[:80])

    return ok({"html": html, "replaced": replaced, "errors": errors})


# ── Роутер ────────────────────────────────────────────────────────────────────

ROUTES = {
    "courses_list":              handle_courses_list,
    "course_detail":             handle_course_detail,
    "course_access":             handle_course_access,
    "lesson_open":               handle_lesson_open,
    "lesson_ask_ai":             handle_lesson_ask_ai,
    "lesson_homework_ai":        handle_lesson_homework_ai,
    "admin_courses_list":        handle_admin_courses_list,
    "admin_course_save":         handle_admin_course_save,
    "admin_module_save":         handle_admin_module_save,
    "admin_module_delete":       handle_admin_module_delete,
    "admin_lesson_save":         handle_admin_lesson_save,
    "admin_course_cover_upload": handle_admin_course_cover_upload,
    "admin_lesson_delete":       handle_admin_lesson_delete,
    "admin_lesson_photo_add":    handle_admin_lesson_photo_add,
    "admin_lesson_photo_delete": handle_admin_lesson_photo_delete,
    "admin_lesson_file_add":     handle_admin_lesson_file_add,
    "admin_lesson_file_delete":  handle_admin_lesson_file_delete,
    "admin_grant_access":        handle_admin_grant_access,
    "admin_lesson_tools_save":   handle_admin_lesson_tools_save,
    "admin_course_detail":       handle_admin_course_detail,
    "admin_lesson_detail":       handle_admin_lesson_detail,
    "admin_rehost_images":       handle_admin_rehost_images,
}


def handler(event: dict, context) -> dict:
    """API для системы курсов Академии: витрина, просмотр, покупка доступа, ИИ-помощник, управление (админ)."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    qs = event.get("queryStringParameters") or {}
    action = qs.get("action", "")

    if action not in ROUTES:
        return err(f"Неизвестный action: {action}", 404)

    conn = get_db()
    try:
        return ROUTES[action](event, conn)
    finally:
        conn.close()