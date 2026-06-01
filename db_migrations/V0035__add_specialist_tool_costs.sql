INSERT INTO t_p84565078_code_expression_proj.tool_costs (tool_key, name, category, energy_cost, is_free)
VALUES
  ('barriers_analysis', 'Анализ внутренних барьеров', 'specialist', 3, false),
  ('mindset_analysis',  'Анализ мышления специалиста', 'specialist', 3, false),
  ('profile_analysis',  'Финансовый профиль специалиста', 'specialist', 3, false),
  ('salon_diag',        'Диагностика роста салона', 'analytics', 5, false)
ON CONFLICT (tool_key) DO NOTHING;