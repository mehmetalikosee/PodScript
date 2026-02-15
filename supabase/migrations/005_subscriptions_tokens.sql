-- Subscription and token system
-- Add columns to profiles for plan, tokens, trial, Stripe

ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS tokens_remaining INT NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS tokens_limit INT NOT NULL DEFAULT 3,
  ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS plan TEXT NOT NULL DEFAULT 'trial',
  ADD COLUMN IF NOT EXISTS stripe_customer_id TEXT,
  ADD COLUMN IF NOT EXISTS stripe_subscription_id TEXT;

-- Cap existing trial users at 3 tokens
UPDATE public.profiles
SET tokens_remaining = LEAST(COALESCE(tokens_remaining, 10), 3),
    tokens_limit = 3
WHERE plan = 'trial' OR plan IS NULL;

COMMENT ON COLUMN public.profiles.tokens_remaining IS 'Credits/tokens left for AI processing';
COMMENT ON COLUMN public.profiles.plan IS 'free, trial, pro, etc.';
