CREATE TABLE t_p84565078_code_expression_proj.salon_agent_chats (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
    salon_id INTEGER REFERENCES t_p84565078_code_expression_proj.salons(id),
    agent_role VARCHAR(50) NOT NULL DEFAULT 'business',
    role TEXT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_salon_agent_chats_user_role ON t_p84565078_code_expression_proj.salon_agent_chats(user_id, agent_role);
CREATE INDEX idx_salon_agent_chats_created ON t_p84565078_code_expression_proj.salon_agent_chats(created_at);
