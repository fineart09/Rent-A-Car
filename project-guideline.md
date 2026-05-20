# Project Guideline

Purpose: central, canonical guideline for Car Siam Auto project. This file must be updated for any major process or workflow change.

Mandatory rules for every task:
- Update these files for each task: decision-log.md, prompt-log.md
- Keep conventional commit messages (feat:, fix:, refactor:, chore:)
- Follow architecture and business rules in ai/ directory
- Use TypeScript, Prisma, Zod, server actions

Initial setup checklist (do these first):
1. Initialize Next.js 15 app with TypeScript
2. Install and configure: Tailwind CSS, shadcn/ui, Lucide Icons
3. Install Prisma and configure PostgreSQL + migrations
4. Install Auth.js (NextAuth) and configure providers
5. Install UploadThing (or S3) for file storage
6. Install Zod, React Hook Form, TanStack Query, next-themes
7. Configure ESLint, Prettier, Husky, lint-staged
8. Create GitHub repo and add GitHub Actions CI for lint/build/type-check

Folder structure (feature-based):
- src/
  - app/
  - modules/
  - components/
  - services/
  - repositories/
  - lib/
  - hooks/
  - types/

Core conventions:
- Use snake_case in DB, camelCase in code
- Enforce Zod for validation on client & server
- Business logic only inside services/repositories
- Prefer server components; use client components only when necessary

Branding / Theme:
- Primary color: #1E40AF (dark blue)
- Support dark mode via next-themes

Deployment:
- Vercel (set env vars for DATABASE_URL, AUTH_SECRET, UPLOADTHING_SOMETHING, S3 credentials if used)

Change log:
- Created initial guideline and checklist.
