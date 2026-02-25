"use client";

import { SidebarGroupContent } from "@/components/ui/sidebar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useDocumentStore } from "@/lib/store/documents";

export function SidebarTabs() {
  const { activeTab, setActiveTab } = useDocumentStore();

  return (
    <SidebarGroupContent className="px-2 pt-2 border-b pb-2 flex-shrink-0">
      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as "artifacts" | "files")}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="artifacts">Artefactos</TabsTrigger>
          <TabsTrigger value="files">Archivos</TabsTrigger>
        </TabsList>
      </Tabs>
    </SidebarGroupContent>
  );
}
