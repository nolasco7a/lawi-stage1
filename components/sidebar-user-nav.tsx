"use client";

import { ChevronUp, LogIn, LogOut, Moon, Settings, Sprout, Sun } from "lucide-react";
import Image from "next/image";
import type { User } from "next-auth";
import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import { getInitialsFromName } from "@/lib/utils";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { toast } from "./toast";
import { LoaderIcon } from "./icons";
import { guestRegex } from "@/lib/constants";
import PrivacyDialog from "@/components/PrivacyDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function SidebarUserNav({ user }: { user: User }) {
  const router = useRouter();
  const { data, status } = useSession();
  const { setTheme, resolvedTheme } = useTheme();
  const { state: appSidebarState } = useSidebar();
  const isGuest = guestRegex.test(data?.user?.email ?? "");

  const handleLogout = async () => {
    if (status === "loading") {
      toast({
        type: "error",
        description: "Checking authentication status, please try again!",
      });
      return;
    }

    if (isGuest) {
      router.push("/login");
    } else {
      await signOut({
        redirectTo: "/",
      });
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div
          className={`flex ${appSidebarState == "collapsed" ? "flex-col items-center" : "flex-row"} justify-between w-full px-2`}
        >
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              {status === "loading" ? (
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
              ) : (
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
              )}
            </DropdownMenuTrigger>
            <DropdownMenuContent
              data-testid="user-nav-menu"
              side={`${appSidebarState == "collapsed" ? "right" : "top"}`}
              className={`${appSidebarState == "collapsed" ? "w-[200]" : "w-[--radix-popper-anchor-width]"}`}
            >
              <div className="p-3">
                <div className={"flex flex-row gap-3"}>
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback>
                      {getInitialsFromName(data?.user?.name, data?.user?.lastname)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm">
                      {data?.user?.name} {data?.user?.lastname}
                    </div>
                    <div className="text-[10px] color-muted">{data?.user?.email}</div>
                  </div>
                </div>
                <div className={"text-sm text-red-600 mt-2"}>
                  {data?.user?.subscription
                    ? `Subscripción ${data?.user?.subscription?.plan_type}`
                    : "Subscripción no activa"}
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                data-testid="user-nav-item-theme"
                className="cursor-pointer"
                onSelect={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              >
                {resolvedTheme === "dark" ? <Sun /> : <Moon />}
                {`Toggle ${resolvedTheme === "light" ? "dark" : "light"} mode`}
              </DropdownMenuItem>
              <DropdownMenuItem
                data-testid="user-nav-item-theme"
                className="cursor-pointer"
                onSelect={() =>
                  router.push("https://billing.stripe.com/p/login/test_aFaaEQ1IYemrafCg7zdwc00")
                }
              >
                <Sprout />
                Active subscription
              </DropdownMenuItem>
              <DropdownMenuItem data-testid="user-nav-item-theme" className="cursor-pointer">
                <Settings />
                Configuración
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <PrivacyDialog />
              <DropdownMenuItem asChild data-testid="user-nav-item-auth">
                <button type="button" className="w-full cursor-pointer" onClick={handleLogout}>
                  {isGuest ? (
                    <>
                      <LogIn /> Login to your account
                    </>
                  ) : (
                    <>
                      <LogOut /> Sign out
                    </>
                  )}
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className={"flex items-center"}>
            <SidebarTrigger />
          </div>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
