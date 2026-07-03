UPDATE t_p84565078_code_expression_proj.salons
SET credits_balance = credits_balance - 1000
WHERE id = 1;

UPDATE t_p84565078_code_expression_proj.ch_tournaments
SET status = 'finished_pending', updated_at = NOW()
WHERE id = 3;