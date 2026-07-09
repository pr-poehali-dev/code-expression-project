UPDATE t_p84565078_code_expression_proj.ch_tournaments
SET slug = 'test-3-' || id
WHERE id = 6 AND (slug IS NULL OR slug = '');