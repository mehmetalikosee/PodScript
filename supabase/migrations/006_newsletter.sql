-- Newsletter subscribers (for popup signup)
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (landing page signup, anon or authenticated)
DROP POLICY IF EXISTS "Allow insert newsletter" ON public.newsletter_subscribers;
CREATE POLICY "Allow insert newsletter"
  ON public.newsletter_subscribers FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Only service role can read (no public/anon read)
DROP POLICY IF EXISTS "No public read newsletter" ON public.newsletter_subscribers;
CREATE POLICY "No public read newsletter"
  ON public.newsletter_subscribers FOR SELECT
  USING (false);

COMMENT ON TABLE public.newsletter_subscribers IS 'Emails from newsletter popup signup';
