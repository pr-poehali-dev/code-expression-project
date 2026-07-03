UPDATE t_p84565078_code_expression_proj.ch_votes
SET score = 0
WHERE id IN (7, 8);

UPDATE t_p84565078_code_expression_proj.ch_works
SET votes_count = (SELECT COALESCE(SUM(score),0) FROM t_p84565078_code_expression_proj.ch_votes WHERE work_id = 4)
WHERE id = 4;