import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body?.email === "string" ? body.email.trim() : "";
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const supabase = await createClient();
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email })
      .select()
      .single();

    if (error) {
      if (error.code === "23505") return NextResponse.json({ message: "Already subscribed" });
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ message: "Subscribed" });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
