-- เปิดใช้งาน Extension สำหรับรองรับระบบสุ่มรหัสไอดีประเภท UUID (v4)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ========================================================
-- 1. กลุ่มตารางพื้นฐานที่ไม่มีเงื่อนไขความสัมพันธ์คีย์นอก (Master Data)
-- ========================================================

-- 1.1 ตารางระบบจัดเก็บไฟล์รูปภาพและเอกสารหลักฐานต่างๆ
CREATE TABLE images (
    images_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    images_key VARCHAR(255) NOT NULL,
    images_url VARCHAR(500) NOT NULL,
    images_name VARCHAR(255) NOT NULL,
    images_size BIGINT NOT NULL,
    images_remark VARCHAR(500), -- ระบุประเภทไฟล์จำพวก image/jpeg, image/png
    created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 1.2 ตารางระบุหมวดหมู่ประเภทรถยนต์ (เช่น รถเก๋ง, SUV, Van)
CREATE TABLE vehicle_type (
    vehicle_type_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_type_name VARCHAR(100) NOT NULL,
    vehicle_type_desc VARCHAR(255),
    vehicle_type_remark VARCHAR(500),
    created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 1.3 ตารางแบรนด์/ยี่ห้อรถยนต์ (เช่น Toyota, Honda)
CREATE TABLE brand (
    brand_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_name VARCHAR(100) NOT NULL UNIQUE,
    brand_desc VARCHAR(255),
    brand_remark VARCHAR(500),
    created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 1.4 ตารางบทบาทผู้ใช้งานในระบบ (เช่น Admin, Manager, Staff, Customer)
CREATE TABLE roles (
    role_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_name VARCHAR(100) NOT NULL,
    role_code VARCHAR(50) NOT NULL UNIQUE, -- รหัส เช่น ADMIN, MANAGER
    role_desc VARCHAR(255),
    role_remark VARCHAR(500),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 1.5 ตารางสิทธิ์สำหรับการเข้าถึงฟังก์ชันต่างๆ (เช่น View, Approve)
CREATE TABLE permission (
    permission_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    permission_name VARCHAR(100) NOT NULL,
    permission_code VARCHAR(50) NOT NULL UNIQUE, -- รหัสเช่น cars.view, booking.approve
    permission_desc VARCHAR(255),
    permission_remark VARCHAR(500),
    created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 1.6 ตารางเรทราคาหรือโปรโมชันตามแพ็กเกจช่วงเวลา
CREATE TABLE products (
    products_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    products_name VARCHAR(255) NOT NULL,
    products_desc VARCHAR(255),
    products_remark VARCHAR(500),
    products_price DECIMAL(12,2) NOT NULL, -- ราคาขายต่อวันของแพ็กเกจ
    date_start TIMESTAMP WITH TIME ZONE NOT NULL,
    date_end TIMESTAMP WITH TIME ZONE NOT NULL,
    date_count INT NOT NULL DEFAULT 0, -- จำนวนวันของแพ็กเกจช่วงเวลา
    is_active BOOLEAN NOT NULL DEFAULT TRUE, -- Active, Inactive
    created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);


-- ========================================================
-- 2. กลุ่มตารางข้อมูลหลักที่ผูกความสัมพันธ์กับตารางอื่น (Transactional & Profiles)
-- ========================================================

-- 2.1 ตารางจัดการเมนูต่างๆ ในระบบ (รองรับระบบเมนูย่อย Self-Reference)
CREATE TABLE menu (
    menu_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    menu_key VARCHAR(100) NOT NULL UNIQUE,
    menu_title VARCHAR(150) NOT NULL,
    menu_desc VARCHAR(255),
    menu_path VARCHAR(255),
    menu_parent_id UUID REFERENCES menu(menu_id), -- ผูกกับเมนูหลักในตารางตัวเอง
    menu_sequence INT NOT NULL DEFAULT 0,
    menu_remark VARCHAR(500),
    required_permission VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    is_external BOOLEAN NOT NULL DEFAULT FALSE,
    created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 2.2 ตารางข้อมูลของลูกค้าและผู้ใช้ระบบ 
-- (ใช้ชื่อ "user" ครอบด้วยอัญประกาศคู่เพื่อเลี่ยงคำสงวนในระบบของ PostgreSQL)
CREATE TABLE "user" (
    user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_full_name VARCHAR(150) NOT NULL,
    user_phone VARCHAR(20) NOT NULL UNIQUE,
    user_card_image_id UUID REFERENCES images(images_id), -- เอกสารบัตรประชาชน
    user_report_download INT NOT NULL DEFAULT 0,
    user_remark VARCHAR(500),
    created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 2.3 ตารางข้อมูลของพนักงานคนขับรถยนต์
CREATE TABLE driver (
    driver_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    driver_full_name VARCHAR(150) NOT NULL,
    driver_phone VARCHAR(20) NOT NULL UNIQUE,
    driver_card_images_id UUID REFERENCES images(images_id),   -- รูปภาพบัตรประชาชนคนขับ
    driver_license_images_id UUID REFERENCES images(images_id),-- รูปภาพใบขับขี่
    driver_remark VARCHAR(500),
    created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 2.4 ตารางทะเบียนและรายละเอียดรถยนต์ที่เปิดให้เช่า
CREATE TABLE cars (
    cars_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vehicle_type_id UUID NOT NULL REFERENCES vehicle_type(vehicle_type_id),
    brand_id UUID NOT NULL REFERENCES brand(brand_id),
    cars_mileage DECIMAL(12,2) NOT NULL DEFAULT 0,
    cars_model VARCHAR(100) NOT NULL,
    cars_years VARCHAR(4) NOT NULL,
    cars_color VARCHAR(50) NOT NULL,
    cars_license VARCHAR(20) NOT NULL UNIQUE,
    cars_status VARCHAR(50) NOT NULL DEFAULT 'Available', -- Available, Booked, Maintenance, Unavailable, Reserved
    cars_remark VARCHAR(500),
    created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 2.5 ตารางข้อมูลใบสั่งจองรถเช่าของลูกค้า
CREATE TABLE booking (
    booking_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    products_id UUID NOT NULL REFERENCES products(products_id),
    cars_id UUID NOT NULL REFERENCES cars(cars_id),
    user_id UUID NOT NULL REFERENCES "user"(user_id),
    driver_id UUID REFERENCES driver(driver_id), -- กรณีเลือกแพ็กเกจพร้อมคนขับ
    booking_payment_images_id UUID REFERENCES images(images_id),         -- สลิปหลักฐานโอนเงิน
    booking_health_check_01_images_id UUID REFERENCES images(images_id), -- ตรวจรับรถคืน (ด้านหน้า)
    booking_health_check_02_images_id UUID REFERENCES images(images_id), -- ตรวจรับรถคืน (ด้านหลัง)
    date_start TIMESTAMP WITH TIME ZONE NOT NULL, -- วันเวลารับรถ
    date_end TIMESTAMP WITH TIME ZONE NOT NULL,   -- วันเวลาส่งคืนรถ
    date_count INT NOT NULL DEFAULT 0,            -- สรุปจำนวนวันเช่า
    price DECIMAL(12,2) NOT NULL DEFAULT 0,       -- ราคาเช่าตั้งต้นต่อวัน
    daily_rate DECIMAL(12,2) NOT NULL DEFAULT 0,  -- ผลรวมก่อนหักส่วนลด (price * date_count)
    discount_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    tax_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    net_amount DECIMAL(12,2) NOT NULL DEFAULT 0,   -- ยอดจ่ายจริงสุทธิ
    booking_status VARCHAR(50) NOT NULL DEFAULT 'Pending', -- Pending, Confirmed, In Progress, Completed, Cancelled, Rejected
    booking_remark VARCHAR(500),
    created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 2.6 ตารางบันทึกการทำธุรกรรมชำระเงินของใบจอง
CREATE TABLE payments (
    payments_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES booking(booking_id),
    payment_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(12,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- Cash, Credit Card, Prompt Pay, Bank Transfer
    payment_status VARCHAR(50) NOT NULL DEFAULT 'Pending', -- Pending, Paid, Failed, Refunded
    created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 2.7 ตารางเก็บบันทึกประวัติการส่งเข้าศูนย์ซ่อมบำรุงและต่อภาษี/ประกัน
CREATE TABLE maintenances (
    maintenances_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cars_id UUID NOT NULL REFERENCES cars(cars_id),
    maintenances_name VARCHAR(255) NOT NULL,
    maintenances_desc VARCHAR(255),
    maintenances_remark VARCHAR(500),
    maintenances_type VARCHAR(100), -- Maintenance, Tax, Insurance
    maintenances_staus VARCHAR(50) NOT NULL DEFAULT 'Pending', -- Pending, Active, Complete
    mileage INT NOT NULL DEFAULT 0,        -- ไมล์ตอนเข้าซ่อม
    mileage_target INT NOT NULL DEFAULT 0, -- ไมล์เป้าหมายเช็กครั้งถัดไป
    mileage_alert INT NOT NULL DEFAULT 0,  -- ระดับไมล์เริ่มแจ้งเตือน
    date_alert TIMESTAMP WITH TIME ZONE,
    date_start TIMESTAMP WITH TIME ZONE NOT NULL,
    date_end TIMESTAMP WITH TIME ZONE NOT NULL,
    date_count INT NOT NULL DEFAULT 0,
    created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID NOT NULL
);


-- ========================================================
-- 3. กลุ่มตาราง Mapping ความสัมพันธ์แบบ Many-to-Many
-- ========================================================

-- 3.1 ตารางเชื่อมข้อมูล อัลบั้มรูปมุมมองต่างๆ ของรถยนต์ (มี Cascade เคลียร์ข้อมูลหากลบต้นทาง)
CREATE TABLE map_cars_images (
    map_cars_images_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    cars_id UUID NOT NULL REFERENCES cars(cars_id) ON DELETE CASCADE,
    images_id UUID NOT NULL REFERENCES images(images_id) ON DELETE CASCADE,
    cars_images_type VARCHAR(150), -- ระบุประเภทมุมรูปภาพ: FRONT, SIDE, INTERIOR, BACK
    cars_images_numb INT NOT NULL DEFAULT 0, -- ลำดับรูปในการแสดงผลบนหน้าจอ
    created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL
);

-- 3.2 ตารางเชื่อมสิทธิ์กลุ่มบทบาทของผู้ใช้งานระบบ
CREATE TABLE map_user_roles (
    map_user_role_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(role_id) ON DELETE CASCADE,
    created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

-- 3.3 ตารางจัดการควบคุมสิทธิ์การเปิดแท็บเมนูตามกลุ่มบทบาท (Role - Menu - Permission Mapping)
CREATE TABLE map_role_menu_permissions (
    map_rmp_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    role_id UUID NOT NULL REFERENCES roles(role_id) ON DELETE CASCADE,
    menu_id UUID NOT NULL REFERENCES menu(menu_id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permission(permission_id) ON DELETE CASCADE,
    created_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    created_by UUID NOT NULL,
    updated_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_by UUID NOT NULL,
    is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);


-- ========================================================
-- 4. การทำ Database Indexes เพื่อช่วยให้ระบบสืบค้นข้อมูลเสร็จเร็วขึ้นมากๆ
-- ========================================================
CREATE INDEX idx_cars_is_deleted ON cars(is_deleted);
CREATE INDEX idx_user_is_deleted ON "user"(is_deleted);
CREATE INDEX idx_booking_is_deleted ON booking(is_deleted);
CREATE INDEX idx_payments_is_deleted ON payments(is_deleted);
CREATE INDEX idx_images_is_deleted ON images(is_deleted);
CREATE INDEX idx_products_is_deleted ON products(is_deleted);

CREATE INDEX idx_map_cars_images_cars ON map_cars_images(cars_id);
CREATE INDEX idx_booking_foreign_keys ON booking(products_id, cars_id, user_id);
CREATE INDEX idx_payments_booking_id ON payments(booking_id);
CREATE INDEX idx_maintenances_cars_id ON maintenances(cars_id);
