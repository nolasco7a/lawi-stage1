"use client";

import { Button } from "@/components/ui/button";
import type { SecuritySettings } from "../types";

interface SecuritySectionProps {
  security: SecuritySettings;
}

export function SecuritySection({ security }: SecuritySectionProps) {
  return (
    <section id="cuenta" className="scroll-mt-20">
      <div className="rounded-lg border border-border bg-card shadow-sm">
        {/* Header */}
        <div className="border-b border-border px-6 pb-4 pt-6">
          <h2 className="text-lg font-semibold text-foreground">Seguridad de la cuenta</h2>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Gestiona tu contraseña y seguridad
          </p>
        </div>

        {/* Body */}
        <div className="space-y-5 p-6">
          {/* Password Row */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-foreground">Contraseña</p>
              <p className="text-xs text-muted-foreground">
                Última actualización: {security.lastPasswordUpdate}
              </p>
            </div>
            <Button variant="outline" className="h-9 text-[13px] font-medium">
              Cambiar contraseña
            </Button>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Delete Account Row */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <p className="text-sm font-medium text-destructive">Eliminar cuenta</p>
              <p className="text-xs text-muted-foreground">
                Esta acción es permanente y no se puede deshacer
              </p>
            </div>
            <Button
              variant="outline"
              className="h-9 border-destructive text-[13px] font-medium text-destructive hover:bg-destructive hover:text-destructive-foreground"
            >
              Eliminar cuenta
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
