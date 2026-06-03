INSERT INTO t_p84565078_code_expression_proj.tool_costs (tool_key, name, category, energy_cost, is_free)
VALUES ('direct_image_gen', 'Генерация рекламного изображения', 'marketing', 10, false)
ON CONFLICT (tool_key) DO UPDATE SET energy_cost = 10;