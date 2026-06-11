# Car Rental Admin System

Admin dashboard for a car rental application using Next.js 15, TypeScript, Tailwind,
Prisma, Auth.js, and UploadThing.

Quick start

1. Install dependencies

   npm install

2. Create .env file with required variables (example):

   DATABASE_URL="postgresql://user:password@localhost:5432/rentcar?schema=public"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="<random-secret>"

3. Generate Prisma client and run migrations

   npx prisma generate
   npx prisma migrate dev --name init

4. Run development server

   npm run dev

Notes
- Follow project-guideline.md, decision-log.md and prompt-log.md for project process and decisions.
- Use Conventional Commits for commits.
- Tailwind, shadcn-style UI primitives, Auth.js credentials login, RBAC shell, dashboard, cars pages, and booking availability draft flow are implemented.
- Sidebar menus are available for Dashboard, Cars, Bookings, Payments, Maintenance, and Users/RBAC.
- Booking availability treats `Pending`, `Confirmed`, and `InProgress` bookings as blocking statuses. `Completed`, `Cancelled`, and `Rejected` do not block availability.
- The new booking draft page is available at `/bookings/new` and supports prefilled car IDs via `?id=` or `?car_id=`.
- Prisma 7 requires Node 20.19+; use that runtime for lint/build/Prisma validation.
