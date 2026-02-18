import { PlanBadge } from "./plan-badge";

interface DashboardHeaderProps {
  name: string;
  memberSince: string;
  email?: string;
  planType: "Free" | "Pro";
  variant?: "regular" | "lawyer";
}

export function DashboardHeader({
  name,
  memberSince,
  email,
  planType,
  variant = "regular",
}: DashboardHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-[28px] font-semibold tracking-tight text-foreground">Hola, {name}</h1>
        <p className="text-sm text-muted-foreground">Miembro desde {memberSince}</p>
      </div>

      <div className="flex items-center gap-3">
        <PlanBadge planType={planType} variant={variant} />
        {email && <span className="text-[13px] text-muted-foreground">{email}</span>}
      </div>
    </div>
  );
}
