import Stripe from 'stripe';
import { db } from '@/lib/db';
import { subscription, subscriptionEvent, invoice, user } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';

// Helper function to get plan type from Stripe price ID
function getPlanTypeFromPriceId(priceId: string): 'basic' | 'pro' {
  // Map your actual price IDs to plan types
  const priceIdMap: Record<string, 'basic' | 'pro'> = {
    'price_1RxEQA5aFd4VysYjNRrZeeCU': 'basic', // LAWI BASIC
    'price_1RxERB5aFd4VysYjfOZ00nT3': 'pro',   // LAWI PRO
  };
  
  return priceIdMap[priceId] || 'basic';
}

// Helper function to find user by customer ID
async function findUserByCustomerId(customerId: string) {
  try {
    // First try to find user directly by customer_id
    const userByCustomerId = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.customer_id, customerId))
      .limit(1);
      
    if (userByCustomerId.length > 0) {
      console.log(`Found user by customer_id: ${userByCustomerId[0].id}`);
      return userByCustomerId[0].id;
    }
    
    // Fallback: try to find by existing subscription
    const existingSubscription = await db
      .select({ user_id: subscription.user_id })
      .from(subscription)
      .where(eq(subscription.customer_id, customerId))
      .limit(1);
      
    if (existingSubscription.length > 0) {
      console.log(`Found user by subscription: ${existingSubscription[0].user_id}`);
      return existingSubscription[0].user_id;
    }
    
    console.warn(`No user found for customer ID: ${customerId}`);
    return null;
    
  } catch (error) {
    console.error('Error finding user by customer ID:', error);
    return null;
  }
}

// Helper function to log webhook events
async function logWebhookEvent(event: Stripe.Event, subscriptionId?: string) {
  try {
    if (subscriptionId) {
      const existingSubscription = await db
        .select({ id: subscription.id })
        .from(subscription)
        .where(eq(subscription.subscription_id, subscriptionId))
        .limit(1);
        
      if (existingSubscription.length > 0) {
        await db.insert(subscriptionEvent).values({
          subscription_id: existingSubscription[0].id,
          event_id: event.id,
          event_type: event.type,
          event_data: event.data,
        });
      }
    }
  } catch (error) {
    console.error('Failed to log webhook event:', error);
  }
}

export async function handleSubscriptionCreated(event: Stripe.Event) {
  const subscription_data = event.data.object as Stripe.Subscription;
  
  console.log('Processing subscription created:', subscription_data);
  console.log('Raw subscription data timestamps:', {
    current_period_start: subscription_data.current_period_start,
    current_period_end: subscription_data.current_period_end,
    created: subscription_data.created
  });
  
  try {
    // Get the price ID to determine plan type
    const priceId = subscription_data.items.data[0]?.price.id;
    if (!priceId) {
      throw new Error('No price ID found in subscription');
    }
    
    const planType = getPlanTypeFromPriceId(priceId);
    const userId = await findUserByCustomerId(subscription_data.customer as string);
    
    if (!userId) {
      console.warn(`User not found for customer: ${subscription_data.customer}, subscription: ${subscription_data.id}`);
      console.warn('This might be a race condition or webhook ordering issue. Subscription will be processed when user is available.');
      
      // Don't throw error - just log and return success to avoid webhook retries
      // The subscription will be processed when the user becomes available or via subscription.updated webhook
      return;
    }
    
    // Validate and convert timestamps
    // For trialing subscriptions, use trial dates; otherwise use current period dates
    const sub = subscription_data as any; // Type assertion for accessing all properties
    const currentPeriodStart = sub.current_period_start 
      ? new Date(sub.current_period_start * 1000)
      : sub.trial_start 
        ? new Date(sub.trial_start * 1000)
        : new Date();
        
    const currentPeriodEnd = sub.current_period_end
      ? new Date(sub.current_period_end * 1000)
      : sub.trial_end
        ? new Date(sub.trial_end * 1000) 
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now as fallback
    
    console.log('Subscription dates:', {
      current_period_start: sub.current_period_start,
      current_period_end: sub.current_period_end,
      trial_start: sub.trial_start,
      trial_end: sub.trial_end,
      status: subscription_data.status,
      currentPeriodStart: currentPeriodStart.toISOString(),
      currentPeriodEnd: currentPeriodEnd.toISOString()
    });

    // Create subscription record and set as active
    await db.insert(subscription).values({
      user_id: userId,
      subscription_id: subscription_data.id,
      customer_id: subscription_data.customer as string,
      status: subscription_data.status,
      plan_type: planType,
      current_period_start: currentPeriodStart,
      current_period_end: currentPeriodEnd,
      cancel_at_period_end: subscription_data.cancel_at_period_end || false,
      canceled_at: subscription_data.canceled_at ? new Date(subscription_data.canceled_at * 1000) : null,
    });
    
    // Log the event
    await logWebhookEvent(event, subscription_data.id);
    
    console.log(`Subscription created successfully for user ${userId}`);
  } catch (error) {
    console.error('Error handling subscription created:', error);
    throw error;
  }
}

export async function handleSubscriptionUpdated(event: Stripe.Event) {
  const subscription_data = event.data.object as Stripe.Subscription;
  
  console.log('Processing subscription updated:', subscription_data.id);
  console.log('New status:', subscription_data.status);
  
  try {
    // Small delay to avoid race condition with subscription.created
    console.log('Waiting 500ms to avoid race condition...');
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Find existing subscription
    const existingSubscription = await db
      .select()
      .from(subscription)
      .where(eq(subscription.subscription_id, subscription_data.id))
      .limit(1);
      
    console.log('Found existing subscription:', existingSubscription.length > 0);
    
    if (existingSubscription.length === 0) {
      console.warn(`Subscription not found: ${subscription_data.id}, creating it`);
      
      // If subscription doesn't exist, create it (race condition handling)
      const priceId = subscription_data.items.data[0]?.price.id;
      if (!priceId) {
        throw new Error('No price ID found in subscription');
      }
      
      const planType = getPlanTypeFromPriceId(priceId);
      const userId = await findUserByCustomerId(subscription_data.customer as string);
      
      if (!userId) {
        throw new Error(`User not found for customer: ${subscription_data.customer}`);
      }
      
      // Validate and convert timestamps  
      const sub_data = subscription_data as any;
      const currentPeriodStart = sub_data.current_period_start 
        ? new Date(sub_data.current_period_start * 1000)
        : sub_data.trial_start 
          ? new Date(sub_data.trial_start * 1000)
          : new Date();
      const currentPeriodEnd = sub_data.current_period_end
        ? new Date(sub_data.current_period_end * 1000)
        : sub_data.trial_end
          ? new Date(sub_data.trial_end * 1000) 
          : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

      // Create subscription record (handle race condition)
      try {
        await db.insert(subscription).values({
          user_id: userId,
          subscription_id: subscription_data.id,
          customer_id: subscription_data.customer as string,
          status: subscription_data.status,
          plan_type: planType,
          current_period_start: currentPeriodStart,
          current_period_end: currentPeriodEnd,
          cancel_at_period_end: subscription_data.cancel_at_period_end || false,
          canceled_at: subscription_data.canceled_at ? new Date(subscription_data.canceled_at * 1000) : null,
        });
        
        console.log(`Subscription created via update for user ${userId}`);
        return;
      } catch (error: any) {
        // If subscription already exists (race condition), update it instead
        if (error.code === '23505') { // PostgreSQL unique constraint violation
          console.log(`Subscription already exists, updating instead: ${subscription_data.id}`);
          
          // Re-query the existing subscription
          const requeriedSubscription = await db
            .select()
            .from(subscription)
            .where(eq(subscription.subscription_id, subscription_data.id))
            .limit(1);
            
          if (requeriedSubscription.length === 0) {
            throw new Error(`Subscription still not found after duplicate error: ${subscription_data.id}`);
          }
          
          // Set existingSubscription for the update logic below
          existingSubscription.push(...requeriedSubscription);
        } else {
          throw error;
        }
      }
    }
    
    console.log('Current subscription status in DB:', existingSubscription[0]?.status);
    
    // Get the price ID to determine plan type
    const priceId = subscription_data.items.data[0]?.price.id;
    const planType = priceId ? getPlanTypeFromPriceId(priceId) : existingSubscription[0].plan_type;
    
    // Validate and convert timestamps
    const sub_data2 = subscription_data as any;
    const currentPeriodStart = sub_data2.current_period_start 
      ? new Date(sub_data2.current_period_start * 1000)
      : sub_data2.trial_start 
        ? new Date(sub_data2.trial_start * 1000)
        : new Date();
    const currentPeriodEnd = sub_data2.current_period_end
      ? new Date(sub_data2.current_period_end * 1000)
      : sub_data2.trial_end
        ? new Date(sub_data2.trial_end * 1000) 
        : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

    // Update subscription
    console.log('Updating subscription with:', {
      status: subscription_data.status,
      plan_type: planType,
      subscription_id: subscription_data.id
    });
    
    const updateResult = await db
      .update(subscription)
      .set({
        status: subscription_data.status,
        plan_type: planType,
        current_period_start: currentPeriodStart,
        current_period_end: currentPeriodEnd,
        cancel_at_period_end: subscription_data.cancel_at_period_end || false,
        canceled_at: subscription_data.canceled_at ? new Date(subscription_data.canceled_at * 1000) : null,
        updated_at: new Date(),
      })
      .where(eq(subscription.subscription_id, subscription_data.id))
      .returning();
    
    console.log('Update result:', updateResult);
    
    // Log the event
    await logWebhookEvent(event, subscription_data.id);
    
    console.log(`Subscription updated successfully: ${subscription_data.id}`);
  } catch (error) {
    console.error('Error handling subscription updated:', error);
    throw error;
  }
}

export async function handleSubscriptionDeleted(event: Stripe.Event) {
  const subscription_data = event.data.object as Stripe.Subscription;
  
  console.log('Processing subscription deleted:', subscription_data.id);
  
  try {
    // Update subscription status to canceled and deactivate it
    await db
      .update(subscription)
      .set({
        status: 'canceled',
        canceled_at: new Date(),
        updated_at: new Date(),
      })
      .where(eq(subscription.subscription_id, subscription_data.id));
    
    // Log the event
    await logWebhookEvent(event, subscription_data.id);
    
    console.log(`Subscription deleted successfully: ${subscription_data.id}`);
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
    throw error;
  }
}

export async function handleInvoicePaymentSucceeded(event: Stripe.Event) {
  const invoice_data = event.data.object as Stripe.Invoice;
  
  console.log('Processing invoice payment succeeded:', invoice_data.id);
  console.log('Invoice subscription ID:', invoice_data.subscription);
  console.log('Invoice customer ID:', invoice_data.customer);
  
  try {
    if (!invoice_data.subscription) {
      console.log('Invoice not associated with subscription, skipping');
      return;
    }
    
    // Find subscription
    const existingSubscription = await db
      .select({ id: subscription.id })
      .from(subscription)
      .where(eq(subscription.subscription_id, invoice_data.subscription as string))
      .limit(1);
      
    if (existingSubscription.length === 0) {
      console.warn(`Subscription not found for invoice: ${invoice_data.subscription}`);
      return;
    }
    
    // Create or update invoice record
    const existingInvoice = await db
      .select()
      .from(invoice)
      .where(eq(invoice.invoice_id, invoice_data.id))
      .limit(1);
    
    const invoiceValues = {
      subscription_id: existingSubscription[0].id,
      invoice_id: invoice_data.id,
      amount_paid: invoice_data.amount_paid || 0,
      currency: invoice_data.currency || 'usd',
      status: invoice_data.status || 'paid',
      invoice_pdf: invoice_data.invoice_pdf || null,
      period_start: new Date((invoice_data.period_start || 0) * 1000),
      period_end: new Date((invoice_data.period_end || 0) * 1000),
      due_date: invoice_data.due_date ? new Date(invoice_data.due_date * 1000) : null,
      paid_at: new Date(),
    };
    
    if (existingInvoice.length > 0) {
      await db
        .update(invoice)
        .set({ ...invoiceValues, paid_at: new Date() })
        .where(eq(invoice.invoice_id, invoice_data.id));
    } else {
      await db.insert(invoice).values(invoiceValues);
    }
    
    // Log the event
    await logWebhookEvent(event, invoice_data.subscription as string);
    
    console.log(`Invoice payment succeeded: ${invoice_data.id}`);
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
    throw error;
  }
}

export async function handleInvoicePaymentFailed(event: Stripe.Event) {
  const invoice_data = event.data.object as Stripe.Invoice;
  
  console.log('Processing invoice payment failed:', invoice_data.id);
  
  try {
    if (!invoice_data.subscription) {
      console.log('Invoice not associated with subscription, skipping');
      return;
    }
    
    // Find subscription
    const existingSubscription = await db
      .select({ id: subscription.id })
      .from(subscription)
      .where(eq(subscription.subscription_id, invoice_data.subscription as string))
      .limit(1);
      
    if (existingSubscription.length === 0) {
      console.warn(`Subscription not found for invoice: ${invoice_data.subscription}`);
      return;
    }
    
    // Update or create invoice record with failed status
    const existingInvoice = await db
      .select()
      .from(invoice)
      .where(eq(invoice.invoice_id, invoice_data.id))
      .limit(1);
    
    const invoiceValues = {
      subscription_id: existingSubscription[0].id,
      invoice_id: invoice_data.id,
      amount_paid: 0, // No payment on failed
      currency: invoice_data.currency || 'usd',
      status: invoice_data.status || 'open',
      invoice_pdf: invoice_data.invoice_pdf || null,
      period_start: new Date((invoice_data.period_start || 0) * 1000),
      period_end: new Date((invoice_data.period_end || 0) * 1000),
      due_date: invoice_data.due_date ? new Date(invoice_data.due_date * 1000) : null,
      paid_at: null,
    };
    
    if (existingInvoice.length > 0) {
      await db
        .update(invoice)
        .set(invoiceValues)
        .where(eq(invoice.invoice_id, invoice_data.id));
    } else {
      await db.insert(invoice).values(invoiceValues);
    }
    
    // Log the event
    await logWebhookEvent(event, invoice_data.subscription as string);
    
    console.log(`Invoice payment failed: ${invoice_data.id}`);
  } catch (error) {
    console.error('Error handling invoice payment failed:', error);
    throw error;
  }
}