-- CreateEnum
CREATE TYPE "CarStatus" AS ENUM ('Available', 'Booked', 'Maintenance', 'Unavailable', 'Reserved');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled', 'Rejected');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('Cash', 'Credit Card', 'Prompt Pay', 'Bank Transfer');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('Pending', 'Paid', 'Failed', 'Refunded');

-- CreateEnum
CREATE TYPE "MaintenanceType" AS ENUM ('Maintenance', 'Tax', 'Insurance');

-- CreateEnum
CREATE TYPE "MaintenanceStatus" AS ENUM ('Pending', 'Active', 'Complete');

-- CreateTable
CREATE TABLE "cars" (
    "cars_id" UUID NOT NULL,
    "vehicle_type_id" UUID NOT NULL,
    "brand_id" UUID NOT NULL,
    "cars_mileage" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "cars_model" VARCHAR(100) NOT NULL,
    "cars_years" VARCHAR(4) NOT NULL,
    "cars_color" VARCHAR(50) NOT NULL,
    "cars_license" VARCHAR(20) NOT NULL,
    "cars_status" "CarStatus" NOT NULL DEFAULT 'Available',
    "cars_remark" VARCHAR(500),
    "created_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_date" TIMESTAMPTZ NOT NULL,
    "updated_by" UUID NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "cars_pkey" PRIMARY KEY ("cars_id")
);

-- CreateTable
CREATE TABLE "vehicle_type" (
    "vehicle_type_id" UUID NOT NULL,
    "vehicle_type_name" VARCHAR(100) NOT NULL,
    "vehicle_type_desc" VARCHAR(255),
    "vehicle_type_remark" VARCHAR(500),
    "created_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_date" TIMESTAMPTZ NOT NULL,
    "updated_by" UUID NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "vehicle_type_pkey" PRIMARY KEY ("vehicle_type_id")
);

-- CreateTable
CREATE TABLE "brand" (
    "brand_id" UUID NOT NULL,
    "brand_name" VARCHAR(100) NOT NULL,
    "brand_desc" VARCHAR(255),
    "brand_remark" VARCHAR(500),
    "created_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_date" TIMESTAMPTZ NOT NULL,
    "updated_by" UUID NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "brand_pkey" PRIMARY KEY ("brand_id")
);

-- CreateTable
CREATE TABLE "driver" (
    "driver_id" UUID NOT NULL,
    "driver_full_name" VARCHAR(150) NOT NULL,
    "driver_phone" VARCHAR(20) NOT NULL,
    "driver_card_images_id" UUID,
    "driver_license_images_id" UUID,
    "driver_remark" VARCHAR(500),
    "created_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_date" TIMESTAMPTZ NOT NULL,
    "updated_by" UUID NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "driver_pkey" PRIMARY KEY ("driver_id")
);

-- CreateTable
CREATE TABLE "images" (
    "images_id" UUID NOT NULL,
    "images_key" VARCHAR(255) NOT NULL,
    "images_url" VARCHAR(500) NOT NULL,
    "images_name" VARCHAR(255) NOT NULL,
    "images_size" BIGINT,
    "images_type" VARCHAR(50),
    "images_remark" VARCHAR(500),
    "created_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_date" TIMESTAMPTZ NOT NULL,
    "updated_by" UUID NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "images_pkey" PRIMARY KEY ("images_id")
);

-- CreateTable
CREATE TABLE "map_cars_images" (
    "map_cars_images_id" UUID NOT NULL,
    "cars_id" UUID NOT NULL,
    "images_id" UUID NOT NULL,
    "cars_images_type" VARCHAR(150),
    "cars_images_numb" INTEGER NOT NULL DEFAULT 0,
    "created_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_date" TIMESTAMPTZ NOT NULL,
    "updated_by" UUID NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "map_cars_images_pkey" PRIMARY KEY ("map_cars_images_id")
);

-- CreateTable
CREATE TABLE "products" (
    "products_id" UUID NOT NULL,
    "products_name" VARCHAR(255) NOT NULL,
    "products_desc" VARCHAR(255),
    "products_remark" VARCHAR(500),
    "products_price" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "date_start" TIMESTAMPTZ NOT NULL,
    "date_end" TIMESTAMPTZ NOT NULL,
    "date_count" INTEGER NOT NULL DEFAULT 0,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_date" TIMESTAMPTZ NOT NULL,
    "updated_by" UUID NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "products_pkey" PRIMARY KEY ("products_id")
);

-- CreateTable
CREATE TABLE "booking" (
    "booking_id" UUID NOT NULL,
    "products_id" UUID,
    "cars_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "driver_id" UUID,
    "booking_payment_images_id" UUID,
    "booking_health_check_01_images_id" UUID,
    "booking_health_check_02_images_id" UUID,
    "date_start" TIMESTAMPTZ NOT NULL,
    "date_end" TIMESTAMPTZ NOT NULL,
    "date_return" TIMESTAMPTZ,
    "date_count" INTEGER NOT NULL DEFAULT 0,
    "price" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "daily_rate" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discount_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "tax_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total_amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "booking_remark" VARCHAR(500),
    "booking_status" "BookingStatus" NOT NULL DEFAULT 'Pending',
    "created_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_date" TIMESTAMPTZ NOT NULL,
    "updated_by" UUID NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "booking_pkey" PRIMARY KEY ("booking_id")
);

-- CreateTable
CREATE TABLE "payments" (
    "payments_id" UUID NOT NULL,
    "booking_id" UUID NOT NULL,
    "payment_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "amount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "payment_method" "PaymentMethod" NOT NULL,
    "payment_status" "PaymentStatus" NOT NULL DEFAULT 'Pending',
    "created_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_date" TIMESTAMPTZ NOT NULL,
    "updated_by" UUID NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("payments_id")
);

-- CreateTable
CREATE TABLE "user" (
    "user_id" UUID NOT NULL,
    "user_name" VARCHAR(150) NOT NULL,
    "user_email" VARCHAR(150) NOT NULL,
    "user_password" VARCHAR(150) NOT NULL,
    "user_first_name" VARCHAR(150) NOT NULL,
    "user_last_name" VARCHAR(150) NOT NULL,
    "user_phone" VARCHAR(20) NOT NULL,
    "user_card_image_id" UUID,
    "user_report_download" INTEGER NOT NULL DEFAULT 0,
    "user_remark" VARCHAR(500),
    "created_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID,
    "updated_date" TIMESTAMPTZ NOT NULL,
    "updated_by" UUID,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "user_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "roles" (
    "role_id" UUID NOT NULL,
    "role_name" VARCHAR(100) NOT NULL,
    "role_code" VARCHAR(50) NOT NULL,
    "role_desc" VARCHAR(255),
    "role_remark" VARCHAR(500),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_date" TIMESTAMPTZ NOT NULL,
    "updated_by" UUID NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("role_id")
);

-- CreateTable
CREATE TABLE "map_user_roles" (
    "map_user_role_id" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "created_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "map_user_roles_pkey" PRIMARY KEY ("map_user_role_id")
);

-- CreateTable
CREATE TABLE "permission" (
    "permission_id" UUID NOT NULL,
    "permission_name" VARCHAR(100),
    "permission_code" VARCHAR(100) NOT NULL,
    "permission_desc" VARCHAR(255),
    "permission_remark" VARCHAR(500),
    "created_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_date" TIMESTAMPTZ NOT NULL,
    "updated_by" UUID NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "permission_pkey" PRIMARY KEY ("permission_id")
);

-- CreateTable
CREATE TABLE "menu" (
    "menu_id" UUID NOT NULL,
    "menu_key" VARCHAR(100) NOT NULL,
    "menu_title" VARCHAR(150) NOT NULL,
    "menu_icon" VARCHAR(100),
    "menu_path" VARCHAR(255),
    "menu_parent_id" UUID,
    "menu_sequence" INTEGER NOT NULL DEFAULT 0,
    "menu_remark" VARCHAR(500),
    "required_permission" VARCHAR(100),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "is_external" BOOLEAN NOT NULL DEFAULT false,
    "created_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_date" TIMESTAMPTZ NOT NULL,
    "updated_by" UUID NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "menu_pkey" PRIMARY KEY ("menu_id")
);

-- CreateTable
CREATE TABLE "map_role_menu_permissions" (
    "map_rmp_id" UUID NOT NULL,
    "role_id" UUID NOT NULL,
    "menu_id" UUID NOT NULL,
    "permission_id" UUID NOT NULL,
    "created_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "map_role_menu_permissions_pkey" PRIMARY KEY ("map_rmp_id")
);

-- CreateTable
CREATE TABLE "maintenances" (
    "maintenances_id" UUID NOT NULL,
    "cars_id" UUID NOT NULL,
    "maintenances_name" VARCHAR(255),
    "maintenances_desc" VARCHAR(255),
    "maintenances_remark" VARCHAR(500),
    "maintenances_type" "MaintenanceType",
    "maintenances_status" "MaintenanceStatus" NOT NULL DEFAULT 'Pending',
    "mileage" INTEGER NOT NULL DEFAULT 0,
    "mileage_target" INTEGER NOT NULL DEFAULT 0,
    "mileage_alert" INTEGER NOT NULL DEFAULT 0,
    "date_alert" TIMESTAMPTZ,
    "date_start" TIMESTAMPTZ NOT NULL,
    "date_end" TIMESTAMPTZ NOT NULL,
    "date_count" INTEGER NOT NULL DEFAULT 0,
    "created_date" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" UUID NOT NULL,
    "updated_date" TIMESTAMPTZ NOT NULL,
    "updated_by" UUID NOT NULL,
    "is_deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "maintenances_pkey" PRIMARY KEY ("maintenances_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cars_cars_license_key" ON "cars"("cars_license");

-- CreateIndex
CREATE INDEX "idx_cars_status" ON "cars"("cars_status");

-- CreateIndex
CREATE UNIQUE INDEX "brand_brand_name_key" ON "brand"("brand_name");

-- CreateIndex
CREATE UNIQUE INDEX "driver_driver_phone_key" ON "driver"("driver_phone");

-- CreateIndex
CREATE INDEX "idx_booking_status" ON "booking"("booking_status");

-- CreateIndex
CREATE INDEX "idx_booking_dates" ON "booking"("date_start", "date_end");

-- CreateIndex
CREATE INDEX "idx_payments_booking" ON "payments"("booking_id");

-- CreateIndex
CREATE UNIQUE INDEX "user_user_name_key" ON "user"("user_name");

-- CreateIndex
CREATE UNIQUE INDEX "user_user_email_key" ON "user"("user_email");

-- CreateIndex
CREATE UNIQUE INDEX "user_user_phone_key" ON "user"("user_phone");

-- CreateIndex
CREATE UNIQUE INDEX "roles_role_code_key" ON "roles"("role_code");

-- CreateIndex
CREATE UNIQUE INDEX "permission_permission_code_key" ON "permission"("permission_code");

-- CreateIndex
CREATE UNIQUE INDEX "menu_menu_key_key" ON "menu"("menu_key");

-- CreateIndex
CREATE INDEX "idx_maintenances_alert" ON "maintenances"("date_alert");

-- AddForeignKey
ALTER TABLE "cars" ADD CONSTRAINT "cars_vehicle_type_id_fkey" FOREIGN KEY ("vehicle_type_id") REFERENCES "vehicle_type"("vehicle_type_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cars" ADD CONSTRAINT "cars_brand_id_fkey" FOREIGN KEY ("brand_id") REFERENCES "brand"("brand_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driver" ADD CONSTRAINT "driver_driver_card_images_id_fkey" FOREIGN KEY ("driver_card_images_id") REFERENCES "images"("images_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "driver" ADD CONSTRAINT "driver_driver_license_images_id_fkey" FOREIGN KEY ("driver_license_images_id") REFERENCES "images"("images_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "map_cars_images" ADD CONSTRAINT "map_cars_images_cars_id_fkey" FOREIGN KEY ("cars_id") REFERENCES "cars"("cars_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "map_cars_images" ADD CONSTRAINT "map_cars_images_images_id_fkey" FOREIGN KEY ("images_id") REFERENCES "images"("images_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_products_id_fkey" FOREIGN KEY ("products_id") REFERENCES "products"("products_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_cars_id_fkey" FOREIGN KEY ("cars_id") REFERENCES "cars"("cars_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "driver"("driver_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_booking_payment_images_id_fkey" FOREIGN KEY ("booking_payment_images_id") REFERENCES "images"("images_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_booking_health_check_01_images_id_fkey" FOREIGN KEY ("booking_health_check_01_images_id") REFERENCES "images"("images_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "booking" ADD CONSTRAINT "booking_booking_health_check_02_images_id_fkey" FOREIGN KEY ("booking_health_check_02_images_id") REFERENCES "images"("images_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "booking"("booking_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user" ADD CONSTRAINT "user_user_card_image_id_fkey" FOREIGN KEY ("user_card_image_id") REFERENCES "images"("images_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "map_user_roles" ADD CONSTRAINT "map_user_roles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("user_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "map_user_roles" ADD CONSTRAINT "map_user_roles_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "menu" ADD CONSTRAINT "menu_menu_parent_id_fkey" FOREIGN KEY ("menu_parent_id") REFERENCES "menu"("menu_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "map_role_menu_permissions" ADD CONSTRAINT "map_role_menu_permissions_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "roles"("role_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "map_role_menu_permissions" ADD CONSTRAINT "map_role_menu_permissions_menu_id_fkey" FOREIGN KEY ("menu_id") REFERENCES "menu"("menu_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "map_role_menu_permissions" ADD CONSTRAINT "map_role_menu_permissions_permission_id_fkey" FOREIGN KEY ("permission_id") REFERENCES "permission"("permission_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "maintenances" ADD CONSTRAINT "maintenances_cars_id_fkey" FOREIGN KEY ("cars_id") REFERENCES "cars"("cars_id") ON DELETE RESTRICT ON UPDATE CASCADE;
