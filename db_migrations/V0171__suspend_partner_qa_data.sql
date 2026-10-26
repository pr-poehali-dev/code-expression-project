UPDATE t_p84565078_code_expression_proj.partners SET status = 'suspended', business_name = 'ТЕСТ (можно удалить)' WHERE email LIKE 'qa%@example.com';
UPDATE t_p84565078_code_expression_proj.partner_offers SET status = 'archived' WHERE partner_id IN (SELECT id FROM t_p84565078_code_expression_proj.partners WHERE email LIKE 'qa%@example.com');
UPDATE t_p84565078_code_expression_proj.partner_sessions SET expires_at = NOW() WHERE partner_id IN (SELECT id FROM t_p84565078_code_expression_proj.partners WHERE email LIKE 'qa%@example.com');
