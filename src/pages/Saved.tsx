import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { SpaceCard, type SpaceSummary } from "@/components/space/SpaceCard";
import { Heart } from "lucide-react";

const NAV = [
  { to: "/seeker", label: "Home" },
  { to: "/seeker/browse", label: "Browse Spaces" },
  { to: "/seeker/saved", label: "Saved" },
];

export default function Saved() {
  const { user } = useAuth();
  const [items, setItems] = useState<SpaceSummary[]>([]);

  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data } = await supabase
        .from("saved_spaces")
        .select("space:spaces(id,title,space_type,listing_type,county,town,price,images)")
        .eq("seeker_id", user.id);
      setItems((data ?? []).map((r: any) => r.space).filter(Boolean));
    })();
  }, [user]);

  return (
    <DashboardShell nav={NAV} accent="primary">
      <h1 className="font-display text-3xl font-bold">Saved spaces</h1>
      {items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-border bg-card p-12 text-center">
          <Heart className="mx-auto h-8 w-8 text-muted-foreground" />
          <p className="mt-3 text-muted-foreground">Nothing saved yet. Tap the heart icon on any listing to save it for later.</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((s) => <SpaceCard key={s.id} space={s} href={`/seeker/spaces/${s.id}`} />)}
        </div>
      )}
    </DashboardShell>
  );
}