CREATE TABLE IF NOT EXISTS t_p84565078_code_expression_proj.photo_fittings (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
    scenario VARCHAR(20) NOT NULL,
    source_url TEXT NOT NULL,
    result_url TEXT,
    prompt TEXT,
    recommendation TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_photo_fittings_user ON t_p84565078_code_expression_proj.photo_fittings(user_id, created_at DESC);