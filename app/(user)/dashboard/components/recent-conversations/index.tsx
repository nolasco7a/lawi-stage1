import type { ChatItemData } from "../../types";
import { SectionHeader } from "../section-header";
import { ChatItem } from "./chat-item";

interface RecentConversationsProps {
  chats: ChatItemData[];
  viewAllHref?: string;
}

export function RecentConversations({ chats, viewAllHref = "/chats" }: RecentConversationsProps) {
  return (
    <section className="flex flex-col gap-4">
      <SectionHeader title="Últimas conversaciones" viewAllHref={viewAllHref} />
      <div className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
        {chats.map((chat, index) => (
          <ChatItem
            key={chat.id}
            title={chat.title}
            date={chat.date}
            isLast={index === chats.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
