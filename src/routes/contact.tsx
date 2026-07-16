import { createFileRoute } from "@tanstack/react-router";
import { SiteLayout } from "@/components/SiteLayout";
import { useState, type FormEvent } from "react";
import { Mail, MapPin, Send, CheckCircle2 } from "lucide-react";
import patternImage from "@/assets/pattern-topo.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — PoultryFit Kenya" },
      { name: "description", content: "Get in touch with the PoultryFit Kenya team. Based in Juja, Kiambu County, Kenya." },
      { property: "og:title", content: "Contact PoultryFit Kenya" },
      { property: "og:description", content: "Reach the PoultryFit Kenya team." },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <SiteLayout>
      <section className="relative isolate overflow-hidden border-b border-border">
        <div
          className="absolute inset-0 -z-20 opacity-[0.15]"
          style={{ backgroundImage: `url(${patternImage})`, backgroundSize: "cover" }}
          aria-hidden
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-surface/70 via-background to-background" aria-hidden />

        <div className="mx-auto max-w-6xl px-4 sm:px-6 pt-20 md:pt-28 pb-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-primary">Contact</p>
          <h1 className="mt-3 font-display text-4xl md:text-5xl font-bold leading-tight max-w-3xl">
            Let's <span className="text-gradient-brand">talk</span>.
          </h1>
          <p className="mt-4 text-muted-foreground max-w-2xl text-lg">
            Questions, partnership ideas, or interested in piloting with us? Send a note.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 sm:px-6 py-14 grid gap-10 md:grid-cols-5">
        <div className="md:col-span-2 space-y-5">
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 hover-lift">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl gradient-brand text-primary-foreground shadow-soft transition-transform group-hover:scale-110">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email</h3>
                <p className="mt-1 font-medium">hello@poultryfit.ke</p>
              </div>
            </div>
          </div>
          <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 hover-lift">
            <div className="flex items-start gap-4">
              <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl gradient-warm text-primary-foreground shadow-soft transition-transform group-hover:scale-110">
                <MapPin className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-display text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location</h3>
                <p className="mt-1 font-medium">Juja, Kiambu County, Kenya</p>
                <p className="mt-1 text-sm text-muted-foreground">JKUAT · JHUB Africa</p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:col-span-3">
          <form onSubmit={onSubmit} className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8 space-y-5 shadow-soft">
            <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full gradient-brand opacity-10 blur-2xl" aria-hidden />
            <div>
              <label htmlFor="name" className="block text-sm font-medium">Name</label>
              <input
                id="name" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30 transition"
                placeholder="Your name"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium">Email</label>
              <input
                id="email" type="email" required value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30 transition"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium">Message</label>
              <textarea
                id="message" required rows={5} value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="mt-2 w-full rounded-md border border-border bg-background px-3 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-ring/30 resize-y transition"
                placeholder="How can we help?"
              />
            </div>
            <button type="submit" className="group inline-flex items-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-dark transition shadow-soft">
              Send message
              <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            {submitted && (
              <p className="flex items-center gap-2 text-sm text-primary font-medium animate-[fade-in_0.4s_ease-out_both]">
                <CheckCircle2 className="h-4 w-4" />
                Thanks. Your message has been captured (UI only for now).
              </p>
            )}
          </form>
        </div>
      </section>
    </SiteLayout>
  );
}
