CREATE TABLE IF NOT EXISTS t_p84565078_code_expression_proj.telegram_warnings (
    id SERIAL PRIMARY KEY,
    chat_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    warning_count INT NOT NULL DEFAULT 0,
    last_reason TEXT,
    last_violation_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (chat_id, user_id)
);