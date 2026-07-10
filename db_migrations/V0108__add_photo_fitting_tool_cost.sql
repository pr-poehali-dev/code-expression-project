INSERT INTO t_p84565078_code_expression_proj.tool_costs (tool_key, name, category, energy_cost, is_free)
VALUES ('photo_fitting', 'Примерочная (стрижка/макияж/ногти/фигура)', 'marketing', 45, false)
ON CONFLICT (tool_key) DO NOTHING;