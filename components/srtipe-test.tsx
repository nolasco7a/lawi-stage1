'use client'

import { useState, useEffect, useCallback } from 'react'
import { loadStripe } from '@stripe/stripe-js'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '')

export default function StripeTest() {
  const [clientSecret, setClientSecret] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)

  const fetchClientSecret = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/stripe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 2000, // $20.00 in cents
          currency: 'usd',
          productName: 'Consulta Legal',
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to create checkout session')
      }

      const { clientSecret } = await response.json()
      setClientSecret(clientSecret)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const initializeCheckout = async () => {
      if (!clientSecret) return

      const stripe = await stripePromise
      if (!stripe) return

      const checkout = await stripe.initEmbeddedCheckout({
        clientSecret,
      })

      checkout.mount('#checkout')
    }

    initializeCheckout()
  }, [clientSecret])

  if (!clientSecret) {
    return (
      <div className="p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-bold mb-4">Consulta Legal</h2>
        <p className="text-gray-600 mb-4">Precio: $20.00 USD</p>
        <button
          type="button"
          onClick={fetchClientSecret}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Cargando...' : 'Pagar con Stripe'}
        </button>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <div id="checkout">
        {/* Stripe Embedded Checkout will be mounted here */}
      </div>
    </div>
  )
}