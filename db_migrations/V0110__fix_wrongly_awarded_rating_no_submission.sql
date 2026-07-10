UPDATE t_p84565078_code_expression_proj.ch_ratings
SET total_points = GREATEST(total_points - 20, 0),
    season_points = GREATEST(season_points - 20, 0),
    participations = GREATEST(participations - 1, 0),
    updated_at = NOW()
WHERE salon_id = 6
  AND EXISTS (
      SELECT 1 FROM t_p84565078_code_expression_proj.ch_applications a
      WHERE a.tournament_id = 9 AND a.salon_id = 6 AND a.status = 'approved'
        AND NOT EXISTS (
            SELECT 1 FROM t_p84565078_code_expression_proj.ch_works w
            WHERE w.tournament_id = 9 AND w.salon_id = 6 AND w.is_public = TRUE
        )
  );