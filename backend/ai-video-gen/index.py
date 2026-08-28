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


VIDEO_GEN_TOOL_KEYS = ("video_gen_5s", "video_gen_10s")


def package_covers_usage(conn, user_id: int, tool_key: str) -> bool:
    """Если у пользователя активен пакет развития и лимит использований в сутки (скользящее
    окно 24ч) не исчерпан — использование бесплатное, логируем и возвращаем True (энергия при
    этом не списывается). Для видео 5с и 10с лимит ОБЩИЙ — считаем оба варианта вместе, чтобы
    нельзя было получить в 2 раза больше бесплатных роликов, чередуя длительность."""
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"""SELECT pp.daily_limit_per_tool FROM {SCHEMA}.user_packages up
            JOIN {SCHEMA}.package_plans pp ON pp.code = up.plan_code
            WHERE up.user_id=%s AND up.status='active' AND up.expires_at > NOW()
            ORDER BY up.expires_at DESC LIMIT 1""",
        (user_id,)
    )
    pkg = cur.fetchone()
    if not pkg:
        return False
    cur2 = conn.cursor()
    if tool_key in VIDEO_GEN_TOOL_KEYS:
        cur2.execute(
            f"SELECT COUNT(*) FROM {SCHEMA}.tool_usage_log WHERE user_id=%s AND tool_key IN %s "
            f"AND used_at > NOW() - INTERVAL '24 hours'",
            (user_id, VIDEO_GEN_TOOL_KEYS)
        )
    else:
        cur2.execute(
            f"SELECT COUNT(*) FROM {SCHEMA}.tool_usage_log WHERE user_id=%s AND tool_key=%s AND used_at > NOW() - INTERVAL '24 hours'",
            (user_id, tool_key)
        )
    used = cur2.fetchone()[0] or 0
    if used >= pkg["daily_limit_per_tool"]:
        return False
    cur2.execute(f"INSERT INTO {SCHEMA}.tool_usage_log (user_id, tool_key) VALUES (%s,%s)", (user_id, tool_key))
    conn.commit()
    return True


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


def create_running_job(user_id, salon_id, prompt, resolution, duration, cost, conn) -> str:
    """Создаёт запись задачи со статусом 'running' ДО вызова polza.ai — это позволяет
    отследить и заблокировать повторный запуск, если предыдущий запрос ещё выполняется
    (например пользователь нажал «Сгенерировать» второй раз, не дождавшись ответа)."""
    cur = conn.cursor()
    cur.execute(
        f"INSERT INTO {SCHEMA}.video_jobs (user_id, salon_id, prompt, resolution, duration, status, cost) "
        f"VALUES (%s, %s, %s, %s, %s, 'running', %s) RETURNING id",
        (user_id, salon_id, prompt, resolution, duration, cost)
    )
    job_id = cur.fetchone()[0]
    conn.commit()
    return job_id


def finish_job_done(job_id, url, conn):
    cur = conn.cursor()
    cur.execute(f"UPDATE {SCHEMA}.video_jobs SET status='done', result_url=%s, updated_at=NOW() WHERE id=%s", (url, job_id))
    conn.commit()


def finish_job_error(job_id, msg, conn):
    cur = conn.cursor()
    cur.execute(f"UPDATE {SCHEMA}.video_jobs SET status='error', error_msg=%s, updated_at=NOW() WHERE id=%s", (msg[:200], job_id))
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

        # Защита от двойного запуска: если у пользователя уже есть задача в статусе 'running',
        # созданная недавно (функция может выполняться до 300с), новую генерацию не запускаем —
        # именно повторное нажатие «Сгенерировать» после долгого ожидания приводило к тому, что
        # у polza.ai создавалось два ролика и энергия списывалась дважды.
        cur_check = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur_check.execute(
            f"SELECT id FROM {SCHEMA}.video_jobs WHERE user_id=%s AND status='running' "
            f"AND created_at > NOW() - INTERVAL '6 minutes' LIMIT 1",
            (user["id"],)
        )
        if cur_check.fetchone():
            return err("Предыдущее видео ещё генерируется. Дождитесь результата — он появится в «Мои видео», прежде чем запускать новое.", 409)

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
        pkg_covered = package_covers_usage(conn, user["id"], tool_key)
        if not pkg_covered:
            ok_deduct, balance = check_and_deduct_energy(salon_id, user["id"], cost, tool_key, conn)
            if not ok_deduct:
                return err(f"Недостаточно энергии. Доступно {balance}. Пополните баланс, чтобы продолжить.", 402)

        job_id = create_running_job(user["id"], salon_id, prompt, resolution, duration, cost, conn)

        conn.close()

        api_key = os.environ.get("POLZA_AI_API_KEY", "")
        if not api_key:
            return err("API ключ не настроен.", 500)

        # Модель не умеет корректно рисовать русский (да и любой) текст на экране —
        # вместо букв получаются нечитаемые символы. Также модель не говорит по-русски —
        # люди в кадре не должны говорить и издавать звуки, только фоновая музыка.
        final_prompt = (
            prompt
            + ". Без текста на экране, без надписей, без субтитров, без вывесок с читаемыми словами."
            + " Люди в кадре не говорят и не издают звуков, без диалогов и закадрового голоса — только фоновая музыка."
        )

        # polza.ai (модель seedance-2-mini) ожидает input.duration СТРОКОЙ с числом секунд
        # БЕЗ суффикса "s" (например "5", не "5s" и не число 5) — внутри функции строковый
        # формат "5s"/"10s" используется только для сравнения с ALLOWED_DURATIONS и подбора
        # tool_key, поэтому суффикс убираем исключительно в payload.
        duration_str = duration.rstrip("s")

        payload = json.dumps({
            "model": "bytedance/seedance-2-mini",
            "input": {
                "prompt": final_prompt,
                "resolution": resolution,
                "duration": duration_str,
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
            try:
                conn_j = get_db()
                finish_job_error(job_id, body_text, conn_j)
                conn_j.close()
            except Exception:
                pass
            if e.code in (502, 503):
                if not pkg_covered:
                    try:
                        conn_r = get_db()
                        refund_energy(salon_id, user["id"], cost, tool_key, conn_r)
                        conn_r.close()
                    except Exception:
                        pass
                return err("ИИ-сервис временно недоступен, энергия возвращена. Попробуйте через минуту.", 503)
            if not pkg_covered:
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
            # При таймауте job специально ОСТАВЛЯЕМ в статусе 'running' — сама генерация
            # у polza.ai продолжает выполняться на их стороне и может завершиться позже,
            # чем ответит наша функция. Снимаем блокировку только когда джоб протухнет
            # (см. проверку "created_at > NOW() - INTERVAL '6 minutes'" при запуске).
            is_timeout = "timed out" in msg.lower() or "timeout" in msg.lower()
            if not is_timeout:
                try:
                    conn_j = get_db()
                    finish_job_error(job_id, msg, conn_j)
                    conn_j.close()
                except Exception:
                    pass
            if is_provider_error(e):
                if not pkg_covered:
                    try:
                        conn_r = get_db()
                        refund_energy(salon_id, user["id"], cost, tool_key, conn_r)
                        conn_r.close()
                    except Exception:
                        pass
                return err("ИИ-сервис временно недоступен, энергия возвращена. Попробуйте через минуту.", 503)
            if is_timeout:
                return err("Видео генерируется дольше обычного — проверьте раздел «Мои видео» через пару минут, прежде чем запускать новое.", 504)
            return err(f"Ошибка соединения: {msg}", 502)

        # Провайдер может ответить HTTP 200, но с status='failed' внутри тела
        # (например модерация контента отклонила промпт)
        if result.get("status") == "failed":
            provider_msg = (result.get("error") or {}).get("message", "")
            print(f"[polza.ai video] generation failed: {provider_msg}")
            try:
                conn_j = get_db()
                finish_job_error(job_id, provider_msg or "failed", conn_j)
                conn_j.close()
            except Exception:
                pass
            if not pkg_covered:
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
                conn_j = get_db()
                finish_job_error(job_id, "Сервис не вернул видео", conn_j)
                conn_j.close()
            except Exception:
                pass
            if not pkg_covered:
                try:
                    conn_r = get_db()
                    refund_energy(salon_id, user["id"], cost, tool_key, conn_r)
                    conn_r.close()
                except Exception:
                    pass
            return err("Сервис не вернул видео. Энергия возвращена. Попробуйте ещё раз.", 502)

        try:
            conn3 = get_db()
            finish_job_done(job_id, video_url, conn3)
            conn3.close()
        except Exception as e:
            print(f"[ai-video-gen] history save error: {e}")

        return ok({"video": {"url": video_url}, "energy_spent": cost})

    finally:
        try:
            conn.close()
        except Exception:
            pass