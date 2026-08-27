CREATE TABLE t_p84565078_code_expression_proj.user_packages (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
  salon_id INTEGER REFERENCES t_p84565078_code_expression_proj.salons(id),
  plan_code VARCHAR(30) NOT NULL,
  period_months INTEGER NOT NULL,
  price_rub INTEGER NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at TIMESTAMPTZ NOT NULL,
  auto_renew BOOLEAN NOT NULL DEFAULT FALSE,
  payment_method_id VARCHAR(100),
  yookassa_payment_id VARCHAR(100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_user_packages_user_status ON t_p84565078_code_expression_proj.user_packages(user_id, status, expires_at);