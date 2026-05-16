import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const NAV = [{ to: "/admin", label: "Admin" }];

export default function Admin() {
  const [stats, setStats] = useState({ seekers: 0, owners: 0, admins: 0, spaces: 0, active: 0, inactive: 0, views: 0 });
  const [spaces, setSpaces] = useState<any[]>([]);
  const [feedback, setFeedback] = useState<any[]>([]);

  const load = async () => {
    const [seekers, owners, admins, spacesAll, fb] = await Promise.all([
      supabase.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "seeker"),
      supabase.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "owner"),
      supabase.from("user_roles").select("*", { count: "exact", head: true }).eq("role", "admin"),
      supabase.from("spaces").select("id,title,county,town,status,views,price,listing_type").order("created_at", { ascending: false }),
      supabase.from("feedback").select("*").order("created_at", { ascending: false }),
    ]);
    const all = spacesAll.data ?? [];
    setStats({
      seekers: seekers.count ?? 0, owners: owners.count ?? 0, admins: admins.count ?? 0,
      spaces: all.length, active: all.filter((s) => s.status === "active").length,
      inactive: all.filter((s) => s.status === "inactive").length,
      views: all.reduce((s, r) => s + (r.views ?? 0), 0),
    });
    setSpaces(all);
    setFeedback(fb.data ?? []);
  };
  useEffect(() => { load(); }, []);

  const toggleStatus = async (id: string, current: string) => {
    const next = current === "active" ? "inactive" : "active";
    await supabase.from("spaces").update({ status: next }).eq("id", id);
    toast.success(`Listing ${next}`); load();
  };
  const removeSpace = async (id: string) => {
    if (!confirm("Permanently delete this listing?")) return;
    await supabase.from("spaces").delete().eq("id", id); load();
  };
  const dismissFeedback = async (id: string) => {
    await supabase.from("feedback").delete().eq("id", id); load();
  };

  return (
    <DashboardShell nav={NAV} accent="savanna">
      <div className="space-y-10">
        <h1 className="font-display text-3xl font-bold">Admin control center</h1>
        <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {[
            ["Seekers", stats.seekers], ["Owners", stats.owners], ["Admins", stats.admins],
            ["Total Spaces", stats.spaces], ["Active", stats.active], ["Inactive", stats.inactive],
            ["Total Views", stats.views],
          ].map(([l, v]) => (
            <div key={l as string} className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs text-muted-foreground">{l}</p>
              <p className="mt-1 font-display text-2xl font-bold">{(v as number).toLocaleString()}</p>
            </div>
          ))}
        </div>
        <section>
          <h2 className="font-display text-xl font-bold">Manage spaces</h2>
          <div className="mt-3 divide-y divide-border rounded-2xl border border-border bg-card">
            {spaces.map((s) => (
              <div key={s.id} className="flex flex-wrap items-center gap-3 p-4">
                <div className="min-w-0 flex-1">
                  <p className="font-semibold truncate">{s.title}</p>
                  <p className="text-xs text-muted-foreground">{s.town}, {s.county} · {s.status} · {s.views} views</p>
                </div>
                <Button size="sm" variant="outline" onClick={() => toggleStatus(s.id, s.status)}>{s.status === "active" ? "Deactivate" : "Activate"}</Button>
                <Button size="sm" variant="outline" onClick={() => removeSpace(s.id)}>Delete</Button>
              </div>
            ))}
            {spaces.length === 0 && <p className="p-6 text-center text-muted-foreground">No spaces yet.</p>}
          </div>
        </section>
        <section>
          <h2 className="font-display text-xl font-bold">User feedback</h2>
          <div className="mt-3 space-y-3">
            {feedback.map((m) => (
              <div key={m.id} className="rounded-xl border border-border bg-card p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm font-semibold">{m.user_role} · rating {m.rating ?? "—"}</p>
                  <Button size="sm" variant="ghost" onClick={() => dismissFeedback(m.id)}>Dismiss</Button>
                </div>
                <p className="mt-2 text-sm">{m.message}</p>
                <p className="mt-1 text-xs text-muted-foreground">{new Date(m.created_at).toLocaleString()}</p>
              </div>
            ))}
            {feedback.length === 0 && <p className="rounded-xl border border-dashed border-border p-6 text-center text-muted-foreground">No feedback yet.</p>}
          </div>
        </section>
      </div>
    </DashboardShell>
  );
}