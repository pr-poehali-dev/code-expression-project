ALTER TABLE t_p84565078_code_expression_proj.ch_tournaments
ADD COLUMN IF NOT EXISTS is_hidden BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE t_p84565078_code_expression_proj.ch_tournaments
SET is_hidden = TRUE
WHERE id IN (1, 2);