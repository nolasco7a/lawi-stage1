import { CircleCheck, Shield } from "lucide-react";

interface PlanBadgeProps {
  planType: "Free" | "Pro";
  variant?: "regular" | "lawyer";
}

export function PlanBadge({ planType, variant = "regular" }: PlanBadgeProps) {
  const Icon = variant === "lawyer" ? Shield : CircleCheck;

  return (
    <div className="flex items-center gap-1.5 rounded-full bg-accent/10 px-3.5 py-1.5">
      <Icon className="size-4 text-accent" />
      <span className="text-[13px] font-semibold text-accent">Plan {planType}</span>
    </div>
  );
}
