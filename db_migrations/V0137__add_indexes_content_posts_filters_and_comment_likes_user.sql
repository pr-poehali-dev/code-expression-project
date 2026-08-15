CREATE INDEX IF NOT EXISTS idx_content_posts_category_role_date
    ON t_p84565078_code_expression_proj.content_posts (category, role, post_date DESC);

CREATE INDEX IF NOT EXISTS idx_content_comment_likes_user
    ON t_p84565078_code_expression_proj.content_comment_likes (user_id);