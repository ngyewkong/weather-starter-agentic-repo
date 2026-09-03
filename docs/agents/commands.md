# Commands

Run these from the repository root unless noted otherwise.

## Setup and Development

- `npm install` - install all workspace dependencies.
- `npm run dev` - start the full app locally through Portless.
- `npm run start` - run the production server from `backend/dist/server.js` after building.
- `npm run doctor` - check that `/health` and `/api/locations` respond as expected.
- `npm run reset` - delete the local SQLite database and WAL files.

## Build

- `npm run build` - build the frontend and compile the backend TypeScript.
- `npm run build -w frontend` - frontend-only build.
- `npm run build -w backend` - backend-only TypeScript compile.

## Tests

- `npm test` - run Vitest in non-watch mode.
- `npm run test:watch` - run Vitest in watch mode.

## Database

- `npm run db:generate` - generate Drizzle migrations after schema changes.
- `npm run db:migrate` - apply Drizzle migrations to the local SQLite database.

## Lint

- There is no dedicated `lint` script in `package.json`.
- If you need linting, the conventional fallback is `npx eslint .` or a narrower path such as `npx eslint backend/src frontend/src`.
