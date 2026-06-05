# Data Structure (Database Schema Summary)

Overview: concise reference of core tables, primary keys, important columns, and enums used in the system.

Core tables:

- "user"

  - App model: `User`
  - App fields map to DB columns: `id -> user_id`, `userName -> user_name`, `email -> user_email`, `hashedPassword -> user_password`
  - Name fields are split: `firstName -> user_first_name`, `lastName -> user_last_name`
  - Other mapped fields: `phone -> user_phone`, `cardImageId -> user_card_image_id`, `reportDownload -> user_report_download`, `remark -> user_remark`
  - Audit fields: `createdAt/createdBy/updatedAt/updatedBy`, soft-delete via `isDeleted`

- roles

  - App model: `Role`
  - App fields map to DB columns: `id -> role_id`, `name -> role_name`, `code -> role_code`, `description -> role_desc`, `remark -> role_remark`, `isActive -> is_active`
  - Role codes are used for RBAC checks, e.g. `ADMIN`, `MANAGER`, `AGENT`, `VIEWER`

- permissions

  - App model: `Permission`
  - App fields map to DB columns: `id -> permission_id`, `name -> permission_name`, `code -> permission_code`, `description -> permission_desc`, `remark -> permission_remark`

- map_user_roles

  - App model: `UserRole`
  - App fields map to DB columns: `id -> map_user_role_id`, `userId -> user_id`, `roleId -> role_id`
  - Columns follow DDL only: `createdAt`, `createdBy`, `isDeleted`; no `updatedAt/updatedBy`

- menus

  - App model: `Menu`
  - App fields map to DB columns: `id -> menu_id`, `key -> menu_key`, `title -> menu_title`, `icon -> menu_icon`, `path -> menu_path`, `parentId -> menu_parent_id`, `sequence -> menu_sequence`, `remark -> menu_remark`, `requiredPermission -> required_permission`, `isActive -> is_active`, `isExternal -> is_external`

- map_role_menu_permissions
  - App model: `RoleMenuPermission`
  - App fields map to DB columns: `id -> map_rmp_id`, `roleId -> role_id`, `menuId -> menu_id`, `permissionId -> permission_id`
  - Columns follow DDL only: `createdAt`, `createdBy`; no soft-delete or update audit fields

Fleet management:

- vehicle_type (vehicle_type_id PK, vehicle_type_name, vehicle_type_desc, vehicle_type_remark)
- brand (brand_id PK, brand_name, brand_desc, brand_remark)
- cars
  - App model: `Car`
  - App fields map to DB columns: `id -> cars_id`, `vehicleTypeId -> vehicle_type_id`, `brandId -> brand_id`, `mileage -> cars_mileage`, `model -> cars_model`, `year -> cars_years`, `color -> cars_color`, `license -> cars_license`, `status -> cars_status`, `remark -> cars_remark`
  - Relations: `vehicleType`, `brand`, `images`, `bookings`
- driver (driver_id PK, driver_full_name, driver_phone, driver_card_images_id, driver_license_images_id)
- images (images_id PK, images_key, images_url, images_name, images_size, images_type, images_remark)
- map_cars_images (map_cars_images_id PK, cars_id FK, images_id FK, cars_images_type, cars_images_numb)

Pricing & Booking:

- products (products_id PK, products_name, products_desc, products_remark, products_price, date_start, date_end, date_count, is_active)
- booking
  - App model: `Booking`
  - App fields map to DB columns: `id -> booking_id`, `productId -> products_id`, `carId -> cars_id`, `userId -> user_id`, `driverId -> driver_id`, `paymentImageId -> booking_payment_images_id`, `healthCheck01ImageId -> booking_health_check_01_images_id`, `healthCheck02ImageId -> booking_health_check_02_images_id`, `dateStart -> date_start`, `dateEnd -> date_end`, `dateReturn -> date_return`, `dateCount -> date_count`, `price -> price`, `dailyRate -> daily_rate`, `discountAmount -> discount_amount`, `taxAmount -> tax_amount`, `netAmount -> total_amount`, `remark -> booking_remark`, `status -> booking_status`
  - Relations: `product`, `car`, `user`, `driver`, `paymentImage`, `healthCheck01Image`, `healthCheck02Image`, `payments`
- payments
  - App model: `Payment`
  - App fields map to DB columns: `id -> payments_id`, `bookingId -> booking_id`, `paymentDate -> payment_date`, `amount -> amount`, `paymentMethod -> payment_method`, `paymentStatus -> payment_status`

Maintenance:

- maintenances
  - App model: `Maintenance`
  - App fields map to DB columns: `id -> maintenances_id`, `carId -> cars_id`, `name -> maintenances_name`, `description -> maintenances_desc`, `remark -> maintenances_remark`, `type -> maintenances_type`, `status -> maintenances_status`, `mileage -> mileage`, `mileageTarget -> mileage_target`, `mileageAlert -> mileage_alert`, `dateAlert -> date_alert`, `dateStart -> date_start`, `dateEnd -> date_end`, `dateCount -> date_count`

Indexes & Conventions:

- Use snake_case in DB, UUID PKs, soft-delete via is_deleted
- Prisma uses camelCase fields with `@map` and `@@map` to match `sql-ddl.sql`
- `sql-ddl.sql` is the source of truth for table/column structure
- Important indexes in DDL: `idx_cars_status`, `idx_booking_status`, `idx_booking_dates`, `idx_payments_booking`, `idx_maintenances_alert`
- Enums: `car_status_enum`, `booking_status_enum`, `payment_method_enum`, `payment_status_enum`, `maintenance_type_enum`, `maintenance_status_enum`

Notes:

- Booking overlap rules: prevent overlapping bookings, ignore cancelled bookings, booking dates inclusive.
- Pricing rules: dynamic pricing via products table and promotional logic applied during booking calculation.
- Auth seed creates roles, permissions, an admin user, and admin role assignment. Password hashes use the local `scrypt:salt:hash` format.
