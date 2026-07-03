UPDATE t_p84565078_code_expression_proj.ch_applications
SET status = 'approved'
WHERE tournament_id = 3 AND salon_id = 1;

UPDATE t_p84565078_code_expression_proj.ch_tournaments
SET status = 'active',
    voting_starts = '2026-07-03T17:45:00+00:00',
    voting_ends   = '2026-07-03T21:00:00+00:00',
    updated_at = NOW()
WHERE id = 3;