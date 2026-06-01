-- ==========================================
-- 0. EXTENSIONS & ENUM TYPES
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE car_status_enum AS ENUM ('Available', 'Booked', 'Maintenance', 'Unavailable', 'Reserved');
CREATE TYPE booking_status_enum AS ENUM ('Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'Rejected');
CREATE TYPE payment_method_enum AS ENUM ('Cash', 'Credit Card', 'Prompt Pay', 'Bank Transfer');
CREATE TYPE payment_status_enum AS ENUM ('Pending', 'Paid', 'Failed', 'Refunded');
CREATE TYPE maintenance_type_enum AS ENUM ('Maintenance', 'Tax', 'Insurance');
CREATE TYPE maintenance_status_enum AS ENUM ('Pending', 'Active', 'Complete');

-- ==========================================
-- 1. BASE TABLES (ไม่มี Dependencies)
-- ==========================================

-- ตารางเก็บรูปภาพกลาง
CREATE TABLE images (
    images_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    images_key VARCHAR(255) NOT NULL,
    images_url VARCHAR(500) NOT NULL,
    images_name VARCHAR(255) NOT NULL,
    images_size BIGINT NOT NULL,
    images_type VARCHAR(50) NOT NULL, -- เช่น image/jpeg, image/png
    images_remark VARCHAR(500),
    created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- ตารางประเภทรถ
CREATE TABLE vehicle_type (
    vehicle_type_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_type_name VARCHAR(100) NOT NULL, -- เช่น รถเก๋ง, SUV, Van
    vehicle_type_desc VARCHAR(255),
    vehicle_type_remark VARCHAR(500),
    created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- ตารางแบรนด์รถ
CREATE TABLE brand (
    brand_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_name VARCHAR(100) NOT NULL UNIQUE, -- เช่น Toyota, Honda
    brand_desc VARCHAR(255),
    brand_remark VARCHAR(500),
    created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- ตารางสิทธิ์การใช้งาน (Permissions)
CREATE TABLE permission (
    permission_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    permission_name VARCHAR(100) NOT NULL, -- เช่น View, Approve
    permission_code VARCHAR(100) NOT NULL UNIQUE, -- เช่น cars.view, booking.approve
    permission_remark VARCHAR(500),
    created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- ตารางบทบาทผู้ใช้งาน (Roles)
CREATE TABLE roles (
    role_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_name VARCHAR(100) NOT NULL, -- เช่น Admin, Manager, Staff, Customer
    role_code VARCHAR(50) NOT NULL UNIQUE, -- เช่น ADMIN, MANAGER
    role_remark VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- ==========================================
-- 2. TABLES WITH FIRST-LEVEL DEPENDENCIES
-- ==========================================

-- ตารางข้อมูลผู้ใช้งาน
CREATE TABLE "user" (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name VARCHAR(150) NOT NULL UNIQUE,
    user_email VARCHAR(150) NOT NULL UNIQUE,
    user_password VARCHAR(150) NOT NULL,
    user_first_name VARCHAR(150) NOT NULL,
    user_last_name VARCHAR(150) NOT NULL,
    user_phone VARCHAR(20) NOT NULL UNIQUE,
    user_card_image_id UUID REFERENCES images(images_id),
    user_report_download INT NOT NULL DEFAULT 0,
    user_remark VARCHAR(500),
    created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- ตารางข้อมูลคนขับรถ
CREATE TABLE driver (
    driver_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_full_name VARCHAR(150) NOT NULL,
    driver_phone VARCHAR(20) NOT NULL UNIQUE,
    driver_card_images_id UUID REFERENCES images(images_id),
    driver_license_images_id UUID REFERENCES images(images_id),
    driver_remark VARCHAR(500),
    created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- ตารางข้อมูลรถ
CREATE TABLE cars (
    cars_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_type_id UUID NOT NULL REFERENCES vehicle_type(vehicle_type_id),
    brand_id UUID NOT NULL REFERENCES brand(brand_id),
    cars_mileage DECIMAL(12,2) NOT NULL DEFAULT 0,
    cars_model VARCHAR(100) NOT NULL, -- เช่น Camry, CR-V
    cars_years VARCHAR(4) NOT NULL, -- เช่น 2023
    cars_color VARCHAR(50) NOT NULL,
    cars_license VARCHAR(20) NOT NULL UNIQUE,
    cars_status car_status_enum NOT NULL DEFAULT 'Available',
    cars_remark VARCHAR(500),
    created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- ตารางเมนูระบบ
CREATE TABLE menu (
    menu_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_key VARCHAR(100) NOT NULL UNIQUE,
    menu_name VARCHAR(150) NOT NULL,
    menu_icon VARCHAR(100),
    menu_path VARCHAR(255),
    menu_parent_id UUID REFERENCES menu(menu_id) ON DELETE CASCADE,
    menu_sequence INT NOT NULL,
    menu_remark VARCHAR(500),
    required_permission VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- ตารางแพ็กเกจ/โปรโมชันราคา
CREATE TABLE products (
    products_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    products_name VARCHAR(255) NOT NULL,
    products_desc VARCHAR(255),
    products_remark VARCHAR(500),
    products_price DECIMAL(12,2) NOT NULL DEFAULT 0,
    date_start TIMESTAMP WITH TIME ZONE NOT NULL,
    date_end TIMESTAMP WITH TIME ZONE NOT NULL,
    date_count INT NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- ==========================================
-- 3. MAPPING & TRANSACTION TABLES (มี Multi-Dependencies)
-- ==========================================

-- ตารางจับคู่รูปภาพรถ
CREATE TABLE map_cars_images (
    map_cars_images_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cars_id UUID NOT NULL REFERENCES cars(cars_id) ON DELETE CASCADE,
    images_id UUID NOT NULL REFERENCES images(images_id) ON DELETE CASCADE,
    cars_images_type VARCHAR(150) NOT NULL, -- FRONT, SIDE, INTERIOR, BACK
    cars_images_numb INT NOT NULL DEFAULT 0,
    created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL
);

-- ตารางจับคู่ผู้ใช้งานกับสิทธิ์/บทบาท
CREATE TABLE map_user_roles (
    map_user_role_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(role_id) ON DELETE CASCADE,
    created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- ตารางกำหนดสิทธิ์ให้แต่ละบทบาท
CREATE TABLE map_role_menu_permissions (
    map_rmp_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID NOT NULL REFERENCES roles(role_id) ON DELETE CASCADE,
    menu_id UUID NOT NULL REFERENCES menu(menu_id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permission(permission_id) ON DELETE CASCADE,
    created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL
);

-- ตารางการซ่อมบำรุงรถยนต์
CREATE TABLE maintenances (
    maintenances_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cars_id UUID NOT NULL REFERENCES cars(cars_id) ON DELETE CASCADE,
    maintenances_name VARCHAR(255) NOT NULL,
    maintenances_desc VARCHAR(255),
    maintenances_remark VARCHAR(500),
    maintenances_type maintenance_type_enum NOT NULL DEFAULT 'Maintenance',
    maintenances_status maintenance_status_enum NOT NULL DEFAULT 'Pending',
    mileage INT NOT NULL DEFAULT 0,
    mileage_target INT NOT NULL DEFAULT 0,
    mileage_alert INT NOT NULL DEFAULT 0,
    date_alert TIMESTAMP WITH TIME ZONE,
    date_start TIMESTAMP WITH TIME ZONE NOT NULL,
    date_end TIMESTAMP WITH TIME ZONE NOT NULL,
    date_count INT NOT NULL DEFAULT 0,
    created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- ตารางการจองรถ (Booking)
CREATE TABLE booking (
    booking_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    products_id UUID NOT NULL REFERENCES products(products_id),
    cars_id UUID NOT NULL REFERENCES cars(cars_id),
    user_id UUID NOT NULL REFERENCES "user"(user_id),
    driver_id UUID REFERENCES driver(driver_id),
    booking_payment_images_id UUID REFERENCES images(images_id),
    booking_health_check_01_images_id UUID REFERENCES images(images_id),
    booking_health_check_02_images_id UUID REFERENCES images(images_id),
    date_start TIMESTAMP WITH TIME ZONE NOT NULL,
    date_end TIMESTAMP WITH TIME ZONE NOT NULL,
    date_count INT NOT NULL DEFAULT 0,
    price DECIMAL(12,2) NOT NULL DEFAULT 0,
    daily_rate DECIMAL(12,2) NOT NULL DEFAULT 0,
    discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    net_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    booking_status booking_status_enum NOT NULL DEFAULT 'Pending',
    booking_remark VARCHAR(500),
    created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- ตารางการชำระเงิน (Payments)
CREATE TABLE payments (
    payments_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES booking(booking_id),
    payment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    payment_method payment_method_enum NOT NULL,
    payment_status payment_status_enum NOT NULL DEFAULT 'Pending',
    created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- ==========================================
-- 4. DATABASE INDEXES (เพื่อประสิทธิภาพการสืบค้น)
-- ==========================================
CREATE INDEX idx_cars_deleted ON cars(is_deleted);
CREATE INDEX idx_user_deleted ON "user"(is_deleted);
CREATE INDEX idx_booking_status ON booking(booking_status);
CREATE INDEX idx_booking_deleted ON booking(is_deleted);
CREATE INDEX idx_payments_booking ON payments(booking_id);
