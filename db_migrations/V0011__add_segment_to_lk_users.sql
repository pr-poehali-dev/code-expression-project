ALTER TABLE t_p84565078_code_expression_proj.lk_users
ADD COLUMN IF NOT EXISTS segment VARCHAR(20) NOT NULL DEFAULT 'specialist';

COMMENT ON COLUMN t_p84565078_code_expression_proj.lk_users.segment IS 'specialist — частный специалист, salon — салон';