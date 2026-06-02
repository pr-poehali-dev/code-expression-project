CREATE TABLE t_p84565078_code_expression_proj.image_jobs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
  salon_id    INTEGER,
  prompt      TEXT NOT NULL,
  aspect_ratio VARCHAR(10) NOT NULL DEFAULT '1:1',
  status      VARCHAR(20) NOT NULL DEFAULT 'pending',
  result_url  TEXT,
  error_msg   TEXT,
  cost        INTEGER NOT NULL DEFAULT 5,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_image_jobs_user ON t_p84565078_code_expression_proj.image_jobs(user_id, created_at DESC);
