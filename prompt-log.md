# Prompt Log

Date: 2026-05-19

- Initialized project guideline and decision log as requested.
- Actions: created project-guideline.md and decision-log.md.
- Next: create data-structure.md, scaffold Next.js app, install dependencies, and configure Prisma/Auth/UploadThing.

Date: 2026-05-20

- User requested Option A: adjust `schema.prisma` to expose camelCase app fields while keeping snake_case DB mappings, then update seed and NextAuth.
- Updated `User` with canonical auth fields: `id`, `email`, `name`, and `hashedPassword`.
- Updated role/user-role/permission-related schema names and relations to match app expectations.
- Updated `prisma/seed.ts` to seed roles, permissions, an admin user, and the admin role assignment using scrypt password hashes.
- Updated NextAuth route to NextAuth v5 style and Credentials + JWT sessions.
- Updated protected API routes and auth helper to use `auth()` and role codes.
- Downgraded Prisma CLI from `7.8.0` to `5.22.0` to match `@prisma/client`.
- Ran verification: `npx prisma validate`, `npx prisma generate`, and `npm run typecheck`.
- Note: Node `v16.20.1` in the current shell is below Next.js 15's supported runtime.

Date: 2026-05-20

- User reported schema drift and requested `prisma/schema.prisma` be aligned strictly to `sql-ddl.sql`.
- Compared DDL against Prisma and found drift in user name fields, image type, menu fields, enum-backed status columns, mapping-table audit fields, and maintenance status spelling/structure.
- Rebuilt `schema.prisma` to match `sql-ddl.sql` with camelCase app fields and exact `@map` / `@@map` database mappings.
- Updated `seed.ts` for `userName`, `firstName`, `lastName`, role/permission remarks, and a shorter scrypt hash that fits `user_password VARCHAR(150)`.
- Updated NextAuth and `/api/me` display names to compose `firstName` + `lastName`.
- Ran verification: `npx prisma validate`, `npx prisma generate`, and `npm run typecheck`.
