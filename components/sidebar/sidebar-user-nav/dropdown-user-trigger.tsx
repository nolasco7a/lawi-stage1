import { LoaderIcon } from "@/components/icons";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { ChevronUp } from "lucide-react";
import type { User } from "next-auth";
import { useSession } from "next-auth/react";
import Image from "next/image";

interface DropdownUserTriggerProps {
  user: User | undefined;
  isGuest: boolean;
}

export default function DropdownUserTrigger({ user, isGuest }: DropdownUserTriggerProps) {
  const { status: sessionStatus } = useSession();

  if (!user) return null;
  return (
    <>
      {sessionStatus === "loading" ? (
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton className="data-[state=open]:bg-sidebar-accent bg-background data-[state=open]:text-sidebar-accent-foreground h-10 justify-between">
            <div className="flex flex-row gap-2">
              <div className="size-6 bg-zinc-500/30 rounded-full animate-pulse" />
              <span className="bg-zinc-500/30 text-transparent rounded-md animate-pulse">
                Loading auth status
              </span>
            </div>
            <div className="animate-spin text-zinc-500">
              <LoaderIcon />
            </div>
          </SidebarMenuButton>
        </DropdownMenuTrigger>
      ) : (
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton
            data-testid="user-nav-button"
            className="data-[state=open]:bg-sidebar-accent bg-background data-[state=open]:text-sidebar-accent-foreground h-10"
          >
            <Image
              src={`https://avatar.vercel.sh/${user.email}`}
              alt={user.email ?? "User Avatar"}
              width={24}
              height={24}
              className="rounded-full"
            />
            <span data-testid="user-email" className="truncate">
              {isGuest ? "Guest" : user?.email}
            </span>
            <ChevronUp className="ml-auto" />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
      )}
    </>
  );
}
