-- Пакеты энергии (то что покупает владелец)
CREATE TABLE t_p84565078_code_expression_proj.energy_packages (
  id          SERIAL PRIMARY KEY,
  code        VARCHAR(50) NOT NULL UNIQUE,
  name        VARCHAR(100) NOT NULL,
  price_rub   INTEGER NOT NULL,
  energy_amount INTEGER NOT NULL,
  is_active   BOOLEAN NOT NULL DEFAULT true,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

INSERT INTO t_p84565078_code_expression_proj.energy_packages (code, name, price_rub, energy_amount, sort_order) VALUES
  ('start',   'Старт',   990,  150,  1),
  ('business','Бизнес',  2990, 550,  2),
  ('growth',  'Рост',    4990, 1200, 3),
  ('premium', 'Премиум', 9990, 3000, 4);

-- Стоимость инструментов (настраивается через админку)
CREATE TABLE t_p84565078_code_expression_proj.tool_costs (
  id          SERIAL PRIMARY KEY,
  tool_key    VARCHAR(100) NOT NULL UNIQUE,
  name        VARCHAR(200) NOT NULL,
  category    VARCHAR(100) NOT NULL,
  energy_cost INTEGER NOT NULL DEFAULT 1,
  is_free     BOOLEAN NOT NULL DEFAULT false,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO t_p84565078_code_expression_proj.tool_costs (tool_key, name, category, energy_cost, is_free) VALUES
  -- Маркетинг
  ('post_gen',         'Генерация поста',               'marketing', 1,  false),
  ('stories_gen',      'Генерация Stories',              'marketing', 1,  false),
  ('reel_script',      'Генерация Reels',                'marketing', 2,  false),
  ('content_plan',     'Контент-план на месяц',          'marketing', 2,  false),
  ('promo_gen',        'Генерация акции',                'marketing', 2,  false),
  ('special_offer',    'Генерация спецпредложения',      'marketing', 2,  false),
  ('loyalty_program',  'Генерация программы лояльности', 'marketing', 3,  false),
  -- Аналитика
  ('salon_audit',      'Анализ салона',                  'analytics', 10, false),
  ('staff_audit',      'Анализ персонала',               'analytics', 15, false),
  ('unit_economics',   'Юнит-экономика салона',          'analytics', 15, false),
  ('retention_analysis','Анализ возврата клиентов',      'analytics', 10, false),
  ('check_analysis',   'Анализ среднего чека',           'analytics', 10, false),
  -- Изображения
  ('image_gen',        'Создание изображения',           'images',    5,  false),
  ('banner_gen',       'Создание рекламного баннера',    'images',    5,  false),
  ('certificate_gen',  'Создание сертификата',           'images',    5,  false),
  ('service_card_gen', 'Создание карточки услуги',       'images',    5,  false),
  ('poster_gen',       'Создание афиши',                 'images',    5,  false),
  -- Специалисты по телу (платные)
  ('diagnostic',       'Диагностический помощник',       'specialist', 3, false),
  ('recovery_plan',    'План восстановления клиента',    'specialist', 5, false),
  ('procedure_select', 'Подбор программы процедур',      'specialist', 5, false),
  ('cheat_sheet',      'Профессиональная шпаргалка',     'specialist', 2, false),
  -- Скрипты (бесплатно)
  ('review_reply',     'Ответы на отзывы',               'free',       0, true),
  ('client_scripts',   'Скрипты общения',                'free',       0, true);

-- История транзакций энергии (пополнение + списание)
ALTER TABLE t_p84565078_code_expression_proj.credit_transactions
  ADD COLUMN IF NOT EXISTS tool_key VARCHAR(100),
  ADD COLUMN IF NOT EXISTS type VARCHAR(20) NOT NULL DEFAULT 'debit';
-- type: 'debit' = списание, 'credit' = пополнение

-- Добавляем индексы для быстрых запросов
CREATE INDEX IF NOT EXISTS idx_credit_tx_salon_created
  ON t_p84565078_code_expression_proj.credit_transactions(salon_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_credit_tx_user
  ON t_p84565078_code_expression_proj.credit_transactions(user_id);
