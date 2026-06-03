INSERT INTO t_p84565078_code_expression_proj.tool_costs (tool_key, name, category, energy_cost, is_free, updated_at)
VALUES ('client_msg_gen', 'Генератор сообщений клиенту', 'communication', 1, false, NOW())
ON CONFLICT (tool_key) DO NOTHING;