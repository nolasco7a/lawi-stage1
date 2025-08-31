'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { removeFromLocalStorage } from '@/lib/utils';

function BasicCheckoutContent() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Verificar autenticacion y redirigir directamente a Stripe
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?returnUrl=/checkout/basic');
      return;
    }
    
    // Limpiar localStorage si existe producto guardado
    removeFromLocalStorage('selectedProduct');
    
    // Crear checkout session y redirigir automáticamente a Stripe
    const createCheckoutAndRedirect = async () => {
      try {
        const response = await fetch('/api/stripe/checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            productId: 'prod_St0R4zF0Ollfv0',
            priceId: 'price_1RxEQA5aFd4VysYjNRrZeeCU',
            productName: 'Lawi Basic',
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to create checkout session');
        }

        const { url } = await response.json();
        
        // Redirigir directamente a Stripe Checkout
        window.location.href = url;
      } catch (error) {
        console.error('Error creating checkout session:', error);
        // Si falla, mostrar la página con Pricing Table como fallback
      }
    };

    createCheckoutAndRedirect();
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto p-4">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/#planes')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a planes
          </Button>
          <h1 className="text-3xl font-bold">Lawi Vision Basic</h1>
          <p className="text-muted-foreground">
            Plan de visibilidad para hacer crecer tu practica legal
          </p>
        </div>
        
        {/* Stripe Pricing Table para Basic */}
        <div className="flex justify-center">
          <script async src="https://js.stripe.com/v3/pricing-table.js"></script>
          <stripe-pricing-table 
            pricing-table-id="prctbl_1RxEb35aFd4VysYjQCVtbihk"
            publishable-key="pk_test_51RwSs15aFd4VysYjJLIUjQ4eG6uFeBnkzTU3xIp5acEY7MIIl5kW9mTQzjBi4xW06Tp0GcwfHY8zIP2rUoOmDArT00AdJ0wyqu">
          </stripe-pricing-table>
        </div>
      </div>
    </div>
  );
}

export default function BasicCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    }>
      <BasicCheckoutContent />
    </Suspense>
  );
}