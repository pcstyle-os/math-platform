---
description: Create a Vercel preview deployment.
---

1. Run `bun run build` to ensure the project compiles without errors.
2. If the build fails, report errors and ask for fixes.
3. If the build succeeds, run `vercel --prod=false`.
4. Capture the preview URL from the command output.
5. Provide the preview URL to the user and offer to open it in the browser.
