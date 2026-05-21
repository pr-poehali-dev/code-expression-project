-- Администратор (пароль устанавливается через бэкенд)
INSERT INTO t_p84565078_code_expression_proj.lk_users (username, email, password_hash, full_name, is_admin)
VALUES ('admin', 'admin@docdialog.ru', 'SETUP_REQUIRED', 'Администратор', TRUE);

-- Тесты
INSERT INTO t_p84565078_code_expression_proj.lk_tests (slug, title, description, icon, sort_order) VALUES
('mindset', 'Мышление с премиум-клиентами', 'Оцени свой уровень уверенности и навыков общения с клиентами высокого сегмента', 'Brain', 1),
('barriers', 'Внутренние барьеры специалиста', 'Выяви психологические блоки, которые мешают профессиональному росту', 'Shield', 2),
('finance', 'Финансовая грамотность', 'Проверь свои знания в управлении доходом специалиста по телу', 'TrendingUp', 3);

-- Зоны тела
INSERT INTO t_p84565078_code_expression_proj.lk_body_zones (slug, name, sort_order) VALUES
('head', 'Голова', 1),
('neck', 'Шея', 2),
('shoulders', 'Плечи', 3),
('upper-back', 'Верхняя спина', 4),
('lower-back', 'Поясница', 5),
('chest', 'Грудная клетка', 6),
('abdomen', 'Живот', 7),
('hips', 'Бёдра', 8),
('glutes', 'Ягодицы', 9),
('upper-arm-left', 'Плечо (левое)', 10),
('upper-arm-right', 'Плечо (правое)', 11),
('forearm-left', 'Предплечье (левое)', 12),
('forearm-right', 'Предплечье (правое)', 13),
('thigh-left', 'Бедро (левое)', 14),
('thigh-right', 'Бедро (правое)', 15),
('knee-left', 'Колено (левое)', 16),
('knee-right', 'Колено (правое)', 17),
('shin-left', 'Голень (левая)', 18),
('shin-right', 'Голень (правая)', 19),
('foot', 'Стопы', 20);
