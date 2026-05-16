import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PublicNav } from "@/components/site/PublicNav";
import { Footer } from "@/components/site/Footer";
import { SpaceCard, type SpaceSummary } from "@/components/space/SpaceCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, MapPin, Search, Sparkles, Store, Users } from "lucide-react";

export default function Landing() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();
  const [featured, setFeatured] = useState<SpaceSummary[]>([]);
  const [stats, setStats] = useState({ spaces: 0, counties: 0, owners: 0 });

  useEffect(() => {
    if (!loading && user && role) {
      const target = role === "admin" ? "/admin" : role === "owner" ? "/owner" : "/seeker";
      navigate(target);
    }
  }, [user, role, loading, navigate]);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("spaces")
        .select("id,title,space_type,listing_type,county,town,price,images")
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(10);
      setFeatured((data ?? []) as SpaceSummary[]);

      const [{ count: sc }, { data: countyData }, { count: oc }] = await Promise.all([
        supabase.from("spaces").select("*", { count: "exact", head: true }).eq("status", "active"),
        supabase.from("spaces").select("county").eq("status", "active"),
        supabase.from("space_owners").select("*", { count: "exact", head: true }),
      ]);
      const unique = new Set((countyData ?? []).map((r) => r.county));
      setStats({ spaces: sc ?? 0, counties: unique.size, owners: oc ?? 0 });
    })();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <section className="relative overflow-hidden gradient-hero">
        <div className="absolute inset-0 pattern-beadwork opacity-20" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" /> Built in Kenya, for Kenya
            </span>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.05] text-white md:text-7xl">
              Find a commercial space anywhere in Kenya, from anywhere in Kenya.
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-white/85">
              Someone in Murang'a can browse available shops in Nairobi, see the pinned location on a map,
              and contact the owner directly. No travel. No middlemen. All 47 counties.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-white text-primary hover:bg-white/90">
                <Link to="/seeker/signup">
                  <Search className="mr-2 h-4 w-4" /> Looking for a Space
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20">
                <Link to="/owner/signup">
                  <Store className="mr-2 h-4 w-4" /> I Have a Space to Rent
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20">
        <p className="font-display text-xs uppercase tracking-[0.2em] text-primary">What is Find a Space KE</p>
        <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
          A simple way to discover commercial spaces across Kenya without leaving your home.
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          Finding a shop, office, godown or stall used to mean travelling town to town, knocking on doors,
          following up with agents. Find a Space KE changes that. Every listing has a map pin so you see
          exactly where the space sits, real photos from the owner, the asking price, and a direct line to
          contact the owner yourself. Whether you are in Kisumu looking for office space in Nakuru, or in
          Mombasa hunting for a market stall in Eldoret, the entire country is now searchable from one place.
        </p>
      </section>

      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-display text-xs uppercase tracking-[0.2em] text-primary">Featured spaces</p>
              <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">Live listings from owners across Kenya</h2>
            </div>
            <Link to="/seeker/login" className="hidden text-sm font-medium text-primary hover:underline md:inline">
              Browse all <ArrowRight className="ml-1 inline h-4 w-4" />
            </Link>
          </div>

          {featured.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-dashed border-border bg-background p-12 text-center">
              <p className="text-muted-foreground">No spaces have been listed yet. Be the first to publish one.</p>
              <Button asChild className="mt-4">
                <Link to="/owner/signup">List your space</Link>
              </Button>
            </div>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {featured.map((s) => (
                <SpaceCard key={s.id} space={s} href="/seeker/login" />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <p className="font-display text-xs uppercase tracking-[0.2em] text-primary">How it works</p>
        <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">Two clear paths</h2>
        <div className="mt-12 grid gap-10 md:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <Search className="h-3.5 w-3.5" /> Space Seekers
            </div>
            <h3 className="mt-4 font-display text-2xl font-semibold">Find your next space in three steps</h3>
            <ol className="mt-6 space-y-5">
              {["Sign up as a Space Seeker", "Browse and filter by county, type and price", "Contact the owner directly"].map((t, i) => (
                <li key={t} className="flex gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground font-display font-bold">{i + 1}</span>
                  <span className="pt-1.5 text-base">{t}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-2xl border border-border bg-card p-8">
            <div className="inline-flex items-center gap-2 rounded-full bg-highland/10 px-3 py-1 text-xs font-semibold text-highland">
              <Store className="h-3.5 w-3.5" /> Space Owners
            </div>
            <h3 className="mt-4 font-display text-2xl font-semibold">List your space and get discovered</h3>
            <ol className="mt-6 space-y-5">
              {["Sign up as a Space Owner", "Publish your space with photos and a map pin", "Receive direct enquiries from seekers"].map((t, i) => (
                <li key={t} className="flex gap-4">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-highland text-highland-foreground font-display font-bold">{i + 1}</span>
                  <span className="pt-1.5 text-base">{t}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-6xl px-4">
          <p className="font-display text-xs uppercase tracking-[0.2em] text-primary">Who it is for</p>
          <h2 className="mt-2 font-display text-3xl font-bold md:text-4xl">Built for the way Kenya does business</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { t: "Entrepreneurs", d: "Looking for a shop or stall to launch a venture." },
              { t: "Small business owners", d: "Ready to relocate or open a second branch." },
              { t: "Market traders", d: "Searching for stalls in busy market spaces." },
              { t: "Office seekers", d: "Needing private or shared workspace in any town." },
              { t: "Warehouse seekers", d: "Hunting godowns, containers and storage units." },
              { t: "Space owners", d: "Wanting your property discovered across Kenya." },
            ].map((x) => (
              <div key={x.t} className="rounded-2xl border border-border bg-card p-6">
                <p className="font-display text-lg font-semibold">{x.t}</p>
                <p className="mt-1 text-sm text-muted-foreground">{x.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="grid gap-6 rounded-3xl border border-border bg-card p-10 md:grid-cols-3">
          {[
            { v: stats.spaces, l: "Active spaces", icon: Building2 },
            { v: stats.counties, l: "Counties represented", icon: MapPin },
            { v: stats.owners, l: "Owners registered", icon: Users },
          ].map(({ v, l, icon: Icon }) => (
            <div key={l} className="text-center">
              <Icon className="mx-auto h-7 w-7 text-primary" />
              <p className="mt-3 font-display text-4xl font-bold">{v.toLocaleString()}</p>
              <p className="mt-1 text-sm text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 pb-20">
        <div className="rounded-3xl border border-savanna/40 bg-savanna/15 p-10 text-center">
          <p className="font-display text-xs uppercase tracking-[0.2em] text-primary">A note from us</p>
          <h2 className="mt-2 font-display text-2xl font-semibold md:text-3xl">
            We are in our onboarding period
          </h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/80">
            Right now every feature is fully open and free to use. When we introduce plan options later
            on, you will hear from us well in advance with clear details. For now, focus on what matters,
            list your space or find your next one.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}