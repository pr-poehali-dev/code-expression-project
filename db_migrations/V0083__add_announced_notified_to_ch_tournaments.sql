ALTER TABLE ch_tournaments ADD COLUMN IF NOT EXISTS announced_notified BOOLEAN NOT NULL DEFAULT FALSE;

UPDATE ch_tournaments
SET announced_notified = TRUE
WHERE postpone_reason LIKE 'notified:%';

UPDATE ch_tournaments
SET postpone_reason = NULL
WHERE postpone_reason LIKE 'notified:%'
  AND (postponed = FALSE OR postponed IS NULL);