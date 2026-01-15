---
description: Enforce security headers in configuration.
---

# Security Headers

- Ensure that `Content-Security-Policy` (CSP) is defined and restricted.
- Set `X-Frame-Options` to `DENY` or `SAMEORIGIN`.
- Set `Strict-Transport-Security` for production environments.
- Set `X-Content-Type-Options: nosniff`.
- Set `Referrer-Policy: strict-origin-when-cross-origin`.
- Verify these headers in `next.config.js` or middleware.
