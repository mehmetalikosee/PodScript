import { NextResponse } from "next/server";
import { createClient as createServerClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

export async function POST() {
  if (!stripe) {
    return NextResponse.json({ error: "Stripe not configured" }, { status: 503 });
  }

  const supabase = await createServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const customers = await stripe.customers.list({ email: user.email, limit: 1 });
    const customer = customers.data[0];
    if (!customer) {
      return NextResponse.json({ updated: false, message: "No Stripe customer found" });
    }

    const subscriptions = await stripe.subscriptions.list({
      customer: customer.id,
      status: "active",
      limit: 1,
    });

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ updated: false, message: "No active subscription" });
    }

    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!serviceKey) {
      return NextResponse.json({ error: "SUPABASE_SERVICE_ROLE_KEY not set" }, { status: 503 });
    }
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceKey
    );

    const { error } = await supabaseAdmin
      .from("profiles")
      .update({
        plan: "pro",
        tokens_limit: 100,
        tokens_remaining: 100,
        stripe_customer_id: customer.id,
        stripe_subscription_id: subscriptions.data[0].id,
      })
      .eq("id", user.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ updated: true, message: "Subscription synced to Pro" });
  } catch (err) {
    console.error("Sync subscription error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Sync failed" },
      { status: 500 }
    );
  }
}
