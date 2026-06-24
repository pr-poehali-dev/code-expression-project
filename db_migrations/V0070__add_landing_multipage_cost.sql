INSERT INTO t_p84565078_code_expression_proj.tool_costs (tool_key, name, category, energy_cost, is_free)
VALUES ('landing_generate_multipage', 'Генерация мини-сайта', 'landing', 96, false)
ON CONFLICT (tool_key) DO UPDATE SET name = EXCLUDED.name, energy_cost = EXCLUDED.energy_cost, updated_at = NOW();
