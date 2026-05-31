CREATE TABLE t_p84565078_code_expression_proj.staff_audits (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
  salon_id     INTEGER REFERENCES t_p84565078_code_expression_proj.salons(id),
  staff_data   JSONB NOT NULL DEFAULT '[]',  -- массив сотрудников с их метриками
  result       JSONB,                         -- результат анализа от ИИ
  status       VARCHAR(20) NOT NULL DEFAULT 'completed',
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
