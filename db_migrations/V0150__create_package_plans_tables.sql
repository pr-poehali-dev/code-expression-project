CREATE TABLE t_p84565078_code_expression_proj.package_plans (
  id SERIAL PRIMARY KEY,
  code VARCHAR(30) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  daily_limit_per_tool INTEGER NOT NULL DEFAULT 1,
  has_deep_analysis BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE t_p84565078_code_expression_proj.package_plan_prices (
  id SERIAL PRIMARY KEY,
  plan_code VARCHAR(30) NOT NULL REFERENCES t_p84565078_code_expression_proj.package_plans(code),
  period_months INTEGER NOT NULL,
  price_rub INTEGER NOT NULL,
  UNIQUE(plan_code, period_months)
);