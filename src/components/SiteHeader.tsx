import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, Bird, ExternalLink } from "lucide-react";

const POULTRYFIT_APP_URL = "https://poultryfit.poultryfit-kenya.workers.dev";

const nav = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/team", label: "Team" },
  { to: "/contact", label: "Contact" },
] as const;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        scrolled
          ? "border-b border-border bg-background/85 backdrop-blur-md shadow-soft"
          : "border-b border-transparent bg-background/60 backdrop-blur"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 group" onClick={() => setOpen(false)}>
          <span className="grid h-9 w-9 place-items-center rounded-lg gradient-brand text-primary-foreground shadow-soft transition-transform group-hover:scale-105 group-hover:-rotate-6">
            <Bird className="h-5 w-5" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">
            PoultryFit <span className="text-primary">Kenya</span>
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-1">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              activeOptions={{ exact: n.to === "/" }}
              className="px-3 py-2 text-sm font-medium text-muted-foreground rounded-md hover:text-foreground hover:bg-secondary transition"
              activeProps={{ className: "px-3 py-2 text-sm font-medium rounded-md text-primary bg-secondary" }}
            >
              {n.label}
            </Link>
          ))}
          <a href={POULTRYFIT_APP_URL} target="_blank" rel="noopener noreferrer" className="ml-2 inline-flex items-center gap-1.5 rounded-md gradient-brand px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 transition shadow-soft">
            Open PoultryFit
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </nav>
        <button
          aria-label="Toggle menu"
          className="md:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-border bg-card"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="md:hidden border-t border-border bg-background animate-[fade-in_0.2s_ease-out_both]">
          <nav className="mx-auto flex max-w-6xl flex-col px-4 py-3 sm:px-6">
            {nav.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                activeOptions={{ exact: n.to === "/" }}
                className="flex items-center px-2 py-3.5 text-sm font-medium text-muted-foreground border-b border-border last:border-0"
                activeProps={{ className: "flex items-center px-2 py-3.5 text-sm font-medium text-primary border-b border-border last:border-0" }}
              >
                {n.label}
              </Link>
            ))}
            <a href={POULTRYFIT_APP_URL} target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)} className="mt-3 inline-flex items-center justify-center gap-1.5 rounded-md gradient-brand px-4 py-3.5 text-sm font-medium text-primary-foreground hover:opacity-90 transition shadow-soft">
              Open PoultryFit
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}