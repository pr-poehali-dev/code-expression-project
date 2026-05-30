ALTER TABLE t_p84565078_code_expression_proj.lk_users
  ADD COLUMN IF NOT EXISTS is_representative boolean NOT NULL DEFAULT false;

ALTER TABLE t_p84565078_code_expression_proj.lk_users
  ADD COLUMN IF NOT EXISTS rep_permissions text NULL;

COMMENT ON COLUMN t_p84565078_code_expression_proj.lk_users.is_representative IS 'Флаг представителя по работе с салонами';
COMMENT ON COLUMN t_p84565078_code_expression_proj.lk_users.rep_permissions IS 'JSON: список разрешённых разделов и возможностей для представителя';