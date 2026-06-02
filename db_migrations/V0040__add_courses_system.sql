-- Курсы
CREATE TABLE t_p84565078_code_expression_proj.courses (
  id               SERIAL PRIMARY KEY,
  title            VARCHAR(200) NOT NULL,
  description      TEXT,
  cover_url        TEXT,
  category         VARCHAR(100) NOT NULL DEFAULT 'body',
  is_published     BOOLEAN NOT NULL DEFAULT false,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  access_cost      INTEGER NOT NULL DEFAULT 0,
  lesson_cost      INTEGER NOT NULL DEFAULT 1,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Модули курса
CREATE TABLE t_p84565078_code_expression_proj.course_modules (
  id               SERIAL PRIMARY KEY,
  course_id        INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.courses(id),
  title            VARCHAR(200) NOT NULL,
  sort_order       INTEGER NOT NULL DEFAULT 0
);

-- Уроки
CREATE TABLE t_p84565078_code_expression_proj.course_lessons (
  id               SERIAL PRIMARY KEY,
  module_id        INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.course_modules(id),
  course_id        INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.courses(id),
  title            VARCHAR(300) NOT NULL,
  content          TEXT,
  video_urls       JSONB NOT NULL DEFAULT '[]',
  links            JSONB NOT NULL DEFAULT '[]',
  ai_context       TEXT,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Файлы урока
CREATE TABLE t_p84565078_code_expression_proj.lesson_files (
  id               SERIAL PRIMARY KEY,
  lesson_id        INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.course_lessons(id),
  name             VARCHAR(300) NOT NULL,
  url              TEXT NOT NULL,
  size_bytes       INTEGER,
  mime_type        VARCHAR(100),
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Фото урока
CREATE TABLE t_p84565078_code_expression_proj.lesson_photos (
  id               SERIAL PRIMARY KEY,
  lesson_id        INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.course_lessons(id),
  url              TEXT NOT NULL,
  sort_order       INTEGER NOT NULL DEFAULT 0,
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Доступ к курсу (оплата за весь курс)
CREATE TABLE t_p84565078_code_expression_proj.course_access (
  id               SERIAL PRIMARY KEY,
  user_id          INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
  course_id        INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.courses(id),
  granted_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, course_id)
);

-- Открытые уроки (оплата за каждый урок)
CREATE TABLE t_p84565078_code_expression_proj.lesson_access (
  id               SERIAL PRIMARY KEY,
  user_id          INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
  lesson_id        INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.course_lessons(id),
  opened_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

CREATE INDEX idx_course_modules_course ON t_p84565078_code_expression_proj.course_modules(course_id);
CREATE INDEX idx_course_lessons_module ON t_p84565078_code_expression_proj.course_lessons(module_id);
CREATE INDEX idx_course_lessons_course ON t_p84565078_code_expression_proj.course_lessons(course_id);
CREATE INDEX idx_course_access_user ON t_p84565078_code_expression_proj.course_access(user_id);
CREATE INDEX idx_lesson_access_user ON t_p84565078_code_expression_proj.lesson_access(user_id);
