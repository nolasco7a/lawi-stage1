"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countries, guatemalaDepartments } from "../mock-data";
import type { SettingsUser } from "../types";

interface PersonalInfoSectionProps {
  user: SettingsUser;
}

export function PersonalInfoSection({ user }: PersonalInfoSectionProps) {
  return (
    <section id="perfil" className="scroll-mt-20">
      <div className="rounded-lg border border-border bg-card shadow-sm">
        {/* Header */}
        <div className="border-b border-border px-6 pb-4 pt-6">
          <h2 className="text-lg font-semibold text-foreground">Información personal</h2>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Actualiza tu información de perfil y datos de contacto
          </p>
        </div>

        {/* Body */}
        <div className="space-y-5 p-6">
          {/* Nombre y Apellido */}
          <div className="flex gap-4">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="firstName" className="text-[13px] font-medium">
                Nombre
              </Label>
              <Input id="firstName" defaultValue={user.firstName} className="h-10" />
            </div>
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="lastName" className="text-[13px] font-medium">
                Apellido
              </Label>
              <Input id="lastName" defaultValue={user.lastName} className="h-10" />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-[13px] font-medium">
              Correo electrónico
            </Label>
            <Input
              id="email"
              type="email"
              defaultValue={user.email}
              disabled
              className="h-10 bg-muted"
            />
            <p className="text-xs text-muted-foreground">El correo no puede ser modificado</p>
          </div>

          {/* Teléfono */}
          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-[13px] font-medium">
              Teléfono
            </Label>
            <Input id="phone" defaultValue={user.phone} className="h-10" />
          </div>

          {/* País y Departamento */}
          <div className="flex gap-4">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="country" className="text-[13px] font-medium">
                País
              </Label>
              <Select defaultValue="guatemala">
                <SelectTrigger id="country" className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {countries.map((country) => (
                    <SelectItem key={country.value} value={country.value}>
                      {country.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="department" className="text-[13px] font-medium">
                Departamento
              </Label>
              <Select defaultValue="guatemala">
                <SelectTrigger id="department" className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {guatemalaDepartments.map((dept) => (
                    <SelectItem key={dept.value} value={dept.value}>
                      {dept.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-border px-6 py-4">
          <Button variant="outline" className="h-9 text-[13px]">
            Cancelar
          </Button>
          <Button className="h-9 bg-blue-600 text-[13px] font-semibold hover:bg-blue-700">
            Guardar cambios
          </Button>
        </div>
      </div>
    </section>
  );
}
