import { NavLink } from "react-router-dom";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const items = [
  { to: "/lab-1", label: "Лабораторна 1" },
  { to: "/lab-2", label: "Лабораторна 2" },
  // { to: "/lab-3", label: "Лабораторна 3" },
];

export function SidebarMenuLabLinks() {
  return (
    <SidebarMenu>
      {items.map((item) => (
        <SidebarMenuItem key={item.to}>
          <SidebarMenuButton asChild isActive={location.pathname === item.to}>
            <NavLink
              to={item.to}
              className={({ isActive }) =>
                `flex items-center text-sm ${
                  isActive ? "font-medium text-primary" : "text-foreground"
                }`
              }
            >
              {item.label}
            </NavLink>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
