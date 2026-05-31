CREATE TABLE t_p84565078_code_expression_proj.salon_audits (
  id              SERIAL PRIMARY KEY,
  user_id         INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
  salon_id        INTEGER REFERENCES t_p84565078_code_expression_proj.salons(id),

  -- Анкета (JSON)
  answers         JSONB NOT NULL DEFAULT '{}',

  -- Оценки по направлениям (1-10)
  score_clients   INTEGER,
  score_marketing INTEGER,
  score_sales     INTEGER,
  score_staff     INTEGER,
  score_management INTEGER,
  score_total     INTEGER,

  -- Результат от ИИ (JSON с секциями)
  result          JSONB,

  -- Статус
  status          VARCHAR(20) NOT NULL DEFAULT 'draft',  -- draft, completed

  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
