import PrivacyDialog from "@/components/PrivacyDialog";
import { DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { DropdownMenuContent } from "@/components/ui/dropdown-menu";
import { useSidebar } from "@/components/ui/sidebar";
import type { User } from "next-auth";
import { ContentHeader } from "./content-header";
import { ContentOptions } from "./content-options";
import { LogoutButton } from "./logout-button";

interface DropdownUserContentProps {
  user: User | undefined;
  isGuest: boolean;
}

export default function DropdownUserContent({ user, isGuest }: DropdownUserContentProps) {
  //   === States
  const { state: appSidebarState } = useSidebar();

  // === Early return
  if (!user) return null;

  //   === Render
  return (
    <DropdownMenuContent
      data-testid="user-nav-menu"
      side={appSidebarState === "collapsed" ? "right" : "top"}
      align={appSidebarState === "collapsed" ? "start" : "center"}
      className={`${appSidebarState === "collapsed" ? "w-[200px]" : "w-[--radix-popper-anchor-width]"}`}
    >
      {/* header for authenticated users */}
      <ContentHeader user={user} isGuest={isGuest} />
      <DropdownMenuSeparator />

      {/* options for authenticated users */}
      <ContentOptions isGuest={isGuest} />
      <DropdownMenuSeparator />

      {/* default for all users */}
      <PrivacyDialog />
      <LogoutButton isGuest={isGuest} />
    </DropdownMenuContent>
  );
}
