import { useEffect, useRef, useState } from 'react';
import { THEMES, useTheme } from '../state/theme';
import { CheckIcon, ChevronDownIcon } from './icons';

export function ThemeSelector() {
  const { theme, themeId, setThemeId } = useTheme();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex items-center gap-1.5 rounded-full border border-[color:var(--card-border)] bg-[color:var(--card-bg)] px-3 py-1.5 text-xs font-medium text-[color:var(--text-3)] backdrop-blur-[var(--card-blur)] [box-shadow:var(--card-shadow)] hover:bg-[color:var(--card-bg-hover)]"
      >
        <span>{theme.name}</span>
        <ChevronDownIcon className={`h-3.5 w-3.5 transition ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute right-0 mt-2 min-w-[9rem] overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--card-border)] bg-[color:var(--card-bg)] p-1 backdrop-blur-[var(--card-blur)] [box-shadow:var(--card-shadow)]"
        >
          {THEMES.map((t) => {
            const isActive = t.id === themeId;
            return (
              <button
                key={t.id}
                type="button"
                role="option"
                aria-selected={isActive}
                onClick={() => {
                  setThemeId(t.id);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between gap-2 rounded-xl px-3 py-1.5 text-left text-xs font-medium text-[color:var(--text-3)] hover:bg-[color:var(--card-bg-hover)]"
              >
                <span>{t.name}</span>
                {isActive && <CheckIcon className="h-3.5 w-3.5 text-[color:var(--text-3)]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
