INSERT INTO content_comments (post_id, user_id, parent_id, author_name, is_admin_reply, body, created_at, visible_at)
SELECT post_id, user_id, id, 'Светлана', TRUE,
       'По вопросам работы платформы, оплаты или доступа лучше сразу написать в техподдержку личного кабинета — там быстрее разберутся и подскажут точно по вашему аккаунту.',
       NOW(), NOW()
FROM content_comments WHERE id = 9;