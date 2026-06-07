"""Глубокий SEO-анализ сайта для администратора — без привязки к салону. Работает через polza.ai (GPT-4o)."""
import json
import os
import re
import time
import urllib.request
import urllib.parse
import html

ADMIN_TOKEN = "Sss07011974ssS"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token",
}

def ok(data): return {"statusCode": 200, "headers": CORS, "body": json.dumps(data, ensure_ascii=False, default=str)}
def err(msg, code=400): return {"statusCode": code, "headers": CORS, "body": json.dumps({"error": msg}, ensure_ascii=False)}


def fetch_page(url: str) -> dict:
    """Загружает HTML, замеряет время, размер, статус и извлекает все SEO-данные."""
    if not url.startswith("http"):
        url = "https://" + url
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept-Encoding": "identity",
        "Cache-Control": "no-cache",
    })
    t0 = time.time()
    response = urllib.request.urlopen(req, timeout=20)
    raw = response.read()
    load_time_ms = int((time.time() - t0) * 1000)
    http_status = response.status
    page_size_kb = round(len(raw) / 1024, 1)

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
        rb = urllib.request.urlopen(urllib.request.Request(f"{base}/robots.txt", headers={"User-Agent": "Mozilla/5.0"}), timeout=5)
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
                sr = urllib.request.urlopen(urllib.request.Request(sm, headers={"User-Agent": "Mozilla/5.0"}), timeout=5)
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
    def get_tag(pattern, text):
        m = re.search(pattern, text, re.IGNORECASE | re.DOTALL)
        return html.unescape(m.group(1).strip()) if m else ""

    def get_all_meta(name, body):
        patterns = [
            rf'<meta[^>]+name=["\']' + re.escape(name) + r'["\'][^>]+content=["\'](.*?)["\']',
            rf'<meta[^>]+content=["\'](.*?)["\'][^>]+name=["\']' + re.escape(name) + r'["\']',
        ]
        for p in patterns:
            m = re.search(p, body, re.IGNORECASE)
            if m:
                return html.unescape(m.group(1).strip())
        return ""

    def get_og(prop, body):
        m = re.search(rf'<meta[^>]+property=["\']og:{prop}["\'][^>]+content=["\'](.*?)["\']', body, re.IGNORECASE)
        if not m:
            m = re.search(rf'<meta[^>]+content=["\'](.*?)["\'][^>]+property=["\']og:{prop}["\']', body, re.IGNORECASE)
        return html.unescape(m.group(1).strip()) if m else ""

    def get_twitter(prop, body):
        patterns = [
            rf'<meta[^>]+name=["\']twitter:{re.escape(prop)}["\'][^>]+content=["\'](.*?)["\']',
            rf'<meta[^>]+content=["\'](.*?)["\'][^>]+name=["\']twitter:{re.escape(prop)}["\']',
            rf'<meta[^>]+property=["\']twitter:{re.escape(prop)}["\'][^>]+content=["\'](.*?)["\']',
        ]
        for p in patterns:
            m = re.search(p, body, re.IGNORECASE)
            if m:
                return html.unescape(m.group(1).strip())
        return ""

    title = get_tag(r"<title[^>]*>(.*?)</title>", body)
    description = get_all_meta("description", body)
    keywords = get_all_meta("keywords", body)
    robots = get_all_meta("robots", body)
    og_title = get_og("title", body)
    og_description = get_og("description", body)
    og_image = get_og("image", body)
    og_type = get_og("type", body)
    og_url = get_og("url", body)

    twitter_card = get_twitter("card", body)
    twitter_title = get_twitter("title", body)
    twitter_description = get_twitter("description", body)

    canonical = get_tag(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\'](.*?)["\']', body)
    if not canonical:
        canonical = get_tag(r'<link[^>]+href=["\'](.*?)["\'][^>]+rel=["\']canonical["\']', body)
    hreflang_links = re.findall(r'<link[^>]+hreflang=["\']([^"\']+)["\']', body, re.IGNORECASE)

    # Заголовки — все без ограничения
    headings = {}
    for level in range(1, 7):
        found = re.findall(rf"<h{level}[^>]*>(.*?)</h{level}>", body, re.IGNORECASE | re.DOTALL)
        clean = [re.sub(r"<[^>]+>", "", h).strip() for h in found]
        clean = [html.unescape(h) for h in clean if h]
        if clean:
            headings[f"h{level}"] = clean

    # Schema.org — типы и сырой JSON первого блока
    schema_blocks = re.findall(r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', body, re.IGNORECASE | re.DOTALL)
    schema_types = []
    schema_raw = ""
    for blk in schema_blocks:
        try:
            obj = json.loads(blk.strip())
            t = obj.get("@type") if isinstance(obj, dict) else None
            if t:
                schema_types.append(t if isinstance(t, str) else str(t))
            if not schema_raw:
                schema_raw = json.dumps(obj, ensure_ascii=False, indent=2)
        except Exception:
            pass

    # Основной текст (без скриптов/стилей)
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
    text_preview = text[:2000]

    # Ссылки
    domain = urllib.parse.urlparse(url).netloc
    all_links = re.findall(r'href=["\']([^"\'#\s]+)["\']', body, re.IGNORECASE)
    internal_links = [l for l in all_links if domain in l or (l.startswith("/") and not l.startswith("//"))]
    external_links = [l for l in all_links if l.startswith("http") and domain not in l]

    # Изображения
    images = re.findall(r"<img([^>]*)>", body, re.IGNORECASE)
    images_no_alt = [img for img in images if "alt=" not in img.lower() or re.search(r'alt=["\'\s]*["\']', img)]
    images_with_lazy = [img for img in images if "loading" in img.lower()]

    has_viewport = bool(re.search(r'<meta[^>]+name=["\']viewport["\']', body, re.IGNORECASE))
    has_charset = bool(re.search(r'<meta[^>]+charset', body, re.IGNORECASE))
    title_len = len(title)
    desc_len = len(description)

    return {
        "url": url,
        "title": title,
        "title_len": title_len,
        "description": description,
        "desc_len": desc_len,
        "keywords": keywords,
        "robots": robots,
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
        "text_preview": text_preview,
        "word_count": word_count,
        "internal_links": len(internal_links),
        "external_links": len(external_links),
        "images_count": len(images),
        "images_no_alt": len(images_no_alt),
        "images_lazy": len(images_with_lazy),
        "has_viewport": has_viewport,
        "has_charset": has_charset,
    }


def call_ai(messages: list, max_tokens: int = 2500) -> str:
    """Вызов GPT-4o через polza.ai."""
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
    with urllib.request.urlopen(req, timeout=25) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data["choices"][0]["message"]["content"].strip()


def deep_analyze(page_data: dict) -> dict:
    """GPT-4o делает глубокий SEO-анализ без контекста салона."""
    headings_str = ""
    for level, texts in page_data.get("headings", {}).items():
        headings_str += f"{level.upper()}: {' | '.join(texts[:5])}\n"

    schema_str = ", ".join(page_data.get("schema_types", [])) or "не найдено"
    domain = urllib.parse.urlparse(page_data["url"]).netloc

    system = """Ты — эксперт-сеошник с 10+ лет опыта. Анализируешь любые сайты.
КРИТИЧЕСКИ ВАЖНО: в каждом поле suggestion/example/fix пиши ПОЛНЫЙ готовый код/текст для вставки без доработки.
Для мета-тегов — полный HTML-тег с реальным текстом. Для h1 — полный тег. Для schema — полный JSON-LD блок.
Никаких заглушек "[название]" — только конкретные финальные варианты на основе контента сайта.
Отвечай ТОЛЬКО валидным JSON без markdown-блоков."""

    prompt = f"""SEO-аудит страницы {page_data['url']}

МЕТА: Title={page_data['title']!r}({page_data['title_len']}с) | Desc={page_data['description']!r}({page_data['desc_len']}с) | Keywords={page_data['keywords']!r} | Robots={page_data['robots']!r} | Canonical={page_data['canonical']!r}
OG: title={page_data['og_title']!r} | desc={page_data['og_description']!r} | image={'есть' if page_data['og_image'] else 'НЕТ'} | type={page_data['og_type']!r} | url={page_data['og_url']!r}
Twitter: card={page_data['twitter_card']!r} | title={page_data['twitter_title']!r}
СТРУКТУРА: {headings_str.strip() or 'заголовков нет'}
Schema.org: {schema_str} | Hreflang: {', '.join(page_data.get('hreflang', [])) or 'нет'}
ТЕХНИКА: viewport={'✓' if page_data['has_viewport'] else '✗'} | charset={'✓' if page_data['has_charset'] else '✗'} | links={page_data['internal_links']}int/{page_data['external_links']}ext | img={page_data['images_count']}(без alt:{page_data['images_no_alt']})
КОНТЕНТ: {page_data['word_count']} слов | {page_data['text_preview']}

Верни JSON:
{{
  "score": <0-100>,
  "grade": "<A|B|C|D|F>",
  "summary": "<3-4 предложения>",
  "critical": [{{"issue":"","impact":"","fix":"","example":"<полный HTML-тег или код>"}}],
  "improvements": [{{"area":"","current":"","better":"","example":"<полный HTML-тег или текст>","priority":"high|medium|low"}}],
  "meta_audit": {{
    "title": {{"status":"good|warn|bad","issue":"","suggestion":"<title>...</title>"}},
    "description": {{"status":"good|warn|bad","issue":"","suggestion":"<meta name='description' content='конкретный текст 120-160 симв.'>"}},
    "h1": {{"status":"good|warn|bad","issue":"","suggestion":"<h1>конкретный текст</h1>"}},
    "canonical": {{"status":"good|warn|bad","issue":"","suggestion":"<link rel='canonical' href='https://{domain}/'>"}},
    "og": {{"status":"good|warn|bad","issue":"","suggestion":"<полные OG-теги которых не хватает>"}},
    "twitter": {{"status":"good|warn|bad","issue":"","suggestion":"<meta name='twitter:card' content='summary_large_image'> и др."}},
    "keywords": {{"status":"good|warn|bad","issue":"","suggestion":"<meta name='keywords' content='конкретные ключевые слова через запятую'>"}},
    "robots": {{"status":"good|warn|bad","issue":"","suggestion":"<meta name='robots' content='index, follow'>"}}
  }},
  "content_audit": {{
    "word_count_status":"good|warn|bad",
    "word_count_comment":"",
    "readability":"",
    "keywords_density":"",
    "cta_present":true,
    "cta_comment":"",
    "uniqueness_risk":""
  }},
  "technical_audit": {{
    "mobile":{{"status":"good|warn|bad","comment":""}},
    "schema":{{"status":"good|warn|bad","comment":"","recommended":"","schema_jsonld":"<полный script type=application/ld+json блок для этого сайта>"}},
    "images":{{"status":"good|warn|bad","comment":""}},
    "links":{{"status":"good|warn|bad","comment":""}}
  }},
  "keyword_suggestions": {{
    "primary": ["<главный ключевой запрос>","<2>","<3>"],
    "secondary": ["<LSI-запрос 1>","<2>","<3>","<4>","<5>"],
    "long_tail": ["<длинный хвост 1>","<2>","<3>"],
    "comment": "<советы по внедрению ключей в контент>"
  }},
  "quick_wins": ["<1>","<2>","<3>","<4>","<5>"],
  "growth_opportunities": ["<1>","<2>","<3>"]
}}"""

    raw = call_ai([{"role": "system", "content": system}, {"role": "user", "content": prompt}])
    raw = re.sub(r"^```json\s*", "", raw)
    raw = re.sub(r"^```\s*", "", raw)
    raw = re.sub(r"\s*```$", "", raw)
    return json.loads(raw)


def handler(event: dict, context) -> dict:
    """Глубокий SEO-анализ любого сайта для администратора. Без привязки к салону, через GPT-4o."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    token = (event.get("headers") or {}).get("X-Admin-Token", "")
    if token != ADMIN_TOKEN:
        return err("Forbidden", 403)

    body = json.loads(event.get("body") or "{}")
    url = (body.get("url") or "").strip()

    if not url:
        return err("URL не указан", 400)

    if not url.startswith("http"):
        url = "https://" + url

    try:
        page_data = fetch_page(url)
    except Exception as e:
        return err(f"Не удалось загрузить страницу: {str(e)}", 422)

    try:
        report = deep_analyze(page_data)
    except Exception as e:
        return err(f"Ошибка ИИ-анализа: {str(e)}", 500)

    return ok({
        "url": url,
        "page_data": page_data,
        "report": report,
        "score": report.get("score"),
        "grade": report.get("grade"),
    })
