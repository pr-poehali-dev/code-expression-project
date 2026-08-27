ALTER TABLE t_p84565078_code_expression_proj.podelam_profiles
  ADD COLUMN IF NOT EXISTS conversion_rate INTEGER NULL;

COMMENT ON COLUMN t_p84565078_code_expression_proj.podelam_profiles.conversion_rate IS
  '% обращений, доходящих до первой консультации/записи — в первую очередь для частной практики (психологи)';