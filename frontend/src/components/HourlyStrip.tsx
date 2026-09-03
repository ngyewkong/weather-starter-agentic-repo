import { CloudIcon, SunIcon } from './icons';
import type { ForecastPeriod } from '../types';

interface HourlyStripProps {
  periods?: ForecastPeriod[];
}

function shortenLabel(label: string): string {
  if (!label) return '';
  const start = label.split(' to ')[0];
  return start.replace(/\s\d{4}\b/, '');
}

export function HourlyStrip({ periods = [] }: HourlyStripProps) {
  if (periods.length === 0) {
    return (
      <section className="rounded-[var(--radius-card)] border border-[color:var(--card-border)] bg-[color:var(--card-bg)] backdrop-blur-[var(--card-blur)] [box-shadow:var(--card-shadow)]">
        <p className="border-b border-[color:var(--card-border-subtle)] px-4 py-2 text-[12px] text-[color:var(--text-3)]">
          Forecast unavailable from this data source.
        </p>
        <div className="flex min-h-[5rem] items-center justify-center text-sm text-[color:var(--text-5)]">
          --
        </div>
      </section>
    );
  }

  const slots = periods.map((period, index) => ({
    key: `${period.label}-${index}`,
    label: index === 0 ? 'Now' : shortenLabel(period.label),
    forecast: period.forecast,
  }));

  return (
    <section className="rounded-[var(--radius-card)] border border-[color:var(--card-border)] bg-[color:var(--card-bg)] backdrop-blur-[var(--card-blur)] [box-shadow:var(--card-shadow)]">
      <p className="border-b border-[color:var(--card-border-subtle)] px-4 py-2 text-[12px] text-[color:var(--text-3)]">
        24-hour regional forecast.
      </p>
      <div
        className="grid divide-x divide-[color:var(--card-border-subtle)]"
        style={{ gridTemplateColumns: `repeat(${slots.length}, minmax(0, 1fr))` }}
      >
        {slots.map((slot) => {
          const isFair = slot.forecast?.toLowerCase().includes('fair');
          return (
            <div key={slot.key} className="flex flex-col items-center gap-2 px-2 py-4 text-center">
              <div className="text-xs font-medium text-[color:var(--text-3)]">{slot.label}</div>
              {isFair ? (
                <SunIcon className="h-7 w-7 text-[color:var(--accent)]" />
              ) : (
                <CloudIcon className="h-7 w-7 text-[color:var(--text-3)]" />
              )}
              <div className="text-xs leading-snug text-[color:var(--text-2)]">
                {slot.forecast}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
