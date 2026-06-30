"""
Cron-задача: ежедневное списание энергии за хранение каждого лендинга на нашем сервере.
Запускается в 00:00 по московскому времени (UTC+3 = 21:00 UTC).
Списывает 2 ⚡ с баланса салона за каждый лендинг пользователя (плата за сервер/хостинг).
"""
import json
import os
import psycopg2
import psycopg2.extras

SCHEMA = "t_p84565078_code_expression_proj"
COST_PER_LANDING = 2

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def handler(event: dict, context) -> dict:
    """Ежедневное списание 1 энергии за каждый лендинг пользователя (cron 00:00 МСК)"""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    conn = get_conn()
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        # Получаем всех пользователей у кого есть лендинги, сгруппированные по салону
        cur.execute(f"""
            SELECT
                u.id AS user_id,
                u.salon_id,
                COUNT(lp.id) AS landing_count,
                COUNT(lp.id) * {COST_PER_LANDING} AS total_cost
            FROM {SCHEMA}.lk_users u
            JOIN {SCHEMA}.landing_projects lp ON lp.user_id = u.id
            WHERE u.is_active = TRUE AND u.salon_id IS NOT NULL
            GROUP BY u.id, u.salon_id
        """)
        rows = cur.fetchall()

        charged = 0
        skipped = 0

        for row in rows:
            user_id = row["user_id"]
            salon_id = row["salon_id"]
            landing_count = row["landing_count"]
            total_cost = row["total_cost"]

            # Проверяем баланс
            cur.execute(
                f"SELECT credits_balance FROM {SCHEMA}.salons WHERE id = %s",
                (salon_id,)
            )
            salon = cur.fetchone()
            if not salon:
                skipped += 1
                continue

            balance = salon["credits_balance"]
            actual_cost = min(total_cost, balance)  # списываем не больше чем есть

            if actual_cost <= 0:
                skipped += 1
                continue

            # Списываем энергию
            cur.execute(
                f"UPDATE {SCHEMA}.salons SET credits_balance = credits_balance - %s WHERE id = %s",
                (actual_cost, salon_id)
            )
            cur.execute(
                f"INSERT INTO {SCHEMA}.credit_transactions "
                f"(salon_id, user_id, action, amount, tool_key, type) "
                f"VALUES (%s, %s, %s, %s, %s, 'debit')",
                (
                    salon_id,
                    user_id,
                    f"Хостинг лендингов ({landing_count} шт.)",
                    actual_cost,
                    "landing_daily"
                )
            )
            charged += 1

        conn.commit()

        result = {
            "ok": True,
            "charged_salons": charged,
            "skipped_salons": skipped,
            "total_processed": len(rows)
        }
        print(f"[landing-daily-charge] {result}")

        return {
            "statusCode": 200,
            "headers": CORS,
            "body": json.dumps(result, ensure_ascii=False)
        }

    finally:
        conn.close()