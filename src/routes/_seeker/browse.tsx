import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { SpaceCard, type SpaceSummary } from "@/components/space/SpaceCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { ALL_AMENITIES, KENYA_COUNTIES, SPACE_TYPES } from "@/lib/counties";

const NAV = [
  { to: "/seeker", label: "Home" },
  { to: "/seeker/browse", label: "Browse Spaces" },
  { to: "/seeker/saved", label: "Saved" },
];

export const Route = createFileRoute("/_seeker/browse")({
  validateSearch: (s: Record<string, unknown>) => ({
    county: typeof s.county === "string" ? s.county : "",
  }),
  component: Browse,
});

function Browse() {
  const { county: initCounty } = Route.useSearch();
  const [county, setCounty] = useState(initCounty || "all");
  const [town, setTown] = useState("");
  const [type, setType] = useState("all");
  const [listing, setListing] = useState("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minSize, setMinSize] = useState("");
  const [maxSize, setMaxSize] = useState("");
  const [amenities, setAmenities] = useState<string[]>([]);
  const [results, setResults] = useState<SpaceSummary[]>([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    setLoading(true);
    let q = supabase.from("spaces")
      .select("id,title,space_type,listing_type,county,town,price,images,amenities,size_sqft")
      .eq("status", "active");
    if (county !== "all") q = q.eq("county", county);
    if (town.trim()) q = q.ilike("town", `%${town.trim()}%`);
    if (type !== "all") q = q.eq("space_type", type);
    if (listing !== "all") q = q.eq("listing_type", listing);
    if (minPrice) q = q.gte("price", Number(minPrice));
    if (maxPrice) q = q.lte("price", Number(maxPrice));
    if (minSize) q = q.gte("size_sqft", Number(minSize));
    if (maxSize) q = q.lte("size_sqft", Number(maxSize));
    if (amenities.length) q = q.contains("amenities", amenities);

    const { data } = await q.order("created_at", { ascending: false }).limit(60);
    setResults((data ?? []) as SpaceSummary[]);
    setLoading(false);
  };

  useEffect(() => { search(); /* eslint-disable-next-line */ }, []);

  const toggleAmenity = (a: string) =>
    setAmenities((arr) => arr.includes(a) ? arr.filter((x) => x !== a) : [...arr, a]);

  return (
    <DashboardShell nav={NAV} accent="primary">
      <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
        <aside className="rounded-2xl border border-border bg-card p-5 h-fit sticky top-20 max-h-[calc(100vh-6rem)] overflow-y-auto">
          <h2 className="font-display text-lg font-semibold">Filters</h2>
          <div className="mt-4 space-y-4">
            <div><Label>County</Label>
              <Select value={county} onValueChange={setCounty}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="all">All counties</SelectItem>
                  {KENYA_COUNTIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Town or area</Label><Input value={town} onChange={(e) => setTown(e.target.value)} placeholder="e.g. Westlands" /></div>
            <div><Label>Space type</Label>
              <Select value={type} onValueChange={setType}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent><SelectItem value="all">All types</SelectItem>
                  {SPACE_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div><Label>Listing type</Label>
              <Select value={listing} onValueChange={setListing}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">For Rent or Sale</SelectItem>
                  <SelectItem value="rent">For Rent</SelectItem>
                  <SelectItem value="sale">For Sale</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label>Min price</Label><Input type="number" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} /></div>
              <div><Label>Max price</Label><Input type="number" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div><Label>Min sqft</Label><Input type="number" value={minSize} onChange={(e) => setMinSize(e.target.value)} /></div>
              <div><Label>Max sqft</Label><Input type="number" value={maxSize} onChange={(e) => setMaxSize(e.target.value)} /></div>
            </div>
            <div>
              <Label>Amenities</Label>
              <div className="mt-2 max-h-48 overflow-y-auto rounded-md border border-border p-3 space-y-2">
                {ALL_AMENITIES.map((a) => (
                  <label key={a} className="flex items-start gap-2 text-sm cursor-pointer">
                    <Checkbox checked={amenities.includes(a)} onCheckedChange={() => toggleAmenity(a)} />
                    <span>{a}</span>
                  </label>
                ))}
              </div>
            </div>
            <Button onClick={search} className="w-full">{loading ? "Searching…" : "Apply filters"}</Button>
          </div>
        </aside>

        <div>
          <div className="flex items-baseline justify-between">
            <h1 className="font-display text-3xl font-bold">Browse spaces</h1>
            <p className="text-sm text-muted-foreground">{results.length} result{results.length === 1 ? "" : "s"}</p>
          </div>
          {results.length === 0 ? (
            <p className="mt-6 rounded-xl border border-dashed border-border bg-card p-10 text-center text-muted-foreground">
              No spaces match these filters. Try widening your search.
            </p>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((s) => <SpaceCard key={s.id} space={s} href={`/seeker/spaces/${s.id}`} />)}
            </div>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}
