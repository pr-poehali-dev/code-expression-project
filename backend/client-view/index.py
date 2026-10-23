import os
import json
import re
import urllib.request
import psycopg2
import psycopg2.extras

SCHEMA = "t_p84565078_code_expression_proj"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-User-Id, X-Auth-Token, X-Session-Id",
    "Content-Type": "application/json",
}

SUBJECTS = {
    "offer": "услуга или предложение",
    "ad": "реклама или пост",
    "price": "цена и прайс",
    "business": "бизнес целиком",
}
GOALS = {
    "bookings": "больше записей",
    "price_up": "повышение цены",
    "launch": "запуск услуги",
    "idea": "проверка новой идеи",
}
INTERESTS = {"interest", "lack_info", "risk"}


def resp(code: int, data: dict) -> dict:
    return {"statusCode": code, "headers": CORS, "body": json.dumps(data, ensure_ascii=False, default=str)}


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def get_session_user(session_id: str, conn):
    if not session_id:
        return None
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT u.* FROM {SCHEMA}.lk_sessions s JOIN {SCHEMA}.lk_users u ON u.id=s.user_id "
        f"WHERE s.id=%s AND s.expires_at>NOW() AND u.is_active=TRUE", (session_id,)
    )
    return cur.fetchone()


def get_tool_cost(conn, tool_key: str, default: int) -> int:
    cur = conn.cursor()
    cur.execute(f"SELECT energy_cost FROM {SCHEMA}.tool_costs WHERE tool_key=%s", (tool_key,))
    row = cur.fetchone()
    return row[0] if row else default


def get_balance(salon_id, conn) -> int:
    cur = conn.cursor()
    cur.execute(
        f"SELECT COALESCE(SUM(CASE WHEN type='credit' THEN amount ELSE -amount END),0) "
        f"FROM {SCHEMA}.credit_transactions WHERE salon_id=%s", (salon_id,)
    )
    return cur.fetchone()[0]


def deduct(salon_id, user_id, cost, tool_key, title, conn):
    cur = conn.cursor()
    cur.execute(f"UPDATE {SCHEMA}.salons SET credits_balance = credits_balance - %s WHERE id = %s", (cost, salon_id))
    cur.execute(
        f"INSERT INTO {SCHEMA}.credit_transactions (salon_id,user_id,action,amount,tool_key,type) "
        f"VALUES (%s,%s,%s,%s,%s,'debit')", (salon_id, user_id, title, cost, tool_key)
    )
    conn.commit()


def refund(salon_id, user_id, cost, tool_key, conn):
    cur = conn.cursor()
    cur.execute(f"UPDATE {SCHEMA}.salons SET credits_balance = credits_balance + %s WHERE id = %s", (cost, salon_id))
    cur.execute(
        f"INSERT INTO {SCHEMA}.credit_transactions (salon_id,user_id,action,amount,tool_key,type) "
        f"VALUES (%s,%s,%s,%s,%s,'credit')", (salon_id, user_id, "Возврат: ИИ-сервис недоступен", cost, tool_key)
    )
    conn.commit()


def charge(user: dict, tool_key: str, title: str, default_cost: int):
    """Списывает энергию с баланса до вызова ИИ (пакеты не покрывают). Возвращает (cost, error_response)."""
    salon_id = user.get("salon_id")
    if not salon_id:
        return 0, resp(402, {"error": "Заполните профиль салона или специалиста, чтобы пополнить баланс энергии и пользоваться инструментом."})
    conn = get_db()
    try:
        cost = get_tool_cost(conn, tool_key, default_cost)
        balance = get_balance(salon_id, conn)
        if balance < cost:
            return 0, resp(402, {"error": f"Недостаточно энергии. Нужно {cost}, доступно {balance}. Пополните баланс, чтобы продолжить."})
        deduct(salon_id, user["id"], cost, tool_key, title, conn)
        return cost, None
    finally:
        conn.close()


def do_refund(user: dict, cost: int, tool_key: str):
    if not (user.get("salon_id") and cost):
        return
    conn = get_db()
    try:
        refund(user["salon_id"], user["id"], cost, tool_key, conn)
    finally:
        conn.close()


def segment_context(user: dict) -> str:
    spec = user.get("specialization")
    role = user.get("role")
    if spec in ("psychologist", "body_psychologist"):
        return ("Бизнес: частный психолог или телесный психолог. Клиентов беспокоят доверие к специалисту, "
                "страх стигмы, непонятность процесса, цена сессии, неясный результат. Не обещай излечение и гарантированный результат.")
    if spec == "other_specialist":
        return ("Бизнес: частный специалист, работающий с людьми напрямую (репетитор, тренер, фотограф, консультант и т.п.). "
                "Это не бьюти-мастер: не используй бьюти-примеры и слово «салон».")
    if role in ("owner", "admin") or user.get("segment") == "salon":
        return ("Бизнес: салон красоты. Клиентов беспокоят отличие от соседних салонов, цена, интерьер и атмосфера, "
                "квалификация мастеров, удобство записи, повторные визиты.")
    return ("Бизнес: частный мастер красоты или телесных услуг (массаж, маникюр, брови и т.п.). Клиентов беспокоят доверие к мастеру, "
            "понятная ценность, цена, удобная запись и безопасность процедуры.")


ANALYZE_SYSTEM = """Ты — аналитик «Промт Диалог». Ты показываешь владельцу бизнеса его предложение глазами трёх разных условных клиентов.
Это НЕ реальные люди и НЕ измеренные вероятности покупки: это гипотезы, которые нужно проверить на реальных клиентах. Не обещай рост продаж и не называй процентов.
Пиши по-русски, просто, без жаргона, на «ты» обращайся к владельцу. Не придумывай факты о бизнесе, которых нет в материале: если чего-то нет — это и есть сомнение клиента.

Верни ТОЛЬКО валидный JSON без пояснений и без markdown, строго такой структуры:
{
 "clients": [
  {"title": "Клиент № 1. «короткая цитата-мотив»", "tagline": "Условный профиль · кто это и как выбирает", "interest": "interest|lack_info|risk",
   "thought": "прямая речь клиента в кавычках, 1-2 предложения", "attracts": ["..."], "doubts": ["..."], "check": "что стоит проверить или изменить"}
 ],
 "barriers": [{"title": "краткая формулировка", "text": "1-2 предложения"}],
 "variants": [{"label": "А", "title": "Акцент на ...", "text": "что конкретно изменить"}],
 "reality_check": "1-2 предложения: какие вопросы задать настоящим клиентам или какой маленький тест провести",
 "comparison": null
}
Требования: ровно 3 клиента с РАЗНЫМИ мотивами выбора (например: доверие / время и удобство / сравнение цен — подбери под бизнес). interest: interest = потенциальный интерес, lack_info = недостаточно информации, risk = высокий риск отказа.
У каждого клиента 1-3 пункта в attracts и 1-3 в doubts. Ровно 3 барьера и 3 варианта (метки А, Б, В). Варианты — гипотезы для проверки, а не доказанные решения; без гарантий результата."""

COMPARE_ADDON = """

Это ПОВТОРНАЯ проверка исправленной версии. Ниже дана предыдущая версия и её барьеры. В поле comparison верни объект:
{"summary": "1-2 предложения, что изменилось в восприятии", "per_client": [{"title": "имя профиля", "shift": "better|same|worse", "text": "1 предложение"}]}
Сравнивай честно: если ничего существенного не улучшилось, так и скажи."""


def extract_json(text: str) -> dict:
    text = text.strip()
    text = re.sub(r"^```(?:json)?", "", text).strip()
    text = re.sub(r"```$", "", text).strip()
    start, end = text.find("{"), text.rfind("}")
    if start == -1 or end == -1:
        raise ValueError("no json")
    return json.loads(text[start:end + 1])


def call_llm(system: str, user_prompt: str, max_tokens: int, temperature: float = 0.7) -> str:
    api_key = os.environ.get("OPENAI_API_KEY", "")
    payload = json.dumps({
        "model": "openai/gpt-4o-mini",
        "messages": [{"role": "system", "content": system}, {"role": "user", "content": user_prompt}],
        "max_tokens": max_tokens, "temperature": temperature,
    }).encode("utf-8")
    req = urllib.request.Request(
        "https://polza.ai/api/v1/chat/completions", data=payload,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"}, method="POST",
    )
    with urllib.request.urlopen(req, timeout=55) as r:
        return json.loads(r.read().decode("utf-8"))["choices"][0]["message"]["content"].strip()


def normalize_result(data: dict) -> dict:
    clients = []
    for c in (data.get("clients") or [])[:3]:
        interest = c.get("interest") if c.get("interest") in INTERESTS else "lack_info"
        clients.append({
            "title": str(c.get("title", "Клиент"))[:160],
            "tagline": str(c.get("tagline", ""))[:200],
            "interest": interest,
            "thought": str(c.get("thought", ""))[:500],
            "attracts": [str(x)[:240] for x in (c.get("attracts") or [])[:3]],
            "doubts": [str(x)[:240] for x in (c.get("doubts") or [])[:3]],
            "check": str(c.get("check", ""))[:500],
        })
    barriers = [{"title": str(b.get("title", ""))[:160], "text": str(b.get("text", ""))[:500]} for b in (data.get("barriers") or [])[:3]]
    variants = []
    for i, v in enumerate((data.get("variants") or [])[:3]):
        variants.append({"label": str(v.get("label") or "АБВ"[i])[:2], "title": str(v.get("title", ""))[:160], "text": str(v.get("text", ""))[:600]})
    comparison = data.get("comparison")
    if isinstance(comparison, dict):
        comparison = {
            "summary": str(comparison.get("summary", ""))[:500],
            "per_client": [
                {"title": str(p.get("title", ""))[:160],
                 "shift": p.get("shift") if p.get("shift") in ("better", "same", "worse") else "same",
                 "text": str(p.get("text", ""))[:300]}
                for p in (comparison.get("per_client") or [])[:3]
            ],
        }
    else:
        comparison = None
    return {
        "clients": clients, "barriers": barriers, "variants": variants,
        "reality_check": str(data.get("reality_check", ""))[:600], "comparison": comparison,
    }


def row_summary(r: dict) -> dict:
    return {
        "id": r["id"], "parent_id": r["parent_id"], "subject": r["subject"], "goal": r["goal"],
        "material": (r["material"] or "")[:140], "created_at": r["created_at"],
        "has_result": bool(r.get("result")),
    }


def handle_analyze(user: dict, data: dict) -> dict:
    subject = data.get("subject")
    goal = data.get("goal")
    material = (data.get("material") or "").strip()
    if subject not in SUBJECTS or goal not in GOALS:
        return resp(400, {"error": "Выбери, что анализировать, и цель проверки"})
    if len(material) < 20:
        return resp(400, {"error": "Добавь описание, текст или прайс — хотя бы пару предложений"})
    if len(material) > 6000:
        return resp(400, {"error": "Текст слишком длинный — сократи до 6000 символов"})
    city = (data.get("city") or "").strip()[:120]
    audience = (data.get("audience") or "").strip()[:500]
    parent_id = data.get("parent_id")

    parent = None
    if parent_id:
        conn = get_db()
        try:
            cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            cur.execute(f"SELECT * FROM {SCHEMA}.client_view_tests WHERE id=%s AND user_id=%s", (int(parent_id), user["id"]))
            parent = cur.fetchone()
        finally:
            conn.close()

    cost, err = charge(user, "client_view", "Покажи глазами клиента", 2)
    if err:
        return err

    lines = [
        segment_context(user),
        f"Что анализируем: {SUBJECTS[subject]}",
        f"Цель владельца: {GOALS[goal]}",
        f"Город: {city or 'не указан'}",
        f"Для кого предложение: {audience or 'не указано'}",
        "",
        "Материал владельца:",
        material,
    ]
    system = ANALYZE_SYSTEM
    if parent and parent.get("result"):
        prev = parent["result"]
        lines += ["", "ПРЕДЫДУЩАЯ ВЕРСИЯ:", parent["material"][:3000], "", "Барьеры предыдущей версии: " +
                  "; ".join(b.get("title", "") for b in prev.get("barriers", []))]
        system += COMPARE_ADDON
    try:
        raw = call_llm(system, "\n".join(lines), 2200)
        result = normalize_result(extract_json(raw))
        if len(result["clients"]) < 3:
            raise ValueError("bad structure")
    except Exception:
        do_refund(user, cost, "client_view")
        return resp(503, {"error": "Не удалось получить разбор, энергия возвращена. Попробуй ещё раз через минуту."})

    conn = get_db()
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"INSERT INTO {SCHEMA}.client_view_tests (user_id,parent_id,subject,goal,segment_label,city,audience,material,result) "
            f"VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id, created_at",
            (user["id"], parent["id"] if parent else None, subject, goal, user.get("specialization") or user.get("role"),
             city or None, audience or None, material, json.dumps(result, ensure_ascii=False))
        )
        row = cur.fetchone()
        conn.commit()
    finally:
        conn.close()
    return resp(200, {"id": row["id"], "created_at": row["created_at"], "subject": subject, "goal": goal,
                      "material": material, "parent_id": parent["id"] if parent else None,
                      "result": result, "chat": [], "reality_note": None})


def handle_ask(user: dict, data: dict) -> dict:
    try:
        test_id = int(data.get("test_id"))
        idx = int(data.get("client_index"))
    except Exception:
        return resp(400, {"error": "Не выбран клиент"})
    question = (data.get("question") or "").strip()
    if len(question) < 3:
        return resp(400, {"error": "Напиши вопрос клиенту"})
    if len(question) > 400:
        return resp(400, {"error": "Вопрос слишком длинный — сократи до 400 символов"})

    conn = get_db()
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(f"SELECT * FROM {SCHEMA}.client_view_tests WHERE id=%s AND user_id=%s", (test_id, user["id"]))
        test = cur.fetchone()
    finally:
        conn.close()
    if not test or not test.get("result"):
        return resp(404, {"error": "Проверка не найдена"})
    clients = test["result"].get("clients", [])
    if idx < 0 or idx >= len(clients):
        return resp(400, {"error": "Не выбран клиент"})
    c = clients[idx]

    cost, err = charge(user, "client_view_ask", "Покажи глазами клиента: вопрос клиенту", 2)
    if err:
        return err

    system = (
        "Ты играешь условного клиента из симуляции. Это не реальный человек: отвечай как гипотеза о том, как мог бы думать такой клиент. "
        "Отвечай от первого лица, по-русски, живо и честно, 2-4 предложения. Опирайся ТОЛЬКО на материал и профиль, не выдумывай факты о бизнесе. "
        "Не обещай, что купишь, и не называй процентов. В конце можно одним предложением назвать, что именно тебя бы убедило.\n"
        f"Твой профиль: {c['title']}. {c['tagline']}. Твои сомнения: {'; '.join(c['doubts'])}. Что привлекает: {'; '.join(c['attracts'])}."
    )
    history = (test.get("chat") or [])
    mine = [h for h in history if h.get("client_index") == idx][-4:]
    prompt = [segment_context(user), "", "Предложение владельца:", test["material"][:3000], ""]
    for h in mine:
        prompt += [f"Вопрос владельца: {h['question']}", f"Твой ответ: {h['answer']}"]
    prompt += [f"Новый вопрос владельца: {question}"]
    try:
        answer = call_llm(system, "\n".join(prompt), 450, 0.8)
    except Exception:
        do_refund(user, cost, "client_view_ask")
        return resp(503, {"error": "Клиент не ответил, энергия возвращена. Попробуй ещё раз."})

    entry = {"client_index": idx, "question": question, "answer": answer}
    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute(
            f"UPDATE {SCHEMA}.client_view_tests SET chat = COALESCE(chat,'[]'::jsonb) || %s::jsonb WHERE id=%s AND user_id=%s",
            (json.dumps([entry], ensure_ascii=False), test_id, user["id"])
        )
        conn.commit()
    finally:
        conn.close()
    return resp(200, entry)


def handle_list(user: dict) -> dict:
    conn = get_db()
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"SELECT id,parent_id,subject,goal,material,result,created_at FROM {SCHEMA}.client_view_tests "
            f"WHERE user_id=%s ORDER BY created_at DESC LIMIT 30", (user["id"],)
        )
        rows = cur.fetchall()
    finally:
        conn.close()
    return resp(200, {"items": [row_summary(r) for r in rows]})


def handle_get(user: dict, test_id: str) -> dict:
    conn = get_db()
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"SELECT id,parent_id,subject,goal,material,result,chat,reality_note,created_at FROM {SCHEMA}.client_view_tests "
            f"WHERE id=%s AND user_id=%s", (int(test_id), user["id"])
        )
        row = cur.fetchone()
    finally:
        conn.close()
    if not row:
        return resp(404, {"error": "Проверка не найдена"})
    return resp(200, row)


def handle_note(user: dict, data: dict) -> dict:
    try:
        test_id = int(data.get("test_id"))
    except Exception:
        return resp(400, {"error": "Не выбрана проверка"})
    note = (data.get("note") or "").strip()[:2000]
    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute(f"UPDATE {SCHEMA}.client_view_tests SET reality_note=%s WHERE id=%s AND user_id=%s",
                    (note or None, test_id, user["id"]))
        conn.commit()
    finally:
        conn.close()
    return resp(200, {"ok": True})


def handler(event: dict, context) -> dict:
    """Инструмент «Покажи глазами клиента»: анализ предложения тремя условными клиентами, диалог с ними, история и заметка о проверке на реальных клиентах."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    qs = event.get("queryStringParameters") or {}
    action = qs.get("action", "")
    session_id = (event.get("headers") or {}).get("X-Session-Id", "")

    conn = get_db()
    try:
        user = get_session_user(session_id, conn)
    finally:
        conn.close()
    if not user:
        return resp(401, {"error": "Нужно войти в кабинет"})

    method = event.get("httpMethod")
    if method == "GET":
        if action == "list":
            return handle_list(user)
        if action == "get" and qs.get("id"):
            return handle_get(user, qs["id"])
        return resp(400, {"error": "unknown action"})

    try:
        data = json.loads(event.get("body") or "{}")
    except Exception:
        return resp(400, {"error": "invalid json"})

    if action == "analyze":
        return handle_analyze(user, data)
    if action == "ask":
        return handle_ask(user, data)
    if action == "note":
        return handle_note(user, data)
    return resp(400, {"error": "unknown action"})
