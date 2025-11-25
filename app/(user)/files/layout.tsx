"use client";

import { FilesSidebarStateSync } from "@/components/files-sidebar-state-sync";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import type { Document } from "@/lib/db/schema";
import { useDocumentStore } from "@/lib/store/documents";
import { useSettingsStore } from "@/lib/store/settingsStore";
import { CirclePlus, Home, MoreHorizontal } from "lucide-react";

const ListItemFile = ({ documentData }: { documentData: Document }) => {
  const { setSelectedDocument } = useDocumentStore();

  const handleClick = () => {
    setSelectedDocument({
      id: documentData.id,
      title: documentData.title,
      kind: documentData.kind,
      content: documentData?.content || "",
      //fileUrl: documentData?.fileUrl || undefined, // fix esto en implementacion
    });
  };
  return (
    <SidebarMenuItem className={"cursor-poiter"} onClick={handleClick}>
      <SidebarMenuButton asChild>
        <div>
          <Home />
          <span>{documentData.title}</span>
        </div>
      </SidebarMenuButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction>
            <MoreHorizontal />
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          <DropdownMenuItem>
            <span>Renombar</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Borrar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const { documents } = useDocumentStore();
  const { mainSidebarOpen } = useSettingsStore();

  // Calcula el margen izquierdo basado en el estado del sidebar principal
  const marginLeft = mainSidebarOpen
    ? "ml-[var(--sidebar-width)]"
    : "ml-[var(--sidebar-width-icon)]";

  return (
    <SidebarProvider>
      <FilesSidebarStateSync />
      <Sidebar
        variant="inset"
        collapsible="offcanvas"
        className={`hidden md:flex transition-all duration-200 ease-linear ${marginLeft}`}
      >
        <SidebarHeader>
          <div className={"flex flex-row justify-between"}>
            Archivos <CirclePlus />
            <SidebarTrigger />
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <div>
              <input />
            </div>
            <div>
              <Button>Filtros</Button>
              <Button>Sort</Button>
            </div>
          </SidebarGroup>
          <SidebarGroup />
          <SidebarGroupLabel>Documentos</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {documents?.map((doc: Document) => (
                <ListItemFile key={doc.id} documentData={doc} />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
      {children}
    </SidebarProvider>
  );
}
