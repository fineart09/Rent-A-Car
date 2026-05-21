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

Date: 2026-05-20

Decisions:

- Aligned Prisma auth/RBAC models to app-facing camelCase names while preserving snake_case database columns with `@map` and `@@map`.
- Added canonical auth fields to `User`: `id`, `email`, `name`, `hashedPassword`, plus mapped audit and soft-delete fields.
- Renamed app-facing Prisma models for core delegates: `Role`, `UserRole`, `RoleMenuPermission`, `Car`, `Payment`, `Maintenance`, and `CarImage`.
- Updated Auth.js integration to the installed NextAuth v5 API using exported `auth`, `handlers`, `GET`, and `POST`.
- Removed the unused Prisma adapter import because the project currently uses Credentials + JWT sessions.
- Standardized RBAC checks on role codes such as `ADMIN`, `MANAGER`, and `AGENT`.
- Aligned Prisma CLI to `5.22.0` to match `@prisma/client@5.22.0`.

Notes:

- `npx prisma validate`, `npx prisma generate`, and `npm run typecheck` pass after this change.
- Current shell Node is `v16.20.1`; Next.js 15 requires Node `>=18.18.0`, so runtime/build verification should use Node 18+.

Date: 2026-05-20

Decisions:

- Treated `sql-ddl.sql` as the source of truth for Prisma schema structure.
- Rebuilt `prisma/schema.prisma` to match the DDL tables, columns, enum types, indexes, and removed columns.
- Replaced app-facing `User.name` with DDL-aligned `userName`, `firstName`, and `lastName` mapped to `user_name`, `user_first_name`, and `user_last_name`.
- Kept camelCase application fields in Prisma and mapped every nonmatching table/column name with `@map` / `@@map`.
- Updated seed and NextAuth to use `firstName`/`lastName` for display names and a DDL-safe scrypt hash length for `user_password VARCHAR(150)`.

Notes:

- `npx prisma validate`, `npx prisma generate`, and `npm run typecheck` pass after this DDL alignment.
