ALTER TABLE t_p84565078_code_expression_proj.salon_agent_chats
ADD COLUMN IF NOT EXISTS chat_mode VARCHAR(20) NOT NULL DEFAULT 'salon';

CREATE INDEX IF NOT EXISTS idx_salon_agent_chats_mode
ON t_p84565078_code_expression_proj.salon_agent_chats (user_id, agent_role, chat_mode);