"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PanelLeft, Sun } from "lucide-react";
import type { PreferencesSettings } from "../types";

interface PreferencesSectionProps {
  preferences: PreferencesSettings;
}

export function PreferencesSection({ preferences }: PreferencesSectionProps) {
  return (
    <section id="preferencias" className="scroll-mt-20">
      <div className="rounded-lg border border-border bg-card shadow-sm">
        {/* Header */}
        <div className="border-b border-border px-6 pb-4 pt-6">
          <h2 className="text-lg font-semibold text-foreground">Preferencias</h2>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Personaliza la apariencia de la aplicación
          </p>
        </div>

        {/* Body */}
        <div className="space-y-5 p-6">
          {/* Theme Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sun className="size-5 text-muted-foreground" />
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">Tema de la aplicación</p>
                <p className="text-xs text-muted-foreground">
                  Selecciona el tema de tu preferencia
                </p>
              </div>
            </div>
            <Select defaultValue={preferences.theme}>
              <SelectTrigger className="h-9 w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Claro</SelectItem>
                <SelectItem value="dark">Oscuro</SelectItem>
                <SelectItem value="system">Sistema</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Sidebar Preference Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <PanelLeft className="size-5 text-muted-foreground" />
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">Sidebar siempre visible</p>
                <p className="text-xs text-muted-foreground">Mantener el panel lateral abierto</p>
              </div>
            </div>
            <Switch defaultChecked={!preferences.sidebarCollapsed} />
          </div>
        </div>
      </div>
    </section>
  );
}
