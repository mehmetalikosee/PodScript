# PodScript

Micro-SaaS that turns podcast audio into SEO-friendly blog posts, tweets, LinkedIn posts, show notes, quotes, newsletters, and more using OpenAI Whisper and GPT-4o.

## Features (competitor parity)

- **Transcript** – Full transcript from Whisper
- **Blog** – SEO-friendly long-form post (editable with Tiptap)
- **Twitter** – 3 ready-to-post tweets
- **LinkedIn** – One professional post
- **Show notes** – Title, description, key points
- **Key takeaways** – Bullet summary
- **Quotes** – Notable pull quotes
- **Newsletter** – Email-style body
- **Instagram** – Two caption options
- **YouTube description** – Video description with topics
- **Export all** – Download everything as one Markdown file
- **Tone** – Regenerate with Professional / Casual / Friendly
- **Content language** – Generate in English, Turkish, Spanish, German, or French
- **SEO keywords** – Comma-separated keywords
- **Email subject** – Newsletter subject line
- **Twitter thread** – 5–7 tweet thread
- **Headlines** – Multiple headline options
- **Dark theme** – Light / dark / system (toggle in header)
- **UI languages** – English and Türkçe (dashboard + landing)

## Stack

- **Next.js 15** (App Router)
- **Tailwind CSS** + **shadcn/ui**
- **Supabase** (Auth, PostgreSQL, Storage)
- **OpenAI** (Whisper for transcription, GPT-4o for content generation)
- **Tiptap** (rich text editor for the blog output)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in:

- `NEXT_PUBLIC_SUPABASE_URL` – Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` – Supabase anon key
- `OPENAI_API_KEY` – OpenAI API key (for Whisper + GPT-4o)

**Important:** Never commit `.env.local` or expose your OpenAI key in the client.

### 3. Supabase

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run in order: `001_initial_schema.sql`, `003_content_output_types.sql`, then `004_more_content_types.sql`.
3. In **Storage**, create a bucket named `podcasts` (private). Add policies so authenticated users can upload and read only their own files (path prefix = `auth.uid()`).

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Sign up, upload an audio file (MP3, WAV, M4A), and open the generated content from the dashboard.

## Project structure

- `app/` – Next.js App Router (pages, layouts, API routes)
- `components/` – React components (upload zone, blog editor, UI)
- `lib/` – Supabase client and utilities
- `supabase/migrations/` – PostgreSQL schema

## API keys

Store **OpenAI API key** only in server-side env (`OPENAI_API_KEY`). It is used in `app/api/process/route.ts` and must not be exposed to the browser.
