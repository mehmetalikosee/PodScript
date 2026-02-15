import { createClient } from "@/lib/supabase/server";
import OpenAI from "openai";
import { NextResponse } from "next/server";

function getOpenAI() {
  const key = process.env.OPENAI_API_KEY;
  if (!key) throw new Error("OPENAI_API_KEY is not set");
  return new OpenAI({ apiKey: key });
}

function buildPrompt(tone: string, contentLanguage: string) {
  const toneLine = tone ? `Use a ${tone.toLowerCase()} tone throughout where appropriate.` : "";
  const langLine = contentLanguage
    ? `Generate ALL content in ${contentLanguage}. Write every section (blog, tweets, LinkedIn, show notes, etc.) in ${contentLanguage} only.`
    : "";
  return `You are a content strategist. Given the following podcast transcript, generate all of the following. ${toneLine} ${langLine}

1. **Blog** – SEO-friendly blog post in Markdown (title, meta description, headings, body).
2. **Twitter** – Exactly 3 engaging Twitter/X posts. Number them 1., 2., 3.
3. **LinkedIn** – One professional LinkedIn post (paragraph form, thought-leadership).
4. **Show notes** – Catchy title, 2–3 sentence description, then "Key points:" with 5–7 bullet points (no timestamps).
5. **Key takeaways** – "Key Takeaways" heading then 4–6 short bullet points (one line each).
6. **Quotes** – "Notable Quotes" then 5–7 pull quotes (one per line, no numbers).
7. **Newsletter** – Email-style body: short intro, 2–3 paragraphs of value, clear CTA. No subject line.
8. **Instagram** – Two caption options (Caption 1: / Caption 2:), each 1–3 sentences, emoji-friendly.
9. **YouTube description** – Video description: 1–2 paragraph summary, then "Topics covered:" with bullet points.
10. **SEO keywords** – Comma-separated list of 10–15 SEO keywords/phrases (one line).
11. **Email subject** – Single compelling email subject line for the newsletter (one line).
12. **Twitter thread** – A 5–7 tweet thread (numbered 1., 2., …) that expands one key idea from the episode.
13. **Headlines** – "Headlines" then 5–7 catchy headline options (one per line) for the blog or social.

Format your response with exactly these delimiters. Do not add text before or after:

---BLOG---
[markdown blog post]
---BLOG---

---TWITTER---
1. [tweet]
2. [tweet]
3. [tweet]
---TWITTER---

---LINKEDIN---
[LinkedIn post]
---LINKEDIN---

---SHOW_NOTES---
[show notes]
---SHOW_NOTES---

---KEY_TAKEAWAYS---
[bullets]
---KEY_TAKEAWAYS---

---QUOTES---
[quotes, one per line]
---QUOTES---

---NEWSLETTER---
[email body]
---NEWSLETTER---

---INSTAGRAM---
Caption 1: [text]
Caption 2: [text]
---INSTAGRAM---

---YOUTUBE_DESCRIPTION---
[description]
---YOUTUBE_DESCRIPTION---

---SEO_KEYWORDS---
[comma-separated keywords]
---SEO_KEYWORDS---

---EMAIL_SUBJECT---
[one subject line]
---EMAIL_SUBJECT---

---TWITTER_THREAD---
1. [tweet]
2. [tweet]
...
---TWITTER_THREAD---

---HEADLINES---
[one headline per line]
---HEADLINES---`;
}

function extractSection(full: string, tag: string): string {
  const re = new RegExp(`---${tag}---\\s*([\\s\\S]*?)\\s*---${tag}---`);
  const m = full.match(re);
  return m ? m[1].trim() : "";
}

function parseTweets(full: string): string[] {
  const block = extractSection(full, "TWITTER");
  if (!block) return [];
  const tweets: string[] = [];
  const lines = block.split(/\n/).filter(Boolean);
  for (const line of lines) {
    const m = line.match(/^\d+\.\s*(.+)/);
    if (m) tweets.push(m[1].trim());
  }
  return tweets;
}

function parseSections(full: string) {
  return {
    blog: extractSection(full, "BLOG"),
    tweets: parseTweets(full),
    linkedin: extractSection(full, "LINKEDIN"),
    show_notes: extractSection(full, "SHOW_NOTES"),
    key_takeaways: extractSection(full, "KEY_TAKEAWAYS"),
    quotes: extractSection(full, "QUOTES"),
    newsletter: extractSection(full, "NEWSLETTER"),
    instagram: extractSection(full, "INSTAGRAM"),
    youtube_description: extractSection(full, "YOUTUBE_DESCRIPTION"),
    seo_keywords: extractSection(full, "SEO_KEYWORDS"),
    email_subject: extractSection(full, "EMAIL_SUBJECT"),
    twitter_thread: extractSection(full, "TWITTER_THREAD"),
    headlines: extractSection(full, "HEADLINES"),
  };
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { podcastId, tone, contentLanguage } = body as {
      podcastId: string;
      tone?: string;
      contentLanguage?: string;
    };
    if (!podcastId) {
      return NextResponse.json(
        { error: "podcastId is required" },
        { status: 400 }
      );
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("tokens_remaining")
      .eq("id", user.id)
      .single();

    const tokens = profile?.tokens_remaining ?? 0;
    if (tokens < 1) {
      return NextResponse.json(
        { error: "No tokens remaining. Upgrade your plan to continue." },
        { status: 402 }
      );
    }

    const { data: podcast, error: fetchError } = await supabase
      .from("podcasts")
      .select("id, file_url, user_id")
      .eq("id", podcastId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !podcast) {
      return NextResponse.json(
        { error: "Podcast not found" },
        { status: 404 }
      );
    }

    // Derive storage path from file_url (works with private bucket + signed URL)
    const pathMatch = podcast.file_url.match(/\/object\/public\/podcasts\/(.+)$/);
    const path = pathMatch ? pathMatch[1] : null;
    if (!path) {
      await supabase
        .from("podcasts")
        .update({ status: "failed" })
        .eq("id", podcastId);
      return NextResponse.json(
        { error: "Missing file path. Re-upload the podcast." },
        { status: 400 }
      );
    }

    const { data: signed, error: signError } = await supabase.storage
      .from("podcasts")
      .createSignedUrl(path, 3600);

    if (signError || !signed?.signedUrl) {
      await supabase
        .from("podcasts")
        .update({ status: "failed" })
        .eq("id", podcastId);
      return NextResponse.json(
        { error: signError?.message || "Failed to get audio URL" },
        { status: 400 }
      );
    }

    const audioResponse = await fetch(signed.signedUrl);
    if (!audioResponse.ok) {
      await supabase
        .from("podcasts")
        .update({ status: "failed" })
        .eq("id", podcastId);
      return NextResponse.json(
        { error: "Failed to fetch audio file" },
        { status: 400 }
      );
    }

    const contentType =
      audioResponse.headers.get("content-type") || "audio/mpeg";
    const arrayBuffer = await audioResponse.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: contentType });
    const file = new File([blob], "audio.mp3", { type: contentType });

    const openai = getOpenAI();
    let transcript: string;
    try {
      const transcription = await openai.audio.transcriptions.create({
        file,
        model: "whisper-1",
      });
      transcript = transcription.text;
    } catch (whisperError) {
      console.error("Whisper error:", whisperError);
      await supabase
        .from("podcasts")
        .update({ status: "failed" })
        .eq("id", podcastId);
      return NextResponse.json(
        { error: "Transcription failed" },
        { status: 500 }
      );
    }

    const systemPrompt = buildPrompt(tone ?? "", contentLanguage ?? "");
    const stream = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Transcript:\n\n${transcript}` },
      ],
      stream: true,
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        let fullContent = "";
        try {
          for await (const chunk of stream) {
            const delta = chunk.choices[0]?.delta?.content ?? "";
            fullContent += delta;
            controller.enqueue(encoder.encode(delta));
          }
          const parsed = parseSections(fullContent);

          await supabase
            .from("content_outputs")
            .delete()
            .eq("podcast_id", podcastId);

          const rows: { podcast_id: string; type: string; content: string; metadata: Record<string, unknown> }[] = [
            { podcast_id: podcastId, type: "transcript", content: transcript, metadata: {} },
            { podcast_id: podcastId, type: "blog", content: parsed.blog, metadata: {} },
            ...parsed.tweets.map((content, i) => ({
              podcast_id: podcastId,
              type: "tweet",
              content,
              metadata: { index: i + 1 },
            })),
            { podcast_id: podcastId, type: "linkedin", content: parsed.linkedin, metadata: {} },
            { podcast_id: podcastId, type: "show_notes", content: parsed.show_notes, metadata: {} },
            { podcast_id: podcastId, type: "key_takeaways", content: parsed.key_takeaways, metadata: {} },
            { podcast_id: podcastId, type: "quotes", content: parsed.quotes, metadata: {} },
            { podcast_id: podcastId, type: "newsletter", content: parsed.newsletter, metadata: {} },
            { podcast_id: podcastId, type: "instagram", content: parsed.instagram, metadata: {} },
            { podcast_id: podcastId, type: "youtube_description", content: parsed.youtube_description, metadata: {} },
            { podcast_id: podcastId, type: "seo_keywords", content: parsed.seo_keywords, metadata: {} },
            { podcast_id: podcastId, type: "email_subject", content: parsed.email_subject, metadata: {} },
            { podcast_id: podcastId, type: "twitter_thread", content: parsed.twitter_thread, metadata: {} },
            { podcast_id: podcastId, type: "headlines", content: parsed.headlines, metadata: {} },
          ];

          await supabase.from("content_outputs").insert(rows);

          await supabase
            .from("podcasts")
            .update({ status: "completed" })
            .eq("id", podcastId);

          await supabase
            .from("profiles")
            .update({
              tokens_remaining: Math.max(0, tokens - 1),
            })
            .eq("id", user.id);

          await supabase.from("notifications").insert({
            user_id: user.id,
            title: "Processing complete",
            message: "Your podcast content is ready to view.",
          });
        } catch (e) {
          console.error("Stream or save error:", e);
          await supabase
            .from("podcasts")
            .update({ status: "failed" })
            .eq("id", podcastId);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    });
  } catch (e) {
    console.error("Process API error:", e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
