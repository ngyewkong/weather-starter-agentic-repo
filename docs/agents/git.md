# Git

## Working Tree Safety

- Do not revert or delete changes you did not make unless the user explicitly asks.
- If unrelated edits are present in the worktree, leave them alone unless they block the current task.
- Avoid destructive commands such as `git reset --hard` or `git checkout --` unless explicitly approved.

## Branching and History

- Use a `codex/` branch prefix by default when creating branches.
- Do not amend commits unless the user asks for an amend.
- Prefer non-interactive git commands.

## Reporting

- Mention any unrelated working tree changes that might affect the task.
- If you stage, commit, push, or create a PR, report that clearly in the final response.
