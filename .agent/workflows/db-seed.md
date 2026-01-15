---
description: Seed the database with development data.
---

1. Identify the tables in `convex/schema.ts`.
2. Ask the user which tables they want to seed (or "all").
3. Create a temporary seed script or use an existing one in `convex/seed.ts`.
4. Run the seed mutation via `npx convex run seed:all` (or equivalent).
5. Confirm completion and show a snippet of the seeded data.
