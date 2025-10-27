"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2, ArrowRight } from "lucide-react";

function SuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessionData, setSessionData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const sessionId = searchParams.get("session_id");

    if (!sessionId) {
      // No hay session ID, redirigir a home
      router.push("/");
      return;
    }

    // Verificar el estado de la sesión con Stripe
    const verifySession = async () => {
      try {
        const response = await fetch(`/api/stripe/verify-session?session_id=${sessionId}`);

        if (response.ok) {
          const data = await response.json();
          setSessionData(data);
        } else {
          console.error("Failed to verify session");
        }
      } catch (error) {
        console.error("Error verifying session:", error);
      } finally {
        setLoading(false);
      }
    };

    verifySession();
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl">¡Suscripción exitosa!</CardTitle>
          <CardDescription>
            Te has suscrito exitosamente a {sessionData?.metadata?.productName || "Lawi"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center space-y-2">
            <p className="text-sm text-muted-foreground">
              Número de sesión:{" "}
              <code className="text-xs">{searchParams.get("session_id")?.slice(-8)}</code>
            </p>
            <p className="text-sm text-muted-foreground">
              Recibirás un email de confirmación en breve.
            </p>
          </div>

          <div className="space-y-2">
            <Button onClick={() => router.push("/chat")} className="w-full">
              Ir al Dashboard
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <Button variant="outline" onClick={() => router.push("/")} className="w-full">
              Volver al inicio
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
