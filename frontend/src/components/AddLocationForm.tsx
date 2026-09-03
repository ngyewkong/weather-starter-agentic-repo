import { useState } from 'react';
import type { FormEvent } from 'react';
import { useStore } from '../state/store';
import { PlusIcon } from './icons';

export function AddLocationForm() {
  const { isAdding, setAdding, create } = useStore();
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const cancel = () => {
    setLatitude('');
    setLongitude('');
    setSubmitError(null);
    setAdding(false);
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setSubmitError(null);
    try {
      await create({ latitude: Number(latitude), longitude: Number(longitude) });
      setLatitude('');
      setLongitude('');
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Could not add location');
    } finally {
      setSubmitting(false);
    }
  };

  if (!isAdding) {
    return (
      <button
        type="button"
        onClick={() => setAdding(true)}
        className="flex w-full items-center justify-center gap-2 rounded-[var(--radius-card)] border border-[color:var(--card-border)] bg-[color:var(--card-bg)] px-3 py-2.5 text-sm font-medium text-[color:var(--text-3)] backdrop-blur-[var(--card-blur)] hover:bg-[color:var(--card-bg-hover)]"
      >
        <PlusIcon />
        <span>Add Location</span>
      </button>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-2.5 rounded-[var(--radius-card)] border border-[color:var(--card-border)] bg-[color:var(--card-bg-selected)] p-3 backdrop-blur-[var(--card-blur)]"
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[color:var(--text-5)]">
        New coordinate
      </p>
      <div className="grid grid-cols-2 gap-2">
        <label className="grid min-w-0 gap-1">
          <span className="text-[11px] text-[color:var(--text-5)]">Latitude</span>
          <input
            type="number"
            step="any"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="1.3508"
            required
            className="w-full min-w-0 rounded-md border border-[color:var(--card-border)] bg-[color:var(--input-bg)] px-2 py-1.5 text-sm text-[color:var(--text-1)] placeholder:text-[color:var(--placeholder)]"
          />
        </label>
        <label className="grid min-w-0 gap-1">
          <span className="text-[11px] text-[color:var(--text-5)]">Longitude</span>
          <input
            type="number"
            step="any"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="103.8390"
            required
            className="w-full min-w-0 rounded-md border border-[color:var(--card-border)] bg-[color:var(--input-bg)] px-2 py-1.5 text-sm text-[color:var(--text-1)] placeholder:text-[color:var(--placeholder)]"
          />
        </label>
      </div>
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={cancel}
          className="rounded-md px-2.5 py-1.5 text-xs font-medium text-[color:var(--text-4)] hover:text-[color:var(--text-1)]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-md bg-[color:var(--button-primary-bg)] px-3 py-1.5 text-xs font-semibold text-[color:var(--button-primary-text)] hover:bg-[color:var(--button-primary-bg-hover)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {submitting ? 'Adding…' : 'Add'}
        </button>
      </div>
      {submitError && (
        <p className="rounded-md border border-red-300/30 bg-red-500/15 px-2.5 py-1.5 text-xs text-red-100">
          {submitError}
        </p>
      )}
    </form>
  );
}
