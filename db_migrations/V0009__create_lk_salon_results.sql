CREATE TABLE t_p84565078_code_expression_proj.lk_salon_results (
    id           SERIAL PRIMARY KEY,
    user_id      INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
    ips          INTEGER NOT NULL DEFAULT 0,
    ipp_loss     INTEGER NOT NULL DEFAULT 0,
    type_title   TEXT NOT NULL DEFAULT '',
    ivk          INTEGER NOT NULL DEFAULT 0,
    isc          INTEGER NOT NULL DEFAULT 0,
    iz           INTEGER NOT NULL DEFAULT 0,
    iea          INTEGER NOT NULL DEFAULT 0,
    ipu          INTEGER NOT NULL DEFAULT 0,
    ilk          INTEGER NOT NULL DEFAULT 0,
    ips_idx      INTEGER NOT NULL DEFAULT 0,
    hidden_money INTEGER NOT NULL DEFAULT 0,
    answers      JSONB NOT NULL DEFAULT '{}',
    numeric_data JSONB NOT NULL DEFAULT '{}',
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);