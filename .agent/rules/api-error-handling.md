---
description: Unified API error handling structure.
---

# API Error Handling

- All API routes (`app/api/**/*`) and public backend functions (`convex/*.ts`) must use `try-catch` blocks.
- **Standardized Response**: Errors should return a consistent JSON structure:

  ```json
  {
    "status": "error",
    "code": "ERROR_CODE_STRING",
    "message": "Human-readable message"
  }
  ```

- Use appropriate HTTP status codes (400 for bad requests, 401 for unauthorized, 404 for not found, 500 for server errors).
- Do not leak sensitive internal errors or stack traces in production responses.
