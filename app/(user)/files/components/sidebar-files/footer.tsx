import { Button } from "@/components/ui/button";
import { SidebarFooter } from "@/components/ui/sidebar";
import { useSidebar } from "@/components/ui/sidebar";
import { FilePlus, Upload } from "lucide-react";

export function Footer() {
  const sidebarContext = useSidebar();
  return (
    <SidebarFooter>
      {sidebarContext.open && (
        <>
          <Button variant={"ghost"}>+ Crear archivo nuevo</Button>
          <Button variant={"outline"}>+ Subir archivo nuevo</Button>
        </>
      )}
      {!sidebarContext.open && (
        <>
          <Button variant={"ghost"}>
            <FilePlus />
          </Button>
          <Button variant={"outline"}>
            <Upload />
          </Button>
        </>
      )}
    </SidebarFooter>
  );
}
