
-- =====================================================
-- CAR SIAM AUTO
-- FULL DDL BASED ON project timeline Database.pdf
-- PostgreSQL
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE cars_status_enum AS ENUM ('Available','Booked','Maintenance','Unavailable','Reserved');
CREATE TYPE booking_status_enum AS ENUM ('Pending','Confirmed','In Progress','Completed','Cancelled','Rejected');
CREATE TYPE payment_method_enum AS ENUM ('Cash','Credit Card','Prompt Pay','Bank Transfer');
CREATE TYPE payment_status_enum AS ENUM ('Pending','Paid','Failed','Refunded');
CREATE TYPE maintenances_type_enum AS ENUM ('Maintenance','Tax','Insurance');
CREATE TYPE maintenances_status_enum AS ENUM ('Pending','Active','Complete');

CREATE TABLE images (
	images_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	images_key VARCHAR(255) NOT NULL,
	images_url VARCHAR(500) NOT NULL,
	images_name VARCHAR(255) NOT NULL,
	images_size BIGINT,
	images_type VARCHAR(50),
	images_remark VARCHAR(500),
	created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_by UUID NOT NULL,
	updated_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_by UUID NOT NULL,
	is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE vehicle_type (
	vehicle_type_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	vehicle_type_name VARCHAR(100) NOT NULL,
	vehicle_type_desc VARCHAR(255),
	vehicle_type_remark VARCHAR(500),
	created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_by UUID NOT NULL,
	updated_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_by UUID NOT NULL,
	is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE brand (
	brand_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	brand_name VARCHAR(100) NOT NULL UNIQUE,
	brand_desc VARCHAR(255),
	brand_remark VARCHAR(500),
	created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_by UUID NOT NULL,
	updated_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_by UUID NOT NULL,
	is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE "user" (
	user_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	user_name VARCHAR(150) NOT NULL UNIQUE,
	user_email VARCHAR(150) NOT NULL UNIQUE,
	user_password VARCHAR(150) NOT NULL,
	user_first_name VARCHAR(150) NOT NULL,
	user_last_name VARCHAR(150) NOT NULL,
	user_phone VARCHAR(20) NOT NULL UNIQUE,
	user_card_image_id UUID REFERENCES images(images_id),
	user_report_download INT DEFAULT 0,
	user_remark VARCHAR(500),
	created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_by UUID,
	updated_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_by UUID,
	is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE driver (
	driver_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	driver_full_name VARCHAR(150) NOT NULL,
	driver_phone VARCHAR(20) NOT NULL UNIQUE,
	driver_card_images_id UUID REFERENCES images(images_id),
	driver_license_images_id UUID REFERENCES images(images_id),
	driver_remark VARCHAR(500),
	created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_by UUID NOT NULL,
	updated_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_by UUID NOT NULL,
	is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE cars (
	cars_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	vehicle_type_id UUID NOT NULL REFERENCES vehicle_type(vehicle_type_id),
	brand_id UUID NOT NULL REFERENCES brand(brand_id),
	cars_mileage DECIMAL(12,2) DEFAULT 0,
	cars_model VARCHAR(100) NOT NULL,
	cars_years VARCHAR(4) NOT NULL,
	cars_color VARCHAR(50) NOT NULL,
	cars_license VARCHAR(20) NOT NULL UNIQUE,
	cars_status cars_status_enum NOT NULL DEFAULT 'Available',
	cars_remark VARCHAR(500),
	created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_by UUID NOT NULL,
	updated_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_by UUID NOT NULL,
	is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE map_cars_images (
	map_cars_images_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	cars_id UUID NOT NULL REFERENCES cars(cars_id) ON DELETE CASCADE,
	images_id UUID NOT NULL REFERENCES images(images_id) ON DELETE CASCADE,
	cars_images_type VARCHAR(150),
	cars_images_numb INT DEFAULT 0,
	created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_by UUID NOT NULL,
	updated_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_by UUID NOT NULL,
	is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE products (
	products_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	products_name VARCHAR(255),
	products_desc VARCHAR(255),
	products_remark VARCHAR(500),
	products_price DECIMAL(12,2) DEFAULT 0,
	date_start TIMESTAMPTZ,
	date_end TIMESTAMPTZ,
	date_count INT DEFAULT 0,
	is_active BOOLEAN DEFAULT TRUE,
	created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_by UUID NOT NULL,
	updated_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_by UUID NOT NULL,
	is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE booking (
	booking_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	products_id UUID REFERENCES products(products_id),
	cars_id UUID NOT NULL REFERENCES cars(cars_id),
	user_id UUID NOT NULL REFERENCES "user"(user_id),
	driver_id UUID REFERENCES driver(driver_id),
	booking_payment_images_id UUID REFERENCES images(images_id),
	booking_health_check_01_images_id UUID REFERENCES images(images_id),
	booking_health_check_02_images_id UUID REFERENCES images(images_id),
	date_start TIMESTAMPTZ NOT NULL,
	date_end TIMESTAMPTZ NOT NULL,
	date_count INT NOT NULL DEFAULT 0,
	price DECIMAL(12,2) NOT NULL DEFAULT 0,
	daily_rate DECIMAL(12,2) NOT NULL DEFAULT 0,
	discount_amount DECIMAL(12,2) DEFAULT 0,
	tax_amount DECIMAL(12,2) DEFAULT 0,
	total_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
	booking_status booking_status_enum NOT NULL DEFAULT 'Pending',
	booking_remark VARCHAR(500),
	created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_by UUID NOT NULL,
	updated_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_by UUID NOT NULL,
 is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE payments (
	payments_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	booking_id UUID NOT NULL REFERENCES booking(booking_id),
	payment_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	amount DECIMAL(12,2) NOT NULL DEFAULT 0,
	payment_method payment_method_enum NOT NULL,
	payment_status payment_status_enum NOT NULL DEFAULT 'Pending',
	created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_by UUID NOT NULL,
	updated_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_by UUID NOT NULL,
	is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE roles (
	role_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	role_name VARCHAR(100) NOT NULL,
	role_code VARCHAR(50) NOT NULL UNIQUE,
	role_desc VARCHAR(255),
	role_remark VARCHAR(500),
	is_active BOOLEAN DEFAULT TRUE,
	created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_by UUID NOT NULL,
	updated_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_by UUID NOT NULL,
	is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE permission (
	permission_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	permission_name VARCHAR(100),
	permission_code VARCHAR(100) UNIQUE NOT NULL,
	permission_desc VARCHAR(255),
	permission_remark VARCHAR(500),
	created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_by UUID NOT NULL,
	updated_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_by UUID NOT NULL,
	is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE menu (
	menu_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	menu_key VARCHAR(100) UNIQUE NOT NULL,
	menu_title VARCHAR(150) NOT NULL,
	menu_icon VARCHAR(100),
	menu_path VARCHAR(255),
	menu_parent_id UUID REFERENCES menu(menu_id),
	menu_sequence INT NOT NULL DEFAULT 0,
	menu_remark VARCHAR(500),
	required_permission VARCHAR(100),
	is_active BOOLEAN DEFAULT TRUE,
	is_external BOOLEAN DEFAULT FALSE,
	created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_by UUID NOT NULL,
	updated_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_by UUID NOT NULL,
	is_deleted BOOLEAN DEFAULT FALSE
);

CREATE TABLE map_user_roles (
	map_user_role_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	user_id UUID NOT NULL REFERENCES "user"(user_id) ON DELETE CASCADE,
	role_id UUID NOT NULL REFERENCES roles(role_id) ON DELETE CASCADE,
	created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_by UUID NOT NULL,
	is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE map_role_menu_permissions (
	map_rmp_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	role_id UUID NOT NULL REFERENCES roles(role_id) ON DELETE CASCADE,
	menu_id UUID NOT NULL REFERENCES menu(menu_id) ON DELETE CASCADE,
	permission_id UUID NOT NULL REFERENCES permission(permission_id) ON DELETE CASCADE,
	created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_by UUID NOT NULL,
	is_deleted BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE maintenances (
	maintenances_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	cars_id UUID NOT NULL REFERENCES cars(cars_id),
	maintenances_name VARCHAR(255),
	maintenances_desc VARCHAR(255),
	maintenances_remark VARCHAR(500),
	maintenances_type maintenances_type_enum,
	maintenances_status maintenances_status_enum DEFAULT 'Pending',
	mileage INT DEFAULT 0,
	mileage_target INT DEFAULT 0,
	mileage_alert INT DEFAULT 0,
	date_alert TIMESTAMPTZ,
	date_start TIMESTAMPTZ NOT NULL,
	date_end TIMESTAMPTZ NOT NULL,
	date_count INT DEFAULT 0,
	created_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	created_by UUID NOT NULL,
	updated_date TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
	updated_by UUID NOT NULL,
	is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_cars_status ON cars(cars_status);
CREATE INDEX idx_booking_status ON booking(booking_status);
CREATE INDEX idx_booking_dates ON booking(date_start,date_end);
CREATE INDEX idx_payments_booking ON payments(booking_id);
CREATE INDEX idx_maintenances_alert ON maintenances(date_alert);
