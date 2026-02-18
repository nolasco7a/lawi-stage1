import { MessageSquare } from "lucide-react";

interface ChatItemProps {
  title: string;
  date: string;
  isLast?: boolean;
}

export function ChatItem({ title, date, isLast = false }: ChatItemProps) {
  return (
    <div className={`flex items-center gap-3 px-5 py-4 ${!isLast ? "border-b border-border" : ""}`}>
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent/10">
        <MessageSquare className="size-4 text-accent" />
      </div>
      <div className="flex min-w-0 flex-col gap-1">
        <span className="truncate text-sm font-medium text-foreground">{title}</span>
        <span className="text-xs text-muted-foreground">{date}</span>
      </div>
    </div>
  );
}
