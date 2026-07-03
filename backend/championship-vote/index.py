"""
Голосование за работы чемпионата с антинакруткой.
POST ?action=vote        — проголосовать за работу
GET  ?action=my_votes    — мои голоса в турнире (по IP / сессии)
POST ?action=expert_score — оценка эксперта (требует роль эксперта)
"""
import json
import os
import hashlib
import psycopg2
import psycopg2.extras
from datetime import datetime, timezone, timedelta

S = "t_p84565078_code_expression_proj"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id, X-Voter-Fp",
}


def tbl(name): return f"{S}.{name}"
def get_db(): return psycopg2.connect(os.environ["DATABASE_URL"])
def ok(data, status=200): return {"statusCode": status, "headers": CORS, "body": json.dumps(data, ensure_ascii=False, default=str)}
def err(msg, status=400): return {"statusCode": status, "headers": CORS, "body": json.dumps({"error": msg}, ensure_ascii=False)}


def get_ip(event):
    rc = (event.get("requestContext") or {}).get("identity") or {}
    ip = rc.get("sourceIp", "")
    if not ip:
        ip = (event.get("headers") or {}).get("X-Forwarded-For", "").split(",")[0].strip()
    return ip or "unknown"


def get_session_user(event, conn):
    sid = (event.get("headers") or {}).get("X-Session-Id", "")
    if not sid:
        return None
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT u.* FROM {tbl('lk_sessions')} s JOIN {tbl('lk_users')} u ON u.id = s.user_id "
        f"WHERE s.id = %s AND s.expires_at > NOW() AND u.is_active = TRUE",
        (sid,)
    )
    return cur.fetchone()


def fp_hash(fp: str) -> str:
    return hashlib.sha256(fp.encode()).hexdigest()[:64] if fp else ""


def handler(event: dict, context) -> dict:
    """Голосование за работы чемпионата с защитой от накрутки."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    _qs = event.get("queryStringParameters") or {}
    qs = _qs if isinstance(_qs, dict) else {}
    action = qs.get("action", "")

    routes = {
        ("POST", "vote"):         handle_vote,
        ("GET",  "my_votes"):     handle_my_votes,
        ("POST", "expert_score"): handle_expert_score,
    }
    fn = routes.get((method, action))
    if fn:
        return fn(event)
    return err("Not found", 404)


# ── Голосование ───────────────────────────────────────────────────────────────

def handle_vote(event):
    raw = event.get("body") or {}
    if isinstance(raw, str):
        try:
            body = json.loads(raw)
        except Exception:
            body = {}
    elif isinstance(raw, dict):
        body = raw
    else:
        body = {}
    work_id = body.get("work_id")
    if not work_id:
        return err("work_id обязателен")

    voter_ip = get_ip(event)
    raw_fp = (event.get("headers") or {}).get("X-Voter-Fp", "")
    voter_fp = fp_hash(raw_fp)

    conn = get_db()
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    # Проверяем существование работы и статус турнира
    cur.execute(
        f"""SELECT w.id, w.tournament_id, w.is_public, w.salon_id,
               t.status as t_status, t.voting_ends
            FROM {tbl('ch_works')} w
            JOIN {tbl('ch_tournaments')} t ON t.id = w.tournament_id
            WHERE w.id = %s""",
        (work_id,)
    )
    work = cur.fetchone()
    if not work:
        return err("Работа не найдена", 404)
    if not work["is_public"]:
        return err("Работа ещё не опубликована")
    if work["t_status"] != "voting":
        return err("Голосование не активно")

    # Авторизованный пользователь
    user = get_session_user(event, conn)
    user_id = user["id"] if user else None
    is_admin = bool(user and user.get("is_admin"))
    ADMIN_VOTE_WEIGHT = 158

    # ── Антинакрутка (для админа не применяется — у него особые права) ─────────

    if not is_admin:
        # 1. Авторизованный: строгий UNIQUE (1 голос на работу)
        if user_id:
            cur.execute(
                f"SELECT id FROM {tbl('ch_votes')} WHERE work_id=%s AND user_id=%s",
                (work_id, user_id)
            )
            if cur.fetchone():
                return err("Вы уже голосовали за эту работу")

            # Нельзя голосовать за свою работу
            if work["salon_id"] == user.get("salon_id"):
                return err("Нельзя голосовать за собственную работу")

        # 2. По IP — не более 5 голосов в сутки по всему турниру
        window_start = datetime.now(timezone.utc) - timedelta(hours=24)
        cur.execute(
            f"""SELECT COUNT(*) as cnt FROM {tbl('ch_votes')} v
                JOIN {tbl('ch_works')} w ON w.id = v.work_id
                WHERE v.voter_ip=%s AND w.tournament_id=%s AND v.created_at > %s""",
            (voter_ip, work["tournament_id"], window_start)
        )
        ip_count = cur.fetchone()["cnt"]
        if ip_count >= 5:
            # Логируем подозрительную активность
            cur.execute(
                f"INSERT INTO {tbl('ch_vote_log')} (work_id, voter_ip, voter_fp, reason, blocked) "
                f"VALUES (%s,%s,%s,'ip_day_limit',TRUE)",
                (work_id, voter_ip, voter_fp)
            )
            conn.commit()
            return err("Превышен дневной лимит голосов с вашего IP")

        # 3. По fingerprint — не более 3 голосов за одну работу
        if voter_fp:
            cur.execute(
                f"SELECT COUNT(*) as cnt FROM {tbl('ch_votes')} WHERE work_id=%s AND voter_fp=%s",
                (work_id, voter_fp)
            )
            fp_count = cur.fetchone()["cnt"]
            if fp_count >= 3:
                cur.execute(
                    f"INSERT INTO {tbl('ch_vote_log')} (work_id, voter_ip, voter_fp, reason, blocked) "
                    f"VALUES (%s,%s,%s,'fp_work_limit',TRUE)",
                    (work_id, voter_ip, voter_fp)
                )
                conn.commit()
                return err("Вы уже голосовали за эту работу")

        # 4. Слишком быстро — менее 3 секунд с последнего голоса с этого IP
        cur.execute(
            f"SELECT created_at FROM {tbl('ch_votes')} WHERE voter_ip=%s ORDER BY created_at DESC LIMIT 1",
            (voter_ip,)
        )
        last = cur.fetchone()
        if last and last["created_at"]:
            delta = (datetime.now(timezone.utc) - last["created_at"].replace(tzinfo=timezone.utc)).total_seconds()
            if delta < 3:
                cur.execute(
                    f"INSERT INTO {tbl('ch_vote_log')} (work_id, voter_ip, voter_fp, reason, blocked) "
                    f"VALUES (%s,%s,%s,'too_fast',TRUE)",
                    (work_id, voter_ip, voter_fp)
                )
                conn.commit()
                return err("Слишком быстро. Подождите несколько секунд.")

    # ── Записываем голос ──────────────────────────────────────────────────────
    vote_weight = ADMIN_VOTE_WEIGHT if is_admin else 1
    cur.execute(
        f"INSERT INTO {tbl('ch_votes')} (work_id, voter_ip, voter_fp, user_id, score) "
        f"VALUES (%s,%s,%s,%s,%s)",
        (work_id, voter_ip, voter_fp, user_id, vote_weight)
    )

    # Обновляем счётчик голосов в работе
    cur.execute(
        f"UPDATE {tbl('ch_works')} SET votes_count = votes_count + %s WHERE id=%s RETURNING votes_count",
        (vote_weight, work_id)
    )
    new_count = cur.fetchone()["votes_count"]

    # Пересчитываем total_score (40% голоса пользователей)
    _recalc_score(conn, work_id, new_count)

    conn.commit()
    return ok({"ok": True, "votes_count": new_count})


def _recalc_score(conn, work_id, votes_count):
    """Пересчитывает итоговый балл: 40% голоса + 30% эксперты + (остальное — активность)."""
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    # Средняя оценка экспертов
    cur.execute(
        f"SELECT COALESCE(AVG(score),0) as avg_score FROM {tbl('ch_expert_scores')} WHERE work_id=%s",
        (work_id,)
    )
    expert_avg = float(cur.fetchone()["avg_score"])

    # Нормализуем голоса (max 1000 голосов = 100 баллов)
    normalized_votes = min(votes_count / 10.0, 100.0)

    # expert_avg уже 1-10, нормализуем к 100
    normalized_expert = expert_avg * 10.0

    total = normalized_votes * 0.40 + normalized_expert * 0.30
    cur.execute(f"UPDATE {tbl('ch_works')} SET total_score=%s WHERE id=%s", (round(total, 2), work_id))


# ── Мои голоса ───────────────────────────────────────────────────────────────

def handle_my_votes(event):
    qs = event.get("queryStringParameters") or {}
    tournament_id = qs.get("tournament_id")

    raw_fp = (event.get("headers") or {}).get("X-Voter-Fp", "")
    voter_fp = fp_hash(raw_fp)
    conn = get_db()
    user = get_session_user(event, conn)
    user_id = user["id"] if user else None

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

    if user_id and tournament_id:
        # Авторизован — считаем голоса привязанными к его аккаунту
        cur.execute(
            f"""SELECT v.work_id FROM {tbl('ch_votes')} v
                JOIN {tbl('ch_works')} w ON w.id = v.work_id
                WHERE v.user_id=%s AND w.tournament_id=%s""",
            (user_id, tournament_id)
        )
    elif tournament_id and voter_fp:
        # Не авторизован — определяем по отпечатку устройства (НЕ по IP,
        # иначе все пользователи одной сети будут видеть чужие голоса как свои)
        cur.execute(
            f"""SELECT v.work_id FROM {tbl('ch_votes')} v
                JOIN {tbl('ch_works')} w ON w.id = v.work_id
                WHERE v.voter_fp=%s AND w.tournament_id=%s AND v.user_id IS NULL""",
            (voter_fp, tournament_id)
        )
    else:
        return ok({"voted_work_ids": []})

    voted = [r["work_id"] for r in cur.fetchall()]
    return ok({"voted_work_ids": voted})


# ── Оценка эксперта ───────────────────────────────────────────────────────────

def handle_expert_score(event):
    conn = get_db()
    user = get_session_user(event, conn)
    if not user:
        return err("Требуется авторизация", 401)

    # Проверяем что пользователь — эксперт
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT id FROM {tbl('ch_experts')} WHERE user_id=%s AND is_active=TRUE",
        (user["id"],)
    )
    if not cur.fetchone() and not user.get("is_admin"):
        return err("Доступ только для экспертов", 403)

    body = json.loads(event.get("body") or "{}")
    work_id = body.get("work_id")
    score = body.get("score")
    comment = body.get("comment", "")

    if not work_id or score is None:
        return err("work_id и score обязательны")
    if not (1 <= int(score) <= 10):
        return err("score должен быть от 1 до 10")

    cur.execute(
        f"INSERT INTO {tbl('ch_expert_scores')} (work_id, expert_id, score, comment) "
        f"VALUES (%s,%s,%s,%s) ON CONFLICT (work_id, expert_id) DO UPDATE SET score=EXCLUDED.score, comment=EXCLUDED.comment",
        (work_id, user["id"], int(score), comment)
    )

    # Пересчёт total_score
    cur.execute(f"SELECT votes_count FROM {tbl('ch_works')} WHERE id=%s", (work_id,))
    w = cur.fetchone()
    if w:
        _recalc_score(conn, work_id, w["votes_count"])

    conn.commit()
    return ok({"ok": True})