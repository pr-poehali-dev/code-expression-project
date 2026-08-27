ALTER TABLE t_p84565078_code_expression_proj.lk_users
  ADD COLUMN IF NOT EXISTS specialization VARCHAR(30) NULL;

COMMENT ON COLUMN t_p84565078_code_expression_proj.lk_users.specialization IS
  'Уточнение специализации внутри частной практики: NULL/psychologist/body_psychologist';