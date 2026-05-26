import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PublicNav } from "@/components/site/PublicNav";
import { Footer } from "@/components/site/Footer";
import { SpaceCard, type SpaceSummary } from "@/components/space/SpaceCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, MapPin, Search, Sparkles, Store, Users } from "lucide-react";
import heroImage from "@/assets/hero-aerial.jpg";

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
        .limit(8);
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

      {/* HERO */}
      <section className="relative overflow-hidden gradient-hero">
        <div className="absolute inset-0 pattern-beadwork opacity-15" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 md:grid-cols-2 md:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-white/90 backdrop-blur">
              <Sparkles className="h-3.5 w-3.5 text-gold" /> Built in Kenya, for Kenya
            </span>
            <h1 className="mt-5 font-display text-5xl font-bold leading-[1.04] text-white md:text-6xl lg:text-7xl">
              Commercial spaces across Kenya, <span className="text-gold">at your fingertips.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg text-white/85">
              Discover shops, offices, godowns and stalls in every county. See pinned locations,
              real photos, and contact owners directly — without leaving home.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="bg-gold font-semibold text-[color:var(--savanna-foreground)] hover:bg-gold/90">
                <Link to="/seeker/login">
                  <Search className="mr-2 h-4 w-4" /> Find a Space
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-white/40 bg-white/10 text-white hover:bg-white/20">
                <Link to="/owner/login">
                  <Store className="mr-2 h-4 w-4" /> List a Space
                </Link>
              </Button>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-gold/20 blur-3xl" />
            <img
              src={heroImage}
              alt="Aerial view of a Kenyan city at golden hour"
              width={1600}
              height={900}
              className="relative w-full rounded-3xl shadow-elegant ring-1 ring-white/10"
            />
          </div>
        </div>
      </section>

      {/* AUDIENCE CHOOSER (moved from seeker dashboard) */}
      <section className="mx-auto -mt-12 max-w-6xl px-4">
        <div className="grid gap-5 rounded-3xl border border-border bg-card p-6 shadow-elegant md:grid-cols-2">
          <Link
            to="/seeker/login"
            className="group flex items-start gap-4 rounded-2xl border border-border bg-background p-6 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-soft"
          >
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-xl font-semibold">Looking for a space</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Browse listings, filter by county and price, and contact owners directly.
              </p>
              <span className="mt-3 inline-flex items-center text-sm font-medium text-primary">
                Find a space <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
          <Link
            to="/owner/login"
            className="group flex items-start gap-4 rounded-2xl border border-border bg-background p-6 transition hover:-translate-y-0.5 hover:border-primary hover:shadow-soft"
          >
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gold">
              <Store className="h-5 w-5" />
            </div>
            <div>
              <p className="font-display text-xl font-semibold">Have a space to rent out</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Publish your space with photos and a map pin. Receive direct enquiries.
              </p>
              <span className="mt-3 inline-flex items-center text-sm font-medium text-primary">
                List a space <ArrowRight className="ml-1 h-4 w-4 transition group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20">
        <p className="font-display text-xs uppercase tracking-[0.2em] text-gold">What is Find a Space KE</p>
        <h2 className="mt-3 font-display text-3xl font-bold md:text-4xl">
          The premium way to discover commercial spaces across Kenya — without leaving your home.
        </h2>
        <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
          Whether you are in Kisumu looking for office space in Nakuru, or in Mombasa hunting for a market
          stall in Eldoret, the entire country is now searchable from one place. Every listing has a map
          pin, real photos, the asking price, and a direct line to the owner.
        </p>
      </section>

      <section className="bg-secondary/40 py-20">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="font-display text-xs uppercase tracking-[0.2em] text-gold">Featured spaces</p>
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
        <div className="grid gap-6 rounded-3xl border border-border bg-card p-10 md:grid-cols-3">
          {[
            { v: stats.spaces, l: "Active spaces", icon: Building2 },
            { v: stats.counties, l: "Counties represented", icon: MapPin },
            { v: stats.owners, l: "Owners registered", icon: Users },
          ].map(({ v, l, icon: Icon }) => (
            <div key={l} className="text-center">
              <Icon className="mx-auto h-7 w-7 text-gold" />
              <p className="mt-3 font-display text-4xl font-bold">{v.toLocaleString()}</p>
              <p className="mt-1 text-sm text-muted-foreground">{l}</p>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
