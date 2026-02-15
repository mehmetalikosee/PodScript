import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

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
    const { file_path, title } = body as { file_path: string; title?: string };
    if (!file_path) {
      return NextResponse.json(
        { error: "file_path is required" },
        { status: 400 }
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("podcasts").getPublicUrl(file_path);

    const { data: podcast, error } = await supabase
      .from("podcasts")
      .insert({
        user_id: user.id,
        file_url: publicUrl,
        title: title || "Untitled podcast",
        status: "processing",
      })
      .select("id, status, created_at")
      .single();

    if (error) {
      console.error("Insert podcast error:", error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(podcast);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
