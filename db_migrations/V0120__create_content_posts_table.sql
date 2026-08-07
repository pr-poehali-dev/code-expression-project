CREATE TABLE t_p84565078_code_expression_proj.content_posts (
    id SERIAL PRIMARY KEY,
    post_date DATE NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL,
    body TEXT NOT NULL,
    telegram_message_id BIGINT,
    telegram_sent_at TIMESTAMPTZ,
    source TEXT NOT NULL DEFAULT 'ai',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_content_posts_post_date ON t_p84565078_code_expression_proj.content_posts (post_date DESC);
