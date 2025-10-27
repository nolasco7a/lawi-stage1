"use client";

import { create } from "zustand";
import { toast } from "sonner";

interface ISelectedDocument {
  id: string;
  title: string;
  kind: string;
  content?: string;
  fileUrl?: string;
}

interface DocumentStore {
  // state
  documentsLoading: boolean;
  documents: any[];
  selectedDocument?: ISelectedDocument | null;

  //   actions
  setDocumentsLoading: (loading: boolean) => void;
  setDocuments: (documents: any[]) => void;
  setSelectedDocument: (data: ISelectedDocument) => void;

  fetchDocuments: () => Promise<void>;
}
export const useDocumentStore = create<DocumentStore>((set, get) => ({
  //   initial state
  documents: [],
  selectedDocument: null,
  documentsLoading: false,

  //   Actions
  setDocumentsLoading: (loading: boolean) => set({ documentsLoading: loading }),
  setDocuments: (documents: any[]) => set({ documents: documents }),
  setSelectedDocument: (data: ISelectedDocument) => set({ selectedDocument: data }),

  fetchDocuments: async () => {
    set({ documentsLoading: true });
    try {
      const response = await fetch("api/documents");
      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }
      const data = await response.json();
      set({ documents: data.documents });
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast.error("Error fetching documents");
    } finally {
      set({ selectedDocumentId: null });
      set({ documentsLoading: false });
    }
  },
}));

//haces todos los cambios comentarios
