CREATE TABLE t_p84565078_code_expression_proj.lk_barriers_results (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
  iib          INTEGER NOT NULL DEFAULT 0,
  ivo          INTEGER NOT NULL DEFAULT 0,
  iss          INTEGER NOT NULL DEFAULT 0,
  isd          INTEGER NOT NULL DEFAULT 0,
  ido          INTEGER NOT NULL DEFAULT 0,
  iir          INTEGER NOT NULL DEFAULT 0,
  iei          INTEGER NOT NULL DEFAULT 0,
  isp          INTEGER NOT NULL DEFAULT 0,
  type_title   VARCHAR(100) NOT NULL DEFAULT '',
  answers      JSONB NOT NULL DEFAULT '{}',
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);