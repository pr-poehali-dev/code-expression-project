CREATE TABLE t_p84565078_code_expression_proj.client_scripts (
  id          SERIAL PRIMARY KEY,
  user_id     INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
  role        VARCHAR(50) NOT NULL,
  situation   TEXT NOT NULL,
  script_text TEXT NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
