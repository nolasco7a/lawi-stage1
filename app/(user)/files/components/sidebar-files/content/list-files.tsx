"use client";

import { ListItemFile } from "@/app/(user)/files/components/sidebar-files/content/list-item-file";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarGroupContent } from "@/components/ui/sidebar";
import type { Document } from "@/lib/db/schema";
import { useDocumentStore } from "@/lib/store/documents";
import { FileSearch } from "lucide-react";
import { useMemo } from "react";

function sortDocuments(docs: Document[], order: string): Document[] {
  return [...docs].sort((a, b) => {
    switch (order) {
      case "asc_name":
        return a.title.localeCompare(b.title);
      case "desc_name":
        return b.title.localeCompare(a.title);
      case "asc_date":
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      case "desc_date":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "asc_type":
        return a.kind.localeCompare(b.kind);
      case "desc_type":
        return b.kind.localeCompare(a.kind);
      default:
        return 0;
    }
  });
}

export function ListFiles() {
  const { documents, searchQuery, sortOrder, documentsLoading, activeTab } = useDocumentStore();

  const filteredAndSorted = useMemo(() => {
    let filtered = documents;

    // Filter by tab
    if (activeTab === "artifacts") {
      filtered = filtered.filter((doc) => doc.source !== "user");
    } else {
      filtered = filtered.filter((doc) => doc.source === "user");
    }

    // Filter by query
    const query = searchQuery.trim().toLowerCase();
    if (query) {
      filtered = filtered.filter((doc) => doc.title.toLowerCase().includes(query));
    }

    return sortDocuments(filtered, sortOrder);
  }, [documents, searchQuery, sortOrder, activeTab]);

  if (documentsLoading) {
    return (
      <SidebarGroupContent className="h-full">
        <div className="flex flex-col gap-1 p-2">
          {Array.from({ length: 5 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeleton
            <div key={i} className="h-10 rounded-md bg-muted/50 animate-pulse" />
          ))}
        </div>
      </SidebarGroupContent>
    );
  }

  if (filteredAndSorted.length === 0) {
    return (
      <SidebarGroupContent className="h-full">
        <div className="flex flex-col items-center justify-center h-full gap-2 py-10 text-muted-foreground">
          <FileSearch size={32} strokeWidth={1.5} />
          <p className="text-xs text-center px-4">
            {searchQuery ? `Sin resultados para "${searchQuery}"` : "No hay documentos aún"}
          </p>
        </div>
      </SidebarGroupContent>
    );
  }

  return (
    <SidebarGroupContent className="h-full">
      <ScrollArea className="h-full w-full">
        <div className="flex flex-col gap-0.5 p-1">
          {filteredAndSorted.map((document) => (
            <ListItemFile key={document.id} document={document} />
          ))}
        </div>
      </ScrollArea>
    </SidebarGroupContent>
  );
}
