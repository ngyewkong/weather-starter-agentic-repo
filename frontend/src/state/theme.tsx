import { createContext, useContext, useEffect, useState } from 'react';
import type { ProviderProps } from '../types';

export interface Theme {
  id: string;
  name: string;
}

export const THEMES: Theme[] = [
  { id: 'apple', name: 'Apple' },
  { id: 'daybreak', name: 'Daybreak Pastel' },
  { id: 'terminal', name: 'Terminal Weather' },
  { id: 'paper', name: 'Paper Almanac' },
  { id: 'neon', name: 'Neon Nightscape' },
];

const DEFAULT_THEME_ID = 'apple';
const STORAGE_KEY = 'weather-app:theme';

interface ThemeValue {
  theme: Theme;
  themeId: string;
  setThemeId: (id: string) => void;
}

const ThemeContext = createContext<ThemeValue | null>(null);

function readStoredThemeId(): string {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored && THEMES.some((t) => t.id === stored) ? stored : DEFAULT_THEME_ID;
}

export function ThemeProvider({ children }: ProviderProps) {
  const [themeId, setThemeId] = useState<string>(readStoredThemeId);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, themeId);
    document.documentElement.dataset.theme = themeId;
  }, [themeId]);

  const theme = THEMES.find((t) => t.id === themeId) ?? THEMES[0];

  return (
    <ThemeContext.Provider value={{ theme, themeId, setThemeId }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
