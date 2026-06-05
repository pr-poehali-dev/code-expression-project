-- Настройки автопополнения энергии по салону
CREATE TABLE t_p84565078_code_expression_proj.autopay_settings (
    id            SERIAL PRIMARY KEY,
    salon_id      INTEGER NOT NULL UNIQUE,
    is_enabled    BOOLEAN NOT NULL DEFAULT FALSE,
    package_code  VARCHAR(50) NOT NULL,
    threshold     INTEGER NOT NULL DEFAULT 50,
    payment_method_id VARCHAR(100),
    last_triggered_at TIMESTAMPTZ,
    created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_autopay_settings_salon ON t_p84565078_code_expression_proj.autopay_settings(salon_id);
CREATE INDEX idx_autopay_settings_enabled ON t_p84565078_code_expression_proj.autopay_settings(is_enabled);

-- Добавляем payment_method_id к payments для отслеживания сохранённых методов
ALTER TABLE t_p84565078_code_expression_proj.payments
    ADD COLUMN IF NOT EXISTS payment_method_id VARCHAR(100),
    ADD COLUMN IF NOT EXISTS is_autopay BOOLEAN DEFAULT FALSE;
