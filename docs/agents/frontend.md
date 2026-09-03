# Frontend

The frontend lives in `frontend/src/` and is a React app built with Vite.

## Main Files

- `frontend/src/App.tsx` wires the app providers together.
- `frontend/src/state/store.tsx` owns client-side location state and API interactions.
- `frontend/src/state/theme.tsx` handles theme persistence in `localStorage`.
- `frontend/src/components/` contains the UI composition layer, including layout, sidebar, cards, forecast strips, the map card, and the theme selector.
- `frontend/src/api.ts` wraps frontend calls to the backend.

## UI Rules

- Keep API requests relative to `/api` so the app works on the shared origin in development and production.
- Preserve the existing provider structure unless a task explicitly calls for a state refactor.
- Treat `frontend/src/components/` as the view layer and `frontend/src/state/` as state orchestration.

## Task Focus

- For layout, card, and styling changes, inspect the component tree first.
- For map behavior, check `MapCard.tsx` and related icon helpers.
- For theme changes, start with `frontend/src/state/theme.tsx` and `ThemeSelector.tsx`. The app currently ships five themes (`apple`, `daybreak`, `terminal`, `paper`, `neon`) — see [THEMES.md](../../THEMES.md) at the repo root for the full token set, per-theme design considerations, the shared rules every theme must follow, and a documented Tailwind `shadow-[...]` gotcha for the `--card-shadow` token.
