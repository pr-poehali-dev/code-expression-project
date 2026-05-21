CREATE TABLE t_p84565078_code_expression_proj.lk_finance_results (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
  ifr          INTEGER NOT NULL DEFAULT 0,
  ifj          INTEGER NOT NULL DEFAULT 0,
  ifu          INTEGER NOT NULL DEFAULT 0,
  ipn          INTEGER NOT NULL DEFAULT 0,
  idm          INTEGER NOT NULL DEFAULT 0,
  ifp          INTEGER NOT NULL DEFAULT 0,
  jlj          INTEGER NOT NULL DEFAULT 0,
  fr           INTEGER NOT NULL DEFAULT 0,
  mpd          INTEGER NOT NULL DEFAULT 0,
  nsc          INTEGER NOT NULL DEFAULT 0,
  nck          INTEGER NOT NULL DEFAULT 0,
  data         JSONB NOT NULL DEFAULT '{}',
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);