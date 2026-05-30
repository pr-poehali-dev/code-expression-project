"""
ИИ-интервью для кандидатов на вакансию представителя Dok Диалог.
POST ?action=chat   — следующий вопрос / ответ ИИ
POST ?action=finish — финальный анализ, сохранение карточки
GET  ?action=list   — список заявок (только для админов)
GET  ?action=detail&id=N — карточка заявки (только для админов)
"""
import json
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.header import Header
from email.utils import formataddr
import psycopg2
import psycopg2.extras
from openai import OpenAI

FROM_EMAIL = "massopro@mail.ru"
TO_EMAIL = "massopro@mail.ru"

SCORE_LABELS = {
    "communication": "Коммуникация",
    "literacy": "Грамотность речи",
    "motivation": "Мотивация",
    "responsibility": "Ответственность",
    "people_skills": "Работа с людьми",
    "stability": "Эмоциональная устойчивость",
    "fit": "Соответствие проекту",
}

STATUS_LABELS = {
    "recommended": "✅ Рекомендуется к онлайн-собеседованию",
    "review": "🟡 Требуется дополнительная оценка менеджером",
    "declined": "❌ В настоящий момент не готовы продолжить рассмотрение",
}


def send_result_email(applicant: dict, scores: dict, total: int, status: str, comment: str):
    status_label = STATUS_LABELS.get(status, status)
    scores_rows = "".join(
        f"<tr><td style='padding:6px 12px;color:#555;'>{SCORE_LABELS.get(k, k)}</td>"
        f"<td style='padding:6px 12px;font-weight:700;color:#1a1a1a;'>{v}/10</td></tr>"
        for k, v in scores.items()
    )

    html = f"""
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
      <div style="background:#1a1a1a;padding:20px 28px;border-radius:12px 12px 0 0;">
        <div style="font-size:22px;font-weight:700;color:#fff;">Dok Диалог</div>
        <div style="font-size:12px;color:#c9a96e;margin-top:4px;letter-spacing:1px;">НОВАЯ ЗАЯВКА — ВАКАНСИЯ ПРЕДСТАВИТЕЛЯ</div>
      </div>
      <div style="background:#fff;border:1px solid #ede8df;border-top:none;padding:28px;border-radius:0 0 12px 12px;">

        <h2 style="margin:0 0 20px;font-size:18px;color:#1a1a1a;">{applicant.get('full_name', '—')}</h2>

        <table style="border-collapse:collapse;width:100%;margin-bottom:24px;">
          <tr><td style="padding:6px 12px;color:#888;width:40%;">Возраст</td><td style="padding:6px 12px;">{applicant.get('age', '—')}</td></tr>
          <tr style="background:#faf9f6;"><td style="padding:6px 12px;color:#888;">Город</td><td style="padding:6px 12px;">{applicant.get('city', '—')}</td></tr>
          <tr><td style="padding:6px 12px;color:#888;">Телефон</td><td style="padding:6px 12px;"><b>{applicant.get('phone', '—')}</b></td></tr>
          <tr style="background:#faf9f6;"><td style="padding:6px 12px;color:#888;">Telegram</td><td style="padding:6px 12px;">{applicant.get('telegram', '—')}</td></tr>
          <tr><td style="padding:6px 12px;color:#888;">Место работы</td><td style="padding:6px 12px;">{applicant.get('current_job', '—')}</td></tr>
        </table>

        <div style="background:#f5f0e8;border-radius:10px;padding:16px 20px;margin-bottom:24px;">
          <div style="font-size:12px;font-weight:700;color:#a8834a;letter-spacing:1px;margin-bottom:8px;">ИТОГ ОЦЕНКИ ИИ</div>
          <div style="font-size:20px;font-weight:700;color:#1a1a1a;margin-bottom:4px;">{total} / 70 баллов</div>
          <div style="font-size:14px;color:#555;">{status_label}</div>
        </div>

        <table style="border-collapse:collapse;width:100%;margin-bottom:24px;border:1px solid #ede8df;border-radius:10px;overflow:hidden;">
          <tr style="background:#faf9f6;">
            <th style="padding:8px 12px;text-align:left;font-size:12px;color:#888;font-weight:600;">Параметр</th>
            <th style="padding:8px 12px;text-align:left;font-size:12px;color:#888;font-weight:600;">Оценка</th>
          </tr>
          {scores_rows}
        </table>

        {f'<div style="background:#f8f8f8;border-left:3px solid #c9a96e;padding:14px 18px;margin-bottom:24px;border-radius:0 8px 8px 0;font-style:italic;color:#444;font-size:14px;line-height:1.7;">«{comment}»</div>' if comment else ''}

        {f'<div style="margin-bottom:16px;"><div style="font-size:12px;color:#888;margin-bottom:6px;">МОТИВАЦИЯ КАНДИДАТА</div><div style="font-size:14px;color:#444;line-height:1.7;">{applicant.get("motivation", "")}</div></div>' if applicant.get("motivation") else ''}

      </div>
    </div>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = Header(f"Заявка представителя: {applicant.get('full_name', '—')} · {total}/70 баллов", "utf-8")
    msg["From"] = formataddr((str(Header("Dok Диалог", "utf-8")), FROM_EMAIL))
    msg["To"] = TO_EMAIL
    msg.attach(MIMEText(html, "html", "utf-8"))

    smtp_password = os.environ["SMTP_PASSWORD"]
    with smtplib.SMTP_SSL("smtp.mail.ru", 465) as server:
        server.login(FROM_EMAIL, smtp_password)
        server.sendmail(FROM_EMAIL, TO_EMAIL, msg.as_string())

SCHEMA = "t_p84565078_code_expression_proj"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}

INTERVIEW_QUESTIONS = [
    "Расскажите немного о себе и своём опыте общения с людьми.",
    "Почему вас заинтересовал проект Dok Диалог?",
    "Что вам нравится больше: знакомиться с новыми людьми, выстраивать отношения или сопровождать клиентов? Почему?",
    "Представьте, что вы написали руководителю салона, а он не ответил. Что будете делать дальше?",
    "Сколько новых контактов в неделю вы считаете реальным для себя установить?",
    "Если салон отказался от сотрудничества — каковы ваши действия?",
    "Как вы реагируете на критику в свой адрес?",
    'Представьте: вы пришли в салон, администратор говорит "Нам это не интересно." Что вы ответите?',
    "Готовы ли вы ежедневно вести отчётность в системе проекта?",
    "Почему для вас важно соблюдать договорённости?",
]

SYSTEM_INTERVIEW = """Тебя зовут Мария. Ты — деликатный и внимательный HR-ассистент проекта Dok Диалог.
Ты проводишь первичное интервью с кандидаткой на вакансию представителя по работе с салонами красоты.
Всегда представляйся как Мария, когда это уместно (например, в начале интервью).

Правила:
- Задавай ровно один вопрос из списка, соответствующий текущему шагу.
- После ответа кандидата — кратко и тепло отреагируй (1-2 предложения), затем задай следующий вопрос.
- Общайся в дружелюбном, но профессиональном тоне, на «вы».
- Не давай оценок вслух, не критикуй, не хвали чрезмерно.
- Если ответ явно агрессивный, хамский или бессмысленный — вежливо попроси уточнить.
- Не отклоняйся от сценария интервью.
- Отвечай только на русском языке."""

SYSTEM_ANALYSIS = """Ты — опытный HR-аналитик проекта Dok Диалог.
Тебе предоставлены ответы кандидатки на 10 вопросов интервью на вакансию представителя по работе с салонами красоты.

Оцени кандидата по 7 параметрам от 0 до 10 каждый:
1. communication — Коммуникация (ясность, дружелюбность, умение выстраивать диалог)
2. literacy — Грамотность речи (логика, структура, связность ответов)
3. motivation — Мотивация (реальный интерес к проекту и вакансии)
4. responsibility — Ответственность (готовность выполнять обязательства)
5. people_skills — Работа с людьми (умение располагать, выстраивать отношения)
6. stability — Эмоциональная устойчивость (реакция на отказы, критику)
7. fit — Соответствие проекту (ценности, стиль, подход)

ВАЖНО: автоматически снижай оценки при обнаружении агрессии, хамства, нецензурной лексики, токсичного поведения, явного обмана или бессмысленных ответов.

Верни ТОЛЬКО валидный JSON без markdown-блоков:
{
  "scores": {
    "communication": 8,
    "literacy": 7,
    "motivation": 9,
    "responsibility": 7,
    "people_skills": 8,
    "stability": 8,
    "fit": 9
  },
  "total": 56,
  "status": "recommended",
  "comment": "Краткий комментарий на русском языке (2-4 предложения)"
}

Значения status:
- "recommended" — total 60-70
- "review" — total 45-59
- "declined" — total ниже 45"""


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def ok(data, status=200):
    return {"statusCode": status, "headers": CORS, "body": json.dumps(data, ensure_ascii=False, default=str)}


def err(msg, status=400):
    return {"statusCode": status, "headers": CORS, "body": json.dumps({"error": msg}, ensure_ascii=False)}


def require_admin(event):
    session_id = (event.get("headers") or {}).get("X-Session-Id", "")
    if not session_id:
        return None
    conn = get_db()
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"SELECT u.* FROM {SCHEMA}.lk_sessions s JOIN {SCHEMA}.lk_users u ON u.id = s.user_id "
            f"WHERE s.id = %s AND s.expires_at > NOW() AND u.is_active = TRUE AND u.is_admin = TRUE",
            (session_id,)
        )
        return cur.fetchone()
    finally:
        conn.close()


def handle_chat(body):
    """Ведёт диалог интервью: принимает историю сообщений, возвращает следующий ответ ИИ."""
    messages = body.get("messages", [])
    step = body.get("step", 0)

    if step >= len(INTERVIEW_QUESTIONS):
        return ok({"reply": "Спасибо! Все вопросы завершены. Нажмите «Завершить интервью».", "done": True})

    client = OpenAI(
        base_url="https://polza.ai/api/v1",
        api_key=os.environ["OPENAI_API_KEY"],
    )

    system_with_question = SYSTEM_INTERVIEW + f"\n\nТекущий вопрос (шаг {step + 1} из {len(INTERVIEW_QUESTIONS)}): {INTERVIEW_QUESTIONS[step]}"
    if step == 0 and not messages:
        system_with_question += "\n\nЭто первый вопрос — задай его приветственно, представившись кратко как ассистент проекта."

    full_messages = [{"role": "system", "content": system_with_question}] + messages

    completion = client.chat.completions.create(
        model="openai/gpt-4.1-mini",
        messages=full_messages,
        max_tokens=512,
    )
    reply = completion.choices[0].message.content
    next_step = step + 1
    done = next_step >= len(INTERVIEW_QUESTIONS)

    return ok({"reply": reply, "step": next_step, "done": done, "total_questions": len(INTERVIEW_QUESTIONS)})


def handle_finish(body):
    """Финальный анализ + сохранение карточки кандидата."""
    applicant = body.get("applicant", {})
    messages = body.get("messages", [])

    transcript = "\n\n".join(
        f"{'Кандидат' if m['role'] == 'user' else 'Интервьюер'}: {m['content']}"
        for m in messages
    )

    client = OpenAI(
        base_url="https://polza.ai/api/v1",
        api_key=os.environ["OPENAI_API_KEY"],
    )

    completion = client.chat.completions.create(
        model="openai/gpt-4.1-mini",
        messages=[
            {"role": "system", "content": SYSTEM_ANALYSIS},
            {"role": "user", "content": f"Транскрипт интервью:\n\n{transcript}"},
        ],
        max_tokens=800,
    )

    raw = completion.choices[0].message.content.strip()
    raw = raw.replace("```json", "").replace("```", "").strip()
    result = json.loads(raw)

    scores = result.get("scores", {})
    total = result.get("total", sum(scores.values()))
    status = result.get("status", "review")
    comment = result.get("comment", "")

    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute(
            f"INSERT INTO {SCHEMA}.job_applications "
            f"(full_name, age, city, phone, telegram, experience, current_job, motivation, "
            f"interview, scores, total_score, status, ai_comment) "
            f"VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) RETURNING id",
            (
                applicant.get("full_name", ""),
                applicant.get("age", ""),
                applicant.get("city", ""),
                applicant.get("phone", ""),
                applicant.get("telegram", ""),
                applicant.get("experience", ""),
                applicant.get("current_job", ""),
                applicant.get("motivation", ""),
                json.dumps(messages, ensure_ascii=False),
                json.dumps(scores, ensure_ascii=False),
                total,
                status,
                comment,
            )
        )
        app_id = cur.fetchone()[0]
        conn.commit()
    finally:
        conn.close()

    try:
        send_result_email(applicant, scores, total, status, comment)
    except Exception:
        pass

    status_labels = {
        "recommended": "Рекомендуется к онлайн-собеседованию",
        "review": "Требуется дополнительная оценка менеджером",
        "declined": "В настоящий момент мы не готовы продолжить рассмотрение заявки",
    }

    return ok({
        "id": app_id,
        "scores": scores,
        "total": total,
        "status": status,
        "status_label": status_labels.get(status, ""),
        "comment": comment,
    })


def handle_list(event):
    """Список заявок для админа."""
    if not require_admin(event):
        return err("Нет доступа", 403)
    conn = get_db()
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(
            f"SELECT id, full_name, age, city, phone, telegram, total_score, status, ai_comment, created_at "
            f"FROM {SCHEMA}.job_applications ORDER BY created_at DESC LIMIT 200"
        )
        return ok([dict(r) for r in cur.fetchall()])
    finally:
        conn.close()


def handle_detail(event):
    """Детальная карточка заявки для админа."""
    if not require_admin(event):
        return err("Нет доступа", 403)
    app_id = (event.get("queryStringParameters") or {}).get("id")
    if not app_id:
        return err("Не указан id")
    conn = get_db()
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(f"SELECT * FROM {SCHEMA}.job_applications WHERE id = %s", (app_id,))
        row = cur.fetchone()
        if not row:
            return err("Не найдено", 404)
        return ok(dict(row))
    finally:
        conn.close()


def handler(event: dict, context) -> dict:
    """ИИ-интервью для кандидатов на вакансию представителя Dok Диалог."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    qs = event.get("queryStringParameters") or {}
    action = qs.get("action", "")

    if method == "POST":
        body = json.loads(event.get("body") or "{}")
        if action == "chat":
            return handle_chat(body)
        if action == "finish":
            return handle_finish(body)

    if method == "GET":
        if action == "list":
            return handle_list(event)
        if action == "detail":
            return handle_detail(event)

    return err("Not found", 404)