import { Link } from "react-router-dom";
import { Logo } from "./Logo";
import { MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-secondary/40 mt-16">
      <div className="mx-auto max-w-6xl px-4 py-12 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-3 max-w-sm text-sm text-muted-foreground">
            The home for commercial spaces in Kenya. Find a shop, stall, office, godown or warehouse
            across all 47 counties, all from one place.
          </p>
        </div>
        <div>
          <h4 className="font-display text-base font-semibold">For Users</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/seeker/signup" className="hover:text-foreground">Space Seeker Signup</Link></li>
            <li><Link to="/owner/signup" className="hover:text-foreground">Space Owner Signup</Link></li>
            <li><Link to="/feedback" className="hover:text-foreground">Send Feedback</Link></li>
            <li><Link to="/support" className="hover:text-foreground">Support</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-display text-base font-semibold">Contact</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Nairobi, Kenya</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +254 700 000 000</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/60">
        <p className="mx-auto max-w-6xl px-4 py-5 text-xs text-muted-foreground">
          © 2026 Find a Space KE. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
