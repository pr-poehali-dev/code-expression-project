CREATE TABLE IF NOT EXISTS t_p84565078_code_expression_proj.landing_leads (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
    fields JSONB NOT NULL DEFAULT '{}',
    source_domain VARCHAR(255) NULL,
    email_sent BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);