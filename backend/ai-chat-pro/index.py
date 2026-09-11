"""
Продвинутый ИИ-чат с выбором роли (маркетолог, блогер, финансист, философ, программист,
бизнесмен, психолог, сценарист, политик, юрист). Только для администратора (ADMIN_TOKEN).

Роль «Маркетолог» умеет вызывать функции (function calling):
- get_blog_posts — читает ВСЕ посты блога проекта (content_posts), чтобы делать промо-объявления,
  анонсы и рассылки на основе реального контента, а не выдумок.
- yandex_wordstat_stats — дёргает реальный Яндекс.Вордстат (тот же YANDEX_DIRECT_TOKEN, что и
  marketing-semantics) для оценки спроса по фразам при составлении объявлений Директа.
Из-за возможных нескольких кругов «модель → инструмент → модель» (до 4), большого max_tokens
для таблиц по всем постам блога и внешних HTTP-запросов (БД + Вордстат) таймаут функции
увеличен. Таймаут функции: 180 секунд.
"""
import json
import os
import urllib.request
import urllib.error
import urllib.parse
import psycopg2
import psycopg2.extras

ADMIN_TOKEN = "Sss07011974ssS"
SCHEMA = "t_p84565078_code_expression_proj"

PROJECT_KNOWLEDGE = """ПРОЕКТ «ПРОМТ ДИАЛОГ» (promtdialog.ru)
Автор: Сергей Водопьянов, 17+ лет практики.
Платформа ИИ-инструментов для специалистов по работе с телом (массажисты, остеопаты, бьюти-мастера) и владельцев салонов красоты/wellness.
Философия: 68% клиентов уходят не из-за качества, а потому что их не слышат. Не курсы — рабочий инструмент каждый день.

ИНСТРУМЕНТЫ (каждый 1 энергия, медиаплан 3 энергии):
ИИ-диагностика клиента, анализ мышления специалиста, анализ барьеров, финансовый профиль PRO, диагностика роста салона PRO, генератор постов, сценарии Reels, скрипты продаж.
Маркетинговая цепочка: портрет ЦА → офферы → семантика → объявления Директ → медиаплан.
Прокачка навыков (Академия): онлайн и офлайн тренинги с ИИ-агентом — коммуникация, продажи, личный бренд, финансы. Есть бесплатные программы.

ТАРИФЫ СПЕЦИАЛИСТЫ: Бесплатный (0₽), Практика (90 900₽/год), Премиальная практика (290 000₽/24мес+встречи), Эксперт VIP (500 000₽/пожизненно).
ТАРИФЫ САЛОНЫ: Старт (990₽/мес, 150 энергий), Бизнес (2990₽/мес, 550 энергий), Рост (4990₽/мес, 1200 энергий), Премиум (9990₽/мес, 3000 энергий).
Энергия — внутренняя валюта. 100 энергий при регистрации бесплатно. Баланс общий на салон, лимиты по сотрудникам."""

ROLE_PROMPTS = {
    "marketer": """Ты — маркетолог с 15-летним опытом в digital и офлайн.
Компетенции: стратегии, воронки (AIDA/JTBD), анализ ЦА, Яндекс.Директ/ВКонтакте/Telegram, контент, брендинг, УТП, unit-экономика (CAC/LTV/ROAS).
Стиль: конкретные цифры, практические шаги, уточняющие вопросы при недостатке данных, мышление результатами.

У тебя есть доступ к двум инструментам:
1. get_blog_posts — доступ ко ВСЕМ постам блога проекта (заголовок, анонс, категория, дата, а по post_id — полный текст).
2. yandex_wordstat_stats — реальная статистика показов Яндекс.Вордстат (сколько раз в месяц ищут фразу в Яндексе, можно с городом).

КРИТИЧЕСКИ ВАЖНО: НИКОГДА не пиши пользователю фразы вида «мне нужен список постов», «дай доступ», «пришлите публикации» — у тебя УЖЕ ЕСТЬ прямой доступ через эти функции прямо сейчас, в этом же ответе. Если для выполнения задачи нужны посты блога или статистика Вордстата — вызывай нужную функцию НЕМЕДЛЕННО и молча, без объявлений о намерении и без вопросов пользователю, и продолжай работу над задачей по результату вызова, вплоть до готового результата за один ответ.

Правило вызова: «сделай промо-объявления/анонсы по постам блога» → сразу вызови get_blog_posts (без post_id — получишь список всех постов), при необходимости отдельным вызовом с post_id — полный текст конкретного поста для тезисов. «Составь объявления/проверь запросы для Директа» → вызови yandex_wordstat_stats по релевантным фразам. Можно вызывать оба инструмента по очереди в рамках одной задачи. Никогда не выдумывай содержание постов или цифры частотности — только из инструментов.

ФОРМАТ «ПРОМО-ОБЪЯВЛЕНИЯ ПО ПОСТАМ БЛОГА»: когда просят составить объявления/промо по постам блога — после вызова get_blog_posts сразу верни ГОТОВУЮ markdown-таблицу (без лишних вопросов и промежуточных сообщений) со столбцами: | Заголовок объявления | Доп. заголовок | Текст объявления | Ссылка на пост | Уточнения | Быстрые ссылки |. Ссылка на пост — строго https://promtdialog.ru/blog/{slug} (slug приходит из get_blog_posts). Заголовок объявления ≤56 символов, текст объявления ≤81 символ (лимиты Яндекс.Директ). По одной строке на каждый пост, если не сказано иначе.""",

    "blogger": """Ты — блогер-эксперт с аудиторией 500K+, автор вирусного контента Instagram/Telegram/YouTube.
Компетенции: посты/сторис/Reels, контент-планы, алгоритмы без рекламы, сторителлинг, хуки, вовлечённость, монетизация.
Стиль: живо, с характером, без воды, конкретные форматы и примеры.""",

    "financier": """Ты — финансовый директор и инвестиционный аналитик.
Компетенции: P&L/Cash Flow, unit-экономика, управленческий учёт, инвестиции, налоговое планирование (ИП/ООО/самозанятые), оценка бизнеса, DCF.
Стиль: цифры и расчёты, таблицы, формулы, без советов без цифр.""",

    "philosopher": """Ты — философ и одновременно крутой опытный логик: западная аналитика + восточная мудрость + когнитивная наука + строгая формальная логика.
Компетенции: критическое мышление, этика решений, экзистенциальные вопросы, эпистемология, стоицизм/буддизм/экзистенциализм, риторика, сократовский метод, а также логический анализ — выявление логических ошибок и когнитивных искажений, построение аргументов через силлогизмы и дедукцию/индукцию, проверка утверждений на непротиворечивость и обоснованность.
Стиль: глубокие вопросы, несколько точек зрения, цитаты мыслителей к месту, помогаешь думать самостоятельно — но при этом рассматриваешь вещи не только философски, а и логично: раскладываешь рассуждение на посылки и выводы, прямо называешь слабые места в аргументации и предлагаешь более строгий, обоснованный ход мысли.""",

    "programmer": """Ты — senior full-stack разработчик, 12 лет опыта, FAANG и стартапы.
Компетенции: React/TypeScript/Next.js, Python/Node.js/Go, PostgreSQL/Redis, системный дизайн, DevOps, алгоритмы, AI/ML интеграции, SOLID/DDD.
Стиль: конкретный рабочий код с объяснением, указываешь на проблемы, предлагаешь лучшие практики.""",

    "businessman": """Ты — серийный предприниматель (3 бизнеса построил и продал), ментор стартапов.
Компетенции: запуск с нуля за 90 дней, стратегия роста, управление командой, переговоры, операционка/SOP, привлечение инвестиций, кризис-менеджмент, выход из бизнеса.
Стиль: прямо, без политесов, личный опыт провалов и побед, всегда про ROI.""",

    "psychologist": """Ты — клинический психолог, 20 лет опыта. КПТ, гештальт, транзактный анализ.
Компетенции: поведение и мотивация, эмоциональный интеллект, отношения/конфликты, психология денег, выгорание, лидерство, работа с травмой.
Стиль: внимательно слушаешь, точные вопросы, конкретные техники и упражнения, не ставишь диагнозов, тепло но честно.""",

    "screenwriter": """Ты — сценарист, 18 лет опыта, федеральные каналы, полнометражное кино, YouTube-шоу.
Компетенции: драматургия, сторителлинг, сценарии YouTube/Reels/TikTok, диалоги, рекламные сценарии 30–60 сек., питчинг, редактура.
Стиль: думаешь образами и эмоциями, начинаешь с «кто герой?», пишешь конкретные фрагменты, чувствуешь ритм.""",

    "politician": """Ты — государственный деятель уровня премьер-министра, 25 лет в политике.
Компетенции: стратегическое мышление 5–20 лет, переговоры/коалиции, публичная риторика, кризис-коммуникация, геополитика, управление институтами, медиа и PR.
Стиль: взвешенно и дипломатично, видишь несколько уровней, карта сценариев с последствиями.""",

    "lawyer": """Ты — старший партнёр юрфирмы, 22 года опыта. Корпоративное, договорное, IP-право.
Компетенции: ООО/ИП/АО, договоры, товарные знаки/авторское право, трудовое право, налоговая оптимизация, защита от рейдерства, персданные (152-ФЗ), оферты.
Стиль: чётко и без лишних слов, указываешь на невидимые риски, практические рекомендации а не «проконсультируйтесь».""",
}

ROLE_NAMES = {
    "marketer": "Маркетолог",
    "blogger": "Блогер",
    "financier": "Финансист",
    "philosopher": "Философ",
    "programmer": "Программист",
    "businessman": "Бизнесмен",
    "psychologist": "Психолог",
    "screenwriter": "Сценарист",
    "politician": "Политик",
    "lawyer": "Юрист",
}

MODELS = {
    "gpt-4.1": "openai/gpt-4.1",
    "terra": "openai/gpt-5.6-terra",
}

WORDSTAT_API = "https://api.wordstat.yandex.net/v1/topRequests"

CITY_GEO_MAP = {
    "москва": 213, "санкт-петербург": 2, "спб": 2, "петербург": 2,
    "новосибирск": 65, "екатеринбург": 54, "казань": 43,
    "нижний новгород": 47, "челябинск": 56, "самара": 51,
    "уфа": 172, "ростов-на-дону": 39, "краснодар": 35,
    "пермь": 50, "воронеж": 193, "волгоград": 38,
    "красноярск": 62, "саратов": 194, "тюмень": 55,
    "тольятти": 239, "ижевск": 44, "барнаул": 197,
    "ульяновск": 195, "иркутск": 63, "хабаровск": 76,
    "ярославль": 16, "владивосток": 75, "махачкала": 28,
    "томск": 67, "оренбург": 48, "кемерово": 66,
    "новокузнецк": 237, "рязань": 10, "астрахань": 37,
    "пенза": 49, "липецк": 9, "тула": 15,
    "киров": 46, "чебоксары": 45, "калининград": 22,
    "брянск": 191, "иваново": 5, "магнитогорск": 235,
}

# ─── Инструменты (function calling) для роли «Маркетолог» ───────────────────

MARKETER_TOOLS = [
    {
        "type": "function",
        "function": {
            "name": "get_blog_posts",
            "description": (
                "Получить посты блога проекта «Промт Диалог». Без post_id возвращает список "
                "последних постов (заголовок, анонс, категория, дата) с фильтрами search/category. "
                "С post_id — возвращает ОДИН пост целиком, включая полный текст (body), чтобы на его "
                "основе составить промо-объявление, анонс в соцсети или рекламный текст."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "post_id": {"type": "integer", "description": "ID поста, чтобы получить его полный текст."},
                    "search": {"type": "string", "description": "Поиск по заголовку/анонсу/тексту поста (частичное совпадение)."},
                    "category": {"type": "string", "description": "Фильтр по категории: marketing, upsell, clients, tools."},
                    "limit": {"type": "integer", "description": "Сколько постов вернуть в списке (макс. 50, по умолчанию 20)."},
                },
            },
        },
    },
    {
        "type": "function",
        "function": {
            "name": "yandex_wordstat_stats",
            "description": (
                "Получить реальную статистику Яндекс.Вордстат — сколько раз в месяц ищут фразу в "
                "Яндексе (Россия), опционально с учётом конкретного города. Используется для оценки "
                "спроса и частотности при подборе ключевых фраз и составлении объявлений Яндекс.Директ."
            ),
            "parameters": {
                "type": "object",
                "properties": {
                    "phrases": {
                        "type": "array",
                        "items": {"type": "string"},
                        "description": "Список поисковых фраз (до 10 за раз), например [\"массаж спины\", \"массаж спины москва\"].",
                    },
                    "city": {"type": "string", "description": "Город для геотаргетинга статистики (необязательно)."},
                },
                "required": ["phrases"],
            },
        },
    },
]


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def tool_get_blog_posts(args: dict) -> dict:
    conn = get_db()
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        post_id = args.get("post_id")
        if post_id:
            cur.execute(
                f"SELECT id, slug, title, excerpt, body, category, role, hashtags, post_date "
                f"FROM {SCHEMA}.content_posts WHERE id = %s",
                (int(post_id),),
            )
            row = cur.fetchone()
            if not row:
                return {"error": f"Пост с id={post_id} не найден"}
            return {"post": dict(row)}

        conditions = []
        params: list = []
        search = (args.get("search") or "").strip()
        if search:
            like = f"%{search}%"
            conditions.append("(title ILIKE %s OR excerpt ILIKE %s OR body ILIKE %s)")
            params += [like, like, like]
        category = (args.get("category") or "").strip()
        if category:
            conditions.append("category = %s")
            params.append(category)
        where = f"WHERE {' AND '.join(conditions)}" if conditions else ""
        try:
            limit = min(max(int(args.get("limit") or 20), 1), 50)
        except (TypeError, ValueError):
            limit = 20

        cur.execute(
            f"SELECT id, slug, title, excerpt, category, role, hashtags, post_date "
            f"FROM {SCHEMA}.content_posts {where} ORDER BY post_date DESC LIMIT %s",
            params + [limit],
        )
        rows = [dict(r) for r in cur.fetchall()]
        return {"posts": rows, "count": len(rows)}
    except Exception as e:
        return {"error": str(e)}
    finally:
        conn.close()


def tool_yandex_wordstat_stats(args: dict) -> dict:
    """Официальный API Яндекс.Вордстат: POST, Authorization: Bearer <oauth-token>,
    body {"phrase", "regions": [geoId,...], "devices": [...]}.
    Ответ: requestPhrase, totalCount (общая частотность фразы за 30 дней),
    topRequests — топ похожих запросов с их count."""
    token = os.environ.get("YANDEX_DIRECT_TOKEN", "")
    if not token:
        return {"error": "YANDEX_DIRECT_TOKEN не настроен на сервере"}

    phrases = args.get("phrases") or []
    if not isinstance(phrases, list) or not phrases:
        return {"error": "Нужен непустой список phrases"}

    city = (args.get("city") or "").strip()
    geo_id = CITY_GEO_MAP.get(city.lower(), 0) if city else 0
    regions = [geo_id] if geo_id else []

    results = []
    for phrase in phrases[:10]:
        try:
            payload: dict = {"phrase": str(phrase)}
            if regions:
                payload["regions"] = regions
            req = urllib.request.Request(
                WORDSTAT_API,
                data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
                headers={
                    "Authorization": f"Bearer {token}",
                    "Content-Type": "application/json; charset=utf-8",
                },
                method="POST",
            )
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                top = data.get("topRequests") or []
                results.append({
                    "phrase": phrase,
                    "shows_per_month": data.get("totalCount", 0),
                    "similar_top_requests": [
                        {"phrase": t.get("phrase"), "count": t.get("count")} for t in top[:8]
                    ],
                })
        except urllib.error.HTTPError as e:
            try:
                err_body = e.read().decode("utf-8")
            except Exception:
                err_body = str(e)
            results.append({"phrase": phrase, "error": f"HTTP {e.code}: {err_body}"})
        except Exception as e:
            results.append({"phrase": phrase, "error": str(e)})

    return {"results": results, "city": city or "вся Россия"}


TOOL_EXECUTORS = {
    "get_blog_posts": tool_get_blog_posts,
    "yandex_wordstat_stats": tool_yandex_wordstat_stats,
}


# ─── Вызов ИИ (с опциональным function calling) ──────────────────────────────

def call_ai(system_prompt: str, messages: list, model_key: str, tools: list | None = None) -> str:
    api_key = os.environ.get("POLZA_AI_API_KEY", "")
    model = MODELS.get(model_key, MODELS["gpt-4.1"])
    convo = [{"role": "system", "content": system_prompt}] + messages[-8:]

    max_rounds = 4 if tools else 1
    last_content = ""

    for round_i in range(max_rounds):
        payload_dict = {
            "model": model,
            "messages": convo,
            "temperature": 0.8,
            # С инструментами (Маркетолог) ответ может быть большой таблицей на все посты блога —
            # 1200 токенов слишком мало и обрезает таблицу на середине.
            "max_tokens": 3500 if tools else 1200,
        }
        if tools:
            payload_dict["tools"] = tools
            payload_dict["tool_choice"] = "auto"

        req = urllib.request.Request(
            "https://polza.ai/api/v1/chat/completions",
            data=json.dumps(payload_dict).encode("utf-8"),
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            method="POST",
        )
        try:
            with urllib.request.urlopen(req, timeout=90) as resp:
                data = json.loads(resp.read().decode("utf-8"))
        except urllib.error.HTTPError as e:
            if tools:
                # Модель/провайдер могли не принять параметр tools — отступаем на обычный вызов.
                return call_ai(system_prompt, messages, model_key, tools=None)
            raise

        msg = data["choices"][0]["message"]
        last_content = (msg.get("content") or "").strip()
        tool_calls = msg.get("tool_calls")

        if not tool_calls:
            return last_content

        convo.append(msg)
        for tc in tool_calls:
            fn_name = (tc.get("function") or {}).get("name", "")
            try:
                fn_args = json.loads((tc.get("function") or {}).get("arguments") or "{}")
            except Exception:
                fn_args = {}
            executor = TOOL_EXECUTORS.get(fn_name)
            result = executor(fn_args) if executor else {"error": f"Неизвестный инструмент {fn_name}"}
            convo.append({
                "role": "tool",
                "tool_call_id": tc.get("id", ""),
                "content": json.dumps(result, ensure_ascii=False, default=str),
            })

    return last_content


CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
}


def handler(event: dict, context) -> dict:
    """Продвинутый ИИ-чат с выбором роли (маркетолог, блогер, финансист, философ, программист, бизнесмен). Только для администратора."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    try:
        body = json.loads(event.get("body") or "{}")
    except Exception:
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Invalid JSON"})}

    if body.get("token") != ADMIN_TOKEN:
        return {"statusCode": 403, "headers": CORS, "body": json.dumps({"error": "Forbidden"})}

    # Отладочный маршрут: прямой вызов инструмента Вордстата в обход ИИ — чтобы диагностировать
    # точную ошибку ответа Яндекса (без искажения через модель). Убрать после проверки токена.
    if body.get("debug_tool") == "yandex_wordstat_stats":
        return {
            "statusCode": 200,
            "headers": CORS,
            "body": json.dumps(tool_yandex_wordstat_stats(body.get("args") or {}), ensure_ascii=False, default=str),
        }

    role = body.get("role", "marketer")
    model_key = body.get("model", "gpt-4.1")
    messages = body.get("messages", [])

    if not messages:
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "messages required"})}

    role_prompt = ROLE_PROMPTS.get(role, ROLE_PROMPTS["marketer"])
    system_prompt = PROJECT_KNOWLEDGE + "\n\n" + role_prompt
    tools = MARKETER_TOOLS if role == "marketer" else None
    reply = call_ai(system_prompt, messages, model_key, tools=tools)

    return {
        "statusCode": 200,
        "headers": CORS,
        "body": json.dumps({"reply": reply, "role": role, "model": model_key}, ensure_ascii=False),
    }