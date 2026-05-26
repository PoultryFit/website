import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, ExternalLink, Heart, MapPin, Phone, Share2 } from "lucide-react";
import { MapView } from "@/components/map/MapView";

const NAV = [
  { to: "/seeker", label: "Home" },
  { to: "/seeker/browse", label: "Browse Spaces" },
  { to: "/seeker/saved", label: "Saved" },
];

interface Space {
  id: string; title: string; description: string; space_type: string; listing_type: "rent" | "sale";
  county: string; town: string; estate: string | null; price: number; price_negotiable: boolean;
  size_sqft: number | null; amenities: string[]; images: string[];
  latitude: number | null; longitude: number | null; owner_id: string; views: number;
}
interface Owner { full_name: string; phone: string }

export default function SpaceDetail() {
  const { id = "" } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [space, setSpace] = useState<Space | null>(null);
  const [owner, setOwner] = useState<Owner | null>(null);
  const [cover, setCover] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: s } = await supabase.from("spaces").select("*").eq("id", id).single();
      if (!s) return;
      setSpace(s as Space);
      supabase.rpc("increment_space_views", { _space_id: id });
      const { data: o } = await supabase.from("space_owners").select("full_name,phone").eq("id", (s as Space).owner_id).single();
      setOwner(o as Owner);
      if (user) {
        const { data: sv } = await supabase.from("saved_spaces").select("id").eq("seeker_id", user.id).eq("space_id", id).maybeSingle();
        setSaved(!!sv);
      }
    })();
  }, [id, user]);

  const toggleSave = async () => {
    if (!user || !space) return;
    if (saved) {
      await supabase.from("saved_spaces").delete().eq("seeker_id", user.id).eq("space_id", space.id);
      setSaved(false); toast.success("Removed from saved");
    } else {
      await supabase.from("saved_spaces").insert({ seeker_id: user.id, space_id: space.id });
      setSaved(true); toast.success("Saved");
    }
  };

  const share = async () => {
    const url = window.location.href;
    if (navigator.share) try { await navigator.share({ url, title: space?.title }); return; } catch { /* */ }
    await navigator.clipboard.writeText(url);
    toast.success("Link copied to clipboard");
  };

  if (!space) return <DashboardShell nav={NAV} accent="primary"><p className="text-muted-foreground">Loading…</p></DashboardShell>;

  const isRent = space.listing_type === "rent";
  const hasMap = space.latitude != null && space.longitude != null;
  const mapsLink = hasMap ? `https://www.google.com/maps?q=${space.latitude},${space.longitude}` : "#";

  return (
    <DashboardShell nav={NAV} accent="primary">
      <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4 -ml-2">
        <ArrowLeft className="mr-1 h-4 w-4" /> Back
      </Button>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-8">
          <div className="overflow-hidden rounded-3xl bg-muted aspect-[16/10] shadow-elegant">
            {space.images[cover] ? (
              <img src={space.images[cover]} alt={space.title} className="h-full w-full object-cover" />
            ) : <div className="grid h-full w-full place-items-center text-muted-foreground">No image</div>}
          </div>
          {space.images.length > 1 && (
            <div className="grid grid-cols-5 gap-2">
              {space.images.map((img, i) => (
                <button key={img} onClick={() => setCover(i)} className={`aspect-square overflow-hidden rounded-md border-2 transition ${i === cover ? "border-primary" : "border-transparent hover:border-border"}`}>
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}

          <div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-secondary px-3 py-1 text-xs font-medium">{space.space_type}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${isRent ? "bg-gold text-[color:var(--savanna-foreground)]" : "bg-maasai text-maasai-foreground"}`}>
                {isRent ? "For Rent" : "For Sale"}
              </span>
              {space.price_negotiable && <span className="rounded-full border border-border px-3 py-1 text-xs font-medium text-foreground">Negotiable</span>}
            </div>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight md:text-5xl">{space.title}</h1>
            <p className="mt-3 flex items-center gap-1.5 text-muted-foreground">
              <MapPin className="h-4 w-4 text-gold" /> {[space.estate, space.town, space.county].filter(Boolean).join(", ")}
            </p>
            <p className="mt-5 font-display text-4xl font-bold text-primary">
              KSh {Number(space.price).toLocaleString()}
              {isRent && <span className="ml-2 text-sm font-medium text-muted-foreground">per month</span>}
            </p>
          </div>

          {space.size_sqft && (
            <div className="inline-flex flex-col rounded-2xl border border-border bg-card px-5 py-4">
              <p className="text-xs uppercase tracking-wider text-muted-foreground">Size</p>
              <p className="mt-1 font-display text-2xl font-semibold">{Number(space.size_sqft).toLocaleString()} sqft</p>
            </div>
          )}

          <div>
            <h2 className="font-display text-2xl font-semibold">About this space</h2>
            <p className="mt-3 whitespace-pre-line text-foreground/85 leading-relaxed">{space.description}</p>
          </div>

          {space.amenities.length > 0 && (
            <div>
              <h2 className="font-display text-2xl font-semibold">Amenities</h2>
              <div className="mt-3 flex flex-wrap gap-2">
                {space.amenities.map((a) => (
                  <span key={a} className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium">{a}</span>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-end justify-between">
              <h2 className="font-display text-2xl font-semibold">Location</h2>
              {hasMap && (
                <a
                  href={mapsLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium hover:border-primary hover:text-primary transition"
                >
                  Open in Google Maps <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
            {hasMap ? (
              <div className="mt-3">
                <MapView lat={space.latitude!} lng={space.longitude!} height={460} />
                <p className="mt-2 text-xs text-muted-foreground">Zoom in for aerial detail. Drag to pan around the area.</p>
              </div>
            ) : (
              <p className="mt-3 text-sm text-muted-foreground">Map location not yet pinned by the owner.</p>
            )}
          </div>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-20 h-fit">
          <div className="rounded-3xl border border-border bg-card p-6 shadow-elegant">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Owner</p>
            <p className="mt-1 font-display text-xl font-semibold">{owner?.full_name ?? "—"}</p>
            <p className="text-sm text-muted-foreground">{space.space_type} · {space.town}, {space.county}</p>
            <Button asChild className="mt-4 w-full bg-primary text-primary-foreground hover:bg-primary/90" size="lg">
              <a href={`tel:${owner?.phone ?? ""}`}>
                <Phone className="mr-2 h-4 w-4" /> {owner?.phone ?? "Call owner"}
              </a>
            </Button>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <Button variant="outline" onClick={toggleSave}>
                <Heart className={`mr-2 h-4 w-4 ${saved ? "fill-primary text-primary" : ""}`} /> {saved ? "Saved" : "Save"}
              </Button>
              <Button variant="outline" onClick={share}><Share2 className="mr-2 h-4 w-4" /> Share</Button>
            </div>
          </div>
        </aside>
      </div>
    </DashboardShell>
  );
}
