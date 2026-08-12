import { useState } from "react";
import { ArrowRight } from "lucide-react";

// Same constants the actual app uses (poultry-data.ts), this teaser
// is honest math, not a marketing placeholder.
const SPACE_PER_BIRD_DEEP_LITTER = 0.35;
const STARTUP_COST_PER_CHICK = 180;

// Same URL as SiteHeader.tsx, keep both in sync if it ever changes.
const POULTRYFIT_APP_URL = "https://poultryfit.poultryfit-kenya.workers.dev";

export function FeasibilityTeaser() {
  const [length, setLength] = useState(6);
  const [width, setWidth] = useState(3);
  const [budget, setBudget] = useState(5000);

  const area = length * width;
  const maxBySpace = Math.floor(area / SPACE_PER_BIRD_DEEP_LITTER);
  const maxByBudget = Math.floor(budget / STARTUP_COST_PER_CHICK);
  const recommended = Math.max(0, Math.min(maxBySpace, maxByBudget));
  const binding = maxBySpace <= maxByBudget ? "space" : "budget";

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-soft">
      <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full gradient-brand opacity-[0.07] blur-3xl" aria-hidden />
      <p className="text-xs font-semibold uppercase tracking-wider text-primary">Try it yourself</p>
      <h3 className="mt-1.5 font-display text-xl font-bold">What could your yard support?</h3>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div className="space-y-5">
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="length" className="text-sm font-medium">Yard length</label>
              <span className="text-sm font-semibold text-primary">{length} m</span>
            </div>
            <input
              id="length" type="range" min={1} max={15} step={0.5} value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="mt-2 w-full accent-primary"
              aria-describedby="area-readout"
            />
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="width" className="text-sm font-medium">Yard width</label>
              <span className="text-sm font-semibold text-primary">{width} m</span>
            </div>
            <input
              id="width" type="range" min={1} max={15} step={0.5} value={width}
              onChange={(e) => setWidth(Number(e.target.value))}
              className="mt-2 w-full accent-primary"
              aria-describedby="area-readout"
            />
          </div>
          <div>
            <div className="flex items-baseline justify-between">
              <label htmlFor="budget" className="text-sm font-medium">Starting budget</label>
              <span className="text-sm font-semibold text-primary">KES {budget.toLocaleString()}</span>
            </div>
            <input
              id="budget" type="range" min={500} max={30000} step={500} value={budget}
              onChange={(e) => setBudget(Number(e.target.value))}
              className="mt-2 w-full accent-primary"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center rounded-xl bg-secondary p-6 text-center">
          <p id="area-readout" className="text-xs font-medium text-muted-foreground">{area.toFixed(1)} m² · deep litter housing · day-old chicks</p>
          <p className="mt-2 font-display text-5xl font-bold text-primary tabular-nums">{recommended}</p>
          <p className="mt-1 text-sm text-muted-foreground">birds you could realistically keep</p>
          <p className="mt-3 text-xs text-muted-foreground">
            Limited by {binding === "space" ? "your yard's space" : "your starting budget"}, not the other way around.
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between flex-wrap gap-3">
        <p className="text-xs text-muted-foreground max-w-sm">
          A quick estimate only, the real planner also checks your ward's bylaws and lets you choose housing type and starting stage.
        </p>
        <a href={POULTRYFIT_APP_URL} target="_blank" rel="noopener noreferrer" className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary hover:underline">
          Get your full plan
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </div>
  );
}