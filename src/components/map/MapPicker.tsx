import { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl, iconRetinaUrl, shadowUrl,
  iconSize: [25, 41], iconAnchor: [12, 41], popupAnchor: [1, -34], shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface Props {
  county: string;
  town: string;
  estate?: string;
  lat: number | null;
  lng: number | null;
  onChange: (lat: number, lng: number) => void;
}

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => { map.setView([lat, lng], Math.max(map.getZoom(), 15)); }, [lat, lng, map]);
  return null;
}

export function MapPicker({ county, town, estate, lat, lng, onChange }: Props) {
  const [pos, setPos] = useState<[number, number] | null>(
    lat != null && lng != null ? [lat, lng] : null,
  );
  const lastQuery = useRef<string>("");

  // Auto-geocode when location text changes (debounced)
  useEffect(() => {
    const q = [estate, town, county, "Kenya"].filter(Boolean).join(", ");
    if (!town && !county) return;
    if (q === lastQuery.current) return;
    if (pos && (lat != null && lng != null)) {
      lastQuery.current = q;
      return;
    }
    const t = setTimeout(async () => {
      try {
        const r = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(q)}`,
          { headers: { Accept: "application/json" } },
        );
        const data = (await r.json()) as Array<{ lat: string; lon: string }>;
        if (data?.[0]) {
          const la = parseFloat(data[0].lat);
          const ln = parseFloat(data[0].lon);
          setPos([la, ln]);
          onChange(la, ln);
          lastQuery.current = q;
        }
      } catch { /* ignore */ }
    }, 700);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [county, town, estate]);

  const center = useMemo<[number, number]>(
    () => pos ?? [-1.286389, 36.817223], // Nairobi default
    [pos],
  );

  return (
    <div className="overflow-hidden rounded-xl border border-border shadow-soft">
      <MapContainer center={center} zoom={pos ? 16 : 6} className="h-[380px] w-full" scrollWheelZoom>
        <TileLayer
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
        />
        <TileLayer
          attribution='Labels &copy; Esri'
          url="https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
        />
        {pos && (
          <>
            <Recenter lat={pos[0]} lng={pos[1]} />
            <Marker
              position={pos}
              draggable
              eventHandlers={{
                dragend: (e) => {
                  const m = e.target as L.Marker;
                  const p = m.getLatLng();
                  setPos([p.lat, p.lng]);
                  onChange(p.lat, p.lng);
                },
              }}
            />
          </>
        )}
      </MapContainer>
    </div>
  );
}
