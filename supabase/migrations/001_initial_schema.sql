-- PodScript: Initial schema for Supabase (PostgreSQL)
-- Run this in Supabase SQL Editor or via Supabase CLI

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- PROFILES (linked to Supabase Auth)
-- ============================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Trigger: create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================
-- PODCASTS
-- ============================================
DO $$ BEGIN
  CREATE TYPE podcast_status AS ENUM ('processing', 'completed', 'failed');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.podcasts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  title TEXT,
  status podcast_status NOT NULL DEFAULT 'processing',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.podcasts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own podcasts" ON public.podcasts;
CREATE POLICY "Users can manage own podcasts"
  ON public.podcasts FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_podcasts_user_id ON public.podcasts(user_id);
CREATE INDEX IF NOT EXISTS idx_podcasts_status ON public.podcasts(status);
CREATE INDEX IF NOT EXISTS idx_podcasts_created_at ON public.podcasts(created_at DESC);

-- ============================================
-- CONTENT_OUTPUTS
-- ============================================
DO $$ BEGIN
  CREATE TYPE content_output_type AS ENUM ('blog', 'tweet', 'linkedin');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.content_outputs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  podcast_id UUID NOT NULL REFERENCES public.podcasts(id) ON DELETE CASCADE,
  type content_output_type NOT NULL,
  content TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE public.content_outputs ENABLE ROW LEVEL SECURITY;

-- Users can access content_outputs only for their own podcasts
DROP POLICY IF EXISTS "Users can manage content for own podcasts" ON public.content_outputs;
CREATE POLICY "Users can manage content for own podcasts"
  ON public.content_outputs FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.podcasts p
      WHERE p.id = content_outputs.podcast_id AND p.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.podcasts p
      WHERE p.id = content_outputs.podcast_id AND p.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_content_outputs_podcast_id ON public.content_outputs(podcast_id);
CREATE INDEX IF NOT EXISTS idx_content_outputs_type ON public.content_outputs(type);

-- ============================================
-- STORAGE BUCKET (for audio uploads)
-- Create bucket in Supabase Dashboard: Storage > New bucket > name: podcasts, Public: OFF
-- Then in Storage > podcasts > Policies, add:
--
-- Policy "Users can upload own podcasts" (INSERT):
--   (bucket_id = 'podcasts') AND ((storage.foldername(name))[1] = auth.uid()::text)
--
-- Policy "Users can read own podcasts" (SELECT):
--   (bucket_id = 'podcasts') AND ((storage.foldername(name))[1] = auth.uid()::text)
--
-- Policy for signed upload URL (if using createSignedUploadUrl):
--   Same as above; allow INSERT for path starting with user id.
-- ============================================
