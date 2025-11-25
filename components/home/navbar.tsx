"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/lib/hooks/useAuth";
import { capitalizeWords } from "@/lib/utils";
import {
  LayoutDashboard,
  LogOut,
  MessageCirclePlus,
  Moon,
  Settings,
  SunMedium,
  UserRound,
} from "lucide-react";
import { signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const { isAuthenticated, user, userEmail } = useAuth();
  const { setTheme, resolvedTheme } = useTheme();
  const [sideNavOpen, setSideNavOpen] = useState(false);

  return (
    <div className="bg-foreground rounded-[100px] py-3 sm:py-4 px-4 sm:px-6 md:px-10 w-[95%] sm:w-[80%] md:w-[60%] lg:w-[50%] absolute right-[2.5%] sm:right-[10%] md:right-[20%] lg:right-[25%] top-4 bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-10 border-none">
      <div className="flex items-center justify-between">
        <Link href="/" className="font-black text-xl sm:text-2xl text-foreground">
          LAWI
        </Link>

        <div className="flex items-center gap-3 sm:gap-4 md:gap-6">
          {/* Desktop Navigation */}
          <div className="hidden sm:flex items-center gap-4 md:gap-6">
            {!isAuthenticated && (
              <>
                <Link href="/login" className="text-foreground font-medium text-sm md:text-base">
                  Login
                </Link>
                <Link href="/register" className="text-foreground font-medium text-sm md:text-base">
                  Register
                </Link>
              </>
            )}
            {isAuthenticated && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-foreground font-medium text-sm md:text-base hover:text-accent transition-colors px-3 py-2"
                  >
                    {capitalizeWords(user?.name || "")}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback className="text-xs">
                          {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {capitalizeWords(user?.name || "")}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/chat" className="flex items-center gap-2">
                      <MessageCirclePlus className="size-4" />
                      New chat
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={"/dashboard"} className="flex items-center gap-2">
                      <LayoutDashboard className="size-4" />
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href={"/settings"} className="flex items-center gap-2">
                      <Settings className="size-4" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => {
                      signOut({ redirectTo: "/login" });
                    }}
                  >
                    <LogOut className="size-4" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Navigation */}
          <div className="sm:hidden">
            {!isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link href="/login" className="text-foreground font-medium text-sm">
                  Login
                </Link>
                <Link href="/register" className="text-foreground font-medium text-sm">
                  Register
                </Link>
              </div>
            ) : (
              <Sheet open={sideNavOpen} onOpenChange={setSideNavOpen}>
                <SheetTrigger asChild>
                  <Avatar className="w-8 h-8 cursor-pointer">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback className="text-xs">
                      {user?.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                </SheetTrigger>
                <SheetContent side="right" className="w-80">
                  <SheetHeader className="mb-6">
                    <SheetTitle className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>
                          {user?.name?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="font-medium truncate">{capitalizeWords(user?.name || "")}</p>
                        <p className="text-sm text-muted-foreground truncate">{userEmail}</p>
                      </div>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="space-y-2">
                    <Link
                      href="/chat"
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors"
                      onClick={() => setSideNavOpen(false)}
                    >
                      <MessageCirclePlus className="w-5 h-5" />
                      New chat
                    </Link>
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                      <UserRound className="w-5 h-5" />
                      Profile
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                      <LayoutDashboard className="w-5 h-5" />
                      Dashboard
                    </div>
                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer">
                      <Settings className="w-5 h-5" />
                      Settings
                    </div>
                    <div className="border-t pt-2 mt-2">
                      <div
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer text-destructive"
                        onClick={() => {
                          signOut({ redirectTo: "/login" });
                        }}
                      >
                        <LogOut className="w-5 h-5" />
                        Cerrar sesión
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>

          {/* Theme Toggle */}
          <Button
            className="rounded-full w-8 h-8 sm:w-10 sm:h-10"
            variant="ghost"
            size="icon"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          >
            {resolvedTheme === "dark" ? (
              <SunMedium className="w-4 h-4 sm:w-5 sm:h-5" />
            ) : (
              <Moon className="w-4 h-4 sm:w-5 sm:h-5" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
