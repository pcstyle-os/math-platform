---
description: Handle database schema changes with extreme caution.
---

# Database Migrations Review

- **Flag Schema Changes**: Any modification to `convex/schema.ts` (or other database schemas) must be explicitly highlighted to the user.
- **Data Loss Warning**: If a change involves deleting a field, changing a type, or renaming a table, provide a clear warning about potential data loss.
- **Default Values**: Ensure new mandatory fields have sensible default values or a migration strategy.
- **Index Optimization**: Suggest appropriate indexes for new query patterns.
