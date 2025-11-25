import { db } from "@/lib/db";
import { subscription } from "@/lib/db/schema";
import { and, desc, eq, inArray } from "drizzle-orm";

/**
 * Obtiene la suscripción activa de un usuario (basado en status)
 */
export async function getActiveSubscription(userId: string) {
  const result = await db
    .select()
    .from(subscription)
    .where(
      and(eq(subscription.user_id, userId), inArray(subscription.status, ["active", "trialing"])),
    )
    .orderBy(desc(subscription.created_at))
    .limit(1);

  return result[0] || null;
}

/**
 * Obtiene todas las suscripciones de un usuario (para auditoría)
 */
export async function getUserSubscriptionHistory(userId: string) {
  return await db
    .select()
    .from(subscription)
    .where(eq(subscription.user_id, userId))
    .orderBy(desc(subscription.created_at));
}

/**
 * Verifica si un usuario tiene una suscripción activa
 */
export async function hasActiveSubscription(userId: string): Promise<boolean> {
  const activeSubscription = await getActiveSubscription(userId);
  return activeSubscription !== null;
}

/**
 * Verifica si un usuario tiene un plan específico activo
 */
export async function hasActivePlan(userId: string, planType: "basic" | "pro"): Promise<boolean> {
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
}

/**
 * Obtiene la suscripción por Stripe subscription ID
 */
export async function getSubscriptionByStripeId(stripeSubscriptionId: string) {
  const result = await db
    .select()
    .from(subscription)
    .where(eq(subscription.subscription_id, stripeSubscriptionId))
    .limit(1);

  return result[0] || null;
}
