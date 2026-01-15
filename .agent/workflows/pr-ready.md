---
description: Final checks before opening a Pull Request.
---

1. Run `bun test` to ensure all tests pass.
2. Run `bun run lint` to verify no new lint errors were introduced.
3. Run `git status` to check for unstaged changes.
4. Generate a PR description by analyzing `git log main..HEAD`.
5. Offer to open the browser to the GitHub/GitLab "New Pull Request" page.
