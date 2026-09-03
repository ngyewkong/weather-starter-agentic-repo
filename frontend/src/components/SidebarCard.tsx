import { useStore } from '../state/store';
import { CloseIcon, CloudIcon, HomeIcon } from './icons';
import { formatTemperature, formatTime } from './format';
import type { KeyboardEvent, MouseEvent } from 'react';
import type { Location } from '../types';

interface SidebarCardProps {
  location: Location;
  isHome: boolean;
}

export function SidebarCard({ location, isHome }: SidebarCardProps) {
  const { selectedId, select, remove } = useStore();
  const isSelected = selectedId === location.id;
  const observed = formatTime(location.weather.observed_at);
  const area =
    location.weather.area || `${location.latitude.toFixed(3)}, ${location.longitude.toFixed(3)}`;
  const condition = location.weather.condition || '-';
  const temperature = formatTemperature(location.weather.temperature_c);
  const high = formatTemperature(location.weather.forecast_high_c);
  const low = formatTemperature(location.weather.forecast_low_c);

  const onSelect = () => select(location.id);
  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onSelect();
    }
  };
  const onDelete = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    void remove(location.id);
  };
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      aria-pressed={isSelected}
      className={`relative w-full cursor-pointer overflow-hidden rounded-[var(--radius-card)] border text-left backdrop-blur-[var(--card-blur)] transition ${
        isSelected
          ? 'border-[color:var(--card-border-selected)] bg-[color:var(--card-bg-selected)] [box-shadow:var(--card-shadow)]'
          : 'border-[color:var(--card-border-subtle)] bg-[color:var(--card-bg)] hover:bg-[color:var(--card-bg-hover)]'
      }`}
    >
      <button
        type="button"
        onClick={onDelete}
        aria-label={`Delete ${area}`}
        className="absolute right-2 top-2 z-10 rounded-full p-1 text-[color:var(--text-5)] transition hover:bg-[color:var(--card-bg-hover)] hover:text-[color:var(--text-1)]"
      >
        <CloseIcon className="h-3.5 w-3.5" />
      </button>
      <div className="flex items-start justify-between gap-3 pl-4 pr-8 pt-3">
        <div className="min-w-0">
          <div className="truncate text-lg font-semibold leading-tight text-[color:var(--text-1)]">
            {area}
          </div>
          <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[color:var(--text-4)]">
            {isHome ? (
              <>
                <span>My Location</span>
                <span className="text-[color:var(--text-6)]">·</span>
                <HomeIcon className="h-3 w-3" />
                <span>Home</span>
              </>
            ) : observed ? (
              <span>{observed}</span>
            ) : (
              <span className="text-[color:var(--text-5)]">Not refreshed</span>
            )}
          </div>
        </div>
        <div className="text-3xl font-[var(--weight-heading)] tabular-nums text-[color:var(--text-2)]">
          {temperature}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between border-t border-[color:var(--card-border-subtle)] px-4 py-2 text-xs">
        <div className="flex items-center gap-2 text-[color:var(--text-3)]">
          <CloudIcon className="h-4 w-4 text-[color:var(--text-4)]" />
          <span>{condition}</span>
        </div>
        <div className="text-[color:var(--text-5)] tabular-nums">
          H:{high} L:{low}
        </div>
      </div>
    </div>
  );
}
