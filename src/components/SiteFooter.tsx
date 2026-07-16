import { Link } from "@tanstack/react-router";
import { Bird, MapPin } from "lucide-react";

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-border bg-surface overflow-hidden">
      <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full gradient-brand opacity-[0.08] blur-3xl" aria-hidden />
      <div className="absolute -bottom-20 -right-20 h-64 w-64 rounded-full gradient-warm opacity-[0.08] blur-3xl" aria-hidden />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid h-9 w-9 place-items-center rounded-lg gradient-brand text-primary-foreground shadow-soft">
              <Bird className="h-5 w-5" />
            </span>
            <span className="font-display text-base font-semibold">PoultryFit Kenya</span>
          </div>
          <p className="mt-4 text-sm text-muted-foreground max-w-xs leading-relaxed">
            A decision-support platform for first-time urban poultry keepers in Kenya.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Explore</h4>
          <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/" className="hover:text-primary transition">Home</Link></li>
            <li><Link to="/about" className="hover:text-primary transition">About</Link></li>
            <li><Link to="/team" className="hover:text-primary transition">Team</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold text-foreground">Affiliation</h4>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            Built under the JHUB Africa internship programme, Department of Computing,
            Jomo Kenyatta University of Agriculture and Technology.
          </p>
        </div>
      </div>
      <div className="relative border-t border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-5 text-xs text-muted-foreground flex flex-col sm:flex-row gap-2 justify-between">
          <span>© {new Date().getFullYear()} PoultryFit Kenya. All rights reserved.</span>
          <span className="inline-flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Juja, Kiambu County, Kenya</span>
        </div>
      </div>
    </footer>
  );
}
