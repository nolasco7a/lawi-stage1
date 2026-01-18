"use client";
import { ListFiles } from "@/app/(user)/files/components/sidebar-files/content/list-files";
import { calculateMarginLeft } from "@/app/(user)/files/helpers";
import {
  Sidebar,
  SidebarContent,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";

import { Footer } from "@/app/(user)/files/components/sidebar-files/footer";
import { Header } from "@/app/(user)/files/components/sidebar-files/header";
import { SearchBar } from "@/app/(user)/files/components/sidebar-files/search-bar";
import { Sort } from "@/app/(user)/files/components/sidebar-files/sort";

export function SidebarFiles() {
  const mainSidebarContext = useSidebar();
  const marginLeft = calculateMarginLeft(mainSidebarContext.open);

  return (
    <SidebarProvider>
      <Sidebar
        variant="floating"
        collapsible="icon"
        side="left"
        className={`hidden md:flex transition-all duration-200 ease-linear ${marginLeft}`}
      >
        <SidebarContent className="flex flex-col h-full">
          {/*header title and toggle filters*/}
          <SidebarGroupContent className="flex-shrink-0">
            <Header />
            <div className={"p-1"}>
              <SearchBar />
              <Sort />
            </div>
          </SidebarGroupContent>

          {/*content list of files*/}
          <SidebarGroupLabel className={"mt-4 flex-shrink-0"}>
            Lista de documentos
          </SidebarGroupLabel>
          <div className="flex-1 min-h-0">
            <ListFiles />
          </div>
        </SidebarContent>

        {/*Footer actions*/}
        <Footer />
      </Sidebar>
    </SidebarProvider>
  );
}
