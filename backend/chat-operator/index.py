"""
POST / c телом {"messages":[...]} — AI-оператор чата на сайте: отвечает на вопросы об обучении,
    тарифах, платформе. Динамически подгружает каталог тренингов из БД.
POST / c телом Telegram-апдейта (есть "update_id") — вебхук модерации группы обсуждений
    Telegram-канала «Промт Диалог»: удаляет мат/спам/ссылки/нерелевантные фото-видео (бан при
    повторном нарушении), коротко отвечает только если сообщение — явный вопрос/обращение к боту.
    Заголовок X-Telegram-Bot-Api-Secret-Token сверяется с TELEGRAM_WEBHOOK_SECRET.
GET/POST ?action=set_webhook&key=ADMIN_TOKEN&url=<URL этой функции> — регистрирует вебхук в Telegram.
GET ?action=webhook_info&key=ADMIN_TOKEN — текущая информация о вебхуке (диагностика).
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

SYSTEM_PROMPT = """Ты — AI-консультант платформы «Промт Диалог» (promtdialog.ru). Отвечаешь дружелюбно, чётко и по делу. Пиши 2-5 предложений — не перегружай. Если вопрос выходит за рамки знаний — честно говори: «Уточните у менеджера через форму на https://promtdialog.ru/kontakty».

ВАЖНО: Когда упоминаешь любую страницу сайта — всегда пиши полную ссылку с доменом https://promtdialog.ru. Никогда не пиши просто /tarify или «страница тарифов» без ссылки. Платформа называется ТОЛЬКО «Промт Диалог».

## О платформе
«Промт Диалог» — платформа с AI-инструментами и инструментами развития для специалистов по работе с телом (массажисты, остеопаты, телесные практики, бьюти-мастера) и для владельцев салонов/wellness-пространств. Это не курсы и не обучение — это набор практических инструментов: диагностики, AI-генераторы, тесты мышления, скрипты и аналитика. Инструменты помогают специалистам повысить чек и выстроить систему работы с клиентами, а салонам — увеличить прибыль и удержание клиентов.
Сайт: https://promtdialog.ru

## Автор и подход
Платформа создана Сергеем Водопьяновым — экспертом с 17+ летней практикой. Философия: клиент платит не за набор приёмов, а за состояние, уверенность и коммуникацию специалиста. 68% клиентов уходят не из-за качества услуги, а из-за ощущения, что их не слышат.

## Что есть на платформе прямо сейчас

### AI-инструменты для контента и бизнеса (страница https://promtdialog.ru/demo и личный кабинет)
Все инструменты работают в браузере, без установки. Два бесплатных, остальные — по тарифу:

**Бесплатно (без регистрации):**
- «Внутренние барьеры» — выявляет психологические блоки, мешающие профессиональному росту: https://promtdialog.ru/demo
- «Развитие специалиста» — персональный AI-план по клиентам, позиционированию и личному бренду: https://promtdialog.ru/demo

**Инструменты развития специалиста (по тарифу):**
- «Системная диагностика клиента» — жалоба → причины, компенсации, красные флаги и техники
- «Мышление с премиум-клиентами» — тест + советы по работе с клиентами высокого сегмента
- «Финансовая грамотность» — управление доходом специалиста
- «Финансовый профиль PRO» — уровень финансового мышления, привычек и зрелости
- «Диагностика роста салона PRO» — где салон теряет деньги и как увеличить прибыль
- «Шпаргалка по телу» — кликни на зону тела → диагностика, техники и видео

**AI-инструменты для контента и маркетинга (по тарифу):**
- Генерация изображений — визуалы для постов, сторис и баннеров под стиль салона
- Генератор постов — тема → 5 заголовков → готовый текст + картинка за 2 минуты
- Анализ персонала — финансовый разбор команды: кто приносит деньги, кто стоит денег
- Скрипты общения с клиентом — роль + ситуация → готовый сценарий диалога
- Цифровой бизнес-разбор — анкета → анализ салона → персональный план роста
- Сценарий для рилса — тема → готовый сценарий видео
- Конструктор лендингов — создаёт продающие страницы для услуг и акций без дизайнера (количество лендингов по тарифу)

### Форматы живой работы для специалистов
- «Закрытая практика» — индивидуальный закрытый формат: живые разборы, практика, работа с конкретными задачами специалиста. Страница: https://promtdialog.ru/zakrytaya-praktika
- «Профессиональные встречи» — закрытые онлайн/офлайн встречи: разборы кейсов, практика, Q&A с автором. Страница: https://promtdialog.ru/professionalnye-vstrechi

## Тарифы для специалистов (страница https://promtdialog.ru/tarify)

### Бесплатный доступ — «Вход в профессию нового уровня»
- Цена: бесплатно
- Что включено: 5 видео о росте специалиста, разборы ошибок, демонстрация инструментов, знакомство с платформой
- Получить: https://promtdialog.ru/free

### Тариф «Практика» — 90 900 ₽
- Доступ: 12 месяцев
- Для кого: специалисты в хаосе, хотят выйти на платёжеспособную аудиторию и уверенно продавать
- Что включено: мышление специалиста (страх денег, синдром самозванца), привлечение клиентов, работа с премиальным клиентом, ценообразование, диагностические и практические техники, доступ к инструментам развития
- Страница: https://promtdialog.ru/praktika

### Тариф «Премиальная практика» — 290 000 ₽ (популярный)
- Доступ: работа с автором 24 месяца + все инструменты на 3 месяца
- Для кого: хотят выйти на высокий чек, работать с премиальными клиентами, использовать AI
- Что включено: всё из «Практики» + доступ ко всем AI-инструментам, ИИ-анализатор клиента, интерактивная карта тела, система сопровождения клиента, 5 личных встреч
- Страница: https://promtdialog.ru/premium-praktika

### Тариф «Промт Диалог — Эксперт» — 500 000 ₽
- Доступ: без ограничений по времени
- Для кого: хотят максимальный уровень — все инструменты, безлимитная работа с автором
- Что включено: всё из «Премиальной практики» + безлимитный доступ ко всем инструментам, все обновления платформы навсегда, безлимитные встречи
- Страница: https://promtdialog.ru/ekspert-tarif

## Тарифы для салонов (страница https://promtdialog.ru/dlya-salonov/formats)

### Формат «Стандарт» — 190 000 ₽
- Для кого: студии и кабинеты до 5 специалистов
- Что входит: системность работы, единый сервис, скрипты общения, удержание клиентов, доступ на 6 месяцев

### Формат «Премиум салон» — 490 000 ₽ (популярный)
- Для кого: салоны среднего уровня с амбициями роста, до 15 сотрудников
- Что входит: всё из «Стандарта» + онлайн-диагностика клиента, AI-анализ персонала, 4 стратегические встречи, доступ 12 месяцев

### Формат «Промт Диалог Business» — от 1 200 000 ₽
- Для кого: премиальные салоны, сети, wellness высокого уровня
- Что входит: полное внедрение системы, безлимитный доступ к платформе, VIP-сопровождение, 6–12 очных встреч, индивидуальная настройка

### Дополнительные услуги для салонов:
- Аудит салона — от 50 000 ₽
- Обучение администраторов — от 90 000 ₽
- Настройка позиционирования — от 150 000 ₽
- Корпоративный доступ к платформе — от 39 000 ₽/мес

## Кому подходит платформа
Для специалистов: массажисты, остеопаты, телесные терапевты, бьюти-мастера — все, кто хочет выйти из потоковой работы, поднять чек и работать с премиальными клиентами.
Для салонов: владельцы и руководители, которые хотят увеличить прибыль, удержание клиентов и выстроить системную работу команды.

## Контакты и действия
- Форма заявки / связь: https://promtdialog.ru/kontakty
- Тарифы для специалистов: https://promtdialog.ru/tarify
- Тарифы для салонов: https://promtdialog.ru/dlya-salonov/formats
- Бесплатные инструменты: https://promtdialog.ru/demo
- Telegram-сообщество: https://t.me/+QgiLIa1gFRY4Y2Iy
- При вопросах об оплате, рассрочке, индивидуальных условиях — направляй на https://promtdialog.ru/kontakty

Отвечай только на русском языке. Если уместно — предложи конкретную страницу сайта с полной ссылкой https://promtdialog.ru/..."""


def get_academy_catalog() -> str:
    """Читает опубликованные курсы Академии из БД и формирует текстовый блок для промта."""
    try:
        conn = psycopg2.connect(os.environ["DATABASE_URL"])
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)

        cur.execute(
            f"SELECT id, title, description, category, access_cost, lesson_cost "
            f"FROM {SCHEMA}.courses WHERE is_published=TRUE ORDER BY sort_order, id"
        )
        courses = cur.fetchall()
        if not courses:
            conn.close()
            return ""

        cur.execute(
            f"SELECT id, course_id, title, sort_order FROM {SCHEMA}.course_modules ORDER BY course_id, sort_order, id"
        )
        modules_all = cur.fetchall()

        cur.execute(
            f"SELECT id, module_id, title FROM {SCHEMA}.course_lessons ORDER BY course_id, sort_order, id"
        )
        lessons_all = cur.fetchall()
        conn.close()

        modules_by_course = {}
        for m in modules_all:
            modules_by_course.setdefault(m["course_id"], []).append(m)

        lessons_by_module = {}
        for l in lessons_all:
            lessons_by_module.setdefault(l["module_id"], []).append(l["title"])

        cat_labels = {
            "owner": "Для владельца и руководителя",
            "admin": "Для администратора",
            "master": "Для мастеров",
            "body": "Для специалистов по телу",
        }

        lines = [
            "════════════════════════════════════",
            "ПРОКАЧКА НАВЫКОВ ПЛАТФОРМЫ «ПРОМТ ДИАЛОГ» — АКТУАЛЬНЫЙ КАТАЛОГ ТРЕНИНГОВ",
            "════════════════════════════════════",
            "Тренинги доступны в личном кабинете в разделе «Академия».",
            "Когда пользователь спрашивает про обучение, тренинги или курсы — рекомендуй конкретные тренинги из этого списка.",
            "",
        ]

        for c in courses:
            cat = cat_labels.get(c["category"], c["category"])
            cost_info = []
            if c["access_cost"] and int(c["access_cost"]) > 0:
                cost_info.append(f"доступ: {int(c['access_cost'])} ⚡")
            if c["lesson_cost"] and int(c["lesson_cost"]) > 0:
                cost_info.append(f"урок: {int(c['lesson_cost'])} ⚡")
            cost_str = f" [{', '.join(cost_info)}]" if cost_info else " [бесплатно]"

            lines.append(f"▸ ТРЕНИНГ: «{c['title']}»{cost_str}")
            lines.append(f"  Категория: {cat}")
            if c["description"]:
                lines.append(f"  Описание: {c['description']}")

            mods = modules_by_course.get(c["id"], [])
            if mods:
                lines.append("  Модули и уроки:")
                for m in mods:
                    lines.append(f"    • {m['title']}")
                    for lesson_title in lessons_by_module.get(m["id"], []):
                        lines.append(f"        — {lesson_title}")
            lines.append("")

        lines.append("════════════════════════════════════")
        return "\n".join(lines)
    except Exception:
        return ""


def handle_widget_chat(messages: list) -> dict:
    """AI-оператор чата на сайте: отвечает на вопросы об обучении, тарифах, платформе."""
    system_prompt = SYSTEM_PROMPT
    academy_catalog = get_academy_catalog()
    if academy_catalog:
        system_prompt += "\n\n" + academy_catalog

    payload = json.dumps({
        "model": "openai/gpt-4o-mini",
        "messages": [{"role": "system", "content": system_prompt}] + messages[-10:],
        "max_tokens": 600,
        "temperature": 0.5,
    }).encode("utf-8")

    req = urllib.request.Request(
        "https://polza.ai/api/v1/chat/completions",
        data=payload,
        headers={
            "Authorization": f"Bearer {os.environ['OPENAI_API_KEY']}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    with urllib.request.build_opener().open(req, timeout=25) as resp:
        result = json.loads(resp.read().decode("utf-8"))

    reply = result["choices"][0]["message"]["content"].strip()
    return ok({"reply": reply})


# ── Модерация группы обсуждений Telegram ─────────────────────────────────────

MODERATION_MODEL = "openai/gpt-4o-mini"
AI_URL = "https://polza.ai/api/v1/chat/completions"

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


REASON_LABELS = {
    "profanity": "нецензурная лексика",
    "link": "ссылки/реклама",
    "spam": "спам",
    "rude": "грубость",
    "offtopic_ad": "реклама постороннего",
    "offtopic_media": "фото/видео не по теме",
}


def process_telegram_message(conn, message: dict) -> None:
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

    reason = None

    if text and has_profanity(text):
        reason = "profanity"
    elif has_link(text, entities):
        reason = "link"
    elif text and has_spam_marker(text):
        reason = "spam"

    ai_reply = None

    if not reason and photos:
        largest = photos[-1]
        data_url = tg_download_file_as_data_url(largest.get("file_id"))
        if data_url:
            verdict = classify_image(data_url)
            if not verdict.get("on_topic", True):
                reason = "offtopic_media"
    elif not reason and (video or animation):
        media_obj = video or animation
        thumb = (media_obj or {}).get("thumbnail") or (media_obj or {}).get("thumb")
        if thumb:
            data_url = tg_download_file_as_data_url(thumb.get("file_id"))
            if data_url:
                verdict = classify_image(data_url)
                if not verdict.get("on_topic", True):
                    reason = "offtopic_media"

    if not reason and text.strip():
        verdict = classify_text(text)
        if verdict.get("violation"):
            reason = verdict.get("reason") or "rude"
        else:
            ai_reply = verdict.get("reply")

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

    if ai_reply:
        tg_send_message(chat_id, ai_reply, reply_to_message_id=message_id, thread_id=thread_id)


def handle_telegram_webhook(event: dict, update: dict) -> dict:
    headers = event.get("headers") or {}
    webhook_secret = os.environ.get("TELEGRAM_WEBHOOK_SECRET", "")
    incoming_secret = headers.get("X-Telegram-Bot-Api-Secret-Token", "")
    if webhook_secret and incoming_secret != webhook_secret:
        return err("Доступ запрещён", 403)

    message = update.get("message") or update.get("edited_message")
    if not message:
        return ok({"ok": True})

    conn = psycopg2.connect(os.environ["DATABASE_URL"])
    try:
        process_telegram_message(conn, message)
    finally:
        conn.close()

    return ok({"ok": True})


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


def ok(data):
    return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps(data, ensure_ascii=False, default=str)}


def err(msg, status=400):
    return {"statusCode": status, "headers": CORS,
            "body": json.dumps({"error": msg}, ensure_ascii=False)}


def handler(event: dict, context) -> dict:
    """AI-оператор чата на сайте + модерация группы обсуждений Telegram (единая функция)."""
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

    try:
        body = json.loads(event.get("body") or "{}")
    except json.JSONDecodeError:
        return err("Некорректный JSON")

    # Telegram всегда присылает update_id в теле вебхука
    if "update_id" in body:
        return handle_telegram_webhook(event, body)

    # Иначе — обычный запрос чат-виджета сайта
    messages = body.get("messages", [])
    if not messages:
        return err("messages required", 400)

    return handle_widget_chat(messages)
