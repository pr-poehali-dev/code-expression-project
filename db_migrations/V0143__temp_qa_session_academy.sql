-- Временная тестовая сессия для QA витрины Академии (админ id=1) — удалить после проверки
INSERT INTO t_p84565078_code_expression_proj.lk_sessions (id, user_id, expires_at)
VALUES ('qa_academy_test_session_0000000000000000000000000000000000001', 1, NOW() + INTERVAL '1 hour')
ON CONFLICT (id) DO NOTHING;