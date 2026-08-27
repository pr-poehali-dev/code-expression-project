INSERT INTO t_p84565078_code_expression_proj.package_plans (code, name, description, daily_limit_per_tool, sort_order) VALUES
  ('start', 'Старт', 'Ежедневный ИИ-анализ и базовый набор возможностей пакета', 1, 1),
  ('growth', 'Развитие', 'Больше использований инструментов каждый день', 2, 2),
  ('pro', 'Профессионал', 'Для активной ежедневной работы с клиентами', 5, 3),
  ('max', 'Максимум', 'Максимум использований всех инструментов', 10, 4)
ON CONFLICT (code) DO NOTHING;