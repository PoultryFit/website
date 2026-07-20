import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { FeasibilityTeaser } from "@/components/FeasibilityTeaser";
import { ArrowRight, Ruler, ClipboardList, Wheat, Stethoscope, Sparkles, Scale, MapPin, Calculator, GraduationCap } from "lucide-react";
import heroImage from "@/assets/hero-coop.jpg";
import aboutImage from "@/assets/about-hands.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PoultryFit Kenya — Plan your urban flock with confidence" },
      { name: "description", content: "PoultryFit Kenya helps first-time urban poultry keepers plan a feasible flock based on space, budget, local bylaws, real feed prices, and disease triage." },
      { property: "og:title", content: "PoultryFit Kenya" },
      { property: "og:description", content: "Decision-support for first-time urban poultry keepers in Kenya." },
      { property: "og:image", content: heroImage },
      { name: "twitter:image", content: heroImage },
    ],
  }),
  component: HomePage,
});

const steps = [
  { icon: Ruler, n: "01", title: "Tell us your space and budget", body: "Share what you have to work with, square metres and shillings. No guesswork required." },
  { icon: ClipboardList, n: "02", title: "Get your flock plan", body: "We tell you how many birds your setup can realistically support, and whether your area allows it." },
  { icon: Wheat, n: "03", title: "Feed it for less", body: "Real local feed pricing keeps recurring costs grounded in what agrovets near you actually charge." },
  { icon: Stethoscope, n: "04", title: "Catch problems early", body: "Disease triage points you to nearby vets and agrovets before a small issue becomes a loss." },
];

const features = [
  { icon: Ruler, title: "Feasibility Planner", body: "A recommended flock size from your actual space, housing type, and budget." },
  { icon: Scale, title: "Bylaw Awareness", body: "Ward and county rules checked before you spend anything, not after." },
  { icon: Stethoscope, title: "Disease Triage", body: "Symptom and photo based triage with an honest, capped confidence level." },
  { icon: MapPin, title: "Vet & Agrovet Finder", body: "Nearby professional support, mapped and reachable in two taps." },
  { icon: Wheat, title: "Costed Feed Plan", body: "A least-cost ration for each growth stage, priced against real local rates." },
  { icon: Calculator, title: "Setup Cost Estimate", body: "What starting right actually costs, before you buy a single bird." },
];

const poultryTypes = ["Layers", "Broilers", "Kienyeji", "Ducks", "Quail", "Turkey"];

function HomePage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative isolate overflow-hidden">
        <div
          className="absolute inset-0 -z-20 bg-cover bg-center scale-105 will-change-transform"
          style={{ backgroundImage: `url(${heroImage})` }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 gradient-hero" aria-hidden />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-background via-background/10 to-transparent" aria-hidden />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-24 pb-28 md:pt-36 md:pb-40">
          <div className="max-w-3xl animate-[fade-in-up_0.8s_cubic-bezier(0.22,1,0.36,1)_both]">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 backdrop-blur px-3 py-1.5 text-xs font-medium text-white">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              JKUAT × JHUB Africa
            </span>
            <h1 className="mt-6 font-display text-4xl sm:text-5xl md:text-6xl font-bold leading-[1.05] text-white drop-shadow-md">
              Know what your space can keep,{" "}
              <span className="bg-gradient-to-r from-accent to-amber-200 bg-clip-text text-transparent">
                before you spend a shilling.
              </span>
            </h1>
            <p className="mt-6 text-lg text-white/85 max-w-2xl">
              PoultryFit Kenya helps first-time urban poultry keepers plan a flock with
              confidence, matching your space and budget to a realistic, locally-aware
              starting point.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link to="/about" className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-dark transition shadow-lift">
                Our vision
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/team" className="inline-flex items-center rounded-md border border-white/30 bg-white/10 backdrop-blur px-5 py-3 text-sm font-medium text-white hover:bg-white/20 transition">
                Meet the team
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-1.5">
              <span className="text-xs font-semibold uppercase tracking-wider text-white/60 mr-1">Built for</span>
              <span className="text-xs font-medium text-white/80">{poultryTypes.join(" · ")}</span>
            </div>
          </div>
        </div>

        {/* Interactive teaser */}
        <div className="mx-auto max-w-6xl px-4 sm:px-6 pb-12 md:pb-0 md:-mt-12 relative z-10">
          <div className="max-w-2xl mx-auto md:mx-0" style={{ animation: "fade-in-up 0.7s 0.2s cubic-bezier(0.22,1,0.36,1) both" }}>
            <FeasibilityTeaser />
          </div>
        </div>
      </section>

      {/* Summary */}
      <section className="relative mx-auto max-w-6xl px-4 sm:px-6 py-20 md:py-28">
        <div className="grid gap-12 md:grid-cols-2 md:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">What it does</p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold leading-tight">
              A feasibility-first <span className="text-gradient-brand">companion</span>
            </h2>
            <div className="mt-5 space-y-4 text-base text-muted-foreground leading-relaxed">
              <p>
                PoultryFit Kenya is a decision-support platform built for first-time urban
                poultry keepers. It plans flock feasibility based on your available space
                and budget, and flags whether your locality allows poultry keeping in the
                first place.
              </p>
              <p>
                The platform grounds recurring costs in real local feed pricing, and pairs
                that with simple disease triage that connects keepers to nearby vets and
                agrovets so problems get caught early, not after they've cost you a bird.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-3xl gradient-brand opacity-20 blur-2xl" aria-hidden />
            <div className="relative overflow-hidden rounded-2xl shadow-lift hover-lift">
              <img
                src={aboutImage}
                alt="A young farmer gently holding a healthy hen"
                width={1600}
                height={1200}
                loading="lazy"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-card/95 backdrop-blur p-4 shadow-soft">
                <p className="text-xs font-semibold uppercase tracking-wider text-primary">Built for Kenyan keepers</p>
                <p className="mt-1 text-sm text-foreground">Decisions grounded in local data, not generic advice.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key features */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 pb-20 md:pb-28">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Key features</p>
          <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold">
            Six things, working together
          </h2>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="group rounded-2xl border border-border bg-card p-6 hover-lift">
                <div className="grid h-11 w-11 place-items-center rounded-xl bg-secondary text-primary transition-transform group-hover:scale-110">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-base font-semibold">{f.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{f.body}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="relative border-y border-border overflow-hidden">
        <div className="absolute inset-0 grain-bg opacity-60" aria-hidden />
        <div className="absolute -top-32 -right-32 h-96 w-96 rounded-full gradient-brand opacity-10 blur-3xl" aria-hidden />
        <div className="absolute -bottom-32 -left-32 h-96 w-96 rounded-full gradient-warm opacity-10 blur-3xl" aria-hidden />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6 py-20 md:py-28">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">How it works</p>
            <h2 className="mt-2 font-display text-3xl md:text-4xl font-bold">
              Four steps from idea to informed start
            </h2>
          </div>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.n}
                  className="group relative rounded-2xl border border-border bg-card p-6 hover-lift"
                >
                  <div className="flex items-center justify-between">
                    <div className="grid h-12 w-12 place-items-center rounded-xl gradient-brand text-primary-foreground shadow-soft transition-transform group-hover:scale-110 group-hover:rotate-3">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="font-display text-xs font-bold tracking-wider text-accent">{s.n}</span>
                  </div>
                  <h3 className="mt-5 font-display text-lg font-semibold">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{s.body}</p>
                  {i < steps.length - 1 && (
                    <div className="hidden lg:block absolute top-12 -right-3 h-px w-6 bg-gradient-to-r from-border to-transparent" aria-hidden />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Backed by */}
      <section className="border-y border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GraduationCap className="h-4 w-4 text-primary" />
            <span>Jomo Kenyatta University of Agriculture and Technology</span>
          </div>
          <span className="hidden sm:inline text-border">|</span>
          <span className="text-sm text-muted-foreground">JHUB Africa Internship Programme</span>
          <span className="hidden sm:inline text-border">|</span>
          <span className="text-sm text-muted-foreground">Supervisor: Mr Simon Mwangi</span>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-20 md:py-28">
        <div
          className="relative overflow-hidden rounded-3xl gradient-brand p-10 md:p-16 text-primary-foreground shadow-lift"
        >
          <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-accent/20 blur-2xl animate-[float_6s_ease-in-out_infinite]" aria-hidden />
          <div className="absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-white/10 blur-2xl" aria-hidden />
          <div
            className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
            style={{ backgroundImage: `url(${heroImage})`, backgroundSize: "cover", backgroundPosition: "center" }}
            aria-hidden
          />
          <div className="relative max-w-2xl">
            <h2 className="font-display text-3xl md:text-4xl font-bold leading-tight">
              Built to help Kenyans start right.
            </h2>
            <p className="mt-4 text-primary-foreground/85 text-lg">
              Learn what we're building, why it matters, and who's behind it.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/about" className="inline-flex items-center rounded-md bg-background px-5 py-3 text-sm font-medium text-foreground hover:bg-secondary transition shadow-soft">
                Read our vision
              </Link>
              <Link to="/team" className="group inline-flex items-center gap-2 rounded-md border border-primary-foreground/30 px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-dark transition">
                Meet the team
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </SiteLayout>
  );
}