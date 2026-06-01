# Data Structure (Database Schema Summary)

Overview: concise reference of core tables, primary keys, important columns, and enums used in the system.

Core tables:

- "user"

  - App model: `User`
  - App fields map to DB columns: `id -> user_id`, `userName -> user_name`, `email -> user_email`, `hashedPassword -> user_password`
  - Name fields are split: `firstName -> user_first_name`, `lastName -> user_last_name`
  - Other mapped fields: `phone -> user_phone`, `cardImageId -> user_card_image_id`, `reportDownload -> user_report_download`
  - Audit fields: `createdAt/createdBy/updatedAt/updatedBy`, soft-delete via `isDeleted`

- roles

  - App model: `Role`
  - App fields map to DB columns: `id -> role_id`, `name -> role_name`, `code -> role_code`, `remark -> role_remark`
  - Role codes are used for RBAC checks, e.g. `ADMIN`, `MANAGER`, `AGENT`, `VIEWER`

- permissions

  - App model: `Permission`
  - App fields map to DB columns: `id -> permission_id`, `name -> permission_name`, `code -> permission_code`, `remark -> permission_remark`

- map_user_roles

  - App model: `UserRole`
  - App fields map to DB columns: `id -> map_user_role_id`, `userId -> user_id`, `roleId -> role_id`
  - Columns follow DDL only: `createdAt`, `createdBy`, `isDeleted`; no `updatedAt/updatedBy`

- menus

  - App model: `Menu`
  - App fields map to DB columns: `id -> menu_id`, `key -> menu_key`, `name -> menu_name`, `icon -> menu_icon`, `path -> menu_path`, `parentId -> menu_parent_id`, `sequence -> menu_sequence`

- map_role_menu_permissions
  - App model: `RoleMenuPermission`
  - App fields map to DB columns: `id -> map_rmp_id`, `roleId -> role_id`, `menuId -> menu_id`, `permissionId -> permission_id`
  - Columns follow DDL only: `createdAt`, `createdBy`; no soft-delete or update audit fields

Fleet management:

- vehicle_types (vehicle_type_id PK, name, desc)
- brands (brands_id PK, brands_name)
- cars
  - App model: `Car`
  - cars_id (UUID PK), vehicle_type_id (FK), brands_id (FK), cars_model, cars_years,
    cars_color, cars_license (unique), cars_status (`car_status_enum`), cars_mileage, is_deleted
- drivers (driver_id PK, driver_full_name, driver_phone, driver_card_images_id, driver_license_images_id)
- images (images_id PK, images_key, images_url, images_name, images_size, images_type)
- map_cars_images (map_cars_images_id PK, cars_id FK, images_id FK, cars_images_type, cars_images_numb)

Pricing & Booking:

- products (products_id PK, products_name, products_price, date_start, date_end, is_active)
- bookings
  - booking_id (UUID PK), products_id (FK), cars_id (FK), user_id (FK), driver_id (FK), booking_payment_images_id (FK -> images),
    booking_health_check_01_images_id (FK -> images), booking_health_check_02_images_id (FK -> images)
    date_start, date_end, date_count, price, daily_rate, discount_amount, tax_amount, net_amount, booking_status (`booking_status_enum`)
- payments
  - App model: `Payment`
  - payments_id (UUID PK), booking_id (FK), payment_date, amount, payment_method (`payment_method_enum`), payment_status (`payment_status_enum`)

Maintenance:

- maintenances
  - App model: `Maintenance`
  - maintenances_id (UUID PK), cars_id (FK), maintenances_name, maintenances_type (`maintenance_type_enum`), maintenances_status (`maintenance_status_enum`), mileage, mileage_target, mileage_alert, date_alert, date_start, date_end, is_deleted

Indexes & Conventions:

- Use snake_case in DB, UUID PKs, soft-delete via is_deleted
- Prisma uses camelCase fields with `@map` and `@@map` to match `sql-ddl.sql`
- `sql-ddl.sql` is the source of truth for table/column structure
- Important indexes in DDL: `idx_cars_deleted`, `idx_user_deleted`, `idx_booking_status`, `idx_booking_deleted`, `idx_payments_booking`
- Enums: `car_status_enum`, `booking_status_enum`, `payment_method_enum`, `payment_status_enum`, `maintenance_type_enum`, `maintenance_status_enum`

Notes:

- Booking overlap rules: prevent overlapping bookings, ignore cancelled bookings, booking dates inclusive.
- Pricing rules: dynamic pricing via products table and promotional logic applied during booking calculation.
- Auth seed creates roles, permissions, an admin user, and admin role assignment. Password hashes use the local `scrypt:salt:hash` format.
