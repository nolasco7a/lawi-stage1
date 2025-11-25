import {
  File,
  FolderKanban,
  LayoutDashboard,
  MessageCircleMore,
  MessageCirclePlus,
  Settings,
} from "lucide-react";
import type React from "react";

interface SideBarMenuItemProps {
  path: string;
  title: string;
  icon: React.ReactNode;
  customClass?: string;
}

export const GUEST_MENU: SideBarMenuItemProps[] = [
  {
    path: "chat",
    title: "Nuevo chat",
    icon: <MessageCirclePlus />,
    customClass: "text-red-600 hover:text-red-500",
  },
] as const;

export const USER_MENU: SideBarMenuItemProps[] = [
  ...GUEST_MENU,
  {
    path: "dashboard",
    title: "Dashboard",
    icon: <LayoutDashboard />,
  },
  {
    path: "chats",
    title: "Historial",
    icon: <MessageCircleMore />,
  },
  {
    path: "settings",
    title: "Configuración",
    icon: <Settings />,
  },
] as const;

export const LAWYER_MENU: SideBarMenuItemProps[] = [
  ...USER_MENU,
  {
    path: "files",
    title: "Archivos",
    icon: <File />,
  },
  {
    path: "cases",
    title: "Casos",
    icon: <FolderKanban />,
  },
] as const;
