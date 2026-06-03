INSERT INTO t_p84565078_code_expression_proj.tool_costs (tool_key, name, category, energy_cost, is_free)
VALUES 
  ('mkt_audience',  'Портрет целевой аудитории', 'marketing', 1, false),
  ('mkt_offers',    'Офферы под ЦА',              'marketing', 1, false),
  ('mkt_semantics', 'Семантическое ядро',         'marketing', 1, false),
  ('mkt_direct',    'Объявления для Директа',     'marketing', 1, false)
ON CONFLICT (tool_key) DO UPDATE SET energy_cost = EXCLUDED.energy_cost;