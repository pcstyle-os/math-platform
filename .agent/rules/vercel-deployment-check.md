---
description: Verify Vercel compatibility for all changes.
---

# Vercel Deployment Check

- Check for Edge Runtime compatibility if using Edge functions.
- Ensure serverless function timeouts and size limits are respected.
- Verify environment variables needed for the build are documented.
- Check that `next.config.js` does not contain incompatible options.
- Proactively warn if a change might break the Vercel deployment flow.
