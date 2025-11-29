"use client";
import {} from "@/components/ui/avatar";
import { DropdownMenu } from "@/components/ui/dropdown-menu";
import { SidebarMenu, SidebarMenuItem, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import {} from "lucide-react";
import type { User } from "next-auth";
import DropdownUserContent from "./sidebar/sidebar-user-nav/dropdown-user-content";
import DropdownUserTrigger from "./sidebar/sidebar-user-nav/dropdown-user-trigger";

interface SidebarUserNavProps {
  user: User | undefined;
  isGuest: boolean;
}

export function SidebarUserNav({ user, isGuest }: SidebarUserNavProps) {
  const { state: appSidebarState } = useSidebar();

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div
          className={`flex ${appSidebarState === "collapsed" ? "flex-col items-center" : "flex-row"} justify-between w-full px-2`}
        >
          <DropdownMenu>
            <DropdownUserTrigger user={user} isGuest={isGuest} />
            <DropdownUserContent user={user} isGuest={isGuest} />
          </DropdownMenu>
          <div className={"flex items-center"}>
            <SidebarTrigger />
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
