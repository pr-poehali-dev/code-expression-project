ALTER TABLE t_p84565078_code_expression_proj.partners ADD COLUMN consent_rules_at TIMESTAMPTZ;
ALTER TABLE t_p84565078_code_expression_proj.partners ADD COLUMN consent_privacy_at TIMESTAMPTZ;
ALTER TABLE t_p84565078_code_expression_proj.partners ADD COLUMN consent_offer_at TIMESTAMPTZ;
ALTER TABLE t_p84565078_code_expression_proj.partners ADD COLUMN consent_docs_version VARCHAR(20);
ALTER TABLE t_p84565078_code_expression_proj.partners ADD COLUMN consent_ip VARCHAR(64);
