import { create } from 'zustand';
import { toast } from 'sonner';
import type { Chat } from '@/lib/db/schema';
import { CHAT_PAGE_SIZE, SEARCH_DEBOUNCE_DELAY } from '@/lib/constants';

interface ChatsResponse {
  chats: Chat[];
  hasMore: boolean;
  currentPage: number;
  totalChats: number;
}

interface ChatStore {
  // State
  chats: Chat[];
  searchQuery: string;
  debouncedQuery: string;
  currentPage: number;
  hasMore: boolean;
  loading: boolean;
  totalChats: number;
  
  // Actions
  setSearchQuery: (query: string) => void;
  setDebouncedQuery: (query: string) => void;
  setCurrentPage: (page: number) => void;
  setLoading: (loading: boolean) => void;
  fetchChats: (page: number, query: string, append?: boolean) => Promise<void>;
  loadMoreChats: () => void;
  deleteChat: (chatId: string) => Promise<void>;
  renameChat: (chatId: string, newTitle: string) => Promise<void>;
  refreshChats: () => void;
  
  // Debounce timer
  debounceTimer: NodeJS.Timeout | null;
}

export const useChatStore = create<ChatStore>((set, get) => ({
  // Initial state
  chats: [],
  searchQuery: '',
  debouncedQuery: '',
  currentPage: 1,
  hasMore: false,
  loading: false,
  totalChats: 0,
  debounceTimer: null,

  // Actions
  setSearchQuery: (query: string) => {
    const { debounceTimer } = get();
    
    // Clear existing timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }
    
    set({ searchQuery: query });
    
    // Set new debounced timer
    const newTimer = setTimeout(() => {
      get().setDebouncedQuery(query);
      get().setCurrentPage(1);
    }, SEARCH_DEBOUNCE_DELAY);
    
    set({ debounceTimer: newTimer });
  },

  setDebouncedQuery: (query: string) => {
    set({ debouncedQuery: query });
    // Fetch chats when debounced query changes
    get().fetchChats(1, query, false);
  },

  setCurrentPage: (page: number) => set({ currentPage: page }),
  
  setLoading: (loading: boolean) => set({ loading }),

  fetchChats: async (page: number, query: string, append = false) => {
    const { loading } = get();
    if (loading) return;

    set({ loading: true });
    
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        ...(query && { query }),
      });

      const response = await fetch(`/api/chats?${params}`);
      const data: ChatsResponse = await response.json();

      set((state) => ({
        chats: append ? [...state.chats, ...data.chats] : data.chats,
        hasMore: data.hasMore,
        totalChats: data.totalChats,
      }));
    } catch (error) {
      toast.error('Error al cargar los chats');
      console.error('Error fetching chats:', error);
    } finally {
      set({ loading: false });
    }
  },

  loadMoreChats: () => {
    const { loading, hasMore, currentPage, debouncedQuery } = get();
    
    if (!loading && hasMore) {
      const nextPage = currentPage + 1;
      set({ currentPage: nextPage });
      get().fetchChats(nextPage, debouncedQuery, true);
    }
  },

  deleteChat: async (chatId: string) => {
    try {
      const response = await fetch(`/api/chat?id=${chatId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        // Remove chat from local state
        set((state) => ({
          chats: state.chats.filter(chat => chat.id !== chatId),
          totalChats: state.totalChats - 1,
        }));
        
        toast.success('Chat eliminado exitosamente');
        return Promise.resolve();
      } else {
        toast.error('Error al eliminar el chat');
        return Promise.reject(new Error('Failed to delete chat'));
      }
    } catch (error) {
      toast.error('Error al eliminar el chat');
      console.error('Error deleting chat:', error);
      return Promise.reject(error);
    }
  },

  renameChat: async (chatId: string, newTitle: string) => {
    if (!newTitle.trim()) {
      toast.error('El título no puede estar vacío');
      return Promise.reject(new Error('Title cannot be empty'));
    }

    try {
      const response = await fetch('/api/chats', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chatId,
          title: newTitle.trim(),
        }),
      });

      if (response.ok) {
        // Update chat in local state
        set((state) => ({
          chats: state.chats.map(chat => 
            chat.id === chatId 
              ? { ...chat, title: newTitle.trim() }
              : chat
          ),
        }));
        
        toast.success('Chat renombrado exitosamente');
        return Promise.resolve();
      } else {
        toast.error('Error al renombrar el chat');
        return Promise.reject(new Error('Failed to rename chat'));
      }
    } catch (error) {
      toast.error('Error al renombrar el chat');
      console.error('Error renaming chat:', error);
      return Promise.reject(error);
    }
  },

  refreshChats: () => {
    const { debouncedQuery } = get();
    get().fetchChats(1, debouncedQuery, false);
  },
}));