import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Target, AlertTriangle, Lightbulb, GraduationCap, ArrowRight } from "lucide-react";
import aboutImage from "@/assets/about-hands.jpg";
import patternImage from "@/assets/pattern-topo.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — PoultryFit Kenya" },
      { name: "description", content: "Our vision: helping first-time urban and peri-urban poultry keepers in Kenya start with confidence instead of guesswork." },
      { property: "og:title", content: "About PoultryFit Kenya" },
      { property: "og:description", content: "A feasibility-first platform for urban poultry keepers in Kenya." },
      { property: "og:image", content: aboutImage },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <SiteLayout>
      {/* Hero */}
      <section className="relative isolate overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 -z-20 opacity-[0.18]"
          style={{ backgroundImage: `url(${patternImage})`, backgroundSize: "cover" }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-surface/80 via-background to-background" aria-hidden />
        <div className="absolute -top-20 -left-20 h-80 w-80 rounded-full gradient-brand opacity-15 blur-3xl" aria-hidden />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-20 md:pt-28 pb-12 grid gap-10 md:grid-cols-2 md:items-center">
          <div className="animate-[fade-in-up_0.7s_cubic-bezier(0.22,1,0.36,1)_both]">
            <p className="text-sm font-semibold uppercase tracking-wider text-primary">About</p>
            <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold leading-tight">
              Helping Kenyans start poultry keeping with{" "}
              <span className="text-gradient-brand">confidence</span>, not guesswork.
            </h1>
            <p className="mt-5 text-muted-foreground text-lg leading-relaxed">
              We want first-time urban and peri-urban poultry keepers in Kenya to start with
              confidence knowing what their space and budget can actually support before
              they commit money to it.
            </p>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 -z-10 rounded-3xl gradient-warm opacity-20 blur-2xl" aria-hidden />
            <img
              src={aboutImage}
              alt="A farmer holding a healthy hen"
              width={1600}
              height={1200}
              loading="lazy"
              className="aspect-[4/3] w-full rounded-2xl object-cover shadow-lift"
            />
          </div>
        </div>
      </section>

      {/* Content blocks */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 md:py-24 space-y-8">
        {[
          {
            icon: Target,
            tone: "primary",
            title: "Our vision",
            body: "Every first-time keeper in urban and peri-urban Kenya should be able to make their first move without guessing  and without losing money to avoidable mistakes.",
          },
          {
            icon: AlertTriangle,
            tone: "accent",
            title: "The problem we're solving",
            body: "Most small-scale poultry keepers have no structured way to know how many birds their space and budget can support, whether their area even allows poultry keeping, what to feed their birds at real local cost, or where to get help when a bird falls sick. The result is avoidable financial losses from overcrowding, wrong feed choices, and untreated disease.",
          },
          {
            icon: Lightbulb,
            tone: "primary",
            title: "Our approach",
            body: "PoultryFit Kenya is a feasibility-first platform not just another farm management dashboard. We help people decide whether and how to start, not only manage what they already have. That framing shapes every feature: space-and-budget planning, bylaw awareness, local feed pricing, and disease triage tied to nearby vets and agrovets.",
          },
        ].map((b) => {
          const Icon = b.icon;
          const toneRing = b.tone === "accent" ? "ring-accent/30" : "ring-primary/20";
          const toneBg = b.tone === "accent" ? "gradient-warm" : "gradient-brand";
          return (
            <div
              key={b.title}
              className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-7 md:p-9 ring-1 ${toneRing} hover-lift`}
            >
              <div className="flex items-start gap-5">
                <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl ${toneBg} text-primary-foreground shadow-soft transition-transform group-hover:scale-110`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="font-display text-2xl font-bold">{b.title}</h2>
                  <p className="mt-3 text-muted-foreground leading-relaxed">{b.body}</p>
                </div>
              </div>
            </div>
          );
        })}

        {/* Affiliation */}
        <div className="relative overflow-hidden rounded-2xl gradient-brand p-8 md:p-10 text-primary-foreground shadow-lift">
          <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-accent/25 blur-2xl" aria-hidden />
          <div className="relative flex items-start gap-5">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-white/15 backdrop-blur">
              <GraduationCap className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-display text-xl font-bold">Affiliation</h3>
              <p className="mt-2 text-primary-foreground/90 leading-relaxed">
                PoultryFit Kenya is a university tech project built at Jomo Kenyatta
                University of Agriculture and Technology (JKUAT), in partnership with
                JHUB Africa.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Link to="/team" className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-dark transition shadow-soft">
            Meet the team
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </SiteLayout>
  );
}
