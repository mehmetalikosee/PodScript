"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { BlogEditor } from "@/components/blog-editor";
import { CopyButton } from "@/components/copy-button";
import {
  FileText,
  Twitter,
  Linkedin,
  RefreshCw,
  Copy,
  Download,
  FileType,
  ListChecks,
  Quote,
  Mail,
  Instagram,
  Youtube,
  ChevronDown,
  Hash,
  MessageSquare,
  Type,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type Output = { id: string; type: string; content: string | null };

const TAB_CONFIG: { value: string; label: string; icon: React.ElementType }[] = [
  { value: "blog", label: "Blog", icon: FileText },
  { value: "twitter", label: "Twitter", icon: Twitter },
  { value: "linkedin", label: "LinkedIn", icon: Linkedin },
  { value: "transcript", label: "Transcript", icon: FileType },
  { value: "show_notes", label: "Show notes", icon: ListChecks },
  { value: "key_takeaways", label: "Takeaways", icon: ListChecks },
  { value: "quotes", label: "Quotes", icon: Quote },
  { value: "newsletter", label: "Newsletter", icon: Mail },
  { value: "instagram", label: "Instagram", icon: Instagram },
  { value: "youtube_description", label: "YouTube", icon: Youtube },
  { value: "seo_keywords", label: "SEO keywords", icon: Hash },
  { value: "email_subject", label: "Email subject", icon: Mail },
  { value: "twitter_thread", label: "Thread", icon: MessageSquare },
  { value: "headlines", label: "Headlines", icon: Type },
];

const TONE_OPTIONS = [
  { value: "", label: "Default" },
  { value: "Professional", label: "Professional" },
  { value: "Casual", label: "Casual" },
  { value: "Friendly", label: "Friendly" },
];

const CONTENT_LANGUAGE_OPTIONS = [
  { value: "", label: "Auto" },
  { value: "English", label: "English" },
  { value: "Turkish", label: "Türkçe" },
  { value: "Spanish", label: "Español" },
  { value: "German", label: "Deutsch" },
  { value: "French", label: "Français" },
];

interface PodcastContentPanelProps {
  podcastId: string;
  outputs: Output[];
}

function getOutputsByType(outputs: Output[]): Record<string, Output[]> {
  const map: Record<string, Output[]> = {};
  for (const o of outputs) {
    if (!map[o.type]) map[o.type] = [];
    map[o.type].push(o);
  }
  return map;
}

export function PodcastContentPanel({ podcastId, outputs }: PodcastContentPanelProps) {
  const router = useRouter();
  const [regenerating, setRegenerating] = useState(false);
  const [tone, setTone] = useState("");
  const [toneOpen, setToneOpen] = useState(false);
  const [contentLanguage, setContentLanguage] = useState("");
  const [contentLangOpen, setContentLangOpen] = useState(false);

  const byType = getOutputsByType(outputs);
  const blog = byType.blog?.[0];
  const tweets = byType.tweet ?? [];
  const linkedin = byType.linkedin?.[0];
  const transcript = byType.transcript?.[0];
  const show_notes = byType.show_notes?.[0];
  const key_takeaways = byType.key_takeaways?.[0];
  const quotes = byType.quotes?.[0];
  const newsletter = byType.newsletter?.[0];
  const instagram = byType.instagram?.[0];
  const youtube_description = byType.youtube_description?.[0];
  const seo_keywords = byType.seo_keywords?.[0];
  const email_subject = byType.email_subject?.[0];
  const twitter_thread = byType.twitter_thread?.[0];
  const headlines = byType.headlines?.[0];

  async function handleRegenerate() {
    if (regenerating) return;
    setRegenerating(true);
    setToneOpen(false);
    setContentLangOpen(false);
    try {
      const res = await fetch("/api/process", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          podcastId,
          tone: tone || undefined,
          contentLanguage: contentLanguage || undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        const msg = data.error || "Regeneration failed";
        if (res.status === 402) {
          toast.error("No tokens remaining. Upgrade your plan to continue.", {
            action: { label: "Upgrade", onClick: () => window.location.assign("/dashboard/pricing") },
          });
          return;
        }
        throw new Error(msg);
      }
      const reader = res.body?.getReader();
      if (reader) {
        while (true) {
          const { done } = await reader.read();
          if (done) break;
        }
      }
      toast.success("Content regenerated");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Regeneration failed");
    } finally {
      setRegenerating(false);
    }
  }

  function handleExportAll() {
    const sections: string[] = [];
    if (blog?.content) {
      const div = document.createElement("div");
      div.innerHTML = blog.content;
      sections.push("# Blog\n\n" + (div.textContent || div.innerText || ""));
    }
    if (tweets.length) {
      sections.push("# Twitter\n\n" + tweets.map((t, i) => `${i + 1}. ${t.content || ""}`).join("\n\n"));
    }
    if (linkedin?.content) sections.push("# LinkedIn\n\n" + linkedin.content);
    if (transcript?.content) sections.push("# Transcript\n\n" + transcript.content);
    if (show_notes?.content) sections.push("# Show notes\n\n" + show_notes.content);
    if (key_takeaways?.content) sections.push("# Key takeaways\n\n" + key_takeaways.content);
    if (quotes?.content) sections.push("# Quotes\n\n" + quotes.content);
    if (newsletter?.content) sections.push("# Newsletter\n\n" + newsletter.content);
    if (instagram?.content) sections.push("# Instagram\n\n" + instagram.content);
    if (youtube_description?.content) sections.push("# YouTube description\n\n" + youtube_description.content);
    if (seo_keywords?.content) sections.push("# SEO keywords\n\n" + seo_keywords.content);
    if (email_subject?.content) sections.push("# Email subject\n\n" + email_subject.content);
    if (twitter_thread?.content) sections.push("# Twitter thread\n\n" + twitter_thread.content);
    if (headlines?.content) sections.push("# Headlines\n\n" + headlines.content);

    const full = sections.join("\n\n---\n\n");
    if (!full.trim()) {
      toast.error("No content to export");
      return;
    }
    const blob = new Blob([full], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "podscript-export.md";
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Exported as podscript-export.md");
  }

  function renderContent(content: string | null) {
    if (!content) return <p className="text-muted-foreground text-sm">No content yet.</p>;
    return (
      <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
        <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{content}</p>
      </div>
    );
  }

  return (
    <Tabs defaultValue="blog" className="w-full">
      <div className="flex flex-col gap-4 mb-4">
        {/* Tab bar: full-width scrollable row */}
        <div className="w-full border border-border/80 rounded-2xl bg-card/50 overflow-hidden">
          <div className="content-tabs-scroll overflow-x-auto overflow-y-hidden scroll-smooth">
            <TabsList className="inline-flex h-12 w-max min-w-full items-center gap-1.5 rounded-2xl bg-transparent p-2 pr-8 border-0 h-auto">
              {TAB_CONFIG.map((t) => {
                const Icon = t.icon;
                return (
                  <TabsTrigger
                    key={t.value}
                    value={t.value}
                    className={cn(
                      "rounded-xl px-4 py-2.5 h-auto flex items-center gap-2 shrink-0 text-sm font-medium transition-colors",
                      "text-muted-foreground hover:text-foreground hover:bg-muted/80",
                      "data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm data-[state=active]:hover:bg-primary data-[state=active]:hover:text-primary-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span>{t.label}</span>
                  </TabsTrigger>
                );
              })}
            </TabsList>
          </div>
        </div>
        {/* Actions row */}
        <div className="flex flex-wrap items-center justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportAll}
              className="rounded-lg"
            >
              <Download className="h-4 w-4 mr-1.5" />
              Export all
            </Button>
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setContentLangOpen(!contentLangOpen)}
                className="rounded-lg min-w-[100px] justify-between"
              >
                <span>{CONTENT_LANGUAGE_OPTIONS.find((o) => o.value === contentLanguage)?.label ?? "Language"}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              {contentLangOpen && (
                <div className="absolute top-full right-0 mt-1 py-1 bg-card border rounded-lg shadow-lg z-10 min-w-[120px]">
                  {CONTENT_LANGUAGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value || "auto"}
                      type="button"
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted rounded"
                      onClick={() => {
                        setContentLanguage(opt.value);
                        setContentLangOpen(false);
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setToneOpen(!toneOpen)}
                className="rounded-lg min-w-[120px] justify-between"
              >
                <span>{TONE_OPTIONS.find((o) => o.value === tone)?.label ?? "Tone"}</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              {toneOpen && (
                <div className="absolute top-full right-0 mt-1 py-1 bg-card border rounded-lg shadow-lg z-10 min-w-[120px]">
                  {TONE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value || "default"}
                      type="button"
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted rounded"
                      onClick={() => {
                        setTone(opt.value);
                        setToneOpen(false);
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              disabled={regenerating}
              className="rounded-lg"
            >
              <RefreshCw className={cn("h-4 w-4 mr-1.5", regenerating && "animate-spin")} />
              Regenerate
            </Button>
          </div>
        </div>
      </div>

      <TabsContent value="blog" className="mt-6 space-y-4">
        <div className="flex flex-wrap justify-end gap-2">
          {blog && (
            <>
              <CopyButton text={blog.content || ""} label="Copy blog" />
            </>
          )}
        </div>
        {blog ? (
          <div className="rounded-2xl border border-border/80 bg-card shadow-sm overflow-hidden">
            <BlogEditor
              content={blog.content || ""}
              outputId={blog.id}
              placeholder="Blog post will appear here…"
            />
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No blog content yet.</p>
        )}
      </TabsContent>

      <TabsContent value="twitter" className="mt-6 space-y-4">
        <div className="flex justify-end">
          {tweets.length > 0 && (
            <CopyButton
              text={tweets.map((t, i) => `${i + 1}. ${t.content || ""}`).join("\n\n")}
              label="Copy all tweets"
            />
          )}
        </div>
        {tweets.length > 0 ? (
          <ul className="space-y-4">
            {tweets.map((t, i) => (
              <li
                key={t.id}
                className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
              >
                <p className="text-sm text-foreground flex-1 whitespace-pre-wrap">{t.content}</p>
                <CopyButton text={t.content || ""} label={`Copy tweet ${i + 1}`} className="shrink-0 rounded-lg" />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-sm">No tweets yet.</p>
        )}
      </TabsContent>

      <TabsContent value="linkedin" className="mt-6">
        <div className="flex justify-end gap-2 mb-2">
          {linkedin && <CopyButton text={linkedin.content || ""} label="Copy LinkedIn" />}
        </div>
        {linkedin ? (
          <div className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm">
            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">{linkedin.content}</p>
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">No LinkedIn post yet.</p>
        )}
      </TabsContent>

      <TabsContent value="transcript" className="mt-6">
        <div className="flex justify-end gap-2 mb-2">
          {transcript && <CopyButton text={transcript.content || ""} label="Copy transcript" />}
        </div>
        {renderContent(transcript?.content ?? null)}
      </TabsContent>

      <TabsContent value="show_notes" className="mt-6">
        <div className="flex justify-end gap-2 mb-2">
          {show_notes && <CopyButton text={show_notes.content || ""} label="Copy show notes" />}
        </div>
        {renderContent(show_notes?.content ?? null)}
      </TabsContent>

      <TabsContent value="key_takeaways" className="mt-6">
        <div className="flex justify-end gap-2 mb-2">
          {key_takeaways && <CopyButton text={key_takeaways.content || ""} label="Copy takeaways" />}
        </div>
        {renderContent(key_takeaways?.content ?? null)}
      </TabsContent>

      <TabsContent value="quotes" className="mt-6">
        <div className="flex justify-end gap-2 mb-2">
          {quotes && <CopyButton text={quotes.content || ""} label="Copy quotes" />}
        </div>
        {renderContent(quotes?.content ?? null)}
      </TabsContent>

      <TabsContent value="newsletter" className="mt-6">
        <div className="flex justify-end gap-2 mb-2">
          {newsletter && <CopyButton text={newsletter.content || ""} label="Copy newsletter" />}
        </div>
        {renderContent(newsletter?.content ?? null)}
      </TabsContent>

      <TabsContent value="instagram" className="mt-6">
        <div className="flex justify-end gap-2 mb-2">
          {instagram && <CopyButton text={instagram.content || ""} label="Copy Instagram" />}
        </div>
        {renderContent(instagram?.content ?? null)}
      </TabsContent>

      <TabsContent value="youtube_description" className="mt-6">
        <div className="flex justify-end gap-2 mb-2">
          {youtube_description && (
            <CopyButton text={youtube_description.content || ""} label="Copy YouTube description" />
          )}
        </div>
        {renderContent(youtube_description?.content ?? null)}
      </TabsContent>

      <TabsContent value="seo_keywords" className="mt-6">
        <div className="flex justify-end gap-2 mb-2">
          {seo_keywords && <CopyButton text={seo_keywords.content || ""} label="Copy keywords" />}
        </div>
        {renderContent(seo_keywords?.content ?? null)}
      </TabsContent>

      <TabsContent value="email_subject" className="mt-6">
        <div className="flex justify-end gap-2 mb-2">
          {email_subject && <CopyButton text={email_subject.content || ""} label="Copy subject" />}
        </div>
        {renderContent(email_subject?.content ?? null)}
      </TabsContent>

      <TabsContent value="twitter_thread" className="mt-6">
        <div className="flex justify-end gap-2 mb-2">
          {twitter_thread && <CopyButton text={twitter_thread.content || ""} label="Copy thread" />}
        </div>
        {renderContent(twitter_thread?.content ?? null)}
      </TabsContent>

      <TabsContent value="headlines" className="mt-6">
        <div className="flex justify-end gap-2 mb-2">
          {headlines && <CopyButton text={headlines.content || ""} label="Copy headlines" />}
        </div>
        {renderContent(headlines?.content ?? null)}
      </TabsContent>
    </Tabs>
  );
}
