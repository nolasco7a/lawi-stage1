'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/hooks/useAuth';
import { getFromLocalStorage, removeFromLocalStorage } from '@/lib/utils';

interface ProductInfo {
  productId: string;
  priceId: string;
  name: string;
  price: string;
}

function CheckoutContent() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Verificar autenticacion y redirigir a producto especifico
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login?returnUrl=/checkout');
      return;
    }

    // Revisar si hay producto guardado en localStorage
    const savedProduct = getFromLocalStorage<ProductInfo>('selectedProduct');
    if (savedProduct) {
      // Redirigir segun el producto
      if (savedProduct.productId === 'prod_St0R4zF0Ollfv0') {
        router.push('/checkout/basic');
      } else if (savedProduct.productId === 'prod_St0StLkbd4CjKt') {
        router.push('/checkout/pro');
      } else {
        // Producto no reconocido, ir a planes
        removeFromLocalStorage('selectedProduct');
        router.push('/#planes');
      }
    } else {
      // No hay producto seleccionado, ir a planes
      router.push('/#planes');
    }
  }, [isAuthenticated, router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Redirigiendo...</CardTitle>
          <CardDescription>
            Te estamos llevando a tu plan seleccionado.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin" />
          <Button 
            variant="outline" 
            onClick={() => router.push('/#planes')}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a planes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  );
}