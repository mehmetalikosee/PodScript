import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, tokens_remaining")
    .eq("id", user.id)
    .single();

  return NextResponse.json({
    plan: profile?.plan ?? "trial",
    tokens_remaining: profile?.tokens_remaining ?? 0,
  });
}
