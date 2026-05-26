import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Building2, Eye, Bell, Plus, Trash2, Pencil, Sparkles } from "lucide-react";

const NAV = [
  { to: "/owner", label: "My Spaces" },
  { to: "/owner/publish", label: "Publish a Space" },
];

interface Row {
  id: string; title: string; town: string; county: string; price: number;
  views: number; status: string; listing_type: string; images: string[];
}
interface Alert { id: string; space_id: string; space_title: string; seeker_name: string; created_at: string; }

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showAlerts, setShowAlerts] = useState(false);

  const load = async () => {
    if (!user) return;
    const [{ data: p }, { data: s }] = await Promise.all([
      supabase.from("space_owners").select("full_name").eq("id", user.id).single(),
      supabase.from("spaces").select("id,title,town,county,price,views,status,listing_type,images")
        .eq("owner_id", user.id).order("created_at", { ascending: false }),
    ]);
    setName(p?.full_name ?? "");
    const spaces = (s ?? []) as Row[];
    setRows(spaces);

    if (spaces.length) {
      const ids = spaces.map((r) => r.id);
      const titleMap = new Map(spaces.map((r) => [r.id, r.title]));
      const { data: saves } = await supabase
        .from("saved_spaces")
        .select("id,space_id,seeker_id,created_at")
        .in("space_id", ids)
        .order("created_at", { ascending: false })
        .limit(50);
      const seekerIds = Array.from(new Set((saves ?? []).map((x) => x.seeker_id)));
      const nameMap = new Map<string, string>();
      if (seekerIds.length) {
        const { data: seekers } = await supabase
          .from("space_seekers")
          .select("id,full_name")
          .in("id", seekerIds);
        (seekers ?? []).forEach((sk) => nameMap.set(sk.id, sk.full_name || "A user"));
      }
      setAlerts((saves ?? []).map((sv) => ({
        id: sv.id,
        space_id: sv.space_id,
        space_title: titleMap.get(sv.space_id) ?? "your property",
        seeker_name: nameMap.get(sv.seeker_id) ?? "A user",
        created_at: sv.created_at,
      })));
    } else {
      setAlerts([]);
    }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user]);

  const remove = async (id: string) => {
    if (!confirm("Delete this listing? This cannot be undone.")) return;
    const { error } = await supabase.from("spaces").delete().eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Listing deleted"); load(); }
  };

  const active = rows.filter((r) => r.status === "active").length;
  const totalViews = rows.reduce((s, r) => s + (r.views ?? 0), 0);
  const top = [...rows].sort((a, b) => b.views - a.views)[0];

  return (
    <DashboardShell nav={NAV} accent="primary">
      <div className="space-y-8">
        <div className="relative overflow-hidden rounded-3xl gradient-hero p-8 md:p-10 shadow-elegant">
          <div className="absolute inset-0 pattern-beadwork opacity-10" />
          <div className="relative flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm text-white/80">Karibu</p>
              <h1 className="font-display text-4xl font-bold text-white md:text-5xl">{name || "Space Owner"}</h1>
              <p className="mt-2 max-w-xl text-white/85">
                Manage your spaces, watch them get discovered, and respond to interest from seekers.
              </p>
            </div>
            <Button asChild size="lg" className="bg-gold font-semibold text-[color:var(--savanna-foreground)] hover:bg-gold/90">
              <a href="/owner/publish"><Plus className="mr-2 h-4 w-4" /> Publish a Space</a>
            </Button>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Stat icon={Eye} label="Total Views" value={totalViews}
                hint="Unique registered viewers per listing." />
          <button
            type="button"
            onClick={() => setShowAlerts((v) => !v)}
            className="text-left rounded-2xl border border-border bg-card p-5 hover:border-primary hover:shadow-soft transition"
          >
            <Bell className="h-5 w-5 text-gold" />
            <p className="mt-3 font-display text-3xl font-bold">{alerts.length.toLocaleString()}</p>
            <p className="mt-1 text-sm text-muted-foreground">Alerts {alerts.length > 0 && <span className="ml-1 inline-block rounded-full bg-gold/30 px-1.5 text-[10px] font-semibold text-foreground">{showAlerts ? "Hide" : "View"}</span>}</p>
          </button>
          <Stat icon={Building2} label="Active Listings" value={active}
                hint="Currently live and discoverable." />
        </div>

        {showAlerts && (
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-gold" />
              <h2 className="font-display text-lg font-semibold">Recent alerts</h2>
            </div>
            {alerts.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No alerts yet. When a seeker saves one of your listings, you'll see it here.</p>
            ) : (
              <ul className="mt-3 divide-y divide-border">
                {alerts.map((a) => (
                  <li key={a.id} className="flex items-center justify-between py-3 text-sm">
                    <span><strong>{a.seeker_name}</strong> saved your property <strong>{a.space_title}</strong>.</span>
                    <span className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {top && top.views > 0 && (
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="inline-flex items-center gap-1 font-display text-xs uppercase tracking-wider text-gold">
              <Sparkles className="h-3.5 w-3.5" /> Top performing space
            </p>
            <p className="mt-2 font-display text-2xl font-semibold">{top.title}</p>
            <p className="text-sm text-muted-foreground">{top.town}, {top.county} · {top.views} unique viewers</p>
          </div>
        )}

        <section>
          <h2 className="font-display text-2xl font-bold">Your spaces</h2>
          {rows.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <p className="text-muted-foreground">You have not published any spaces yet.</p>
              <Button asChild className="mt-4">
                <a href="/owner/publish">Publish your first space</a>
              </Button>
            </div>
          ) : (
            <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
              {rows.map((r) => (
                <div key={r.id} className="flex flex-wrap items-center gap-4 p-4">
                  <div className="h-16 w-20 overflow-hidden rounded bg-muted shrink-0">
                    {r.images?.[0] && <img src={r.images[0]} alt="" className="h-full w-full object-cover" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-lg font-semibold truncate">{r.title}</p>
                    <p className="text-sm text-muted-foreground">{r.town}, {r.county} · {r.views} views · {r.status}</p>
                  </div>
                  <p className="font-display text-lg font-bold text-primary">KSh {Number(r.price).toLocaleString()}</p>
                  <div className="flex gap-2">
                    <Button asChild variant="outline" size="sm"><a href={`/owner/publish?id=${r.id}`}><Pencil className="mr-1 h-4 w-4" /> Edit</a></Button>
                    <Button variant="outline" size="sm" onClick={() => remove(r.id)}><Trash2 className="mr-1 h-4 w-4" /> Delete</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </DashboardShell>
  );
}

type Icon = React.ComponentType<{ className?: string }>;
function Stat({ icon: Icon, label, value, hint }: { icon: Icon; label: string; value: number | string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <Icon className="h-5 w-5 text-primary" />
      <p className="mt-3 font-display text-3xl font-bold">{typeof value === "number" ? value.toLocaleString() : value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground/70">{hint}</p>}
    </div>
  );
}
