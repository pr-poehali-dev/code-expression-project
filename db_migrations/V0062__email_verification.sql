ALTER TABLE t_p84565078_code_expression_proj.lk_users
  ADD COLUMN IF NOT EXISTS email_verified BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS email_verify_token VARCHAR(80),
  ADD COLUMN IF NOT EXISTS email_verify_sent_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_lk_users_email_verify_token
  ON t_p84565078_code_expression_proj.lk_users(email_verify_token)
  WHERE email_verify_token IS NOT NULL;