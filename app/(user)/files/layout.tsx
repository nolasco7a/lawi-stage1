"use client";

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
import { useSettingsStore } from "@/lib/store/settingsStore";
import { FilesSidebarStateSync } from "@/components/files-sidebar-state-sync";
import { CirclePlus, Home, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDocumentStore } from "@/lib/store/documents";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ListItemFile = ({ documentData }: { documentData: any }) => {
  const { setSelectedDocument } = useDocumentStore();

  const handleClick = () => {
    setSelectedDocument({
      id: documentData.id,
      title: documentData.title,
      kind: documentData.kind,
      content: documentData?.content,
      fileUrl: documentData?.fileUrl,
    });
  };
  console.log(documentData);
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

  console.log("documents", documents);

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
              {documents?.map((doc: any) => (
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
