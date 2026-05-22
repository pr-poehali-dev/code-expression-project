ALTER TABLE t_p84565078_code_expression_proj.lk_users
ADD COLUMN IF NOT EXISTS access_expires_at TIMESTAMPTZ NULL;

COMMENT ON COLUMN t_p84565078_code_expression_proj.lk_users.access_expires_at IS 'NULL = безлимитный доступ, иначе — дата окончания доступа';