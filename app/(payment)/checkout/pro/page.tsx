"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/hooks/useAuth";
import { removeFromLocalStorage } from "@/lib/utils";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { Suspense, useEffect } from "react";

function ProCheckoutContent() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  // Verificar autenticacion y redirigir directamente a Stripe
  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login?returnUrl=/checkout/pro");
      return;
    }

    // Limpiar localStorage si existe producto guardado
    removeFromLocalStorage("selectedProduct");

    // Crear checkout session y redirigir automáticamente a Stripe
    const createCheckoutAndRedirect = async () => {
      try {
        const response = await fetch("/api/stripe/checkout-session", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId: "prod_St0StLkbd4CjKt",
            priceId: "price_1RxERB5aFd4VysYjfOZ00nT3",
            productName: "Lawi Pro",
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to create checkout session");
        }

        const { url } = await response.json();

        // Redirigir directamente a Stripe Checkout
        window.location.href = url;
      } catch (error) {
        console.error("Error creating checkout session:", error);
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
          <Button variant="ghost" onClick={() => router.push("/#planes")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a planes
          </Button>
          <h1 className="text-3xl font-bold">Lawi Pro</h1>
          <p className="text-muted-foreground">
            Plan completo con IA para maximizar tu productividad legal
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ProCheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <ProCheckoutContent />
    </Suspense>
  );
}
