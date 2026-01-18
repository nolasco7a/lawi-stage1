import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuAction, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { FileText, MoreHorizontal } from "lucide-react";

export function ListItemFile() {
  return (
    <SidebarMenuItem
      className={"cursor-pointer"}
      onClick={() => console.info("clicking item file")}
    >
      <SidebarMenuButton asChild>
        <div>
          <FileText />
          <span>document title</span>
        </div>
      </SidebarMenuButton>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction>
            <MoreHorizontal />
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          <DropdownMenuItem>
            <span>Renombar</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <span>Borrar</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
}
