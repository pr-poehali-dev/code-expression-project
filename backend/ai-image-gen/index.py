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
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
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


def get_salon_context(user, conn):
    """Получаем данные салона для использования в промпте."""
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
    """Загружаем изображение в S3 во временную папку, возвращаем CDN URL."""
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


def handler(event: dict, context) -> dict:
    """Генерация изображений для салона через polza.ai / gpt-image-1.5."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    if event.get("httpMethod") != "POST":
        return err("Method not allowed", 405)

    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)

        body = json.loads(event.get("body") or "{}")
        prompt = (body.get("prompt") or "").strip()
        if not prompt:
            return err("Укажите промпт для генерации")
        if len(prompt) > 5000:
            return err("Промпт слишком длинный (максимум 5000 символов)")

        aspect_raw = body.get("aspect_ratio", "1024x1024")
        # Нормализуем к формату 1024x1024
        if aspect_raw not in ASPECT_MAP_DALLE:
            aspect_raw = "1024x1024"
        aspect_dalle = ASPECT_MAP_DALLE[aspect_raw]
        aspect_gpt15 = ASPECT_MAP_GPT15[aspect_raw]

        max_images = int(body.get("max_images", 1))
        if max_images < 1: max_images = 1
        if max_images > 4: max_images = 4

        # Если пользователь хочет использовать контекст салона — добавляем в промпт
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

        api_key = os.environ.get("POLZA_AI_API_KEY", "")
        if not api_key:
            return err("API ключ не настроен.", 500)

        conn.close()

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
            with urllib.request.urlopen(req, timeout=110) as resp:
                raw = resp.read().decode("utf-8")
                print(f"[polza.ai] {raw[:300]}")
                result = json.loads(raw)
        except urllib.error.HTTPError as e:
            body = e.read().decode("utf-8", errors="ignore")
            print(f"[polza.ai] HTTP {e.code}: {body[:300]}")
            return err(f"Ошибка сервиса генерации: {body[:150]}", 502)
        except Exception as e:
            msg = str(e)
            print(f"[polza.ai] err: {msg}")
            if "timed out" in msg.lower() or "timeout" in msg.lower():
                return err("Сервис сейчас перегружен — попробуйте ещё раз через 1-2 минуты.", 504)
            return err(f"Ошибка соединения: {msg}", 502)

        image_url = None
        for item in (result.get("data") or result.get("images") or []):
            if isinstance(item, dict):
                url = item.get("url", "")
                b64 = item.get("b64_json") or item.get("base64") or ""
                if url:
                    image_url = url
                    break
                if b64:
                    image_url = upload_to_s3(b64, "png", user["id"])
                    break

        if not image_url:
            return err("Сервис не вернул изображение. Попробуйте ещё раз.", 502)

        return ok({"images": [{"url": image_url}], "prompt_used": final_prompt})

    finally:
        try:
            conn.close()
        except Exception:
            pass