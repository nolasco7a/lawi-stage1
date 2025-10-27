import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { getToken } from "next-auth/jwt";
import { createSubscriptionCheckoutSession } from "@/lib/stripe/customer-helpers";

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const origin = headersList.get("origin") || "http://localhost:3000";

    // Get authenticated user
    const token = await getToken({
      req: request,
      secret: process.env.AUTH_SECRET,
    });

    if (!token?.sub) {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    // Parse request body to get product info
    const body = await request.json();
    const { productId, priceId, productName = "Plan Lawi" } = body;

    console.log("Creating checkout session for user:", token.sub, {
      productId,
      priceId,
      productName,
    });

    if (!priceId) {
      throw new Error("Price ID is required");
    }

    // Create checkout session with user association
    const session = await createSubscriptionCheckoutSession({
      userId: token.sub,
      priceId: priceId,
      successUrl: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${origin}/#planes`,
    });

    console.log("Checkout session created successfully:", session.id);

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe checkout session error:", err);
    return NextResponse.json({ error: err.message }, { status: err.statusCode || 500 });
  }
}
