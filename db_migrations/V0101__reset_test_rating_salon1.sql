UPDATE t_p84565078_code_expression_proj.ch_ratings
SET total_points = 0, season_points = 0, participations = 0, wins = 0, top3_count = 0, top10_count = 0, level = 'newcomer', updated_at = NOW()
WHERE salon_id = 1;