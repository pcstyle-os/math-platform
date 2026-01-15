---
description: Enforce Bun as the primary package manager.
---

# Bun Over NPM

- **Always** use `bun` command for installing packages (`bun add`), removing packages (`bun remove`), and running scripts (`bun run`).
- Avoid `npm` or `yarn` commands entirely.
- Ensure `bun.lockb` is the source of truth for dependencies.
- Use `bun test` for running tests.
