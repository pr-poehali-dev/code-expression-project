-- Скрыть тестовый турнир "Тест 7" (id=9) отовсюду: архив, рейтинг, зал славы
UPDATE t_p84565078_code_expression_proj.ch_tournaments
SET is_hidden = TRUE, updated_at = NOW()
WHERE id = 9;

-- Откатить рейтинг, ошибочно начисленный за этот тестовый турнир (salon_id=1: wins+1, top3+1, participations+1, points+20)
UPDATE t_p84565078_code_expression_proj.ch_ratings
SET wins = GREATEST(wins - 1, 0),
    top3_count = GREATEST(top3_count - 1, 0),
    total_points = GREATEST(total_points - 20, 0),
    season_points = GREATEST(season_points - 20, 0),
    participations = GREATEST(participations - 1, 0),
    updated_at = NOW()
WHERE salon_id = 1;