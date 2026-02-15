import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ProcessingView } from "@/components/processing-view";
import { PodcastContentPanel } from "@/components/podcast-content-panel";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface PageProps {
  params: Promise<{ id: string }>;
}

const statusBadgeStyles: Record<string, string> = {
  completed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30",
  processing: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
  failed: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
};

export default async function PodcastDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: podcast, error: podcastError } = await supabase
    .from("podcasts")
    .select("id, title, status, created_at")
    .eq("id", id)
    .single();

  if (podcastError || !podcast) notFound();

  const { data: outputs } = await supabase
    .from("content_outputs")
    .select("id, type, content, metadata")
    .eq("podcast_id", id)
    .order("type");

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1.5" />
          Back to dashboard
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {podcast.title || "Untitled podcast"}
          </h1>
          <span
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize",
              statusBadgeStyles[podcast.status] ?? "bg-muted text-muted-foreground"
            )}
          >
            {podcast.status}
          </span>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          {new Date(podcast.created_at).toLocaleDateString(undefined, {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {podcast.status === "processing" && (
        <ProcessingView podcastId={id} />
      )}

      {podcast.status === "completed" && (
        <PodcastContentPanel podcastId={id} outputs={outputs ?? []} />
      )}

      {podcast.status === "failed" && (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center shadow-sm">
          <p className="font-semibold text-destructive">Processing failed</p>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            This podcast could not be processed. You can try uploading again or use Regenerate after fixing any issues.
          </p>
          <Link href="/dashboard">
            <Button variant="outline" className="mt-6 rounded-lg">
              Back to dashboard
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
