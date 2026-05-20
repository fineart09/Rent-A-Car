# Decision Log

Date: 2026-05-19

Decisions:
- Stack: Next.js 15 (App Router) + TypeScript.
- UI: Tailwind CSS + shadcn/ui + Lucide Icons.
- Database: PostgreSQL with Prisma ORM. Use snake_case for DB columns and UUID for primary keys.
- Auth: Auth.js (NextAuth) for session + role-based access control.
- File Storage: UploadThing as primary, S3 fallback.
- Validation: Zod for client and server validation.
- PDF: React PDF for contract generation.
- Architecture: Feature-based architecture, repository + service layers, server actions for mutations.
- CI/CD: GitHub Actions with lint/build/type-check steps; use conventional commits.

Notes:
- All important decisions must be logged here with date and author.
