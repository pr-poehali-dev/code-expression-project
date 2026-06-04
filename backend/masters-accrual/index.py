"""
Начисление партнёрского вознаграждения мастерам.
Начисляется ТОЛЬКО при реальной покупке энергии через ЮКассу.
Ручное пополнение и бонусы — не считаются.
Формула: 10% от количества энергий = рубли (100 энергий → 10 ₽).
POST / — внутренний вызов при покупке энергии.
GET  / — список начислений мастера по сессии.
"""
import json
import os
import psycopg2
import psycopg2.extras
from datetime import datetime, timedelta, timezone

SCHEMA = "t_p84565078_code_expression_proj"
REFERRAL_PERCENT = 10
DAYS_HOLD = 30

# ТОЛЬКО реальная оплата через ЮКассу даёт начисление
PAID_ACTIONS = {"Покупка пакета энергии"}

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Master-Session, X-Internal-Key",
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
    """Начисление и просмотр партнёрских вознаграждений мастеров."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    headers = event.get("headers") or {}
    session_id = headers.get("X-Master-Session", "")
    internal_key = headers.get("X-Internal-Key", "")

    conn = get_db()
    try:
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