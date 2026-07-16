import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { Crown, Brain, Activity, Server, Database, Palette, type LucideIcon, Share2Icon } from "lucide-react";
import patternImage from "@/assets/pattern-topo.jpg";

export const Route = createFileRoute("/team")({
  head: () => ({
    meta: [
      { title: "Team — PoultryFit Kenya" },
      { name: "description", content: "The PoultryFit Kenya team, built under the JHUB Africa internship programme at JKUAT." },
      { property: "og:title", content: "The PoultryFit Kenya team" },
      { property: "og:description", content: "Meet the team behind PoultryFit Kenya." },
    ],
  }),
  component: TeamPage,
});

type Tone = "primary" | "accent" | "dark";
type Member = { name: string; role: string; owns: string; tone: Tone; icon: LucideIcon };

const team: Member[] = [
  { name: "Nicholas Mwangi", role: "Team Lead", owns: "Owns project direction, delivery, and stakeholder coordination.", tone: "primary", icon: Crown },
  { name: "Josphat Munene", role: "Machine Learning", owns: "Owns flock-feasibility and feed modelling work.", tone: "accent", icon: Brain },
  { name: "Susan Waweru", role: "Machine Learning", owns: "Owns disease triage modelling and dataset curation.", tone: "dark", icon: Activity },
  { name: "Benedict Mutua", role: "Backend Development", owns: "Owns core API surface and service architecture.", tone: "accent", icon: Server },
  { name: "Linet Mungai", role: "Backend Development & Database", owns: "Owns data modelling, persistence, and integrations.", tone: "primary", icon: Database },
  { name: "Eugene Kipkoech", role: "Frontend Development", owns: "Owns the user-facing experience and design system.", tone: "dark", icon: Palette },
  { name: "Sheldon Jahonga", role: "Frontend Development", owns: "Owns UI implementation, component architecture, and cross-browser compatibility.", tone: "accent", icon: Palette },
  { name: "Joshua Mulatya", role: "Mass Communication", owns: "By-Laws research, Agrovet prices curation.", tone: "dark", icon: Share2Icon },
];

const toneStyles: Record<Tone, { ring: string; chip: string; iconBg: string }> = {
  primary: {
    ring: "ring-primary/15 hover:ring-primary/35",
    chip: "bg-primary/10 text-primary",
    iconBg: "gradient-brand text-primary-foreground",
  },
  accent: {
    ring: "ring-accent/20 hover:ring-accent/40",
    chip: "bg-accent/15 text-accent-foreground",
    iconBg: "gradient-warm text-primary-foreground",
  },
  dark: {
    ring: "ring-foreground/10 hover:ring-foreground/25",
    chip: "bg-foreground/5 text-foreground",
    iconBg: "bg-primary-dark text-primary-foreground",
  },
};

function initials(name: string) {
  return name.split(" ").map((n) => n[0]).slice(0, 2).join("");
}

function TeamPage() {
  return (
    <SiteLayout>
      <section className="relative isolate overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 -z-20 opacity-[0.15]"
          style={{ backgroundImage: `url(${patternImage})`, backgroundSize: "cover" }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-surface/70 via-background to-background" aria-hidden />
        <div className="absolute -top-24 right-0 h-72 w-72 rounded-full gradient-warm opacity-15 blur-3xl" aria-hidden />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-20 md:pt-28 pb-12">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Team</p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold leading-tight max-w-3xl">
            The people building <span className="text-gradient-brand">PoultryFit Kenya</span>.
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl text-lg">
            A small, focused team spanning machine learning, backend, frontend, and data. Eight people, one platform.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-16 md:py-20">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((m, i) => {
            const t = toneStyles[m.tone];
            const Icon = m.icon;
            return (
              <article
                key={m.name}
                className={`group relative overflow-hidden rounded-2xl border border-border bg-card p-7 ring-1 ${t.ring} hover-lift transition-all`}
                style={{ animation: `fade-in-up 0.6s ${i * 0.07}s cubic-bezier(0.22,1,0.36,1) both` }}
              >
                <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/5 blur-2xl transition-opacity group-hover:opacity-100 opacity-50" aria-hidden />

                <div className="relative flex items-center gap-4">
                  <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${t.iconBg} shadow-soft font-display text-base font-bold transition-transform group-hover:scale-110 group-hover:-rotate-3`}>
                    {initials(m.name)}
                  </div>
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${t.chip}`}>
                    <Icon className="h-3.5 w-3.5" />
                    {m.role}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-lg font-semibold">{m.name}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{m.owns}</p>

                <div className="mt-6 h-px w-full bg-gradient-to-r from-border via-border to-transparent" aria-hidden />
              </article>
            );
          })}
        </div>

        <p className="mt-16 text-sm text-muted-foreground text-center max-w-2xl mx-auto border-t border-border pt-8">
          Built under the JHUB Africa internship programme, Department of Computing,
          Jomo Kenyatta University of Agriculture and Technology.
        </p>
      </section>
    </SiteLayout>
  );
}
