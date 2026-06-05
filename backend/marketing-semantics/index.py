"""
Семантическое ядро для Яндекс.Директ.
Шаг 1: Вордстат (API Директа v4) — реальная статистика показов по услугам салона.
Шаг 2: ИИ — группировка запросов и подпись намерений.
Стоимость: 1 энергия.
"""
import json
import os
import time
import urllib.request
import urllib.error
import urllib.parse
import psycopg2
import psycopg2.extras

SCHEMA = "t_p84565078_code_expression_proj"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}

DIRECT_API = "https://api.direct.yandex.ru/live/v4/json/"
WORDSTAT_API = "https://api.wordstat.yandex.net/v1/data/by-phrase"

MEDICAL_KEYWORDS = [
    "остеопатия", "массаж", "лечебный массаж", "мануальная терапия",
    "физиотерапия", "рефлексотерапия", "иглоукалывание",
]


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def ok(data):
    return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps(data, ensure_ascii=False, default=str)}


def err(msg, status=400):
    return {"statusCode": status, "headers": CORS,
            "body": json.dumps({"error": msg}, ensure_ascii=False)}


def get_session_user(event, conn):
    sid = (event.get("headers") or {}).get("X-Session-Id", "")
    if not sid:
        return None
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT u.* FROM {SCHEMA}.lk_sessions s JOIN {SCHEMA}.lk_users u ON u.id=s.user_id "
        f"WHERE s.id=%s AND s.expires_at>NOW() AND u.is_active=TRUE", (sid,)
    )
    return cur.fetchone()


def get_salon_data(salon_id, conn):
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(
        f"SELECT name, city, description, avg_check, has_medical_license "
        f"FROM {SCHEMA}.salons WHERE id = %s", (salon_id,)
    )
    salon = cur.fetchone()
    if not salon:
        return None, []
    cur.execute(
        f"SELECT name FROM {SCHEMA}.salon_services "
        f"WHERE salon_id = %s ORDER BY sort_order LIMIT 20", (salon_id,)
    )
    services = cur.fetchall()
    return salon, services


TOOL_KEY_MKT = "mkt_semantics"


def deduct_energy(salon_id, user_id, conn):
    cur = conn.cursor()
    cur.execute(f"SELECT energy_cost FROM {SCHEMA}.tool_costs WHERE tool_key=%s", (TOOL_KEY_MKT,))
    row = cur.fetchone()
    cost = row[0] if row else 1
    cur.execute(f"SELECT credits_balance FROM {SCHEMA}.salons WHERE id=%s FOR UPDATE", (salon_id,))
    bal = cur.fetchone()
    if not bal or int(bal[0]) < cost:
        return False, int(bal[0]) if bal else 0
    cur.execute(f"UPDATE {SCHEMA}.salons SET credits_balance=credits_balance-%s WHERE id=%s", (cost, salon_id))
    cur.execute(
        f"INSERT INTO {SCHEMA}.credit_transactions (salon_id,user_id,action,amount,tool_key,type) "
        f"VALUES (%s,%s,%s,%s,%s,'debit')",
        (salon_id, user_id, "Семантическое ядро", cost, TOOL_KEY_MKT)
    )
    conn.commit()
    return True, cost


# ─── Вордстат API ────────────────────────────────────────────────────────────

def direct_request(method, params):
    token = os.environ.get("YANDEX_DIRECT_TOKEN", "")
    payload = json.dumps({
        "method": method,
        "param": params,
        "locale": "ru",
        "token": token,
    }, ensure_ascii=False).encode("utf-8")
    req = urllib.request.Request(
        DIRECT_API,
        data=payload,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def get_geo_id(city: str) -> list[int]:
    """Возвращает GeoID для города по его названию через Вордстат (приблизительный маппинг)."""
    city_map = {
        "москва": 1, "санкт-петербург": 2, "спб": 2, "петербург": 2,
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
    return [city_map.get(city.lower().strip(), 0)] if city else [0]


def build_seed_phrases(salon, services):
    """Строим базовые фразы для запроса в Вордстат."""
    city = salon.get("city") or ""
    has_license = bool(salon.get("has_medical_license"))

    BANNED = {"остеопатия", "остеопат", "мануальная терапия", "рефлексотерапия",
               "иглоукалывание", "физиотерапия", "лечебный массаж"}

    phrases = []
    for s in services:
        name = s["name"].strip()
        lower = name.lower()
        if not has_license and any(b in lower for b in BANNED):
            name = name.replace("остеопатия", "коррекция осанки").replace(
                "мануальная терапия", "телесные практики").replace(
                "лечебный массаж", "оздоровительный массаж")
        phrases.append(name)
        if city:
            phrases.append(f"{name} {city}")

    # Добавляем общие фразы для салона
    if city:
        phrases.append(f"салон красоты {city}")
        phrases.append(f"массаж {city}")
        phrases.append(f"spa {city}")

    return list(dict.fromkeys(phrases))[:40]  # уникальные, не более 40


def fetch_wordstat(phrases: list[str], geo_ids: list[int]) -> dict[str, int]:
    """
    Получаем статистику показов через новый REST API Яндекс.Вордстат.
    Возвращает словарь {фраза: shows_per_month}.
    """
    token = os.environ.get("YANDEX_DIRECT_TOKEN", "")
    shows_map: dict[str, int] = {}

    region_ids = [str(g) for g in geo_ids if g != 0] or []

    for phrase in phrases[:20]:
        try:
            if region_ids:
                url = WORDSTAT_API + "?phrase=" + urllib.parse.quote(phrase) + "&" + "&".join(f"regionIds={r}" for r in region_ids)
            else:
                url = WORDSTAT_API + "?phrase=" + urllib.parse.quote(phrase)
            req = urllib.request.Request(url, headers={"Authorization": f"OAuth {token}"}, method="GET")
            with urllib.request.urlopen(req, timeout=10) as resp:
                data = json.loads(resp.read().decode("utf-8"))
                shows = int((data.get("data") or [{}])[0].get("shows", 0) if isinstance(data.get("data"), list) else data.get("shows", 0))
                key = phrase.lower().strip()
                if shows > 0:
                    shows_map[key] = shows
                print(f"[Wordstat2] phrase='{phrase}' shows={shows}")
        except Exception as e:
            print(f"[Wordstat2] phrase='{phrase}' error={e}")

    return shows_map


# ─── ИИ ──────────────────────────────────────────────────────────────────────

def call_ai(messages, max_tokens=3500) -> str:
    api_key = os.environ.get("POLZA_AI_API_KEY", "")
    payload = json.dumps({
        "model": "openai/gpt-4.1-mini",
        "messages": messages,
        "temperature": 0.4,
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


def has_medical(services):
    for s in services:
        if any(kw in s["name"].lower() for kw in MEDICAL_KEYWORDS):
            return True
    return False


def build_ai_prompt(salon, services, shows_map: dict[str, int]):
    salon_name = salon["name"]
    city = salon["city"] or "не указан"
    has_license = bool(salon.get("has_medical_license"))
    is_medical = has_medical(services)

    BANNED_WITHOUT_LICENSE = [
        "остеопатия", "остеопат", "мануальная терапия", "мануальный терапевт",
        "рефлексотерапия", "иглоукалывание", "физиотерапия",
        "лечебный массаж", "лечение", "лечить", "медицинский массаж",
    ]

    if not has_license:
        banned_list = ", ".join(f"«{w}»" for w in BANNED_WITHOUT_LICENSE)
        med_note = (
            f"КРИТИЧЕСКИ ВАЖНО: У салона НЕТ медицинской лицензии. "
            f"КАТЕГОРИЧЕСКИ ЗАПРЕЩЕНО использовать слова: {banned_list}."
        )
    else:
        med_note = "У салона есть медицинская лицензия — можно включать медицинские запросы."

    # Топ-80 запросов из Вордстата по показам
    top_queries = sorted(shows_map.items(), key=lambda x: x[1], reverse=True)[:80]
    if top_queries:
        wordstat_block = "Реальные запросы из Яндекс.Вордстат (фраза → показов/мес):\n" + "\n".join(
            f"- {phrase}: {shows}" for phrase, shows in top_queries
        )
    else:
        services_list = [s["name"] for s in services] if services else []
        wordstat_block = "Вордстат недоступен. Услуги салона:\n" + "\n".join(f"- {s}" for s in services_list)

    return f"""Ты — эксперт по контекстной рекламе в Яндекс.Директ для салонов красоты и велнес.

Салон: {salon_name}, город: {city}
{med_note}

{wordstat_block}

Задача: сгруппируй эти запросы в семантическое ядро для Яндекс.Директ.

Правила:
- Используй ТОЛЬКО запросы из списка выше, копируй их ДОСЛОВНО без изменений
- Группируй по услугам / тематике
- Добавь группу «Брендовые / Геолокационные» и «Конкурентные намерения» если есть подходящие запросы
- Для каждого запроса напиши короткое намерение пользователя (2-4 слова)
- frequency, frequency_label и shows — ставь любые заглушки, они будут заменены системой

Верни ТОЛЬКО валидный JSON без markdown-обёртки:
[
  {{
    "group": "название группы",
    "service_tag": "короткий тег",
    "keywords": [
      {{
        "query": "текст запроса ТОЧНО как в списке",
        "frequency": "medium",
        "frequency_label": "Среднечастотный",
        "intent": "намерение пользователя (2-4 слова)",
        "shows": 0
      }}
    ]
  }}
]

Генерируй 5-8 групп, 4-7 запросов в каждой."""


# ─── Handler ─────────────────────────────────────────────────────────────────

def handler(event: dict, context) -> dict:
    """Семантическое ядро: сначала Вордстат (реальные показы), потом ИИ группирует. Стоимость: 1 энергия."""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)

        salon_id = user.get("salon_id")
        if not salon_id:
            return err("Сначала заполните профиль салона", 402)

        salon, services = get_salon_data(salon_id, conn)
        if not salon:
            return err("Салон не найден", 404)

        ok_deduct, val = deduct_energy(salon_id, user["id"], conn)
        if not ok_deduct:
            return err(f"Недостаточно энергии. Нужно 1, доступно {val}.", 402)
    finally:
        conn.close()

    # Шаг 1: Вордстат
    shows_map: dict[str, int] = {}
    try:
        seed_phrases = build_seed_phrases(salon, services)
        geo_ids = get_geo_id(salon.get("city") or "")
        shows_map = fetch_wordstat(seed_phrases, geo_ids)
        print(f"[Wordstat] seed_phrases={seed_phrases}")
        print(f"[Wordstat] shows_map keys={list(shows_map.keys())[:20]}")
    except Exception as e:
        print(f"[Wordstat] ERROR: {e}")
        pass  # fallback — ИИ сгенерирует без реальных данных

    # Шаг 2: ИИ группирует
    prompt = build_ai_prompt(salon, services, shows_map)
    raw = call_ai([
        {"role": "system", "content": "Ты эксперт по SEO и контекстной рекламе. Отвечаешь строго валидным JSON без лишнего текста."},
        {"role": "user", "content": prompt},
    ])

    clean = raw.strip()
    if clean.startswith("```"):
        clean = clean.split("```")[1]
        if clean.startswith("json"):
            clean = clean[4:]
        clean = clean.strip()

    groups = json.loads(clean)

    # Принудительно подставляем реальные shows из Вордстата и пересчитываем frequency
    if shows_map:
        for group in groups:
            for kw in group.get("keywords", []):
                query = kw.get("query", "").lower().strip()
                real_shows = shows_map.get(query)
                # fallback: ищем ключ в shows_map который содержит query или наоборот
                if real_shows is None:
                    for map_key, map_val in shows_map.items():
                        if query in map_key or map_key in query:
                            real_shows = map_val
                            break
                if real_shows is not None:
                    kw["shows"] = real_shows
                else:
                    print(f"[Wordstat] NO MATCH for query='{query}'")
                shows = kw.get("shows") or 0
                if shows > 1000:
                    kw["frequency"] = "high"
                    kw["frequency_label"] = "Высокочастотный"
                elif shows >= 100:
                    kw["frequency"] = "medium"
                    kw["frequency_label"] = "Среднечастотный"
                else:
                    kw["frequency"] = "low"
                    kw["frequency_label"] = "Низкочастотный"

    has_wordstat = bool(shows_map)
    return ok({
        "groups": groups,
        "salon_name": salon["name"],
        "city": salon["city"] or "",
        "wordstat_used": has_wordstat,
        "total_queries_from_wordstat": len(shows_map),
    })