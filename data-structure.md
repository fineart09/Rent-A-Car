# Data Structure (Database Schema Summary)

Overview: concise reference of core tables, primary keys, important columns, and enums used in the system.

Core tables:

- users
  - user_id (UUID PK)
  - user_full_name, user_phone, user_card_image_id (FK -> images)
  - user_report_download, created_date, created_by, updated_date, is_deleted

- roles
  - role_id (UUID PK), role_name, role_code, is_active, created_date, is_deleted

- permissions
  - permission_id (UUID PK), permission_name, permission_code, permission_desc

- map_user_roles
  - map_user_role_id (UUID PK), user_id (FK), role_id (FK)

- menus
  - menu_id (UUID PK), menu_key, menu_title, menu_path, required_permission

- map_role_menu_permissions
  - map_rmp_id (UUID PK), role_id (FK), menu_id (FK), permission_id (FK)

Fleet management:
- vehicle_types (vehicle_type_id PK, name, desc)
- brands (brands_id PK, brands_name)
- cars
  - cars_id (UUID PK), vehicle_type_id (FK), brands_id (FK), cars_model, cars_years,
    cars_color, cars_license (unique), cars_status (enum), cars_mileage, is_deleted
- drivers (driver_id PK, driver_full_name, driver_phone, driver_card_images_id, driver_license_images_id)
- images (images_id PK, images_key, images_url, images_name, images_size, images_type)
- map_cars_images (map_cars_images_id PK, cars_id FK, images_id FK, cars_images_type, cars_images_numb)

Pricing & Booking:
- products (products_id PK, products_name, products_price, date_start, date_end, is_active)
- bookings
  - booking_id (UUID PK), products_id (FK), cars_id (FK), user_id (FK), driver_id (FK), booking_payment_images_id (FK -> images),
    booking_health_check_01_images_id (FK -> images), booking_health_check_02_images_id (FK -> images)
    date_start, date_end, date_count, daily_rate, daily_rate_discount, discount_amount, tax_amount, total_amount, booking_status (enum)
- payments
  - payments_id (UUID PK), booking_id (FK), payment_date, amount, daily_rate, promotions, payment_method (enum), payment_status (enum)

Maintenance:
- maintenances
  - maintenances_id (UUID PK), cars_id (FK), maintenances_name, maintenances_type, maintenances_status, mileage, mileage_target, mileage_alert, date_alert, date_start, date_end

Indexes & Conventions:
- Use snake_case in DB, UUID PKs, soft-delete via is_deleted
- Important indexes: cars.status, bookings(start_date,end_date), payments(booking_id)
- Enums: car_status_enum, booking_status_enum, payment_method_enum, payment_status_enum, car_image_type_enum, maintenances_type/status

Notes:
- Booking overlap rules: prevent overlapping bookings, ignore cancelled bookings, booking dates inclusive.
- Pricing rules: dynamic pricing via products table and promotional logic applied during booking calculation.
