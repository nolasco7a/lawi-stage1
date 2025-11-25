import { createSubscriptionCheckoutSession } from "@/lib/stripe/customer-helpers";
import { getToken } from "next-auth/jwt";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

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
    const { priceId = "Plan Lawi" } = body;

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

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe checkout session error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 },
    );
  }
}
