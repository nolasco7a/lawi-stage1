import { cn } from "@/lib/utils";
import { Briefcase } from "lucide-react";

interface CaseItemProps {
  title: string;
  date: string;
  status: "active" | "pending";
  isLast?: boolean;
}

const statusConfig = {
  active: {
    label: "Activo",
    textColor: "text-accent",
    bgColor: "bg-accent/10",
  },
  pending: {
    label: "Pendiente",
    textColor: "text-accent",
    bgColor: "bg-accent/10",
  },
} as const;

export function CaseItem({ title, date, status, isLast = false }: CaseItemProps) {
  const config = statusConfig[status];

  return (
    <div
      className={cn(
        "flex items-center justify-between px-[18px] py-3.5",
        !isLast && "border-b border-border",
      )}
    >
      <div className="flex items-center gap-2.5">
        <div className="flex size-8 items-center justify-center rounded-md bg-accent/10">
          <Briefcase className="size-3.5 text-accent" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-medium text-foreground">{title}</span>
          <span className="text-[11px] text-muted-foreground">{date}</span>
        </div>
      </div>
      <div className={cn("rounded-full px-2.5 py-1", config.bgColor)}>
        <span className={cn("text-[11px] font-medium", config.textColor)}>{config.label}</span>
      </div>
    </div>
  );
}
