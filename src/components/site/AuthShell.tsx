import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";
import type { ReactNode } from "react";

export function AuthShell({
  title, subtitle, side, children,
}: { title: string; subtitle: string; side: "seeker" | "owner"; children: ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className={`hidden lg:flex flex-col justify-between p-12 text-white relative overflow-hidden ${
        side === "seeker" ? "gradient-hero" : "bg-highland"
      }`}>
        <div className="absolute inset-0 pattern-beadwork opacity-15" />
        <Logo light />
        <div className="relative max-w-md">
          <h2 className="font-display text-4xl font-bold leading-tight">
            {side === "seeker"
              ? "Browse commercial spaces from anywhere in Kenya."
              : "Reach buyers and renters across all 47 counties."}
          </h2>
          <p className="mt-4 text-white/85 text-base">
            {side === "seeker"
              ? "One account, every county, every kind of commercial space."
              : "Publish in minutes. Get discovered by serious enquiries from across the country."}
          </p>
        </div>
        <p className="relative text-xs text-white/60">© 2026 Find a Space KE</p>
      </div>
      <div className="flex flex-col p-6 sm:p-12 bg-background">
        <div className="lg:hidden"><Logo /></div>
        <div className="m-auto w-full max-w-md py-10">
          <h1 className="font-display text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-muted-foreground">{subtitle}</p>
          <div className="mt-8">{children}</div>
          <p className="mt-8 text-center text-xs text-muted-foreground">
            <Link to="/" className="hover:text-foreground">← Back to home</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
