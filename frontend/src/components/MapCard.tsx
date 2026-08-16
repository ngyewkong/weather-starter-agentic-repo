import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useStore } from '../state/store';
import { buildLocationIcon } from './mapIcons';
import { CloseIcon, CloudIcon } from './icons';
import type { Location } from '../types';

const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';

interface FitBoundsProps {
  locations: Location[];
}

function FitBounds({ locations }: FitBoundsProps) {
  const map = useMap();
  useEffect(() => {
    if (locations.length === 0) return;
    if (locations.length === 1) {
      map.setView([locations[0].latitude, locations[0].longitude], 12);
      return;
    }
    const bounds = L.latLngBounds(locations.map((l) => [l.latitude, l.longitude]));
    map.fitBounds(bounds, { padding: [40, 40] });
  }, [map, locations]);
  return null;
}

interface LocationMarkersProps {
  locations: Location[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

function LocationMarkers({ locations, selectedId, onSelect }: LocationMarkersProps) {
  return (
    <>
      {locations.map((location) => (
        <Marker
          key={location.id}
          position={[location.latitude, location.longitude]}
          icon={buildLocationIcon({ location, isSelected: location.id === selectedId })}
          eventHandlers={{ click: () => onSelect(location.id) }}
        />
      ))}
    </>
  );
}

export function MapCard() {
  const { locations, selectedId, select } = useStore();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (!expanded) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setExpanded(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [expanded]);

  if (locations.length === 0) return null;

  const center: [number, number] = [locations[0].latitude, locations[0].longitude];

  return (
    <>
      <section className="flex flex-col gap-3 rounded-2xl border border-white/15 bg-white/[0.08] p-4 backdrop-blur-xl">
        <header className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.14em] text-white/60">
          <CloudIcon className="h-3.5 w-3.5" />
          <span>Map</span>
        </header>
        <div className="relative h-56 overflow-hidden rounded-xl">
          <div className="pointer-events-none absolute inset-0">
            <MapContainer
              center={center}
              zoom={11}
              dragging={false}
              scrollWheelZoom={false}
              doubleClickZoom={false}
              touchZoom={false}
              boxZoom={false}
              keyboard={false}
              zoomControl={false}
              attributionControl={false}
              className="h-full w-full"
            >
              <TileLayer url={TILE_URL} />
              <FitBounds locations={locations} />
              <LocationMarkers locations={locations} selectedId={selectedId} onSelect={select} />
            </MapContainer>
          </div>
          <button
            type="button"
            onClick={() => setExpanded(true)}
            aria-label="Expand map to fullscreen"
            className="absolute inset-0 z-10 cursor-pointer"
          />
        </div>
      </section>

      {expanded && (
        <div className="fixed inset-0 z-50 flex flex-col bg-black/60 backdrop-blur-sm">
          <header className="flex items-center justify-between border-b border-white/10 bg-black/40 px-5 py-3">
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-white/80">
              Locations
            </h2>
            <button
              type="button"
              onClick={() => setExpanded(false)}
              aria-label="Close map"
              className="rounded-full p-1.5 text-white/70 transition hover:bg-white/15 hover:text-white"
            >
              <CloseIcon className="h-4 w-4" />
            </button>
          </header>
          <div className="flex-1">
            <MapContainer center={center} zoom={11} className="h-full w-full">
              <TileLayer url={TILE_URL} attribution="&copy; OpenStreetMap contributors" />
              <FitBounds locations={locations} />
              <LocationMarkers locations={locations} selectedId={selectedId} onSelect={select} />
            </MapContainer>
          </div>
        </div>
      )}
    </>
  );
}
