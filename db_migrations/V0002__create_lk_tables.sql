CREATE TABLE t_p84565078_code_expression_proj.lk_users (
  id            SERIAL PRIMARY KEY,
  username      VARCHAR(100) UNIQUE NOT NULL,
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name     VARCHAR(255),
  is_admin      BOOLEAN NOT NULL DEFAULT FALSE,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  notes         TEXT
);

CREATE TABLE t_p84565078_code_expression_proj.lk_sessions (
  id         VARCHAR(64) PRIMARY KEY,
  user_id    INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL DEFAULT NOW() + INTERVAL '30 days',
  user_agent TEXT
);

CREATE TABLE t_p84565078_code_expression_proj.lk_body_zones (
  id          SERIAL PRIMARY KEY,
  slug        VARCHAR(100) UNIQUE NOT NULL,
  name        VARCHAR(255) NOT NULL,
  description TEXT,
  diagnosis   TEXT,
  video_url   TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE t_p84565078_code_expression_proj.lk_body_techniques (
  id          SERIAL PRIMARY KEY,
  zone_id     INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_body_zones(id),
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  video_url   TEXT,
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE t_p84565078_code_expression_proj.lk_tests (
  id          SERIAL PRIMARY KEY,
  slug        VARCHAR(100) UNIQUE NOT NULL,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  icon        VARCHAR(50),
  sort_order  INTEGER NOT NULL DEFAULT 0,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE t_p84565078_code_expression_proj.lk_test_questions (
  id          SERIAL PRIMARY KEY,
  test_id     INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_tests(id),
  text        TEXT NOT NULL,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE t_p84565078_code_expression_proj.lk_test_options (
  id          SERIAL PRIMARY KEY,
  question_id INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_test_questions(id),
  text        TEXT NOT NULL,
  score       INTEGER NOT NULL DEFAULT 0,
  sort_order  INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE t_p84565078_code_expression_proj.lk_test_results (
  id          SERIAL PRIMARY KEY,
  test_id     INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_tests(id),
  score_min   INTEGER NOT NULL,
  score_max   INTEGER NOT NULL,
  title       VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  advice      TEXT NOT NULL
);

CREATE TABLE t_p84565078_code_expression_proj.lk_user_test_results (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
  test_id      INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_tests(id),
  score        INTEGER NOT NULL,
  result_id    INTEGER REFERENCES t_p84565078_code_expression_proj.lk_test_results(id),
  answers      JSONB,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
