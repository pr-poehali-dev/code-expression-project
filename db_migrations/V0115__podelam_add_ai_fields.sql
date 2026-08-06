ALTER TABLE t_p84565078_code_expression_proj.podelam_daily_plans
    ADD COLUMN IF NOT EXISTS tomorrow_preview TEXT,
    ADD COLUMN IF NOT EXISTS source VARCHAR(10) NOT NULL DEFAULT 'rules';