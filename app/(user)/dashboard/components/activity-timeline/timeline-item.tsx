import { cn } from "@/lib/utils";

interface TimelineItemProps {
  description: string;
  time: string;
  dotColor: string;
}

export function TimelineItem({ description, time, dotColor }: TimelineItemProps) {
  return (
    <div className="flex items-center gap-3 px-5 py-3">
      <div className={cn("size-2 shrink-0 rounded-sm", dotColor)} />
      <div className="flex w-full items-center justify-between">
        <span className="text-[13px] text-foreground">{description}</span>
        <span className="shrink-0 text-xs text-muted-foreground">{time}</span>
      </div>
    </div>
  );
}
