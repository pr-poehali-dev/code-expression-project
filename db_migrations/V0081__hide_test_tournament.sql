-- V0081: Скрытие тестового турнира (статус cancelled, сезон неактивен)

UPDATE t_p84565078_code_expression_proj.ch_tournaments
  SET status = 'cancelled', updated_at = NOW()
  WHERE slug = 'luchshee-preobrazhenie-leto-2026';

UPDATE t_p84565078_code_expression_proj.ch_seasons
  SET is_active = FALSE
  WHERE slug = 'summer-2026';
