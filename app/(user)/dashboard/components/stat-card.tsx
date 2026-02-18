import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  iconColor: string;
  iconBgColor: string;
}

export function StatCard({ icon: Icon, value, label, iconColor, iconBgColor }: StatCardProps) {
  const isTextValue = typeof value === "string";

  return (
    <div className="flex w-full flex-col gap-3 rounded-lg border border-border bg-card p-5 shadow-sm">
      <div className={cn("flex size-9 items-center justify-center rounded-md", iconBgColor)}>
        <Icon className={cn("size-4", iconColor)} />
      </div>
      <span
        className={cn(
          "text-[32px] font-semibold leading-none tracking-tight text-foreground",
          isTextValue && "text-violet-600",
        )}
      >
        {value}
      </span>
      <span className="text-[13px] text-muted-foreground">{label}</span>
    </div>
  );
}
