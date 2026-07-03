"""
Публичный API чемпионата красоты.
GET  ?action=seasons          — список сезонов
GET  ?action=tournaments      — турниры (с фильтрами status, season_id)
GET  ?action=tournament       — один турнир по slug или id
GET  ?action=works            — работы турнира (публичные, после модерации)
GET  ?action=work             — одна работа по id
GET  ?action=salon_profile    — публичный профиль салона
GET  ?action=rating           — рейтинг салонов (фильтры: city, category, limit)
GET  ?action=hall_of_fame     — зал славы: победители по годам/категориям
GET  ?action=achievements     — достижения салона
GET  ?action=my_tournaments   — мои турниры (требует X-Session-Id)
GET  ?action=my_work          — моя работа в турнире (tournament_id, требует X-Session-Id)
GET  ?action=stats            — общая статистика (счётчики)
POST ?action=apply            — подать заявку на турнир (требует X-Session-Id)
POST ?action=withdraw         — отозвать заявку
POST ?action=submit_work      — отправить / обновить работу
"""
import json
import os
import psycopg2
import psycopg2.extras

S = "t_p84565078_code_expression_proj"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}


def tbl(name): return f"{S}.{name}"
def get_db(): return psycopg2.connect(os.environ["DATABASE_URL"])
def ok(data, status=200): return {"statusCode": status, "headers": CORS, "body": json.dumps(data, ensure_ascii=False, default=str)}
def err(msg, status=400): return {"statusCode": status, "headers": CORS, "body": json.dumps({"error": msg}, ensure_ascii=False)}


def get_session_user(event, conn):
    sid = (event.get("headers") or {}).get("X-Session-Id", "")
    if not sid:
        return None
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT u.* FROM {tbl('lk_sessions')} s "
        f"JOIN {tbl('lk_users')} u ON u.id = s.user_id "
        f"WHERE s.id = %s AND s.expires_at > NOW() AND u.is_active = TRUE",
        (sid,)
    )
    return cur.fetchone()


def handler(event: dict, context) -> dict:
    """Публичный API чемпионата красоты Промт Диалог."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    qs = event.get("queryStringParameters") or {}
    action = qs.get("action", "")

    routes = {
        ("GET",  "seasons"):        handle_seasons,
        ("GET",  "tournaments"):    handle_tournaments,
        ("GET",  "tournament"):     handle_tournament,
        ("GET",  "works"):          handle_works,
        ("GET",  "work"):           handle_work,
        ("GET",  "salon_profile"):  handle_salon_profile,
        ("GET",  "rating"):         handle_rating,
        ("GET",  "hall_of_fame"):   handle_hall_of_fame,
        ("GET",  "achievements"):   handle_achievements,
        ("GET",  "my_tournaments"): handle_my_tournaments,
        ("GET",  "my_work"):        handle_my_work,
        ("GET",  "stats"):          handle_stats,
        ("POST", "apply"):          handle_apply,
        ("POST", "withdraw"):       handle_withdraw,
        ("POST", "submit_work"):    handle_submit_work,
    }
    fn = routes.get((method, action))
    if fn:
        return fn(event)
    return err("Not found", 404)


# ── Сезоны ────────────────────────────────────────────────────────────────────

def handle_seasons(event):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT * FROM {tbl('ch_seasons')} ORDER BY starts_at DESC")
    return ok({"seasons": [dict(r) for r in cur.fetchall()]})


# ── Турниры ───────────────────────────────────────────────────────────────────

def handle_tournaments(event):
    qs = event.get("queryStringParameters") or {}
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    where = ["1=1"]
    params = []
    if qs.get("season_id"):
        where.append("t.season_id = %s"); params.append(qs["season_id"])
    if qs.get("status"):
        where.append("t.status = %s"); params.append(qs["status"])
    if qs.get("statuses"):
        statuses = qs["statuses"].split(",")
        where.append(f"t.status = ANY(%s)"); params.append(statuses)

    cur.execute(
        f"""SELECT t.*,
               s.name as season_name,
               COUNT(DISTINCT a.id) as applications_count,
               COUNT(DISTINCT w.id) as works_count
            FROM {tbl('ch_tournaments')} t
            LEFT JOIN {tbl('ch_seasons')} s ON s.id = t.season_id
            LEFT JOIN {tbl('ch_applications')} a ON a.tournament_id = t.id AND a.status = 'approved'
            LEFT JOIN {tbl('ch_works')} w ON w.tournament_id = t.id AND w.status = 'approved'
            WHERE {' AND '.join(where)}
            GROUP BY t.id, s.name
            ORDER BY t.registration_starts DESC NULLS LAST""",
        params
    )
    rows = cur.fetchall()

    # Скрываем задание до старта
    result = []
    for r in rows:
        d = dict(r)
        if d.get("status") not in ("active", "voting", "finished"):
            d["task_text"] = None
        result.append(d)
    return ok({"tournaments": result})


def handle_tournament(event):
    qs = event.get("queryStringParameters") or {}
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    if qs.get("slug"):
        cur.execute(
            f"""SELECT t.*, s.name as season_name,
                   COUNT(DISTINCT a.id) as applications_count,
                   COUNT(DISTINCT w.id) as works_count
                FROM {tbl('ch_tournaments')} t
                LEFT JOIN {tbl('ch_seasons')} s ON s.id = t.season_id
                LEFT JOIN {tbl('ch_applications')} a ON a.tournament_id = t.id AND a.status = 'approved'
                LEFT JOIN {tbl('ch_works')} w ON w.tournament_id = t.id AND w.status = 'approved'
                WHERE t.slug = %s GROUP BY t.id, s.name""",
            (qs["slug"],)
        )
    else:
        cur.execute(
            f"""SELECT t.*, s.name as season_name,
                   COUNT(DISTINCT a.id) as applications_count,
                   COUNT(DISTINCT w.id) as works_count
                FROM {tbl('ch_tournaments')} t
                LEFT JOIN {tbl('ch_seasons')} s ON s.id = t.season_id
                LEFT JOIN {tbl('ch_applications')} a ON a.tournament_id = t.id AND a.status = 'approved'
                LEFT JOIN {tbl('ch_works')} w ON w.tournament_id = t.id AND w.status = 'approved'
                WHERE t.id = %s GROUP BY t.id, s.name""",
            (qs.get("id", 0),)
        )
    row = cur.fetchone()
    if not row:
        return err("Турнир не найден", 404)

    d = dict(row)
    if d.get("status") not in ("active", "voting", "finished"):
        d["task_text"] = None

    # Призы
    cur.execute(
        f"""SELECT p.*, pt.name as partner_name, pt.logo_url as partner_logo
            FROM {tbl('ch_prizes')} p
            LEFT JOIN {tbl('ch_partners')} pt ON pt.id = p.partner_id
            WHERE p.tournament_id = %s ORDER BY p.place""",
        (d["id"],)
    )
    d["prizes"] = [dict(r) for r in cur.fetchall()]

    # Проверяем есть ли заявка от текущего пользователя
    d["my_application_status"] = None
    user = get_session_user(event, conn)
    if user and user.get("salon_id"):
        cur.execute(
            f"SELECT status FROM {tbl('ch_applications')} WHERE tournament_id = %s AND salon_id = %s LIMIT 1",
            (d["id"], user["salon_id"])
        )
        app_row = cur.fetchone()
        if app_row:
            d["my_application_status"] = app_row["status"]

    return ok({"tournament": d})


# ── Работы ────────────────────────────────────────────────────────────────────

def handle_works(event):
    qs = event.get("queryStringParameters") or {}
    tournament_id = qs.get("tournament_id")
    if not tournament_id:
        return err("tournament_id обязателен")

    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    # Работы видны только когда голосование открыто или турнир завершён
    cur.execute(f"SELECT status, voting_starts, voting_ends FROM {tbl('ch_tournaments')} WHERE id = %s", (tournament_id,))
    t = cur.fetchone()
    if not t:
        return err("Турнир не найден", 404)

    voting_open = t["status"] in ("voting", "finished_pending", "finished")
    reveal = t["status"] == "finished"

    if not voting_open:
        return ok({"works": [], "revealed": False, "hidden_until_voting": True})

    cur.execute(
        f"""SELECT w.id, w.title, w.description, w.story, w.services_done,
               w.master_name, w.tools_used, w.video_url,
               w.photos, w.votes_count,
               w.total_score, w.final_place, w.created_at,
               CASE WHEN %s THEN sl.name ELSE NULL END as salon_name,
               CASE WHEN %s THEN sl.logo_url ELSE NULL END as salon_logo,
               CASE WHEN %s THEN sl.city ELSE NULL END as salon_city,
               CASE WHEN %s THEN sl.website_url ELSE NULL END as salon_url
            FROM {tbl('ch_works')} w
            JOIN {tbl('salons')} sl ON sl.id = w.salon_id
            WHERE w.tournament_id = %s AND w.is_public = TRUE
            ORDER BY w.votes_count DESC, w.created_at ASC""",
        (reveal, reveal, reveal, reveal, tournament_id)
    )
    return ok({"works": [dict(r) for r in cur.fetchall()], "revealed": reveal})


def handle_work(event):
    qs = event.get("queryStringParameters") or {}
    work_id = qs.get("id")
    if not work_id:
        return err("id обязателен")

    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"""SELECT w.*,
               t.status as tournament_status, t.name as tournament_name, t.slug as tournament_slug,
               t.voting_ends,
               CASE WHEN t.status = 'finished' THEN sl.name ELSE NULL END as salon_name,
               CASE WHEN t.status = 'finished' THEN sl.logo_url ELSE NULL END as salon_logo,
               CASE WHEN t.status = 'finished' THEN sl.city ELSE NULL END as salon_city,
               CASE WHEN t.status = 'finished' THEN sl.website_url ELSE NULL END as salon_url
            FROM {tbl('ch_works')} w
            JOIN {tbl('ch_tournaments')} t ON t.id = w.tournament_id
            JOIN {tbl('salons')} sl ON sl.id = w.salon_id
            WHERE w.id = %s AND w.is_public = TRUE""",
        (work_id,)
    )
    row = cur.fetchone()
    if not row:
        return err("Работа не найдена", 404)

    # Количество голосов
    cur.execute(f"SELECT COUNT(*) as cnt FROM {tbl('ch_votes')} WHERE work_id = %s", (work_id,))
    votes = cur.fetchone()["cnt"]
    d = dict(row)
    d["votes_count"] = votes
    return ok({"work": d})


# ── Профиль салона ────────────────────────────────────────────────────────────

def handle_salon_profile(event):
    qs = event.get("queryStringParameters") or {}
    salon_id = qs.get("salon_id")
    if not salon_id:
        return err("salon_id обязателен")

    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    cur.execute(
        f"SELECT id, name, logo_url, city, address, phone, website_url, description FROM {tbl('salons')} WHERE id = %s",
        (salon_id,)
    )
    salon = cur.fetchone()
    if not salon:
        return err("Салон не найден", 404)

    # Рейтинг
    cur.execute(f"SELECT * FROM {tbl('ch_ratings')} WHERE salon_id = %s", (salon_id,))
    rating = cur.fetchone()

    # Достижения
    cur.execute(
        f"""SELECT a.*, at.code, at.name as achievement_name, at.icon, at.description as achievement_desc
            FROM {tbl('ch_salon_achievements')} a
            JOIN {tbl('ch_achievement_types')} at ON at.id = a.achievement_id
            WHERE a.salon_id = %s ORDER BY a.awarded_at DESC""",
        (salon_id,)
    )
    achievements = [dict(r) for r in cur.fetchall()]

    # Лучшие работы
    cur.execute(
        f"""SELECT w.id, w.title, w.description, w.photos, w.votes_count, w.final_place,
               t.name as tournament_name, t.slug as tournament_slug
            FROM {tbl('ch_works')} w
            JOIN {tbl('ch_tournaments')} t ON t.id = w.tournament_id
            WHERE w.salon_id = %s AND w.is_public = TRUE AND t.status = 'finished'
            ORDER BY w.final_place ASC NULLS LAST, w.votes_count DESC LIMIT 12""",
        (salon_id,)
    )
    works = [dict(r) for r in cur.fetchall()]

    # История турниров
    cur.execute(
        f"""SELECT t.id, t.name, t.slug, t.status, t.category, t.emoji,
               a.status as application_status,
               w.final_place, w.votes_count, w.total_score
            FROM {tbl('ch_applications')} a
            JOIN {tbl('ch_tournaments')} t ON t.id = a.tournament_id
            LEFT JOIN {tbl('ch_works')} w ON w.tournament_id = t.id AND w.salon_id = a.salon_id
            WHERE a.salon_id = %s
            ORDER BY t.registration_starts DESC NULLS LAST LIMIT 50""",
        (salon_id,)
    )
    history = [dict(r) for r in cur.fetchall()]

    return ok({
        "salon": dict(salon),
        "rating": dict(rating) if rating else None,
        "achievements": achievements,
        "works": works,
        "history": history,
    })


# ── Рейтинг ──────────────────────────────────────────────────────────────────

def handle_rating(event):
    qs = event.get("queryStringParameters") or {}
    limit = min(int(qs.get("limit", 50)), 200)
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    where = ["1=1"]
    params = []
    if qs.get("city"):
        where.append("sl.city ILIKE %s"); params.append(f"%{qs['city']}%")

    params.append(limit)
    cur.execute(
        f"""SELECT r.*, sl.name as salon_name, sl.logo_url, sl.city, sl.website_url
            FROM {tbl('ch_ratings')} r
            JOIN {tbl('salons')} sl ON sl.id = r.salon_id
            WHERE {' AND '.join(where)}
            ORDER BY r.total_points DESC
            LIMIT %s""",
        params
    )
    return ok({"rating": [dict(r) for r in cur.fetchall()]})


# ── Зал славы ─────────────────────────────────────────────────────────────────

def handle_hall_of_fame(event):
    qs = event.get("queryStringParameters") or {}
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    where = ["w.final_place IS NOT NULL AND w.final_place <= 3 AND t.status = 'finished'"]
    params = []
    if qs.get("year"):
        where.append("EXTRACT(YEAR FROM t.voting_ends) = %s"); params.append(int(qs["year"]))
    if qs.get("category"):
        where.append("t.category = %s"); params.append(qs["category"])

    cur.execute(
        f"""SELECT w.id, w.title, w.photos, w.votes_count, w.final_place, w.total_score,
               sl.id as salon_id, sl.name as salon_name, sl.logo_url, sl.city, sl.website_url,
               t.id as tournament_id, t.name as tournament_name, t.slug as tournament_slug,
               t.category, t.emoji,
               EXTRACT(YEAR FROM t.voting_ends)::INT as year
            FROM {tbl('ch_works')} w
            JOIN {tbl('salons')} sl ON sl.id = w.salon_id
            JOIN {tbl('ch_tournaments')} t ON t.id = w.tournament_id
            WHERE {' AND '.join(where)}
            ORDER BY t.voting_ends DESC, w.final_place ASC
            LIMIT 200""",
        params
    )
    return ok({"hall_of_fame": [dict(r) for r in cur.fetchall()]})


# ── Достижения ────────────────────────────────────────────────────────────────

def handle_achievements(event):
    qs = event.get("queryStringParameters") or {}
    salon_id = qs.get("salon_id")
    if not salon_id:
        return err("salon_id обязателен")

    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"""SELECT sa.*, at.code, at.name as achievement_name, at.description as achievement_desc,
               at.icon, at.points, t.name as tournament_name
            FROM {tbl('ch_salon_achievements')} sa
            JOIN {tbl('ch_achievement_types')} at ON at.id = sa.achievement_id
            LEFT JOIN {tbl('ch_tournaments')} t ON t.id = sa.tournament_id
            WHERE sa.salon_id = %s ORDER BY sa.awarded_at DESC""",
        (salon_id,)
    )
    return ok({"achievements": [dict(r) for r in cur.fetchall()]})


# ── Моя работа ────────────────────────────────────────────────────────────────

def handle_my_work(event):
    conn = get_db()
    user = get_session_user(event, conn)
    if not user:
        return err("Требуется авторизация", 401)
    salon_id = user.get("salon_id")
    if not salon_id:
        return err("Нет привязанного салона", 400)
    qs = event.get("queryStringParameters") or {}
    tournament_id = qs.get("tournament_id")
    if not tournament_id:
        return err("tournament_id обязателен")
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT * FROM {tbl('ch_works')} WHERE tournament_id=%s AND salon_id=%s",
        (tournament_id, salon_id)
    )
    work = cur.fetchone()
    return ok({"work": dict(work) if work else None})


# ── Мои турниры ───────────────────────────────────────────────────────────────

def handle_my_tournaments(event):
    conn = get_db()
    user = get_session_user(event, conn)
    if not user:
        return err("Требуется авторизация", 401)

    salon_id = user.get("salon_id")
    if not salon_id:
        return err("Нет привязанного салона", 400)

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"""SELECT a.id as application_id, a.status as application_status, a.created_at as applied_at,
               t.id, t.name, t.slug, t.status, t.category, t.emoji,
               t.task_text, t.task_opens_at, t.work_deadline, t.voting_starts, t.voting_ends,
               w.id as work_id, w.status as work_status, w.votes_count,
               w.expert_score, w.total_score, w.final_place,
               (SELECT COALESCE(SUM(v.score),0) FROM {tbl('ch_votes')} v WHERE v.work_id = w.id) as real_votes
            FROM {tbl('ch_applications')} a
            JOIN {tbl('ch_tournaments')} t ON t.id = a.tournament_id
            LEFT JOIN {tbl('ch_works')} w ON w.tournament_id = t.id AND w.salon_id = a.salon_id
            WHERE a.salon_id = %s
            ORDER BY a.created_at DESC""",
        (salon_id,)
    )
    rows = cur.fetchall()
    result = []
    for r in rows:
        d = dict(r)
        result.append(d)

    # Рейтинг салона
    cur.execute(f"SELECT * FROM {tbl('ch_ratings')} WHERE salon_id = %s", (salon_id,))
    rating = cur.fetchone()

    return ok({"my_tournaments": result, "salon_id": salon_id, "rating": dict(rating) if rating else None})


# ── Статистика ────────────────────────────────────────────────────────────────

def handle_stats(event):
    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT COUNT(*) as cnt FROM {tbl('ch_applications')} WHERE status = 'approved'")
    participants = cur.fetchone()["cnt"]
    cur.execute(f"SELECT COUNT(*) as cnt FROM {tbl('ch_works')} WHERE is_public = TRUE")
    works = cur.fetchone()["cnt"]
    cur.execute(f"SELECT COUNT(*) as cnt FROM {tbl('ch_votes')}")
    votes = cur.fetchone()["cnt"]
    cur.execute(f"SELECT COUNT(*) as cnt FROM {tbl('ch_tournaments')} WHERE status NOT IN ('draft','cancelled')")
    tournaments = cur.fetchone()["cnt"]

    # Активный сезон
    cur.execute(
        f"""SELECT s.*, SUM(COALESCE(t.prize_energy,0)) as total_prize
            FROM {tbl('ch_seasons')} s
            LEFT JOIN {tbl('ch_tournaments')} t ON t.season_id = s.id
            WHERE s.is_active = TRUE GROUP BY s.id LIMIT 1"""
    )
    season = cur.fetchone()

    return ok({
        "participants": participants,
        "works": works,
        "votes": votes,
        "tournaments": tournaments,
        "active_season": dict(season) if season else None,
    })


# ── Подача заявки ─────────────────────────────────────────────────────────────

def handle_apply(event):
    conn = get_db()
    user = get_session_user(event, conn)
    if not user:
        return err("Требуется авторизация", 401)

    salon_id = user.get("salon_id")
    if not salon_id:
        return err("Нет привязанного салона", 400)

    body = json.loads(event.get("body") or "{}")
    tournament_id = body.get("tournament_id")
    if not tournament_id:
        return err("tournament_id обязателен")

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT status, registration_ends FROM {tbl('ch_tournaments')} WHERE id = %s", (tournament_id,))
    t = cur.fetchone()
    if not t:
        return err("Турнир не найден", 404)
    if t["status"] not in ("announced", "registration"):
        return err("Регистрация на этот турнир закрыта")

    cur.execute(
        f"INSERT INTO {tbl('ch_applications')} (tournament_id, salon_id, user_id, status, notify_email) "
        f"VALUES (%s, %s, %s, 'approved', %s) ON CONFLICT (tournament_id, salon_id) DO NOTHING RETURNING id",
        (tournament_id, salon_id, user["id"], body.get("notify_email", user.get("email", "")))
    )
    row = cur.fetchone()
    conn.commit()
    if not row:
        return ok({"ok": True, "already_applied": True})
    return ok({"ok": True, "application_id": row["id"]})


# ── Отзыв заявки ──────────────────────────────────────────────────────────────

def handle_withdraw(event):
    conn = get_db()
    user = get_session_user(event, conn)
    if not user:
        return err("Требуется авторизация", 401)

    salon_id = user.get("salon_id")
    body = json.loads(event.get("body") or "{}")
    tournament_id = body.get("tournament_id")

    cur = conn.cursor()
    cur.execute(
        f"UPDATE {tbl('ch_applications')} SET status = 'withdrawn' "
        f"WHERE tournament_id = %s AND salon_id = %s AND status IN ('pending','approved')",
        (tournament_id, salon_id)
    )
    conn.commit()
    return ok({"ok": True})


# ── Отправка работы ───────────────────────────────────────────────────────────

def handle_submit_work(event):
    conn = get_db()
    user = get_session_user(event, conn)
    if not user:
        return err("Требуется авторизация", 401)

    salon_id = user.get("salon_id")
    if not salon_id:
        return err("Нет привязанного салона", 400)

    body = json.loads(event.get("body") or "{}")
    tournament_id = body.get("tournament_id")
    if not tournament_id:
        return err("tournament_id обязателен")

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    # Проверяем заявку
    cur.execute(
        f"SELECT id FROM {tbl('ch_applications')} WHERE tournament_id=%s AND salon_id=%s AND status IN ('approved','pending')",
        (tournament_id, salon_id)
    )
    app = cur.fetchone()
    if not app:
        return err("Нет одобренной заявки на этот турнир")

    # Проверяем статус турнира — принимаем работы с момента регистрации до конца активной фазы
    cur.execute(f"SELECT status, work_deadline FROM {tbl('ch_tournaments')} WHERE id=%s", (tournament_id,))
    t = cur.fetchone()
    if not t or t["status"] not in ("registration", "active"):
        return err("Приём работ закрыт")

    photos = body.get("photos", [])

    cur.execute(
        f"""INSERT INTO {tbl('ch_works')}
               (tournament_id, salon_id, application_id, title, description, story,
                services_done, master_name, tools_used, photos, video_url, status)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,'submitted')
            ON CONFLICT (tournament_id, salon_id) DO UPDATE SET
               title=EXCLUDED.title, description=EXCLUDED.description,
               story=EXCLUDED.story, services_done=EXCLUDED.services_done,
               master_name=EXCLUDED.master_name, tools_used=EXCLUDED.tools_used,
               photos=EXCLUDED.photos, video_url=EXCLUDED.video_url,
               status='submitted', updated_at=NOW()
            RETURNING id""",
        (tournament_id, salon_id, app["id"],
         body.get("title", ""), body.get("description", ""), body.get("story", ""),
         body.get("services_done", ""), body.get("master_name", ""),
         body.get("tools_used", ""), json.dumps(photos, ensure_ascii=False),
         body.get("video_url", ""))
    )
    work_id = cur.fetchone()["id"]
    conn.commit()
    return ok({"ok": True, "work_id": work_id})