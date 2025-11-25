import { getUserById, updateUserCustomerId } from "@/lib/db/queries";
import { stripe } from "./stripe";

/**
 * Creates or retrieves a Stripe customer for a user
 * This function should be called when the user is about to make a payment
 */
export async function ensureStripeCustomer(userId: string): Promise<string> {
  try {
    // Get user from database
    const user = await getUserById({ id: userId });

    if (!user) {
      throw new Error(`User not found: ${userId}`);
    }

    // If user already has a customer_id, return it
    if (user.customer_id) {
      return user.customer_id;
    }

    // Create new Stripe customer
    const customer = await stripe.customers.create({
      email: user.email,
      name: user.name && user.lastname ? `${user.name} ${user.lastname}` : user.name || undefined,
      phone: user.phone || undefined,
      metadata: {
        user_id: userId,
        user_role: user.role,
      },
    });

    // Save customer_id to user record
    await updateUserCustomerId({
      userId: userId,
      customerId: customer.id,
    });

    return customer.id;
  } catch (error) {
    console.error("Error ensuring Stripe customer:", error);
    throw error;
  }
}

/**
 * Creates a checkout session for a user subscription
 */
export async function createSubscriptionCheckoutSession({
  userId,
  priceId,
  successUrl,
  cancelUrl,
}: {
  userId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  try {
    // Ensure the user has a Stripe customer
    const customerId = await ensureStripeCustomer(userId);

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        user_id: userId,
      },
    });

    return session;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}

/**
 * Creates a one-time payment checkout session
 */
export async function createPaymentCheckoutSession({
  userId,
  amount,
  currency = "usd",
  description,
  successUrl,
  cancelUrl,
}: {
  userId: string;
  amount: number; // in cents
  currency?: string;
  description: string;
  successUrl: string;
  cancelUrl: string;
}) {
  try {
    // Ensure the user has a Stripe customer
    const customerId = await ensureStripeCustomer(userId);

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: currency,
            product_data: {
              name: description,
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        user_id: userId,
      },
    });

    return session;
  } catch (error) {
    console.error("Error creating payment session:", error);
    throw error;
  }
}
