-- Обновляем стоимость существующих инструментов развития персонала до 5 энергии
UPDATE t_p84565078_code_expression_proj.tool_costs SET energy_cost = 5 WHERE tool_key IN ('barriers_analysis', 'mindset_analysis', 'profile_analysis', 'diagnostic');

-- Добавляем недостающие инструменты
INSERT INTO t_p84565078_code_expression_proj.tool_costs (tool_key, name, category, energy_cost, is_free)
VALUES
  ('finance_analysis', 'Финансовая грамотность специалиста PRO', 'specialist', 5, false),
  ('ms_analyze', 'Развитие специалиста', 'specialist', 5, false)
ON CONFLICT (tool_key) DO UPDATE SET energy_cost = EXCLUDED.energy_cost;
