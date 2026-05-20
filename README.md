# Car Rental Admin System (Scaffold)

Minimal scaffold for Car Rental Admin System using Next.js 15, TypeScript, Tailwind, Prisma, Auth.js, and UploadThing.

Quick start

1. Install dependencies

   npm install

2. Create .env file with required variables (example):

   DATABASE_URL="postgresql://user:password@localhost:5432/rentcar?schema=public"
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="<random-secret>"

3. Generate Prisma client and run initial migration

   npx prisma generate
   npx prisma migrate dev --name init

4. Run development server

   npm run dev

Notes
- Follow project-guideline.md, decision-log.md and prompt-log.md for project process and decisions.
- Use Conventional Commits for commits.
- Next steps: integrate Tailwind + shadcn/ui, configure NextAuth, UploadThing, and seed RBAC data.
