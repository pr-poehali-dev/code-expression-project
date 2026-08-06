CREATE TABLE t_p84565078_code_expression_proj.podelam_profiles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
    salon_id INTEGER REFERENCES t_p84565078_code_expression_proj.salons(id),
    niche VARCHAR(255),
    avg_check NUMERIC(10,2) NOT NULL,
    current_revenue NUMERIC(12,2) NOT NULL,
    target_revenue NUMERIC(12,2) NOT NULL,
    clients_per_month INTEGER NOT NULL DEFAULT 0,
    base_size INTEGER NOT NULL DEFAULT 0,
    repeat_rate INTEGER NOT NULL DEFAULT 0,
    free_slots_per_week INTEGER NOT NULL DEFAULT 0,
    has_addon_services BOOLEAN NOT NULL DEFAULT FALSE,
    lead_source VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE TABLE t_p84565078_code_expression_proj.podelam_daily_plans (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
    plan_date DATE NOT NULL,
    main_task_key VARCHAR(50),
    gap_amount NUMERIC(12,2),
    tasks JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, plan_date)
);

CREATE TABLE t_p84565078_code_expression_proj.podelam_task_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
    plan_date DATE NOT NULL,
    task_key VARCHAR(50) NOT NULL,
    done BOOLEAN NOT NULL DEFAULT FALSE,
    actual_amount NUMERIC(12,2),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, plan_date, task_key)
);