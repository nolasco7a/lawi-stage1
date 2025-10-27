import { db } from "@/lib/db";
import { invoice, subscription, user } from "@/lib/db/schema";
import { and, desc, eq, inArray } from "drizzle-orm";

export interface UserSubscription {
  id: string;
  subscription_id: string;
  customer_id: string;
  status: string;
  plan_type: "basic" | "pro";
  current_period_start: Date;
  current_period_end: Date;
  cancel_at_period_end: boolean;
  canceled_at: Date | null;
  created_at: Date;
  updated_at: Date;
}

export interface SubscriptionWithInvoices extends UserSubscription {
  invoices: Array<{
    id: string;
    invoice_id: string;
    amount_paid: number;
    currency: string;
    status: string;
    invoice_pdf: string | null;
    period_start: Date;
    period_end: Date;
    paid_at: Date | null;
    created_at: Date;
  }>;
}

// Get user's active subscription
export async function getUserActiveSubscription(userId: string): Promise<UserSubscription | null> {
  try {
    const result = await db
      .select()
      .from(subscription)
      .where(
        and(eq(subscription.user_id, userId), inArray(subscription.status, ["active", "trialing"])),
      )
      .orderBy(desc(subscription.created_at))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error fetching user active subscription:", error);
    return null;
  }
}

// Get user's subscription history
export async function getUserSubscriptionHistory(userId: string): Promise<UserSubscription[]> {
  try {
    const result = await db
      .select()
      .from(subscription)
      .where(eq(subscription.user_id, userId))
      .orderBy(desc(subscription.created_at));

    return result;
  } catch (error) {
    console.error("Error fetching user subscription history:", error);
    return [];
  }
}

// Get subscription with invoices
export async function getSubscriptionWithInvoices(
  subscriptionId: string,
): Promise<SubscriptionWithInvoices | null> {
  try {
    // Get subscription
    const subscriptionResult = await db
      .select()
      .from(subscription)
      .where(eq(subscription.subscription_id, subscriptionId))
      .limit(1);

    if (subscriptionResult.length === 0) {
      return null;
    }

    const userSubscription = subscriptionResult[0];

    // Get invoices for this subscription
    const invoicesResult = await db
      .select({
        id: invoice.id,
        invoice_id: invoice.invoice_id,
        amount_paid: invoice.amount_paid,
        currency: invoice.currency,
        status: invoice.status,
        invoice_pdf: invoice.invoice_pdf,
        period_start: invoice.period_start,
        period_end: invoice.period_end,
        paid_at: invoice.paid_at,
        created_at: invoice.created_at,
      })
      .from(invoice)
      .where(eq(invoice.subscription_id, userSubscription.id))
      .orderBy(desc(invoice.created_at));

    return {
      ...userSubscription,
      invoices: invoicesResult,
    };
  } catch (error) {
    console.error("Error fetching subscription with invoices:", error);
    return null;
  }
}

// Check if user has active subscription
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  try {
    const result = await db
      .select({ id: subscription.id })
      .from(subscription)
      .where(
        and(eq(subscription.user_id, userId), inArray(subscription.status, ["active", "trialing"])),
      )
      .limit(1);

    return result.length > 0;
  } catch (error) {
    console.error("Error checking active subscription:", error);
    return false;
  }
}

// Check if user has specific plan type
export async function hasActivePlan(userId: string, planType: "basic" | "pro"): Promise<boolean> {
  try {
    const result = await db
      .select({ id: subscription.id })
      .from(subscription)
      .where(
        and(
          eq(subscription.user_id, userId),
          inArray(subscription.status, ["active", "trialing"]),
          eq(subscription.plan_type, planType),
        ),
      )
      .limit(1);

    return result.length > 0;
  } catch (error) {
    console.error("Error checking active plan:", error);
    return false;
  }
}

// Get subscription by Stripe subscription ID
export async function getSubscriptionByStripeId(
  stripeSubscriptionId: string,
): Promise<UserSubscription | null> {
  try {
    const result = await db
      .select()
      .from(subscription)
      .where(eq(subscription.subscription_id, stripeSubscriptionId))
      .limit(1);

    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error fetching subscription by Stripe ID:", error);
    return null;
  }
}

// Update user's customer ID (useful for linking users to Stripe customers)
export async function updateUserCustomerId(userId: string, customerId: string): Promise<void> {
  try {
    // TODO: checar esta funcion, creo que alguna sfunciones de stripe no sirven para nada por que tengo dos configuraciones, elegir con cual quedarme
    // You might want to add a customer_id field to the user table
    // For now, this is a placeholder function
    console.log(`Would update user ${userId} with customer ID ${customerId}`);
  } catch (error) {
    console.error("Error updating user customer ID:", error);
    throw error;
  }
}

// Cancel subscription (set to cancel at period end)
export async function cancelSubscriptionAtPeriodEnd(subscriptionId: string): Promise<boolean> {
  try {
    const result = await db
      .update(subscription)
      .set({
        cancel_at_period_end: true,
        updated_at: new Date(),
      })
      .where(eq(subscription.subscription_id, subscriptionId));

    return true;
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return false;
  }
}

// Reactivate subscription (remove cancel at period end)
export async function reactivateSubscription(subscriptionId: string): Promise<boolean> {
  try {
    const result = await db
      .update(subscription)
      .set({
        cancel_at_period_end: false,
        updated_at: new Date(),
      })
      .where(eq(subscription.subscription_id, subscriptionId));

    return true;
  } catch (error) {
    console.error("Error reactivating subscription:", error);
    return false;
  }
}
