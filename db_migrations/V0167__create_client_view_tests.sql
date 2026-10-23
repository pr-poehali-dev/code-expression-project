CREATE TABLE IF NOT EXISTS t_p84565078_code_expression_proj.client_view_tests (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
    parent_id INTEGER NULL,
    subject VARCHAR(30) NOT NULL,
    goal VARCHAR(30) NOT NULL,
    segment_label VARCHAR(120) NULL,
    city VARCHAR(120) NULL,
    audience TEXT NULL,
    material TEXT NOT NULL,
    result JSONB NULL,
    chat JSONB NOT NULL DEFAULT '[]'::jsonb,
    reality_note TEXT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_client_view_tests_user ON t_p84565078_code_expression_proj.client_view_tests (user_id, created_at DESC);

INSERT INTO t_p84565078_code_expression_proj.tool_costs (tool_key, name, category, energy_cost, is_free)
SELECT 'client_view', 'Покажи глазами клиента: анализ', 'ai', 3, FALSE
WHERE NOT EXISTS (SELECT 1 FROM t_p84565078_code_expression_proj.tool_costs WHERE tool_key = 'client_view');

INSERT INTO t_p84565078_code_expression_proj.tool_costs (tool_key, name, category, energy_cost, is_free)
SELECT 'client_view_ask', 'Покажи глазами клиента: вопрос клиенту', 'ai', 1, FALSE
WHERE NOT EXISTS (SELECT 1 FROM t_p84565078_code_expression_proj.tool_costs WHERE tool_key = 'client_view_ask');