"""Глубокий SEO-анализ сайта для администратора — без привязки к салону. Работает через polza.ai (GPT-4o)."""
import json
import os
import re
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
    """Загружает HTML и извлекает все SEO-данные для глубокого анализа."""
    if not url.startswith("http"):
        url = "https://" + url
    req = urllib.request.Request(url, headers={
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept-Encoding": "identity",
        "Cache-Control": "no-cache",
    })
    response = urllib.request.urlopen(req, timeout=20)
    raw = response.read()
    content_type = response.headers.get("Content-Type", "")
    charset = "utf-8"
    if "charset=" in content_type:
        charset = content_type.split("charset=")[-1].strip().split(";")[0].strip()
    try:
        body = raw.decode(charset, errors="replace")
    except Exception:
        body = raw.decode("utf-8", errors="replace")
    return parse_html(body, url)


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

    title = get_tag(r"<title[^>]*>(.*?)</title>", body)
    description = get_all_meta("description", body)
    keywords = get_all_meta("keywords", body)
    robots = get_all_meta("robots", body)
    og_title = get_og("title", body)
    og_description = get_og("description", body)
    og_image = get_og("image", body)
    og_type = get_og("type", body)

    # Twitter cards
    twitter_title = get_all_meta("twitter:title", body)
    twitter_description = get_all_meta("twitter:description", body)

    # Canonical + alternate
    canonical = get_tag(r'<link[^>]+rel=["\']canonical["\'][^>]+href=["\'](.*?)["\']', body)
    hreflang_links = re.findall(r'<link[^>]+hreflang=["\']([^"\']+)["\']', body, re.IGNORECASE)

    # Заголовки
    headings = {}
    for level in range(1, 7):
        found = re.findall(rf"<h{level}[^>]*>(.*?)</h{level}>", body, re.IGNORECASE | re.DOTALL)
        clean = [re.sub(r"<[^>]+>", "", h).strip() for h in found]
        clean = [html.unescape(h) for h in clean if h]
        if clean:
            headings[f"h{level}"] = clean

    # Структурированные данные (schema.org)
    schema_blocks = re.findall(r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', body, re.IGNORECASE | re.DOTALL)
    schema_types = []
    for blk in schema_blocks:
        try:
            obj = json.loads(blk.strip())
            t = obj.get("@type") if isinstance(obj, dict) else None
            if t:
                schema_types.append(t if isinstance(t, str) else str(t))
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
    text_preview = text[:6000]

    # Ссылки
    domain = urllib.parse.urlparse(url).netloc
    all_links = re.findall(r'href=["\']([^"\'#\s]+)["\']', body, re.IGNORECASE)
    internal_links = [l for l in all_links if domain in l or (l.startswith("/") and not l.startswith("//"))]
    external_links = [l for l in all_links if l.startswith("http") and domain not in l]

    # Изображения
    images = re.findall(r"<img([^>]*)>", body, re.IGNORECASE)
    images_no_alt = [img for img in images if "alt=" not in img.lower() or re.search(r'alt=["\'\s]*["\']', img)]
    images_with_lazy = [img for img in images if "loading" in img.lower()]

    # Viewport, charset, mobile
    has_viewport = bool(re.search(r'<meta[^>]+name=["\']viewport["\']', body, re.IGNORECASE))
    has_charset = bool(re.search(r'<meta[^>]+charset', body, re.IGNORECASE))

    # Подсчёт слов в title и description
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
        "twitter_title": twitter_title,
        "twitter_description": twitter_description,
        "canonical": canonical,
        "hreflang": hreflang_links,
        "headings": headings,
        "schema_types": schema_types,
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


def call_ai(messages: list, max_tokens: int = 4000) -> str:
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
    with urllib.request.urlopen(req, timeout=90) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data["choices"][0]["message"]["content"].strip()


def deep_analyze(page_data: dict) -> dict:
    """GPT-4o делает глубокий SEO-анализ без контекста салона."""
    headings_str = ""
    for level, texts in page_data.get("headings", {}).items():
        headings_str += f"{level.upper()}: {' | '.join(texts[:8])}\n"

    schema_str = ", ".join(page_data.get("schema_types", [])) or "не найдено"

    system = """Ты — эксперт-сеошник с 10+ лет опыта. Анализируешь любые сайты — не только салоны.
ВАЖНО: в каждом поле suggestion/example/fix пиши ПОЛНЫЙ готовый код или текст, который можно скопировать и вставить без доработки.
Для мета-тегов — полный HTML-тег. Для h1 — полный тег с текстом. Для canonical — полный тег. Никаких шаблонных заглушек вроде "[название]" или "[текст]" — только конкретный финальный вариант на основе анализа сайта.
Отвечай ТОЛЬКО валидным JSON без markdown-блоков и лишних символов."""

    prompt = f"""Выполни глубокий SEO-аудит страницы.

URL: {page_data['url']}

═══ МЕТА-ДАННЫЕ ═══
Title: {page_data['title'] or '❌ отсутствует'} ({page_data['title_len']} симв.)
Description: {page_data['description'] or '❌ отсутствует'} ({page_data['desc_len']} симв.)
Keywords: {page_data['keywords'] or 'отсутствует'}
Robots: {page_data['robots'] or 'не задан (ок)'}
Canonical: {page_data['canonical'] or '❌ отсутствует'}

═══ OPEN GRAPH ═══
OG Title: {page_data['og_title'] or '❌ отсутствует'}
OG Description: {page_data['og_description'] or '❌ отсутствует'}
OG Image: {'✓ есть' if page_data['og_image'] else '❌ отсутствует'}
OG Type: {page_data['og_type'] or 'не задан'}
Twitter Title: {page_data['twitter_title'] or 'отсутствует'}

═══ СТРУКТУРА ═══
Заголовки:
{headings_str or '❌ заголовков не найдено'}

Schema.org разметка: {schema_str}
Hreflang: {', '.join(page_data.get('hreflang', [])) or 'нет'}

═══ ТЕХНИЧЕСКИЕ ПАРАМЕТРЫ ═══
Viewport (mobile-friendly): {'✓' if page_data['has_viewport'] else '❌ отсутствует'}
Charset: {'✓' if page_data['has_charset'] else '❌ отсутствует'}
Внутренних ссылок: {page_data['internal_links']}
Внешних ссылок: {page_data['external_links']}
Изображений: {page_data['images_count']} (без alt: {page_data['images_no_alt']}, с lazy-load: {page_data['images_lazy']})

═══ КОНТЕНТ ═══
Слов на странице: {page_data['word_count']}
Текст (первые 6000 симв.):
{page_data['text_preview']}

═══ ФОРМАТ ОТВЕТА ═══
Верни JSON строго такой структуры:
{{
  "score": <0-100>,
  "grade": "<A|B|C|D|F>",
  "summary": "<3-4 предложения общего вывода с главными проблемами и потенциалом>",
  "critical": [
    {{"issue": "<критическая проблема>", "impact": "<влияние на SEO>", "fix": "<конкретное решение>", "example": "<ПОЛНЫЙ готовый HTML-тег или текст для вставки — конкретный, без заглушек>"}}
  ],
  "improvements": [
    {{"area": "<область>", "current": "<что сейчас есть>", "better": "<как должно быть>", "example": "<ПОЛНЫЙ готовый HTML-тег или конкретный текст для вставки без доработки>", "priority": "high|medium|low"}}
  ],
  "meta_audit": {{
    "title": {{"status": "good|warn|bad", "issue": "<проблема>", "suggestion": "<ПОЛНЫЙ HTML-тег, например: <title>Про Диалог — Платформа роста салонов красоты</title>. Конкретный текст, никаких заглушек.>"}},
    "description": {{"status": "good|warn|bad", "issue": "<проблема>", "suggestion": "<ПОЛНЫЙ HTML-тег, например: <meta name='description' content='...'> — конкретный текст 120-160 симв., подобранный по контенту страницы>"}},
    "h1": {{"status": "good|warn|bad", "issue": "<проблема>", "suggestion": "<ПОЛНЫЙ тег h1, например: <h1>Про Диалог — Платформа роста салона</h1> — конкретный текст>"}},
    "canonical": {{"status": "good|warn|bad", "issue": "<проблема или ок>", "suggestion": "<ПОЛНЫЙ HTML-тег canonical если отсутствует, например: <link rel='canonical' href='https://example.com/'>"}},
    "og": {{"status": "good|warn|bad", "issue": "<проблема или ок>", "suggestion": "<ПОЛНЫЕ HTML-теги OG которых не хватает, каждый с реальными значениями>"}}
  }},
  "content_audit": {{
    "word_count_status": "good|warn|bad",
    "word_count_comment": "<оценка объёма контента>",
    "readability": "<оценка читаемости и структуры>",
    "keywords_density": "<оценка плотности ключевых слов>",
    "cta_present": true,
    "cta_comment": "<оценка призывов к действию>",
    "uniqueness_risk": "<риски дублирования или тонкого контента>"
  }},
  "technical_audit": {{
    "mobile": {{"status": "good|warn|bad", "comment": "<оценка мобильной версии>"}},
    "schema": {{"status": "good|warn|bad", "comment": "<оценка структурированных данных>", "recommended": "<какие типы schema.org добавить>"}},
    "images": {{"status": "good|warn|bad", "comment": "<оценка изображений>"}},
    "links": {{"status": "good|warn|bad", "comment": "<оценка ссылочной структуры>"}}
  }},
  "quick_wins": ["<быстрое улучшение 1 — можно сделать без разработчика>", "<2>", "<3>", "<4>", "<5>"],
  "growth_opportunities": ["<долгосрочная возможность роста 1>", "<2>", "<3>"]
}}"""

    raw = call_ai([{"role": "system", "content": system}, {"role": "user", "content": prompt}])
    raw = re.sub(r"^```json\s*", "", raw)
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

    # Парсим страницу
    try:
        page_data = fetch_page(url)
    except Exception as e:
        return err(f"Не удалось загрузить страницу: {str(e)}", 422)

    # Глубокий анализ через GPT-4o
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