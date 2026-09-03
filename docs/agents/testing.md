# Testing

Vitest is the only committed automated test runner in this repo.

## Current Scope

- Test files live under `backend/src/**/*.test.ts`.
- `vitest.config.ts` uses the `node` environment and is configured for backend tests only.
- `supertest` is used for API integration tests against the Express app.

## Testing Patterns

- Prefer deterministic tests that stub the weather client or `fetch` rather than calling live data.gov.sg services.
- Use temporary database files in tests so runs stay isolated.
- Keep backend tests focused on API behavior, persistence behavior, and weather normalization.

## When Adding Tests

- Put new backend tests next to the code they cover when practical.
- Match the existing test style before introducing new helpers or abstractions.
- If frontend tests are added later, document their runner and location here as well.
