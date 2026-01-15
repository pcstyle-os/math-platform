---
description: Enforce strict TypeScript types and practices.
---

# TypeScript Strict Mode

- **Never** use the `any` type. If a type is unknown, use `unknown`.
- **Always** specify explicit return types for exported functions and methods.
- **Prefer** interfaces for public APIs and types for internal data structures.
- **Avoid** non-null assertions (`!`) unless absolutely necessary for external library compatibility; prefer optional chaining or explicit null checks.
- Use `Readonly` and `ReadonlyArray` for data that should not be mutated.
