UPDATE t_p84565078_code_expression_proj.tool_costs
SET tool_key = 'video_gen_5s', name = 'Генерация видео (5 сек)', energy_cost = 105
WHERE tool_key = 'video_gen';

INSERT INTO t_p84565078_code_expression_proj.tool_costs (tool_key, name, category, energy_cost, is_free)
VALUES ('video_gen_10s', 'Генерация видео (10 сек)', 'marketing', 180, false)
ON CONFLICT (tool_key) DO UPDATE SET energy_cost = EXCLUDED.energy_cost;