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
  useSidebar,
} from "@/components/ui/sidebar";
import {} from "@/components/ui/tooltip";
import { APP_NAME } from "@/constants/app";
import { useAuth } from "@/lib/hooks/useAuth";
import {} from "lucide-react";
import type { User } from "next-auth";
import Link from "next/link";
import { GUEST_MENU, LAWYER_MENU, USER_MENU } from "./config";
import { SideBarMenuItem } from "./sidebar-menu-item";

export function SideBar({ user }: Readonly<{ user: User | undefined }>) {
  const { state: appSidebarState } = useSidebar();
  const { isGuest, isRegular, isLawyer } = useAuth();
  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="group-data-[side=left]:border-r w-[var(--sidebar-width)] z-[999]"
    >
      {/* Header */}
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

      {/* Content */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarGroupLabel>Menu de navegación</SidebarGroupLabel>
            <SidebarMenu>
              {/* guest user menu */}
              {isGuest &&
                GUEST_MENU.map((item) => {
                  return (
                    <SideBarMenuItem
                      key={item.path}
                      path={item.path}
                      title={item.title}
                      icon={item.icon}
                      customClass={item.customClass}
                    />
                  );
                })}

              {/* regular user menu */}
              {isRegular &&
                USER_MENU.map((item) => {
                  return (
                    <SideBarMenuItem
                      key={item.path}
                      path={item.path}
                      title={item.title}
                      icon={item.icon}
                      customClass={item.customClass}
                    />
                  );
                })}

              {/* lawyer user menu */}
              {isLawyer &&
                LAWYER_MENU.map((item) => {
                  return (
                    <SideBarMenuItem
                      key={item.path}
                      path={item.path}
                      title={item.title}
                      icon={item.icon}
                      customClass={item.customClass}
                    />
                  );
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarHistory user={user} />
      </SidebarContent>
      <SidebarFooter>{user && <SidebarUserNav user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
