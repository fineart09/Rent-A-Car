# AI Coding Instructions

Before generating any code:

1. Read:

* ai/project-context.md
* ai/architecture-rules.md
* ai/business-rules.md
* ai/prompt-log.md
* ai/current-task.md

2. Follow all architecture and business rules strictly.

3. Reuse existing:

* services
* repositories
* components
* validation schemas

4. Maintain consistency in:

* naming
* folder structure
* database schema
* TypeScript types

5. Always:

* use TypeScript
* use Prisma
* use Zod
* use server actions
* handle loading states
* handle error states

6. Never:

* place business logic inside React components
* query database directly inside UI
* duplicate logic
* generate unused code

7. After completing a task:

* Append task summary to ai/prompt-log.md
* Append technical decisions to ai/decisions.md

8. Prioritize:

* maintainability
* scalability
* readability
* reusable architecture
