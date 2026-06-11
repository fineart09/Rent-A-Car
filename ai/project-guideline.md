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

Project timeline SRS review:

Done:
1. Login via email exists with Auth.js credentials sign-in.
2. Car management list/detail pages exist with search, filter, status display, and booking entry points.
3. Booking draft flow exists with car selection, date selection, price calculation, and availability validation.
4. Services data model exists in Prisma as `products`, and booking flow already uses it for draft pricing.
5. Customer, payment, maintenance, and settings menus/pages exist as dashboard modules.
6. RBAC is implemented through roles and protected API routes.

Partially done:
1. Car create/edit flows exist only as a read-oriented UI and need full CRUD pages.
2. Maintenance is shown as a list page, but create/edit/payment lifecycle screens are not finished.
3. Customer management exists mostly through related booking/user data, but there is no dedicated full customer CRUD flow yet.
4. Reports are not implemented as exportable PDF workflows yet.
5. Settings user/role management exists as a list view, but full create/edit permission management screens are still missing.
6. Vehicle document generation and upload flows are still incomplete.

Not done:
1. Car engine number and chassis number fields from the SRS are not present in the current schema/UI.
2. Full customer history by custom date range reporting is not implemented yet.
3. Full service CRUD screens and service management UI are not implemented yet.
4. Print/export of health check, contract, and payment documents is not implemented yet.
5. Revenue, maintenance payment, debt, and customer usage reports are not implemented yet.
6. Full admin user CRUD and permission assignment workflows are not implemented yet.
