import { SidebarHeader, SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

export function Header() {
  const sidebarContext = useSidebar();

  return (
    <SidebarHeader>
      <div className={"flex flex-row justify-between"}>
        {sidebarContext.open && <span>Archivos</span>}

        <SidebarTrigger />
      </div>
    </SidebarHeader>
  );
}
