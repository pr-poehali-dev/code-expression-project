CREATE TABLE t_p84565078_code_expression_proj.partner_password_resets (
  id SERIAL PRIMARY KEY,
  partner_id INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.partners(id),
  token_hash VARCHAR(64) NOT NULL UNIQUE,
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_partner_pw_resets_partner ON t_p84565078_code_expression_proj.partner_password_resets(partner_id);