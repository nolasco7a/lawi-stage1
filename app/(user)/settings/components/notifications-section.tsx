"use client";

import { Switch } from "@/components/ui/switch";
import { Mail } from "lucide-react";
import type { PreferencesSettings } from "../types";

interface NotificationsSectionProps {
  preferences: PreferencesSettings;
}

export function NotificationsSection({ preferences }: NotificationsSectionProps) {
  return (
    <section id="notificaciones" className="scroll-mt-20">
      <div className="rounded-lg border border-border bg-card shadow-sm">
        {/* Header */}
        <div className="border-b border-border px-6 pb-4 pt-6">
          <h2 className="text-lg font-semibold text-foreground">Notificaciones</h2>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Gestiona tus preferencias de notificaciones
          </p>
        </div>

        {/* Body */}
        <div className="space-y-5 p-6">
          {/* Email Notifications Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="size-5 text-muted-foreground" />
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">Notificaciones por correo</p>
                <p className="text-xs text-muted-foreground">
                  Recibe actualizaciones y alertas por email
                </p>
              </div>
            </div>
            <Switch defaultChecked={preferences.emailNotifications} />
          </div>
        </div>
      </div>
    </section>
  );
}
