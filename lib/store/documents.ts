"use client";

import { toast } from "sonner";
import { create } from "zustand";
import type { Document } from "../db/schema";

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
  documents: Document[];
  selectedDocument?: ISelectedDocument | null;

  //   actions
  setDocumentsLoading: (loading: boolean) => void;
  setDocuments: (documents: Document[]) => void;
  setSelectedDocument: (data: ISelectedDocument) => void;

  fetchDocuments: () => Promise<void>;
}
export const useDocumentStore = create<DocumentStore>((set) => ({
  //   initial state
  documents: [],
  selectedDocument: null,
  documentsLoading: false,

  //   Actions
  setDocumentsLoading: (loading: boolean) => set({ documentsLoading: loading }),
  setDocuments: (documents: Document[]) => set({ documents: documents }),
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
      set({ selectedDocument: null });
      set({ documentsLoading: false });
    }
  },
}));

//haces todos los cambios comentarios
