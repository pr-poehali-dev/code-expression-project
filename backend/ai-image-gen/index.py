"""
Генерация изображений через polza.ai (модель openai/gpt-image-1.5).
Результат временно сохраняется в S3 и возвращается URL для скачивания.
После скачивания пользователем файлы не удаляются автоматически — хранятся 24ч (для MVP).
Маршруты: POST / — генерация
"""
import json
import os
import base64
import uuid
from datetime import datetime

import boto3
import psycopg2
import psycopg2.extras
import urllib.request
import urllib.error

SCHEMA = "t_p84565078_code_expression_proj"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}

# Для gpt-image-1.5: aspect_ratio
ASPECT_MAP_GPT15 = {
    "1024x1024": "1:1",
    "1024x1792": "2:3",
    "1792x1024": "3:2",
}
# Для dall-e-3: size в пикселях
ASPECT_MAP_DALLE = {
    "1024x1024": "1024x1024",
    "1024x1792": "1024x1792",
    "1792x1024": "1792x1024",
}

TOOL_KEY = "image_gen"


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def ok(data, status=200):
    return {"statusCode": status, "headers": CORS, "body": json.dumps(data, ensure_ascii=False, default=str)}


def err(msg, status=400):
    return {"statusCode": status, "headers": CORS, "body": json.dumps({"error": msg}, ensure_ascii=False)}


def get_session_user(event, conn):
    session_id = (event.get("headers") or {}).get("X-Session-Id", "")
    if not session_id:
        return None
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT u.* FROM {SCHEMA}.lk_sessions s JOIN {SCHEMA}.lk_users u ON u.id = s.user_id "
        f"WHERE s.id = %s AND s.expires_at > NOW() AND u.is_active = TRUE",
        (session_id,)
    )
    return cur.fetchone()


def get_tool_cost(conn) -> int:
    cur = conn.cursor()
    cur.execute(
        f"SELECT energy_cost FROM {SCHEMA}.tool_costs WHERE tool_key = %s",
        (TOOL_KEY,)
    )
    row = cur.fetchone()
    return row[0] if row else 5


def get_salon_balance(salon_id, conn) -> int:
    cur = conn.cursor()
    cur.execute(
        f"SELECT COALESCE(SUM(CASE WHEN type='credit' THEN amount ELSE -amount END), 0) "
        f"FROM {SCHEMA}.credit_transactions WHERE salon_id = %s",
        (salon_id,)
    )
    return cur.fetchone()[0]


def deduct_energy(salon_id, user_id, amount, conn):
    cur = conn.cursor()
    cur.execute(
        f"UPDATE {SCHEMA}.salons SET credits_balance = credits_balance - %s WHERE id = %s",
        (amount, salon_id)
    )
    cur.execute(
        f"INSERT INTO {SCHEMA}.credit_transactions (salon_id, user_id, action, amount, tool_key, type) "
        f"VALUES (%s, %s, %s, %s, %s, 'debit')",
        (salon_id, user_id, "Создание изображения", amount, TOOL_KEY)
    )
    conn.commit()


def save_image_history(user_id, url, prompt, aspect_ratio, conn):
    cur = conn.cursor()
    cur.execute(
        f"INSERT INTO {SCHEMA}.ai_generated_images (user_id, url, prompt, aspect_ratio) "
        f"VALUES (%s, %s, %s, %s)",
        (user_id, url, prompt, aspect_ratio)
    )
    conn.commit()


def get_salon_context(user, conn):
    salon_id = user.get("salon_id")
    if not salon_id:
        return None
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT name, description, target_audience, tone_of_voice, main_goal FROM {SCHEMA}.salons WHERE id = %s",
        (salon_id,)
    )
    return cur.fetchone()


def upload_to_s3(image_b64: str, ext: str, user_id: int) -> str:
    data = base64.b64decode(image_b64)
    ts = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    uid = uuid.uuid4().hex[:8]
    key = f"ai-images/tmp/{user_id}/{ts}_{uid}.{ext}"

    s3 = boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )
    s3.put_object(Bucket="files", Key=key, Body=data, ContentType=f"image/{ext}")
    cdn_url = f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"
    return cdn_url


def handle_history(event, conn):
    user = get_session_user(event, conn)
    if not user:
        return err("Не авторизован", 401)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    # Автоудаление записей старше 24 часов
    cur.execute(
        f"DELETE FROM {SCHEMA}.ai_generated_images WHERE created_at < NOW() - INTERVAL '24 hours'"
    )
    conn.commit()
    cur.execute(
        f"SELECT id, url, prompt, aspect_ratio, created_at "
        f"FROM {SCHEMA}.ai_generated_images WHERE user_id=%s AND url != 'pending' ORDER BY created_at DESC LIMIT 50",
        (user["id"],)
    )
    return ok([dict(r) for r in cur.fetchall()])


def handle_delete_image(event, conn):
    user = get_session_user(event, conn)
    if not user:
        return err("Не авторизован", 401)
    body = json.loads(event.get("body") or "{}")
    image_id = body.get("id")
    if not image_id:
        return err("id обязателен")
    cur = conn.cursor()
    cur.execute(
        f"DELETE FROM {SCHEMA}.ai_generated_images WHERE id=%s AND user_id=%s",
        (image_id, user["id"])
    )
    conn.commit()
    return ok({"ok": True})


def handler(event: dict, context) -> dict:
    """Генерация изображений для салона через polza.ai / gpt-image-1.5."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    # История изображений
    if event.get("httpMethod") == "GET":
        conn = get_db()
        try:
            return handle_history(event, conn)
        finally:
            conn.close()

    # Удаление изображения
    if event.get("httpMethod") == "DELETE":
        conn = get_db()
        try:
            return handle_delete_image(event, conn)
        finally:
            conn.close()

    if event.get("httpMethod") != "POST":
        return err("Method not allowed", 405)

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
            return err("Укажите промпт для генерации")
        if len(prompt) > 5000:
            return err("Промпт слишком длинный (максимум 5000 символов)")

        aspect_raw = body.get("aspect_ratio", "1024x1024")
        if aspect_raw not in ASPECT_MAP_DALLE:
            aspect_raw = "1024x1024"
        aspect_dalle = ASPECT_MAP_DALLE[aspect_raw]
        aspect_gpt15 = ASPECT_MAP_GPT15[aspect_raw]

        # Проверяем баланс и сразу списываем ДО вызова ИИ
        # (генерация занимает 2+ минуты, после таймаута функции DB-запросы не выполняются)
        cost = get_tool_cost(conn)
        balance = get_salon_balance(salon_id, conn)
        if balance < cost:
            return err(f"Недостаточно энергии. Нужно {cost}, доступно {balance}.", 402)

        deduct_energy(salon_id, user["id"], cost, conn)

        use_salon_context = body.get("use_salon_context", False)
        final_prompt = prompt
        if use_salon_context:
            salon = get_salon_context(user, conn)
            if salon:
                ctx_parts = []
                if salon.get("name"):
                    ctx_parts.append(f"Салон: {salon['name']}")
                if salon.get("description"):
                    ctx_parts.append(f"О салоне: {salon['description']}")
                if salon.get("target_audience"):
                    ctx_parts.append(f"Аудитория: {salon['target_audience']}")
                if salon.get("tone_of_voice"):
                    ctx_parts.append(f"Стиль: {salon['tone_of_voice']}")
                if ctx_parts:
                    final_prompt = f"{prompt}\n\nКонтекст: {'. '.join(ctx_parts)}"

        conn.close()

        api_key = os.environ.get("POLZA_AI_API_KEY", "")
        if not api_key:
            return err("API ключ не настроен.", 500)

        payload = json.dumps({
            "model": "openai/gpt-image-1.5",
            "input": {
                "prompt": final_prompt,
                "aspect_ratio": aspect_gpt15,
                "max_images": 1,
            }
        }).encode("utf-8")

        req = urllib.request.Request(
            "https://polza.ai/api/v1/media",
            data=payload,
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            method="POST",
        )

        try:
            with urllib.request.urlopen(req, timeout=285) as resp:
                raw = resp.read().decode("utf-8")
                print(f"[polza.ai] {raw[:300]}")
                result = json.loads(raw)
        except urllib.error.HTTPError as e:
            body_text = e.read().decode("utf-8", errors="ignore")
            print(f"[polza.ai] HTTP {e.code}: {body_text[:300]}")
            return err(f"Ошибка сервиса генерации: {body_text[:150]}", 502)
        except Exception as e:
            msg = str(e)
            print(f"[polza.ai] err: {msg}")
            if "timed out" in msg.lower() or "timeout" in msg.lower():
                return err("Картинка генерируется дольше обычного — проверьте раздел «Мои изображения» через минуту.", 504)
            return err(f"Ошибка соединения: {msg}", 502)

        image_url = None
        b64_data = None

        for item in (result.get("data") or result.get("images") or []):
            if isinstance(item, dict):
                url = item.get("url", "")
                b64 = item.get("b64_json") or item.get("base64") or ""
                if url:
                    image_url = url
                    break
                if b64:
                    b64_data = b64
                    break

        if not image_url and not b64_data:
            return err("Сервис не вернул изображение. Попробуйте ещё раз.", 502)

        if b64_data:
            image_url = upload_to_s3(b64_data, "png", user["id"])

        # Сохраняем в историю
        try:
            conn3 = get_db()
            save_image_history(user["id"], image_url, prompt, aspect_gpt15, conn3)
            conn3.close()
        except Exception as e:
            print(f"[ai-image-gen] history save error: {e}")

        return ok({"images": [{"url": image_url}], "prompt_used": final_prompt, "energy_spent": cost})

    finally:
        try:
            conn.close()
        except Exception:
            pass