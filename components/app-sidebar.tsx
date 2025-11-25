"use client";

import { SidebarHistory } from "@/components/sidebar-history";
import { SidebarUserNav } from "@/components/sidebar-user-nav";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { APP_NAME } from "@/constants/app";
import { useAuth } from "@/lib/hooks/useAuth";
import {
  File,
  FolderKanban,
  LayoutDashboard,
  MessageCircleMore,
  MessageCirclePlus,
  Settings,
} from "lucide-react";
import type { User } from "next-auth";
import Link from "next/link";
import type React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const AppSidebarMenuItem = ({
  path = "/",
  title,
  icon,
  customClass,
}: { path: string; title: string; icon: React.ReactNode; customClass?: string }) => {
  const { state: appSidebarState } = useSidebar();
  const { isAuthenticated } = useAuth();
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

export function AppSidebar({ user }: Readonly<{ user: User | undefined }>) {
  const { state: appSidebarState } = useSidebar();

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
                {APP_NAME}
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
