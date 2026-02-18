import { Zap } from "lucide-react";
import Link from "next/link";

interface UpgradeBannerProps {
  title?: string;
  description?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export function UpgradeBanner({
  title = "Mejora tu plan",
  description = "Obtén más funciones y almacenamiento ilimitado",
  ctaLabel = "Upgrade to Pro",
  ctaHref = "/settings",
}: UpgradeBannerProps) {
  return (
    <div className="flex w-full items-center justify-between rounded-lg bg-accent/10 px-6 py-5">
      <div className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-md bg-accent/10">
          <Zap className="size-5 text-accent" />
        </div>
        <div className="flex flex-col gap-0.5">
          <span className="text-[15px] font-semibold text-orange-600">{title}</span>
          <span className="text-[13px] text-muted-foreground">{description}</span>
        </div>
      </div>
      <Link
        href={ctaHref}
        className="rounded-lg bg-orange-600 px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-orange-700"
      >
        {ctaLabel}
      </Link>
    </div>
  );
}
