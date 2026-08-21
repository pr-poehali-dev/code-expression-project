"""
Публичные быстрые эндпоинты блога и карты сайта — вынесены в отдельную функцию с НИЗКИМ
таймаутом (5-10с), так как их дёргают поисковые боты, RSS и посетители блога очень часто.
Раньше жили внутри masters-accrual, которой из-за ИИ-действий ПоДелам нужен таймаут 60-100с —
каждый быстрый публичный запрос тарифицировался по этому высокому таймауту и впустую расходовал
вычислительное время. ИИ-ответы Админ Светланы на комментарии по-прежнему занимают до 20с
(запрос к polza.ai), поэтому таймаут этой функции — 25с.
GET  ?action=content_list     — посты для ленты на сайте с пагинацией (page, limit, category, role).
                                   Список без полного текста (body) — только заголовок/анонс. ?post_id=N
                                   или ?slug=... — конкретный пост С полным текстом (body), без авторизации.
GET  ?action=content_related  — похожие посты той же категории (post_id, category, limit) для блока
                                   «Читать дальше».
GET  ?action=sitemap          — динамическая карта сайта (XML, Content-Type application/xml) со всеми
                                   статичными страницами + ссылкой на КАЖДУЮ опубликованную статью блога.
                                   Без авторизации, публичный эндпоинт для поисковых роботов.
GET  ?action=comments_list&post_id=N — список комментариев к посту (дерево: комментарий + ответы),
                                   включая ответы Админ Светланы (ИИ, модель gpt-4o-mini через polza.ai),
                                   с количеством лайков (likes_count) и флагом liked_by_me для
                                   авторизованного читателя (X-Session-Id опц.).
POST ?action=comment_add      — оставить комментарий к посту (только авторизованным, X-Session-Id). body:
                                   post_id, text, опц. parent_id (ответ на комментарий). Если комментарий —
                                   вопрос/обращение по теме статьи, Админ Светлана отвечает автоматически.
                                   Вопросы не по теме платформы/статьи получают ответ с просьбой обратиться
                                   в техподдержку личного кабинета вместо содержательного ответа.
POST ?action=comment_like     — поставить/снять свой лайк на комментарии (только авторизованным,
                                   X-Session-Id). body: comment_id. Возвращает liked_by_me и итоговый likes_count.
"""
import json
import os
import random
import re
import urllib.request
import urllib.error
import psycopg2
import psycopg2.extras

SCHEMA = "t_p84565078_code_expression_proj"
SITE_URL = "https://promtdialog.ru"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def ok(data):
    return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps(data, ensure_ascii=False, default=str)}


def err(msg, status=400):
    return {"statusCode": status, "headers": CORS,
            "body": json.dumps({"error": msg}, ensure_ascii=False)}


def get_lk_user_by_session(session_id: str, conn):
    """Пользователь личного кабинета «Промт Диалог» по X-Session-Id (lk_sessions/lk_users)."""
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"""SELECT u.* FROM {SCHEMA}.lk_sessions s JOIN {SCHEMA}.lk_users u ON u.id = s.user_id
            WHERE s.id = %s AND s.expires_at > NOW() AND u.is_active = TRUE""",
        (session_id,)
    )
    return cur.fetchone()


CONTENT_CATEGORIES = {
    "marketing": "Маркетинг",
    "upsell": "Допродажи",
    "clients": "Работа с клиентами",
    "tools": "Инструменты платформы",
}

CONTENT_ROLES = {
    "owner": "Владелец салона",
    "admin": "Администратор салона",
    "master": "Мастер",
    "massage": "Массажист",
}


def handle_content_list(event: dict, conn) -> dict:
    """Список опубликованных постов для ленты на сайте, с пагинацией (?page, ?limit) и фильтрами
    по ?category=marketing|upsell|clients|tools и ?role=owner|admin|master|massage (можно оба
    одновременно). Список НЕ содержит полного текста (body) — только заголовок/анонс, чтобы лента
    оставалась лёгкой. Посты категории «tools» дополнительно содержат tool_link (заметная
    карточка-ссылка на инструмент/курс Академии, которому посвящён пост) — в формате
    {label, desc, icon, tab, tool} или null, если для темы ссылка не задана. Поле authorized
    (авторизован ли читатель) остаётся в ответе — фронт использует его, чтобы решить, куда вести по
    клику на tool_link: в кабинет или на форму регистрации.
    ?post_id=N или ?slug=... — вернуть конкретный пост (с полным текстом body) по id или по
    человекочитаемому slug (для отдельной SEO-страницы /blog/:slug), игнорируя пагинацию и фильтры
    категории/роли."""
    qs = event.get("queryStringParameters") or {}
    try:
        limit = min(max(int(qs.get("limit", 6)), 1), 50)
    except ValueError:
        limit = 6
    try:
        page = max(int(qs.get("page", 1)), 1)
    except ValueError:
        page = 1
    offset = (page - 1) * limit
    category = qs.get("category", "")
    role_filter = qs.get("role", "")
    try:
        post_id = int(qs.get("post_id", 0)) or None
    except ValueError:
        post_id = None
    slug = qs.get("slug", "") or None

    session_id = (event.get("headers") or {}).get("X-Session-Id", "")
    is_authorized = bool(session_id and get_lk_user_by_session(session_id, conn))

    single = bool(post_id or slug)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    if slug:
        where_clause = "WHERE slug = %s"
        params: tuple = (slug,)
    elif post_id:
        where_clause = "WHERE id = %s"
        params = (post_id,)
    else:
        conditions = []
        params = ()
        if category and category in CONTENT_CATEGORIES:
            conditions.append("category = %s")
            params += (category,)
        if role_filter and role_filter in CONTENT_ROLES:
            conditions.append("role = %s")
            params += (role_filter,)
        where_clause = f"WHERE {' AND '.join(conditions)}" if conditions else ""

    cur.execute(f"SELECT COUNT(*) AS total FROM {SCHEMA}.content_posts {where_clause}", params)
    total = cur.fetchone()["total"]

    # Полный текст (body) отдаём только при запросе конкретного поста (?post_id/?slug) — в ленте он
    # не отображается, и лишние килобайты на каждый пост в списке не нужны.
    body_column = "body," if single else "NULL AS body,"
    cur.execute(
        f"""SELECT id, slug, post_date, title, excerpt, {body_column} hashtags, category, role, created_at,
                   tool_link_label, tool_link_desc, tool_link_icon, tool_link_tab, tool_link_tool
            FROM {SCHEMA}.content_posts
            {where_clause}
            ORDER BY post_date DESC
            LIMIT %s OFFSET %s""",
        params + (limit if not single else 1, offset if not single else 0)
    )
    rows = [dict(r) for r in cur.fetchall()]
    for r in rows:
        r["category_label"] = CONTENT_CATEGORIES.get(r.get("category"), "")
        r["role_label"] = CONTENT_ROLES.get(r.get("role"), "")
        if r.get("tool_link_label"):
            r["tool_link"] = {
                "label": r["tool_link_label"], "desc": r["tool_link_desc"],
                "icon": r["tool_link_icon"], "tab": r["tool_link_tab"], "tool": r["tool_link_tool"],
            }
        else:
            r["tool_link"] = None
        for key in ("tool_link_label", "tool_link_desc", "tool_link_icon", "tool_link_tab", "tool_link_tool"):
            r.pop(key, None)

    return ok({
        "posts": rows,
        "categories": CONTENT_CATEGORIES,
        "roles": CONTENT_ROLES,
        "page": page,
        "limit": limit,
        "total": total,
        "has_more": offset + len(rows) < total,
        "authorized": is_authorized,
    })


def handle_content_related(event: dict, conn) -> dict:
    """Похожие посты той же категории для блока «Читать дальше» (?post_id, ?category, ?limit)."""
    qs = event.get("queryStringParameters") or {}
    category = qs.get("category", "")
    try:
        post_id = int(qs.get("post_id", 0))
    except ValueError:
        post_id = 0
    try:
        limit = min(max(int(qs.get("limit", 3)), 1), 10)
    except ValueError:
        limit = 3

    if category not in CONTENT_CATEGORIES:
        return ok({"posts": []})

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"""SELECT id, slug, post_date, title, excerpt, category
            FROM {SCHEMA}.content_posts
            WHERE category = %s AND id != %s
            ORDER BY post_date DESC
            LIMIT %s""",
        (category, post_id, limit)
    )
    rows = [dict(r) for r in cur.fetchall()]
    for r in rows:
        r["category_label"] = CONTENT_CATEGORIES.get(r.get("category"), "")
    return ok({"posts": rows})


# Статичные страницы сайта (совпадает со списком в public/sitemap.xml) — здесь дублируются, чтобы
# динамическая карта сайта была ПОЛНОЙ (статика + блог) и её можно было указать в robots.txt вместо
# статического файла. (url, changefreq, priority)
SITEMAP_STATIC_PAGES = [
    ("/", "weekly", "1.0"),
    ("/vozmozhnosti", "weekly", "0.9"),
    ("/dlya-kogo", "monthly", "0.8"),
    ("/akademiya", "weekly", "0.8"),
    ("/tseny", "monthly", "0.8"),
    ("/keysy", "monthly", "0.7"),
    ("/o-proekte", "monthly", "0.6"),
    ("/tarify", "monthly", "0.7"),
    ("/reviews", "weekly", "0.7"),
    ("/praktika", "monthly", "0.7"),
    ("/premium", "monthly", "0.7"),
    ("/ekspert", "monthly", "0.7"),
    ("/free", "monthly", "0.6"),
    ("/trening-prodazhi", "monthly", "0.6"),
    ("/dlya-salonov", "monthly", "0.7"),
    ("/kontakty", "yearly", "0.5"),
    ("/blog", "daily", "0.8"),
    ("/privacy", "yearly", "0.3"),
    ("/offer", "yearly", "0.3"),
]


def _xml_escape(text: str) -> str:
    return (text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
            .replace('"', "&quot;").replace("'", "&apos;"))


def handle_sitemap(event: dict, conn) -> dict:
    """Динамическая карта сайта (XML): статичные страницы + ссылка на КАЖДУЮ опубликованную статью
    блога. Пополняется сама по мере публикации новых постов — ничего вручную обновлять не нужно."""
    parts = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']

    for path, changefreq, priority in SITEMAP_STATIC_PAGES:
        parts.append(
            f"  <url><loc>{SITE_URL}{path}</loc><changefreq>{changefreq}</changefreq><priority>{priority}</priority></url>"
        )

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT slug, post_date FROM {SCHEMA}.content_posts WHERE slug IS NOT NULL ORDER BY post_date DESC")
    for r in cur.fetchall():
        loc = _xml_escape(f"{SITE_URL}/blog/{r['slug']}")
        lastmod = r["post_date"].isoformat() if hasattr(r["post_date"], "isoformat") else str(r["post_date"])
        parts.append(
            f"  <url><loc>{loc}</loc><lastmod>{lastmod}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>"
        )

    parts.append("</urlset>")
    xml = "\n".join(parts)
    return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/xml; charset=utf-8"}, "body": xml}


# ── Комментарии к постам блога + ответы «Админ Светлана» (ИИ, gpt-4o-mini) ─────

COMMENTS_AI_MODEL = "openai/gpt-4o-mini"
COMMENTS_AI_URL = "https://polza.ai/api/v1/chat/completions"
ADMIN_NAME = "Светлана"

SUPPORT_REDIRECT_REPLY = (
    "По вопросам работы платформы, оплаты или доступа лучше сразу написать в техподдержку "
    "личного кабинета — там быстрее разберутся и подскажут точно по вашему аккаунту."
)


def build_comment_ai_prompt(post_title: str, post_body: str, category_label: str) -> str:
    return f"""Ты — Светлана, администратор блога платформы «Промт Диалог» (инструменты для салонов красоты и мастеров: \
маркетинг, обучение, ИИ-инструменты, навигатор дохода «ПоДелам»). Ты отвечаешь на комментарии читателей под конкретной \
статьёй блога. Никогда, ни при каких условиях не сообщай и не намекай, что ты ИИ, бот, нейросеть или автоматический \
ответ — ты живой администратор блога по имени Светлана.

СТАТЬЯ, ПОД КОТОРОЙ ОСТАВЛЕН КОММЕНТАРИЙ (рубрика «{category_label}»):
Заголовок: {post_title}
Текст: {post_body}

Твоя задача — оценить комментарий читателя и ответить СТРОГО в формате JSON без markdown-обёртки:
{{
  "should_reply": true/false,
  "reply": "текст ответа" | null,
  "redirect_to_support": true/false
}}

Правила:
- should_reply=true, если комментарий — вопрос, просьба уточнить, несогласие по теме статьи или прямое обращение \
к администрации по теме статьи. should_reply=false для простых благодарностей, согласия, эмоциональных реплик без \
вопроса — на них отвечать не нужно (reply тогда null).
- Если вопрос ПО ТЕМЕ СТАТЬИ (уточнение совета, как применить, почему так, личный опыт по теме) — дай развёрнутый, \
полезный, дружелюбный ответ на 2-5 предложений, как живой человек-эксперт, по-русски, на "вы", без канцелярита. \
Можно вести диалог, уточнять детали ситуации читателя, давать дополнительные советы по теме статьи.
- Если вопрос НЕ по теме статьи и не по бьюти-бизнесу вообще, а касается работы самой платформы «Промт Диалог» \
(оплата, доступ, техническая проблема, тарифы, личный кабинет, баг) — redirect_to_support=true, reply = null \
(программно подставится стандартная фраза с просьбой обратиться в техподдержку).
- Если вопрос явно оскорбительный, спам или реклама постороннего — should_reply=false, reply=null.
- Никогда не упоминай, что ты ИИ, модель, бот или автоматика. Ты — Светлана, администратор блога."""


def call_comment_ai(comment_text: str, post_title: str, post_body: str, category_label: str) -> dict | None:
    """Просит ИИ (от имени Админ Светланы) оценить комментарий и сформировать ответ. None при ошибке."""
    api_key = os.environ.get("POLZA_AI_API_KEY", "") or os.environ.get("OPENAI_API_KEY", "")
    if not api_key:
        return None

    system_prompt = build_comment_ai_prompt(post_title, post_body[:2000], category_label)
    payload = json.dumps({
        "model": COMMENTS_AI_MODEL,
        "messages": [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": comment_text[:1500]},
        ],
        "temperature": 0.6,
        "max_tokens": 400,
    }).encode("utf-8")

    req = urllib.request.Request(
        COMMENTS_AI_URL, data=payload,
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
            content = content.strip()
        return json.loads(content)
    except (urllib.error.URLError, TimeoutError, KeyError, ValueError, json.JSONDecodeError) as e:
        print(f"[comments_ai] failed: {type(e).__name__}: {e}")
        return None


def handle_comments_list(event: dict, conn) -> dict:
    """Список комментариев к посту (плоский список с parent_id для отображения дерева ответов),
    с количеством лайков на каждом и флагом liked_by_me для авторизованного читателя.
    Ответы Админ Светланы скрыты до наступления visible_at — создаётся видимость, что она
    печатает ответ не мгновенно, а с обычной человеческой задержкой (см. handle_comment_add)."""
    qs = event.get("queryStringParameters") or {}
    try:
        post_id = int(qs.get("post_id", 0))
    except ValueError:
        post_id = 0
    if not post_id:
        return err("Не указан post_id")

    session_id = (event.get("headers") or {}).get("X-Session-Id", "")
    viewer = get_lk_user_by_session(session_id, conn) if session_id else None
    viewer_id = viewer["id"] if viewer else 0

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"""SELECT c.id, c.post_id, c.parent_id, c.author_name, c.is_admin_reply, c.body, c.created_at,
                   COUNT(l.id) AS likes_count,
                   COUNT(l.id) FILTER (WHERE l.user_id = %s) > 0 AS liked_by_me
            FROM {SCHEMA}.content_comments c
            LEFT JOIN {SCHEMA}.content_comment_likes l ON l.comment_id = c.id
            WHERE c.post_id = %s AND c.visible_at <= NOW()
            GROUP BY c.id
            ORDER BY c.created_at ASC""",
        (viewer_id, post_id)
    )
    rows = [dict(r) for r in cur.fetchall()]
    return ok({"comments": rows})


def handle_comment_like(event: dict, conn) -> dict:
    """Переключает лайк текущего пользователя на комментарии (поставить/снять). Требует авторизации."""
    session_id = (event.get("headers") or {}).get("X-Session-Id", "")
    if not session_id:
        return err("Не авторизован", 401)
    user = get_lk_user_by_session(session_id, conn)
    if not user:
        return err("Сессия истекла", 401)

    body = json.loads(event.get("body") or "{}")
    try:
        comment_id = int(body.get("comment_id", 0))
    except (TypeError, ValueError):
        comment_id = 0
    if not comment_id:
        return err("Не указан comment_id")

    cur = conn.cursor()
    cur.execute(
        f"SELECT id FROM {SCHEMA}.content_comment_likes WHERE comment_id = %s AND user_id = %s",
        (comment_id, user["id"])
    )
    existing = cur.fetchone()
    if existing:
        cur.execute(
            f"DELETE FROM {SCHEMA}.content_comment_likes WHERE comment_id = %s AND user_id = %s",
            (comment_id, user["id"])
        )
        liked = False
    else:
        # FK на content_comments сам вернёт ошибку, если комментарий не существует — отдельный
        # SELECT для проверки существования не нужен.
        try:
            cur.execute(
                f"INSERT INTO {SCHEMA}.content_comment_likes (comment_id, user_id) VALUES (%s, %s) "
                f"ON CONFLICT (comment_id, user_id) DO NOTHING",
                (comment_id, user["id"])
            )
        except psycopg2.errors.ForeignKeyViolation:
            conn.rollback()
            return err("Комментарий не найден", 404)
        liked = True
    conn.commit()

    cur.execute(f"SELECT COUNT(*) FROM {SCHEMA}.content_comment_likes WHERE comment_id = %s", (comment_id,))
    likes_count = cur.fetchone()[0]

    return ok({"comment_id": comment_id, "liked_by_me": liked, "likes_count": likes_count})


def handle_comment_add(event: dict, conn) -> dict:
    """Добавляет комментарий авторизованного пользователя к посту. Если это вопрос/обращение по теме
    статьи — Админ Светлана (ИИ, gpt-4o-mini) отвечает развёрнуто в том же треде; вопросы по работе
    платформы получают ответ с просьбой обратиться в техподдержку личного кабинета вместо содержательного ответа."""
    session_id = (event.get("headers") or {}).get("X-Session-Id", "")
    if not session_id:
        return err("Не авторизован", 401)
    user = get_lk_user_by_session(session_id, conn)
    if not user:
        return err("Сессия истекла", 401)

    body = json.loads(event.get("body") or "{}")
    try:
        post_id = int(body.get("post_id", 0))
    except (TypeError, ValueError):
        post_id = 0
    text = (body.get("text") or "").strip()
    parent_id = body.get("parent_id")
    try:
        parent_id = int(parent_id) if parent_id else None
    except (TypeError, ValueError):
        parent_id = None

    if not post_id:
        return err("Не указан post_id")
    if not text:
        return err("Комментарий не может быть пустым")
    if len(text) > 2000:
        return err("Комментарий слишком длинный")

    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT id, title, body, category FROM {SCHEMA}.content_posts WHERE id = %s",
        (post_id,)
    )
    post = cur.fetchone()
    if not post:
        return err("Пост не найден", 404)

    author_name = (user.get("full_name") or "").strip() or "Читатель"

    cur2 = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur2.execute(
        f"""INSERT INTO {SCHEMA}.content_comments (post_id, user_id, parent_id, author_name, is_admin_reply, body)
            VALUES (%s, %s, %s, %s, FALSE, %s)
            RETURNING id, post_id, parent_id, author_name, is_admin_reply, body, created_at""",
        (post_id, user["id"], parent_id, author_name, text)
    )
    new_comment = dict(cur2.fetchone())
    conn.commit()

    # Ответ Админ Светланы — best-effort: если ИИ недоступен или сбой, комментарий пользователя
    # всё равно уже сохранён и опубликован, диалог просто не продолжится автоматически.
    category_label = CONTENT_CATEGORIES.get(post.get("category"), "")
    ai_verdict = call_comment_ai(text, post["title"], post.get("body") or "", category_label)

    admin_reply = None
    # redirect_to_support обрабатываем независимо от should_reply — модель иногда возвращает
    # should_reply=false вместе с redirect_to_support=true (расценивает вопрос не по теме статьи
    # как "не требующий содержательного ответа"), но это тоже полноценный повод ответить.
    if ai_verdict and (ai_verdict.get("should_reply") or ai_verdict.get("redirect_to_support")):
        reply_text = None
        if ai_verdict.get("redirect_to_support"):
            reply_text = SUPPORT_REDIRECT_REPLY
        elif ai_verdict.get("reply"):
            reply_text = ai_verdict["reply"]

        if reply_text:
            # Ответ уже сгенерирован, но публикуется не мгновенно, а с человеческой задержкой
            # (1-2.5 минуты) — иначе видно, что комментарий и ответ появляются одновременно,
            # что выдаёт автоматику. created_at = visible_at (момент фактической публикации),
            # чтобы читатель видел время "написания" таким же, как момент появления в ленте,
            # а не момент, когда ИИ сгенерировал текст на сервере.
            delay_seconds = random.randint(60, 150)
            cur3 = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            cur3.execute(
                f"""INSERT INTO {SCHEMA}.content_comments
                    (post_id, user_id, parent_id, author_name, is_admin_reply, body, created_at, visible_at)
                    VALUES (%s, %s, %s, %s, TRUE, %s,
                            NOW() + (%s || ' seconds')::interval, NOW() + (%s || ' seconds')::interval)
                    RETURNING id, post_id, parent_id, author_name, is_admin_reply, body, created_at, visible_at""",
                (post_id, user["id"], new_comment["id"], ADMIN_NAME, reply_text, delay_seconds, delay_seconds)
            )
            admin_reply = dict(cur3.fetchone())
            conn.commit()

    # admin_reply возвращаем фронту сразу (чтобы можно было показать «печатает…»), но реальный
    # текст ответа станет доступен через comments_list только после visible_at.
    return ok({"comment": new_comment, "admin_reply_pending": admin_reply is not None,
               "admin_reply_delay_seconds": (admin_reply["visible_at"] - admin_reply["created_at"]).total_seconds() if admin_reply else None})


def handler(event: dict, context) -> dict:
    """Публичные быстрые эндпоинты блога: лента, карта сайта, комментарии."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    qs = event.get("queryStringParameters") or {}
    route_action = qs.get("action", "")

    conn = get_db()
    try:
        if route_action == "content_list":
            return handle_content_list(event, conn)
        if route_action == "content_related":
            return handle_content_related(event, conn)
        if route_action == "sitemap":
            return handle_sitemap(event, conn)
        if route_action == "comments_list":
            return handle_comments_list(event, conn)
        if route_action == "comment_add":
            return handle_comment_add(event, conn)
        if route_action == "comment_like":
            return handle_comment_like(event, conn)

        return err("Неизвестное действие", 404)
    finally:
        conn.close()
