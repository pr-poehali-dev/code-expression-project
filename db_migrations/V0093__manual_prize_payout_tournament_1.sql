UPDATE t_p84565078_code_expression_proj.salons
SET credits_balance = credits_balance + 1000
WHERE id = 1;

INSERT INTO t_p84565078_code_expression_proj.credit_transactions (salon_id, user_id, action, amount, tool_key, type)
VALUES (1, 1, 'Приз за 1 место в турнире «Первый»', 1000, NULL, 'credit');