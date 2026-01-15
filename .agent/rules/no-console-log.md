---
description: Prefer structured logging over console.log.
---

# No Console Log

- Do **not** use `console.log` in production code files.
- Use a structured logging approach (e.g., a custom logger or a library like `pino`/`winston`) if available in the project.
- If no logger is present, and logging is necessary for production monitoring, propose adding a logging utility.
- Temporary debugging logs are allowed during development but **must** be removed before finalizing the task.
