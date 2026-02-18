"use client";

import { Bell, Briefcase, CreditCard, Settings as SettingsIcon, Shield, User } from "lucide-react";

interface SettingsNavProps {
  isLawyer?: boolean;
}

const navItems = [
  { id: "perfil", label: "Perfil", icon: User },
  { id: "cuenta", label: "Cuenta", icon: Shield },
  { id: "suscripcion", label: "Suscripción", icon: CreditCard },
  { id: "preferencias", label: "Preferencias", icon: SettingsIcon },
  { id: "notificaciones", label: "Notificaciones", icon: Bell },
];

const lawyerNavItems = [
  { id: "perfil", label: "Perfil", icon: User },
  { id: "profesional", label: "Profesional", icon: Briefcase },
  { id: "cuenta", label: "Cuenta", icon: Shield },
  { id: "suscripcion", label: "Suscripción", icon: CreditCard },
  { id: "preferencias", label: "Preferencias", icon: SettingsIcon },
  { id: "notificaciones", label: "Notificaciones", icon: Bell },
];

export function SettingsNav({ isLawyer = false }: SettingsNavProps) {
  const items = isLawyer ? lawyerNavItems : navItems;

  const handleClick = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const elementPosition = element.offsetTop - offset;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <nav className="sticky top-10 self-start flex w-[220px] flex-col gap-1">
      {items.map((item) => {
        const Icon = item.icon;

        return (
          <button
            type="button"
            key={item.id}
            onClick={() => handleClick(item.id)}
            className="flex items-center gap-2.5 rounded-md px-3.5 py-2.5 text-sm font-normal text-muted-foreground transition-colors hover:bg-accent/5 hover:text-foreground"
          >
            <Icon className="size-4" />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
