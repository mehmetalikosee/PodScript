-- Add file_path so we can generate signed URLs for private bucket
ALTER TABLE public.podcasts
ADD COLUMN IF NOT EXISTS file_path TEXT;
