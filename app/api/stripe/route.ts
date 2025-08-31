import { NextResponse } from 'next/server'
import { headers } from 'next/headers'

import { stripe } from '@/lib/stripe/stripe'

export async function POST(request: Request) {
  try {
    const headersList = await headers()
    const origin = headersList.get('origin')
    
    // Parse request body to get product info
    const body = await request.json()
    const { 
      productId, 
      priceId, 
      productName = 'Plan LawyerVision',
      amount = 2000,
      currency = 'usd',
      userId,
      userEmail 
    } = body

    let sessionData: any = {
      ui_mode: 'embedded',
      mode: 'subscription', // Changed to subscription for recurring payments
      return_url: `${origin}/return?session_id={CHECKOUT_SESSION_ID}`,
    }

    // If we have a specific priceId, use it (for predefined products)
    if (priceId) {
      sessionData.line_items = [{
        price: priceId,
        quantity: 1,
      }]
    } else {
      // Fallback to creating price on the fly
      sessionData.line_items = [{
        price_data: {
          currency: currency,
          product_data: {
            name: productName,
          },
          unit_amount: amount,
          recurring: {
            interval: 'month',
          },
        },
        quantity: 1,
      }]
    }

    // Add customer info if available
    if (userEmail) {
      sessionData.customer_email = userEmail
    }

    // Add metadata for tracking
    sessionData.metadata = {
      userId: userId || 'anonymous',
      productId: productId || 'custom',
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create(sessionData);
    
    return NextResponse.json({ clientSecret: session.client_secret })
  } catch (err: any) {
    console.error('Stripe error:', err)
    return NextResponse.json(
      { error: err.message },
      { status: err.statusCode || 500 }
    )
  }
}