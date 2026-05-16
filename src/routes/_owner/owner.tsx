import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Building2, Eye, Heart, Plus, Trash2, Pencil } from "lucide-react";

const NAV = [
  { to: "/owner", label: "My Spaces" },
  { to: "/owner/publish", label: "Publish a Space" },
];

export const Route = createFileRoute("/_owner/owner")({ component: OwnerDash });

interface Row { id: string; title: string; town: string; county: string; price: number; views: number; status: string; listing_type: string; images: string[]; }

function OwnerDash() {
  const { user } = useAuth();
  const [name, setName] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [saves, setSaves] = useState(0);

  const load = async () => {
    if (!user) return;
    const [{ data: p }, { data: s }] = await Promise.all([
      supabase.from("space_owners").select("full_name").eq("id", user.id).single(),
      supabase.from("spaces").select("id,title,town,county,price,views,status,listing_type,images").eq("owner_id", user.id).order("created_at", { ascending: false }),
    ]);
    setName(p?.full_name ?? "");
    setRows((s ?? []) as Row[]);
    const ids = (s ?? []).map((x) => x.id);
    if (ids.length) {
      const { count } = await supabase.from("saved_spaces").select("*", { count: "exact", head: true }).in("space_id", ids);
      setSaves(count ?? 0);
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
    <DashboardShell nav={NAV} accent="highland">
      <div className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Karibu</p>
            <h1 className="font-display text-4xl font-bold">{name || "Space Owner"}</h1>
          </div>
          <Button asChild size="lg" className="bg-highland text-highland-foreground hover:bg-highland/90">
            <a href="/owner/publish"><Plus className="mr-2 h-4 w-4" /> Publish a Space</a>
          </Button>
        </div>

        <div className="rounded-2xl border border-savanna/40 bg-savanna/10 p-6">
          <p className="font-display text-sm uppercase tracking-wider text-primary">How this works</p>
          <p className="mt-2 text-foreground/85">
            Tap Publish a Space to add a new listing. Fill in details across six quick steps, upload photos
            and pin your location on the map. To change anything later, use Edit on the listing. Delete
            removes it permanently.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-4">
          <Stat icon={Building2} label="Active Spaces" value={active} />
          <Stat icon={Eye} label="Total Views" value={totalViews} />
          <Stat icon={Heart} label="Saves Received" value={saves} />
          <Stat icon={Eye} label="Unread Alerts" value={0} />
        </div>

        {top && (
          <div className="rounded-2xl border border-border bg-card p-6">
            <p className="font-display text-sm uppercase tracking-wider text-primary">Top performing space</p>
            <p className="mt-2 font-display text-2xl font-semibold">{top.title}</p>
            <p className="text-sm text-muted-foreground">{top.town}, {top.county} · {top.views} views</p>
          </div>
        )}

        <section>
          <h2 className="font-display text-2xl font-bold">Your spaces</h2>
          {rows.length === 0 ? (
            <div className="mt-4 rounded-2xl border border-dashed border-border bg-card p-12 text-center">
              <p className="text-muted-foreground">You have not published any spaces yet.</p>
              <Button asChild className="mt-4 bg-highland text-highland-foreground hover:bg-highland/90">
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
function Stat({ icon: Icon, label, value }: { icon: Icon; label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-5">
      <Icon className="h-5 w-5 text-highland" />
      <p className="mt-3 font-display text-3xl font-bold">{typeof value === "number" ? value.toLocaleString() : value}</p>
      <p className="mt-1 text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
