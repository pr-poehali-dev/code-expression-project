import json
import os
import re
import urllib.request
import urllib.parse
import html
import psycopg2
import psycopg2.extras

SCHEMA = os.environ.get("MAIN_DB_SCHEMA", "t_p84565078_code_expression_proj")
ENERGY_MAIN = 50
ENERGY_PAGE = 30
ENERGY_REPEAT = 20

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}

def tbl(name): return f"{SCHEMA}.{name}"
def ok(data): return {"statusCode": 200, "headers": CORS, "body": json.dumps(data, ensure_ascii=False, default=str)}
def err(msg, code=400): return {"statusCode": code, "headers": CORS, "body": json.dumps({"error": msg}, ensure_ascii=False)}

def get_db(): return psycopg2.connect(os.environ["DATABASE_URL"])

def get_session_user(event, conn):
    sid = (event.get("headers") or {}).get("X-Session-Id", "")
    if not sid: return None
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT u.* FROM {tbl('lk_sessions')} s "
        f"JOIN {tbl('lk_users')} u ON u.id = s.user_id "
        f"WHERE s.id = %s AND s.expires_at > NOW() AND u.is_active = TRUE",
        (sid,)
    )
    return cur.fetchone()

def get_balance(conn, salon_id):
    cur = conn.cursor()
    cur.execute(f"SELECT credits_balance FROM {tbl('salons')} WHERE id = %s", (salon_id,))
    row = cur.fetchone()
    return row[0] if row else 0

def deduct(conn, salon_id, user_id, amount, action):
    cur = conn.cursor()
    cur.execute(f"UPDATE {tbl('salons')} SET credits_balance = credits_balance - %s WHERE id = %s", (amount, salon_id))
    cur.execute(
        f"INSERT INTO {tbl('credit_transactions')} (salon_id, user_id, action, amount, tool_key, type) VALUES (%s,%s,%s,%s,%s,'debit')",
        (salon_id, user_id, action, amount, "seo_analyzer")
    )

def fetch_page(url: str) -> dict:
    """Загружает HTML страницы и извлекает SEO-данные."""
    if not url.startswith("http"):
        url = "https://" + url
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (compatible; ProDialogSEOBot/1.0)",
        "Accept": "text/html,application/xhtml+xml",
        "Accept-Language": "ru-RU,ru;q=0.9,en;q=0.8",
    })
    response = urllib.request.urlopen(req, timeout=15)
    raw = response.read()
    # Определяем кодировку
    content_type = response.headers.get("Content-Type", "")
    charset = "utf-8"
    if "charset=" in content_type:
        charset = content_type.split("charset=")[-1].strip()
    try:
        body = raw.decode(charset, errors="replace")
    except Exception:
        body = raw.decode("utf-8", errors="replace")
    return parse_html(body, url)

def parse_html(body: str, url: str) -> dict:
    """Извлекает SEO-метаданные и текст из HTML."""
    def get_tag(pattern, text):
        m = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
        return html.unescape(m.group(1).strip()) if m else ""

    title = get_tag(r"<title[^>]*>(.*?)</title>", body)
    description = get_tag(r'<meta[^>]+name=["\']description["\'][^>]+content=["\'](.*?)["\']', body)
    if not description:
        description = get_tag(r'<meta[^>]+content=["\'](.*?)["\'][^>]+name=["\']description["\']', body)
    keywords = get_tag(r'<meta[^>]+name=["\']keywords["\'][^>]+content=["\'](.*?)["\']', body)
    if not keywords:
        keywords = get_tag(r'<meta[^>]+content=["\'](.*?)["\'][^>]+name=["\']keywords["\']', body)
    og_title = get_tag(r'<meta[^>]+property=["\']og:title["\'][^>]+content=["\'](.*?)["\']', body)
    og_description = get_tag(r'<meta[^>]+property=["\']og:description["\'][^>]+content=["\'](.*?)["\']', body)

    # Заголовки
    headings = {}
    for level in range(1, 7):
        found = re.findall(rf"<h{level}[^>]*>(.*?)</h{level}>", body, re.IGNORECASE | re.DOTALL)
        clean = [re.sub(r"<[^>]+>", "", h).strip() for h in found]
        clean = [html.unescape(h) for h in clean if h]
        if clean:
            headings[f"h{level}"] = clean

    # Извлекаем основной текст (убираем скрипты, стили, теги)
    text = re.sub(r"<script[^>]*>.*?</script>", " ", body, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r"<style[^>]*>.*?</style>", " ", text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r"<[^>]+>", " ", text)
    text = html.unescape(text)
    text = re.sub(r"\s+", " ", text).strip()
    text = text[:5000]  # Ограничиваем для GPT

    # Ссылки (количество внутренних/внешних)
    domain = urllib.parse.urlparse(url).netloc
    all_links = re.findall(r'href=["\']([^"\']+)["\']', body, re.IGNORECASE)
    internal = [l for l in all_links if domain in l or l.startswith("/")]
    external = [l for l in all_links if l.startswith("http") and domain not in l]

    # Изображения без alt
    images = re.findall(r"<img[^>]*>", body, re.IGNORECASE)
    images_no_alt = [img for img in images if "alt=" not in img.lower() or 'alt=""' in img.lower() or "alt=''" in img.lower()]

    # Canonical
    canonical = get_tag(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\'](.*?)["\']', body)

    return {
        "url": url,
        "title": title,
        "description": description,
        "keywords": keywords,
        "og_title": og_title,
        "og_description": og_description,
        "headings": headings,
        "text_preview": text,
        "internal_links": len(internal),
        "external_links": len(external),
        "images_count": len(images),
        "images_no_alt": len(images_no_alt),
        "canonical": canonical,
    }

def call_ai(messages: list, max_tokens: int = 2500) -> str:
    """Вызов ИИ через polza.ai (работает из любого региона)."""
    api_key = os.environ.get("POLZA_AI_API_KEY", "")
    if not api_key:
        raise ValueError("POLZA_AI_API_KEY не задан")
    payload = json.dumps({
        "model": "openai/gpt-4o-mini",
        "messages": messages,
        "temperature": 0.3,
        "max_tokens": max_tokens,
    }).encode("utf-8")
    req = urllib.request.Request(
        "https://polza.ai/api/v1/chat/completions",
        data=payload,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=60) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data["choices"][0]["message"]["content"].strip()

def analyze_with_ai(page_data: dict, salon_context: str, lang: str = "ru") -> dict:
    """GPT-4o mini через polza.ai анализирует страницу и выдаёт развёрнутый отчёт."""
    headings_str = ""
    for level, texts in page_data.get("headings", {}).items():
        headings_str += f"{level.upper()}: {' | '.join(texts[:5])}\n"

    system = f"""Ты — опытный SEO-специалист и маркетолог для салонов красоты.
Анализируй страницу сайта салона и давай конкретные, применимые рекомендации.
Язык ответа: {'русский' if lang == 'ru' else 'английский'}.
Отвечай строго в JSON-формате без markdown-блоков.

{salon_context}"""

    prompt = f"""Проанализируй SEO и контент страницы сайта салона.

URL: {page_data['url']}

МЕТА-ДАННЫЕ:
- Title: {page_data['title'] or '❌ Отсутствует'}
- Description: {page_data['description'] or '❌ Отсутствует'}
- Keywords: {page_data['keywords'] or '❌ Отсутствует'}
- OG Title: {page_data['og_title'] or '❌ Отсутствует'}
- OG Description: {page_data['og_description'] or '❌ Отсутствует'}
- Canonical: {page_data['canonical'] or '❌ Отсутствует'}

СТРУКТУРА ЗАГОЛОВКОВ:
{headings_str or '❌ Заголовки не найдены'}

ССЫЛКИ И ИЗОБРАЖЕНИЯ:
- Внутренние ссылки: {page_data['internal_links']}
- Внешние ссылки: {page_data['external_links']}
- Изображений: {page_data['images_count']} (без alt: {page_data['images_no_alt']})

ТЕКСТ СТРАНИЦЫ (первые 5000 символов):
{page_data['text_preview']}

Верни JSON следующей структуры:
{{
  "score": <число от 0 до 100 — общая SEO-оценка>,
  "summary": "<2-3 предложения общего вывода>",
  "critical": [
    {{"issue": "<проблема>", "recommendation": "<что сделать конкретно>", "example": "<пример готового текста или решения>"}}
  ],
  "improvements": [
    {{"area": "<область>", "current": "<что сейчас>", "better": "<как улучшить>", "example": "<готовый пример>"}}
  ],
  "meta": {{
    "title_status": "good|warn|bad",
    "title_issue": "<что не так>",
    "title_suggestion": "<готовый вариант title>",
    "description_status": "good|warn|bad",
    "description_issue": "<что не так>",
    "description_suggestion": "<готовый вариант description>",
    "h1_status": "good|warn|bad",
    "h1_issue": "<что не так>",
    "h1_suggestion": "<готовый вариант H1>"
  }},
  "content_analysis": {{
    "cta_present": true,
    "cta_recommendation": "<рекомендация по призыву к действию>",
    "services_mentioned": true,
    "services_recommendation": "<что добавить про услуги>",
    "local_seo": true,
    "local_seo_recommendation": "<рекомендация по локальному SEO>"
  }},
  "quick_wins": ["<быстрое улучшение 1>", "<быстрое улучшение 2>", "<быстрое улучшение 3>"]
}}"""

    raw = call_ai([{"role": "system", "content": system}, {"role": "user", "content": prompt}])
    raw = re.sub(r"^```json\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)
    return json.loads(raw)

def get_salon_context(conn, salon_id):
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(f"SELECT name, city, address, description, website_url FROM {tbl('salons')} WHERE id = %s", (salon_id,))
    s = cur.fetchone()
    if not s:
        return ""
    parts = [f"Салон: {s['name']}"]
    if s.get("city"): parts.append(f"Город: {s['city']}")
    if s.get("address"): parts.append(f"Адрес: {s['address']}")
    if s.get("description"): parts.append(f"О салоне: {s['description']}")
    if s.get("website_url"): parts.append(f"Сайт: {s['website_url']}")
    return "\n".join(parts)

def handler(event: dict, context) -> dict:
    """SEO-анализатор страниц сайта салона. Парсит страницу и анализирует через GPT-4o mini."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Unauthorized", 401)

        method = event.get("httpMethod", "GET")
        qs = event.get("queryStringParameters") or {}
        action = qs.get("action", "")

        salon_id = user.get("salon_id")
        if not salon_id:
            return err("no_salon", 400)

        # GET — список анализов салона
        if method == "GET" and action == "list":
            cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            cur.execute(
                f"SELECT id, url, is_main_page, status, title, score, energy_spent, created_at "
                f"FROM {tbl('seo_analyses')} WHERE salon_id = %s ORDER BY created_at DESC LIMIT 50",
                (salon_id,)
            )
            return ok({"analyses": [dict(r) for r in cur.fetchall()]})

        # GET — один анализ
        if method == "GET" and action == "get":
            analysis_id = qs.get("id")
            cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            cur.execute(
                f"SELECT * FROM {tbl('seo_analyses')} WHERE id = %s AND salon_id = %s",
                (analysis_id, salon_id)
            )
            row = cur.fetchone()
            if not row: return err("not_found", 404)
            result = dict(row)
            if result.get("report"):
                try: result["report_parsed"] = json.loads(result["report"])
                except: pass
            return ok(result)

        # POST — запустить анализ
        if method == "POST":
            body = json.loads(event.get("body") or "{}")
            url = (body.get("url") or "").strip()
            is_main = body.get("is_main_page", False)
            is_background = body.get("is_background", False)

            if not url:
                return err("no_url", 400)

            # Нормализуем URL
            if not url.startswith("http"):
                url = "https://" + url

            # Определяем стоимость: повтор дешевле
            cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
            cur.execute(
                f"SELECT id FROM {tbl('seo_analyses')} WHERE salon_id = %s AND url = %s",
                (salon_id, url)
            )
            existing = cur.fetchone()
            cost = ENERGY_REPEAT if existing else (ENERGY_MAIN if is_main else ENERGY_PAGE)

            # Фоновый режим (при добавлении сайта) — бесплатно
            if is_background:
                cost = 0

            balance = get_balance(conn, salon_id)
            if cost > 0 and balance < cost:
                return err("no_energy", 402)

            # Парсим страницу
            try:
                page_data = fetch_page(url)
            except Exception as e:
                return err(f"fetch_error: {str(e)}", 422)

            # Анализ через ИИ
            salon_ctx = get_salon_context(conn, salon_id)
            try:
                report = analyze_with_ai(page_data, salon_ctx)
            except Exception as e:
                return err(f"ai_error: {str(e)}", 500)

            # Списываем энергию
            if cost > 0:
                deduct(conn, salon_id, user["id"], cost, "seo_analyze")

            # Сохраняем/обновляем в БД
            report_json = json.dumps(report, ensure_ascii=False)
            if existing:
                cur.execute(
                    f"UPDATE {tbl('seo_analyses')} SET url=%s, status='done', title=%s, description=%s, "
                    f"h1=%s, keywords=%s, report=%s, score=%s, energy_spent=%s, updated_at=now() "
                    f"WHERE id=%s",
                    (url, page_data["title"], page_data["description"],
                     (page_data["headings"].get("h1") or [""])[0],
                     page_data["keywords"], report_json, report.get("score"), cost, existing["id"])
                )
                analysis_id = existing["id"]
            else:
                cur.execute(
                    f"INSERT INTO {tbl('seo_analyses')} "
                    f"(salon_id, url, is_main_page, status, title, description, h1, keywords, report, score, energy_spent) "
                    f"VALUES (%s,%s,%s,'done',%s,%s,%s,%s,%s,%s,%s) RETURNING id",
                    (salon_id, url, is_main, page_data["title"], page_data["description"],
                     (page_data["headings"].get("h1") or [""])[0],
                     page_data["keywords"], report_json, report.get("score"), cost)
                )
                analysis_id = cur.fetchone()["id"]

            conn.commit()
            balance_after = get_balance(conn, salon_id)

            return ok({
                "analysis_id": analysis_id,
                "url": url,
                "page_data": page_data,
                "report": report,
                "score": report.get("score"),
                "energy_spent": cost,
                "energy_balance": balance_after,
            })

        # POST — сохранить website_url в профиль салона (без анализа)
        if method == "POST" and action == "save_url":
            body = json.loads(event.get("body") or "{}")
            url = (body.get("url") or "").strip()
            cur = conn.cursor()
            cur.execute(f"UPDATE {tbl('salons')} SET website_url = %s WHERE id = %s", (url or None, salon_id))
            conn.commit()
            return ok({"saved": True})

        return err("invalid_request", 400)

    finally:
        conn.close()