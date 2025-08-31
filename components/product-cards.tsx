'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Check, X, Eye, Brain } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/hooks/useAuth';
import { setToLocalStorage } from '@/lib/utils';

interface ProductFeature {
  name: string;
  included: boolean;
}

interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: string;
  period: string;
  description: string;
  stripeProductId: string;
  stripePriceId: string;
  features: ProductFeature[];
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  popular: boolean;
}

const ProductCards = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  const products: Product[] = [
    {
      id: 'basic',
      name: 'LAWI BASIC',
      subtitle: 'Plan de Visibilidad',
      price: '$29',
      period: '/mes',
      description: 'Aumenta tu visibilidad y conecta con clientes potenciales',
      stripeProductId: 'prod_St0R4zF0Ollfv0',
      stripePriceId: 'price_1RxEQA5aFd4VysYjNRrZeeCU',
      features: [
        { name: 'Listado en directorio público', included: true },
        { name: 'Notificaciones por email', included: true },
        { name: 'Resúmenes básicos de casos', included: true },
        { name: 'Dashboard de configuración', included: true },
        { name: 'Estadísticas de visualizaciones', included: true },
        { name: 'Herramientas de IA', included: false },
        { name: 'Análisis avanzado de casos', included: false },
        { name: 'Generación de documentos', included: false }
      ],
      icon: Eye,
      color: 'from-blue-500 to-cyan-500',
      popular: false
    },
    {
      id: 'pro',
      name: 'LAWI PRO',
      subtitle: 'Plan Completo con IA',
      price: '$99',
      period: '/mes',
      description: 'Todas las herramientas de IA para maximizar tu productividad legal',
      stripeProductId: 'prod_St0StLkbd4CjKt',
      stripePriceId: 'price_1RxERB5aFd4VysYjfOZ00nT3',
      features: [
        { name: 'Todo del Plan Basic', included: true },
        { name: 'Suite completa de IA legal', included: true },
        { name: 'Análisis automático de casos', included: true },
        { name: 'Generación de documentos', included: true },
        { name: 'Investigación jurisprudencial', included: true },
        { name: 'Dashboard avanzado', included: true },
        { name: 'Predicción de resultados', included: true },
        { name: 'Soporte prioritario', included: true }
      ],
      icon: Brain,
      color: 'from-purple-500 to-pink-500',
      popular: true
    }
  ];

  const handlePurchase = async (product: Product) => {
    if (!isAuthenticated) {
      // Guardar el producto seleccionado en localStorage para redirigir después del login
      setToLocalStorage('selectedProduct', {
        productId: product.stripeProductId,
        priceId: product.stripePriceId,
        name: product.name,
        price: product.price
      });
      
      // Redirigir a login con returnUrl específico del producto
      router.push(`/login?returnUrl=/checkout/${product.id}`);
      return;
    }

    // Si está autenticado, crear checkout session y redirigir directamente a Stripe
    try {
      const response = await fetch('/api/stripe/checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productId: product.stripeProductId,
          priceId: product.stripePriceId,
          productName: product.name,
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
      // Fallback: ir a página de checkout local
      router.push(`/checkout/${product.id}`);
    }
  };

  return (
    <section className="py-12 md:py-16 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Elige tu Plan LAWI
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Desde visibilidad básica hasta herramientas de IA avanzadas. 
            Encuentra el plan perfecto para tu práctica legal.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6 md:gap-8 max-w-5xl mx-auto">
          {products.map((product) => {
            const IconComponent = product.icon;
            return (
              <Card
                key={product.id}
                className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${
                  product.popular ? 'ring-2 ring-purple-500' : ''
                }`}
              >
                {product.popular && (
                  <Badge className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    MÁS POPULAR
                  </Badge>
                )}
                
                {/* Header con gradiente */}
                <div className={`bg-gradient-to-r ${product.color} p-6 md:p-8 text-white`}>
                  <div className="flex items-center mb-4">
                    <IconComponent className="w-6 h-6 sm:w-8 sm:h-8 mr-3 flex-shrink-0" />
                    <div className="min-w-0">
                      <h3 className="text-xl sm:text-2xl font-bold truncate">{product.name}</h3>
                      <p className="opacity-90 text-sm sm:text-base">{product.subtitle}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-baseline mb-4">
                    <span className="text-3xl sm:text-4xl font-bold">{product.price}</span>
                    <span className="text-lg sm:text-xl opacity-75">{product.period}</span>
                  </div>
                  
                  <p className="opacity-90 text-sm sm:text-base">{product.description}</p>
                </div>
                
                {/* Features */}
                <CardContent className="p-6 md:p-8">
                  <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                    {product.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        {feature.included ? (
                          <Check className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 mr-3 flex-shrink-0 mt-0.5" />
                        ) : (
                          <X className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground mr-3 flex-shrink-0 mt-0.5" />
                        )}
                        <span className={`text-sm sm:text-base ${
                          feature.included ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {feature.name}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button
                    onClick={() => handlePurchase(product)}
                    className={`w-full text-base sm:text-lg font-semibold py-3 sm:py-4 ${
                      product.popular
                        ? 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
                        : 'bg-primary hover:bg-primary/90'
                    }`}
                  >
                    Probar ahora
                  </Button>
                  
                  {/* Datos para desarrollo */}
                  {process.env.NODE_ENV === 'development' && (
                    <div className="mt-4 p-3 bg-muted rounded-lg">
                      <h4 className="font-semibold text-xs text-muted-foreground mb-2">Datos para Stripe:</h4>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <div><strong>Product ID:</strong> {product.stripeProductId}</div>
                        <div><strong>Price ID:</strong> {product.stripePriceId}</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
        
        <div className="text-center mt-8 md:mt-12">
          <p className="text-muted-foreground mb-4">
            ¿Necesitas ayuda para decidir? 
          </p>
          <Button variant="link" className="text-accent hover:text-accent/80 font-semibold">
            Contacta con nuestro equipo →
          </Button>
        </div>
      </div>
    </section>
  );
};

export default ProductCards;