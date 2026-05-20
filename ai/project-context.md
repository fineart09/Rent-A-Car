# Project Context

Domain Name:
CarSiamAuto.com

Project Name:
Car Siam Auto 

Project Type:
Admin dashboard for managing a car rental business.

Project Goal:
Build a scalable and maintainable car rental management system for managing:

* Cars
* drivers
* Bookings
* Payments
* Maintenance alerts
* Reports
* Rental contracts
* Role-based authentication

Tech Stack:

* Next.js App Router
* TypeScript
* PostgreSQL
* Prisma ORM
* Tailwind CSS
* shadcn/ui
* Auth.js
* Zod
* React Hook Form

Architecture Style:

* Feature-based architecture
* Clean architecture principles
* Service layer
* Repository pattern
* Reusable UI components

Main Modules:

1. Authentication
2. Cars Management
3. drivers Management
4. Booking Management
5. Payment Management
6. Users Management
7. Role and Permission Management
8. Maintenance Alerts
9. Reports
10. PDF Contract Generation

Core Business Rules:

* Cars cannot be double-booked
* Financial reports are admin-only
* Maintenance alerts trigger based on mileage
* PDF contracts can limit print count
* Dynamic pricing can change by date range
* Cancelled bookings do not block booking dates

Important Rules:

* Always prioritize maintainability
* Avoid duplicated logic
* Use reusable components
* Keep business logic outside UI components
* Follow existing architecture strictly
