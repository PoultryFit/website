import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { SpaceCard, type SpaceSummary } from "@/components/space/SpaceCard";
import { Button } from "@/components/ui/button";
import { KENYA_COUNTIES } from "@/lib/counties";
import { Building2, Heart, Search, Store } from "lucide-react";

export const Route = createFileRoute("/_seeker/seeker")({ component: SeekerDashboard });

const NAV = [
  { to: "/seeker", label: "Home" },
  { to: "/seeker/browse", label: "Browse Spaces" },
  { to: "/seeker/saved", label: "Saved" },
];

function SeekerDashboard() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [stats, setStats] = useState({ total: 0, saved: 0 });
  const [latest, setLatest] = useState<SpaceSummary[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [{ data: p }, { count: total }, { count: saved }, { data: l }] = await Promise.all([
        supabase.from("space_seekers").select("full_name").eq("id", user.id).single(),
        supabase.from("spaces").select("*", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("saved_spaces").select("*", { count: "exact", head: true }).eq("seeker_id", user.id),
        supabase.from("spaces").select("id,title,space_type,listing_type,county,town,price,images")
          .eq("status", "active").order("created_at", { ascending: false }).limit(6),
      ]);
      setName(p?.full_name ?? "");
      setStats({ total: total ?? 0, saved: saved ?? 0 });
      setLatest((l ?? []) as SpaceSummary[]);
    })();
  }, [user]);

  return (
    <DashboardShell nav={NAV} accent="primary">
      <div className="space-y-10">
        <div>
          <p className="text-sm text-muted-foreground">Karibu</p>
          <h1 className="font-display text-4xl font-bold">{name || "Space Seeker"}</h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            Browse spaces by county, filter by what matters to you, and save the ones you like
            to come back to later.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Button asChild size="lg"><a href="/seeker/browse"><Search className="mr-2 h-4 w-4" /> Looking for a Space</a></Button>
          <Button asChild variant="outline" size="lg"><a href="/owner/signup"><Store className="mr-2 h-4 w-4" /> Have a Space and Looking to Rent it Out?</a></Button>
        </div>

        <div className="rounded-2xl border border-savanna/40 bg-savanna/10 p-6">
          <p className="font-display text-sm uppercase tracking-wider text-primary">Quick start</p>
          <p className="mt-2 text-foreground/85">
            Tap Browse Spaces to filter by county, town, type and price. When something looks promising,
            tap the heart icon to save it for later, then call the owner directly using the number on the listing.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Stat icon={Building2} label="Spaces Available" value={stats.total} />
          <Stat icon={Heart} label="Saved Spaces" value={stats.saved} />
          <Stat icon={Store} label="Account Type" value="Space Seeker" />
        </div>

        <section>
          <h2 className="font-display text-2xl font-bold">Browse by county</h2>
          <p className="text-sm text-muted-foreground">All 47 counties, one tap away.</p>
          <div className="mt-5 grid gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {KENYA_COUNTIES.map((c) => (
              <a key={c} href={`/seeker/browse?county=${encodeURIComponent(c)}`}
                 className="rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium hover:border-primary hover:bg-primary/5 transition">
                {c}
              </a>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-end justify-between">
            <h2 className="font-display text-2xl font-bold">Latest spaces</h2>
            <a href="/seeker/browse" className="text-sm font-medium text-primary hover:underline">View all →</a>
          </div>
          {latest.length === 0 ? (
            <p className="mt-6 rounded-xl border border-dashed border-border bg-card p-8 text-center text-sm text-muted-foreground">
              No spaces yet. Check back soon.
            </p>
          ) : (
            <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {latest.map((s) => <SpaceCard key={s.id} space={s} href={`/seeker/spaces/${s.id}`} />)}
            </div>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}

type Icon = React.ComponentType<{ className?: string }>;
function Stat({ icon: Icon, label, value }: { icon: Icon; label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-3 font-display text-3xl font-bold">{typeof value === "number" ? value.toLocaleString() : value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
