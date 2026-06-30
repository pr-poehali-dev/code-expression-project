-- Настройка стоимости операций конструктора лендингов
-- Курс: ~6 ₽ за энергию. Модель: дорогая генерация, дешёвые правки, бесплатный чат.

INSERT INTO t_p84565078_code_expression_proj.tool_costs (tool_key, name, category, energy_cost, is_free)
VALUES ('landing_style', 'Подбор дизайна и стиля', 'landing', 70, false)
ON CONFLICT (tool_key) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, energy_cost = EXCLUDED.energy_cost, is_free = EXCLUDED.is_free, updated_at = now();

INSERT INTO t_p84565078_code_expression_proj.tool_costs (tool_key, name, category, energy_cost, is_free)
VALUES ('landing_block', 'Генерация блока лендинга', 'landing', 90, false)
ON CONFLICT (tool_key) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, energy_cost = EXCLUDED.energy_cost, is_free = EXCLUDED.is_free, updated_at = now();

INSERT INTO t_p84565078_code_expression_proj.tool_costs (tool_key, name, category, energy_cost, is_free)
VALUES ('landing_regen_block', 'Пересоздание блока', 'landing', 45, false)
ON CONFLICT (tool_key) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, energy_cost = EXCLUDED.energy_cost, is_free = EXCLUDED.is_free, updated_at = now();

INSERT INTO t_p84565078_code_expression_proj.tool_costs (tool_key, name, category, energy_cost, is_free)
VALUES ('landing_refine', 'Правка элемента через ИИ', 'landing', 24, false)
ON CONFLICT (tool_key) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, energy_cost = EXCLUDED.energy_cost, is_free = EXCLUDED.is_free, updated_at = now();

INSERT INTO t_p84565078_code_expression_proj.tool_costs (tool_key, name, category, energy_cost, is_free)
VALUES ('landing_edit_style', 'Изменение цветов и шрифтов', 'landing', 20, false)
ON CONFLICT (tool_key) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, energy_cost = EXCLUDED.energy_cost, is_free = EXCLUDED.is_free, updated_at = now();

INSERT INTO t_p84565078_code_expression_proj.tool_costs (tool_key, name, category, energy_cost, is_free)
VALUES ('landing_subpage', 'Страница услуги', 'landing', 70, false)
ON CONFLICT (tool_key) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, energy_cost = EXCLUDED.energy_cost, is_free = EXCLUDED.is_free, updated_at = now();

INSERT INTO t_p84565078_code_expression_proj.tool_costs (tool_key, name, category, energy_cost, is_free)
VALUES ('landing_chat', 'Чат сбора данных (бесплатно)', 'landing', 0, true)
ON CONFLICT (tool_key) DO UPDATE SET name = EXCLUDED.name, category = EXCLUDED.category, energy_cost = EXCLUDED.energy_cost, is_free = EXCLUDED.is_free, updated_at = now();
