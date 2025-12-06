import { NavLink } from "react-router-dom";

export function Navbar() {
  return (
    <nav className="border-b bg-white/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-6 py-3 flex gap-6">
        <NavItem to="/lab-1" text="Лабораторна 1" />
        <NavItem to="/lab-2" text="Лабораторна 2" />
        <NavItem to="/lab-3" text="Лабораторна 3" />
      </div>
    </nav>
  );
}

function NavItem({ to, text }: { to: string; text: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `text-sm font-medium px-3 py-2 transition-colors ${
          isActive
            ? "text-primary border-b-2 border-primary"
            : "text-muted-foreground hover:text-foreground"
        }`
      }
    >
      {text}
    </NavLink>
  );
}
