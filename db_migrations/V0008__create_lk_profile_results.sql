CREATE TABLE t_p84565078_code_expression_proj.lk_profile_results (
    id           SERIAL PRIMARY KEY,
    user_id      INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
    ifl          INTEGER NOT NULL DEFAULT 0,
    ifu          INTEGER NOT NULL DEFAULT 0,
    type_title   TEXT NOT NULL DEFAULT '',
    ifz          INTEGER NOT NULL DEFAULT 0,
    idt          INTEGER NOT NULL DEFAULT 0,
    in_idx       INTEGER NOT NULL DEFAULT 0,
    ifd          INTEGER NOT NULL DEFAULT 0,
    idm          INTEGER NOT NULL DEFAULT 0,
    idr          INTEGER NOT NULL DEFAULT 0,
    iit          INTEGER NOT NULL DEFAULT 0,
    ids          INTEGER NOT NULL DEFAULT 0,
    answers      JSONB NOT NULL DEFAULT '{}',
    completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);