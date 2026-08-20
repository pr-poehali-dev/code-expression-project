ALTER TABLE t_p84565078_code_expression_proj.podelam_daily_plans
    ADD COLUMN IF NOT EXISTS batch_start_date DATE;

-- Существующие строки — каждая свой "батч из одного дня", чтобы не ломать историю
UPDATE t_p84565078_code_expression_proj.podelam_daily_plans
    SET batch_start_date = plan_date
    WHERE batch_start_date IS NULL;

CREATE INDEX IF NOT EXISTS idx_podelam_daily_plans_batch
    ON t_p84565078_code_expression_proj.podelam_daily_plans (user_id, batch_start_date);

ALTER TABLE t_p84565078_code_expression_proj.podelam_daily_income
    ADD COLUMN IF NOT EXISTS new_clients INTEGER,
    ADD COLUMN IF NOT EXISTS returned_clients INTEGER;