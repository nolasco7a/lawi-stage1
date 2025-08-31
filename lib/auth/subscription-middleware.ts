import { NextRequest, NextResponse } from 'next/server';
import { getUserActiveSubscription, hasActivePlan } from '@/lib/db/subscription-queries';

export interface SubscriptionCheck {
  hasSubscription: boolean;
  planType?: 'basic' | 'pro';
  subscriptionId?: string;
  isExpired?: boolean;
}

// Check if user has active subscription
export async function checkUserSubscription(userId: string): Promise<SubscriptionCheck> {
  try {
    const activeSubscription = await getUserActiveSubscription(userId);
    
    if (!activeSubscription) {
      return { hasSubscription: false };
    }
    
    // Check if subscription is expired
    const now = new Date();
    const isExpired = now > activeSubscription.current_period_end;
    
    return {
      hasSubscription: true,
      planType: activeSubscription.plan_type,
      subscriptionId: activeSubscription.subscription_id,
      isExpired,
    };
  } catch (error) {
    console.error('Error checking user subscription:', error);
    return { hasSubscription: false };
  }
}

// Middleware to protect routes that require subscription
export async function requireSubscription(
  userId: string,
  requiredPlan?: 'basic' | 'pro'
): Promise<{ allowed: boolean; reason?: string }> {
  try {
    const subscriptionCheck = await checkUserSubscription(userId);
    
    if (!subscriptionCheck.hasSubscription) {
      return {
        allowed: false,
        reason: 'No active subscription found'
      };
    }
    
    if (subscriptionCheck.isExpired) {
      return {
        allowed: false,
        reason: 'Subscription has expired'
      };
    }
    
    // If specific plan is required
    if (requiredPlan) {
      const hasRequiredPlan = await hasActivePlan(userId, requiredPlan);
      if (!hasRequiredPlan) {
        return {
          allowed: false,
          reason: `${requiredPlan.toUpperCase()} plan required`
        };
      }
    }
    
    return { allowed: true };
  } catch (error) {
    console.error('Error in subscription middleware:', error);
    return {
      allowed: false,
      reason: 'Subscription check failed'
    };
  }
}

// Features available per plan
export const PLAN_FEATURES = {
  basic: [
    'directory_listing',
    'email_notifications', 
    'basic_case_summaries',
    'configuration_dashboard',
    'view_statistics'
  ],
  pro: [
    'directory_listing',
    'email_notifications',
    'basic_case_summaries', 
    'configuration_dashboard',
    'view_statistics',
    'ai_legal_suite',
    'automatic_case_analysis',
    'document_generation',
    'jurisprudential_research',
    'advanced_dashboard',
    'result_prediction',
    'priority_support'
  ]
} as const;

export type FeatureName = typeof PLAN_FEATURES.basic[number] | typeof PLAN_FEATURES.pro[number];

// Check if user has access to specific feature
export async function hasFeatureAccess(
  userId: string, 
  feature: FeatureName
): Promise<boolean> {
  try {
    const subscriptionCheck = await checkUserSubscription(userId);
    
    if (!subscriptionCheck.hasSubscription || subscriptionCheck.isExpired) {
      return false;
    }
    
    const userPlan = subscriptionCheck.planType!;
    const availableFeatures = PLAN_FEATURES[userPlan];
    
    return availableFeatures.includes(feature as any);
  } catch (error) {
    console.error('Error checking feature access:', error);
    return false;
  }
}

// Subscription status for UI components
export interface SubscriptionStatus {
  isActive: boolean;
  planType?: 'basic' | 'pro';
  daysUntilExpiry?: number;
  cancelAtPeriodEnd?: boolean;
  nextBillingDate?: Date;
  features: FeatureName[];
}

export async function getSubscriptionStatus(userId: string): Promise<SubscriptionStatus> {
  try {
    const activeSubscription = await getUserActiveSubscription(userId);
    
    if (!activeSubscription) {
      return {
        isActive: false,
        features: []
      };
    }
    
    const now = new Date();
    const daysUntilExpiry = Math.ceil(
      (activeSubscription.current_period_end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );
    
    return {
      isActive: activeSubscription.status === 'active',
      planType: activeSubscription.plan_type,
      daysUntilExpiry,
      cancelAtPeriodEnd: activeSubscription.cancel_at_period_end,
      nextBillingDate: activeSubscription.current_period_end,
      features: PLAN_FEATURES[activeSubscription.plan_type]
    };
  } catch (error) {
    console.error('Error getting subscription status:', error);
    return {
      isActive: false,
      features: []
    };
  }
}