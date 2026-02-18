"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CircleCheck, Globe } from "lucide-react";
import type { ProfessionalProfile } from "../types";

interface ProfessionalProfileSectionProps {
  profile: ProfessionalProfile;
}

export function ProfessionalProfileSection({ profile }: ProfessionalProfileSectionProps) {
  return (
    <section id="profesional" className="scroll-mt-20">
      <div className="rounded-lg border border-border bg-card shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-6 pb-4 pt-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Perfil profesional</h2>
            <p className="mt-1 text-[13px] text-muted-foreground">
              Información de tu credencial y práctica legal
            </p>
          </div>
          {profile.isVerified && (
            <div className="flex items-center gap-1.5 rounded-full bg-green-100 px-3.5 py-1.5 dark:bg-green-950">
              <CircleCheck className="size-3.5 text-green-600 dark:text-green-400" />
              <span className="text-xs font-semibold text-green-600 dark:text-green-400">
                Verificado
              </span>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="space-y-5 p-6">
          {/* Credenciales Row */}
          <div className="flex gap-4">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="collegiateNumber" className="text-[13px] font-medium">
                No. de colegiado
              </Label>
              <Input
                id="collegiateNumber"
                defaultValue={profile.collegiateNumber}
                disabled
                className="h-10 bg-muted"
              />
              <p className="text-xs text-muted-foreground">Este campo es de solo lectura</p>
            </div>
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="nationalId" className="text-[13px] font-medium">
                DPI / Identificación nacional
              </Label>
              <Input
                id="nationalId"
                defaultValue={profile.nationalId}
                disabled
                className="h-10 bg-muted"
              />
              <p className="text-xs text-muted-foreground">Este campo es de solo lectura</p>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-border" />

          {/* Directory Visibility Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="size-5 text-muted-foreground" />
              <div className="space-y-0.5">
                <p className="text-sm font-medium text-foreground">Visible en directorio público</p>
                <p className="text-xs text-muted-foreground">
                  Permitir que otros usuarios te encuentren en el directorio
                </p>
              </div>
            </div>
            <Switch defaultChecked={profile.visibleInDirectory} />
          </div>
        </div>
      </div>
    </section>
  );
}
