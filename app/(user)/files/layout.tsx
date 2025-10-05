import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider id="files-sidebar">
      <Sidebar id="files-sidebar" variant="floating" className="hidden md:flex ml-[var(--sidebar-width)]">
        <SidebarHeader />
        <SidebarContent>
          <SidebarGroup />
          <div>item</div>
          <div>item</div>
          <div>item</div>
          <div>item</div>
          <div>item</div>
          <div>item</div>
          <div>item</div>
          <SidebarGroup />
        </SidebarContent>
        <SidebarFooter />
      </Sidebar>
      <main>
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}