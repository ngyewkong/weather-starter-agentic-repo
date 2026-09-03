# TypeScript

This repo uses strict TypeScript in both packages.

## Backend

- `backend/tsconfig.json` targets `ES2022` and uses `NodeNext` module resolution.
- Backend source is compiled to `backend/dist/`.
- Keep backend files under `backend/src/` so the `rootDir` setting stays valid.

## Frontend

- `frontend/tsconfig.json` targets `ES2022` with `ESNext` modules and `noEmit`.
- Frontend code is Vite-driven and should stay compatible with the browser runtime.

## Conventions

- Keep types explicit around API payloads, weather snapshots, and store values.
- Prefer small, composable types over large ad hoc `any` shapes.
- When making schema or API changes, update the corresponding TypeScript types in the same change.
