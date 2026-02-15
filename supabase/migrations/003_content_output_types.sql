-- Add competitor-style content output types (run once in Supabase SQL Editor)
ALTER TYPE content_output_type ADD VALUE IF NOT EXISTS 'transcript';
ALTER TYPE content_output_type ADD VALUE IF NOT EXISTS 'show_notes';
ALTER TYPE content_output_type ADD VALUE IF NOT EXISTS 'key_takeaways';
ALTER TYPE content_output_type ADD VALUE IF NOT EXISTS 'quotes';
ALTER TYPE content_output_type ADD VALUE IF NOT EXISTS 'newsletter';
ALTER TYPE content_output_type ADD VALUE IF NOT EXISTS 'instagram';
ALTER TYPE content_output_type ADD VALUE IF NOT EXISTS 'youtube_description';
