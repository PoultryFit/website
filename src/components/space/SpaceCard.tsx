import { Link } from "@tanstack/react-router";
import { MapPin } from "lucide-react";

export interface SpaceSummary {
  id: string;
  title: string;
  space_type: string;
  listing_type: "rent" | "sale";
  county: string;
  town: string;
  price: number;
  images: string[];
}

export function SpaceCard({ space, to }: { space: SpaceSummary; to: string }) {
  const cover = space.images?.[0] ?? "";
  const isRent = space.listing_type === "rent";
  return (
    <Link
      to={to}
      params={{ id: space.id }}
      className="group block overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition hover:shadow-md"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {cover ? (
          <img src={cover} alt={space.title} className="h-full w-full object-cover transition group-hover:scale-105" />
        ) : (
          <div className="grid h-full w-full place-items-center text-sm text-muted-foreground">No image</div>
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          <span className="rounded-full bg-background/95 px-2.5 py-1 text-xs font-medium text-foreground shadow-sm">
            {space.space_type}
          </span>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold shadow-sm ${
            isRent ? "bg-highland text-highland-foreground" : "bg-maasai text-maasai-foreground"
          }`}>
            {isRent ? "For Rent" : "For Sale"}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-display text-lg font-semibold leading-tight line-clamp-1">{space.title}</h3>
        <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" /> {space.town}, {space.county}
        </p>
        <p className="mt-3 font-display text-xl font-bold text-primary">
          KSh {Number(space.price).toLocaleString()}
          {isRent && <span className="ml-1 text-xs font-medium text-muted-foreground">/ month</span>}
        </p>
      </div>
    </Link>
  );
}
