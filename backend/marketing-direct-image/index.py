"""
Генерирует рекламное изображение 1024x1024 для объявления Яндекс.Директ.
POST / — принимает данные объявления и группы, генерирует lifestyle-фото. Стоимость: 10 энергий.
"""
import json
import os
import base64
import uuid
from datetime import datetime

import boto3
import psycopg2
import psycopg2.extras
import urllib.request

SCHEMA = "t_p84565078_code_expression_proj"
TOOL_KEY = "direct_image_gen"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}

MEDICAL_KEYWORDS = [
    "остеопатия", "остеопат", "мануальная терапия", "мануальный",
    "рефлексотерапия", "иглоукалывание", "физиотерапия",
    "лечебный", "лечение", "медицинский",
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
        f"SELECT name, city, description, target_audience, tone_of_voice, has_medical_license "
        f"FROM {SCHEMA}.salons WHERE id=%s", (salon_id,)
    )
    return cur.fetchone()


def check_and_deduct_energy(salon_id, user_id, amount, conn):
    cur = conn.cursor()
    cur.execute(
        f"SELECT credits_balance FROM {SCHEMA}.salons WHERE id=%s FOR UPDATE", (salon_id,)
    )
    row = cur.fetchone()
    if not row:
        return False, 0
    balance = int(row[0])
    if balance < amount:
        return False, balance
    cur.execute(
        f"UPDATE {SCHEMA}.salons SET credits_balance = credits_balance - %s WHERE id=%s",
        (amount, salon_id)
    )
    cur.execute(
        f"INSERT INTO {SCHEMA}.credit_transactions (salon_id, user_id, action, amount, tool_key, type) "
        f"VALUES (%s, %s, %s, %s, %s, 'debit')",
        (salon_id, user_id, "Генерация рекламного изображения", amount, TOOL_KEY)
    )
    conn.commit()
    return True, balance


def get_tool_cost(conn) -> int:
    cur = conn.cursor()
    cur.execute(f"SELECT energy_cost FROM {SCHEMA}.tool_costs WHERE tool_key=%s", (TOOL_KEY,))
    row = cur.fetchone()
    return row[0] if row else 10


def upload_to_s3(image_b64: str, user_id: int) -> str:
    data = base64.b64decode(image_b64)
    ts = datetime.utcnow().strftime("%Y%m%d_%H%M%S")
    uid = uuid.uuid4().hex[:8]
    key = f"ai-images/direct/{user_id}/{ts}_{uid}.png"
    s3 = boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )
    s3.put_object(Bucket="files", Key=key, Body=data, ContentType="image/png")
    return f"https://cdn.poehali.dev/projects/{os.environ['AWS_ACCESS_KEY_ID']}/bucket/{key}"


def is_medical_group(group_name: str, keywords: list) -> bool:
    text = (group_name + " " + " ".join(keywords)).lower()
    return any(kw in text for kw in MEDICAL_KEYWORDS)


def build_image_prompt(salon, group_name: str, keywords: list, has_license: bool) -> str:
    city = salon.get("city") or ""
    tone = salon.get("tone_of_voice") or "элегантный"
    target = salon.get("target_audience") or "женщины 25-45 лет"

    medical = is_medical_group(group_name, keywords)

    if medical and not has_license:
        # Wellness без медицинского контекста
        scene = (
            "A happy, radiant woman relaxing in a cozy, elegant wellness space. "
            "She looks serene and refreshed, wearing comfortable clothes. "
            "Soft natural lighting, warm tones, modern interior. "
            "No medical equipment, no clinical setting. Lifestyle photo."
        )
    elif medical and has_license:
        # Профессиональная медицинская обстановка допустима
        scene = (
            "A professional wellness specialist working in a clean, modern treatment room. "
            "Client looks relaxed and comfortable. Soft professional lighting. "
            "Clean, premium medical-spa aesthetic."
        )
    else:
        # Beauty/salon сцена по теме группы
        group_lower = group_name.lower()
        if any(w in group_lower for w in ["маникюр", "ногт", "nail"]):
            scene = "Close-up of beautiful well-manicured hands with elegant nail design. Soft pastel background, natural light."
        elif any(w in group_lower for w in ["стрижк", "волос", "hair", "укладк"]):
            scene = "A woman with beautiful, flowing healthy hair in a stylish salon. Warm lighting, modern interior, lifestyle photo."
        elif any(w in group_lower for w in ["брови", "ресниц", "lash", "brow"]):
            scene = "Close-up of a woman's face with perfect brows and lashes. Clean, minimal aesthetic, soft lighting."
        elif any(w in group_lower for w in ["косметолог", "уход", "лиц", "face"]):
            scene = "A woman with glowing, healthy skin enjoying a facial care routine. Elegant spa atmosphere, soft candlelight."
        elif any(w in group_lower for w in ["массаж", "relax", "spa", "спа"]):
            scene = "A woman looking deeply relaxed during a spa treatment. Serene atmosphere, natural elements, warm ambient lighting."
        elif any(w in group_lower for w in ["обертыван", "body", "тело"]):
            scene = "Wellness body care concept — elegant spa products, towels, flowers arranged beautifully. Lifestyle flat lay."
        else:
            scene = (
                f"An elegant beauty salon interior in {city or 'a modern city'}. "
                "Happy female client being pampered. Warm, welcoming atmosphere, upscale design. "
                "Lifestyle photography, no text."
            )

    people_note = (
        "People must have Slavic appearance — light to medium skin tone, natural European features. "
        "If two or more people are present, they must look clearly different from each other: "
        "vary age, hair color, face shape, style — no identical or similar-looking people. "
    )

    realism_note = (
        "Ultra-realistic, shot on Sony A7 III or Canon R5 camera, 85mm lens, shallow depth of field. "
        "Natural skin texture, authentic emotions, no AI-generated plastic look. "
        "Magazine-quality commercial photography, cinematic color grading. "
    )

    prompt = (
        f"{scene} "
        f"{people_note}"
        f"{realism_note}"
        f"NO text, NO logos, NO watermarks, NO signs, NO overlays. "
        f"Square format 1:1."
    )
    return prompt


def generate_image(prompt: str) -> str:
    api_key = os.environ.get("POLZA_AI_API_KEY", "")
    payload = json.dumps({
        "model": "openai/gpt-image-1.5",
        "input": {
            "prompt": prompt,
            "aspect_ratio": "1:1",
            "max_images": 1,
        }
    }).encode("utf-8")
    req = urllib.request.Request(
        "https://polza.ai/api/v1/media",
        data=payload,
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=240) as resp:
        result = json.loads(resp.read().decode("utf-8"))

    # Пробуем достать URL или base64
    for item in (result.get("data") or result.get("images") or []):
        if isinstance(item, dict):
            if item.get("url"):
                return item["url"]
            b64 = item.get("b64_json") or item.get("base64") or ""
            if b64:
                return f"__b64__{b64}"

    raise ValueError("Изображение не получено от API")


def handler(event: dict, context) -> dict:
    """
    Подготавливает промт и списывает 10 энергий для генерации рекламного изображения.
    action=prepare — возвращает готовый промт, списывает энергию (быстро, <1с).
    Фронт затем передаёт промт в ai-image-gen для генерации.
    """
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

        body = json.loads(event.get("body") or "{}")
        group_name = (body.get("group_name") or "").strip()
        keywords = body.get("keywords") or []
        if not group_name:
            return err("Укажите название группы (group_name)")

        salon = get_salon_data(salon_id, conn)
        if not salon:
            return err("Салон не найден", 404)

        has_license = bool(salon.get("has_medical_license"))
        prompt = build_image_prompt(salon, group_name, keywords, has_license)
    finally:
        conn.close()

    # Возвращаем только промт — энергию (5 ⚡) спишет ai-image-gen
    return ok({"prompt": prompt})