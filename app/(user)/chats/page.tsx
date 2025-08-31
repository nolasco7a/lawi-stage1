'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { toast } from 'sonner';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Search,
  MoreHorizontal,
  Trash,
  Edit,
  Share,
  Globe,
  Lock,
  CheckCircle,
  ClipboardCopy
} from 'lucide-react';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ActionDialog from '@/components/action-dialog';
import { CHAT_PAGE_SIZE, SEARCH_DEBOUNCE_DELAY } from '@/lib/constants';
import { useChatVisibility } from '@/hooks/use-chat-visibility';
import type { Chat } from '@/lib/db/schema';
import {copyToClipboard} from "@/lib/utils";

interface ChatsResponse {
  chats: Chat[];
  hasMore: boolean;
  currentPage: number;
}

function ChatCard ({ chat, onDelete, onRename }: { 
  chat: Chat; 
  onDelete: (chatId: string) => void; 
  onRename: (chatId: string, currentTitle: string) => void; 
}) {
  const { visibilityType, setVisibilityType } = useChatVisibility({
    chatId: chat.id,
    initialVisibilityType: chat.visibility,
  });

  return (
    <div className="w-full border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex justify-between items-start">
        <div className="flex-1 min-w-0">
          <Link
            href={`/chat/${chat.id}`}
            className="text-base md:text-lg font-medium hover:underline block truncate"
          >
            {chat.title}
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 mt-2 text-sm text-muted-foreground">
            <span>
              {formatDistanceToNow(new Date(chat.createdAt), { 
                addSuffix: true, 
                locale: es 
              })}
            </span>
            <div className="flex items-center gap-1">
              {visibilityType === 'public' ? (
                <>
                  <Globe size={14} />
                  <span>Público</span>
                  <div onClick={() => copyToClipboard(
                    `${window.location.origin}/chat/${chat.id}`,
                    toast
                  )}
                  className="flex flex-direction-row ml-4 gap-1 items-center cursor-pointer hover:underline"
                  >
                    <ClipboardCopy size={14} />
                    Copiar enlace
                  </div>
                </>
              ) : (
                <>
                  <Lock size={14} />
                  <span>Privado</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="ml-2">
              <MoreHorizontal size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onRename(chat.id, chat.title);
              }}
              className="cursor-pointer"
            >
              <Edit size={16} />
              <span>Renombrar</span>
            </DropdownMenuItem>
            
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer">
                <Share size={16} />
                <span>Compartir</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    className="cursor-pointer flex-row justify-between"
                    onClick={(e) => {
                      e.stopPropagation();
                      setVisibilityType('private');
                    }}
                  >
                    <div className="flex flex-row gap-2 items-center">
                      <Lock size={12} />
                      <span>Privado</span>
                    </div>
                    {visibilityType === 'private' && <CheckCircle size={16} />}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer flex-row justify-between"
                    onClick={(e) => {
                      e.stopPropagation();
                      setVisibilityType('public');
                    }}
                  >
                    <div className="flex flex-row gap-2 items-center">
                      <Globe size={12} />
                      <span>Público</span>
                    </div>
                    {visibilityType === 'public' && <CheckCircle size={16} />}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onDelete(chat.id);
              }}
              className="cursor-pointer text-destructive focus:bg-destructive/15 focus:text-destructive"
            >
              <Trash size={16} />
              <span>Borrar</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

export default function ChatsPage() {
  const { data: session } = useSession();
  const [chats, setChats] = useState<Chat[]>([]);
  const [allChats, setAllChats] = useState<Chat[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [totalChats, setTotalChats] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [renameId, setRenameId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      setCurrentPage(1);
    }, SEARCH_DEBOUNCE_DELAY);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch chats with infinite loading
  const fetchChats = useCallback(async (page: number, query: string, append = false) => {
    if (!session?.user?.id) return;

    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        ...(query && { query }),
      });

      const response = await fetch(`/api/chats?${params}`);
      const data: ChatsResponse & { totalChats: number } = await response.json();

      if (append) {
        setChats(prev => [...prev, ...data.chats]);
      } else {
        setChats(data.chats);
      }
      
      setHasMore(data.hasMore);
      setTotalChats(data.totalChats);
    } catch (error) {
      toast.error('Error al cargar los chats');
      console.error('Error fetching chats:', error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    setCurrentPage(1);
    void fetchChats(1, debouncedQuery, false);
  }, [debouncedQuery, fetchChats]);

  // Load more chats when reaching end
  const loadMoreChats = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = currentPage + 1;
      setCurrentPage(nextPage);
      void fetchChats(nextPage, debouncedQuery, true);
    }
  }, [loading, hasMore, currentPage, debouncedQuery, fetchChats]);

  // Infinite scroll handler
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    const threshold = 100; // Load more when 100px from bottom
    
    if (scrollHeight - scrollTop - clientHeight < threshold) {
      loadMoreChats();
    }
  }, [loadMoreChats]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      const response = await fetch(`/api/chat?id=${deleteId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Chat eliminado exitosamente');
        setCurrentPage(1);
        void fetchChats(1, debouncedQuery, false);
      } else {
        toast.error('Error al eliminar el chat');
      }
    } catch (error) {
      toast.error('Error al eliminar el chat');
      console.error('Error deleting chat:', error);
    }

    setShowDeleteDialog(false);
    setDeleteId(null);
  };

  const handleRename = async () => {
    if (!renameId || !newTitle.trim()) return;

    try {
      const response = await fetch('/api/chats', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId: renameId,
          title: newTitle.trim(),
        }),
      });

      if (response.ok) {
        toast.success('Chat renombrado exitosamente');
        setCurrentPage(1);
        void fetchChats(1, debouncedQuery, false);
      } else {
        toast.error('Error al renombrar el chat');
      }
    } catch (error) {
      toast.error('Error al renombrar el chat');
      console.error('Error renaming chat:', error);
    }

    setShowRenameDialog(false);
    setRenameId(null);
    setNewTitle('');
  };

  const openDeleteDialog = (chatId: string) => {
    setDeleteId(chatId);
    setShowDeleteDialog(true);
  };

  const openRenameDialog = (chatId: string, currentTitle: string) => {
    setRenameId(chatId);
    setNewTitle(currentTitle);
    setShowRenameDialog(true);
  };

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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
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
          Tienes {totalChats} chat{totalChats !== 1 ? 's' : ''} previos con LAWI
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
                {debouncedQuery ? 'No se encontraron chats' : 'No tienes chats aún'}
              </p>
            </div>
          ) : (
            <>
              {chats.map((chat) => (
                <ChatCard
                  key={chat.id}
                  chat={chat}
                  onDelete={openDeleteDialog}
                  onRename={openRenameDialog}
                />
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
                  <p className="text-sm text-muted-foreground">Has llegado al final de tu historial de chats</p>
                </div>
              )}
            </>
          )}
        </div>
      </ScrollArea>

      {/* Delete Dialog */}
      <ActionDialog
        openModal={showDeleteDialog}
        setOpenModal={setShowDeleteDialog}
        title="¿Estás seguro?"
        description="Esta acción no se puede deshacer. Esto eliminará permanentemente tu chat y lo removerá de nuestros servidores."
        action={handleDelete}
        actionText="Borrar"
        cancelText="Cancelar"
      />

      {/* Rename Dialog */}
      <ActionDialog
        openModal={showRenameDialog}
        setOpenModal={setShowRenameDialog}
        title="Renombrar Chat"
        description="Ingresa un nuevo nombre para tu chat."
        action={handleRename}
        actionText="Renombrar"
        cancelText="Cancelar"
        customContent={
          <Input
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Nuevo título del chat"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                void handleRename();
              }
            }}
          />
        }
      />
    </div>
  );
}