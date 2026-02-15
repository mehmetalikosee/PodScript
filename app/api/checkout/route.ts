import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import Stripe from "stripe";

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const PRO_PRICE_ID = process.env.STRIPE_PRO_PRICE_ID;

export async function POST(request: Request) {
  if (!stripe || !PRO_PRICE_ID) {
    return NextResponse.json(
      { error: "Payment is not configured. Please add STRIPE_SECRET_KEY and STRIPE_PRO_PRICE_ID." },
      { status: 503 }
    );
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const origin = request.headers.get("origin") || request.headers.get("referer") || "";
    const baseUrl = origin.replace(/\/$/, "") || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: PRO_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/dashboard/profile?success=true`,
      cancel_url: `${baseUrl}/dashboard/pricing?canceled=true`,
      client_reference_id: user.id,
      customer_email: user.email ?? undefined,
      metadata: { user_id: user.id },
    });

    if (!session.url) {
      return NextResponse.json({ error: "Failed to create checkout session" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Checkout failed" },
      { status: 500 }
    );
  }
}
