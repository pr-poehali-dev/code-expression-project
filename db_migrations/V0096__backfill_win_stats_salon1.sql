UPDATE t_p84565078_code_expression_proj.ch_ratings
SET wins = wins + 1, top3_count = top3_count + 1, updated_at = NOW()
WHERE salon_id = 1;