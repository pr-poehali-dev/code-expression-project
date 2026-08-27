INSERT INTO t_p84565078_code_expression_proj.package_plan_prices (plan_code, period_months, price_rub) VALUES
  ('start', 1, 2990), ('start', 3, 8070), ('start', 6, 14350), ('start', 12, 23320),
  ('growth', 1, 4990), ('growth', 3, 13470), ('growth', 6, 23950), ('growth', 12, 38920),
  ('pro', 1, 7990), ('pro', 3, 21570), ('pro', 6, 38350), ('pro', 12, 62320),
  ('max', 1, 11990), ('max', 3, 32370), ('max', 6, 57550), ('max', 12, 93520)
ON CONFLICT (plan_code, period_months) DO NOTHING;