"""
AI-оценка специалиста (массажист/body-мастер) для работы в премиальном сегменте.
POST ?action=chat   — следующий вопрос / ответ ИИ
POST ?action=finish — финальный анализ + отправка письма
"""
import json
import os
import smtplib
from datetime import datetime
from email.header import Header
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import formataddr

from openai import OpenAI

FROM_EMAIL = "massopro@mail.ru"
TO_EMAIL = "massopro@mail.ru"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}

TOTAL_QUESTIONS = 15

INTERVIEW_QUESTIONS = [
    # Блок 1 — Знакомство
    "Расскажите немного о себе и своей практике.",
    "Сколько лет вы работаете с клиентами?",
    "Почему решили работать именно с телом?",
    # Блок 2 — Работа с клиентами
    "Почему клиент возвращается к одному специалисту и не возвращается к другому?",
    "Что для вас важнее: техника, доверие клиента, результат или долгосрочные отношения? Объясните почему.",
    "Как вы понимаете, что клиент вам доверяет?",
    # Блок 3 — Отношение к обучению
    "Когда вы проходили последнее обучение?",
    "Какие навыки вы хотите развить в ближайший год?",
    "Готовы ли вы инвестировать в своё профессиональное развитие? Почему?",
    # Блок 4 — Работа с премиальной аудиторией
    "Чем отличается работа с платежеспособным клиентом?",
    "Почему некоторые специалисты боятся повышать стоимость услуг?",
    "Как вы относитесь к тому, что стоимость приёма может составлять значительно выше средней по рынку?",
    # Блок 5 — Рост специалиста
    "Что сегодня мешает вам зарабатывать больше?",
    "Что вы готовы изменить ради профессионального роста?",
    "Если вам показать систему, которая помогает повысить уровень специалиста и увеличить доход, готовы ли вы пройти обучение? Почему?",
]

SYSTEM_INTERVIEW = """Тебя зовут Мария. Ты — внимательный и тактичный ассистент проекта «Dok Диалог».
Ты проводишь профессиональное интервью-оценку специалиста в сфере массажа и работы с телом.

Правила:
- Задавай ровно один вопрос, соответствующий текущему шагу. Не меняй формулировку вопроса.
- После ответа специалиста — кратко и тепло отреагируй (1–2 предложения), затем задай следующий вопрос.
- Общайся уважительно, на «вы», профессиональный тон без излишней официальности.
- Не давай оценок вслух, не критикуй, не хвали чрезмерно.
- Если ответ явно бессмысленный — вежливо попроси уточнить.
- Не отклоняйся от сценария. Отвечай только на русском языке."""

SYSTEM_ANALYSIS = """Ты — опытный HR-аналитик проекта «Dok Диалог».
Перед тобой расшифровка профессионального интервью специалиста (массажист, body-мастер).

Оцени специалиста по 7 параметрам от 0 до 10:
1. communication — Коммуникация (ясность, способность формулировать мысли)
2. literacy — Грамотность речи (логика, структура, связность)
3. awareness — Осознанность (глубина понимания своей профессии и клиентов)
4. learning_readiness — Готовность обучаться (открытость к развитию, инвестиции в себя)
5. client_orientation — Клиентоориентированность (понимание сервиса, психологии клиента)
6. growth_potential — Потенциал роста (готовность меняться ради результата)
7. philosophy_fit — Соответствие философии Dok Диалог (ценности, отношение к премиальному сегменту)

ВАЖНО: снижай оценки при агрессии, хамстве, явном нежелании развиваться или ограничивающих убеждениях.

Верни ТОЛЬКО валидный JSON без markdown:
{
  "scores": {
    "communication": 8,
    "literacy": 7,
    "awareness": 9,
    "learning_readiness": 8,
    "client_orientation": 8,
    "growth_potential": 7,
    "philosophy_fit": 9
  },
  "total": 56,
  "status": "recommended",
  "comment": "Краткий комментарий аналитика (2–4 предложения)"
}

Значения status:
- "recommended" — total 60–70 (Перспективный специалист)
- "review" — total 45–59 (Хороший потенциал)
- "declined" — total ниже 45 (Требуется развитие)"""

SCORE_LABELS = {
    "communication": "Коммуникация",
    "literacy": "Грамотность речи",
    "awareness": "Осознанность",
    "learning_readiness": "Готовность обучаться",
    "client_orientation": "Клиентоориентированность",
    "growth_potential": "Потенциал роста",
    "philosophy_fit": "Соответствие философии Dok Диалог",
}

STATUS_LABELS = {
    "recommended": "⭐ Перспективный специалист (60–70 баллов)",
    "review": "🟡 Хороший потенциал (45–59 баллов)",
    "declined": "🔵 Требуется развитие (менее 45 баллов)",
}


def send_result_email(applicant: dict, scores: dict, total: int, status: str, comment: str):
    status_label = STATUS_LABELS.get(status, status)
    scores_rows = "".join(
        f"<tr><td style='padding:7px 14px;color:#555;border-bottom:1px solid #f0ebe2;'>{SCORE_LABELS.get(k, k)}</td>"
        f"<td style='padding:7px 14px;font-weight:700;color:#1a1a1a;border-bottom:1px solid #f0ebe2;text-align:right;'>{v}/10</td></tr>"
        for k, v in scores.items()
    )
    now = datetime.now().strftime("%d.%m.%Y %H:%M")
    html = f"""
    <div style="font-family:Arial,sans-serif;max-width:620px;margin:0 auto;background:#f5f0e8;">
      <div style="background:#1a1a1a;padding:22px 32px;border-radius:14px 14px 0 0;">
        <div style="font-size:22px;font-weight:700;color:#fff;letter-spacing:0.5px;">Dok Диалог</div>
        <div style="font-size:11px;color:#c9a96e;margin-top:4px;letter-spacing:1.5px;text-transform:uppercase;">Оценка специалиста · Массаж и работа с телом</div>
      </div>
      <div style="background:#fff;border:1px solid #ede8df;border-top:none;padding:32px;border-radius:0 0 14px 14px;">

        <h2 style="margin:0 0 4px;font-size:20px;color:#1a1a1a;">{applicant.get('full_name', '—')}</h2>
        <div style="font-size:12px;color:#aaa;margin-bottom:24px;">{now}</div>

        <table style="border-collapse:collapse;width:100%;margin-bottom:24px;border:1px solid #ede8df;border-radius:8px;overflow:hidden;">
          <tr style="background:#faf9f6;"><td style="padding:7px 14px;color:#888;width:42%;">Телефон</td><td style="padding:7px 14px;font-weight:700;">{applicant.get('phone', '—')}</td></tr>
          <tr><td style="padding:7px 14px;color:#888;">Telegram</td><td style="padding:7px 14px;">{applicant.get('telegram', '—')}</td></tr>
          <tr style="background:#faf9f6;"><td style="padding:7px 14px;color:#888;">Город</td><td style="padding:7px 14px;">{applicant.get('city', '—')}</td></tr>
          <tr><td style="padding:7px 14px;color:#888;">Опыт</td><td style="padding:7px 14px;">{applicant.get('experience', '—')}</td></tr>
        </table>

        <div style="background:#f5f0e8;border-radius:12px;padding:18px 22px;margin-bottom:24px;">
          <div style="font-size:11px;font-weight:700;color:#a8834a;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:8px;">Итог оценки ИИ</div>
          <div style="font-size:28px;font-weight:700;color:#1a1a1a;margin-bottom:4px;">{total} <span style="font-size:16px;color:#888;">/ 70 баллов</span></div>
          <div style="font-size:14px;color:#555;font-weight:600;">{status_label}</div>
        </div>

        <table style="border-collapse:collapse;width:100%;margin-bottom:24px;border:1px solid #ede8df;border-radius:8px;overflow:hidden;">
          <tr style="background:#faf9f6;">
            <th style="padding:8px 14px;text-align:left;font-size:11px;color:#888;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Параметр</th>
            <th style="padding:8px 14px;text-align:right;font-size:11px;color:#888;font-weight:700;letter-spacing:1px;text-transform:uppercase;">Оценка</th>
          </tr>
          {scores_rows}
        </table>

        {('<div style="background:#fffbe8;border-left:3px solid #c9a96e;padding:14px 18px;margin-bottom:24px;border-radius:0 8px 8px 0;font-style:italic;color:#444;font-size:14px;line-height:1.7;">«' + comment + '»</div>') if comment else ''}

      </div>
    </div>
    """
    msg = MIMEMultipart("alternative")
    msg["Subject"] = Header(f"Оценка специалиста: {applicant.get('full_name', '—')} · {total}/70 баллов", "utf-8")
    msg["From"] = formataddr((str(Header("Dok Диалог", "utf-8")), FROM_EMAIL))
    msg["To"] = TO_EMAIL
    msg.attach(MIMEText(html, "html", "utf-8"))
    smtp_password = os.environ["SMTP_PASSWORD"]
    with smtplib.SMTP_SSL("smtp.mail.ru", 465) as server:
        server.login(FROM_EMAIL, smtp_password)
        server.sendmail(FROM_EMAIL, TO_EMAIL, msg.as_string())


def ok(data, status=200):
    return {"statusCode": status, "headers": CORS, "body": json.dumps(data, ensure_ascii=False, default=str)}


def err(msg, status=400):
    return {"statusCode": status, "headers": CORS, "body": json.dumps({"error": msg}, ensure_ascii=False)}


def handle_chat(body: dict) -> dict:
    """Ведёт диалог оценочного интервью."""
    messages = body.get("messages", [])
    step = body.get("step", 0)

    if step >= TOTAL_QUESTIONS:
        return ok({"reply": "Спасибо! Вы ответили на все вопросы. Нажмите «Завершить» для получения результата.", "done": True})

    client = OpenAI(base_url="https://polza.ai/api/v1", api_key=os.environ["OPENAI_API_KEY"])
    system = SYSTEM_INTERVIEW + f"\n\nТекущий вопрос (шаг {step + 1} из {TOTAL_QUESTIONS}): {INTERVIEW_QUESTIONS[step]}"
    if step == 0 and not messages:
        system += "\n\nЭто первое сообщение — представься как Мария, кратко объясни, что ты будешь проводить профессиональное интервью, и сразу задай первый вопрос."

    api_messages = [{"role": "system", "content": system}]
    for m in messages[-20:]:
        api_messages.append({"role": m["role"], "content": m["content"]})

    resp = client.chat.completions.create(model="gpt-4o-mini", messages=api_messages, max_tokens=400, temperature=0.7)
    reply = resp.choices[0].message.content.strip()
    next_step = step + 1 if messages else step
    done = next_step >= TOTAL_QUESTIONS
    return ok({"reply": reply, "step": next_step, "done": done})


def handle_finish(body: dict) -> dict:
    """Анализирует ответы, формирует оценку, отправляет письмо."""
    applicant = body.get("applicant", {})
    messages = body.get("messages", [])

    transcript = "\n".join(
        f"{'Ассистент' if m['role'] == 'assistant' else 'Специалист'}: {m['content']}"
        for m in messages
    )

    client = OpenAI(base_url="https://polza.ai/api/v1", api_key=os.environ["OPENAI_API_KEY"])
    analysis_messages = [
        {"role": "system", "content": SYSTEM_ANALYSIS},
        {"role": "user", "content": f"Расшифровка интервью:\n\n{transcript}"},
    ]
    resp = client.chat.completions.create(model="gpt-4o-mini", messages=analysis_messages, max_tokens=600, temperature=0.3)
    raw = resp.choices[0].message.content.strip()

    # Извлекаем JSON
    start = raw.find("{")
    end = raw.rfind("}") + 1
    result = json.loads(raw[start:end])

    scores = result.get("scores", {})
    total = result.get("total", sum(scores.values()))
    status = result.get("status", "declined")
    comment = result.get("comment", "")

    send_result_email(applicant, scores, total, status, comment)
    return ok({"scores": scores, "total": total, "status": status, "comment": comment})


def handler(event: dict, context) -> dict:
    """Оценочное AI-интервью для специалистов массажа и работы с телом."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    action = (event.get("queryStringParameters") or {}).get("action", "")
    body = {}
    if event.get("body"):
        body = json.loads(event["body"])

    if action == "chat":
        return handle_chat(body)
    if action == "finish":
        return handle_finish(body)
    return err("Unknown action", 400)