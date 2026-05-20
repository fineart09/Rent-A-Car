# Workflow

# Car Siam Auto Development Workflow

This document defines the engineering workflow for the project.

The goal is to maintain:

* scalable architecture
* consistent code quality
* maintainable business logic
* reusable components
* stable AI-assisted development

---

# 1. Development Principles

Always prioritize:

* maintainability
* scalability
* readability
* clean architecture
* reusable logic

Avoid:

* duplicated code
* fat components
* direct database access inside UI
* inconsistent naming
* business logic inside React components

---

# 2. AI Workflow

Before generating any code:

Read:

* ai/project-context.md
* ai/architecture-rules.md
* ai/business-rules.md
* ai/database-rules.md
* ai/server-action-rules.md
* ai/booking-logic-rules.md
* ai/upload-rules.md
* ai/pdf-rules.md
* ai/prompt-log.md
* ai/decisions.md
* ai/current-task.md

Follow all rules strictly.

Do not generate code that conflicts with previous decisions.

---

# 3. Feature Development Flow

Each feature must follow this order:

1. Define current task
2. Create database schema
3. Create validation schema
4. Create repository layer
5. Create service layer
6. Create server actions
7. Create UI components
8. Add loading/error states
9. Add table/list page
10. Update AI memory files

---

# 4. Folder Structure

Use feature-based architecture.

Structure:

src/
app/
modules/
components/
services/
repositories/
lib/
hooks/
types/

Each module should contain:

module-name/
components/
actions/
services/
repositories/
validations/
types/
utils/

---

# 5. Database Workflow

Rules:

* Use Prisma ORM only
* Use PostgreSQL
* Use migrations
* Use snake_case for database columns
* Use UUID for internal IDs
* Include:

  * created_date
  * created_by
  * updated_date
  * updated_by
  * is_deleted

Never:

* query database directly inside UI components
* duplicate Prisma queries

---

# 6. Validation Workflow

All forms must:

* use Zod validation
* validate on both client and server
* return consistent error responses

---

# 7. Business Logic Workflow

Business logic must stay inside:

* services/
* repositories/

Never inside:

* page.tsx
* components
* client UI

---

# 8. UI Workflow

UI Stack:

* Tailwind CSS
* shadcn/ui
* TanStack Table

Rules:

* Keep components reusable
* Keep components small
* Prefer server components
* Use client components only when necessary

---

# 9. Booking Workflow

Booking Rules:

* Prevent overlapping bookings
* Ignore cancelled bookings
* Cars in maintenance cannot be booked
* Calculate total rental days automatically
* Calculate total price automatically

Validation:

* end_date > start_date
* customer must exist
* car must exist and be available

---

# 10. Payment Workflow

Requirements:

* Support dynamic pricing
* Support promotion pricing
* Store transaction history
* Support:

  * Credit Card
  * Bank Transfer
  * PromptPay

---

# 11. Maintenance Workflow

Requirements:

* Trigger maintenance alerts based on mileage
* Cars in maintenance cannot be booked
* Store maintenance history

---

# 12. PDF Contract Workflow

Use:

* React PDF

Requirements:

* Generate contract from booking data
* Generate contract from customer data
* Generate contract from payment data
* Track print count

---

# 13. Authentication Workflow

Use:

* Auth.js

Roles:

* Admin
* Staff
* Add permission roles

Permissions:

* Financial reports are admin-only

---

# 14. Logging Workflow

After each completed task:

Update:

* ai/prompt-log.md
* ai/decisions.md
* ai/current-task.md

Always document:

* architecture decisions
* important business logic
* reusable patterns

---

# 15. Refactoring Workflow

Before refactoring:

* read all AI memory files

Requirements:

* preserve business behavior
* improve maintainability
* reduce duplicated logic
* preserve TypeScript types
* preserve architecture

---

# 16. Deployment Workflow

Hosting:

* Vercel

Database:

* PostgreSQL

Storage:

* S3 / UploadThing

Environment Variables:

* DATABASE_URL
* AUTH_SECRET
* S3 credentials
* UploadThing keys

---

# 17. Git Workflow

Branch Naming:

* feature/module-name
* fix/issue-name
* refactor/module-name

Commit Format:

* feat:
* fix:
* refactor:
* chore:

Examples:

* feat: add booking module
* fix: resolve booking overlap validation
* refactor: improve payment service

---

# 18. Code Review Checklist

Before merging:

Check:

* TypeScript errors
* validation
* loading states
* error handling
* duplicated logic
* responsive UI
* Prisma query optimization
* naming consistency

---

# 19. Important Project Goals

This system must:

* be maintainable long-term
* support business growth
* support future modules
* remain consistent
* remain scalable

Prioritize architecture quality over short-term speed.
