ALTER TABLE t_p84565078_code_expression_proj.courses
  ADD COLUMN IF NOT EXISTS categories TEXT[] NOT NULL DEFAULT '{}';

UPDATE t_p84565078_code_expression_proj.courses
  SET categories = ARRAY[category]
  WHERE array_length(categories, 1) IS NULL OR array_length(categories, 1) = 0;
