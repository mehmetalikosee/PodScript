"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { useCallback, useEffect, useMemo } from "react";
import { marked } from "marked";
import { cn } from "@/lib/utils";

function markdownToHtml(md: string): string {
  if (!md?.trim()) return "";
  if (!md.includes("##") && !md.trimStart().startsWith("#")) return md;
  return marked.parse(md, { async: false }) as string;
}

interface BlogEditorProps {
  content: string;
  outputId: string;
  placeholder?: string;
  className?: string;
}

export function BlogEditor({
  content,
  outputId,
  placeholder = "Start writing…",
  className,
}: BlogEditorProps) {
  const initialHtml = useMemo(() => markdownToHtml(content || ""), [content]);
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder }),
    ],
    content: initialHtml,
    editorProps: {
      attributes: {
        class: "tiptap prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[200px] px-3 py-2",
      },
    },
  });

  const save = useCallback(async () => {
    if (!editor || !outputId) return;
    const html = editor.getHTML();
    await fetch("/api/content-outputs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: outputId, content: html }),
    });
  }, [editor, outputId]);

  useEffect(() => {
    if (!editor) return;
    editor.commands.setContent(markdownToHtml(content || ""), false);
  }, [content, editor]);

  useEffect(() => {
    if (!editor) return;
    const timer = setInterval(save, 5000);
    return () => clearInterval(timer);
  }, [editor, save]);

  if (!editor) return null;

  return (
    <div
      className={cn(
        "rounded-lg border bg-background text-foreground",
        className
      )}
    >
      <EditorContent editor={editor} />
    </div>
  );
}
