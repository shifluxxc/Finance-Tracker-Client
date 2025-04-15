
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Receipt, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

type NavItemProps = {
  href: string;
  icon: React.ReactNode;
  title: string;
  isActive: boolean;
};

const NavItem: React.FC<NavItemProps> = ({ href, icon, title, isActive }) => (
  <Link to={href}>
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-2 px-4 py-2 h-12",
        isActive && "bg-secondary"
      )}
    >
      {icon}
      <span>{title}</span>
    </Button>
  </Link>
);

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Mobile Header */}
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-4 md:hidden">
        <h1 className="text-xl font-bold">Personal Finance</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {/* Mobile menu button - could be implemented later */}
        </div>
      </header>

      {/* Sidebar for Desktop */}
      <div className="hidden border-r bg-card md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col space-y-4 py-6">
          <div className="px-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">Personal Finance</h1>
            <ThemeToggle />
          </div>
          <nav className="flex-1 space-y-1 px-2">
            <NavItem
              href="/"
              icon={<LayoutDashboard className="h-5 w-5" />}
              title="Dashboard"
              isActive={location.pathname === "/"}
            />
            <NavItem
              href="/transactions"
              icon={<Receipt className="h-5 w-5" />}
              title="Transactions"
              isActive={location.pathname === "/transactions"}
            />
            <NavItem
              href="/budget"
              icon={<PiggyBank className="h-5 w-5" />}
              title="Budget"
              isActive={location.pathname === "/budget"}
            />
          </nav>
        </div>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-10 border-t bg-card md:hidden">
        <nav className="flex items-center justify-around">
          <Link to="/" className={cn("flex flex-1 flex-col items-center py-3", location.pathname === "/" && "text-primary")}>
            <LayoutDashboard className="h-5 w-5" />
            <span className="text-xs">Dashboard</span>
          </Link>
          <Link to="/transactions" className={cn("flex flex-1 flex-col items-center py-3", location.pathname === "/transactions" && "text-primary")}>
            <Receipt className="h-5 w-5" />
            <span className="text-xs">Transactions</span>
          </Link>
          <Link to="/budget" className={cn("flex flex-1 flex-col items-center py-3", location.pathname === "/budget" && "text-primary")}>
            <PiggyBank className="h-5 w-5" />
            <span className="text-xs">Budget</span>
          </Link>
        </nav>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 pb-16 md:pb-0">
        <div className="container py-6 md:py-8 max-w-6xl">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
