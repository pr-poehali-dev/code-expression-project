import os
import json
import urllib.request

SYSTEM_PROMPT = """Ты — бизнес-консультант по бьюти-индустрии. Твоя задача — дать владельцу или управляющему салона красоты персональный разбор его бизнес-диагностики: где теряются деньги, что мешает росту и что делать прямо сейчас.

Стиль: прямой, деловой, без воды. Говори «ты». Оперируй конкретными метриками из данных — показывай связь между индексом и деньгами. Не нужно объяснять что такое IVK — просто называй «возврат клиентов» или используй % из данных.

Структура ответа — строго 4 блока через разделитель "###":

### ЧТО Я ВИЖУ В ТВОЁМ САЛОНЕ
2-3 предложения: честная бизнес-картина. Какие показатели сильные, какие критичные. Упомяни тип салона и его главную проблему. Если есть скрытый потенциал в деньгах — назови сумму.

### ГЛАВНАЯ ТОЧКА ПОТЕРЬ
1-2 предложения: один конкретный процесс в салоне, который прямо сейчас стоит денег. Назови что именно теряется и почему.

### 3 ДЕЙСТВИЯ НА ЭТОЙ НЕДЕЛЕ
Три конкретных управленческих действия, каждое начинается с глагола (Введи / Проверь / Запусти / Обучи / Установи / Подними / Пересмотри). Привязаны к слабым зонам. Только то, что реально сделать за 7 дней.

### ПОТЕНЦИАЛ РОСТА
1 предложение с конкретной цифрой или результатом: что изменится в выручке или потоке клиентов, если исправить главную точку потерь. Пиши конкретно — «+15-20% к выручке», «возврат каждого 3-го клиента» и т.д.

Объём: 260-330 слов суммарно. Начинай сразу с блока."""


def build_user_prompt(data: dict) -> str:
    norm = data.get("norm", {})
    ips = data.get("ips", 0)
    ipp_loss = data.get("ipp_loss", 0)
    type_title = data.get("type_title", "")
    hidden_money = data.get("hidden_money", 0)
    weak_zones = data.get("weak_zones", [])

    def lvl(val):
        return "сильный" if val >= 70 else "средний" if val >= 45 else "критично низкий"

    lines = [
        f"Тип салона: «{type_title}»",
        f"Главный индекс прибыльности (IPS): {ips}/100",
        f"Индекс потерь прибыли (IPP): {ipp_loss} — сколько теряется из-за слабых зон",
        "",
        "Детальные показатели (0-100%):",
        f"• Возврат клиентов (IVK): {norm.get('IVK', 0)} — {lvl(norm.get('IVK', 0))}",
        f"• Средний чек / допродажи (ISC): {norm.get('ISC', 0)} — {lvl(norm.get('ISC', 0))}",
        f"• Продажи услуг мастерами (IPU): {norm.get('IPU', 0)} — {lvl(norm.get('IPU', 0))}",
        f"• Загрузка / поток клиентов (IZ): {norm.get('IZ', 0)} — {lvl(norm.get('IZ', 0))}",
        f"• Эффективность администраторов (IEA): {norm.get('IEA', 0)} — {lvl(norm.get('IEA', 0))}",
        f"• Лояльность клиентской базы (ILK): {norm.get('ILK', 0)} — {lvl(norm.get('ILK', 0))}",
    ]

    if hidden_money > 0:
        if hidden_money >= 1000:
            money_str = f"{round(hidden_money / 1000)} тыс. ₽/мес"
        else:
            money_str = f"{hidden_money} ₽/мес"
        lines.append(f"\nСкрытый потенциал роста выручки: +{money_str}")

    if weak_zones:
        lines.append("\nСлабые зоны: " + ", ".join(weak_zones))

    return "\n".join(lines)


def call_openai(user_prompt: str, api_key: str) -> str:
    opener = urllib.request.build_opener()

    payload = json.dumps({
        "model": "openai/gpt-4o-mini",
        "messages": [
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user", "content": user_prompt},
        ],
        "max_tokens": 700,
        "temperature": 0.75,
    }).encode("utf-8")

    req = urllib.request.Request(
        "https://polza.ai/api/v1/chat/completions",
        data=payload,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    with opener.open(req, timeout=25) as resp:
        result = json.loads(resp.read().decode("utf-8"))
        return result["choices"][0]["message"]["content"].strip()


def parse_sections(text: str) -> dict:
    sections = {}
    blocks = text.split("###")
    for block in blocks:
        block = block.strip()
        if not block:
            continue
        lines = block.split("\n", 1)
        title = lines[0].strip()
        content = lines[1].strip() if len(lines) > 1 else ""
        sections[title] = content
    return sections


def handler(event: dict, context) -> dict:
    """AI-анализ результатов теста 'Диагностика роста салона PRO'. polza.ai"""
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-User-Id, X-Auth-Token",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    try:
        data = json.loads(event.get("body") or "{}")
    except Exception:
        return {"statusCode": 400, "headers": cors, "body": json.dumps({"error": "invalid json"})}

    api_key = os.environ.get("OPENAI_API_KEY", "")
    if not api_key:
        return {"statusCode": 503, "headers": cors, "body": json.dumps({"error": "no api key"})}

    user_prompt = build_user_prompt(data)
    text = call_openai(user_prompt, api_key)
    sections = parse_sections(text)

    return {
        "statusCode": 200,
        "headers": cors,
        "body": json.dumps({"text": text, "sections": sections}, ensure_ascii=False),
    }