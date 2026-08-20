-- Тестовая сессия для визуальной проверки ПоДелам (пользователь 7, без профиля) — временная, для QA
INSERT INTO t_p84565078_code_expression_proj.lk_sessions (id, user_id, expires_at)
VALUES ('test7session0000000000000000000000000000000000000000000000001', 7, NOW() + INTERVAL '1 hour')
ON CONFLICT (id) DO NOTHING;