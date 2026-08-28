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

def package_covers_usage(conn, user_id: int) -> bool:
    """Если у пользователя активен пакет развития и суточный лимит использований (общий на
    все инструменты, скользящее окно 24ч) не исчерпан — использование бесплатное, логируем
    и возвращаем True (энергия при этом не списывается)."""
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"""SELECT pp.daily_limit_per_tool FROM {tbl('user_packages')} up
            JOIN {tbl('package_plans')} pp ON pp.code = up.plan_code
            WHERE up.user_id=%s AND up.status='active' AND up.expires_at > NOW()
            ORDER BY up.expires_at DESC LIMIT 1""",
        (user_id,)
    )
    pkg = cur.fetchone()
    if not pkg:
        return False
    cur2 = conn.cursor()
    cur2.execute(
        f"SELECT COUNT(*) FROM {tbl('tool_usage_log')} WHERE user_id=%s AND tool_key='seo_analyzer' AND used_at > NOW() - INTERVAL '24 hours'",
        (user_id,)
    )
    used = cur2.fetchone()[0] or 0
    if used >= pkg["daily_limit_per_tool"]:
        return False
    cur2.execute(f"INSERT INTO {tbl('tool_usage_log')} (user_id, tool_key) VALUES (%s,'seo_analyzer')", (user_id,))
    conn.commit()
    return True

def fetch_page(url: str) -> dict:
    """Загружает HTML страницы, замеряет скорость и извлекает SEO-данные."""
    import time
    if not url.startswith("http"):
        url = "https://" + url
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "ru-RU,ru;q=0.9,en;q=0.8",
        "Accept-Encoding": "identity",
    })
    t0 = time.time()
    response = urllib.request.urlopen(req, timeout=15)
    raw = response.read()
    load_time_ms = int((time.time() - t0) * 1000)
    page_size_kb = round(len(raw) / 1024, 1)
    http_status = response.status
    content_type = response.headers.get("Content-Type", "")
    charset = "utf-8"
    if "charset=" in content_type:
        charset = content_type.split("charset=")[-1].strip().split(";")[0].strip()
    try:
        body = raw.decode(charset, errors="replace")
    except Exception:
        body = raw.decode("utf-8", errors="replace")

    # Проверяем robots.txt и sitemap
    parsed = urllib.parse.urlparse(url)
    base = f"{parsed.scheme}://{parsed.netloc}"
    robots_exists = False
    sitemap_url = ""
    try:
        rb = urllib.request.urlopen(
            urllib.request.Request(f"{base}/robots.txt", headers={"User-Agent": "Mozilla/5.0"}), timeout=5
        )
        rb_text = rb.read().decode("utf-8", errors="replace")
        robots_exists = True
        m = re.search(r"Sitemap:\s*(\S+)", rb_text, re.IGNORECASE)
        if m:
            sitemap_url = m.group(1).strip()
    except Exception:
        pass
    if not sitemap_url:
        for sm in [f"{base}/sitemap.xml", f"{base}/sitemap_index.xml"]:
            try:
                sr = urllib.request.urlopen(
                    urllib.request.Request(sm, headers={"User-Agent": "Mozilla/5.0"}), timeout=4
                )
                if sr.status == 200:
                    sitemap_url = sm
                    break
            except Exception:
                pass

    page_data = parse_html(body, url)
    page_data.update({
        "http_status": http_status,
        "load_time_ms": load_time_ms,
        "page_size_kb": page_size_kb,
        "robots_exists": robots_exists,
        "sitemap_url": sitemap_url,
    })
    return page_data

def parse_html(body: str, url: str) -> dict:
    """Извлекает SEO-метаданные и текст из HTML."""
    def get_tag(pattern, text):
        m = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
        return html.unescape(m.group(1).strip()) if m else ""

    def get_meta(name, body):
        for p in [
            rf'<meta[^>]+name=["\']' + re.escape(name) + r'["\'][^>]+content=["\'](.*?)["\']',
            rf'<meta[^>]+content=["\'](.*?)["\'][^>]+name=["\']' + re.escape(name) + r'["\']',
        ]:
            m = re.search(p, body, re.IGNORECASE)
            if m: return html.unescape(m.group(1).strip())
        return ""

    def get_og(prop, body):
        for p in [
            rf'<meta[^>]+property=["\']og:{re.escape(prop)}["\'][^>]+content=["\'](.*?)["\']',
            rf'<meta[^>]+content=["\'](.*?)["\'][^>]+property=["\']og:{re.escape(prop)}["\']',
        ]:
            m = re.search(p, body, re.IGNORECASE)
            if m: return html.unescape(m.group(1).strip())
        return ""

    def get_twitter(prop, body):
        for p in [
            rf'<meta[^>]+name=["\']twitter:{re.escape(prop)}["\'][^>]+content=["\'](.*?)["\']',
            rf'<meta[^>]+content=["\'](.*?)["\'][^>]+name=["\']twitter:{re.escape(prop)}["\']',
            rf'<meta[^>]+property=["\']twitter:{re.escape(prop)}["\'][^>]+content=["\'](.*?)["\']',
        ]:
            m = re.search(p, body, re.IGNORECASE)
            if m: return html.unescape(m.group(1).strip())
        return ""

    title = get_tag(r"<title[^>]*>(.*?)</title>", body)
    description = get_meta("description", body)
    keywords = get_meta("keywords", body)
    robots_meta = get_meta("robots", body)
    og_title = get_og("title", body)
    og_description = get_og("description", body)
    og_image = get_og("image", body)
    og_type = get_og("type", body)
    og_url = get_og("url", body)
    twitter_card = get_twitter("card", body)
    twitter_title = get_twitter("title", body)
    twitter_description = get_twitter("description", body)

    # Canonical
    canonical = get_tag(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\'](.*?)["\']', body)
    if not canonical:
        canonical = get_tag(r'<link[^>]+href=["\'](.*?)["\'][^>]+rel=["\']canonical["\']', body)

    # Hreflang
    hreflang_links = re.findall(r'<link[^>]+hreflang=["\']([^"\']+)["\']', body, re.IGNORECASE)

    # Заголовки
    headings = {}
    for level in range(1, 7):
        found = re.findall(rf"<h{level}[^>]*>(.*?)</h{level}>", body, re.IGNORECASE | re.DOTALL)
        clean = [re.sub(r"<[^>]+>", "", h).strip() for h in found]
        clean = [html.unescape(h) for h in clean if h]
        if clean:
            headings[f"h{level}"] = clean

    # Schema.org
    schema_blocks = re.findall(r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', body, re.IGNORECASE | re.DOTALL)
    schema_types = []
    schema_raw = ""
    for blk in schema_blocks:
        try:
            obj = json.loads(blk.strip())
            t = obj.get("@type") if isinstance(obj, dict) else None
            if t: schema_types.append(t if isinstance(t, str) else str(t))
            if not schema_raw: schema_raw = json.dumps(obj, ensure_ascii=False, indent=2)
        except Exception:
            pass

    # Текст (без скриптов/стилей/nav/header/footer)
    text = re.sub(r"<script[^>]*>.*?</script>", " ", body, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r"<style[^>]*>.*?</style>", " ", text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r"<nav[^>]*>.*?</nav>", " ", text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r"<footer[^>]*>.*?</footer>", " ", text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r"<header[^>]*>.*?</header>", " ", text, flags=re.DOTALL | re.IGNORECASE)
    text = re.sub(r"<!--.*?-->", " ", text, flags=re.DOTALL)
    text = re.sub(r"<[^>]+>", " ", text)
    text = html.unescape(text)
    text = re.sub(r"\s+", " ", text).strip()
    word_count = len(text.split())
    # Определяем: рендерится ли страница на сервере или это SPA (пустой HTML)
    is_spa_shell = word_count < 50
    text = text[:5000]

    # Ссылки
    domain = urllib.parse.urlparse(url).netloc
    all_links = re.findall(r'href=["\']([^"\'#\s]+)["\']', body, re.IGNORECASE)
    internal = [l for l in all_links if domain in l or (l.startswith("/") and not l.startswith("//"))]
    external = [l for l in all_links if l.startswith("http") and domain not in l]
    # Nofollow
    all_links_raw = re.findall(r'<a([^>]*)>', body, re.IGNORECASE)
    nofollow_count = sum(1 for a in all_links_raw if "nofollow" in a.lower())

    # Изображения
    images = re.findall(r"<img([^>]*)>", body, re.IGNORECASE)
    images_no_alt = [img for img in images if "alt=" not in img.lower() or re.search(r'alt=["\'\s]*["\']', img)]
    images_lazy = [img for img in images if "loading" in img.lower()]

    has_viewport = bool(re.search(r'<meta[^>]+name=["\']viewport["\']', body, re.IGNORECASE))
    has_charset = bool(re.search(r'<meta[^>]+charset', body, re.IGNORECASE))
    has_favicon = bool(re.search(r'<link[^>]+rel=["\'][^"\']*icon[^"\']*["\']', body, re.IGNORECASE))

    print(f"[SEO] URL={url} | title={title!r} | words={word_count} | is_spa={is_spa_shell} | h1={headings.get('h1','')}")
    return {
        "url": url,
        "title": title,
        "title_len": len(title),
        "description": description,
        "desc_len": len(description),
        "keywords": keywords,
        "robots_meta": robots_meta,
        "og_title": og_title,
        "og_description": og_description,
        "og_image": og_image,
        "og_type": og_type,
        "og_url": og_url,
        "twitter_card": twitter_card,
        "twitter_title": twitter_title,
        "twitter_description": twitter_description,
        "canonical": canonical,
        "hreflang": hreflang_links,
        "headings": headings,
        "schema_types": schema_types,
        "schema_raw": schema_raw,
        "text_preview": text,
        "word_count": word_count,
        "is_spa_shell": is_spa_shell,
        "internal_links": len(internal),
        "external_links": len(external),
        "nofollow_links": nofollow_count,
        "images_count": len(images),
        "images_no_alt": len(images_no_alt),
        "images_lazy": len(images_lazy),
        "has_viewport": has_viewport,
        "has_charset": has_charset,
        "has_favicon": has_favicon,
    }

def call_ai(messages: list, max_tokens: int = 2500) -> str:
    """Вызов ИИ через polza.ai (работает из любого региона)."""
    api_key = os.environ.get("POLZA_AI_API_KEY", "")
    if not api_key:
        raise ValueError("POLZA_AI_API_KEY не задан")
    payload = json.dumps({
        "model": "openai/gpt-4o",
        "messages": messages,
        "temperature": 0.2,
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
    """GPT-4o через polza.ai анализирует страницу и выдаёт развёрнутый отчёт."""
    headings_str = ""
    for level, texts in page_data.get("headings", {}).items():
        headings_str += f"{level.upper()}: {' | '.join(texts[:5])}\n"
    schema_str = ", ".join(page_data.get("schema_types", [])) or "не найдено"
    domain = urllib.parse.urlparse(page_data["url"]).netloc

    parsed_url = urllib.parse.urlparse(page_data["url"])
    path = parsed_url.path.rstrip("/") or "/"
    is_main_page = path == "/"
    page_type_note = "ГЛАВНАЯ СТРАНИЦА сайта" if is_main_page else f"ПОДСТРАНИЦА сайта: {path}"
    spa_warning = "\n⚠️ ВНИМАНИЕ: страница рендерится через JavaScript (SPA/React/Vue). HTML пришёл пустым — мета-теги и заголовки взяты из исходного HTML, но видимый текст страницы недоступен для краулеров без JS-рендеринга. Это КРИТИЧЕСКАЯ SEO-проблема — нужен SSR или prerendering." if page_data.get("is_spa_shell") else ""

    system = f"""Ты — эксперт-сеошник с 10+ лет опыта, специализируешься на салонах красоты.
КРИТИЧЕСКИ ВАЖНО: анализируй СТРОГО ТУ СТРАНИЦУ, URL которой передан. Не придумывай контент — работай только с тем, что извлечено из HTML.
В каждом поле suggestion/example/fix пиши ПОЛНЫЙ готовый HTML-тег или код для вставки без доработки.
Никаких заглушек "[название]" — только конкретные финальные варианты на основе реального контента страницы.
Отвечай ТОЛЬКО валидным JSON без markdown-блоков.

{salon_context}"""

    prompt = f"""SEO-аудит страницы сайта.

ТИП: {page_type_note}{spa_warning}
URL: {page_data['url']}
МЕТА: Title={page_data['title']!r}({page_data['title_len']}с) | Desc={page_data['description']!r}({page_data['desc_len']}с) | Keywords={page_data['keywords']!r} | Robots={page_data['robots_meta']!r}
Canonical={page_data['canonical']!r} | OG Image={'есть' if page_data['og_image'] else 'НЕТ'} | OG URL={page_data['og_url']!r}
Twitter: card={page_data['twitter_card']!r} | title={page_data.get('twitter_title','')!r}
Schema.org: {schema_str} | Hreflang: {', '.join(page_data.get('hreflang', [])) or 'нет'}
ЗАГОЛОВКИ H1-H6: {headings_str.strip() or 'нет (критично!)'}
ТЕХНИКА: viewport={'✓' if page_data['has_viewport'] else '✗'} | charset={'✓' if page_data.get('has_charset') else '✗'} | favicon={'✓' if page_data['has_favicon'] else '✗'} | img={page_data['images_count']}(без alt:{page_data['images_no_alt']}) | links={page_data['internal_links']}int/{page_data['external_links']}ext(nofollow:{page_data['nofollow_links']})
ТЕКСТ СТРАНИЦЫ ({page_data['word_count']} слов): {page_data['text_preview'] or '(пусто — SPA/JS-рендеринг)'}

ВАЖНО: все рекомендации специфичны для ЭТОЙ конкретной страницы ({page_data['url']}), не для сайта в целом.

Верни JSON:
{{
  "score": <0-100>,
  "grade": "<A|B|C|D|F>",
  "summary": "<3-4 предложения об этой конкретной странице>",
  "critical": [{{"issue":"","impact":"","fix":"","example":"<полный HTML-тег или код>"}}],
  "improvements": [{{"area":"","current":"","better":"","example":"<полный HTML-тег или текст>","priority":"high|medium|low"}}],
  "meta": {{
    "title_status":"good|warn|bad","title_issue":"","title_suggestion":"<title>конкретный текст</title>",
    "description_status":"good|warn|bad","description_issue":"","description_suggestion":"<meta name='description' content='конкретный текст 120-160 симв.'>",
    "h1_status":"good|warn|bad","h1_issue":"","h1_suggestion":"<h1>конкретный текст</h1>",
    "canonical_status":"good|warn|bad","canonical_issue":"","canonical_suggestion":"<link rel='canonical' href='https://{domain}{path or '/'}'>",
    "og_status":"good|warn|bad","og_issue":"","og_suggestion":"<полные OG-теги с реальными значениями>",
    "twitter_status":"good|warn|bad","twitter_issue":"","twitter_suggestion":"<meta name='twitter:card' content='summary_large_image'>",
    "keywords_status":"good|warn|bad","keywords_issue":"","keywords_suggestion":"<meta name='keywords' content='конкретные ключевые слова'>",
    "schema_status":"good|warn|bad","schema_issue":"","schema_jsonld":"<script type='application/ld+json'>{{полный JSON-LD для этого салона}}</script>"
  }},
  "content_analysis": {{
    "word_count_status":"good|warn|bad","word_count_comment":"",
    "readability":"",
    "cta_present":true,"cta_recommendation":"",
    "services_mentioned":true,"services_recommendation":"",
    "local_seo":true,"local_seo_recommendation":"",
    "uniqueness_risk":""
  }},
  "technical_audit": {{
    "mobile":{{"status":"good|warn|bad","comment":""}},
    "schema":{{"status":"good|warn|bad","comment":"","recommended":""}},
    "images":{{"status":"good|warn|bad","comment":""}},
    "links":{{"status":"good|warn|bad","comment":""}}
  }},
  "keyword_suggestions": {{
    "primary":["<запрос 1>","<2>","<3>"],
    "secondary":["<LSI 1>","<2>","<3>","<4>","<5>"],
    "long_tail":["<длинный хвост 1>","<2>","<3>"],
    "comment":"<советы по внедрению>"
  }},
  "quick_wins":["<1>","<2>","<3>","<4>","<5>"],
  "growth_opportunities":["<1>","<2>","<3>"]
}}"""

    raw = call_ai([{"role": "system", "content": system}, {"role": "user", "content": prompt}], max_tokens=3500)
    raw = re.sub(r"^```json\s*", "", raw)
    raw = re.sub(r"^```\s*", "", raw)
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

            # Пакет развития покрывает использование в рамках суточного лимита — тогда энергия
            # не списывается вовсе (cost обнуляем, но uses_package помним для метки в ответе)
            uses_package = cost > 0 and package_covers_usage(conn, user["id"])
            if uses_package:
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