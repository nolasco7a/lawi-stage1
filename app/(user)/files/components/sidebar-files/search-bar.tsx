"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useSidebar } from "@/components/ui/sidebar";
import { useDocumentStore } from "@/lib/store/documents";
import { Search, X } from "lucide-react";

export function SearchBar() {
  const sidebarContext = useSidebar();
  const { searchQuery, setSearchQuery } = useDocumentStore();

  return (
    <>
      {sidebarContext.open && (
        <div className="relative">
          <Search
            size={15}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            type="text"
            placeholder="Buscar documento..."
            onChange={(e) => setSearchQuery(e.target.value)}
            value={searchQuery}
            className="pl-8 pr-8 h-8 text-sm"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {!sidebarContext.open && (
        <Button variant="ghost" className="p-3" title="Buscar">
          <Search />
        </Button>
      )}
    </>
  );
}
