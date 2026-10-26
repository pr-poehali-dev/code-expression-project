INSERT INTO t_p84565078_code_expression_proj.partner_sessions (id, partner_id, expires_at, view_only)
SELECT 'qaviewvisual000000000000000000000000000000000000000000000000000test', id, NOW() + INTERVAL '8 minutes', TRUE
FROM t_p84565078_code_expression_proj.partners WHERE email LIKE 'qa%@example.com' ORDER BY id LIMIT 1;
