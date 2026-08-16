import { renderToStaticMarkup } from 'react-dom/server';
import L from 'leaflet';
import { formatTemperature } from './format';
import type { Location } from '../types';

interface BuildLocationIconOptions {
  location: Location;
  isSelected: boolean;
}

const PIN_PATH = 'M12 2 4 6l4 4 4 12 4-12 4-4Z';

export function buildLocationIcon({ location, isSelected }: BuildLocationIconOptions): L.DivIcon {
  const temp = formatTemperature(location.weather?.temperature_c);

  const html = renderToStaticMarkup(
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '3px',
      }}
    >
      <span
        style={{
          fontSize: '11px',
          fontWeight: 600,
          lineHeight: 1,
          padding: '3px 7px',
          borderRadius: '9999px',
          whiteSpace: 'nowrap',
          boxShadow: '0 1px 4px rgba(0,0,0,0.35)',
          background: isSelected ? '#ffffff' : 'rgba(15,23,42,0.75)',
          color: isSelected ? '#0f172a' : '#ffffff',
        }}
      >
        {temp}
      </span>
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        style={{
          transform: isSelected ? 'scale(1.15)' : 'scale(1)',
          transformOrigin: 'bottom center',
          filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.4))',
        }}
      >
        <path d={PIN_PATH} fill={isSelected ? '#ffffff' : 'rgba(255,255,255,0.85)'} />
      </svg>
    </div>,
  );

  return L.divIcon({
    html,
    className: '',
    iconSize: [64, 54],
    iconAnchor: [32, 50],
  });
}
