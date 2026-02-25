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
  // Nuevos campos
  source?: "model" | "user";
  caseId?: string | null;
  filename?: string | null;
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
  activeTab: "artifacts" | "files";

  //   actions
  setDocumentsLoading: (loading: boolean) => void;
  setDocuments: (documents: Document[]) => void;
  setSelectedDocument: (data: ISelectedDocument | null) => void;
  setSearchQuery: (query: string) => void;
  setSortOrder: (order: SortOrder) => void;
  setActiveTab: (tab: "artifacts" | "files") => void;
  renameDocument: (id: string, title: string) => Promise<void>;
  deleteDocument: (id: string) => Promise<void>;

  fetchDocuments: () => Promise<void>;
  createDocument: () => Promise<void>;
  uploadDocument: (file: File) => Promise<void>;
}

export const useDocumentStore = create<DocumentStore>((set, _get) => ({
  //   initial state
  documents: [],
  selectedDocument: null,
  documentsLoading: false,

  searchQuery: "",
  sortOrder: "asc_name",
  activeTab: "artifacts",

  //   Actions
  setDocumentsLoading: (loading: boolean) => set({ documentsLoading: loading }),
  setDocuments: (documents: Document[]) => set({ documents: documents }),
  setSelectedDocument: (data: ISelectedDocument | null) => set({ selectedDocument: data }),

  setSearchQuery: (query: string) => set({ searchQuery: query }),
  setSortOrder: (order: SortOrder) => set({ sortOrder: order }),
  setActiveTab: (tab: "artifacts" | "files") => set({ activeTab: tab }),

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

  createDocument: async () => {
    try {
      const response = await fetch("/api/documents", { method: "POST" });
      if (!response.ok) throw new Error("Failed to create document");
      const doc = await response.json();

      set((state) => ({
        documents: [doc, ...state.documents],
        selectedDocument: doc,
        activeTab: "artifacts",
      }));
      toast.success("Documento creado");
    } catch (error) {
      console.error("Error creating document:", error);
      toast.error("Error al crear el documento");
    }
  },

  uploadDocument: async (file: File) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload document");
      const { file: doc } = await response.json();

      set((state) => ({
        documents: [doc, ...state.documents],
        selectedDocument: doc,
        activeTab: "files",
      }));
      toast.success("Archivo subido con éxito");
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Error al subir el archivo");
    }
  },
}));
