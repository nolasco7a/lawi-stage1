import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/stripe";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      return NextResponse.json({ error: "Session ID is required" }, { status: 400 });
    }

    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "subscription", "customer"],
    });

    return NextResponse.json({
      status: session.status,
      customer_email: session.customer_details?.email,
      amount_total: session.amount_total,
      currency: session.currency,
      metadata: session.metadata,
      subscription_id: session.subscription,
      customer_id: session.customer,
    });
  } catch (err: any) {
    console.error("Stripe session verification error:", err);
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}
