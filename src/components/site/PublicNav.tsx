import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import { Button } from "@/components/ui/button";

export function PublicNav() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
        <Logo />
        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          <Link to="/feedback" className="text-muted-foreground hover:text-foreground">Feedback</Link>
          <Link to="/support" className="text-muted-foreground hover:text-foreground">Support</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link to="/seeker/login">Sign in</Link>
          </Button>
          <Button asChild size="sm" className="bg-primary text-primary-foreground">
            <Link to="/owner/signup">List a Space</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
