---
description: Generate a daily standup summary.
---

1. Read the git log for the current branch for the last 24 hours.
2. Extract the titles of all `feat`, `fix`, and `refactor` commits.
3. Check the current `TODO.md` or `GEMINI.md` for pending tasks.
4. Compose a message:
   - **Yesterday**: [summarized commits]
   - **Today**: [next priority tasks]
   - **Blockers**: [potential issues found in logs/tests]
5. Display the message to the user.
