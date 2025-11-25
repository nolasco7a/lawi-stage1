"use client";

import { useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import ChatCard from "@/components/chat-card";
import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/lib/store/chat";

export default function ChatsPage() {
  const { data: session } = useSession();
  const {
    chats,
    searchQuery,
    debouncedQuery,
    hasMore,
    loading,
    totalChats,
    setSearchQuery,
    loadMoreChats,
    refreshChats,
  } = useChatStore();

  // Initialize chats when session is available
  useEffect(() => {
    if (session?.user?.id) {
      refreshChats();
    }
  }, [session?.user?.id, refreshChats, chats.length]);

  // Infinite scroll handler
  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      const threshold = 100; // Load more when 100px from bottom

      if (scrollHeight - scrollTop - clientHeight < threshold) {
        loadMoreChats();
      }
    },
    [loadMoreChats],
  );

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Inicia sesión para ver tu historial de chats</p>
      </div>
    );
  }

  return (
    <div className="w-7/12 self-center p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold">Historial de Chats</h1>
      </div>

      {/* Search Input */}
      <div className="w-full">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            size={20}
          />
          <Input
            placeholder="Buscar chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10"
          />
        </div>
      </div>

      {/* Chat Count */}
      {totalChats > 0 && (
        <div className="text-sm text-muted-foreground">
          Tienes {totalChats} chat{totalChats !== 1 ? "s" : ""} previos con LAWI
        </div>
      )}

      {/* Scroll Area with Chats */}
      <ScrollArea
        // className="w-full"
        onScrollCapture={handleScroll}
      >
        <div className="space-y-4">
          {loading && chats.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">Cargando chats...</p>
            </div>
          ) : chats.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">
                {debouncedQuery ? "No se encontraron chats" : "No tienes chats aún"}
              </p>
            </div>
          ) : (
            <>
              {chats.map((chat) => (
                <ChatCard key={chat.id} chat={chat} />
              ))}

              {/* Loading indicator for infinite scroll */}
              {loading && chats.length > 0 && (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">Cargando más chats...</p>
                </div>
              )}

              {/* End indicator */}
              {!hasMore && chats.length > 0 && (
                <div className="text-center py-4">
                  <p className="text-sm text-muted-foreground">
                    Has llegado al final de tu historial de chats
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
