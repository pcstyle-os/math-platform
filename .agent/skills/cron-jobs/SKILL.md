# cron-jobs

## Description

Schedule and manage recurring tasks (Vercel Cron, GitHub Actions).

## Instructions

- Configure `vercel.json` for Vercel Cron jobs.
- Define `.github/workflows/*.yml` for GitHub Actions on cron triggers.
- Ensure scheduled tasks are idempotent (can run multiple times without unintended side effects).
- Add logging and alerting for failed cron jobs.
- Use a local tool (like `cron`) to test schedules if possible.
