"use client";

import { SidebarFiles } from "@/app/(user)/files/components/sidebar-files";
import type React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-full flex overflow-hidden">
      <SidebarFiles>{children}</SidebarFiles>
    </div>
  );
}
