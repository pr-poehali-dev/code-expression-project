"""
Воркер генерации изображений. Два режима:
  GET ?job_id=... — проверить статус задачи (быстро, ~100мс)
  POST {job_id}   — запустить генерацию (долго, до 285 сек)
Фронтенд: сначала POST для запуска, потом GET каждые 3 сек для проверки.
"""
import json
import os
import base64
import uuid
from datetime import datetime
import psycopg2
import psycopg2.extras
import urllib.request
import urllib.error
import boto3

SCHEMA = "t_p84565078_code_expression_proj"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
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


def upload_to_s3(image_b64: str, user_id: int) -> str:
    data = base64.b64decode(image_b64)
    ts = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    uid = uuid.uuid4().hex[:8]
    key = f"ai-images/tmp/{user_id}/{ts}_{uid}.png"
    s3 = boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )
    s3.put_object(Bucket="files", Key=key, Body=data, ContentType="image/png")
    return f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"


def handle_status(event, conn):
    """GET — быстрая проверка статуса задачи."""
    user = get_session_user(event, conn)
    if not user:
        return err("Не авторизован", 401)

    qs = event.get("queryStringParameters") or {}
    job_id = qs.get("job_id")
    if not job_id:
        return err("job_id обязателен")

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    # Задачи зависшие в running дольше 3 минут — помечаем ошибкой
    cur.execute(
        f"UPDATE {SCHEMA}.image_jobs SET status='error', error_msg='Превышено время ожидания' "
        f"WHERE status IN ('pending','running') AND created_at < NOW() - INTERVAL '3 minutes'"
    )
    conn.commit()
    cur.execute(
        f"SELECT id,status,result_url,error_msg,prompt FROM {SCHEMA}.image_jobs "
        f"WHERE id=%s AND user_id=%s", (job_id, user["id"])
    )
    job = cur.fetchone()
    if not job:
        return err("Задача не найдена", 404)

    return ok({
        "job_id": str(job["id"]),
        "status": job["status"],
        "url": job["result_url"],
        "error": job["error_msg"],
        "prompt": job["prompt"],
    })


def handle_run(event, conn):
    """POST — запускает генерацию для задачи. Долгий запрос."""
    user = get_session_user(event, conn)
    if not user:
        return err("Не авторизован", 401)

    body = json.loads(event.get("body") or "{}")
    job_id = body.get("job_id")
    if not job_id:
        return err("job_id обязателен")
    print(f"[image-worker] handle_run START job={job_id}")

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT * FROM {SCHEMA}.image_jobs WHERE id=%s AND user_id=%s",
        (job_id, user["id"])
    )
    job = cur.fetchone()
    if not job:
        return err("Задача не найдена", 404)

    # Если уже готова — сразу возвращаем результат
    if job["status"] == "done" and job["result_url"]:
        return ok({"job_id": str(job_id), "status": "done", "url": job["result_url"]})

    # Если зависла в running дольше 5 минут — перезапускаем
    # В остальных случаях помечаем running и работаем
    cur.execute(
        f"UPDATE {SCHEMA}.image_jobs SET status='running', updated_at=NOW() WHERE id=%s",
        (job_id,)
    )
    conn.commit()

    api_key = os.environ.get("POLZA_AI_API_KEY", "")

    payload = json.dumps({
        "model": "openai/gpt-image-1.5",
        "input": {
            "prompt": job["prompt"],
            "aspect_ratio": job["aspect_ratio"],
            "max_images": 1,
        }
    }).encode("utf-8")

    req = urllib.request.Request(
        "https://polza.ai/api/v1/media",
        data=payload,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )

    print(f"[image-worker] job {job_id}: calling polza.ai...")
    try:
        with urllib.request.urlopen(req, timeout=110) as resp:
            raw = resp.read().decode("utf-8")
            print(f"[image-worker] job {job_id}: polza raw = {raw[:400]}")
            result = json.loads(raw)
        print(f"[image-worker] job {job_id}: polza.ai responded OK")
    except urllib.error.HTTPError as e:
        error_text = e.read().decode("utf-8", errors="ignore")[:200]
        cur.execute(
            f"UPDATE {SCHEMA}.image_jobs SET status='error', error_msg=%s, updated_at=NOW() WHERE id=%s",
            (f"Ошибка API: {error_text}", job_id)
        )
        conn.commit()
        return err(f"Ошибка сервиса генерации: {error_text}", 502)
    except Exception as e:
        msg = str(e)
        cur.execute(
            f"UPDATE {SCHEMA}.image_jobs SET status='error', error_msg=%s, updated_at=NOW() WHERE id=%s",
            (msg[:200], job_id)
        )
        conn.commit()
        return err(f"Ошибка соединения: {msg}", 502)

    # Извлекаем URL или base64
    image_url = None
    for item in (result.get("data") or result.get("images") or []):
        if isinstance(item, dict):
            url = item.get("url", "")
            b64 = item.get("b64_json") or item.get("base64") or ""
            if url:
                image_url = url
                break
            if b64:
                image_url = upload_to_s3(b64, user["id"])
                break

    if not image_url:
        cur.execute(
            f"UPDATE {SCHEMA}.image_jobs SET status='error', error_msg='Сервис не вернул изображение', updated_at=NOW() WHERE id=%s",
            (job_id,)
        )
        conn.commit()
        return err("Сервис не вернул изображение", 502)

    # Сохраняем результат
    cur.execute(
        f"UPDATE {SCHEMA}.image_jobs SET status='done', result_url=%s, updated_at=NOW() WHERE id=%s",
        (image_url, job_id)
    )
    # Сохраняем в историю
    cur.execute(
        f"INSERT INTO {SCHEMA}.ai_generated_images (user_id, url, prompt, aspect_ratio) VALUES (%s,%s,%s,%s)",
        (user["id"], image_url, job["prompt"], job["aspect_ratio"])
    )
    conn.commit()
    print(f"[image-worker] job {job_id}: DONE, saved to history")

    return ok({"job_id": str(job_id), "status": "done", "url": image_url})


def handler(event: dict, context) -> dict:
    """Воркер генерации изображений: GET=статус, POST=запуск."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    conn = get_db()
    try:
        if event.get("httpMethod") == "GET":
            return handle_status(event, conn)
        if event.get("httpMethod") == "POST":
            return handle_run(event, conn)
        return err("Method not allowed", 405)
    finally:
        conn.close()