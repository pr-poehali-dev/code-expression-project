"""
Административный API чемпионата.
Все роуты требуют X-Session-Id администратора.
GET  ?action=tournaments        — список всех турниров
GET  ?action=tournament         — один турнир (id)
POST ?action=create_season      — создать сезон
POST ?action=update_season      — обновить сезон
POST ?action=create_tournament  — создать турнир
POST ?action=update_tournament  — обновить турнир (статус, даты, задание)
POST ?action=archive_tournament — архивировать
GET  ?action=works              — работы турнира (все, включая на модерации)
POST ?action=moderate_work      — одобрить/отклонить работу
POST ?action=finalize           — подвести итоги: расставить места, начислить энергию и достижения
GET  ?action=votes_overview     — сводка голосов по работе (антинакрутка)
POST ?action=block_votes        — заблокировать подозрительные голоса
GET  ?action=partners           — список партнёров
POST ?action=create_partner     — создать партнёра
POST ?action=update_partner     — обновить
POST ?action=create_prize       — добавить приз к турниру
POST ?action=delete_prize       — удалить приз
GET  ?action=settings           — настройки чемпионата
POST ?action=settings_update    — обновить настройку
GET  ?action=achievement_types  — типы достижений
POST ?action=award_achievement  — вручить достижение вручную
GET  ?action=applications       — заявки турнира
POST ?action=approve_application — одобрить заявку
POST ?action=reject_application  — отклонить заявку
GET  ?action=experts            — список экспертов
POST ?action=add_expert         — добавить эксперта
POST ?action=remove_expert      — удалить эксперта
"""
import json
import os
import psycopg2
import psycopg2.extras
import urllib.request

S = "t_p84565078_code_expression_proj"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}
LK_API_URL = os.environ.get("LK_API_URL", "")


def tbl(name): return f"{S}.{name}"
def get_db(): return psycopg2.connect(os.environ["DATABASE_URL"])
def ok(data, status=200): return {"statusCode": status, "headers": CORS, "body": json.dumps(data, ensure_ascii=False, default=str)}
def err(msg, status=400): return {"statusCode": status, "headers": CORS, "body": json.dumps({"error": msg}, ensure_ascii=False)}


def require_admin(event, conn):
    sid = (event.get("headers") or {}).get("X-Session-Id", "")
    if not sid:
        return None
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT u.* FROM {tbl('lk_sessions')} s JOIN {tbl('lk_users')} u ON u.id = s.user_id "
        f"WHERE s.id = %s AND s.expires_at > NOW() AND u.is_active = TRUE AND u.is_admin = TRUE",
        (sid,)
    )
    return cur.fetchone()


def handler(event: dict, context) -> dict:
    """Административный API чемпионата красоты."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    conn = get_db()
    admin = require_admin(event, conn)
    if not admin:
        return err("Доступ запрещён", 403)

    method = event.get("httpMethod", "GET")
    qs = event.get("queryStringParameters") or {}
    action = qs.get("action", "")

    routes = {
        ("GET",  "tournaments"):        handle_list_tournaments,
        ("GET",  "tournament"):         handle_get_tournament,
        ("POST", "create_season"):      handle_create_season,
        ("POST", "update_season"):      handle_update_season,
        ("POST", "create_tournament"):  handle_create_tournament,
        ("POST", "update_tournament"):  handle_update_tournament,
        ("POST", "archive_tournament"): handle_archive_tournament,
        ("GET",  "works"):              handle_list_works,
        ("POST", "moderate_work"):      handle_moderate_work,
        ("POST", "finalize"):           handle_finalize,
        ("GET",  "votes_overview"):     handle_votes_overview,
        ("POST", "block_votes"):        handle_block_votes,
        ("GET",  "partners"):           handle_list_partners,
        ("POST", "create_partner"):     handle_create_partner,
        ("POST", "update_partner"):     handle_update_partner,
        ("POST", "create_prize"):       handle_create_prize,
        ("POST", "delete_prize"):       handle_delete_prize,
        ("GET",  "settings"):           handle_get_settings,
        ("POST", "settings_update"):    handle_update_setting,
        ("GET",  "achievement_types"):  handle_achievement_types,
        ("POST", "award_achievement"):  handle_award_achievement,
        ("GET",  "applications"):       handle_list_applications,
        ("POST", "approve_application"): handle_approve_application,
        ("POST", "reject_application"): handle_reject_application,
        ("GET",  "experts"):            handle_list_experts,
        ("POST", "add_expert"):         handle_add_expert,
        ("POST", "remove_expert"):      handle_remove_expert,
    }
    fn = routes.get((method, action))
    if fn:
        return fn(event, conn)
    return err("Not found", 404)


# ── Сезоны ────────────────────────────────────────────────────────────────────

def handle_create_season(event, conn):
    b = json.loads(event.get("body") or "{}")
    cur = conn.cursor()
    cur.execute(
        f"INSERT INTO {tbl('ch_seasons')} (name, slug, year, season, starts_at, ends_at, is_active) "
        f"VALUES (%s,%s,%s,%s,%s,%s,%s) RETURNING id",
        (b["name"], b["slug"], b["year"], b["season"],
         b.get("starts_at"), b.get("ends_at"), b.get("is_active", False))
    )
    new_id = cur.fetchone()[0]
    conn.commit()
    return ok({"ok": True, "id": new_id})


def handle_update_season(event, conn):
    b = json.loads(event.get("body") or "{}")
    cur = conn.cursor()
    cur.execute(
        f"UPDATE {tbl('ch_seasons')} SET name=%s, slug=%s, year=%s, season=%s, "
        f"starts_at=%s, ends_at=%s, is_active=%s, is_finished=%s WHERE id=%s",
        (b["name"], b["slug"], b["year"], b["season"],
         b.get("starts_at"), b.get("ends_at"),
         b.get("is_active", False), b.get("is_finished", False), b["id"])
    )
    conn.commit()
    return ok({"ok": True})


# ── Турниры ───────────────────────────────────────────────────────────────────

def handle_list_tournaments(event, conn):
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"""SELECT t.*, s.name as season_name,
               COUNT(DISTINCT a.id) as applications_count,
               COUNT(DISTINCT w.id) as works_count
            FROM {tbl('ch_tournaments')} t
            LEFT JOIN {tbl('ch_seasons')} s ON s.id = t.season_id
            LEFT JOIN {tbl('ch_applications')} a ON a.tournament_id = t.id
            LEFT JOIN {tbl('ch_works')} w ON w.tournament_id = t.id
            GROUP BY t.id, s.name
            ORDER BY t.created_at DESC"""
    )
    return ok({"tournaments": [dict(r) for r in cur.fetchall()]})


def handle_get_tournament(event, conn):
    qs = event.get("queryStringParameters") or {}
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT * FROM {tbl('ch_tournaments')} WHERE id = %s", (qs.get("id"),))
    t = cur.fetchone()
    if not t:
        return err("Не найден", 404)
    d = dict(t)
    cur.execute(
        f"""SELECT p.*, pt.name as partner_name FROM {tbl('ch_prizes')} p
            LEFT JOIN {tbl('ch_partners')} pt ON pt.id = p.partner_id
            WHERE p.tournament_id = %s ORDER BY p.place""",
        (d["id"],)
    )
    d["prizes"] = [dict(r) for r in cur.fetchall()]
    return ok({"tournament": d})


def handle_create_tournament(event, conn):
    b = json.loads(event.get("body") or "{}")
    cur = conn.cursor()
    cur.execute(
        f"""INSERT INTO {tbl('ch_tournaments')}
               (season_id, name, slug, category, emoji, description, rules, task_text,
                prize_energy, prize_2nd, prize_3rd, min_participants, status,
                registration_starts, registration_ends, task_opens_at,
                work_deadline, voting_starts, voting_ends, next_date)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
            RETURNING id""",
        (b.get("season_id"), b["name"], b["slug"], b.get("category","general"),
         b.get("emoji","🏆"), b.get("description",""), b.get("rules",""), b.get("task_text",""),
         b.get("prize_energy",0), b.get("prize_2nd",0), b.get("prize_3rd",0),
         b.get("min_participants",5), b.get("status","draft"),
         b.get("registration_starts"), b.get("registration_ends"),
         b.get("task_opens_at"), b.get("work_deadline"),
         b.get("voting_starts"), b.get("voting_ends"), b.get("next_date"))
    )
    new_id = cur.fetchone()[0]
    conn.commit()
    return ok({"ok": True, "id": new_id})


def handle_update_tournament(event, conn):
    b = json.loads(event.get("body") or "{}")
    tid = b.get("id")
    cur = conn.cursor()
    cur.execute(
        f"""UPDATE {tbl('ch_tournaments')} SET
               name=%s, slug=%s, category=%s, emoji=%s, description=%s, rules=%s,
               task_text=%s, prize_energy=%s, prize_2nd=%s, prize_3rd=%s,
               min_participants=%s, status=%s, registration_starts=%s, registration_ends=%s,
               task_opens_at=%s, work_deadline=%s, voting_starts=%s, voting_ends=%s,
               next_date=%s, postponed=%s, postpone_reason=%s, updated_at=NOW()
            WHERE id=%s""",
        (b.get("name"), b.get("slug"), b.get("category","general"), b.get("emoji","🏆"),
         b.get("description",""), b.get("rules",""), b.get("task_text",""),
         b.get("prize_energy",0), b.get("prize_2nd",0), b.get("prize_3rd",0),
         b.get("min_participants",5), b.get("status","draft"),
         b.get("registration_starts"), b.get("registration_ends"),
         b.get("task_opens_at"), b.get("work_deadline"),
         b.get("voting_starts"), b.get("voting_ends"), b.get("next_date"),
         b.get("postponed",False), b.get("postpone_reason",""), tid)
    )
    conn.commit()
    return ok({"ok": True})


def handle_archive_tournament(event, conn):
    b = json.loads(event.get("body") or "{}")
    cur = conn.cursor()
    cur.execute(
        f"UPDATE {tbl('ch_tournaments')} SET status='cancelled', updated_at=NOW() WHERE id=%s",
        (b["id"],)
    )
    conn.commit()
    return ok({"ok": True})


# ── Работы (модерация) ────────────────────────────────────────────────────────

def handle_list_works(event, conn):
    qs = event.get("queryStringParameters") or {}
    tid = qs.get("tournament_id")
    if not tid:
        return err("tournament_id обязателен")
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"""SELECT w.*, sl.name as salon_name, sl.city, sl.logo_url
            FROM {tbl('ch_works')} w
            JOIN {tbl('salons')} sl ON sl.id = w.salon_id
            WHERE w.tournament_id = %s
            ORDER BY w.created_at DESC""",
        (tid,)
    )
    return ok({"works": [dict(r) for r in cur.fetchall()]})


def handle_moderate_work(event, conn):
    b = json.loads(event.get("body") or "{}")
    work_id = b.get("work_id")
    action = b.get("action")   # "approve" | "reject" | "request_changes"
    note = b.get("note", "")

    if action not in ("approve", "reject", "request_changes"):
        return err("action должен быть approve|reject|request_changes")

    status_map = {"approve": "approved", "reject": "rejected", "request_changes": "submitted"}
    new_status = status_map[action]
    is_public = action == "approve"

    cur = conn.cursor()
    cur.execute(
        f"UPDATE {tbl('ch_works')} SET status=%s, is_public=%s, moderation_note=%s, updated_at=NOW() WHERE id=%s",
        (new_status, is_public, note, work_id)
    )
    conn.commit()
    return ok({"ok": True})


# ── Подведение итогов ─────────────────────────────────────────────────────────

def _get_setting(conn, key, default):
    cur = conn.cursor()
    cur.execute(f"SELECT value FROM {tbl('ch_settings')} WHERE key = %s", (key,))
    r = cur.fetchone()
    return int(r[0]) if r else default


def _award(conn, salon_id, achievement_code, tournament_id=None):
    cur = conn.cursor()
    cur.execute(f"SELECT id FROM {tbl('ch_achievement_types')} WHERE code = %s", (achievement_code,))
    row = cur.fetchone()
    if not row:
        return
    ach_id = row[0]
    cur.execute(
        f"INSERT INTO {tbl('ch_salon_achievements')} (salon_id, achievement_id, tournament_id) "
        f"VALUES (%s,%s,%s) ON CONFLICT DO NOTHING",
        (salon_id, ach_id, tournament_id)
    )
    # Начисляем очки рейтинга
    cur.execute(f"SELECT points FROM {tbl('ch_achievement_types')} WHERE id=%s", (ach_id,))
    pts = cur.fetchone()
    if pts and pts[0]:
        cur.execute(
            f"INSERT INTO {tbl('ch_ratings')} (salon_id, total_points, season_points) VALUES (%s,%s,%s) "
            f"ON CONFLICT (salon_id) DO UPDATE SET "
            f"total_points = {tbl('ch_ratings')}.total_points + EXCLUDED.total_points, "
            f"season_points = {tbl('ch_ratings')}.season_points + EXCLUDED.season_points, "
            f"updated_at = NOW()",
            (salon_id, pts[0], pts[0])
        )


def _charge_energy(user_id, amount, description):
    """Начисляет энергию через lk-api."""
    if not LK_API_URL or amount <= 0:
        return
    try:
        payload = json.dumps({
            "user_id": user_id, "amount": amount,
            "type": "credit", "description": description
        }).encode()
        req = urllib.request.Request(
            f"{LK_API_URL}?action=energy_topup",
            data=payload, headers={"Content-Type": "application/json"}, method="POST"
        )
        urllib.request.urlopen(req, timeout=5)
    except Exception as e:
        print(f"[championship-admin] energy charge error: {e}")


def handle_finalize(event, conn):
    """Подводит итоги турнира: расставляет места, начисляет энергию и достижения."""
    b = json.loads(event.get("body") or "{}")
    tid = b.get("tournament_id")
    placements = b.get("placements", [])  # [{work_id, place}]

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    # Проверяем турнир
    cur.execute(f"SELECT * FROM {tbl('ch_tournaments')} WHERE id=%s", (tid,))
    tournament = cur.fetchone()
    if not tournament:
        return err("Турнир не найден", 404)

    pts_participation = _get_setting(conn, "points_participation", 20)
    pts_top10 = _get_setting(conn, "points_top10", 80)
    pts_top3 = _get_setting(conn, "points_top3", 150)
    pts_winner = _get_setting(conn, "points_winner", 300)

    awarded_salons = []

    for p in placements:
        work_id = p["work_id"]
        place = p["place"]

        # Обновляем место в работе
        cur2 = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur2.execute(
            f"UPDATE {tbl('ch_works')} SET final_place=%s, updated_at=NOW() WHERE id=%s RETURNING salon_id",
            (place, work_id)
        )
        row = cur2.fetchone()
        if not row:
            continue
        salon_id = row["salon_id"]
        awarded_salons.append(salon_id)

        # Очки рейтинга за место
        rp = pts_winner if place == 1 else pts_top3 if place <= 3 else pts_top10 if place <= 10 else 0
        if rp:
            cur2.execute(
                f"INSERT INTO {tbl('ch_ratings')} (salon_id, total_points, season_points, wins, top3_count, top10_count, participations) "
                f"VALUES (%s,%s,%s,%s,%s,%s,0) ON CONFLICT (salon_id) DO UPDATE SET "
                f"total_points = {tbl('ch_ratings')}.total_points + EXCLUDED.total_points, "
                f"season_points = {tbl('ch_ratings')}.season_points + EXCLUDED.season_points, "
                f"wins = {tbl('ch_ratings')}.wins + CASE WHEN %s=1 THEN 1 ELSE 0 END, "
                f"top3_count = {tbl('ch_ratings')}.top3_count + CASE WHEN %s<=3 THEN 1 ELSE 0 END, "
                f"top10_count = {tbl('ch_ratings')}.top10_count + CASE WHEN %s<=10 THEN 1 ELSE 0 END, "
                f"updated_at=NOW()",
                (salon_id, rp, rp,
                 1 if place == 1 else 0,
                 1 if place <= 3 else 0,
                 1 if place <= 10 else 0,
                 place, place, place)
            )

        # Достижения
        if place == 1:
            _award(conn, salon_id, "winner", tid)
            energy = tournament["prize_energy"]
        elif place == 2:
            _award(conn, salon_id, "top3", tid)
            energy = tournament["prize_2nd"]
        elif place == 3:
            _award(conn, salon_id, "top3", tid)
            energy = tournament["prize_3rd"]
        else:
            energy = 0

        if place <= 10:
            _award(conn, salon_id, "top10", tid)

        # Начисляем энергию победителям
        if energy > 0:
            cur2.execute(f"SELECT user_id FROM {tbl('lk_users')} WHERE salon_id=%s AND is_active=TRUE LIMIT 1", (salon_id,))
            u = cur2.fetchone()
            if u:
                _charge_energy(u["user_id"], energy, f"Приз за {place} место в турнире «{tournament['name']}»")

    # Всем участникам — очки за участие и достижение
    cur.execute(
        f"SELECT DISTINCT salon_id FROM {tbl('ch_applications')} WHERE tournament_id=%s AND status='approved'",
        (tid,)
    )
    for row in cur.fetchall():
        sid = row["salon_id"]
        _award(conn, sid, "first_participation", tid)
        cur.execute(
            f"INSERT INTO {tbl('ch_ratings')} (salon_id, total_points, season_points, participations) "
            f"VALUES (%s,%s,%s,1) ON CONFLICT (salon_id) DO UPDATE SET "
            f"total_points = {tbl('ch_ratings')}.total_points + {pts_participation}, "
            f"season_points = {tbl('ch_ratings')}.season_points + {pts_participation}, "
            f"participations = {tbl('ch_ratings')}.participations + 1, updated_at=NOW()",
            (sid, pts_participation, pts_participation)
        )

    # Обновляем уровни салонов
    _update_levels(conn)

    # Турнир → finished
    cur.execute(
        f"UPDATE {tbl('ch_tournaments')} SET status='finished', updated_at=NOW() WHERE id=%s",
        (tid,)
    )
    conn.commit()
    return ok({"ok": True, "awarded_salons": len(awarded_salons)})


def _update_levels(conn):
    """Обновляет уровень салона по накопленным очкам."""
    levels = [
        (0,    "newcomer"),
        (100,  "participant"),
        (500,  "professional"),
        (1200, "expert"),
        (3000, "premium"),
        (6000, "legend"),
    ]
    cur = conn.cursor()
    cur.execute(f"SELECT salon_id, total_points FROM {tbl('ch_ratings')}")
    for row in cur.fetchall():
        salon_id, pts = row
        level = "newcomer"
        for threshold, lv in levels:
            if pts >= threshold:
                level = lv
        cur.execute(f"UPDATE {tbl('ch_ratings')} SET level=%s WHERE salon_id=%s", (level, salon_id))


# ── Голоса (антинакрутка) ─────────────────────────────────────────────────────

def handle_votes_overview(event, conn):
    qs = event.get("queryStringParameters") or {}
    work_id = qs.get("work_id")
    if not work_id:
        return err("work_id обязателен")

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT voter_ip, COUNT(*) as cnt, MIN(created_at) as first, MAX(created_at) as last "
        f"FROM {tbl('ch_votes')} WHERE work_id=%s GROUP BY voter_ip ORDER BY cnt DESC LIMIT 100",
        (work_id,)
    )
    by_ip = [dict(r) for r in cur.fetchall()]

    cur.execute(
        f"SELECT * FROM {tbl('ch_vote_log')} WHERE work_id=%s ORDER BY created_at DESC LIMIT 50",
        (work_id,)
    )
    log = [dict(r) for r in cur.fetchall()]

    cur.execute(f"SELECT COUNT(*) as cnt FROM {tbl('ch_votes')} WHERE work_id=%s", (work_id,))
    total = cur.fetchone()["cnt"]

    return ok({"total_votes": total, "by_ip": by_ip, "suspicious_log": log})


def handle_block_votes(event, conn):
    b = json.loads(event.get("body") or "{}")
    work_id = b.get("work_id")
    voter_ip = b.get("voter_ip")
    cur = conn.cursor()
    if voter_ip:
        cur.execute(f"DELETE FROM {tbl('ch_votes')} WHERE work_id=%s AND voter_ip=%s", (work_id, voter_ip))
    else:
        cur.execute(f"DELETE FROM {tbl('ch_votes')} WHERE work_id=%s", (work_id,))
    deleted = cur.rowcount
    # Пересчитываем счётчик
    cur.execute(f"SELECT COUNT(*) FROM {tbl('ch_votes')} WHERE work_id=%s", (work_id,))
    new_count = cur.fetchone()[0]
    cur.execute(f"UPDATE {tbl('ch_works')} SET votes_count=%s WHERE id=%s", (new_count, work_id))
    conn.commit()
    return ok({"ok": True, "deleted": deleted, "new_count": new_count})


# ── Партнёры ──────────────────────────────────────────────────────────────────

def handle_list_partners(event, conn):
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT * FROM {tbl('ch_partners')} WHERE is_active=TRUE ORDER BY name")
    return ok({"partners": [dict(r) for r in cur.fetchall()]})


def handle_create_partner(event, conn):
    b = json.loads(event.get("body") or "{}")
    cur = conn.cursor()
    cur.execute(
        f"INSERT INTO {tbl('ch_partners')} (name, logo_url, website, description) VALUES (%s,%s,%s,%s) RETURNING id",
        (b["name"], b.get("logo_url",""), b.get("website",""), b.get("description",""))
    )
    new_id = cur.fetchone()[0]
    conn.commit()
    return ok({"ok": True, "id": new_id})


def handle_update_partner(event, conn):
    b = json.loads(event.get("body") or "{}")
    cur = conn.cursor()
    cur.execute(
        f"UPDATE {tbl('ch_partners')} SET name=%s, logo_url=%s, website=%s, description=%s WHERE id=%s",
        (b["name"], b.get("logo_url",""), b.get("website",""), b.get("description",""), b["id"])
    )
    conn.commit()
    return ok({"ok": True})


# ── Призы ────────────────────────────────────────────────────────────────────

def handle_create_prize(event, conn):
    b = json.loads(event.get("body") or "{}")
    cur = conn.cursor()
    cur.execute(
        f"INSERT INTO {tbl('ch_prizes')} (tournament_id, partner_id, place, title, description, photo_url, value) "
        f"VALUES (%s,%s,%s,%s,%s,%s,%s) RETURNING id",
        (b["tournament_id"], b.get("partner_id"), b.get("place",1),
         b["title"], b.get("description",""), b.get("photo_url",""), b.get("value",""))
    )
    new_id = cur.fetchone()[0]
    conn.commit()
    return ok({"ok": True, "id": new_id})


def handle_delete_prize(event, conn):
    b = json.loads(event.get("body") or "{}")
    cur = conn.cursor()
    cur.execute(f"DELETE FROM {tbl('ch_prizes')} WHERE id=%s", (b["id"],))
    conn.commit()
    return ok({"ok": True})


# ── Настройки ─────────────────────────────────────────────────────────────────

def handle_get_settings(event, conn):
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT * FROM {tbl('ch_settings')} ORDER BY key")
    return ok({"settings": {r["key"]: r["value"] for r in cur.fetchall()}})


def handle_update_setting(event, conn):
    b = json.loads(event.get("body") or "{}")
    cur = conn.cursor()
    cur.execute(
        f"INSERT INTO {tbl('ch_settings')} (key, value, updated_at) VALUES (%s,%s,NOW()) "
        f"ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value, updated_at=NOW()",
        (b["key"], str(b["value"]))
    )
    conn.commit()
    return ok({"ok": True})


# ── Достижения (ручное вручение) ──────────────────────────────────────────────

def handle_achievement_types(event, conn):
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT * FROM {tbl('ch_achievement_types')} ORDER BY points DESC")
    return ok({"types": [dict(r) for r in cur.fetchall()]})


def handle_award_achievement(event, conn):
    b = json.loads(event.get("body") or "{}")
    _award(conn, b["salon_id"], b["achievement_code"], b.get("tournament_id"))
    conn.commit()
    return ok({"ok": True})


# ── Заявки ───────────────────────────────────────────────────────────────────

def handle_list_applications(event, conn):
    qs = event.get("queryStringParameters") or {}
    tid = qs.get("tournament_id")
    if not tid:
        return err("tournament_id обязателен")
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"""SELECT a.*, sl.name as salon_name, sl.city, sl.logo_url
            FROM {tbl('ch_applications')} a
            JOIN {tbl('salons')} sl ON sl.id = a.salon_id
            WHERE a.tournament_id=%s ORDER BY a.created_at DESC""",
        (tid,)
    )
    return ok({"applications": [dict(r) for r in cur.fetchall()]})


def handle_approve_application(event, conn):
    b = json.loads(event.get("body") or "{}")
    cur = conn.cursor()
    cur.execute(
        f"UPDATE {tbl('ch_applications')} SET status='approved' WHERE id=%s",
        (b["application_id"],)
    )
    conn.commit()
    return ok({"ok": True})


def handle_reject_application(event, conn):
    b = json.loads(event.get("body") or "{}")
    cur = conn.cursor()
    cur.execute(
        f"UPDATE {tbl('ch_applications')} SET status='rejected' WHERE id=%s",
        (b["application_id"],)
    )
    conn.commit()
    return ok({"ok": True})


# ── Эксперты ─────────────────────────────────────────────────────────────────

def handle_list_experts(event, conn):
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"""SELECT e.*, u.full_name, u.email
            FROM {tbl('ch_experts')} e
            JOIN {tbl('lk_users')} u ON u.id = e.user_id
            WHERE e.is_active=TRUE ORDER BY u.full_name"""
    )
    return ok({"experts": [dict(r) for r in cur.fetchall()]})


def handle_add_expert(event, conn):
    b = json.loads(event.get("body") or "{}")
    cur = conn.cursor()
    cur.execute(
        f"INSERT INTO {tbl('ch_experts')} (user_id, bio) VALUES (%s,%s) "
        f"ON CONFLICT (user_id) DO UPDATE SET is_active=TRUE, bio=EXCLUDED.bio RETURNING id",
        (b["user_id"], b.get("bio",""))
    )
    new_id = cur.fetchone()[0]
    conn.commit()
    return ok({"ok": True, "id": new_id})


def handle_remove_expert(event, conn):
    b = json.loads(event.get("body") or "{}")
    cur = conn.cursor()
    cur.execute(f"UPDATE {tbl('ch_experts')} SET is_active=FALSE WHERE user_id=%s", (b["user_id"],))
    conn.commit()
    return ok({"ok": True})
