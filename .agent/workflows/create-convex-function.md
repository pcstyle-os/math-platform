---
description: Scaffold a Convex function (query/mutation/action).
---

1. Ask for the function type (`query`, `mutation`, or `action`) and the name.
2. Ask for the table name it interacts with (if applicable).
3. Create `convex/<name>.ts` with the appropriate boilerplate:
   - Import `v` from `convex/values`.
   - Import `mutation`, `query`, or `action` from `./_generated/server`.
   - Define basic arguments and the function body.
4. Provide a link to the new file.
