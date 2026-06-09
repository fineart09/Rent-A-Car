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

Date: 2026-06-02

Decisions:

- Added the first New Booking Flow milestone as a draft workflow rather than creating bookings immediately.
- Added `/api/bookings/availability` to check car availability by `car_id` or `id`, `date_start`, and `date_end`.
- Availability blocks only active booking statuses: `Pending`, `Confirmed`, and `InProgress`.
- Availability ignores terminal or inactive booking statuses: `Completed`, `Cancelled`, and `Rejected`.
- Added `/bookings/new` to load available cars and active products from Prisma, prefill car selection from `?id=` or `?car_id=`, calculate draft totals, and call the availability API.
- Updated the sign-in E2E test to use `/signin`, Thai button text, and env-driven credentials.

Notes:

- The new booking page currently verifies availability and calculates a draft summary; actual booking creation remains a future milestone.

Date: 2026-06-02

Decisions:

- Expanded the RBAC sidebar to include the core admin modules: Dashboard, Cars, Bookings, Payments, Maintenance, and Users/RBAC.
- Added read-only list pages for `/bookings`, `/payments`, `/maintenance`, and `/users` so every sidebar menu resolves to a real dashboard page.
- Kept creation/editing workflows out of this menu expansion except for the existing `/bookings/new` draft flow.

Notes:

- Menu visibility remains role-based: agents can access cars/bookings, managers can access payments/maintenance, and users/RBAC is admin-only.

Date: 2026-06-06

Decisions:

- Rebuilt `prisma/schema.prisma` to expose camelCase Prisma fields while mapping back to the snake_case tables and columns defined in `ai/sql-ddl.sql`.
- Aligned the schema with the DDL-driven domain model for cars, bookings, payments, maintenance, and RBAC tables, including the missing `Booking.car` relation and booking image relations.
- Added the DDL index definitions to Prisma schema indexes so the generated client and database intent stay in sync.
- Updated `ai/data-structure.md` to reflect the camelCase Prisma API and the current mapping names.

Notes:

- Verification passed after the schema rewrite: `npx prisma validate`, `npx prisma generate`, and `npm run typecheck`.

Date: 2026-06-06

Decisions:

- Renamed the active dashboard menu set to match `project timeline(Menu).csv` more closely: `ระบบจัดการรถยนต์`, `ข้อมูลลูกค้า`, `ข้อมูลบริการ/โปรโมชั่น`, `บันทึกรายการเช่ารถ`, `การชำระเงิน`, and `ตั้งค่าระบบ`.
- Added new route targets for the CSV structure: `/driver`, `/products`, `/booking`, `/setting/users`, and `/cars/maintenance`, while keeping existing routes as compatibility paths where practical.
- Added lightweight placeholder pages for the new menu targets so every menu item resolves to a real page now.

Notes:

- Verification passed after the menu rename pass: `npm run typecheck`.

Date: 2026-06-09

Decisions:

- Consolidated the car-creation flow to a single active implementation: `CarSpeedDialClient` + `CarCreateModal` + `CarForm` + `SpeedDialContainer`.
- Removed unused duplicate car-create components and old speed dial variants to reduce drift and make edits land in one place.
- Hardened `createCar()` so it fails cleanly when there is no authenticated session instead of writing an invalid `unknown` audit ID.

Notes:

- Verification passed after cleanup: `npm run typecheck`.
