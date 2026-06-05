# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Car Rental Admin System (Car Siam Auto) — a Next.js 15 (App Router) admin dashboard for managing a car rental business. Stack: TypeScript, Tailwind CSS, shadcn/ui, Prisma 7 + PostgreSQL, Auth.js (NextAuth v5) with Credentials + JWT, UploadThing, Zod, TanStack Query, react-hook-form. UI text is primarily in Thai.

Primary color: `#1E40AF` (dark blue, see `tailwind.config.cjs`). See `docs/shadcn-integration.md` for the original shadcn init steps.

## Common Commands

Local Postgres: `docker compose up -d` (port 5432, user `postgres` / pass `123` / db `rent-car-app`).

```bash
npm install
cp .env.example .env             # fill DATABASE_URL, NEXTAUTH_SECRET, UPLOADTHING_*
npx prisma generate
npx prisma migrate dev --name <name>   # creates a new migration in prisma/migrations/
npm run db:seed                  # seeds roles, permissions, admin user
npm run dev                      # http://localhost:3000
```

Verification (each can be run independently):

```bash
npm run typecheck                # tsc --noEmit
npm run lint                     # next lint
npm run build                    # next build (also runs prisma generate)
npx prisma validate
```

Database:

```bash
npm run db:migrate               # prisma migrate dev (interactive)
npm run db:push                  # prisma db push (no migration file)
npm run db:seed                  # dotenv -e .env npx tsx prisma/seed.ts
npm run prisma:generate          # refresh Prisma client types
```

E2E tests (Playwright, in `tests-e2e/`):

```bash
npx playwright install           # first time only
npx playwright test              # all specs; reads E2E_USERNAME / E2E_PASSWORD
```

Formatting & git hooks: `npm run format` (Prettier), `npm run prepare` (Husky). Pre-commit runs `lint-staged` via `.husky/pre-commit`.

## High-Level Architecture

### Routing (Next.js App Router)

- `src/app/layout.tsx` — root layout; wraps everything in `<Providers>` (which adds `SessionProvider`).
- `src/app/(auth)/` — auth route group; `signin/page.tsx` is the only sign-in page (Thai labels, `next-auth/react` `signIn`).
- `src/app/(dashboard)/` — protected dashboard group; `layout.tsx` calls `auth()` and renders `<ResponsiveShell>` + `<RBACSidebar>`. The middleware in `middleware.ts` redirects unauthenticated requests to `/signin`.
- `src/app/(dashboard)/{dashboard,cars,bookings,payments,maintenance,users}/` — read-only admin pages (all `export const dynamic = 'force-dynamic'` and read directly from Prisma).
- `src/app/(dashboard)/bookings/new/` — draft booking flow: `page.tsx` loads cars + products, prefills `?id=` or `?car_id=`, and `NewBookingForm.tsx` is the client form that calls the availability API.
- `src/app/api/auth/[...nextauth]/route.ts` — re-exports `handlers` from `@/lib/auth`.
- `src/app/api/{cars,bookings,payments}/route.ts` — read-only JSON lists guarded by `auth()` and a role allowlist.
- `src/app/api/bookings/availability/route.ts` — supports both `GET` (query string) and `POST` (JSON). Accepts `car_id` or `id`, plus `date_start`/`date_end`; returns `{ available, conflicts[] }`.

### Auth & RBAC

- `src/lib/auth.ts` — `NextAuth(authConfig)` using **CredentialsProvider + JWT sessions** (no Prisma adapter). Login accepts `username` OR `email`. Passwords are stored as `scrypt:salt:hexhash` and verified with `timingSafeEqual`. The JWT carries `id` and `roles[]` (role codes from `Role.code`); `pages.signIn = '/signin'`.
- `src/lib/prisma.ts` — singleton `PrismaClient` with the `@prisma/adapter-pg` PostgreSQL adapter; uses `global.prisma` to survive HMR in dev.
- `src/lib/auth-server.ts` — `getSessionAndRoles()` helper that re-fetches the user and role codes from Prisma (useful in API routes that need fresh role data beyond the JWT).
- `src/lib/rbac/menus.ts` — `menuItems` array with `roles: string[]` (lowercased: `admin`, `manager`, `agent`, `user`).
- `src/lib/rbac/permissions.ts` — `requireRoles` / `hasAnyRole` for API responses.
- `src/lib/rbac/auth-connects.ts` — `userHasRole` / `userHasAnyRole` for components.
- `src/lib/session.ts` — `getRoles`, `getUserName`, `getUserEmail`, `isAdmin` (note: reads `user_name` / `user_email` snake-case keys — inconsistent with the camelCase session shape used by `RBACSidebar`, which falls back through multiple field names).
- `src/components/RBACSidebar.tsx` — client component that filters `menuItems` by lowercased roles and renders an icon list. Sign-out calls `signOut({ callbackUrl: '/signin' })`.

Role codes (defined in `prisma/seed.ts`): `ADMIN`, `MANAGER`, `AGENT`, `VIEWER`. Menu visibility:
- Dashboard — all roles
- `/cars`, `/bookings` — `admin`, `manager`, `agent`
- `/payments`, `/maintenance` — `admin`, `manager`
- `/users` — `admin` only

### Database (Prisma 7)

- `prisma/schema.prisma` is the source of truth, with `@map` / `@@map` to match the snake_case columns in `ai/sql-ddl.sql`. **All app code uses camelCase Prisma fields** (e.g., `userName`, `hashedPassword`, `firstName`, `carId`, `dateStart`, `netAmount`, `isDeleted`).
- `prisma.config.ts` loads `.env` via `dotenv` and configures the seed command.
- `prisma/seed.ts` upserts `Role`, `Permission`, an admin `User`, and the admin role assignment, plus a system user with `id = '00000000-0000-0000-0000-000000000000'` for audit fields. Admin credentials default to `admin` / `admin` (overridable via `SEED_ADMIN_USERNAME` / `SEED_ADMIN_PASSWORD`).
- Soft-delete convention: `isDeleted` on `Car`, `Booking`, `Maintenance`, `Product`, `User`. Queries almost always filter `isDeleted: false`.
- Audit fields: most tables have `createdAt/createdBy/updatedAt/updatedBy`; `UserRole` and `RoleMenuPermission` only have `createdAt/createdBy` per the DDL.
- Key enums: `car_status_enum`, `booking_status_enum`, `payment_method_enum`, `payment_status_enum`, `maintenance_type_enum`, `maintenance_status_enum`.

### Availability rules (important)

The booking availability API (`src/app/api/bookings/availability/route.ts`) treats only `Pending`, `Confirmed`, and `InProgress` as **blocking** statuses. `Completed`, `Cancelled`, and `Rejected` do **not** block availability. Date ranges are inclusive (start of day UTC to end of day UTC when given as `YYYY-MM-DD`).

### Shared UI / formatting

- `src/lib/ui-format.ts` — `formatBaht`, `formatCompactNumber`, `formatThaiDate` (Buddhist calendar, `Asia/Bangkok`), `getStatusLabel`, `getStatusBadgeClass`, plus a Prisma `Decimal` helper `toNumber`. Use these instead of re-implementing money/date formatting.
- `src/lib/utils.ts` — `cn` (clsx + tailwind-merge).
- `src/components/ui/` — local shadcn-style primitives (`Button`, `Input`, `Label`, `Select`, `Card`, `Badge`, `DropdownMenu`, `Sheet`) re-exported from `index.ts`. `Input`, `Label`, and `Select` are **default exports**; the others are named.
- `src/components/ResponsiveShell.tsx` — client wrapper providing a fixed sidebar on `md+` and a slide-in sheet on mobile.

### Path aliases (`tsconfig.json`)

`@/*` → `src/*`, plus granular aliases `@/app/*`, `@/components/*`, `@/components/ui/*`, `@/lib/*`, `@/rbac/*` (= `src/lib/rbac/*`), `@/types/*` (= `src/lib/types/*`). Import paths in existing code mostly use `@/...`; the `@/rbac/*` alias exists but is not yet widely used.

### Environment & CI

- `.env.example` documents `DATABASE_URL`, `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, UploadThing, Stripe, `VERCEL_ENV`. `prisma.config.ts` loads `.env` via `dotenv`; `dotenv-cli` is also used by `db:seed`.
- `.github/workflows/ci.yml` runs `npm ci` → `lint` → `typecheck` → `build` on Node 20. **Prisma 7 requires Node 20.19+; Next.js 15 requires Node 18.18+** — use Node 20 for any local lint/build/Prisma validation.

## Project Process

Per `ai/project-guideline.md`, every meaningful change must:

1. Append to `ai/decision-log.md` (date + decisions + notes).
2. Append to `ai/prompt-log.md` (date + what was done + verification steps).
3. Use **Conventional Commits** (`feat:`, `fix:`, `refactor:`, `chore:`).
4. Follow the conventions: snake_case in DB, camelCase in code, Zod validation on both client and server, business logic in services/repositories, prefer server components.

`ai/data-structure.md` is the canonical schema reference; `ai/sql-ddl.sql` is the source of truth for table/column structure. When in doubt about a column or enum, consult those before changing `schema.prisma`.

## E2E

- `tests-e2e/signin.spec.ts` — signs in via `/signin` using Thai button text "เข้าสู่ระบบ" and waits for redirect to `/dashboard`. Credentials come from `E2E_USERNAME` / `E2E_PASSWORD` (falling back to `SEED_ADMIN_USERNAME` / `SEED_ADMIN_PASSWORD`, then `admin` / `admin`).
