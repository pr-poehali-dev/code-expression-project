CREATE TABLE t_p84565078_code_expression_proj.landing_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
  title VARCHAR(255) NOT NULL DEFAULT 'Без названия',
  landing_type VARCHAR(20) NOT NULL DEFAULT 'budget',
  html TEXT NOT NULL DEFAULT '',
  messages JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_landing_projects_user_id ON t_p84565078_code_expression_proj.landing_projects(user_id);
