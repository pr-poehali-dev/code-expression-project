ALTER TABLE t_p84565078_code_expression_proj.podelam_profiles
  ADD COLUMN IF NOT EXISTS about_me TEXT NULL,
  ADD COLUMN IF NOT EXISTS personal_goals TEXT[] NULL,
  ADD COLUMN IF NOT EXISTS personal_goals_other VARCHAR(300) NULL;

COMMENT ON COLUMN t_p84565078_code_expression_proj.podelam_profiles.about_me IS
  'Свободный текст: образование, опыт работы, бэкграунд специалиста — для точного подбора курсов/тренингов Академии';
COMMENT ON COLUMN t_p84565078_code_expression_proj.podelam_profiles.personal_goals IS
  'Немонетарные цели личного развития (список кодов из фиксированного набора, см. PERSONAL_GOAL_OPTIONS на фронте)';
COMMENT ON COLUMN t_p84565078_code_expression_proj.podelam_profiles.personal_goals_other IS
  'Свободный текст цели, если выбран пункт "другое"';