"use client";
import { ListFiles } from "@/app/(user)/files/components/sidebar-files/content/list-files";
import { calculateMarginLeft } from "@/app/(user)/files/helpers";
import {
  Sidebar,
  SidebarContent,
  SidebarGroupContent,
  SidebarInset,
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";

import { Footer } from "@/app/(user)/files/components/sidebar-files/footer";
import { Header } from "@/app/(user)/files/components/sidebar-files/header";
import { SearchBar } from "@/app/(user)/files/components/sidebar-files/search-bar";
import { Sort } from "@/app/(user)/files/components/sidebar-files/sort";
import { SidebarTabs } from "@/app/(user)/files/components/sidebar-files/tabs";
import type React from "react";

interface SidebarFilesProps {
  children?: React.ReactNode;
}

export function SidebarFiles({ children }: SidebarFilesProps) {
  const mainSidebarContext = useSidebar();
  const marginLeft = calculateMarginLeft(mainSidebarContext.open);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "260px",
          "--sidebar-width-icon": "48px",
        } as React.CSSProperties
      }
      className="h-full min-h-0"
    >
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

          <SidebarTabs />

          <div className="flex-1 min-h-0 pt-2">
            <ListFiles />
          </div>
        </SidebarContent>

        {/*Footer actions*/}
        <Footer />
      </Sidebar>

      {/* Page content goes here, properly offset after the files sidebar */}
      <SidebarInset className="overflow-hidden">{children}</SidebarInset>
    </SidebarProvider>
  );
}
