import {
  Sidebar,
  SidebarHeader,
  SidebarFooter,
  SidebarContent,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { SidebarMenuLabLinks } from "./sidebar-menu-labs";

export function SidebarAppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full">
      {/* LEFT SIDEBAR */}
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <div className="font-bold tracking-tight text-lg px-2 py-3">
            Лабораторні
          </div>
        </SidebarHeader>

        <SidebarContent>
          <SidebarMenuLabLinks />
        </SidebarContent>

        <SidebarFooter>
          <div className="text-xs text-muted-foreground px-2 py-2">© 2025</div>
        </SidebarFooter>
      </Sidebar>

      {/* MAIN CONTENT */}
      <div className="flex-1">
        {/* trigger for mobile mode */}
        <div className="p-2 border-b">
          <SidebarTrigger />
        </div>

        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}
