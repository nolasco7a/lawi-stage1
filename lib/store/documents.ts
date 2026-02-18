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

export type SortOrder =
  | "asc_name"
  | "desc_name"
  | "asc_date"
  | "desc_date"
  | "asc_type"
  | "desc_type";

interface DocumentStore {
  // state
  documentsLoading: boolean;
  documents: Document[];
  selectedDocument?: ISelectedDocument | null;
  searchQuery: string;
  sortOrder: SortOrder;

  //   actions
  setDocumentsLoading: (loading: boolean) => void;
  setDocuments: (documents: Document[]) => void;
  setSelectedDocument: (data: ISelectedDocument) => void;
  setSearchQuery: (query: string) => void;
  setSortOrder: (order: SortOrder) => void;
  renameDocument: (id: string, title: string) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;

  fetchDocuments: () => Promise<void>;
}

export const useDocumentStore = create<DocumentStore>((set, _get) => ({
  //   initial state
  documents: [],
  selectedDocument: null,
  documentsLoading: false,

  searchQuery: "",
  sortOrder: "asc_name",

  //   Actions
  setDocumentsLoading: (loading: boolean) => set({ documentsLoading: loading }),
  setDocuments: (documents: Document[]) => set({ documents: documents }),
  setSelectedDocument: (data: ISelectedDocument) => set({ selectedDocument: data }),

  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setSortOrder: (order: SortOrder) => set({ sortOrder: order }),

  renameDocument: async (id: string, title: string) => {
    if (!title.trim()) {
      toast.error("El título no puede estar vacío");
      return;
    }
    try {
      const response = await fetch("/api/documents", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, title: title.trim() }),
      });
      if (!response.ok) throw new Error("Failed to rename document");

      // Update local state
      set((state) => ({
        documents: state.documents.map((doc) =>
          doc.id === id ? { ...doc, title: title.trim() } : doc,
        ),
        selectedDocument:
          state.selectedDocument?.id === id
            ? { ...state.selectedDocument, title: title.trim() }
            : state.selectedDocument,
      }));
      toast.success("Documento renombrado");
    } catch (error) {
      console.error("Error renaming document:", error);
      toast.error("Error al renombrar el documento");
    }
  },

  deleteDocument: async (id: string) => {
    try {
      const response = await fetch(`/api/documents?id=${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete document");

      set((state) => ({
        documents: state.documents.filter((doc) => doc.id !== id),
        selectedDocument: state.selectedDocument?.id === id ? null : state.selectedDocument,
      }));
      toast.success("Documento eliminado");
    } catch (error) {
      console.error("Error deleting document:", error);
      toast.error("Error al eliminar el documento");
    }
  },

  fetchDocuments: async () => {
    set({ documentsLoading: true });
    try {
      const response = await fetch("api/documents");
      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }
      const data = await response.json();
      set({ documents: data });
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
