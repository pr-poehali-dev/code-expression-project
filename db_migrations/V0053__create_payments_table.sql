CREATE TABLE IF NOT EXISTS t_p84565078_code_expression_proj.payments (
    id            SERIAL PRIMARY KEY,
    salon_id      INTEGER NOT NULL,
    user_id       INTEGER NOT NULL,
    package_code  VARCHAR(50) NOT NULL,
    amount_rub    INTEGER NOT NULL,
    energy_amount INTEGER NOT NULL,
    yookassa_id   VARCHAR(100) UNIQUE,
    status        VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_payments_salon ON t_p84565078_code_expression_proj.payments(salon_id);
CREATE INDEX IF NOT EXISTS idx_payments_yookassa ON t_p84565078_code_expression_proj.payments(yookassa_id);
