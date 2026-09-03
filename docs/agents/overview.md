# Overview

This repository is a small TypeScript weather app starter with two packages:

- `backend/` for the Express API, SQLite persistence, and weather aggregation
- `frontend/` for the React/Vite UI

The backend serves `/api/*` and the Vite app from the same Node process in development.

## Data Flow

1. The user adds a Singapore coordinate pair in the UI.
2. The backend validates the coordinates, inserts a location into SQLite, and refreshes weather from data.gov.sg.
3. The latest snapshot is stored on the location row and returned to the frontend.
4. The frontend reloads `/api/locations` and renders the selected location from local API state.

## Start Here

- Read [commands.md](commands.md) for the working scripts.
- Read [backend.md](backend.md) before touching API, persistence, or weather-fetching code.
- Read [frontend.md](frontend.md) before touching React state or UI components.
