"""
Быстрый запуск генерации изображения. Возвращает job_id за ~1 секунду.
Списывает энергию и создаёт задачу. Фронтенд потом опрашивает статус через image-worker.
"""
import json
import os
import psycopg2
import psycopg2.extras

SCHEMA = "t_p84565078_code_expression_proj"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}

ASPECT_MAP = {
    "1024x1024": "1:1",
    "1024x1792": "2:3",
    "1792x1024": "3:2",
}

def get_db(): return psycopg2.connect(os.environ["DATABASE_URL"])
def ok(data): return {"statusCode": 200, "headers": CORS, "body": json.dumps(data, ensure_ascii=False, default=str)}
def err(msg, status=400): return {"statusCode": status, "headers": CORS, "body": json.dumps({"error": msg}, ensure_ascii=False)}


def get_session_user(event, conn):
    sid = (event.get("headers") or {}).get("X-Session-Id", "")
    if not sid: return None
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT u.* FROM {SCHEMA}.lk_sessions s JOIN {SCHEMA}.lk_users u ON u.id=s.user_id "
        f"WHERE s.id=%s AND s.expires_at>NOW() AND u.is_active=TRUE", (sid,)
    )
    return cur.fetchone()


def handler(event: dict, context) -> dict:
    """Запускает задачу генерации изображения, мгновенно возвращает job_id."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)

        salon_id = user.get("salon_id")
        if not salon_id:
            return err("Салон не найден", 400)

        body = json.loads(event.get("body") or "{}")
        prompt = (body.get("prompt") or "").strip()
        if not prompt:
            return err("Укажите промпт")

        aspect_raw = body.get("aspect_ratio", "1024x1024")
        if aspect_raw not in ASPECT_MAP:
            aspect_raw = "1024x1024"
        aspect_gpt15 = ASPECT_MAP[aspect_raw]

        # Проверяем баланс
        cur = conn.cursor()
        cur.execute(
            f"SELECT energy_cost FROM {SCHEMA}.tool_costs WHERE tool_key='image_gen'"
        )
        row = cur.fetchone()
        cost = row[0] if row else 5

        cur.execute(
            f"SELECT COALESCE(SUM(CASE WHEN type='credit' THEN amount ELSE -amount END),0) "
            f"FROM {SCHEMA}.credit_transactions WHERE salon_id=%s", (salon_id,)
        )
        balance = int(cur.fetchone()[0])
        if balance < cost:
            return err(f"Недостаточно энергии. Нужно {cost}, доступно {balance}.", 402)

        # Списываем энергию
        cur.execute(
            f"UPDATE {SCHEMA}.salons SET credits_balance=credits_balance-%s WHERE id=%s",
            (cost, salon_id)
        )
        cur.execute(
            f"INSERT INTO {SCHEMA}.credit_transactions (salon_id,user_id,action,amount,tool_key,type) "
            f"VALUES (%s,%s,'Создание изображения',%s,'image_gen','debit')",
            (salon_id, user["id"], cost)
        )

        # Подготавливаем финальный промпт с контекстом салона
        final_prompt = prompt
        use_salon_context = body.get("use_salon_context", False)
        if use_salon_context:
            cur2 = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            cur2.execute(
                f"SELECT name, description, target_audience, tone_of_voice FROM {SCHEMA}.salons WHERE id=%s",
                (salon_id,)
            )
            salon = cur2.fetchone()
            if salon:
                parts = []
                if salon.get("name"): parts.append(f"Салон: {salon['name']}")
                if salon.get("description"): parts.append(f"О салоне: {salon['description']}")
                if salon.get("target_audience"): parts.append(f"Аудитория: {salon['target_audience']}")
                if salon.get("tone_of_voice"): parts.append(f"Стиль: {salon['tone_of_voice']}")
                if parts:
                    final_prompt = f"{prompt}\n\nКонтекст: {'. '.join(parts)}"

        # Создаём задачу
        cur.execute(
            f"INSERT INTO {SCHEMA}.image_jobs (user_id,salon_id,prompt,aspect_ratio,status,cost) "
            f"VALUES (%s,%s,%s,%s,'pending',%s) RETURNING id",
            (user["id"], salon_id, final_prompt, aspect_gpt15, cost)
        )
        job_id = str(cur.fetchone()[0])
        conn.commit()

        return ok({"job_id": job_id, "status": "pending"})
    finally:
        conn.close()
