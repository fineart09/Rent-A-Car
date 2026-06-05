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

Date: 2026-06-02

- User asked to continue after Copilot's partial New Booking Flow implementation.
- Reviewed Copilot changes and found the availability API was filtering by booking `id` instead of `carId`, active statuses included non-blocking statuses, `/bookings/new` was still a placeholder, sign-in E2E still clicked English text, and docs were not updated.
- Fixed `/api/bookings/availability` to validate payloads, use `carId`, ignore deleted bookings, block only `Pending`, `Confirmed`, and `InProgress`, and return serializable conflict data.
- Implemented `/bookings/new` as a real server page that loads cars/products from Prisma and supports both `?id=` and `?car_id=` prefill parameters.
- Rebuilt `NewBookingForm` with Thai labels, price/date calculations, selected-car summary, and an availability result state.
- Updated `tests-e2e/signin.spec.ts`, `README.md`, and `ai/decision-log.md`.
- Ran `npm run typecheck`; lint/build/Prisma validation still require a Node runtime compatible with Next.js 15 and Prisma 7.

Date: 2026-06-02

- User requested completing the sidebar menus.
- Added menu entries for Bookings, Payments, Maintenance, and Users/RBAC in `src/lib/rbac/menus.ts`.
- Updated `RBACSidebar` with matching Lucide icons and active-state support for the new routes.
- Added read-only dashboard pages for `/bookings`, `/payments`, `/maintenance`, and `/users`.
- Updated `README.md` and `ai/decision-log.md`.
- Ran verification: `npm run typecheck` passed.

Date: 2026-06-06

- User requested `prisma/schema.prisma` be aligned to `ai/sql-ddl.sql` and converted to camelCase.
- Rebuilt the Prisma schema to use camelCase model fields, relation names, and enums while mapping to the snake_case database tables and columns.
- Added missing relations and indexes from the DDL, including `Booking.car`, booking image relations, and DDL-backed indexes.
- Updated `ai/data-structure.md` and logged the naming decision in `ai/decision-log.md`.
- Verification passed: `npx prisma validate`, `npx prisma generate`, and `npm run typecheck`.

Date: 2026-06-06

- User asked to align menu names and folder routes with `project timeline(Menu).csv`.
- Renamed the active menu labels to match the CSV naming style and added new route targets for `/driver`, `/products`, `/booking`, `/setting/users`, and `/cars/maintenance`.
- Added lightweight placeholder pages for each new menu target so the sidebar links resolve cleanly.
- Cleared the generated Next.js cache and re-ran `npm run typecheck` successfully after the route restructure.
