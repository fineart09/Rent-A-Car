# Architecture Rules

General Rules:

* Use TypeScript strict mode
* Use Prisma ORM only
* Use PostgreSQL
* Use App Router
* Use Server Actions
* Use Zod validation
* Use reusable UI components
* Use feature-based architecture

Forbidden:

* Do not query database directly inside UI components
* Do not put business logic inside React components
* Do not use mock APIs
* Do not duplicate validation logic
* Do not create large monolithic files

Folder Structure:
src/
app/
modules/
components/
services/
repositories/
lib/
hooks/
types/

Module Structure:
module-name/
components/
actions/
services/
repositories/
validations/
types/
utils/

Coding Standards:

* Use async/await
* Handle loading states
* Handle error states
* Keep components small
* Prefer server components
* Use client components only when necessary

Database Rules:

* Use Prisma migrations
* Use soft delete when appropriate
* Add created_at and updated_at timestamps
* Add created_by and updated_by user_id
* Use enums for statuses

UI Rules:

* Use shadcn/ui
* Use Tailwind CSS
* Use responsive layouts
* Use TanStack Table for data tables

Validation Rules:

* Use Zod for all forms
* Validate both client and server side
