INSERT INTO t_p84565078_code_expression_proj.tool_costs (tool_key, name, category, energy_cost, is_free)
VALUES
  ('landing_chat',             'Сообщение в чате конструктора лендингов',  'landing', 4,  false),
  ('landing_generate',         'Генерация лендинга (стандартный)',          'landing', 64, false),
  ('landing_generate_premium', 'Генерация лендинга (премиальный)',          'landing', 96, false),
  ('landing_refine',           'ИИ-доработка лендинга',                    'landing', 80, false),
  ('landing_download',         'Скачивание готового лендинга',             'landing', 5,  false)
ON CONFLICT (tool_key) DO UPDATE
  SET name = EXCLUDED.name,
      category = EXCLUDED.category,
      energy_cost = EXCLUDED.energy_cost,
      is_free = EXCLUDED.is_free,
      updated_at = NOW();
