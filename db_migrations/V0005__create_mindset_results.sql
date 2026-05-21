CREATE TABLE t_p84565078_code_expression_proj.lk_mindset_results (
  id           SERIAL PRIMARY KEY,
  user_id      INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
  igp          INTEGER NOT NULL,
  iu           INTEGER NOT NULL,
  ipm          INTEGER NOT NULL,
  ido          INTEGER NOT NULL,
  ipg          INTEGER NOT NULL,
  ics          INTEGER NOT NULL,
  isd          INTEGER NOT NULL,
  izk          INTEGER NOT NULL,
  type_title   VARCHAR(100) NOT NULL,
  answers      JSONB NOT NULL,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
