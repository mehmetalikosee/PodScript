"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Mic, Upload, Loader2 } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

const ACCEPT = {
  "audio/mpeg": [".mp3"],
  "audio/wav": [".wav"],
  "audio/x-m4a": [".m4a"],
  "audio/mp4": [".m4a"],
};

function uploadWithProgress(
  signedUrl: string,
  file: File,
  onProgress: (pct: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      if (e.lengthComputable) {
        onProgress((e.loaded / e.total) * 100);
      }
    });

    xhr.addEventListener("load", () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(`Upload failed: ${xhr.status}`));
    });
    xhr.addEventListener("error", () => reject(new Error("Network error")));
    xhr.addEventListener("abort", () => reject(new Error("Upload aborted")));

    xhr.open("PUT", signedUrl);
    xhr.setRequestHeader("Content-Type", file.type || "audio/mpeg");
    xhr.send(file);
  });
}

export function UploadZone() {
  const { t } = useLanguage();
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploading, setUploading] = useState(false);
  const router = useRouter();

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setUploading(true);
      setUploadProgress(0);

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please sign in to upload.");
        setUploading(false);
        setUploadProgress(null);
        return;
      }

      const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
      const path = `${user.id}/${Date.now()}-${safeName}`;

      try {
        const { data: signData, error: signError } = await supabase.storage
          .from("podcasts")
          .createSignedUploadUrl(path);

        if (signError || !signData?.signedUrl) {
          toast.error(signError?.message || "Failed to get upload URL");
          setUploading(false);
          setUploadProgress(null);
          return;
        }

        await uploadWithProgress(
          signData.signedUrl,
          file,
          (pct) => setUploadProgress(pct)
        );

        const res = await fetch("/api/podcasts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            file_path: path,
            title: file.name.replace(/\.[^/.]+$/, "") || "Untitled",
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({}));
          throw new Error(err.error || "Failed to create podcast record");
        }

        const podcast = await res.json();
        toast.success("Upload complete. Processing with AI…");
        router.push(`/dashboard/${podcast.id}`);
        router.refresh();
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Upload failed";
        toast.error(msg);
      } finally {
        setUploading(false);
        setUploadProgress(null);
      }
    },
    [router]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: ACCEPT,
    maxFiles: 1,
    disabled: uploading,
  });

  return (
    <Card className="overflow-hidden rounded-2xl border-border/80 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Mic className="h-5 w-5 text-primary" />
          {t("upload.title")}
        </CardTitle>
        <CardDescription className="text-muted-foreground">
          {t("upload.hint")}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div
          {...getRootProps()}
          className={cn(
            "border-2 border-dashed rounded-xl p-12 text-center transition-all cursor-pointer",
            isDragActive && "border-primary bg-primary/10 scale-[1.01]",
            !isDragActive && "border-muted-foreground/25 hover:border-primary/50 hover:bg-accent/30",
            uploading && "pointer-events-none opacity-90"
          )}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="space-y-3">
              <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
              <p className="text-sm font-medium">{t("upload.uploading")}</p>
              <Progress value={uploadProgress ?? 0} className="max-w-xs mx-auto" />
            </div>
          ) : (
            <>
              <Upload className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                {isDragActive ? t("upload.dropHere") : t("upload.dragDrop")}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {t("upload.formats")}
              </p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
