CREATE TABLE IF NOT EXISTS t_p84565078_code_expression_proj.traffic_sources (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  url TEXT,
  category VARCHAR(50) NOT NULL, -- search | social | specialized_site | paid | own_resource | partner
  audience TEXT, -- краткое описание какой аудитории подходит
  categories_target VARCHAR(30)[] NOT NULL DEFAULT '{}', -- salon | solo_master | psychologist | body_psychologist
  content_types TEXT[] DEFAULT '{}', -- экспертная статья, кейс, комментарий, профиль и т.д.
  is_paid BOOLEAN NOT NULL DEFAULT FALSE,
  allowed_in_russia BOOLEAN NOT NULL DEFAULT TRUE,
  priority VARCHAR(10) NOT NULL DEFAULT 'medium', -- high | medium | low
  notes TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active', -- active | disabled
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_traffic_sources_status ON t_p84565078_code_expression_proj.traffic_sources(status);

-- Базовый набор разрешённых и актуальных для РФ каналов — редактируется из админки
INSERT INTO t_p84565078_code_expression_proj.traffic_sources
  (name, url, category, audience, categories_target, content_types, is_paid, allowed_in_russia, priority, notes, status)
VALUES
  ('Яндекс (органический поиск)', 'https://yandex.ru', 'search', 'Люди, активно ищущие специалиста или услугу прямо сейчас', ARRAY['salon','solo_master','psychologist','body_psychologist'], ARRAY['SEO-статья','карточка услуги'], FALSE, TRUE, 'high', 'Основной поисковый канал в РФ — самый горячий трафик', 'active'),
  ('Яндекс Карты', 'https://yandex.ru/maps', 'search', 'Люди рядом ищут локальную услугу', ARRAY['salon','solo_master'], ARRAY['профиль организации','отзывы','фото работ'], FALSE, TRUE, 'high', 'Критично для локального бизнеса — салонов и мастеров с точкой оказания услуг', 'active'),
  ('VK', 'https://vk.com', 'social', 'Широкая аудитория 25-55, локальные сообщества и группы по интересам', ARRAY['salon','solo_master','psychologist','body_psychologist'], ARRAY['пост','сторис','кейс','видео'], FALSE, TRUE, 'high', 'Универсальная площадка — сообщество салона/специалиста + локальные группы города', 'active'),
  ('Telegram', 'https://telegram.org', 'social', 'Активная аудитория, ценит экспертный контент и личный бренд', ARRAY['salon','solo_master','psychologist','body_psychologist'], ARRAY['авторский канал','пост','сторис'], FALSE, TRUE, 'high', 'Растущий канал для личного бренда специалиста, особенно у психологов', 'active'),
  ('Дзен', 'https://dzen.ru', 'social', 'Аудитория, ищущая полезный контент и лонгриды', ARRAY['salon','solo_master','psychologist','body_psychologist'], ARRAY['статья','экспертный материал'], FALSE, TRUE, 'medium', 'Хорошо работает для экспертного контента и SEO-эффекта', 'active'),
  ('Профи.ру', 'https://profi.ru', 'specialized_site', 'Люди, целенаправленно ищущие частного специалиста', ARRAY['solo_master','psychologist','body_psychologist'], ARRAY['профиль специалиста','портфолио'], TRUE, TRUE, 'medium', 'Каталог специалистов — платное продвижение анкеты', 'active'),
  ('Яндекс Услуги', 'https://uslugi.yandex.ru', 'specialized_site', 'Люди, ищущие бытовые и бьюти-услуги рядом', ARRAY['salon','solo_master'], ARRAY['профиль услуги','отзывы'], FALSE, TRUE, 'medium', 'Каталог услуг с локальной выдачей', 'active'),
  ('B17.ru', 'https://www.b17.ru', 'specialized_site', 'Люди, ищущие психолога, читают статьи по психологии', ARRAY['psychologist','body_psychologist'], ARRAY['экспертная статья','профиль психолога','консультация в блоге'], FALSE, TRUE, 'high', 'Крупнейший российский каталог психологов и площадка для экспертных статей', 'active'),
  ('Яндекс Директ', 'https://direct.yandex.ru', 'paid', 'Аудитория с явным поисковым запросом на услугу', ARRAY['salon','solo_master','psychologist','body_psychologist'], ARRAY['рекламное объявление'], TRUE, TRUE, 'medium', 'Платный канал — рекомендовать с учётом бюджета и среднего чека', 'active'),
  ('VK Реклама', 'https://ads.vk.com', 'paid', 'Таргетированная аудитория по интересам и геолокации', ARRAY['salon','solo_master','psychologist','body_psychologist'], ARRAY['рекламный пост','баннер'], TRUE, TRUE, 'medium', 'Платный канал с гибким таргетингом по интересам', 'active'),
  ('Местные городские сообщества и форумы', NULL, 'social', 'Жители конкретного города/района', ARRAY['salon','solo_master'], ARRAY['пост','рекомендация','отзыв'], FALSE, TRUE, 'medium', 'Актуально для локального бизнеса — уточнять по конкретному городу пользователя', 'active'),
  ('Профессиональные сообщества и форумы коллег', NULL, 'specialized_site', 'Коллеги, которые могут рекомендовать клиентам', ARRAY['solo_master','psychologist','body_psychologist'], ARRAY['экспертный комментарий','нетворкинг'], FALSE, TRUE, 'low', 'Источник партнёрских рекомендаций, не прямых клиентов', 'active')
ON CONFLICT DO NOTHING;
