INSERT INTO t_p84565078_code_expression_proj.user_packages
  (user_id, salon_id, plan_code, period_months, price_rub, status, expires_at, auto_renew)
VALUES
  (1, 1, 'pro', 12, 0, 'active', NOW() + INTERVAL '365 days', FALSE);