-- Таблица салонов
CREATE TABLE t_p84565078_code_expression_proj.salons (
  id                  SERIAL PRIMARY KEY,
  owner_id            INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),

  -- Основное
  name                VARCHAR(255) NOT NULL,
  city                VARCHAR(100),
  address             TEXT,
  description         TEXT,
  logo_url            TEXT,

  -- Финансы
  avg_check           NUMERIC(10,2),
  monthly_revenue     NUMERIC(12,2),
  clients_count       INTEGER,
  masters_count       INTEGER,

  -- Маркетинг
  target_audience     TEXT,
  tone_of_voice       VARCHAR(100),
  social_instagram    VARCHAR(255),
  social_vk           VARCHAR(255),
  social_telegram     VARCHAR(255),
  main_goal           TEXT,

  -- Мета
  is_active           BOOLEAN NOT NULL DEFAULT true,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Услуги салона
CREATE TABLE t_p84565078_code_expression_proj.salon_services (
  id          SERIAL PRIMARY KEY,
  salon_id    INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.salons(id),
  name        VARCHAR(255) NOT NULL,
  price_min   NUMERIC(10,2),
  price_max   NUMERIC(10,2),
  duration_min INTEGER,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Роли пользователей
CREATE TABLE t_p84565078_code_expression_proj.lk_roles (
  id          SERIAL PRIMARY KEY,
  code        VARCHAR(50) NOT NULL UNIQUE,
  name        VARCHAR(100) NOT NULL,
  description TEXT
);

INSERT INTO t_p84565078_code_expression_proj.lk_roles (code, name, description) VALUES
  ('owner',          'Владелец',           'Полный доступ, управление салоном и сотрудниками'),
  ('admin',          'Администратор',      'Доступ к обучению администратора и инструментам'),
  ('master',         'Мастер красоты',     'Доступ к обучению мастеров и инструментам'),
  ('body_specialist','Специалист по телу', 'Доступ к обучению и диагностическим инструментам');

-- Участники салона
CREATE TABLE t_p84565078_code_expression_proj.salon_members (
  id          SERIAL PRIMARY KEY,
  salon_id    INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.salons(id),
  user_id     INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
  role_code   VARCHAR(50) NOT NULL DEFAULT 'master',
  invited_by  INTEGER REFERENCES t_p84565078_code_expression_proj.lk_users(id),
  joined_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(salon_id, user_id)
);

-- Расширяем lk_users
ALTER TABLE t_p84565078_code_expression_proj.lk_users
  ADD COLUMN IF NOT EXISTS role VARCHAR(50) NOT NULL DEFAULT 'body_specialist',
  ADD COLUMN IF NOT EXISTS salon_id INTEGER REFERENCES t_p84565078_code_expression_proj.salons(id);
