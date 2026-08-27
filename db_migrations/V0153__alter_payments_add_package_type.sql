ALTER TABLE t_p84565078_code_expression_proj.payments
  ADD COLUMN IF NOT EXISTS payment_type VARCHAR(20) NOT NULL DEFAULT 'energy',
  ADD COLUMN IF NOT EXISTS period_months INTEGER NULL;

ALTER TABLE t_p84565078_code_expression_proj.payments
  ALTER COLUMN energy_amount SET DEFAULT 0;