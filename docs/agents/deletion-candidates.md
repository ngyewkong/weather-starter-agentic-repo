# Deletion Candidates

These items from the old root `AGENTS.md` are better moved out of root or removed entirely.

| Instruction | Why it should move or go | Suggested action |
| --- | --- | --- |
| `The backend tests are currently the only committed automated tests.` | Too obvious and likely to become stale. | Delete. |
| `There is currently no dedicated lint script in package.json.` | A script list belongs in `commands.md`, not root. | Move. |
| `If you add or update ESLint config, the conventional command is npx eslint . ...` | Speculative and weak until linting is actually configured. | Delete or keep only in `commands.md` as a fallback note. |
| `The dev server uses a local Portless URL...` | Environment/setup detail, not universal enough for root. | Move to `commands.md` or `overview.md`. |
| `The app depends on WEATHER_API_KEY only if you want to use an API key...` | Overly obvious phrasing. | Move to `backend.md` if needed, otherwise delete. |
| `Avoid touching unrelated working tree changes unless the task explicitly requires it.` | Already covered by the global coding instructions in this environment. | Delete from root. |

## Suggested Root Scope

Keep root `AGENTS.md` limited to:

- One-sentence project description
- Package manager
- Build command(s) that are truly universal
- A link index to the detailed docs
