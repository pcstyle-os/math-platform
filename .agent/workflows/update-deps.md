---
description: Safely update project dependencies.
---

1. Run `bun update` to update packages to their latest compatible versions.
2. Run `bun install` to ensure the lockfile is synchronized.
3. Run `bun test` to catch any regressions.
4. If tests pass, stage `package.json` and `bun.lockb`.
5. Provide a summary of updated packages.
