import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface QuickActionButtonProps {
  icon: LucideIcon;
  label: string;
  href: string;
  variant: "primary" | "outline";
}

export function QuickActionButton({ icon: Icon, label, href, variant }: QuickActionButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md px-5 py-3 text-sm font-medium transition-colors",
        variant === "primary" && "bg-accent text-accent-foreground hover:bg-accent/90",
        variant === "outline" &&
          "border border-border bg-card text-card-foreground hover:bg-secondary",
      )}
    >
      <Icon className="size-4" />
      {label}
    </Link>
  );
}
