"""
Генерация видео-роликов через polza.ai (модель bytedance/seedance-2-mini). ТАЙМАУТ ФУНКЦИИ ДОЛЖЕН БЫТЬ 300с.
Результат возвращается по URL от polza.ai (файл хранится на их стороне некоторое время).
Маршруты: POST / — генерация, GET / — история, DELETE / — удалить запись истории.
"""
import json
import os
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

ALLOWED_DURATIONS = {"5s", "10s"}
ALLOWED_RESOLUTIONS = {"720p"}


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


def get_tool_cost(conn, duration: str) -> int:
    tool_key = "video_gen_10s" if duration == "10s" else "video_gen_5s"
    cur = conn.cursor()
    cur.execute(f"SELECT energy_cost FROM {SCHEMA}.tool_costs WHERE tool_key = %s", (tool_key,))
    row = cur.fetchone()
    if row:
        return row[0]
    return 180 if duration == "10s" else 105


def has_paid_at_least_once(salon_id, conn) -> bool:
    cur = conn.cursor()
    cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.payments WHERE salon_id = %s AND status = 'succeeded'", (salon_id,))
    row = cur.fetchone()
    return (row[0] or 0) > 0


def check_and_deduct_energy(salon_id, user_id, amount, tool_key, conn) -> tuple[bool, int]:
    """Атомарная проверка баланса и списание с блокировкой строки (FOR UPDATE)."""
    cur = conn.cursor()
    cur.execute(f"SELECT credits_balance FROM {SCHEMA}.salons WHERE id = %s FOR UPDATE", (salon_id,))
    row = cur.fetchone()
    if not row:
        return False, 0
    balance = int(row[0])
    if balance < amount:
        return False, balance
    cur.execute(f"UPDATE {SCHEMA}.salons SET credits_balance = credits_balance - %s WHERE id = %s", (amount, salon_id))
    cur.execute(
        f"INSERT INTO {SCHEMA}.credit_transactions (salon_id, user_id, action, amount, tool_key, type) "
        f"VALUES (%s, %s, %s, %s, %s, 'debit')",
        (salon_id, user_id, "Создание видео", amount, tool_key)
    )
    conn.commit()
    return True, balance


def refund_energy(salon_id, user_id, cost, tool_key, conn):
    cur = conn.cursor()
    cur.execute(f"UPDATE {SCHEMA}.salons SET credits_balance = credits_balance + %s WHERE id = %s", (cost, salon_id))
    cur.execute(
        f"INSERT INTO {SCHEMA}.credit_transactions (salon_id, user_id, action, amount, tool_key, type) "
        f"VALUES (%s, %s, %s, %s, %s, 'credit')",
        (salon_id, user_id, "Возврат: ИИ-сервис недоступен", cost, tool_key)
    )
    conn.commit()


def is_provider_error(e: Exception) -> bool:
    msg = str(e).lower()
    return any(x in msg for x in ("502", "503", "service_unavailable", "temporarily", "bad gateway"))


def save_history(user_id, salon_id, url, prompt, resolution, duration, cost, conn):
    cur = conn.cursor()
    cur.execute(
        f"INSERT INTO {SCHEMA}.video_jobs (user_id, salon_id, prompt, resolution, duration, status, result_url, cost) "
        f"VALUES (%s, %s, %s, %s, %s, 'done', %s, %s)",
        (user_id, salon_id, prompt, resolution, duration, url, cost)
    )
    conn.commit()


def handle_history(event, conn):
    user = get_session_user(event, conn)
    if not user:
        return err("Не авторизован", 401)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"DELETE FROM {SCHEMA}.video_jobs WHERE created_at < NOW() - INTERVAL '6 days'"
    )
    conn.commit()
    cur.execute(
        f"SELECT id, result_url AS url, prompt, resolution, duration, created_at "
        f"FROM {SCHEMA}.video_jobs WHERE user_id=%s AND status='done' AND result_url IS NOT NULL "
        f"ORDER BY created_at DESC LIMIT 30",
        (user["id"],)
    )
    return ok([dict(r) for r in cur.fetchall()])


def handle_delete(event, conn):
    user = get_session_user(event, conn)
    if not user:
        return err("Не авторизован", 401)
    body = json.loads(event.get("body") or "{}")
    video_id = body.get("id")
    if not video_id:
        return err("id обязателен")
    cur = conn.cursor()
    cur.execute(f"DELETE FROM {SCHEMA}.video_jobs WHERE id=%s AND user_id=%s", (video_id, user["id"]))
    conn.commit()
    return ok({"ok": True})


def handler(event: dict, context) -> dict:
    """Генерация видео-роликов для салона через polza.ai / bytedance/seedance-2-mini."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    if event.get("httpMethod") == "GET":
        conn = get_db()
        try:
            return handle_history(event, conn)
        finally:
            conn.close()

    if event.get("httpMethod") == "DELETE":
        conn = get_db()
        try:
            return handle_delete(event, conn)
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

        if not has_paid_at_least_once(salon_id, conn):
            return err("Инструмент доступен только после пополнения баланса. Бонусные 100 энергий сюда не распространяются.", 403)

        body = json.loads(event.get("body") or "{}")
        prompt = (body.get("prompt") or "").strip()
        if not prompt:
            return err("Укажите описание видео")
        if len(prompt) > 2000:
            return err("Описание слишком длинное (максимум 2000 символов)")

        duration = body.get("duration", "5s")
        if duration not in ALLOWED_DURATIONS:
            duration = "5s"
        resolution = body.get("resolution", "720p")
        if resolution not in ALLOWED_RESOLUTIONS:
            resolution = "720p"

        tool_key = "video_gen_10s" if duration == "10s" else "video_gen_5s"
        cost = get_tool_cost(conn, duration)
        ok_deduct, balance = check_and_deduct_energy(salon_id, user["id"], cost, tool_key, conn)
        if not ok_deduct:
            return err(f"Недостаточно энергии. Нужно {cost}, доступно {balance}.", 402)

        conn.close()

        api_key = os.environ.get("POLZA_AI_API_KEY", "")
        if not api_key:
            return err("API ключ не настроен.", 500)

        # Модель не умеет корректно рисовать русский (да и любой) текст на экране —
        # вместо букв получаются нечитаемые символы. Явно просим обойтись без текста/надписей.
        final_prompt = prompt + ". Без текста на экране, без надписей, без субтитров, без вывесок с читаемыми словами."

        payload = json.dumps({
            "model": "bytedance/seedance-2-mini",
            "input": {
                "prompt": final_prompt,
                "resolution": resolution,
                "duration": duration,
                "multi_shots": False,
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
                print(f"[polza.ai video] {raw[:300]}")
                result = json.loads(raw)
        except urllib.error.HTTPError as e:
            body_text = e.read().decode("utf-8", errors="ignore")
            print(f"[polza.ai video] HTTP {e.code}: {body_text[:300]}")
            if e.code in (502, 503):
                try:
                    conn_r = get_db()
                    refund_energy(salon_id, user["id"], cost, tool_key, conn_r)
                    conn_r.close()
                except Exception:
                    pass
                return err("ИИ-сервис временно недоступен, энергия возвращена. Попробуйте через минуту.", 503)
            try:
                conn_r = get_db()
                refund_energy(salon_id, user["id"], cost, tool_key, conn_r)
                conn_r.close()
            except Exception:
                pass
            return err(f"Ошибка сервиса генерации: {body_text[:150]}", 502)
        except Exception as e:
            msg = str(e)
            print(f"[polza.ai video] err: {msg}")
            if is_provider_error(e):
                try:
                    conn_r = get_db()
                    refund_energy(salon_id, user["id"], cost, tool_key, conn_r)
                    conn_r.close()
                except Exception:
                    pass
                return err("ИИ-сервис временно недоступен, энергия возвращена. Попробуйте через минуту.", 503)
            if "timed out" in msg.lower() or "timeout" in msg.lower():
                return err("Видео генерируется дольше обычного — проверьте раздел «Мои видео» через минуту.", 504)
            return err(f"Ошибка соединения: {msg}", 502)

        # Провайдер может ответить HTTP 200, но с status='failed' внутри тела
        # (например модерация контента отклонила промпт)
        if result.get("status") == "failed":
            provider_msg = (result.get("error") or {}).get("message", "")
            print(f"[polza.ai video] generation failed: {provider_msg}")
            try:
                conn_r = get_db()
                refund_energy(salon_id, user["id"], cost, tool_key, conn_r)
                conn_r.close()
            except Exception:
                pass
            if "sensitive" in provider_msg.lower() or "audio" in provider_msg.lower():
                return err(
                    "Сервис отклонил генерацию: описание могло привести к недопустимому контенту (например, звуку/голосу). "
                    "Энергия возвращена. Попробуйте переформулировать описание без упоминания голоса, музыки или конкретных людей.",
                    422
                )
            return err(f"Сервис отклонил генерацию: {provider_msg or 'без описания причины'}. Энергия возвращена.", 422)

        video_url = None
        data_field = result.get("data") or result.get("videos")
        if isinstance(data_field, dict):
            # Формат: {"data": {"url": "..."}}
            video_url = data_field.get("url", "") or None
        elif isinstance(data_field, list):
            # Формат: {"data": [{"url": "..."}, ...]}
            for item in data_field:
                if isinstance(item, dict):
                    url = item.get("url", "")
                    if url:
                        video_url = url
                        break

        if not video_url:
            try:
                conn_r = get_db()
                refund_energy(salon_id, user["id"], cost, tool_key, conn_r)
                conn_r.close()
            except Exception:
                pass
            return err("Сервис не вернул видео. Энергия возвращена. Попробуйте ещё раз.", 502)

        try:
            conn3 = get_db()
            save_history(user["id"], salon_id, video_url, prompt, resolution, duration, cost, conn3)
            conn3.close()
        except Exception as e:
            print(f"[ai-video-gen] history save error: {e}")

        return ok({"video": {"url": video_url}, "energy_spent": cost})

    finally:
        try:
            conn.close()
        except Exception:
            pass