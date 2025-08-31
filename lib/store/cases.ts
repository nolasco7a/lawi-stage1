import { create } from 'zustand';
import { toast } from 'sonner';
import type { Case, Chat, CaseFile } from '@/lib/db/schema';

interface CasesResponse {
  cases: Case[];
  hasMore: boolean;
  currentPage: number;
  totalCases: number;
}

interface CaseDetailsResponse {
  case: Case;
  chats: Chat[];
  files: CaseFile[];
}

interface CaseStore {
  // State
  cases: (Case & { chatCount?: number })[];
  loading: boolean;
  totalCases: number;
  
  // Current case details
  currentCase: Case | null;
  currentChats: Chat[];
  currentFiles: CaseFile[];
  caseLoading: boolean;
  
  // Actions
  setLoading: (loading: boolean) => void;
  setCaseLoading: (loading: boolean) => void;
  fetchCases: () => Promise<void>;
  createCase: (title: string, description?: string) => Promise<string | null>;
  updateCase: (id: string, title: string, description?: string) => Promise<void>;
  deleteCase: (id: string) => Promise<void>;
  
  // Case details actions
  fetchCaseDetails: (id: string) => Promise<void>;
  refreshCaseDetails: () => void;
  
  // Current case ID for refreshing
  currentCaseId: string | null;
}

export const useCaseStore = create<CaseStore>((set, get) => ({
  // Initial state
  cases: [],
  loading: false,
  totalCases: 0,
  currentCase: null,
  currentChats: [],
  currentFiles: [],
  caseLoading: false,
  currentCaseId: null,

  // Actions
  setLoading: (loading: boolean) => set({ loading }),
  setCaseLoading: (loading: boolean) => set({ caseLoading: loading }),

  fetchCases: async () => {
    set({ loading: true });
    
    try {
      const response = await fetch('/api/cases');
      const data: CasesResponse = await response.json();

      set({
        cases: data.cases,
        totalCases: data.totalCases,
      });
    } catch (error) {
      toast.error('Error al cargar los casos');
      console.error('Error fetching cases:', error);
    } finally {
      set({ loading: false });
    }
  },

  createCase: async (title: string, description?: string) => {
    try {
      const response = await fetch('/api/cases', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description?.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success('Caso creado exitosamente');
        // Refresh cases list
        get().fetchCases();
        return data.case.id;
      } else {
        toast.error('Error al crear el caso');
        return null;
      }
    } catch (error) {
      toast.error('Error al crear el caso');
      console.error('Error creating case:', error);
      return null;
    }
  },

  updateCase: async (id: string, title: string, description?: string) => {
    try {
      const response = await fetch(`/api/cases/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description?.trim() || undefined,
        }),
      });

      if (response.ok) {
        toast.success('Caso actualizado exitosamente');
        
        // Update case in local state
        set((state) => ({
          cases: state.cases.map(c => 
            c.id === id 
              ? { ...c, title: title.trim(), description: description?.trim() }
              : c
          ),
          // Also update current case if it's the same
          currentCase: state.currentCase?.id === id 
            ? { ...state.currentCase, title: title.trim(), description: description?.trim() }
            : state.currentCase,
        }));
      } else {
        toast.error('Error al actualizar el caso');
      }
    } catch (error) {
      toast.error('Error al actualizar el caso');
      console.error('Error updating case:', error);
    }
  },

  deleteCase: async (id: string) => {
    try {
      const response = await fetch(`/api/cases/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Caso eliminado exitosamente');
        
        // Remove case from local state
        set((state) => ({
          cases: state.cases.filter(c => c.id !== id),
          totalCases: state.totalCases - 1,
        }));
      } else {
        toast.error('Error al eliminar el caso');
      }
    } catch (error) {
      toast.error('Error al eliminar el caso');
      console.error('Error deleting case:', error);
    }
  },

  fetchCaseDetails: async (id: string) => {
    set({ caseLoading: true, currentCaseId: id });
    
    try {
      const response = await fetch(`/api/cases/${id}`);
      
      if (response.status === 404) {
        toast.error('Caso no encontrado');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch case details');
      }

      const data: CaseDetailsResponse = await response.json();
      
      set({
        currentCase: data.case,
        currentChats: data.chats,
        currentFiles: data.files,
      });
    } catch (error) {
      toast.error('Error al cargar el caso');
      console.error('Error fetching case details:', error);
    } finally {
      set({ caseLoading: false });
    }
  },

  refreshCaseDetails: () => {
    const { currentCaseId } = get();
    if (currentCaseId) {
      get().fetchCaseDetails(currentCaseId);
    }
  },
}));