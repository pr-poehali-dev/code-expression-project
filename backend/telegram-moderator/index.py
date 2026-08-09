"""
Модерация и ИИ-ответы бота в группе обсуждений (комментарии) Telegram-канала «Промт Диалог».
POST /  (Telegram webhook, заголовок X-Telegram-Bot-Api-Secret-Token=TELEGRAM_WEBHOOK_SECRET)
    — обрабатывает входящее сообщение из группы:
      1) явный спам/мат/ссылки/нерелевантные фото и видео — удаляет сообщение;
         при первом нарушении — предупреждение, при повторном — бан участника в группе;
      2) если сообщение — вопрос или обращение к боту, бот коротко и по делу отвечает (не более 2 фраз);
      3) обычные комментарии без вопроса/нарушения — бот не отвечает.
GET/POST ?action=set_webhook&key=ADMIN_TOKEN&url=<URL этой функции> — регистрирует вебхук в Telegram.
GET ?action=webhook_info&key=ADMIN_TOKEN — текущая информация о вебхуке (для диагностики).
"""
import base64
import json
import os
import re
import urllib.error
import urllib.request
import psycopg2
import psycopg2.extras

SCHEMA = "t_p84565078_code_expression_proj"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Internal-Key, X-Telegram-Bot-Api-Secret-Token",
}

MODERATION_MODEL = "openai/gpt-4o-mini"
AI_URL = "https://polza.ai/api/v1/chat/completions"

# ── Быстрые фильтры (без ИИ) ────────────────────────────────────────────────

_LETTER_MAP = str.maketrans({
    "0": "о", "1": "i", "3": "е", "4": "ч", "@": "a", "$": "s",
    "!": "i", "|": "l",
})

_PROFANITY_STEMS = [
    "хуй", "хуе", "хуя", "хуё", "пизд", "ебат", "ебал", "ебан", "ебуч",
    "ёбан", "заеб", "наеб", "объеб", "разъеб", "выеб", "уеб", "еблан",
    "бляд", "мудак", "мудил", "мудоз", "гондон", "гандон", "долбоеб",
    "долбаеб", "залуп", "пидор", "пидар", "пидр", "сучар", "уебищ",
    "хуило", "хуила",
]

_SPAM_MARKERS = [
    "заработ", "подпишись", "подписывайся", "переходи по ссылк", "накрутк",
    "casino", "казино", "ставки на спорт", "crypto", "криптовалют",
    "инвестици", "продвижение канала", "работа на дому", "1xbet",
    "заработай", "пассивный доход", "airdrop",
]


def _normalize(text: str) -> str:
    text = text.lower().translate(_LETTER_MAP)
    text = re.sub(r"[^a-zа-яё0-9\s]", "", text)
    text = re.sub(r"(.)\1{2,}", r"\1\1", text)
    return text


def has_profanity(text: str) -> bool:
    norm = _normalize(text)
    return any(stem in norm for stem in _PROFANITY_STEMS)


def has_spam_marker(text: str) -> bool:
    norm = _normalize(text)
    return any(marker in norm for marker in _SPAM_MARKERS)


_URL_RE = re.compile(
    r"(https?://|www\.|t\.me/|telegram\.me/)|"
    r"\b[a-zа-я0-9-]+\.(ru|com|net|org|рф|io|shop|store|xyz|site|online|biz|info)\b",
    re.IGNORECASE,
)


def has_link(text: str, entities: list) -> bool:
    for e in entities or []:
        if e.get("type") in ("url", "text_link", "mention"):
            return True
    return bool(_URL_RE.search(text or ""))


# ── Telegram API ─────────────────────────────────────────────────────────────

def tg_call(method: str, payload: dict, timeout: int = 15) -> dict | None:
    bot_token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
    if not bot_token:
        return None
    req = urllib.request.Request(
        f"https://api.telegram.org/bot{bot_token}/{method}",
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        print(f"[tg_moderator] {method} HTTPError {e.code}: {e.read().decode('utf-8', 'ignore')}")
        return None
    except (urllib.error.URLError, TimeoutError, json.JSONDecodeError) as e:
        print(f"[tg_moderator] {method} failed: {type(e).__name__}: {e}")
        return None


def tg_delete_message(chat_id: int, message_id: int) -> None:
    tg_call("deleteMessage", {"chat_id": chat_id, "message_id": message_id}, timeout=10)


def tg_ban_user(chat_id: int, user_id: int) -> None:
    tg_call("banChatMember", {"chat_id": chat_id, "user_id": user_id, "revoke_messages": False}, timeout=10)


def tg_send_message(chat_id: int, text: str, reply_to_message_id: int | None = None,
                     thread_id: int | None = None) -> None:
    payload = {"chat_id": chat_id, "text": text, "parse_mode": "HTML"}
    if reply_to_message_id:
        payload["reply_parameters"] = {"message_id": reply_to_message_id, "allow_sending_without_reply": True}
    if thread_id:
        payload["message_thread_id"] = thread_id
    tg_call("sendMessage", payload, timeout=15)


def tg_download_file_as_data_url(file_id: str) -> str | None:
    """Скачивает фото из Telegram и возвращает data:image/jpeg;base64,... для vision-запроса."""
    info = tg_call("getFile", {"file_id": file_id}, timeout=10)
    if not info or not info.get("ok"):
        return None
    file_path = info["result"].get("file_path")
    if not file_path:
        return None
    bot_token = os.environ.get("TELEGRAM_BOT_TOKEN", "")
    try:
        with urllib.request.urlopen(
            f"https://api.telegram.org/file/bot{bot_token}/{file_path}", timeout=15
        ) as resp:
            raw = resp.read()
        b64 = base64.b64encode(raw).decode("ascii")
        return f"data:image/jpeg;base64,{b64}"
    except (urllib.error.URLError, TimeoutError) as e:
        print(f"[tg_moderator] file download failed: {e}")
        return None


# ── ИИ: модерация текста + короткий ответ, если это вопрос к боту ───────────

TEXT_SYSTEM_PROMPT = """Ты — модератор и короткий помощник в группе обсуждений Telegram-канала бьюти-платформы \
«Промт Диалог» (промтдиалог.рф — инструменты и обучение для мастеров и салонов красоты).

Оцени сообщение пользователя из комментариев и верни СТРОГО JSON без markdown:
{
  "violation": true/false,
  "reason": "spam" | "rude" | "offtopic_ad" | null,
  "reply": "короткий ответ (1-2 предложения)" | null
}

Правила:
- violation=true, если сообщение — оскорбление, токсичность, грубость, скрытая реклама/спам постороннего \
бизнеса, флуд бессмысленными символами. Матерные слова уже отфильтрованы раньше, ищи именно грубость и спам.
- Обычные эмоциональные, но не оскорбительные комментарии — НЕ нарушение.
- reply заполняй ТОЛЬКО если сообщение — явный вопрос или прямое обращение к боту/администрации \
(например "а сколько стоит", "бот, подскажи", "как записаться", "работает ли для мастеров маникюра").
- Если это просто комментарий/мнение/благодарность без вопроса — reply=null, даже если оно позитивное.
- Ответ пиши дружелюбно, по-русски, на "вы", без канцелярита, максимум 2 коротких предложения, без ссылок.
- Если не уверен в ответе на вопрос — reply можно оставить null."""


def classify_text(text: str) -> dict:
    api_key = os.environ.get("OPENAI_API_KEY", "")
    if not api_key or not text.strip():
        return {"violation": False, "reason": None, "reply": None}

    payload = json.dumps({
        "model": MODERATION_MODEL,
        "messages": [
            {"role": "system", "content": TEXT_SYSTEM_PROMPT},
            {"role": "user", "content": text[:2000]},
        ],
        "temperature": 0.3,
        "max_tokens": 300,
    }).encode("utf-8")

    req = urllib.request.Request(
        AI_URL, data=payload,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        content = data["choices"][0]["message"]["content"].strip()
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        return json.loads(content)
    except (urllib.error.URLError, TimeoutError, KeyError, ValueError, json.JSONDecodeError) as e:
        print(f"[tg_moderator] classify_text failed: {type(e).__name__}: {e}")
        return {"violation": False, "reason": None, "reply": None}


IMAGE_SYSTEM_PROMPT = """Ты — модератор фото/видео в группе обсуждений бьюти-канала «Промт Диалог» \
(мастера и салоны красоты). Посмотри на изображение и оцени, уместно ли оно в контексте обсуждения услуг \
красоты, работ мастеров, вопросов по платформе, отзывов или общения по теме салона/бьюти-индустрии.
Верни СТРОГО JSON без markdown: {"on_topic": true/false, "reason": "коротко почему, если не по теме"}
Нерелевантным считай: рекламу постороннего бизнеса, обнажённый/шокирующий контент, мемы и картинки \
никак не связанные с бьюти-темой или платформой. Фото причёсок, работ мастера, до/после, интерьера \
салона, скриншотов платформы — это ПО ТЕМЕ (on_topic=true)."""


def classify_image(data_url: str) -> dict:
    api_key = os.environ.get("OPENAI_API_KEY", "")
    if not api_key:
        return {"on_topic": True, "reason": None}

    payload = json.dumps({
        "model": MODERATION_MODEL,
        "messages": [
            {"role": "system", "content": IMAGE_SYSTEM_PROMPT},
            {"role": "user", "content": [
                {"type": "text", "text": "Оцени это изображение."},
                {"type": "image_url", "image_url": {"url": data_url}},
            ]},
        ],
        "temperature": 0.2,
        "max_tokens": 200,
    }).encode("utf-8")

    req = urllib.request.Request(
        AI_URL, data=payload,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        content = data["choices"][0]["message"]["content"].strip()
        if content.startswith("```"):
            content = content.split("```")[1]
            if content.startswith("json"):
                content = content[4:]
        return json.loads(content)
    except (urllib.error.URLError, TimeoutError, KeyError, ValueError, json.JSONDecodeError) as e:
        print(f"[tg_moderator] classify_image failed: {type(e).__name__}: {e}")
        return {"on_topic": True, "reason": None}


# ── Предупреждения / баны в БД ──────────────────────────────────────────────

def register_violation(conn, chat_id: int, user_id: int, reason: str) -> int:
    """Увеличивает счётчик предупреждений пользователя в чате, возвращает новое значение."""
    cur = conn.cursor()
    cur.execute(
        f"""INSERT INTO {SCHEMA}.telegram_warnings (chat_id, user_id, warning_count, last_reason, last_violation_at)
            VALUES (%s, %s, 1, %s, NOW())
            ON CONFLICT (chat_id, user_id) DO UPDATE
            SET warning_count = {SCHEMA}.telegram_warnings.warning_count + 1,
                last_reason = EXCLUDED.last_reason,
                last_violation_at = NOW()
            RETURNING warning_count""",
        (chat_id, user_id, reason)
    )
    count = cur.fetchone()[0]
    conn.commit()
    return count


# ── Обработка одного сообщения ──────────────────────────────────────────────

REASON_LABELS = {
    "profanity": "нецензурная лексика",
    "link": "ссылки/реклама",
    "spam": "спам",
    "rude": "грубость",
    "offtopic_ad": "реклама постороннего",
    "offtopic_media": "фото/видео не по теме",
}


def process_message(conn, message: dict) -> None:
    chat = message.get("chat") or {}
    chat_id = chat.get("id")
    from_user = message.get("from") or {}
    if not chat_id or from_user.get("is_bot"):
        return
    if chat.get("type") not in ("group", "supergroup"):
        return

    user_id = from_user.get("id")
    first_name = from_user.get("first_name") or "Гость"
    message_id = message.get("message_id")
    thread_id = message.get("message_thread_id")
    text = message.get("text") or message.get("caption") or ""
    entities = message.get("entities") or message.get("caption_entities") or []

    photos = message.get("photo") or []
    video = message.get("video")
    animation = message.get("animation")
    has_media = bool(photos or video or animation)

    reason = None

    # 1) Быстрые фильтры без ИИ
    if text and has_profanity(text):
        reason = "profanity"
    elif has_link(text, entities):
        reason = "link"
    elif text and has_spam_marker(text):
        reason = "spam"

    ai_reply = None

    # 2) Проверка медиа через vision, если ещё нет нарушения
    if not reason and photos:
        largest = photos[-1]
        data_url = tg_download_file_as_data_url(largest.get("file_id"))
        if data_url:
            verdict = classify_image(data_url)
            if not verdict.get("on_topic", True):
                reason = "offtopic_media"
    elif not reason and (video or animation):
        # Видео/гиф без явного текста — считаем нерелевантным вложением, если нет вопроса в подписи
        media_obj = video or animation
        thumb = (media_obj or {}).get("thumbnail") or (media_obj or {}).get("thumb")
        if thumb:
            data_url = tg_download_file_as_data_url(thumb.get("file_id"))
            if data_url:
                verdict = classify_image(data_url)
                if not verdict.get("on_topic", True):
                    reason = "offtopic_media"

    # 3) Текстовая ИИ-классификация грубости/спама + короткий ответ на вопрос
    if not reason and text.strip():
        verdict = classify_text(text)
        if verdict.get("violation"):
            reason = verdict.get("reason") or "rude"
        else:
            ai_reply = verdict.get("reply")

    # ── Нарушение: удаляем, при повторе — бан ───────────────────────────────
    if reason:
        tg_delete_message(chat_id, message_id)
        count = register_violation(conn, chat_id, user_id, reason)
        label = REASON_LABELS.get(reason, "нарушение правил")
        if count >= 2:
            tg_ban_user(chat_id, user_id)
            tg_send_message(
                chat_id,
                f"🚫 {first_name} заблокирован за повторное нарушение правил ({label}).",
                thread_id=thread_id,
            )
        else:
            tg_send_message(
                chat_id,
                f"⚠️ {first_name}, сообщение удалено ({label}). При повторном нарушении — блокировка.",
                thread_id=thread_id,
            )
        return

    # ── Обычное сообщение: отвечаем только если это вопрос/обращение ───────
    if ai_reply:
        tg_send_message(chat_id, ai_reply, reply_to_message_id=message_id, thread_id=thread_id)


# ── Регистрация вебхука (для администратора) ────────────────────────────────

def handle_set_webhook(event: dict) -> dict:
    qs = event.get("queryStringParameters") or {}
    url = qs.get("url", "")
    if not url:
        return err("Нужен параметр url — публичный URL этой функции")
    secret = os.environ.get("TELEGRAM_WEBHOOK_SECRET", "")
    result = tg_call("setWebhook", {
        "url": url,
        "secret_token": secret,
        "allowed_updates": ["message", "edited_message"],
    }, timeout=15)
    return ok(result or {"ok": False, "error": "Нет ответа от Telegram"})


def handle_webhook_info() -> dict:
    result = tg_call("getWebhookInfo", {}, timeout=10)
    return ok(result or {"ok": False})


# ── HTTP-обвязка ─────────────────────────────────────────────────────────────

def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def ok(data):
    return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps(data, ensure_ascii=False, default=str)}


def err(msg, status=400):
    return {"statusCode": status, "headers": CORS,
            "body": json.dumps({"error": msg}, ensure_ascii=False)}


def handler(event: dict, context) -> dict:
    """Вебхук Telegram для модерации группы обсуждений + вспомогательные admin-действия."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    qs = event.get("queryStringParameters") or {}
    action = qs.get("action", "")
    admin_token = os.environ.get("ADMIN_TOKEN", "")

    if action == "set_webhook":
        if not admin_token or qs.get("key", "") != admin_token:
            return err("Доступ запрещён", 403)
        return handle_set_webhook(event)

    if action == "webhook_info":
        if not admin_token or qs.get("key", "") != admin_token:
            return err("Доступ запрещён", 403)
        return handle_webhook_info()

    # ── Основной путь: вебхук от Telegram ───────────────────────────────────
    headers = event.get("headers") or {}
    webhook_secret = os.environ.get("TELEGRAM_WEBHOOK_SECRET", "")
    incoming_secret = headers.get("X-Telegram-Bot-Api-Secret-Token", "")
    if webhook_secret and incoming_secret != webhook_secret:
        return err("Доступ запрещён", 403)

    try:
        update = json.loads(event.get("body") or "{}")
    except json.JSONDecodeError:
        return ok({"ok": True})

    message = update.get("message") or update.get("edited_message")
    if not message:
        return ok({"ok": True})

    conn = get_db()
    try:
        process_message(conn, message)
    finally:
        conn.close()

    return ok({"ok": True})
