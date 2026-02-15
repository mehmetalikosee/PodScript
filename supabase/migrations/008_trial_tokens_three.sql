-- Ensure trial accounts have 3 tokens (not 10)
-- Run in Supabase SQL Editor if new signups or existing trial users show 10

-- Force all trial profiles to 3 tokens max and limit 3
UPDATE public.profiles
SET tokens_remaining = LEAST(COALESCE(tokens_remaining, 0), 3),
    tokens_limit = 3
WHERE plan = 'trial' OR plan IS NULL;

-- Ensure column defaults for future inserts (e.g. from triggers)
ALTER TABLE public.profiles
  ALTER COLUMN tokens_remaining SET DEFAULT 3,
  ALTER COLUMN tokens_limit SET DEFAULT 3;

COMMENT ON COLUMN public.profiles.tokens_limit IS 'Max tokens per period; 3 for trial, 100 for pro';
