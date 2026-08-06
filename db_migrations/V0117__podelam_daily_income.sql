CREATE TABLE t_p84565078_code_expression_proj.podelam_daily_income (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
    income_date DATE NOT NULL,
    amount NUMERIC(12,2) NOT NULL DEFAULT 0,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, income_date)
);