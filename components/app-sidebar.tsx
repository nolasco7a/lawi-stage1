"use client";

import type { User } from "next-auth";
import { useRouter } from "next/navigation";
import {
  MessageCirclePlus,
  Settings,
  LayoutDashboard,
  UserRound,
  FolderKanban,
  File,
  MessageCircleMore,
} from "lucide-react";
import { SidebarHistory } from "@/components/sidebar-history";
import { SidebarUserNav } from "@/components/sidebar-user-nav";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  useSidebar,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";
import React from "react";
import { state } from "@auth/core/lib/actions/callback/oauth/checks";

const AppSidebarMenuItem = ({
  path = "/",
  title,
  icon,
  customClass,
}: { path: string; title: string; icon: React.ReactNode; customClass?: string }) => {
  const { state: appSidebarState } = useSidebar();
  return (
    <SidebarMenuItem>
      <Tooltip>
        <TooltipTrigger asChild>
          <SidebarMenuButton asChild>
            <Link href={`/${path}`} className={`flex items-center gap-2 ${customClass}`}>
              {icon} {title}
            </Link>
          </SidebarMenuButton>
        </TooltipTrigger>
        {appSidebarState === "collapsed" && <TooltipContent align="end">{title}</TooltipContent>}
      </Tooltip>
    </SidebarMenuItem>
  );
};

export function AppSidebar({ user }: { user: User | undefined }) {
  const router = useRouter();
  const { setOpenMobile, state: appSidebarState } = useSidebar();
  // console.log(user);

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="group-data-[side=left]:border-r w-[var(--sidebar-width)] z-[999]"
    >
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center">
            <Link href="/" className="flex flex-row gap-3 items-center">
              <span
                className={`${appSidebarState === "collapsed" ? "text-[8px] font-bold" : "text-xl font-black"} px-2 hover:bg-muted rounded-md cursor-pointer`}
              >
                LAWI
              </span>
            </Link>
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarGroupLabel>Menu de navegación</SidebarGroupLabel>
            <SidebarMenu>
              {/*{appSidebarState === "collapsed" && (*/}
              {/*)}*/}
              <AppSidebarMenuItem
                path="chat"
                title="Nuevo chat"
                icon={<MessageCirclePlus />}
                customClass={"text-red-600 hover:text-red-500"}
              />
              <AppSidebarMenuItem path="dashboard" title="Dashboard" icon={<LayoutDashboard />} />
              <AppSidebarMenuItem path="chats" title="Historial" icon={<MessageCircleMore />} />
              <AppSidebarMenuItem path="files" title="Archivos" icon={<File />} />
              <AppSidebarMenuItem path="cases" title="Casos" icon={<FolderKanban />} />
              <AppSidebarMenuItem path="settings" title="Configuración" icon={<Settings />} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarHistory user={user} />
      </SidebarContent>
      <SidebarFooter>{user && <SidebarUserNav user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
