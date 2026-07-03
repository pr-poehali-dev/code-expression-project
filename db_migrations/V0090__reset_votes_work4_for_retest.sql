UPDATE t_p84565078_code_expression_proj.ch_votes
SET user_id = NULL, score = 0
WHERE work_id = 4;

UPDATE t_p84565078_code_expression_proj.ch_works
SET votes_count = 0
WHERE id = 4;