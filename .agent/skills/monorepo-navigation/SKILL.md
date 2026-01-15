# monorepo-navigation

## Description

Understand and work with Turborepo, Nx, or pnpm workspaces.

## Instructions

- Use `bun --filter <package>` or `pnpm --filter <package>` to run commands on specific workspaces.
- Navigate between shared packages and application code.
- Ensure dependencies between internal packages are properly linked in `package.json` using `workspace:*`.
- Use the root-level task runner for project-wide operations (e.g., `bun run build` from the root).
