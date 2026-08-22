INSERT INTO t_p84565078_code_expression_proj.lk_sessions (id, user_id, expires_at)
VALUES ('qa_schools_stats_test_00000000000000000000000000000000001', 1, NOW() + INTERVAL '1 hour')
ON CONFLICT (id) DO NOTHING;