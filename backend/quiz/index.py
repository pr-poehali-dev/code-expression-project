import json
import os
import smtplib
import psycopg2
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart


CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token",
}


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def handler(event: dict, context) -> dict:
    """Квиз-бот для подбора онлайн-курсов и интенсивов. Обрабатывает прохождение квиза, сохраняет заявки, отправляет email с рекомендациями."""

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")

    # POST /submit — сохранить результат квиза и отправить email
    if method == "POST" and path.endswith("/submit"):
        return handle_submit(event)

    # GET /courses — получить список активных курсов
    if method == "GET" and path.endswith("/courses"):
        return handle_get_courses(event)

    # Админка: GET /admin/submissions
    if method == "GET" and path.endswith("/admin/submissions"):
        return handle_admin_submissions(event)

    # Админка: GET /admin/courses
    if method == "GET" and path.endswith("/admin/courses"):
        return handle_admin_courses(event)

    # Админка: POST /admin/courses — создать курс
    if method == "POST" and path.endswith("/admin/courses"):
        return handle_admin_create_course(event)

    # Админка: PUT /admin/courses — обновить курс
    if method == "PUT" and "/admin/courses/" in path:
        course_id = path.split("/admin/courses/")[-1].split("/")[0]
        return handle_admin_update_course(event, course_id)

    # Админка: DELETE /admin/courses
    if method == "DELETE" and "/admin/courses/" in path:
        course_id = path.split("/admin/courses/")[-1].split("/")[0]
        return handle_admin_delete_course(event, course_id)

    return {"statusCode": 404, "headers": CORS, "body": json.dumps({"error": "Not found"})}


def check_admin(event: dict) -> bool:
    token = event.get("headers", {}).get("x-admin-token", "")
    return token == os.environ.get("ADMIN_TOKEN", "")


def compute_category(answers: dict) -> tuple[str, str]:
    """Вычисляет категорию и текст-объяснение по ответам пользователя."""
    scores = {"A": 0, "B": 0, "C": 0, "D": 0}

    # Q2 — опыт
    exp = answers.get("q2", "")
    if exp == "no_exp":
        scores["A"] += 3
        scores["D"] += 2
    elif exp == "little_exp":
        scores["A"] += 2
        scores["D"] += 2
    elif exp == "masseur":
        scores["B"] += 5
    elif exp == "trainer":
        scores["C"] += 5
    elif exp == "other_specialist":
        scores["B"] += 2
        scores["C"] += 2
        scores["D"] += 2

    # Q3 — цели (мультивыбор)
    goals = answers.get("q3", [])
    if "for_self" in goals:
        scores["A"] += 4
    if "pain_relief" in goals:
        scores["A"] += 3
    if "new_career" in goals:
        scores["D"] += 5
    if "upgrade" in goals:
        scores["B"] += 4
        scores["C"] += 2
    if "earn_more" in goals:
        scores["D"] += 4
        scores["B"] += 2
    if "work_deeper" in goals:
        scores["B"] += 5
    if "new_techniques" in goals:
        scores["B"] += 3
        scores["C"] += 3

    # Q4 — заработок
    earn = answers.get("q4", "")
    if earn == "no_earn":
        scores["A"] += 3
    elif earn == "maybe_earn":
        scores["D"] += 1
    elif earn == "extra_income":
        scores["D"] += 3
        scores["B"] += 1
    elif earn == "new_profession":
        scores["D"] += 5

    # Q5 — интересы (мультивыбор)
    interests = answers.get("q5", [])
    if "simple_techniques" in interests:
        scores["A"] += 3
    if "body_restoration" in interests:
        scores["B"] += 3
        scores["C"] += 2
    if "diagnostics" in interests:
        scores["B"] += 4
        scores["C"] += 3
    if "deep_muscles" in interests:
        scores["B"] += 4
    if "client_practice" in interests:
        scores["B"] += 3
        scores["D"] += 2

    # Q7 — формат
    fmt = answers.get("q7", "")
    if fmt == "live_moscow":
        scores["B"] += 2
        scores["D"] += 2

    # Определяем главную категорию
    main_cat = max(scores, key=lambda k: scores[k])

    # Текст объяснения
    explanations = {
        "A": "Вам подойдут эти программы, потому что вы хотите освоить простые восстановительные техники для себя и близких — без медобразования и сложных терминов.",
        "B": "Вам подойдут эти программы, потому что вы уже работаете с клиентами и хотите выйти на новый уровень: глубже работать с болью, диагностикой и получать стабильный высокий чек.",
        "C": "Вам подойдут эти программы, потому что как тренер вы хотите добавить восстановительные техники в работу с клиентами и давать результат нового уровня.",
        "D": "Вам подойдут эти программы, потому что вы готовы освоить востребованную профессию с нуля или значительно увеличить доход от практики.",
    }

    return main_cat, explanations[main_cat]


def get_recommended_courses(category: str, answers: dict, conn) -> list:
    """Подбирает курсы из БД по категории, учитывая предпочтение формата."""
    fmt_pref = answers.get("q7", "")

    cur = conn.cursor()

    # Основная категория
    cur.execute(
        "SELECT id, title, description, url, buy_url, price, category, format "
        "FROM quiz_courses WHERE is_active = TRUE AND category = %s ORDER BY sort_order LIMIT 4",
        (category,)
    )
    rows = cur.fetchall()

    # Если мало результатов или формат «онлайн» — добавим из соседних категорий
    if len(rows) < 3:
        # Соседние категории
        extras_cat = {"A": ["D"], "B": ["C", "D"], "C": ["B"], "D": ["B", "A"]}
        for extra in extras_cat.get(category, []):
            cur.execute(
                "SELECT id, title, description, url, buy_url, price, category, format "
                "FROM quiz_courses WHERE is_active = TRUE AND category = %s ORDER BY sort_order LIMIT 2",
                (extra,)
            )
            rows += cur.fetchall()

    # Фильтруем по формату если явно выбран онлайн
    if fmt_pref == "online_only":
        rows = [r for r in rows if r[7] == "online"]
    elif fmt_pref == "live_moscow":
        online = [r for r in rows if r[7] == "online"][:2]
        offline = [r for r in rows if r[7] == "offline"][:2]
        rows = online + offline

    # Дедупликация
    seen = set()
    unique = []
    for r in rows:
        if r[0] not in seen:
            seen.add(r[0])
            unique.append(r)
        if len(unique) >= 5:
            break

    return [
        {"id": r[0], "title": r[1], "description": r[2], "url": r[3],
         "buy_url": r[4], "price": r[5], "category": r[6], "format": r[7]}
        for r in unique
    ]


def send_email(name: str, email: str, category: str, explanation: str, courses: list):
    smtp_password = os.environ.get("SMTP_PASSWORD", "")
    from_email = "massopro@mail.ru"

    category_names = {
        "A": "Восстановительные техники для себя и близких",
        "B": "Профессиональный рост для массажистов",
        "C": "Восстановление в работе тренера",
        "D": "Новая профессия и заработок",
    }

    courses_html = ""
    for c in courses:
        fmt_label = "Онлайн" if c["format"] == "online" else "Офлайн-интенсив (Москва)"
        url = f"https://dok-dialog.ru{c['url']}"
        courses_html += f"""
        <tr>
          <td style="padding: 16px; border-bottom: 1px solid #f0f0f0;">
            <div style="font-size: 12px; color: #2d8b76; font-weight: 700; margin-bottom: 4px; text-transform: uppercase;">{fmt_label}</div>
            <div style="font-size: 16px; font-weight: 700; color: #1a1a1a; margin-bottom: 6px;">{c['title']}</div>
            <div style="font-size: 14px; color: #666; margin-bottom: 10px;">{c['description']}</div>
            <div style="font-size: 15px; font-weight: 700; color: #2d8b76; margin-bottom: 10px;">{c['price']}</div>
            <a href="{url}" style="display: inline-block; background: #2d8b76; color: #fff; padding: 9px 20px; border-radius: 8px; text-decoration: none; font-size: 14px; font-weight: 600; margin-right: 8px;">Подробнее</a>
          </td>
        </tr>
        """

    html = f"""
    <!DOCTYPE html>
    <html>
    <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
    <body style="margin: 0; padding: 0; background: #f8f8f6; font-family: Arial, sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background: #f8f8f6; padding: 40px 0;">
        <tr><td>
          <table width="600" cellpadding="0" cellspacing="0" style="margin: 0 auto; background: #fff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08);">
            <!-- Шапка -->
            <tr>
              <td style="background: linear-gradient(135deg, #2d8b76, #1a6b5a); padding: 36px 40px; text-align: center;">
                <div style="font-size: 13px; color: rgba(255,255,255,0.7); letter-spacing: 2px; margin-bottom: 8px;">DOK ДИАЛОГ</div>
                <div style="font-size: 24px; font-weight: 700; color: #fff; line-height: 1.3;">Ваша персональная подборка<br>обучающих программ</div>
              </td>
            </tr>
            <!-- Приветствие -->
            <tr>
              <td style="padding: 32px 40px 20px;">
                <div style="font-size: 17px; color: #1a1a1a; line-height: 1.6;">
                  {name}, добрый день!<br><br>
                  Вы прошли наш квиз по подбору обучения. На основе ваших ответов мы подготовили персональную подборку.
                </div>
              </td>
            </tr>
            <!-- Профиль -->
            <tr>
              <td style="padding: 0 40px 24px;">
                <div style="background: #f0faf7; border-left: 4px solid #2d8b76; border-radius: 8px; padding: 16px 20px;">
                  <div style="font-size: 12px; color: #2d8b76; font-weight: 700; text-transform: uppercase; margin-bottom: 6px;">Ваш профиль</div>
                  <div style="font-size: 15px; font-weight: 700; color: #1a1a1a; margin-bottom: 6px;">{category_names.get(category, '')}</div>
                  <div style="font-size: 14px; color: #555; line-height: 1.6;">{explanation}</div>
                </div>
              </td>
            </tr>
            <!-- Рекомендации -->
            <tr>
              <td style="padding: 0 40px 8px;">
                <div style="font-size: 18px; font-weight: 700; color: #1a1a1a; margin-bottom: 4px;">Рекомендованные программы:</div>
              </td>
            </tr>
            <tr>
              <td style="padding: 0 40px 24px;">
                <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #f0f0f0; border-radius: 12px; overflow: hidden;">
                  {courses_html}
                </table>
              </td>
            </tr>
            <!-- CTA -->
            <tr>
              <td style="padding: 0 40px 32px; text-align: center;">
                <div style="font-size: 15px; color: #666; margin-bottom: 16px;">Остались вопросы? Напишите нам — поможем выбрать подходящую программу</div>
                <a href="https://dok-dialog.ru/kontakty" style="display: inline-block; background: #2d8b76; color: #fff; padding: 14px 32px; border-radius: 10px; text-decoration: none; font-size: 15px; font-weight: 700;">Связаться с нами</a>
              </td>
            </tr>
            <!-- Футер -->
            <tr>
              <td style="background: #f8f8f6; padding: 20px 40px; text-align: center; border-top: 1px solid #eee;">
                <div style="font-size: 12px; color: #aaa;">Dok Диалог — онлайн-курсы и интенсивы по восстановительным техникам</div>
                <div style="font-size: 12px; color: #aaa; margin-top: 4px;"><a href="https://dok-dialog.ru" style="color: #2d8b76; text-decoration: none;">dok-dialog.ru</a></div>
              </td>
            </tr>
          </table>
        </td></tr>
      </table>
    </body>
    </html>
    """

    msg = MIMEMultipart("alternative")
    msg["Subject"] = "Ваша персональная подборка курсов по восстановительным техникам"
    msg["From"] = from_email
    msg["To"] = email
    msg.attach(MIMEText(html, "html"))

    # Уведомление на почту администратора
    admin_msg = MIMEMultipart("alternative")
    admin_msg["Subject"] = f"Новое прохождение квиза: {name} ({email})"
    admin_msg["From"] = from_email
    admin_msg["To"] = from_email
    admin_html = f"""
    <h2>Новая заявка через квиз</h2>
    <p><b>Имя:</b> {name}</p>
    <p><b>Email:</b> {email}</p>
    <p><b>Категория:</b> {category} — {category_names.get(category, '')}</p>
    <p><b>Рекомендовано курсов:</b> {len(courses)}</p>
    """
    admin_msg.attach(MIMEText(admin_html, "html"))

    with smtplib.SMTP_SSL("smtp.mail.ru", 465) as server:
        server.login(from_email, smtp_password)
        server.sendmail(from_email, email, msg.as_string())
        server.sendmail(from_email, from_email, admin_msg.as_string())


def handle_submit(event: dict) -> dict:
    body = json.loads(event.get("body") or "{}")
    name = body.get("name", "").strip()
    email = body.get("email", "").strip()
    answers = body.get("answers", {})

    if not name or not email:
        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Имя и email обязательны"})}

    category, explanation = compute_category(answers)

    conn = get_db()
    try:
        courses = get_recommended_courses(category, answers, conn)

        cur = conn.cursor()
        cur.execute(
            "INSERT INTO quiz_submissions (name, email, answers, category, recommended_courses) VALUES (%s, %s, %s, %s, %s) RETURNING id",
            (name, email, json.dumps(answers), category, json.dumps(courses))
        )
        submission_id = cur.fetchone()[0]
        conn.commit()
    finally:
        conn.close()

    send_email(name, email, category, explanation, courses)

    return {
        "statusCode": 200,
        "headers": CORS,
        "body": json.dumps({
            "ok": True,
            "id": submission_id,
            "category": category,
            "explanation": explanation,
            "courses": courses,
        }),
    }


def handle_get_courses(event: dict) -> dict:
    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT id, title, description, url, buy_url, price, category, format, sort_order "
            "FROM quiz_courses WHERE is_active = TRUE ORDER BY sort_order"
        )
        rows = cur.fetchall()
    finally:
        conn.close()

    courses = [
        {"id": r[0], "title": r[1], "description": r[2], "url": r[3],
         "buy_url": r[4], "price": r[5], "category": r[6], "format": r[7], "sort_order": r[8]}
        for r in rows
    ]
    return {"statusCode": 200, "headers": CORS, "body": json.dumps({"courses": courses})}


def handle_admin_submissions(event: dict) -> dict:
    if not check_admin(event):
        return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Unauthorized"})}

    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT id, name, email, category, created_at, answers, recommended_courses "
            "FROM quiz_submissions ORDER BY created_at DESC LIMIT 200"
        )
        rows = cur.fetchall()
    finally:
        conn.close()

    submissions = [
        {"id": r[0], "name": r[1], "email": r[2], "category": r[3],
         "created_at": r[4].isoformat() if r[4] else None,
         "answers": r[5], "recommended_courses": r[6]}
        for r in rows
    ]
    return {"statusCode": 200, "headers": CORS, "body": json.dumps({"submissions": submissions})}


def handle_admin_courses(event: dict) -> dict:
    if not check_admin(event):
        return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Unauthorized"})}

    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute(
            "SELECT id, title, description, url, buy_url, price, category, format, is_active, sort_order "
            "FROM quiz_courses ORDER BY sort_order"
        )
        rows = cur.fetchall()
    finally:
        conn.close()

    courses = [
        {"id": r[0], "title": r[1], "description": r[2], "url": r[3],
         "buy_url": r[4], "price": r[5], "category": r[6], "format": r[7],
         "is_active": r[8], "sort_order": r[9]}
        for r in rows
    ]
    return {"statusCode": 200, "headers": CORS, "body": json.dumps({"courses": courses})}


def handle_admin_create_course(event: dict) -> dict:
    if not check_admin(event):
        return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Unauthorized"})}

    body = json.loads(event.get("body") or "{}")
    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO quiz_courses (title, description, url, buy_url, price, category, format, is_active, sort_order) "
            "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s) RETURNING id",
            (body.get("title"), body.get("description"), body.get("url"), body.get("buy_url"),
             body.get("price"), body.get("category"), body.get("format", "online"),
             body.get("is_active", True), body.get("sort_order", 0))
        )
        new_id = cur.fetchone()[0]
        conn.commit()
    finally:
        conn.close()

    return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True, "id": new_id})}


def handle_admin_update_course(event: dict, course_id: str) -> dict:
    if not check_admin(event):
        return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Unauthorized"})}

    body = json.loads(event.get("body") or "{}")
    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute(
            "UPDATE quiz_courses SET title=%s, description=%s, url=%s, buy_url=%s, price=%s, "
            "category=%s, format=%s, is_active=%s, sort_order=%s, updated_at=NOW() WHERE id=%s",
            (body.get("title"), body.get("description"), body.get("url"), body.get("buy_url"),
             body.get("price"), body.get("category"), body.get("format", "online"),
             body.get("is_active", True), body.get("sort_order", 0), int(course_id))
        )
        conn.commit()
    finally:
        conn.close()

    return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}


def handle_admin_delete_course(event: dict, course_id: str) -> dict:
    if not check_admin(event):
        return {"statusCode": 401, "headers": CORS, "body": json.dumps({"error": "Unauthorized"})}

    conn = get_db()
    try:
        cur = conn.cursor()
        cur.execute("UPDATE quiz_courses SET is_active = FALSE WHERE id = %s", (int(course_id),))
        conn.commit()
    finally:
        conn.close()

    return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}
