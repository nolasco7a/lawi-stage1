"use client";

import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import type React from "react";

interface SideBarMenuItemProps {
  path: string;
  title: string;
  icon: React.ReactNode;
  customClass?: string;
}

export const SideBarMenuItem = ({ path, title, icon, customClass }: SideBarMenuItemProps) => {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href={`/${path}`} className={`flex items-center gap-2 ${customClass}`}>
          {icon} {title}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};
