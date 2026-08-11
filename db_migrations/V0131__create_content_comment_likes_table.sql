CREATE TABLE t_p84565078_code_expression_proj.content_comment_likes (
    id SERIAL PRIMARY KEY,
    comment_id INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.content_comments(id),
    user_id INTEGER NOT NULL REFERENCES t_p84565078_code_expression_proj.lk_users(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(comment_id, user_id)
);

CREATE INDEX idx_content_comment_likes_comment ON t_p84565078_code_expression_proj.content_comment_likes(comment_id);