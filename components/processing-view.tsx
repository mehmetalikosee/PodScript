"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface ProcessingViewProps {
  podcastId: string;
}

export function ProcessingView({ podcastId }: ProcessingViewProps) {
  const [streamedText, setStreamedText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        const res = await fetch("/api/process", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ podcastId }),
        });

        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          setError(data.error || "Processing failed");
          if (res.status === 402) setError("no_tokens");
          return;
        }

        const reader = res.body?.getReader();
        if (!reader) {
          setError("No response body");
          return;
        }

        const decoder = new TextDecoder();
        let acc = "";

        while (true) {
          const { done, value } = await reader.read();
          if (cancelled) break;
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          acc += chunk;
          setStreamedText(acc);
        }

        router.refresh();
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Something went wrong");
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [podcastId, router]);

  if (error) {
    const isNoTokens = error === "no_tokens";
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center shadow-sm">
        <p className="font-semibold text-destructive">
          {isNoTokens ? "No tokens remaining" : "Processing failed"}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          {isNoTokens
            ? "Upgrade your plan to process more podcasts."
            : error}
        </p>
        {isNoTokens && (
          <Link href="/dashboard/pricing" className="mt-4 inline-block">
            <Button size="sm">Upgrade plan</Button>
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="rounded-2xl border border-border/80 bg-gradient-to-br from-primary/5 to-accent/5 p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-primary animate-bounce [animation-delay:0ms]" />
            <span className="h-2.5 w-2.5 rounded-full bg-primary animate-bounce [animation-delay:120ms]" />
            <span className="h-2.5 w-2.5 rounded-full bg-primary animate-bounce [animation-delay:240ms]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Writing with AI…</p>
            <p className="text-xs text-muted-foreground">Transcribing and generating blog, tweets & LinkedIn</p>
          </div>
        </div>
      </div>

      {streamedText && (
        <div className="rounded-2xl border border-border/80 bg-card p-5 shadow-sm">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Live preview
          </p>
          <pre className="whitespace-pre-wrap font-sans text-sm text-foreground max-h-[360px] overflow-y-auto rounded-lg bg-muted/30 p-4">
            {streamedText}
          </pre>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        {["Blog", "Twitter", "LinkedIn"].map((label, i) => (
          <div
            key={label}
            className="rounded-2xl border border-border/80 bg-card p-6 shadow-sm animate-pulse"
          >
            <div className="h-4 w-28 bg-muted/80 rounded-lg mb-5" />
            <div className="space-y-3">
              <div className="h-3 w-full bg-muted/80 rounded" />
              <div className="h-3 w-[90%] bg-muted/80 rounded" />
              <div className="h-3 w-[75%] bg-muted/80 rounded" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
