import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { SpaceCard, type SpaceSummary } from "@/components/space/SpaceCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { KENYA_COUNTIES } from "@/lib/counties";
import { Building2, Heart, Search, SlidersHorizontal, Store } from "lucide-react";

const NAV = [
  { to: "/seeker", label: "Home" },
  { to: "/seeker/browse", label: "Browse Spaces" },
  { to: "/seeker/saved", label: "Saved" },
];

export default function SeekerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [stats, setStats] = useState({ total: 0, saved: 0 });
  const [latest, setLatest] = useState<SpaceSummary[]>([]);
  const [query, setQuery] = useState("");
  const [filterCounty, setFilterCounty] = useState<string>("");

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

  const runSearch = () => {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (filterCounty) params.set("county", filterCounty);
    navigate(`/seeker/browse?${params.toString()}`);
  };

  return (
    <DashboardShell nav={NAV} accent="primary">
      <div className="space-y-10">
        <div className="relative overflow-hidden rounded-3xl gradient-hero p-8 md:p-10 shadow-elegant">
          <div className="absolute inset-0 pattern-beadwork opacity-10" />
          <div className="relative">
            <p className="text-sm text-white/80">Karibu</p>
            <h1 className="font-display text-4xl font-bold text-white md:text-5xl">{name || "Space Seeker"}</h1>
            <p className="mt-2 max-w-2xl text-white/85">
              Search by town, area, or county. Use filters to narrow it down, and save the spaces you like.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2 rounded-2xl bg-white/10 p-2 backdrop-blur ring-1 ring-white/15">
              <div className="relative flex-1 min-w-[220px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && runSearch()}
                  placeholder="Search by town, area or keyword..."
                  className="bg-background pl-9 h-11"
                />
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="h-11 bg-background">
                    <SlidersHorizontal className="mr-2 h-4 w-4" />
                    Filter {filterCounty && <span className="ml-1 rounded bg-gold/40 px-1.5 text-[10px] font-semibold text-foreground">{filterCounty}</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-72 p-0" align="end">
                  <div className="border-b border-border p-3">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Filter by County</p>
                  </div>
                  <div className="max-h-72 overflow-y-auto p-1">
                    <button
                      onClick={() => setFilterCounty("")}
                      className={`w-full rounded px-3 py-1.5 text-left text-sm hover:bg-secondary ${filterCounty === "" ? "bg-secondary font-semibold" : ""}`}
                    >
                      All counties
                    </button>
                    {KENYA_COUNTIES.map((c) => (
                      <button
                        key={c}
                        onClick={() => setFilterCounty(c)}
                        className={`w-full rounded px-3 py-1.5 text-left text-sm hover:bg-secondary ${filterCounty === c ? "bg-secondary font-semibold" : ""}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
              <Button onClick={runSearch} className="h-11 bg-gold font-semibold text-[color:var(--savanna-foreground)] hover:bg-gold/90">Search</Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Stat icon={Building2} label="Spaces Available" value={stats.total} />
          <Stat icon={Heart} label="Saved Spaces" value={stats.saved} />
          <Stat icon={Store} label="Account Type" value="Space Seeker" />
        </div>

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
