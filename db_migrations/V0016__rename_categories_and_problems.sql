-- Переименование категорий
UPDATE t_p84565078_code_expression_proj.ms_categories SET name = 'Финансы и доход'             WHERE slug = 'finance';
UPDATE t_p84565078_code_expression_proj.ms_categories SET name = 'Состояние и энергия'         WHERE slug = 'state';
UPDATE t_p84565078_code_expression_proj.ms_categories SET name = 'Клиенты и поток'             WHERE slug = 'clients';
UPDATE t_p84565078_code_expression_proj.ms_categories SET name = 'Позиционирование'            WHERE slug = 'positioning';
UPDATE t_p84565078_code_expression_proj.ms_categories SET name = 'Практика и рост'             WHERE slug = 'practice';

-- Переформулировка проблем (Финансы)
UPDATE t_p84565078_code_expression_proj.ms_problems SET name = 'Хочу уверенно называть цену'         WHERE slug = 'fear-price';
UPDATE t_p84565078_code_expression_proj.ms_problems SET name = 'Хочу больше клиентов'                WHERE slug = 'few-clients';
UPDATE t_p84565078_code_expression_proj.ms_problems SET name = 'Хочу стабильный доход'               WHERE slug = 'unstable-income';
UPDATE t_p84565078_code_expression_proj.ms_problems SET name = 'Как удержать клиента надолго'        WHERE slug = 'clients-leave';
UPDATE t_p84565078_code_expression_proj.ms_problems SET name = 'Хочу поднять стоимость'              WHERE slug = 'cant-raise-price';
UPDATE t_p84565078_code_expression_proj.ms_problems SET name = 'Как продавать без ощущения продажи'  WHERE slug = 'fear-sales';
UPDATE t_p84565078_code_expression_proj.ms_problems SET name = 'Хочу выйти на высокий чек'           WHERE slug = 'cant-high-check';

-- Состояние
UPDATE t_p84565078_code_expression_proj.ms_problems SET name = 'Хочу справиться с тревогой'               WHERE slug = 'anxiety';
UPDATE t_p84565078_code_expression_proj.ms_problems SET name = 'Хочу выйти из выгорания'                  WHERE slug = 'burnout';
UPDATE t_p84565078_code_expression_proj.ms_problems SET name = 'Хочу восстановить энергию'                WHERE slug = 'fatigue';
UPDATE t_p84565078_code_expression_proj.ms_problems SET name = 'Хочу стать увереннее'                     WHERE slug = 'low-confidence';
UPDATE t_p84565078_code_expression_proj.ms_problems SET name = 'Хочу вернуть мотивацию'                   WHERE slug = 'lost-motivation';
UPDATE t_p84565078_code_expression_proj.ms_problems SET name = 'Хочу навести порядок в голове'            WHERE slug = 'chaos-state';
UPDATE t_p84565078_code_expression_proj.ms_problems SET name = 'Как справляться с эмоциональной нагрузкой' WHERE slug = 'emotional-overload';

-- Клиенты
UPDATE t_p84565078_code_expression_proj.ms_problems SET name = 'Хочу чтобы клиенты рекомендовали меня'        WHERE slug = 'no-referrals';
UPDATE t_p84565078_code_expression_proj.ms_problems SET name = 'Как сделать чтобы клиенты возвращались'        WHERE slug = 'no-return';
UPDATE t_p84565078_code_expression_proj.ms_problems SET name = 'Хочу научиться работать со сложными клиентами' WHERE slug = 'hard-clients';
UPDATE t_p84565078_code_expression_proj.ms_problems SET name = 'Хочу спокойно работать с обеспеченными клиентами' WHERE slug = 'fear-rich';
UPDATE t_p84565078_code_expression_proj.ms_problems SET name = 'Как быстро выстроить доверие с клиентом'      WHERE slug = 'no-trust';
UPDATE t_p84565078_code_expression_proj.ms_problems SET name = 'Как удерживать клиента в долгосрочной работе' WHERE slug = 'cant-retain';

-- Позиционирование
UPDATE t_p84565078_code_expression_proj.ms_problems SET name = 'Хочу чувствовать себя экспертом'              WHERE slug = 'not-good-enough';
UPDATE t_p84565078_code_expression_proj.ms_problems SET name = 'Хочу перестать сравнивать себя с другими'     WHERE slug = 'compare-self';
UPDATE t_p84565078_code_expression_proj.ms_problems SET name = 'Хочу понять свою ценность и транслировать её' WHERE slug = 'no-value';
UPDATE t_p84565078_code_expression_proj.ms_problems SET name = 'Как правильно себя подать клиенту'            WHERE slug = 'cant-present';
UPDATE t_p84565078_code_expression_proj.ms_problems SET name = 'Хочу начать проявляться и заявить о себе'     WHERE slug = 'fear-show';

-- Практика
UPDATE t_p84565078_code_expression_proj.ms_problems SET name = 'Хочу навести порядок в работе'                WHERE slug = 'chaos-work';
UPDATE t_p84565078_code_expression_proj.ms_problems SET name = 'Хочу выстроить систему в практике'            WHERE slug = 'no-system';
UPDATE t_p84565078_code_expression_proj.ms_problems SET name = 'Хочу чувствовать себя уверенно на приёме'     WHERE slug = 'lost-at-reception';
UPDATE t_p84565078_code_expression_proj.ms_problems SET name = 'Хочу системно вести клиента'                  WHERE slug = 'dont-know-lead';
UPDATE t_p84565078_code_expression_proj.ms_problems SET name = 'Хочу больше доверять своим техникам'          WHERE slug = 'doubt-techniques';
