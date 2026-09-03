# Backend

The backend lives in `backend/src/` and is responsible for routing, persistence, and weather aggregation.

## Main Files

- `backend/src/server.ts` creates the Express app, mounts `/health`, `/api/logs`, and `/api/locations`, and serves the frontend in development or production.
- `backend/src/routes/locations.ts` contains the location CRUD and weather refresh API.
- `backend/src/db.ts` owns SQLite access through Drizzle and persists the latest weather snapshot for each location.
- `backend/src/weather.ts` talks to Singapore data.gov.sg weather endpoints and normalizes the results into one snapshot shape.
- `backend/src/schema.ts` defines the Drizzle table and snapshot schema.
- `backend/src/logger.ts` handles structured logging.

## API Shape

- `GET /health` returns a simple health check.
- `GET /api/locations` lists all saved locations.
- `POST /api/locations` creates a location from latitude and longitude, then refreshes weather.
- `GET /api/locations/:locationId` fetches one location.
- `DELETE /api/locations/:locationId` deletes one location.
- `POST /api/locations/:locationId/refresh` refreshes the latest weather snapshot.
- `POST /api/logs` records frontend interaction events.

## Persistence

- The default SQLite file is `backend/weather.db`.
- `DATABASE_PATH` overrides the database location.
- Drizzle migrations live in `backend/drizzle/`.
- The current persistence model stores only the latest weather snapshot per location, not historical readings.

## Environment

- `WEATHER_API_KEY` is optional and only needed if you want to send a key to the weather provider.
- In production, the backend serves the built frontend from `frontend/dist/`.
