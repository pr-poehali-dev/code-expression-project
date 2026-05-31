CREATE TABLE t_p84565078_code_expression_proj.ai_generated_images (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
  url         TEXT NOT NULL,
  prompt      TEXT,
  aspect_ratio VARCHAR(10),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
