import { Link } from "@tanstack/react-router";

export function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link to="/" className="inline-flex items-center gap-2 group">
      <span className="relative inline-block h-9 w-9 rounded-lg gradient-hero shadow-sm">
        <span className="absolute inset-0 grid place-items-center font-display text-base font-bold text-white">FS</span>
      </span>
      <span className={`font-display text-xl font-bold tracking-tight ${light ? "text-white" : "text-foreground"}`}>
        Find a Space <span className="text-primary">KE</span>
      </span>
    </Link>
  );
}
