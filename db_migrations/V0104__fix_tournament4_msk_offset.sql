UPDATE t_p84565078_code_expression_proj.ch_tournaments
SET registration_starts = registration_starts - INTERVAL '3 hours',
    registration_ends   = registration_ends   - INTERVAL '3 hours',
    task_opens_at        = task_opens_at        - INTERVAL '3 hours',
    work_deadline        = work_deadline        - INTERVAL '3 hours',
    voting_starts        = voting_starts        - INTERVAL '3 hours',
    voting_ends          = voting_ends          - INTERVAL '3 hours'
WHERE id = 4;