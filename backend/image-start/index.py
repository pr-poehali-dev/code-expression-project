"""
Быстрый запуск генерации изображения. Возвращает job_id за ~1 секунду.
Списывает энергию и создаёт задачу. Фронтенд потом опрашивает статус через image-worker.
Защита от двойного запуска: FOR UPDATE на строку салона + проверка активной задачи.
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

        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        # Проверяем: нет ли уже активной задачи у этого пользователя (pending/running)
        # созданной менее 10 минут назад — защита от двойного запуска
        cur.execute(
            f"SELECT id, status FROM {SCHEMA}.image_jobs "
            f"WHERE user_id=%s AND status IN ('pending','running') "
            f"AND created_at > NOW() - INTERVAL '10 minutes' "
            f"ORDER BY created_at DESC LIMIT 1",
            (user["id"],)
        )
        active_job = cur.fetchone()
        if active_job:
            print(f"[image-start] user {user['id']} already has active job {active_job['id']} ({active_job['status']})")
            return ok({"job_id": str(active_job["id"]), "status": active_job["status"], "reused": True})

        cur2 = conn.cursor()

        # Атомарное списание с блокировкой строки (FOR UPDATE)
        # Второй одновременный запрос от того же салона будет ждать
        cur2.execute(
            f"SELECT credits_balance FROM {SCHEMA}.salons WHERE id=%s FOR UPDATE",
            (salon_id,)
        )
        salon_row = cur2.fetchone()
        if not salon_row:
            return err("Салон не найден", 400)

        cur2.execute(
            f"SELECT energy_cost FROM {SCHEMA}.tool_costs WHERE tool_key='image_gen'"
        )
        cost_row = cur2.fetchone()
        cost = cost_row[0] if cost_row else 5

        balance = int(salon_row[0])
        if balance < cost:
            conn.rollback()
            return err(f"Недостаточно энергии. Доступно {balance}. Пополните баланс, чтобы продолжить.", 402)

        # Списываем энергию
        cur2.execute(
            f"UPDATE {SCHEMA}.salons SET credits_balance=credits_balance-%s WHERE id=%s",
            (cost, salon_id)
        )
        cur2.execute(
            f"INSERT INTO {SCHEMA}.credit_transactions (salon_id,user_id,action,amount,tool_key,type) "
            f"VALUES (%s,%s,'Создание изображения',%s,'image_gen','debit')",
            (salon_id, user["id"], cost)
        )

        # Подготавливаем финальный промпт с контекстом салона
        final_prompt = prompt
        use_salon_context = body.get("use_salon_context", False)
        include_logo_text = body.get("include_logo_text", False)
        include_salon_name = body.get("include_salon_name", False)
        if use_salon_context:
            cur3 = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            cur3.execute(
                f"SELECT name, description, target_audience, tone_of_voice, website_url FROM {SCHEMA}.salons WHERE id=%s",
                (salon_id,)
            )
            salon = cur3.fetchone()
            if salon:
                parts = []
                if salon.get("description"): parts.append(f"О салоне: {salon['description']}")
                if salon.get("target_audience"): parts.append(f"Аудитория: {salon['target_audience']}")
                if salon.get("tone_of_voice"): parts.append(f"Стиль: {salon['tone_of_voice']}")
                if salon.get("website_url"):  parts.append(f"Сайт: {salon['website_url']}")
                if include_salon_name and salon.get("name"):
                    parts.append(f"На изображении художественно изобразить надпись с названием салона: \"{salon['name']}\"")
                if include_logo_text:
                    parts.append("Добавить художественный логотип-символ в стиле салона красоты в угол изображения")
                if parts:
                    final_prompt = f"{prompt}\n\nКонтекст: {'. '.join(parts)}"

        # Создаём задачу
        cur2.execute(
            f"INSERT INTO {SCHEMA}.image_jobs (user_id,salon_id,prompt,aspect_ratio,status,cost) "
            f"VALUES (%s,%s,%s,%s,'pending',%s) RETURNING id",
            (user["id"], salon_id, final_prompt, aspect_gpt15, cost)
        )
        job_id = str(cur2.fetchone()[0])
        conn.commit()

        print(f"[image-start] created job {job_id} for user {user['id']}, cost={cost}")
        return ok({"job_id": job_id, "status": "pending"})
    finally:
        try:
            conn.close()
        except Exception:
            pass