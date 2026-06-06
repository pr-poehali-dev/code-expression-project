ALTER TABLE t_p84565078_code_expression_proj.salon_agent_chats
  ADD COLUMN IF NOT EXISTS is_free BOOLEAN NOT NULL DEFAULT false;

CREATE TABLE IF NOT EXISTS t_p84565078_code_expression_proj.salon_agent_free_usage (
  user_id    INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
  free_used  INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (user_id)
);
