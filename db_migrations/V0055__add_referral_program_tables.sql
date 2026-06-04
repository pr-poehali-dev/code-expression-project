-- Мастера (участники реферальной программы)
CREATE TABLE t_p84565078_code_expression_proj.masters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    inn VARCHAR(12),
    password_hash VARCHAR(255) NOT NULL,
    ref_code VARCHAR(20) UNIQUE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    terms_agreed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Реферальные связи: мастер → салон
CREATE TABLE t_p84565078_code_expression_proj.master_referrals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    master_id UUID NOT NULL REFERENCES t_p84565078_code_expression_proj.masters(id),
    salon_id INTEGER NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(salon_id)
);

-- Реферальный баланс мастера
CREATE TABLE t_p84565078_code_expression_proj.master_balance (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    master_id UUID UNIQUE NOT NULL REFERENCES t_p84565078_code_expression_proj.masters(id),
    pending_amount NUMERIC(12,2) DEFAULT 0,
    available_amount NUMERIC(12,2) DEFAULT 0,
    total_earned NUMERIC(12,2) DEFAULT 0,
    total_withdrawn NUMERIC(12,2) DEFAULT 0,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- История начислений
CREATE TABLE t_p84565078_code_expression_proj.master_accruals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    master_id UUID NOT NULL REFERENCES t_p84565078_code_expression_proj.masters(id),
    salon_id INTEGER NOT NULL,
    amount NUMERIC(12,2) NOT NULL,
    percent NUMERIC(5,2) DEFAULT 10,
    source_amount NUMERIC(12,2) NOT NULL,
    source_type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    available_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Запросы на вывод
CREATE TABLE t_p84565078_code_expression_proj.master_withdrawals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    master_id UUID NOT NULL REFERENCES t_p84565078_code_expression_proj.masters(id),
    amount NUMERIC(12,2) NOT NULL,
    inn VARCHAR(12) NOT NULL,
    bank_details TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    admin_comment TEXT,
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Сессии мастеров
CREATE TABLE t_p84565078_code_expression_proj.master_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    master_id UUID NOT NULL REFERENCES t_p84565078_code_expression_proj.masters(id),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX ON t_p84565078_code_expression_proj.master_referrals(master_id);
CREATE INDEX ON t_p84565078_code_expression_proj.master_accruals(master_id);
CREATE INDEX ON t_p84565078_code_expression_proj.master_accruals(available_at);
CREATE INDEX ON t_p84565078_code_expression_proj.master_withdrawals(master_id);
