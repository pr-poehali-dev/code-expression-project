"""Генерирует PNG-иконки для PWA (192x192 и 512x512) и загружает в S3."""
import os
import io
import json
import boto3
import math

def draw_icon(size: int) -> bytes:
    from PIL import Image, ImageDraw, ImageFont

    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    radius = int(size * 0.22)
    bg_color = (15, 23, 42, 255)

    # Скруглённый прямоугольник — тёмный фон
    draw.rounded_rectangle([0, 0, size - 1, size - 1], radius=radius, fill=bg_color)

    cx, cy = size // 2, size // 2
    ring_r = int(size * 0.375)
    ring_w = max(3, int(size * 0.016))

    # Тонкое кольцо — бирюзовое (#2DD4BF -> #0D9488)
    steps = 720
    for i in range(steps):
        angle = math.radians(i * 360 / steps)
        t = i / steps
        r_c = int(45 + (13 - 45) * t)
        g_c = int(212 + (148 - 212) * t)
        b_c = int(191 + (136 - 191) * t)
        x = cx + ring_r * math.cos(angle)
        y = cy + ring_r * math.sin(angle)
        draw.ellipse([x - ring_w, y - ring_w, x + ring_w, y + ring_w],
                     fill=(r_c, g_c, b_c, 180))

    # Буква П — крупная, serif, бирюзовая
    font_size = int(size * 0.52)
    font = None
    for path in [
        "/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSerif-Bold.ttf",
        "/usr/share/fonts/truetype/freefont/FreeSerifBold.ttf",
        "/usr/share/fonts/truetype/ubuntu/Ubuntu-B.ttf",
    ]:
        try:
            font = ImageFont.truetype(path, font_size)
            break
        except Exception:
            continue
    if font is None:
        font = ImageFont.load_default()

    text = "П"
    bbox = draw.textbbox((0, 0), text, font=font)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    tx = cx - tw // 2 - bbox[0]
    ty = cy - th // 2 - bbox[1] + int(size * 0.03)

    # Рисуем букву бирюзовым цветом (#2DD4BF)
    txt_img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    txt_draw = ImageDraw.Draw(txt_img)
    txt_draw.text((tx, ty), text, font=font, fill=(45, 212, 191, 255))
    img = Image.alpha_composite(img, txt_img)

    buf = io.BytesIO()
    img.save(buf, format="PNG", optimize=True)
    return buf.getvalue()


def handler(event: dict, context) -> dict:
    """Генерирует PNG иконки 192px и 512px с буквой П и загружает в S3."""
    cors = {"Access-Control-Allow-Origin": "*"}

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    token = (event.get("headers") or {}).get("X-Admin-Token", "")
    if token != os.environ.get("ADMIN_TOKEN", ""):
        return {"statusCode": 403, "headers": cors, "body": json.dumps({"error": "forbidden"})}

    s3 = boto3.client(
        "s3",
        endpoint_url="https://bucket.poehali.dev",
        aws_access_key_id=os.environ["AWS_ACCESS_KEY_ID"],
        aws_secret_access_key=os.environ["AWS_SECRET_ACCESS_KEY"],
    )
    aws_key = os.environ["AWS_ACCESS_KEY_ID"]
    base_url = f"https://cdn.poehali.dev/projects/{aws_key}/bucket"

    urls = {}
    for size in [192, 512]:
        png_data = draw_icon(size)
        # v2 — сбиваем кеш CDN
        key = f"pwa-icons/icon-{size}-v2.png"
        s3.put_object(
            Bucket="files",
            Key=key,
            Body=png_data,
            ContentType="image/png",
            CacheControl="public, max-age=31536000",
        )
        urls[f"icon_{size}"] = f"{base_url}/{key}"

    return {
        "statusCode": 200,
        "headers": cors,
        "body": json.dumps({"ok": True, "urls": urls}, ensure_ascii=False),
    }
