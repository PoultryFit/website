import { useNavigate, useLocation } from "react-router-dom";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { LogOut } from "lucide-react";
import type { ReactNode } from "react";

interface NavItem { to: string; label: string }

export function DashboardShell({
  nav, accent, children,
}: { nav: NavItem[]; accent: "primary" | "highland" | "savanna"; children: ReactNode }) {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const path = useLocation().pathname;

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const accentClass = accent === "highland" ? "border-l-highland" : accent === "savanna" ? "border-l-savanna" : "border-l-primary";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Logo />
          <nav className="hidden gap-1 md:flex">
            {nav.map((n) => {
              const active = path === n.to || path.startsWith(n.to + "/");
              return (
                <a
                  key={n.to}
                  href={n.to}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition ${
                    active ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  }`}
                >
                  {n.label}
                </a>
              );
            })}
          </nav>
          <Button variant="ghost" size="sm" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>
      </header>
      <main className={`mx-auto max-w-7xl px-4 py-8 border-l-4 ${accentClass} md:border-l-0`}>{children}</main>
    </div>
  );
}
