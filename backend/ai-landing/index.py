"""
Генератор лендингов: чат → блочная генерация → редактирование блоков.
Режимы:
  chat        — диалог для сбора данных о бизнесе
  gen-style   — генерирует CSS-тему (переменные + шрифты) на основе бизнеса
  gen-block   — генерирует один HTML-блок (blockId: header/hero/about/services/reviews/contact/footer)
  edit-block  — переделывает один блок по запросу пользователя
  refine      — доработка всего HTML (старый режим для совместимости)
"""
import json
import os
import psycopg2
import psycopg2.extras
from openai import OpenAI

SCHEMA = "t_p84565078_code_expression_proj"
CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Session-Id",
}

# ── CHAT ПРОМПТЫ по шаблонам ──────────────────────────────────────────────────

CHAT_PROMPTS = {
    "classic": """Ты — помощник по созданию лендингов. Собери информацию о бизнесе через дружелюбный чат, задавая по 1–2 вопроса за раз.
Нужно узнать: название, услуги (3–5 пунктов), УТП, контакты, адрес/город, режим работы, отзывы клиентов.
Когда есть название + услуги + контакты — скажи "Отлично, данных достаточно! Создать лендинг?" и жди подтверждения.
Отвечай коротко, по-русски, дружелюбно. Задавай строго 1-2 вопроса за раз.""",

    "storytelling": """Ты — помощник по созданию лендингов в формате сторителлинга. Задавай по 1–2 вопроса за раз.
Нужно узнать: название бизнеса, какую боль/проблему клиента решают, история создания или личная история основателя,
услуги/решения, команда (кто и с каким опытом), отзывы, контакты.
Когда есть название + боль клиента + услуги + контакты — скажи "Отлично, данных достаточно! Создать лендинг?" и жди подтверждения.
Отвечай эмоционально и вовлекающе, по-русски. Задавай строго 1-2 вопроса за раз.""",

    "sales": """Ты — помощник по созданию продающих лендингов. Задавай по 1–2 вопроса за раз.
Нужно узнать: название, главный оффер (что продаём и кому), 3–5 конкретных выгод для клиента,
как именно работает продукт/услуга (3 шага), цены/тарифы, 3–5 частых вопросов (FAQ), отзывы, контакты.
Когда есть оффер + выгоды + контакты — скажи "Отлично, данных достаточно! Создать лендинг?" и жди подтверждения.
Отвечай динамично, по-русски. Задавай строго 1-2 вопроса за раз.""",

    "portfolio": """Ты — помощник по созданию портфолио-лендинга для мастера или специалиста. Задавай по 1–2 вопроса за раз.
Нужно узнать: имя специалиста, профессия/специализация, опыт и достижения, услуги с ценами,
примеры работ (пользователь загрузит фото), отзывы клиентов, контакты для записи.
Когда есть имя + специализация + услуги + контакты — скажи "Отлично, данных достаточно! Создать лендинг?" и жди подтверждения.
Отвечай тепло и профессионально, по-русски. Задавай строго 1-2 вопроса за раз.""",

    "b2b": """Ты — помощник по созданию B2B лендинга для компании. Задавай по 1–2 вопроса за раз.
Нужно узнать: название компании, сфера и специализация, услуги с описанием и ценами, 2–3 кейса с результатами,
команда (ключевые люди), список клиентов или партнёров (названия/логотипы), контакты.
Когда есть название + услуги + контакты — скажи "Отлично, данных достаточно! Создать лендинг?" и жди подтверждения.
Отвечай профессионально, по-русски. Задавай строго 1-2 вопроса за раз.""",

    "event": """Ты — помощник по созданию лендинга для мероприятия или онлайн-курса. Задавай по 1–2 вопроса за раз.
Нужно узнать: название мероприятия/курса, дата и формат (онлайн/офлайн), программа (3–6 блоков),
спикеры (имя, должность, опыт), тарифы/цены, частые вопросы, контакты для регистрации.
Когда есть название + дата + программа + цены — скажи "Отлично, данных достаточно! Создать лендинг?" и жди подтверждения.
Отвечай энергично, по-русски. Задавай строго 1-2 вопроса за раз.""",

    "restaurant": """Ты — помощник по созданию лендинга для ресторана или кафе. Задавай по 1–2 вопроса за раз.
Нужно узнать: название заведения, концепция/атмосфера, 5–8 блюд-хитов с описанием, история заведения или изюминка,
акции или специальные предложения, адрес и режим работы, как забронировать стол.
Когда есть название + концепция + контакты — скажи "Отлично, данных достаточно! Создать лендинг?" и жди подтверждения.
Отвечай вкусно и атмосферно, по-русски. Задавай строго 1-2 вопроса за раз.""",

    "realty": """Ты — помощник по созданию лендинга для объекта недвижимости. Задавай по 1–2 вопроса за раз.
Нужно узнать: название объекта/ЖК, тип недвижимости, ключевые характеристики (площади, этажи, сроки сдачи),
преимущества района (инфраструктура, транспорт), доступные планировки и цены, контакты застройщика/агентства.
Когда есть название + характеристики + контакты — скажи "Отлично, данных достаточно! Создать лендинг?" и жди подтверждения.
Отвечай убедительно и чётко, по-русски. Задавай строго 1-2 вопроса за раз.""",

    "product": """Ты — помощник по созданию лендинга для одного товара. Задавай по 1–2 вопроса за раз.
Нужно узнать: название товара, для кого он и какую проблему решает, 3–5 главных выгод и характеристик,
как работает/используется (3 простых шага), отзывы покупателей, цена и условия заказа/доставки.
Когда есть название + выгоды + цена + контакты — скажи "Отлично, данных достаточно! Создать лендинг?" и жди подтверждения.
Отвечай убедительно, по-русски. Задавай строго 1-2 вопроса за раз.""",
}

# ── БЛОЧНАЯ ГЕНЕРАЦИЯ: СТИЛЬ ──────────────────────────────────────────────────

SYSTEM_GEN_STYLE = """На основе данных о бизнесе придумай CSS-тему для лендинга и верни ТОЛЬКО JSON (без markdown, без объяснений).

Формат ответа:
{
  "primary": "#HEX",
  "accent": "#HEX",
  "dark": "#HEX",
  "light": "#HEX",
  "text": "#HEX",
  "headingFont": "Название шрифта Google Fonts",
  "bodyFont": "Название шрифта Google Fonts"
}

Правила:
- Подбери палитру под тематику бизнеса (не используй дефолтный синий #2563eb)
- primary — основной цвет бренда
- accent — яркий акцент для кнопок и выделений
- dark — тёмный фон для hero и footer
- light — очень светлый фон для секций (#f8f9fa или похожий)
- text — цвет основного текста (тёмный)
- headingFont — красивый заголовочный шрифт (Playfair Display, Cormorant Garamond, Raleway и тп)
- bodyFont — читаемый шрифт для текста (Montserrat, Inter, Open Sans и тп)

Верни ТОЛЬКО JSON без каких-либо других символов."""

# ── БЛОЧНАЯ ГЕНЕРАЦИЯ: ПРОМПТЫ ДЛЯ КАЖДОГО БЛОКА ────────────────────────────

BLOCK_PROMPTS = {
    "header": """Сгенерируй HTML-блок <header> для лендинга.

КРИТИЧЕСКИ ВАЖНО — структура хедера:
<header>
  <div class="container">
    <div class="header-inner">
      <div class="logo">НАЗВАНИЕ</div>
      <nav class="nav" id="main-nav">
        <a href="#about">О нас</a>
        <a href="#services">Услуги</a>
        <a href="#reviews">Отзывы</a>
        <a href="#contact">Контакты</a>
      </nav>
      <a href="#contact" class="header-btn">Записаться</a>
      <button class="burger" id="burger-btn" aria-label="Меню">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>

CSS требования:
- header: position:fixed; top:0; left:0; width:100%; z-index:1000; background:rgba({dark_rgb},0.92); backdrop-filter:blur(14px); border-bottom:1px solid rgba(255,255,255,0.08);
- .header-inner: display:flex; align-items:center; justify-content:space-between; height:70px;
- .logo: font-family:var(--font-heading); font-size:20px; font-weight:700; color:#fff; letter-spacing:1px; text-decoration:none;
- .nav a: color:rgba(255,255,255,0.8); text-decoration:none; font-size:14px; font-weight:500; padding:6px 14px; border-radius:6px; transition:all 0.2s; — при hover: color:#fff; background:rgba(255,255,255,0.1)
- .header-btn: background:var(--c-accent); color:#fff; padding:10px 22px; border-radius:24px; font-size:14px; font-weight:600; text-decoration:none; transition:opacity 0.2s; — при hover: opacity:0.85
- .burger: display:none; flex-direction:column; gap:5px; background:none; border:none; cursor:pointer; padding:4px;
- .burger span: display:block; width:24px; height:2px; background:#fff; border-radius:2px; transition:all 0.3s;
- НА MOBILE (<768px): .nav скрыт по умолчанию (max-height:0; overflow:hidden; transition:max-height 0.35s ease); .burger: display:flex; .header-btn: display:none;
- .nav.open: max-height:300px; — меню раскрыто
- В мобильном меню ссылки: display:flex; flex-direction:column; padding:12px 0 16px; gap:4px; каждая ссылка: padding:10px 16px; border-radius:8px

JS требования:
- document.getElementById('burger-btn').addEventListener('click', () => { document.getElementById('main-nav').classList.toggle('open'); })
- При клике на любую nav-ссылку — закрывать меню (classList.remove('open'))
- Плавный скролл к якорям: document.querySelectorAll('a[href^="#"]').forEach(a => { a.addEventListener('click', e => { e.preventDefault(); const t = document.querySelector(a.getAttribute('href')); if(t) t.scrollIntoView({behavior:'smooth'}); }) })
- При scroll > 50px добавлять header классе .scrolled (background непрозрачный)

Верни ТОЛЬКО HTML от <header> до </header> + <style data-block="header"> + <script data-block="header">.""",

    "hero": """Сгенерируй HTML-блок #hero для лендинга.

Структура:
<section id="hero">
  <div class="container">
    <div class="hero-grid">
      <div class="hero-text">
        <div class="hero-badge">БЕЙДЖ — короткий тег (например «С 2018 года» или «Топ-3 в городе»)</div>
        <h1>СИЛЬНЫЙ ОФФЕР — главная выгода для клиента, 5–8 слов</h1>
        <p class="hero-sub">Подзаголовок — 1-2 предложения, конкретно и по делу</p>
        <div class="hero-actions">
          <a href="#contact" class="btn-primary">Записаться / Заказать</a>
          <a href="#services" class="btn-secondary">Наши услуги</a>
        </div>
        <div class="hero-trust">
          <div class="trust-item">⭐ 5.0 — Рейтинг</div>
          <div class="trust-item">✓ ФАКТ 1</div>
          <div class="trust-item">✓ ФАКТ 2</div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="photo-slot" data-photo-slot="hero">
          <div class="photo-placeholder">
            <svg><!-- иконка фото --></svg>
            <span>Нажмите, чтобы загрузить фото</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

CSS требования:
- section#hero: min-height:100vh; padding:100px 0 60px; background:linear-gradient(135deg, var(--c-dark) 0%, var(--c-primary) 100%); color:#fff; position:relative; overflow:hidden;
- Псевдоэлемент ::before: декоративные SVG-окружности или сетка (opacity:0.06) на фоне
- .hero-grid: display:grid; grid-template-columns:1fr 1fr; gap:60px; align-items:center;
- .hero-badge: display:inline-block; background:rgba(255,255,255,0.12); color:rgba(255,255,255,0.9); padding:6px 16px; border-radius:20px; font-size:13px; font-weight:600; margin-bottom:20px; letter-spacing:0.5px;
- h1: font-size:clamp(2rem,4.5vw,3.8rem); font-family:var(--font-heading); font-weight:700; line-height:1.15; margin-bottom:20px;
- .hero-sub: font-size:clamp(1rem,1.5vw,1.2rem); opacity:0.85; line-height:1.65; margin-bottom:32px; max-width:480px;
- .btn-primary: background:var(--c-accent); color:#fff; padding:15px 34px; border-radius:30px; font-size:16px; font-weight:700; text-decoration:none; display:inline-block; transition:transform 0.2s,box-shadow 0.2s; box-shadow:0 4px 20px rgba(0,0,0,0.25); — hover: transform:translateY(-2px); box-shadow усиленная
- .btn-secondary: color:#fff; border:2px solid rgba(255,255,255,0.4); padding:13px 28px; border-radius:30px; font-size:15px; font-weight:600; text-decoration:none; transition:all 0.2s; — hover: border-color:#fff; background:rgba(255,255,255,0.1)
- .hero-actions: display:flex; gap:14px; flex-wrap:wrap; margin-bottom:36px;
- .hero-trust: display:flex; gap:20px; flex-wrap:wrap;
- .trust-item: font-size:13px; opacity:0.8; font-weight:500;
- .hero-visual .photo-slot: aspect-ratio:1/1; border-radius:24px; overflow:hidden; background:rgba(255,255,255,0.08); border:2px dashed rgba(255,255,255,0.25); display:flex; align-items:center; justify-content:center; cursor:pointer; position:relative; transition:border-color 0.2s; — hover: border-color:rgba(255,255,255,0.55)
- .photo-placeholder: text-align:center; color:rgba(255,255,255,0.5); padding:20px;
- MOBILE (<768px): .hero-grid: grid-template-columns:1fr; gap:32px; — .hero-visual ОБЯЗАТЕЛЬНО видимо (display:block, НЕ display:none), ширина 100%, max-width:320px, margin:0 auto; .hero-visual .photo-slot: aspect-ratio:4/3; border-radius:16px; — .hero-text: text-align:center; — .hero-actions: justify-content:center; — .hero-trust: justify-content:center; — порядок в grid: сначала .hero-visual (order:-1), потом .hero-text
- Анимация: @keyframes fadeInUp для .hero-text (from: opacity:0; transform:translateY(30px) — to: opacity:1; transform:none) — animation: 0.7s ease

Верни ТОЛЬКО HTML <section id="hero"> + <style data-block="hero">.""",

    "about": """Сгенерируй HTML-блок #about для лендинга.

Структура:
<section id="about">
  <div class="container">
    <div class="about-grid">
      <div class="about-photos">
        <div class="photo-main photo-slot" data-photo-slot="about-main">
          <div class="photo-placeholder"><svg><!-- иконка --></svg><span>Фото интерьера / команды</span></div>
        </div>
        <div class="photo-small photo-slot" data-photo-slot="about-small">
          <div class="photo-placeholder"><svg><!-- иконка --></svg><span>Фото 2</span></div>
        </div>
      </div>
      <div class="about-content">
        <div class="section-label">О НАС</div>
        <h2>Заголовок — ключевое обещание компании</h2>
        <p>Текст о компании — история, подход, почему возникли</p>
        <p>Что отличает от конкурентов — конкретно</p>
        <div class="about-stats">
          <div class="stat"><span class="stat-num">N+</span><span class="stat-text">лет опыта</span></div>
          <div class="stat"><span class="stat-num">N+</span><span class="stat-text">клиентов</span></div>
          <div class="stat"><span class="stat-num">N</span><span class="stat-text">специалистов</span></div>
        </div>
      </div>
    </div>
  </div>
</section>

CSS требования:
- section#about: padding:90px 0; background:var(--c-light);
- .section-label: font-size:12px; font-weight:700; letter-spacing:2px; color:var(--c-accent); text-transform:uppercase; margin-bottom:12px;
- h2: font-size:clamp(1.7rem,3vw,2.8rem); font-family:var(--font-heading); color:var(--c-dark); line-height:1.2; margin-bottom:20px;
- .about-grid: display:grid; grid-template-columns:1fr 1fr; gap:60px; align-items:center;
- .about-photos: position:relative; display:grid; grid-template-rows:1fr auto; gap:14px;
- .photo-main.photo-slot: aspect-ratio:4/3; border-radius:20px; overflow:hidden; background:#e9eef2; display:flex; align-items:center; justify-content:center; cursor:pointer; border:2px dashed #cbd5e1; transition:border-color 0.2s; — hover: border-color:var(--c-accent)
- .photo-small.photo-slot: aspect-ratio:16/7; border-radius:14px; overflow:hidden; background:#e9eef2; display:flex; align-items:center; justify-content:center; cursor:pointer; border:2px dashed #cbd5e1; transition:border-color 0.2s;
- .photo-placeholder: text-align:center; color:#94a3b8; font-size:13px; padding:16px; — svg: margin-bottom 8px, width:32px, height:32px, opacity:0.5
- .about-content p: font-size:16px; line-height:1.75; color:#4a5568; margin-bottom:16px;
- .about-stats: display:grid; grid-template-columns:repeat(3,1fr); gap:16px; margin-top:32px; padding-top:32px; border-top:1px solid #e2e8f0;
- .stat: text-align:center;
- .stat-num: display:block; font-size:2.2rem; font-weight:800; color:var(--c-accent); font-family:var(--font-heading); line-height:1;
- .stat-text: display:block; font-size:12px; color:#718096; margin-top:4px;
- MOBILE: .about-grid: grid-template-columns:1fr; gap:32px; — .about-photos: grid-template-rows:auto auto;

Верни ТОЛЬКО HTML <section id="about"> + <style data-block="about">.""",

    "services": """Сгенерируй HTML-блок #services для лендинга.

ВАЖНО: для каждой услуги добавь data-атрибут data-service-id со slug (транслит названия, строчные буквы, дефисы вместо пробелов).
Пример: услуга "Стрижка и укладка" → data-service-id="strizhka-i-ukladka"

Структура:
<section id="services">
  <div class="container">
    <div class="section-header">
      <div class="section-label">УСЛУГИ</div>
      <h2>Заголовок секции</h2>
      <p class="section-sub">Краткое описание — что предлагаем</p>
    </div>
    <div class="services-grid">
      <!-- 4-6 карточек по количеству услуг из данных -->
      <div class="service-card" data-service-id="slug-uslugi">
        <div class="service-icon"><!-- SVG-иконка 36x36 по теме услуги --></div>
        <h3>Название услуги</h3>
        <p>Описание 2 предложения — что получает клиент</p>
        <div class="service-price">от X ₽</div><!-- если цены есть в данных -->
        <div class="service-actions">
          <a href="#contact" class="service-link">Записаться →</a>
          <a href="#subpage-slug-uslugi" class="service-more">Узнать подробнее</a>
        </div>
      </div>
    </div>
  </div>
</section>

CSS требования:
- section#services: padding:90px 0; background:#fff;
- .section-header: text-align:center; margin-bottom:50px;
- .section-label: font-size:12px; font-weight:700; letter-spacing:2px; color:var(--c-accent); text-transform:uppercase; margin-bottom:12px;
- h2: font-size:clamp(1.7rem,3vw,2.8rem); font-family:var(--font-heading); color:var(--c-dark);
- .section-sub: font-size:17px; color:#718096; margin-top:12px; max-width:560px; margin-left:auto; margin-right:auto; line-height:1.6;
- .services-grid: display:grid; grid-template-columns:repeat(auto-fit,minmax(270px,1fr)); gap:24px;
- .service-card: background:var(--c-light); border-radius:18px; padding:32px 28px; border:1px solid #e8edf2; transition:all 0.25s; position:relative; overflow:hidden; display:flex; flex-direction:column;
- .service-card::before: content:''; position:absolute; top:0; left:0; right:0; height:3px; background:linear-gradient(90deg,var(--c-primary),var(--c-accent));
- .service-card:hover: transform:translateY(-6px); box-shadow:0 20px 50px rgba(0,0,0,0.1); border-color:var(--c-accent);
- .service-icon: width:52px; height:52px; background:linear-gradient(135deg,var(--c-primary),var(--c-accent)); border-radius:14px; display:flex; align-items:center; justify-content:center; margin-bottom:20px; — svg внутри: color:#fff
- h3: font-size:18px; font-weight:700; color:var(--c-dark); margin-bottom:10px;
- .service-card p: font-size:14px; line-height:1.65; color:#64748b; margin-bottom:16px; flex:1;
- .service-price: font-size:15px; font-weight:700; color:var(--c-accent); margin-bottom:14px;
- .service-actions: display:flex; flex-direction:column; gap:8px; margin-top:auto;
- .service-link: font-size:13px; font-weight:700; color:#fff; background:var(--c-accent); text-decoration:none; display:inline-flex; align-items:center; justify-content:center; gap:4px; padding:10px 18px; border-radius:9px; transition:opacity 0.2s; — hover: opacity:0.85
- .service-more: font-size:12px; font-weight:600; color:var(--c-accent); text-decoration:none; display:inline-flex; align-items:center; gap:4px; transition:gap 0.2s; — hover: gap:8px; text-decoration:underline
- MOBILE: grid-template-columns:1fr

Верни ТОЛЬКО HTML <section id="services"> + <style data-block="services">.""",

    "gallery": """Сгенерируй HTML-блок #gallery для лендинга — галерея фотографий.

Структура:
<section id="gallery">
  <div class="container">
    <div class="section-header">
      <div class="section-label">ГАЛЕРЕЯ</div>
      <h2>Наши работы / Наш интерьер</h2>
    </div>
    <div class="gallery-grid">
      <!-- 6 слотов для фото -->
      <div class="gallery-item photo-slot" data-photo-slot="gallery-1">
        <div class="photo-placeholder"><svg>...</svg><span>Фото 1</span></div>
      </div>
      <!-- ... gallery-2..6 -->
    </div>
  </div>
</section>

CSS требования:
- section#gallery: padding:80px 0; background:var(--c-light);
- .gallery-grid: display:grid; grid-template-columns:repeat(3,1fr); grid-template-rows:repeat(2,240px); gap:14px;
- Первый элемент .gallery-item:first-child: grid-column:span 2; — занимает 2 колонки, выглядит интереснее
- .gallery-item.photo-slot: border-radius:16px; overflow:hidden; background:#e2e8f0; cursor:pointer; border:2px dashed #cbd5e1; display:flex; align-items:center; justify-content:center; transition:all 0.2s; — hover: border-color:var(--c-accent); box-shadow:0 8px 24px rgba(0,0,0,0.12)
- .photo-placeholder: text-align:center; color:#94a3b8; font-size:13px; — svg: width:28px; height:28px; margin-bottom:8px; display:block; margin-left:auto; margin-right:auto;
- .gallery-item img (когда загружено): width:100%; height:100%; object-fit:cover; display:block;
- MOBILE: grid-template-columns:repeat(2,1fr); grid-template-rows:auto; — .gallery-item:first-child: grid-column:span 2;

Верни ТОЛЬКО HTML <section id="gallery"> + <style data-block="gallery">.""",

    "reviews": """Сгенерируй HTML-блок #reviews для лендинга.

Структура (генерируй 3 отзыва):
<section id="reviews">
  <div class="container">
    <div class="section-header">
      <div class="section-label">ОТЗЫВЫ</div>
      <h2>Что говорят наши клиенты</h2>
    </div>
    <div class="reviews-grid">
      <div class="review-card">
        <div class="review-stars">★★★★★</div>
        <p class="review-text">«Реальный отзыв — конкретный, с деталями, по теме бизнеса»</p>
        <div class="review-author">
          <div class="author-avatar photo-slot" data-photo-slot="review-avatar-1">
            <span class="avatar-initials">ИН</span>
          </div>
          <div>
            <div class="author-name">Имя Фамилия</div>
            <div class="author-meta">постоянный клиент · Город</div>
          </div>
        </div>
      </div>
      <!-- review-avatar-2, review-avatar-3 для остальных карточек -->
    </div>
  </div>
</section>

ВАЖНО по аватарам:
- Каждый аватар: <div class="author-avatar photo-slot" data-photo-slot="review-avatar-N">
- Внутри — <span class="avatar-initials">ИН</span> (инициалы как fallback)
- Когда фото загружено — img перекрывает initials через object-fit:cover
- Нумерация: review-avatar-1, review-avatar-2, review-avatar-3

CSS требования:
- section#reviews: padding:90px 0; background:#fff;
- .reviews-grid: display:grid; grid-template-columns:repeat(auto-fit,minmax(300px,1fr)); gap:24px;
- .review-card: background:var(--c-light); border-radius:20px; padding:32px; border:1px solid #e8edf2; position:relative; transition:box-shadow 0.2s; — hover: box-shadow:0 12px 40px rgba(0,0,0,0.08)
- .review-stars: color:var(--c-accent); font-size:18px; letter-spacing:2px; margin-bottom:16px;
- .review-text: font-size:15px; line-height:1.75; color:#4a5568; font-style:italic; margin-bottom:24px;
- .review-author: display:flex; align-items:center; gap:14px;
- .author-avatar: width:48px; height:48px; border-radius:50%; background:linear-gradient(135deg,var(--c-primary),var(--c-accent)); color:#fff; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:15px; flex-shrink:0; overflow:hidden; position:relative; cursor:pointer;
- .author-avatar img: position:absolute; inset:0; width:100%; height:100%; object-fit:cover; border-radius:50%;
- .author-name: font-weight:700; font-size:14px; color:var(--c-dark);
- .author-meta: font-size:12px; color:#94a3b8; margin-top:2px;
- МОБАЙЛ: grid-template-columns:1fr

Верни ТОЛЬКО HTML <section id="reviews"> + <style data-block="reviews">.""",

    "contact": """Сгенерируй HTML-блок #contact для лендинга.

Структура:
<section id="contact">
  <div class="container">
    <div class="contact-grid">
      <div class="contact-info">
        <div class="section-label">КОНТАКТЫ</div>
        <h2>Свяжитесь с нами</h2>
        <p>Запишитесь или задайте вопрос — ответим в течение часа</p>
        <div class="contact-items">
          <div class="contact-item"><span class="ci-icon">📍</span><div><b>Адрес</b><br><!-- адрес из данных --></div></div>
          <div class="contact-item"><span class="ci-icon">📞</span><div><b>Телефон</b><br><a href="tel:+7...">+7 (XXX) XXX-XX-XX</a></div></div>
          <div class="contact-item"><span class="ci-icon">🕐</span><div><b>Режим работы</b><br>Пн–Вс 10:00–21:00</div></div>
        </div>
      </div>
      <div class="contact-form-wrap">
        <form class="contact-form" onsubmit="return false;">
          <h3>Записаться / Задать вопрос</h3>
          <div class="form-group"><label>Ваше имя *</label><input type="text" placeholder="Как к вам обращаться?" required></div>
          <div class="form-group"><label>Телефон *</label><input type="tel" placeholder="+7 (___) ___-__-__" required></div>
          <div class="form-group"><label>Услуга</label><select><option value="">Выберите услугу...</option><!-- по данным --></select></div>
          <div class="form-group"><label>Комментарий</label><textarea rows="3" placeholder="Пожелания, вопросы..."></textarea></div>
          <div class="form-group form-checkbox-group">
            <label class="form-checkbox-label">
              <input type="checkbox" required>
              <span>Я согласен(а) с <a href="/privacy" target="_blank" class="form-policy-link">политикой конфиденциальности</a> и обработкой персональных данных</span>
            </label>
          </div>
          <button type="submit" class="form-submit">Отправить заявку</button>
        </form>
      </div>
    </div>
  </div>
</section>

CSS требования:
- section#contact: padding:90px 0; background:var(--c-dark); color:#fff;
- .contact-grid: display:grid; grid-template-columns:1fr 1.2fr; gap:60px; align-items:start;
- .section-label: color:var(--c-accent); font-size:12px; font-weight:700; letter-spacing:2px; text-transform:uppercase; margin-bottom:12px;
- h2: font-size:clamp(1.7rem,3vw,2.6rem); font-family:var(--font-heading); margin-bottom:16px;
- .contact-info p: font-size:16px; opacity:0.75; line-height:1.65; margin-bottom:32px;
- .contact-items: display:flex; flex-direction:column; gap:20px;
- .contact-item: display:flex; gap:16px; align-items:flex-start;
- .ci-icon: font-size:22px; flex-shrink:0; margin-top:2px;
- .contact-item b: display:block; font-size:13px; font-weight:700; opacity:0.6; margin-bottom:3px; letter-spacing:0.5px; text-transform:uppercase;
- .contact-item a: color:#fff; text-decoration:none; font-size:16px; — hover: color:var(--c-accent)
- .contact-form-wrap: background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1); border-radius:24px; padding:36px; backdrop-filter:blur(8px);
- .contact-form h3: font-size:20px; font-weight:700; margin-bottom:24px; color:#fff;
- .form-group: margin-bottom:18px;
- .form-group label: display:block; font-size:12px; font-weight:600; opacity:0.7; margin-bottom:7px; letter-spacing:0.5px; text-transform:uppercase;
- input, select, textarea: width:100%; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.15); border-radius:10px; padding:13px 16px; color:#fff; font-size:15px; font-family:var(--font-body); outline:none; transition:border-color 0.2s; — focus: border-color:var(--c-accent); background:rgba(255,255,255,0.12)
- select option: background:#1a2a3a; color:#fff;
- .form-submit: width:100%; background:var(--c-accent); color:#fff; border:none; padding:16px; border-radius:12px; font-size:16px; font-weight:700; cursor:pointer; font-family:var(--font-body); transition:opacity 0.2s; — hover: opacity:0.85
- КРИТИЧЕСКИ ВАЖНО — чекбокс согласия (обязателен в каждой форме!):
  .form-checkbox-group: margin-bottom:16px;
  .form-checkbox-label: display:flex !important; flex-direction:row !important; align-items:flex-start !important; gap:10px !important; cursor:pointer; font-size:13px; color:rgba(255,255,255,0.75); line-height:1.5; text-transform:none !important; letter-spacing:0 !important; opacity:1 !important; font-weight:400 !important; margin-bottom:0 !important;
  .form-checkbox-label input[type=checkbox]: width:18px; height:18px; min-width:18px; margin-top:2px; flex-shrink:0; accent-color:var(--c-accent); cursor:pointer; background:transparent;
  .form-policy-link: color:var(--c-accent); text-decoration:underline; — hover: opacity:0.8
- MOBILE: .contact-grid: grid-template-columns:1fr; gap:40px;

Верни ТОЛЬКО HTML <section id="contact"> + <style data-block="contact">.""",

    "footer": """Сгенерируй HTML-блок <footer> для лендинга.

Структура:
<footer>
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <div class="footer-logo">НАЗВАНИЕ</div>
        <p>Краткое описание — 1 предложение о бизнесе</p>
        <div class="footer-social"><!-- иконки соцсетей если есть --></div>
      </div>
      <div class="footer-links">
        <div class="footer-col-title">Навигация</div>
        <nav><a href="#about">О нас</a><a href="#services">Услуги</a><a href="#gallery">Галерея</a><a href="#reviews">Отзывы</a><a href="#contact">Контакты</a></nav>
      </div>
      <div class="footer-contacts">
        <div class="footer-col-title">Контакты</div>
        <p>📍 <!-- адрес --></p>
        <p>📞 <!-- телефон --></p>
        <p>✉️ <!-- email --></p>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2025 <!-- название -->. Все права защищены.</span>
      <a href="/privacy" target="_blank" class="footer-policy">Политика конфиденциальности</a>
    </div>
  </div>
</footer>

CSS требования:
- footer: background:#0d1117; color:rgba(255,255,255,0.65); padding:60px 0 0;
- .footer-grid: display:grid; grid-template-columns:1.5fr 1fr 1fr; gap:48px; padding-bottom:48px;
- .footer-logo: font-family:var(--font-heading); font-size:22px; font-weight:700; color:#fff; margin-bottom:12px;
- .footer-brand p: font-size:14px; line-height:1.65; opacity:0.65; max-width:260px;
- .footer-col-title: font-size:11px; font-weight:700; text-transform:uppercase; letter-spacing:2px; color:rgba(255,255,255,0.4); margin-bottom:16px;
- .footer-links nav, .footer-contacts: display:flex; flex-direction:column; gap:10px;
- .footer-links a: color:rgba(255,255,255,0.65); text-decoration:none; font-size:14px; transition:color 0.2s; — hover: color:#fff
- .footer-contacts p: font-size:14px;
- .footer-social: display:flex; gap:12px; margin-top:20px;
- .footer-bottom: border-top:1px solid rgba(255,255,255,0.08); padding:20px 0; display:flex; justify-content:space-between; align-items:center; font-size:13px;
- .footer-policy: color:rgba(255,255,255,0.4); text-decoration:none; — hover: color:#fff
- MOBILE: .footer-grid: grid-template-columns:1fr; gap:32px; — .footer-bottom: flex-direction:column; gap:8px; text-align:center

Верни ТОЛЬКО HTML <footer>...</footer> + <style data-block="footer">.""",

    "pain": """Сгенерируй HTML-блок #pain — «Боли клиента» для лендинга в стиле сторителлинга.
Структура: заголовок «Узнаёте себя?» → 4–6 карточек с болями/проблемами клиента (иконка + текст) → переход к решению.
CSS: секция на светлом фоне var(--c-light), карточки в сетке 2–3 колонки, каждая с левой цветной полосой var(--c-accent), плавный hover.
Верни ТОЛЬКО HTML <section id="pain"> + <style data-block="pain">.""",

    "solution": """Сгенерируй HTML-блок #solution — «Наше решение» для лендинга.
Структура: badge «РЕШЕНИЕ» → сильный заголовок → описание решения → 3 ключевых результата (иконка + число + описание) → CTA-кнопка.
CSS: тёмный фон var(--c-dark), белый текст, числа крупным шрифтом clamp(2.5rem,5vw,4rem) цветом var(--c-accent).
Верни ТОЛЬКО HTML <section id="solution"> + <style data-block="solution">.""",

    "team": """Сгенерируй HTML-блок #team — «Команда» для лендинга.
Структура: заголовок → 3–4 карточки специалистов (слот для фото data-photo-slot="team-N", имя, должность, опыт, специализация).
CSS: светлый фон, карточки в сетке 3–4 колонки, фото круглое или квадратное с border-radius:16px, hover — карточка приподнимается.
MOBILE: 2 колонки → 1 колонка.
Верни ТОЛЬКО HTML <section id="team"> + <style data-block="team">.""",

    "benefits": """Сгенерируй HTML-блок #benefits — «Выгоды» для продающего лендинга.
Структура: заголовок «Почему выбирают нас» → 6 карточек выгод (SVG-иконка 40×40 + заголовок выгоды + 1 предложение).
CSS: alternating фон (белый/светлый), карточки в сетке 3×2, крупные иконки цветом var(--c-accent), hover — тень с цветом.
Верни ТОЛЬКО HTML <section id="benefits"> + <style data-block="benefits">.""",

    "howworks": """Сгенерируй HTML-блок #howworks — «Как мы работаем» для лендинга.
Структура: заголовок → 3–4 шага (номер → заголовок → описание) соединённые линией/стрелкой → CTA-кнопка.
CSS: светлый фон, шаги горизонтально на десктопе, номер крупный (clamp(3rem,6vw,5rem)) полупрозрачным цветом var(--c-accent)20%.
MOBILE: шаги вертикально.
Верни ТОЛЬКО HTML <section id="howworks"> + <style data-block="howworks">.""",

    "pricing": """Сгенерируй HTML-блок #pricing — «Цены / тарифы» для лендинга.
Структура: заголовок → 2–3 тарифных карточки (название, цена, список включённого, CTA-кнопка). Средний тариф выделить как «Популярный».
CSS: тёмный фон var(--c-dark), карточки белые/полупрозрачные, популярный тариф с border var(--c-accent) и badge.
Верни ТОЛЬКО HTML <section id="pricing"> + <style data-block="pricing">.""",

    "faq": """Сгенерируй HTML-блок #faq — «Частые вопросы» для лендинга.
Структура: заголовок → 5–7 вопросов-ответов в виде аккордеона (details/summary или JS-аккордеон).
CSS: светлый фон, каждый вопрос с разделителем, при открытии — плавная анимация, иконка + / × справа.
JS: простой аккордеон — клик на вопрос открывает/закрывает ответ, закрывает остальные.
Верни ТОЛЬКО HTML <section id="faq"> + <style data-block="faq"> + <script data-block="faq">.""",

    "cases": """Сгенерируй HTML-блок #cases — «Кейсы / результаты» для B2B лендинга.
Структура: заголовок → 2–3 карточки кейсов (задача → решение → результат в цифрах, слот для скриншота/фото).
CSS: светлый фон, карточки с левой цветной полосой var(--c-primary), результаты выделены жирным цветом var(--c-accent).
Верни ТОЛЬКО HTML <section id="cases"> + <style data-block="cases">.""",

    "clients": """Сгенерируй HTML-блок #clients — «Наши клиенты» для B2B лендинга.
Структура: заголовок «Нам доверяют» → сетка из 6–9 логотипов клиентов (заглушки — стилизованные прямоугольники с названиями компаний) → цитата довольного клиента.
CSS: светлый фон, логотипы серые при обычном состоянии и цветные при hover (filter: grayscale(1) → grayscale(0)).
Верни ТОЛЬКО HTML <section id="clients"> + <style data-block="clients">.""",

    "program": """Сгенерируй HTML-блок #program — «Программа» для лендинга мероприятия/курса.
Структура: заголовок → табы по дням или модулям (если несколько) → для каждого: время + тема + спикер + краткое описание.
CSS: тёмный фон, табы вверху цветом var(--c-accent), расписание как временная шкала.
JS: переключение табов.
Верни ТОЛЬКО HTML <section id="program"> + <style data-block="program"> + <script data-block="program">.""",

    "speakers": """Сгенерируй HTML-блок #speakers — «Спикеры» для лендинга мероприятия.
Структура: заголовок → 3–4 карточки спикеров (слот для фото data-photo-slot="speaker-N", имя, должность/компания, тема доклада, соцсети).
CSS: светлый фон, карточки горизонтальные (фото слева + текст справа) или вертикальные сетка 2×2.
Верни ТОЛЬКО HTML <section id="speakers"> + <style data-block="speakers">.""",

    "menu": """Сгенерируй HTML-блок #menu — «Меню / хиты» для ресторанного лендинга.
Структура: заголовок «Наши хиты» → 6–8 карточек блюд (слот для фото data-photo-slot="dish-N", название, описание 1 строка, цена).
CSS: тёплый фон (#fef3c7 или похожий), карточки в сетке 3–4 колонки, фото сверху с border-radius:12px, цена цветом var(--c-accent).
MOBILE: 2 колонки → 1 колонка.
Верни ТОЛЬКО HTML <section id="menu"> + <style data-block="menu">.""",

    "promo": """Сгенерируй HTML-блок #promo — «Акции и спецпредложения» для лендинга.
Структура: заголовок → 2–3 карточки акций (бейдж «Акция», название, условие, срок действия, CTA-кнопка).
CSS: яркий акцентный фон var(--c-accent), карточки белые, бейдж с анимацией pulse, кнопка тёмная.
Верни ТОЛЬКО HTML <section id="promo"> + <style data-block="promo">.""",

    "booking": """Сгенерируй HTML-блок #booking — «Забронировать стол» для ресторанного лендинга.
Структура: заголовок → форма (имя, телефон, дата, количество гостей, пожелания, чекбокс согласия с /privacy, кнопка «Забронировать») → контакты и адрес сбоку.
CSS: тёмный фон var(--c-dark), форма как в блоке contact, поля стилизованы под ресторанную тему.
Верни ТОЛЬКО HTML <section id="booking"> + <style data-block="booking">.""",

    "object": """Сгенерируй HTML-блок #object — «Об объекте» для лендинга недвижимости.
Структура: заголовок → 3–4 ключевые характеристики (иконка + цифра + подпись: площади, этажи, сроки сдачи, класс жилья) → описание + слот для фото data-photo-slot="object-main".
CSS: светлый фон, характеристики крупными цифрами clamp(2rem,4vw,3.5rem) цветом var(--c-accent).
Верни ТОЛЬКО HTML <section id="object"> + <style data-block="object">.""",

    "location": """Сгенерируй HTML-блок #location — «Расположение и район» для лендинга недвижимости.
Структура: заголовок «Идеальное расположение» → список преимуществ района (иконка + текст: школы, метро, парки, магазины) → блок с адресом и заглушкой карты.
CSS: светлый/тёмный фон, преимущества в 2 колонки, заглушка карты — div с background var(--c-primary) и текстом «Карта».
Верни ТОЛЬКО HTML <section id="location"> + <style data-block="location">.""",

    "plans": """Сгенерируй HTML-блок #plans — «Планировки» для лендинга недвижимости.
Структура: заголовок → табы (студия/1-комн/2-комн и т.д.) → для каждого: слот для изображения планировки data-photo-slot="plan-N", площадь, цена, CTA-кнопка.
CSS: светлый фон, табы стилизованы, активный таб var(--c-accent), планировки показываются/скрываются.
JS: переключение табов.
Верни ТОЛЬКО HTML <section id="plans"> + <style data-block="plans"> + <script data-block="plans">.""",

    "product": """Сгенерируй HTML-блок #product — «Товар» для лендинга одного товара.
Структура: слот для фото data-photo-slot="product-main" + галерея из 3 доп. фото → название → описание → 4–5 характеристик → значки доверия (гарантия, доставка, возврат).
CSS: белый фон, двухколоночная сетка (фото слева, текст справа), характеристики в таблице, значки доверия с иконками.
MOBILE: одна колонка, фото сверху.
Верни ТОЛЬКО HTML <section id="product"> + <style data-block="product">.""",

    "order": """Сгенерируй HTML-блок #order — «Оформить заказ» для лендинга товара.
Структура: заголовок «Оформить заказ» → форма (имя, телефон, адрес доставки, количество, чекбокс согласия с /privacy, кнопка «Заказать») → итоговая цена + условия доставки сбоку.
CSS: акцентный фон var(--c-accent) или тёмный var(--c-dark), форма белая с тенью, цена крупно.
Верни ТОЛЬКО HTML <section id="order"> + <style data-block="order">.""",
}

SYSTEM_GEN_BLOCK = """Ты — одновременно senior frontend-разработчик (10+ лет) и профессиональный веб-копирайтер. Создаёшь HTML-блоки для лендингов уровня топ-студий: красивый код + продающий текст.

ДАННЫЕ О БИЗНЕСЕ (это сырой материал — твоя задача переработать его в профессиональный контент):
{context}

CSS-ПЕРЕМЕННЫЕ (уже определены в :root — используй их, не хардкоди HEX):
--c-primary: {primary}
--c-accent: {accent}
--c-dark: {dark}
--c-light: {light}
--c-text: {text}
--font-heading: '{heading_font}', serif
--font-body: '{body_font}', sans-serif

━━━ ПРАВИЛА КОПИРАЙТИНГА (КРИТИЧЕСКИ ВАЖНО) ━━━
• НЕ копируй дословно то, что написал пользователь — переформулируй профессионально
• Заголовки (h1, h2): короткие, сильные, с выгодой для клиента. Без воды. Пример плохо: "Мы занимаемся массажем". Хорошо: "Восстановите тело за 60 минут — без боли и усталости"
• Подзаголовки и описания: конкретика + эмоция. Цифры там где уместно. Активный залог
• Кнопки CTA: глагол действия — "Записаться сейчас", "Получить консультацию", "Узнать цену"
• Преимущества: формат "выгода, а не функция". Не "Работаем 10 лет" → "За 10 лет — 2000+ довольных клиентов"
• Отзывы: живые, с деталями, правдоподобные для данной ниши
• Tone of voice: профессионально, тепло, уверенно — не официозно и не фамильярно

━━━ ПРАВИЛА ВИЗУАЛА (КРИТИЧЕСКИ ВАЖНО) ━━━
• Декор на hero и тёмных секциях: SVG-паттерны, абстрактные формы, градиентные блобы — всё через CSS/SVG, не через внешние картинки
• Иконки услуг: SVG-иконки 36×36 по теме каждой услуги (не эмодзи, не unicode-символы)
• Карточки: тени с цветом (box-shadow с полупрозрачным var(--c-accent) или var(--c-primary)), не серые
• Типографика: используй clamp() для адаптивных размеров, достаточные отступы (padding секций ≥ 80px 0)
• Hover-эффекты: на всех интерактивных элементах (карточки, кнопки, ссылки)
• Мобильная адаптация: обязательно @media (max-width: 768px) для каждой секции

━━━ ТЕХНИЧЕСКИЕ ПРАВИЛА ━━━
1. ТОЛЬКО CSS-переменные — никаких хардкод-цветов
2. CSS — строго в <style data-block="ИМЯ_БЛОКА">
3. JS — строго в <script data-block="ИМЯ_БЛОКА">
4. Контейнер: class="container" (уже задан: max-width:1200px; margin:0 auto; padding:0 20px)
5. Все якорные ссылки: href="#about", href="#services", href="#gallery", href="#reviews", href="#contact"
6. Слоты для фото — div.photo-slot с data-photo-slot="уникальное-имя", внутри div.photo-placeholder с SVG-иконкой и подписью
7. Верни ТОЛЬКО HTML-фрагмент — без <!DOCTYPE>, без <html>, без <head>, без markdown```"""

SYSTEM_EDIT_BLOCK = """Ты — senior frontend-разработчик и профессиональный веб-копирайтер. Переделай блок лендинга по запросу пользователя.

ТЕКУЩИЙ HTML БЛОКА:
{block_html}

CSS-ПЕРЕМЕННЫЕ сайта:
--c-primary: {primary}; --c-accent: {accent}; --c-dark: {dark}; --c-light: {light}; --c-text: {text}
--font-heading: '{heading_font}', serif; --font-body: '{body_font}', sans-serif

ПРАВИЛА КОПИРАЙТИНГА:
- Если меняешь текст — пиши профессионально, как опытный копирайтер: сильные заголовки с выгодой, конкретика, активный залог
- Кнопки CTA: глагол действия ("Записаться", "Получить", "Узнать")
- Не копируй сырой ввод пользователя дословно — улучшай формулировки

ТЕХНИЧЕСКИЕ ПРАВИЛА:
- Сохрани data-block атрибут в <style> и <script>
- Используй только CSS-переменные, не хардкоди цвета
- Сохрани все .photo-slot элементы
- Верни ТОЛЬКО новый HTML-фрагмент блока, без объяснений и без markdown"""


def get_db():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def ok(data):
    return {"statusCode": 200, "headers": {**CORS, "Content-Type": "application/json"},
            "body": json.dumps(data, ensure_ascii=False)}


def err(msg, status=400):
    return {"statusCode": status, "headers": CORS,
            "body": json.dumps({"error": msg}, ensure_ascii=False)}


def get_session_user(event, conn):
    sid = (event.get("headers") or {}).get("X-Session-Id", "") or \
          (event.get("headers") or {}).get("x-session-id", "")
    if not sid:
        return None
    with conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor) as cur:
        safe_id = sid.replace("'", "''")
        cur.execute(
            f"SELECT u.id, u.salon_id FROM {SCHEMA}.lk_sessions s "
            f"JOIN {SCHEMA}.lk_users u ON u.id = s.user_id "
            f"WHERE s.id = '{safe_id}' AND s.expires_at > NOW() AND u.is_active = TRUE"
        )
        return cur.fetchone()


def check_and_spend(conn, user, tool_key, default_cost, action_name):
    salon_id = user.get("salon_id")
    if not salon_id:
        return err("Необходим профиль салона для использования ИИ", 402)
    with conn.cursor() as cur:
        cur.execute(f"SELECT energy_cost FROM {SCHEMA}.tool_costs WHERE tool_key = %s", (tool_key,))
        row = cur.fetchone()
        cost = row[0] if row else default_cost
        cur.execute(f"SELECT credits_balance FROM {SCHEMA}.salons WHERE id = %s", (salon_id,))
        row = cur.fetchone()
        balance = row[0] if row else 0
        if balance < cost:
            return err(f"Недостаточно энергии. Нужно {cost} ⚡, доступно {balance} ⚡. Пополните баланс.", 402)
        cur.execute(f"UPDATE {SCHEMA}.salons SET credits_balance = credits_balance - %s WHERE id = %s", (cost, salon_id))
        cur.execute(
            f"INSERT INTO {SCHEMA}.credit_transactions (salon_id, user_id, action, amount, tool_key, type) "
            f"VALUES (%s, %s, %s, %s, %s, 'debit')",
            (salon_id, user["id"], action_name, cost, tool_key)
        )
    conn.commit()
    return None


def hex_to_rgb(h):
    h = h.lstrip("#")
    try:
        r, g, b = int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16)
        return f"{r},{g},{b}"
    except Exception:
        return "0,0,0"


def safe_format(template: str, **kwargs) -> str:
    """Заменяет только известные плейсхолдеры, не трогая остальные {…}"""
    for key, value in kwargs.items():
        template = template.replace("{" + key + "}", str(value))
    return template


def handler(event: dict, context) -> dict:
    """Генератор лендингов: чат + блочная генерация + редактирование блоков"""
    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    conn = get_db()
    try:
        user = get_session_user(event, conn)
        if not user:
            return err("Не авторизован", 401)

        body = json.loads(event.get("body") or "{}")
        mode = body.get("mode", "chat")
        landing_type = body.get("landingType", "classic")
        messages = body.get("messages", [])

        client = OpenAI(
            base_url="https://polza.ai/api/v1",
            api_key=os.environ["POLZA_AI_API_KEY"],
        )

        # ── ЧАТ: сбор данных о бизнесе ──────────────────────────────────────
        if mode == "chat":
            energy_err = check_and_spend(conn, user, "landing_chat", 4, "Сообщение в чате конструктора лендингов")
            if energy_err:
                return energy_err
            system = CHAT_PROMPTS.get(landing_type, CHAT_PROMPTS["classic"])
            resp = client.chat.completions.create(
                model="openai/gpt-4.1-mini",
                messages=[{"role": "system", "content": system}] + messages,
                max_tokens=700, temperature=0.7,
            )
            return ok({"reply": resp.choices[0].message.content or "", "mode": "chat"})

        # ── GEN-STYLE: генерация CSS-темы ────────────────────────────────────
        if mode == "gen-style":
            energy_err = check_and_spend(conn, user, "landing_generate", 16, "Генерация стиля лендинга")
            if energy_err:
                return energy_err
            context_text = "\n".join([f"{m['role']}: {m['content']}" for m in messages[-10:]])
            resp = client.chat.completions.create(
                model="openai/gpt-4.1-mini",
                messages=[
                    {"role": "system", "content": SYSTEM_GEN_STYLE},
                    {"role": "user", "content": f"Данные о бизнесе:\n{context_text}"}
                ],
                max_tokens=300, temperature=0.8,
            )
            raw = resp.choices[0].message.content or "{}"
            # Извлекаем JSON если обёрнут в markdown
            if "```" in raw:
                raw = raw.split("```")[1]
                if raw.startswith("json"):
                    raw = raw[4:]
            try:
                style = json.loads(raw.strip())
            except Exception:
                style = {
                    "primary": "#1a3a4a", "accent": "#e67e22", "dark": "#0f2030",
                    "light": "#f8f9fa", "text": "#2c3e50",
                    "headingFont": "Playfair Display", "bodyFont": "Montserrat"
                }
            return ok({"style": style, "mode": "gen-style"})

        # ── GEN-BLOCK: генерация одного блока ────────────────────────────────
        if mode == "gen-block":
            block_id = body.get("blockId", "")
            style = body.get("style", {})
            if not block_id or block_id not in BLOCK_PROMPTS:
                return err(f"Неизвестный blockId: {block_id}", 400)

            energy_err = check_and_spend(conn, user, "landing_generate", 20, f"Генерация блока {block_id}")
            if energy_err:
                return energy_err

            context_parts = [f"{m['role']}: {m['content']}" for m in messages[-12:]]
            context_text = "\n".join(context_parts)

            dark_rgb = hex_to_rgb(style.get("dark", "#0f2030"))
            system = safe_format(SYSTEM_GEN_BLOCK,
                context=context_text,
                primary=style.get("primary", "#1a3a4a"),
                accent=style.get("accent", "#e67e22"),
                dark=style.get("dark", "#0f2030"),
                light=style.get("light", "#f8f9fa"),
                text=style.get("text", "#2c3e50"),
                heading_font=style.get("headingFont", "Playfair Display"),
                body_font=style.get("bodyFont", "Montserrat"),
                dark_rgb=dark_rgb,
            )
            block_prompt = safe_format(BLOCK_PROMPTS[block_id], dark_rgb=dark_rgb)

            resp = client.chat.completions.create(
                model="openai/gpt-4.1",
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": block_prompt}
                ],
                max_tokens=3500, temperature=0.65,
            )
            html_fragment = resp.choices[0].message.content or ""
            # Убираем markdown если модель всё-таки обернула
            if html_fragment.startswith("```"):
                lines = html_fragment.split("\n")
                html_fragment = "\n".join(lines[1:-1]) if lines[-1].strip() == "```" else "\n".join(lines[1:])
            return ok({"html": html_fragment, "blockId": block_id, "mode": "gen-block"})

        # ── EDIT-BLOCK: переделать один блок ─────────────────────────────────
        if mode == "edit-block":
            block_id = body.get("blockId", "")
            block_html = body.get("blockHtml", "")
            edit_task = body.get("editTask", "")
            style = body.get("style", {})
            if not block_html or not edit_task:
                return err("blockHtml и editTask обязательны", 400)

            energy_err = check_and_spend(conn, user, "landing_refine", 24, f"Редактирование блока {block_id}")
            if energy_err:
                return energy_err

            system = safe_format(SYSTEM_EDIT_BLOCK,
                block_html=block_html,
                primary=style.get("primary", "#1a3a4a"),
                accent=style.get("accent", "#e67e22"),
                dark=style.get("dark", "#0f2030"),
                light=style.get("light", "#f8f9fa"),
                text=style.get("text", "#2c3e50"),
                heading_font=style.get("headingFont", "Playfair Display"),
                body_font=style.get("bodyFont", "Montserrat"),
            )
            resp = client.chat.completions.create(
                model="openai/gpt-4.1",
                messages=[
                    {"role": "system", "content": system},
                    {"role": "user", "content": f"Измени этот блок: {edit_task}"}
                ],
                max_tokens=3500, temperature=0.65,
            )
            html_fragment = resp.choices[0].message.content or ""
            return ok({"html": html_fragment, "blockId": block_id, "mode": "edit-block"})

        # ── GEN-SUBPAGE: генерация подстраницы услуги ────────────────────────
        if mode == "gen-subpage":
            service_name = body.get("serviceName", "")
            service_slug = body.get("serviceSlug", "")
            description = body.get("description", "")
            style = body.get("style", {})
            chat_messages = body.get("subpageMessages", [])

            if not service_name or not service_slug:
                return err("serviceName и serviceSlug обязательны", 400)

            energy_err = check_and_spend(conn, user, "landing_generate", 24, f"Генерация подстраницы: {service_name}")
            if energy_err:
                return energy_err

            dark_rgb = hex_to_rgb(style.get("dark", "#0f2030"))
            gfonts_url = f"https://fonts.googleapis.com/css2?family={style.get('headingFont','Playfair Display').replace(' ','+')}:wght@700&family={style.get('bodyFont','Montserrat').replace(' ','+')}:wght@400;600&display=swap"

            context_for_subpage = description or "\n".join([f"{m['role']}: {m['content']}" for m in chat_messages[-8:]])

            subpage_system = f"""Ты — senior frontend-разработчик. Сгенерируй полноценную HTML-подстраницу для услуги "{service_name}".

CSS-переменные сайта (используй их, не хардкоди цвета):
--c-primary: {style.get('primary','#1a3a4a')}; --c-accent: {style.get('accent','#e67e22')};
--c-dark: {style.get('dark','#0f2030')}; --c-light: {style.get('light','#f8f9fa')}; --c-text: {style.get('text','#2c3e50')};
--font-heading: '{style.get('headingFont','Playfair Display')}', serif;
--font-body: '{style.get('bodyFont','Montserrat')}', sans-serif;

Описание услуги от пользователя:
{context_for_subpage}

СТРУКТУРА страницы (строгий порядок):
1. <div id="sp-{service_slug}"> — обёртка всей подстраницы
2. Компактная шапка с логотипом/названием и кнопкой «← Назад» (href="#" onclick="history.back();return false;")
3. Hero-секция услуги: крупный заголовок, подзаголовок, CTA-кнопка «Записаться»
4. Подробное описание: что входит в услугу, этапы/процесс (3-5 шагов с иконками)
5. Ключевые преимущества (3-4 карточки)
6. Цены/тарифы (если есть в описании)
7. FAQ — 3-4 частых вопроса с ответами (аккордеон на чистом JS)
8. Форма обратной связи (имя, телефон, кнопка)
9. Футер с ссылкой «← Вернуться на главную» (href="#" onclick="history.back();return false;")
</div>

ТЕХНИЧЕСКИЕ ТРЕБОВАНИЯ:
- Весь CSS scope через #sp-{service_slug} — НЕ влияет на основной лендинг
- Google Fonts: подключи через @import url('{gfonts_url}') внутри <style>
- CSS-переменные используй как есть — они уже объявлены на странице
- Адаптивность: мобильный first, breakpoint 768px
- data-rgb для rgba(): --c-dark-rgb: {dark_rgb};
- Все кнопки «Записаться» scrollTo к #contact или открывают tel:

Верни ТОЛЬКО готовый HTML-фрагмент <style data-subpage="{service_slug}">...</style><div id="sp-{service_slug}">...</div>"""

            resp = client.chat.completions.create(
                model="openai/gpt-4.1",
                messages=[
                    {"role": "system", "content": subpage_system},
                    {"role": "user", "content": f"Сгенерируй подстраницу для услуги: {service_name}"}
                ],
                max_tokens=4000, temperature=0.65,
            )
            html_fragment = resp.choices[0].message.content or ""
            if html_fragment.startswith("```"):
                lines = html_fragment.split("\n")
                html_fragment = "\n".join(lines[1:-1]) if lines[-1].strip() == "```" else "\n".join(lines[1:])
            return ok({"html": html_fragment, "serviceSlug": service_slug, "serviceName": service_name, "mode": "gen-subpage"})

        # ── SUBPAGE-CHAT: диалог для сбора данных о подстранице ──────────────
        if mode == "subpage-chat":
            service_name = body.get("serviceName", "")
            chat_messages = body.get("messages", [])

            energy_err = check_and_spend(conn, user, "landing_chat", 4, f"Чат подстраницы: {service_name}")
            if energy_err:
                return energy_err

            subpage_chat_system = f"""Ты — помощник по созданию страниц услуг для сайта. Собери информацию об услуге "{service_name}" через короткий дружелюбный чат.

Нужно узнать (задавай строго 1-2 вопроса за раз):
1. Что именно входит в услугу — подробно
2. Для кого она подходит (целевая аудитория)
3. Как проходит процесс — шаги/этапы
4. Сколько стоит и сколько длится
5. Частые вопросы клиентов об этой услуге

Когда получишь ответы на все 5 пунктов — ответь ТОЛЬКО фразой: "Отлично, данных достаточно! Создать страницу?" и жди подтверждения.
Отвечай по-русски, коротко и дружелюбно."""

            resp = client.chat.completions.create(
                model="openai/gpt-4.1-mini",
                messages=[{"role": "system", "content": subpage_chat_system}] + chat_messages,
                max_tokens=500, temperature=0.7,
            )
            return ok({"reply": resp.choices[0].message.content or "", "mode": "subpage-chat"})

        # ── EDIT-STYLE: изменить стиль сайта по запросу ─────────────────────
        if mode == "edit-style":
            current_style = body.get("style", {})
            style_task = body.get("styleTask", "")
            if not style_task:
                return err("styleTask обязателен", 400)

            energy_err = check_and_spend(conn, user, "landing_refine", 12, "Изменение стиля лендинга")
            if energy_err:
                return energy_err

            system_style = f"""Ты — дизайнер интерфейсов. Пользователь хочет изменить стиль лендинга.

Текущий стиль:
{json.dumps(current_style, ensure_ascii=False)}

На основе запроса пользователя предложи 3 варианта нового стиля. Верни ТОЛЬКО JSON без markdown:
{{
  "variants": [
    {{
      "name": "Название варианта (2-3 слова)",
      "primary": "#HEX",
      "accent": "#HEX",
      "dark": "#HEX",
      "light": "#HEX",
      "text": "#HEX",
      "headingFont": "Название шрифта Google Fonts",
      "bodyFont": "Название шрифта Google Fonts"
    }}
  ]
}}

Правила:
- Каждый вариант должен отличаться по настроению: например тёмный, светлый, яркий
- primary — основной цвет бренда
- accent — яркий акцент для кнопок
- dark — тёмный фон (hero, footer)
- light — очень светлый фон (#f8f9fa или похожий)
- text — тёмный цвет текста
- headingFont: Playfair Display, Cormorant Garamond, Raleway, Merriweather, Roboto Slab, Cinzel и т.д.
- bodyFont: Montserrat, Inter, Open Sans, Lato, Nunito и т.д.
Верни ТОЛЬКО JSON."""

            resp = client.chat.completions.create(
                model="openai/gpt-4.1-mini",
                messages=[
                    {"role": "system", "content": system_style},
                    {"role": "user", "content": style_task}
                ],
                max_tokens=600, temperature=0.85,
            )
            raw = resp.choices[0].message.content or "{}"
            if "```" in raw:
                raw = raw.split("```")[1]
                if raw.startswith("json"):
                    raw = raw[4:]
            try:
                result = json.loads(raw.strip())
                variants = result.get("variants", [])
            except Exception:
                variants = []
            return ok({"variants": variants, "mode": "edit-style"})

        # ── REFINE: доработка всего HTML (совместимость) ─────────────────────
        if mode == "refine":
            html = body.get("html", "")
            refine_task = body.get("refineTask", "")
            if not html or not refine_task:
                return err("html и refineTask обязательны", 400)
            energy_err = check_and_spend(conn, user, "landing_refine", 80, "ИИ-доработка лендинга")
            if energy_err:
                return energy_err
            resp = client.chat.completions.create(
                model="openai/gpt-4.1-mini",
                messages=[
                    {"role": "system", "content": "Ты — профессиональный верстальщик. Выполни конкретное изменение в HTML-лендинге. Верни ТОЛЬКО полный HTML без markdown. Начинай с <!DOCTYPE html>."},
                    {"role": "user", "content": f"HTML:\n{html}\n\nЧто изменить: {refine_task}"}
                ],
                max_tokens=6000, temperature=0.7,
            )
            return ok({"reply": resp.choices[0].message.content or "", "mode": "refine"})

        return err(f"Неизвестный mode: {mode}", 400)

    finally:
        conn.close()