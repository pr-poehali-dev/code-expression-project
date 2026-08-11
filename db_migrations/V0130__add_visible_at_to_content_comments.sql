ALTER TABLE t_p84565078_code_expression_proj.content_comments
  ADD COLUMN IF NOT EXISTS visible_at TIMESTAMPTZ NOT NULL DEFAULT NOW();