import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useEffect, useState } from "react";
import { Crown, Brain, Activity, Server, Database, Palette, type LucideIcon, Share2Icon, Maximize2, X, GraduationCap } from "lucide-react";
import patternImage from "@/assets/pattern-topo.jpg";

// Drop each member's photo into src/assets/team/ and import it here.
// Leave the import commented out (and `photo` unset below) for anyone
// whose photo isn't ready yet — they'll just show the initials badge instead.
import nicholasPhoto from "@/assets/team/nicholas-mwangi.jpg";
import josphatPhoto from "@/assets/team/josphat-munene.jpg";
import susanPhoto from "@/assets/team/susan-waweru.jpg";
import benedictPhoto from "@/assets/team/benedict-mutua.jpg";
import eugenePhoto from "@/assets/team/eugene-kipkoech.jpg";
import joshuaPhoto from "@/assets/team/joshua-mulatya.jpg";
import linetPhoto from "@/assets/team/linet-mungai.jpg";
import sheldonPhoto from "@/assets/team/sheldon-jahonga.jpg";
import lawrenceNderuPhoto from "@/assets/team/lawrence-nderu.jpg";

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
type Member = { name: string; role: string; owns: string; tone: Tone; icon: LucideIcon; photo?: string };

const founder: Member = {
  name: "Dr. Lawrence Nderu",
  role: "Founder, JHUB Africa",
  owns: "Founded the JHUB Africa Innovation Programme, under whose guidance and support PoultryFit Kenya was built.",
  tone: "primary",
  icon: GraduationCap,
  photo: lawrenceNderuPhoto,
};

const team: Member[] = [
  { name: "Nicholas Mwangi", role: "Team Lead", owns: "Owns project direction, delivery, and stakeholder coordination.", tone: "primary", icon: Crown, photo: nicholasPhoto },
  { name: "Josphat Munene", role: "Machine Learning", owns: "Owns flock-feasibility and feed modelling work.", tone: "accent", icon: Brain, photo: josphatPhoto },
  { name: "Susan Waweru", role: "Machine Learning", owns: "Owns disease triage modelling and dataset curation.", tone: "dark", icon: Activity, photo: susanPhoto },
  { name: "Benedict Mutua", role: "Backend Development", owns: "Owns core API surface and service architecture.", tone: "accent", icon: Server, photo: benedictPhoto },
  { name: "Linet Mungai", role: "Backend Development & Database", owns: "Owns data modelling, persistence, and integrations.", tone: "primary", icon: Database , photo: linetPhoto },
  { name: "Eugene Kipkoech", role: "Frontend Development", owns: "Owns the user-facing experience and design system.", tone: "dark", icon: Palette, photo: eugenePhoto },
  { name: "Sheldon Jahonga", role: "Frontend Development", owns: "Owns UI implementation, component architecture, and cross-browser compatibility.", tone: "accent", icon: Palette , photo: sheldonPhoto },
  { name: "Joshua Mulatya", role: "Mass Communication", owns: "By-Laws research, Agrovet prices curation.", tone: "dark", icon: Share2Icon, photo: joshuaPhoto },
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
  const [expanded, setExpanded] = useState<Member | null>(null);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

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

      <section className="mx-auto max-w-6xl px-4 sm:px-6 pt-16 md:pt-20">
        <p className="text-sm font-semibold uppercase tracking-wider text-primary text-center">Founder & Patron</p>
        <div className="mt-6 mx-auto max-w-2xl">
          <div className="relative overflow-hidden rounded-2xl border border-primary/20 bg-surface p-8 sm:p-10 text-center shadow-soft">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full gradient-brand opacity-10 blur-3xl" aria-hidden />
            <div className="relative flex flex-col items-center">
              <button
                type="button"
                onClick={() => setExpanded(founder)}
                aria-label={`View ${founder.name}'s photo enlarged`}
                className="group/photo relative h-24 w-24 shrink-0 rounded-full transition-transform hover:scale-105"
              >
                <img
                  src={founder.photo}
                  alt={founder.name}
                  width={96}
                  height={96}
                  loading="lazy"
                  className="h-24 w-24 rounded-full object-cover shadow-soft ring-2 ring-primary/20"
                />
                <span className="absolute inset-0 grid place-items-center rounded-full bg-black/0 opacity-0 transition group-hover/photo:bg-black/40 group-hover/photo:opacity-100">
                  <Maximize2 className="h-4 w-4 text-white" />
                </span>
              </button>

              <span className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                <GraduationCap className="h-3.5 w-3.5" />
                {founder.role}
              </span>

              <h3 className="mt-3 font-display text-xl font-semibold">{founder.name}</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-md">{founder.owns}</p>
            </div>
          </div>
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
                  {m.photo ? (
                    <button
                      type="button"
                      onClick={() => setExpanded(m)}
                      aria-label={`View ${m.name}'s photo enlarged`}
                      className="group/photo relative h-14 w-14 shrink-0 rounded-2xl transition-transform group-hover:scale-110 group-hover:-rotate-3"
                    >
                      <img
                        src={m.photo}
                        alt={m.name}
                        width={56}
                        height={56}
                        loading="lazy"
                        className="h-14 w-14 rounded-2xl object-cover shadow-soft ring-1 ring-border"
                      />
                      <span className="absolute inset-0 grid place-items-center rounded-2xl bg-black/0 opacity-0 transition group-hover/photo:bg-black/40 group-hover/photo:opacity-100">
                        <Maximize2 className="h-4 w-4 text-white" />
                      </span>
                    </button>
                  ) : (
                    <div className={`grid h-14 w-14 shrink-0 place-items-center rounded-2xl ${t.iconBg} shadow-soft font-display text-base font-bold transition-transform group-hover:scale-110 group-hover:-rotate-3`}>
                      {initials(m.name)}
                    </div>
                  )}
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

      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-[fade-in_0.15s_ease-out_both]"
          onClick={() => setExpanded(null)}
        >
          <div
            className="relative max-w-md w-full animate-[fade-in-up_0.2s_cubic-bezier(0.22,1,0.36,1)_both]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setExpanded(null)}
              aria-label="Close"
              className="absolute -top-12 right-0 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20 transition"
            >
              <X className="h-5 w-5" />
            </button>
            <img
              src={expanded.photo}
              alt={expanded.name}
              className="w-full rounded-2xl shadow-lift"
            />
            <div className="mt-4 text-center">
              <p className="font-display text-lg font-semibold text-white">{expanded.name}</p>
              <p className="text-sm text-white/70">{expanded.role}</p>
            </div>
          </div>
        </div>
      )}
    </SiteLayout>
  );
}