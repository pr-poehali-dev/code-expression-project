CREATE TABLE t_p84565078_code_expression_proj.content_comments (
    id SERIAL PRIMARY KEY,
    post_id INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.content_posts(id),
    user_id INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
    parent_id INTEGER REFERENCES t_p84565078_code_expression_proj.content_comments(id),
    author_name TEXT NOT NULL,
    is_admin_reply BOOLEAN NOT NULL DEFAULT FALSE,
    body TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_content_comments_post ON t_p84565078_code_expression_proj.content_comments(post_id, created_at);