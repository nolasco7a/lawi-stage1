import type { LucideIcon } from "lucide-react";
import { Briefcase, Info } from "lucide-react";

interface WelcomeBannerProps {
  message: string;
  variant?: "regular" | "lawyer";
}

const variantConfig: Record<"regular" | "lawyer", { icon: LucideIcon }> = {
  regular: { icon: Info },
  lawyer: { icon: Briefcase },
};

export function WelcomeBanner({ message, variant = "regular" }: WelcomeBannerProps) {
  const { icon: Icon } = variantConfig[variant];

  return (
    <div className="flex w-full items-center gap-3 rounded-lg bg-accent/10 px-6 py-4">
      <Icon className="size-[18px] shrink-0 text-accent" />
      <p className="text-[13px] text-foreground">{message}</p>
    </div>
  );
}
