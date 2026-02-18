"use client";

import { Button } from "@/components/ui/button";
import { CircleCheck, Crown, Receipt } from "lucide-react";
import type { SubscriptionInfo } from "../types";

interface SubscriptionSectionProps {
  subscription: SubscriptionInfo;
}

export function SubscriptionSection({ subscription }: SubscriptionSectionProps) {
  const isPro = subscription.plan === "Pro";

  return (
    <section id="suscripcion" className="scroll-mt-20">
      <div className="rounded-lg border border-border bg-card shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 pb-4 pt-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Suscripción</h2>
            <p className="mt-1 text-[13px] text-muted-foreground">Gestiona tu plan y facturación</p>
          </div>
          {isPro && (
            <div className="flex items-center gap-1.5 rounded-full bg-violet-100 px-3.5 py-1.5 dark:bg-violet-950">
              <Crown className="size-3.5 text-violet-600 dark:text-violet-400" />
              <span className="text-xs font-semibold text-violet-600 dark:text-violet-400">
                Plan Pro
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="flex gap-6">
            <div className="flex-1 space-y-1">
              <p className="text-xs text-muted-foreground">Plan actual</p>
              <p className="text-sm font-semibold text-foreground">
                {subscription.plan} - {subscription.price}
              </p>
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-xs text-muted-foreground">Próxima facturación</p>
              <p className="text-sm font-semibold text-foreground">
                {subscription.nextBillingDate}
              </p>
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-xs text-muted-foreground">Estado</p>
              <div className="flex items-center gap-1 rounded-xl bg-green-100 px-2.5 py-1 dark:bg-green-950">
                <CircleCheck className="size-3 text-green-600 dark:text-green-400" />
                <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                  Activo
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-border px-6 py-4">
          <Button variant="outline" className="h-9 gap-1.5 text-[13px] font-medium">
            <Receipt className="size-3.5" />
            Ver facturas
          </Button>
          <Button
            variant="ghost"
            className="h-9 text-[13px] font-medium text-destructive hover:bg-destructive/10 hover:text-destructive"
          >
            Cancelar suscripción
          </Button>
        </div>
      </div>
    </section>
  );
}
