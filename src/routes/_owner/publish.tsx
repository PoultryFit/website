import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AMENITY_GROUPS, KENYA_COUNTIES, SPACE_TYPES } from "@/lib/counties";
import { toast } from "sonner";
import { Upload, X } from "lucide-react";

const NAV = [
  { to: "/owner", label: "My Spaces" },
  { to: "/owner/publish", label: "Publish a Space" },
];

export const Route = createFileRoute("/_owner/publish")({
  validateSearch: (s: Record<string, unknown>) => ({ id: typeof s.id === "string" ? s.id : "" }),
  component: Publish,
});

const STEPS = ["Basics", "Details", "Amenities", "Photos", "Location", "Review"];

function Publish() {
  const { id } = Route.useSearch();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [f, setF] = useState({
    title: "", space_type: "Shop", county: "Nairobi", town: "", estate: "",
    listing_type: "rent" as "rent" | "sale", price: "", price_negotiable: false,
    size_sqft: "", description: "",
    amenities: [] as string[], images: [] as string[],
    latitude: "" as string, longitude: "" as string,
  });

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase.from("spaces").select("*").eq("id", id).single();
      if (!data) return;
      setF({
        title: data.title, space_type: data.space_type, county: data.county, town: data.town,
        estate: data.estate ?? "", listing_type: data.listing_type, price: String(data.price),
        price_negotiable: data.price_negotiable, size_sqft: data.size_sqft ? String(data.size_sqft) : "",
        description: data.description, amenities: data.amenities ?? [], images: data.images ?? [],
        latitude: data.latitude != null ? String(data.latitude) : "",
        longitude: data.longitude != null ? String(data.longitude) : "",
      });
    })();
  }, [id]);

  const uploadImage = async (file: File) => {
    if (!user) return;
    if (f.images.length >= 10) { toast.error("Max 10 images"); return; }
    const path = `${user.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, "_")}`;
    const { error } = await supabase.storage.from("space-images").upload(path, file);
    if (error) { toast.error(error.message); return; }
    const { data } = supabase.storage.from("space-images").getPublicUrl(path);
    setF((s) => ({ ...s, images: [...s.images, data.publicUrl] }));
  };

  const removeImage = (url: string) => setF((s) => ({ ...s, images: s.images.filter((u) => u !== url) }));

  const submit = async () => {
    if (!user) return;
    if (f.images.length === 0) { toast.error("Add at least one photo"); setStep(3); return; }
    setSaving(true);
    const payload = {
      owner_id: user.id, title: f.title, description: f.description, space_type: f.space_type,
      listing_type: f.listing_type, county: f.county, town: f.town, estate: f.estate || null,
      price: Number(f.price), price_negotiable: f.price_negotiable,
      size_sqft: f.size_sqft ? Number(f.size_sqft) : null,
      amenities: f.amenities, images: f.images,
      latitude: f.latitude ? Number(f.latitude) : null,
      longitude: f.longitude ? Number(f.longitude) : null,
      status: "active",
    };
    const { error } = id
      ? await supabase.from("spaces").update(payload).eq("id", id)
      : await supabase.from("spaces").insert(payload);
    setSaving(false);
    if (error) { toast.error(error.message); return; }
    toast.success(id ? "Listing updated" : "Listing published");
    navigate({ to: "/owner" });
  };

  const next = () => setStep((s) => Math.min(s + 1, STEPS.length - 1));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <DashboardShell nav={NAV} accent="highland">
      <h1 className="font-display text-3xl font-bold">{id ? "Edit space" : "Publish a space"}</h1>

      <div className="mt-6 flex items-center gap-2 overflow-x-auto">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2 shrink-0">
            <div className={`grid h-8 w-8 place-items-center rounded-full text-sm font-semibold ${
              i === step ? "bg-highland text-highland-foreground" : i < step ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
            }`}>{i + 1}</div>
            <span className={`text-sm ${i === step ? "font-semibold" : "text-muted-foreground"}`}>{s}</span>
            {i < STEPS.length - 1 && <div className="mx-2 h-px w-8 bg-border" />}
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-border bg-card p-6 max-w-3xl">
        {step === 0 && (
          <div className="space-y-4">
            <div><Label>Space title</Label><Input value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} placeholder="Modern shop space on Moi Avenue" /></div>
            <div className="grid sm:grid-cols-2 gap-3">
              <div><Label>Space type</Label>
                <Select value={f.space_type} onValueChange={(v) => setF({ ...f, space_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{SPACE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Listing type</Label>
                <Select value={f.listing_type} onValueChange={(v) => setF({ ...f, listing_type: v as "rent" | "sale" })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent><SelectItem value="rent">Monthly Rental</SelectItem><SelectItem value="sale">Outright Sale</SelectItem></SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid sm:grid-cols-3 gap-3">
              <div><Label>County</Label>
                <Select value={f.county} onValueChange={(v) => setF({ ...f, county: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{KENYA_COUNTIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Town</Label><Input value={f.town} onChange={(e) => setF({ ...f, town: e.target.value })} /></div>
              <div><Label>Estate / area</Label><Input value={f.estate} onChange={(e) => setF({ ...f, estate: e.target.value })} /></div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3 items-end">
              <div><Label>Price (KSh)</Label><Input type="number" value={f.price} onChange={(e) => setF({ ...f, price: e.target.value })} /></div>
              <label className="flex items-center gap-3 pt-6"><Switch checked={f.price_negotiable} onCheckedChange={(v) => setF({ ...f, price_negotiable: v })} /> <span className="text-sm">Price is negotiable</span></label>
            </div>
          </div>
        )}
        {step === 1 && (
          <div className="space-y-4">
            <div><Label>Size (sqft)</Label><Input type="number" value={f.size_sqft} onChange={(e) => setF({ ...f, size_sqft: e.target.value })} /></div>
            <div><Label>Description</Label><Textarea rows={8} value={f.description} onChange={(e) => setF({ ...f, description: e.target.value })} placeholder="Describe the space, location advantages, condition, and anything a seeker should know." /></div>
          </div>
        )}
        {step === 2 && (
          <div className="space-y-6">
            {Object.entries(AMENITY_GROUPS).map(([group, items]) => (
              <div key={group}>
                <p className="font-display text-base font-semibold">{group}</p>
                <div className="mt-2 grid sm:grid-cols-2 gap-2">
                  {items.map((a) => (
                    <label key={a} className="flex items-start gap-2 text-sm cursor-pointer">
                      <Checkbox checked={f.amenities.includes(a)} onCheckedChange={() => setF((s) => ({
                        ...s, amenities: s.amenities.includes(a) ? s.amenities.filter((x) => x !== a) : [...s.amenities, a],
                      }))} />
                      <span>{a}</span>
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">Upload between 1 and 10 photos. The first photo is the cover.</p>
            <label className="flex h-32 cursor-pointer items-center justify-center rounded-xl border-2 border-dashed border-border hover:border-primary bg-secondary/30">
              <input type="file" accept="image/*" multiple className="hidden" onChange={async (e) => {
                const files = Array.from(e.target.files ?? []);
                for (const file of files) await uploadImage(file);
                e.target.value = "";
              }} />
              <span className="flex items-center gap-2 text-muted-foreground"><Upload className="h-4 w-4" /> Tap to upload images</span>
            </label>
            {f.images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                {f.images.map((url, i) => (
                  <div key={url} className="relative aspect-square overflow-hidden rounded-md border border-border">
                    <img src={url} alt="" className="h-full w-full object-cover" />
                    {i === 0 && <span className="absolute left-1 top-1 rounded bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">Cover</span>}
                    <button onClick={() => removeImage(url)} className="absolute right-1 top-1 rounded-full bg-background/90 p-1"><X className="h-3 w-3" /></button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {step === 4 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Pin your exact location. You can find coordinates by opening Google Maps, right-clicking the
              spot, and copying the lat/lng pair. Then paste them below.
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              <div><Label>Latitude</Label><Input value={f.latitude} onChange={(e) => setF({ ...f, latitude: e.target.value })} placeholder="-1.286389" /></div>
              <div><Label>Longitude</Label><Input value={f.longitude} onChange={(e) => setF({ ...f, longitude: e.target.value })} placeholder="36.817223" /></div>
            </div>
            {f.latitude && f.longitude && (
              <div className="overflow-hidden rounded-xl border border-border">
                <iframe title="Preview" className="h-72 w-full" loading="lazy"
                  src={`https://www.google.com/maps?q=${f.latitude},${f.longitude}&t=k&z=17&output=embed`} />
              </div>
            )}
          </div>
        )}
        {step === 5 && (
          <div className="space-y-3">
            <h2 className="font-display text-xl font-semibold">Review</h2>
            <ul className="text-sm space-y-1">
              <li><strong>Title:</strong> {f.title}</li>
              <li><strong>Type:</strong> {f.space_type} · {f.listing_type === "rent" ? "For Rent" : "For Sale"}</li>
              <li><strong>Location:</strong> {[f.estate, f.town, f.county].filter(Boolean).join(", ")}</li>
              <li><strong>Price:</strong> KSh {Number(f.price || 0).toLocaleString()} {f.price_negotiable ? "(negotiable)" : ""}</li>
              <li><strong>Size:</strong> {f.size_sqft || "—"} sqft</li>
              <li><strong>Amenities:</strong> {f.amenities.length}</li>
              <li><strong>Photos:</strong> {f.images.length}</li>
              <li><strong>Pinned:</strong> {f.latitude && f.longitude ? "Yes" : "No"}</li>
            </ul>
          </div>
        )}

        <div className="mt-8 flex justify-between">
          <Button variant="outline" onClick={back} disabled={step === 0}>Back</Button>
          {step < STEPS.length - 1 ? (
            <Button onClick={next} className="bg-highland text-highland-foreground hover:bg-highland/90">Next</Button>
          ) : (
            <Button onClick={submit} disabled={saving} className="bg-highland text-highland-foreground hover:bg-highland/90">
              {saving ? "Publishing…" : id ? "Save changes" : "Publish listing"}
            </Button>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
