import type { QuickActionData } from "../../types";
import { QuickActionButton } from "./quick-action-button";

interface QuickActionsProps {
  actions: QuickActionData[];
}

export function QuickActions({ actions }: QuickActionsProps) {
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold text-foreground">Accesos rápidos</h2>
      <div className="flex flex-wrap gap-3">
        {actions.map((action) => (
          <QuickActionButton
            key={action.label}
            icon={action.icon}
            label={action.label}
            href={action.href}
            variant={action.variant}
          />
        ))}
      </div>
    </section>
  );
}
