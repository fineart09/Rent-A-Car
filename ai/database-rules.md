# Database Architecture & Security Rules (Car Rental & RBAC System)
# Database Schema and Rules Specification

This document defines the database schema, data types, constraints, and business logic for the application. AI agents should use this as the single source of truth for generating queries, code, or understanding the database relationships.

---

## Table of Contents
1. [cars](#1-cars)
2. [vehicle_type](#2-vehicle_type)
3. [brand](#3-brand)
4. [driver](#4-driver)
5. [images](#5-images)
6. [map_cars_images](#6-map_cars_images)
7. [products](#7-products)
8. [booking](#8-booking)
9. [payments](#9-payments)
10. [user](#10-user)
11. [roles](#11-roles)
12. [map_user_roles](#12-map_user_roles)
13. [permission](#13-permission)
14. [menu](#14-menu)
15. [map_role_menu_permissions](#15-map_role_menu_permissions)
16. [maintenances](#16-maintenances)

---

## 1. cars
Stores physical vehicle details within the fleet.


| Column Name | Type | Size | Default | Descriptions | Constraints | Index |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `cars_id` | UUID | | | Primary Key - รหัส unique ของรถ | PRIMARY KEY | Yes |
| `vehicle_type_id` | UUID | | | FK: ประเภทของรถ | FK -> vehicle_type(vehicle_type_id) | Yes |
| `brand_id` | UUID | | | FK: ยี่ห้อรถ | FK -> brands(brand_id) | Yes |
| `cars_mileage` | Decimal(12,2) | | `0` | เลขไมล์ปัจจุบัน | NOT NULL | |
| `cars_model` | String | 100 | | รุ่นของรถ เช่น Camry, CR-V | NOT NULL | |
| `cars_years` | String | 4 | | ปีที่ผลิต เช่น 2023 | NOT NULL | |
| `cars_color` | String | 50 | | สีของรถ | NOT NULL | |
| `cars_license` | String | 20 | | ทะเบียนรถ | NOT NULL | Unique |
| `cars_status` | ENUM | | `Available` | สถานะ: Available, Booked, Maintenance, Unavailable, Reserved | NOT NULL | |
| `cars_remark` | String | 500 | | หมายเหตุ | | |
| `created_date` | TIMESTAMP WITH TIME ZONE | | `CURRENT_TIMESTAMP` | วันที่สร้าง | NOT NULL | |
| `created_by` | UUID | | | ผู้สร้าง (FK -> user) | NOT NULL | |
| `updated_date` | TIMESTAMP WITH TIME ZONE | | `CURRENT_TIMESTAMP` | วันที่แก้ไขล่าสุด | NOT NULL | |
| `updated_by` | UUID | | | ผู้แก้ไขล่าสุด (FK -> user) | NOT NULL | |
| `is_deleted` | Boolean | | `FALSE` | Soft Delete | | Yes |

---

## 2. vehicle_type
Defines types or categories of vehicles (e.g., SUV, Sedan).


| Column Name | Type | Size | Default | Descriptions | Constraints | Index |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `vehicle_type_id` | UUID | | | Primary Key | PRIMARY KEY | |
| `vehicle_type_name` | String | 100 | | ชื่อประเภทรถ เช่น รถเก๋ง, SUV, Van | NOT NULL | |
| `vehicle_type_desc` | String | 255 | | รายละเอียดประเภทรถ | | |
| `vehicle_type_remark` | String | 500 | | หมายเหตุ | | |
| `created_date` | TIMESTAMP WITH TIME ZONE | | `CURRENT_TIMESTAMP` | วันที่สร้าง | NOT NULL | |
| `created_by` | UUID | | | ผู้สร้าง (FK -> user) | NOT NULL | |
| `updated_date` | TIMESTAMP WITH TIME ZONE | | `CURRENT_TIMESTAMP` | วันที่แก้ไขล่าสุด | NOT NULL | |
| `updated_by` | UUID | | | ผู้แก้ไขล่าสุด (FK -> user) | NOT NULL | |
| `is_deleted` | Boolean | | `FALSE` | Soft Delete | | Yes |

---

## 3. brand
Vehicle manufacturing brands.


| Column Name | Type | Size | Default | Descriptions | Constraints | Index |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `brand_id` | UUID | | | Primary Key | PRIMARY KEY | |
| `brand_name` | String | 100 | | ชื่อยี่ห้อรถ เช่น Toyota, Honda | NOT NULL | Unique |
| `brand_desc` | String | 255 | | รายละเอียด | | |
| `brand_remark` | String | 500 | | หมายเหตุ | | |
| `created_date` | TIMESTAMP WITH TIME ZONE | | `CURRENT_TIMESTAMP` | วันที่สร้าง | NOT NULL | |
| `created_by` | UUID | | | ผู้สร้าง (FK -> user) | NOT NULL | |
| `updated_date` | TIMESTAMP WITH TIME ZONE | | `CURRENT_TIMESTAMP` | วันที่แก้ไขล่าสุด | NOT NULL | |
| `updated_by` | UUID | | | ผู้แก้ไขล่าสุด (FK -> user) | NOT NULL | |
| `is_deleted` | Boolean | | `FALSE` | Soft Delete | | Yes |

---

## 4. driver
System drivers and their status details.


| Column Name | Type | Size | Default | Descriptions | Constraints | Index |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `driver_id` | UUID | | | Primary Key | PRIMARY KEY | |
| `driver_full_name` | String | 150 | | ชื่อ-นามสกุลคนขับ | NOT NULL | |
| `driver_phone` | String | 20 | | เบอร์โทรศัพท์ | NOT NULL | Unique |
| `driver_card_images_id`| UUID | | | FK: รูปบัตรประชาชน | FK -> images(images_id) | |
| `driver_license_images_id`| UUID | | | FK: รูปใบขับขี่ | FK -> images(images_id) | |
| `driver_remark` | String | 500 | | หมายเหตุ | | |
| `created_date` | TIMESTAMP WITH TIME ZONE | | `CURRENT_TIMESTAMP` | วันที่สร้าง | NOT NULL | |
| `created_by` | UUID | | | ผู้สร้าง (FK -> user) | NOT NULL | |
| `updated_date` | TIMESTAMP WITH TIME ZONE | | `CURRENT_TIMESTAMP` | วันที่แก้ไขล่าสุด | NOT NULL | |
| `updated_by` | UUID | | | ผู้แก้ไขล่าสุด (FK -> user) | NOT NULL | |
| `is_deleted` | Boolean | | `FALSE` | Soft Delete | | Yes |

---

## 5. images
Stores multimedia/image file metadata uploaded to object storage.


| Column Name | Type | Size | Default | Descriptions | Constraints | Index |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `images_id` | UUID | | | Primary Key | PRIMARY KEY | |
| `images_key` | String | 255 | | ชื่อไฟล์ใน Object Storage | NOT NULL | |
| `images_url` | String | 500 | | URL ของภาพ | NOT NULL | |
| `images_name` | String | 255 | | ชื่อไฟล์ดั้งเดิม | NOT NULL | |
| `images_size` | BigInt | | | ขนาดไฟล์ (bytes) | | |
| `images_type` | String | 50 | | ประเภทไฟล์ (image/jpeg, image/png) | | |
| `images_remark` | String | 500 | | หมายเหตุ | | |
| `created_date` | TIMESTAMP WITH TIME ZONE | | `CURRENT_TIMESTAMP` | วันที่สร้าง | NOT NULL | |
| `created_by` | UUID | | | ผู้สร้าง (FK -> user) | NOT NULL | |
| `updated_date` | TIMESTAMP WITH TIME ZONE | | `CURRENT_TIMESTAMP` | วันที่แก้ไขล่าสุด | NOT NULL | |
| `updated_by` | UUID | | | ผู้แก้ไขล่าสุด (FK -> user) | NOT NULL | |
| `is_deleted` | Boolean | | `FALSE` | Soft Delete | | Yes |

---

## 6. map_cars_images
Maps multiple perspective images to specific cars.


| Column Name | Type | Size | Default | Descriptions | Constraints | Index |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `map_cars_images_id` | UUID | | | Primary Key | PRIMARY KEY | Yes |
| `cars_id` | UUID | | | FK: รหัสรถ | FK -> cars(cars_id) ON DELETE CASCADE | Yes |
| `images_id` | UUID | | | FK: รหัสภาพ | FK -> images(images_id) ON DELETE CASCADE | Yes |
| `cars_images_type` | String | 150 | | ประเภทรูป: 'FRONT' (หน้ารถ), 'SIDE' (ข้างรถ), 'INTERIOR' (ภายใน), 'BACK' (หลังรถ) | NOT NULL | |
| `cars_images_numb` | Int | 10 | | ลำดับการแสดงผล (ใช้เรียงก่อน-หลัง) | | |

---

## 7. products
Rate packages and pricing rules aligned with promotional timelines.


| Column Name | Type | Size | Default | Descriptions | Constraints | Index |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `products_id` | UUID | | | Primary Key | PRIMARY KEY | |
| `products_name` | String | 255 | | เรทราคา หรือชื่อโปรโมชัน | NOT NULL | |
| `products_desc` | String | 255 | | รายละเอียดแพ็กเกจ | | |
| `products_remark` | String | 500 | | หมายเหตุภายใน | | |
| `products_price` | Decimal(12,2) | | `0` | ราคาขายต่อวันของแพ็กเกจนี้ | | |
| `date_start` | TIMESTAMP WITH TIME ZONE | | | วันเวลาเริ่มสตาร์ทการใช้เรทนี้ | | |
| `date_end` | TIMESTAMP WITH TIME ZONE | | | วันเวลาสิ้นสุดแพ็กเกจนี้ | | |
| `date_count` | Int | | `0` | นับจำนวน วันที่ เวลา ของ date_start ถึง date_end | | |
| `is_active` | Boolean | | `TRUE` | สถานะ: Active, Inactive (เมื่อ current date ถึงวันที่ date_end แล้ว status จะเปลี่ยนอัตโนมัติ) | | |
| `created_date` | TIMESTAMP WITH TIME ZONE | | `CURRENT_TIMESTAMP` | วันที่สร้าง | NOT NULL | |
| `created_by` | UUID | | | ผู้สร้าง (FK -> user) | NOT NULL | |
| `updated_date` | TIMESTAMP WITH TIME ZONE | | `CURRENT_TIMESTAMP` | วันที่แก้ไขล่าสุด | NOT NULL | |
| `updated_by` | UUID | | | ผู้แก้ไขล่าสุด (FK -> user) | NOT NULL | |
| `is_deleted` | Boolean | | `FALSE` | Soft Delete | | Yes |

---

## 8. booking
Core rental transactional data.


| Column Name | Type | Size | Default | Descriptions | Constraints | Index |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `booking_id` | UUID | | | Primary Key | PRIMARY KEY | |
| `products_id` | UUID | | | FK: แพ็กเกจที่เลือก | FK -> products(products_id) | Yes |
| `cars_id` | UUID | | | FK: รถที่จอง | FK -> cars(cars_id) | Yes |
| `user_id` | UUID | | | FK: ผู้เช่ารถ | FK -> user(user_id) | Yes |
| `driver_id` | UUID | | | FK: คนขับ (ถ้ามี) | FK -> driver(driver_id) | Yes |
| `date_start` | TIMESTAMP WITH TIME ZONE | | | วันที่-เวลา รับรถ | NOT NULL | Yes |
| `date_end` | TIMESTAMP WITH TIME ZONE | | | วันที่-เวลา ส่งคืนรถ | NOT NULL | Yes |
| `date_count` | Int | | `0` | นับจำนวน วันที่ เวลา ของ date_start ถึง date_end | NOT NULL | |
| `daily_rate` | Decimal(12,2) | | `0` | ราคาต่อวัน (ตั้งมาจาก product_price) | NOT NULL | |
| `daily_rate_discount`| Decimal(12,2) | | `0` | ยอดรวมก่อนหักส่วนลด (price * date_count) | NOT NULL | |
| `discount_amount` | Decimal(12,2) | | `0` | จำนวนเงินส่วนลด (ถ้ามี) | | |
| `tax_amount` | Decimal(12,2) | | `0` | ยอดภาษี VAT | | |
| `total_amount` | Decimal(12,2) | | `0` | ยอดรวมทั้งหมดที่ต้องจ่ายจริง (daily_rate_discount - discount_amount + tax_amount) | NOT NULL | |
| `booking_status` | ENUM | | `Pending` | สถานะ: Pending, Confirmed, In Progress, Completed, Cancelled, Rejected | NOT NULL | Yes |
| `created_date` | TIMESTAMP WITH TIME ZONE | | `CURRENT_TIMESTAMP` | วันที่สร้าง | NOT NULL | |
| `created_by` | UUID | | | ผู้สร้าง (FK -> user) | NOT NULL | |
| `updated_date` | TIMESTAMP WITH TIME ZONE | | `CURRENT_TIMESTAMP` | วันที่แก้ไขล่าสุด | NOT NULL | |
| `updated_by` | UUID | | | ผู้แก้ไขล่าสุด (FK -> user) | NOT NULL | |
| `is_deleted` | Boolean | | `FALSE` | Soft Delete | | Yes |

---

## 9. payments
Financial settlements tied directly to active booking transactions.


| Column Name | Type | Size | Default | Descriptions | Constraints | Index |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `payments_id` | UUID | | | Primary Key | PRIMARY KEY | |
| `booking_id` | UUID | | | FK: การจองที่เกี่ยวข้อง | FK -> booking(booking_id) | Yes |
| `payment_date` | TIMESTAMP WITH TIME ZONE | | `CURRENT_TIMESTAMP` | วันที่ชำระเงิน | NOT NULL | |
| `amount` | Decimal(12,2) | | `0` | จำนวนเงิน | NOT NULL | |
| `payment_method` | ENUM | | | วิธีชำระ: cash, credit_card, promptpay, bank_transfer | NOT NULL | |
| `payment_status` | ENUM | | `Pending` | สถานะ: Pending, Paid, Failed, Refunded | NOT NULL | Yes |
| `created_date` | TIMESTAMP WITH TIME ZONE | | `CURRENT_TIMESTAMP` | วันที่สร้าง | NOT NULL | |
| `created_by` | UUID | | | ผู้สร้าง (FK -> user) | NOT NULL | |
| `updated_date` | TIMESTAMP WITH TIME ZONE | | `CURRENT_TIMESTAMP` | วันที่แก้ไขล่าสุด | NOT NULL | |
| `updated_by` | UUID | | | ผู้แก้ไขล่าสุด (FK -> user) | NOT NULL | |
| `is_deleted` | Boolean | | `FALSE` | Soft Delete | | Yes |

---

## 10. user
Registered user accounts.


| Column Name | Type | Size | Default | Descriptions | Constraints | Index |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `user_id` | UUID | | | Primary Key | PRIMARY KEY | |
| `user_full_name` | String | 150 | | ชื่อ-นามสกุล | NOT NULL | |
| `user_phone` | String | 20 | | เบอร์โทรศัพท์ | NOT NULL | Unique |
| `user_card_image_id` | UUID | | | รูปบัตรประชาชน | FK -> images(images_id) | |
| `user_report_download`| Int | | `0` | จำนวนครั้งที่ดาวน์โหลดรายงาน | | |
| `user_remark` | String | 500 | | หมายเหตุ | | |
| `created_date` | TIMESTAMP WITH TIME ZONE | | `CURRENT_TIMESTAMP` | วันที่สร้าง | NOT NULL | |
| `created_by` | UUID | | | ผู้สร้าง (FK -> user) | NOT NULL | |
| `updated_date` | TIMESTAMP WITH TIME ZONE | | `CURRENT_TIMESTAMP` | วันที่แก้ไขล่าสุด | NOT NULL | |
| `updated_by` | UUID | | | ผู้แก้ไขล่าสุด (FK -> user) | NOT NULL | |
| `is_deleted` | Boolean | | `FALSE` | Soft Delete | | Yes |

---

## 11. roles
System authority permissions roles (e.g., Admin, Staff).


| Column Name | Type | Size | Default | Descriptions | Constraints | Index |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `role_id` | UUID | | | Primary Key | PRIMARY KEY | Yes |
| `role_name` | String | 100 | | ชื่อบทบาท เช่น Admin, Manager, Staff, Customer | NOT NULL | |
| `role_code` | String | 50 | | รหัส เช่น ADMIN, MANAGER | NOT NULL | Unique |
| `role_desc` | String | 255 | | คำอธิบายบทบาท | | |
| `is_active` | Boolean | | `TRUE` | บทบาทนี้ยังใช้งานได้หรือไม่ | NOT NULL | |
| `created_date` | TIMESTAMP WITH TIME ZONE | | `CURRENT_TIMESTAMP` | วันที่สร้าง | NOT NULL | |
| `created_by` | UUID | | | ผู้สร้าง (FK -> user) | NOT NULL | |
| `updated_date` | TIMESTAMP WITH TIME ZONE | | `CURRENT_TIMESTAMP` | วันที่แก้ไขล่าสุด | NOT NULL | |
| `updated_by` | UUID | | | ผู้แก้ไขล่าสุด (FK -> user) | NOT NULL | |
| `is_deleted` | Boolean | | `FALSE` | Soft Delete | | Yes |

---

## 12. map_user_roles
Bridge entity matching users with multi-tier operational role sets.


| Column Name | Type | Size | Default | Descriptions | Constraints | Index |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `map_user_role_id` | UUID | | | Primary Key | PRIMARY KEY | Yes |
| `user_id` | UUID | | | FK: ผู้ใช้งาน | FK -> user(user_id) ON DELETE CASCADE | Yes |
| `role_id` | UUID | | | FK: บทบาท | FK -> roles(role_id) ON DELETE CASCADE | Yes |
| `created_date` | TIMESTAMP WITH TIME ZONE | | `CURRENT_TIMESTAMP` | วันที่สร้าง | NOT NULL | |
| `created_by` | UUID | | | ผู้สร้าง | | |
| `updated_date` | TIMESTAMP WITH TIME ZONE | | `CURRENT_TIMESTAMP` | วันที่แก้ไขล่าสุด | | |
| `updated_by` | UUID | | | ผู้แก้ไขล่าสุด | | |
| `is_deleted` | Boolean | | `FALSE` | Soft Delete | | Yes |

---

## 13. permission
Action-level granular security keys.


| Column Name | Type | Size | Default | Descriptions | Constraints | Index |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `permission_id` | UUID | | | Primary Key | PRIMARY KEY | Yes |
| `permission_name` | String | 100 | | ชื่อสิทธิ์ เช่น View, Approve | NOT NULL | |
| `permission_code` | String | 100 | | รหัสสิทธิ์ เช่น cars.view, booking.approve | NOT NULL | Unique |
| `permission_desc` | String | 255 | | คำอธิบายสิทธิ์ | | |
| `permission_remark` | String | 500 | | หมายเหตุ | | |
| `created_date` | TIMESTAMP WITH TIME ZONE | | `CURRENT_TIMESTAMP` | วันที่สร้าง | NOT NULL | |
| `created_by` | UUID | | | ผู้สร้าง (FK -> user) | NOT NULL | |
| `updated_date` | TIMESTAMP WITH TIME ZONE | | `CURRENT_TIMESTAMP` | วันที่แก้ไขล่าสุด | NOT NULL | |
| `updated_by` | UUID | | | ผู้แก้ไขล่าสุด (FK -> user) | NOT NULL | |
| `is_deleted` | Boolean | | `FALSE` | Soft Delete | | Yes |

---

## 14. menu
Application front-end navigation routers hierarchy mappings.


| Column Name | Type | Size | Default | Descriptions | Constraints | Index |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `menu_id` | UUID | | | Primary Key | PRIMARY KEY | Yes |
| `menu_key` | String | 100 | | รหัสเมนู (unique) | NOT NULL | Unique |
| `menu_title` | String | 150 | | ชื่อเมนูที่แสดง | NOT NULL | |
| `menu_icon` | String | 100 | | ไอคอนเมนู | | |
| `menu_path` | String | 255 | | เส้นทางในแอป | | |
| `menu_parent_id` | UUID | | | FK: เมนูแม่ (Submenu) | FK -> menu(menu_id) | |
| `menu_sequence` | Int | | `0` | ลำดับการแสดงผล | NOT NULL | |
| `menu_remark` | String | 500 | | หมายเหตุ | | |
| `required_permission`| String | 100 | | Permission Name ที่จำเป็นในการเห็นเมนูนี้ | | |
| `is_active` | Boolean | | `TRUE` | เปิดใช้งานเมนู | NOT NULL | |
| `is_external` | Boolean | | `FALSE` | เป็นลิงก์ภายนอกหรือไม่ | NOT NULL | |
| `created_date` | TIMESTAMP WITH TIME ZONE | | `CURRENT_TIMESTAMP` | วันที่สร้าง | NOT NULL | |
| `created_by` | UUID | | | ผู้สร้าง (FK -> user) | NOT NULL | |
| `updated_date` | TIMESTAMP WITH TIME ZONE | | `CURRENT_TIMESTAMP` | วันที่แก้ไขล่าสุด | NOT NULL | |
| `updated_by` | UUID | | | ผู้แก้ไขล่าสุด (FK -> user) | NOT NULL | |
| `is_deleted` | Boolean | | `FALSE` | Soft Delete | | Yes |

---

## 15. map_role_menu_permissions
Access Control Lists linking operational roles, front-end modules, and access levels.


| Column Name | Type | Size | Default | Descriptions | Constraints | Index |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `map_rmp_id` | UUID | | | Primary Key | PRIMARY KEY | Yes |
| `role_id` | UUID | | | FK: บทบาท | FK -> roles(role_id) ON DELETE CASCADE | Yes |
| `menu_id` | UUID | | | FK: เมนู | FK -> menu(menu_id) ON DELETE CASCADE | Yes |
| `permission_id` | UUID | | | FK: สิทธิ์ | FK -> permission(permission_id) ON DELETE CASCADE | Yes |
| `created_date` | TIMESTAMP WITH TIME ZONE | | `CURRENT_TIMESTAMP` | วันที่สร้าง | NOT NULL | |
| `created_by` | UUID | | | ผู้สร้าง (FK -> user) | NOT NULL | |
| `updated_date` | TIMESTAMP WITH TIME ZONE | | `CURRENT_TIMESTAMP` | วันที่แก้ไขล่าสุด | NOT NULL | |
| `updated_by` | UUID | | | ผู้แก้ไขล่าสุด (FK -> user) | NOT NULL | |
| `is_deleted` | Boolean | | `FALSE` | Soft Delete | | Yes |

---

## 16. maintenances
Vehicle fleet maintenance logs, scheduling metrics, and historical odometer syncing rules.


| Column Name | Type | Size | Default | Descriptions | Constraints | Index |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `maintenances_id` | UUID | | | Primary Key | PRIMARY KEY | Yes |
| `cars_id` | UUID | | | FK: รหัสรถ | FK -> cars(cars_id) | Yes |
| `maintenances_name` | String | 255 | | ชื่อการซ่อมบำรุง | NOT NULL | |
| `maintenances_desc` | String | 255 | | รายละเอียด | | |
| `maintenances_remark`| String | 500 | | หมายเหตุ | | |
| `maintenances_type` | ENUM | | | ประเภท เช่น 'maintenance', 'tax', 'insurance' | NOT NULL | |
| `maintenances_status`| ENUM | | `Pending` | สถานะ: Pending, Active, Complete | NOT NULL | Yes |
| `mileage` | Int | | `0` | เลขไมล์ล่าสุดที่เช้าเช็กจาก cars.mileage | | |
| `mileage_target` | Int | | `0` | เลขไมล์ปัจจุบัน เมื่อกรอกแล้วจะอัปเดตกลับไปที่ cars.mileage | | |
| `mileage_alert` | Int | | `0` | เลขไมล์ที่ต้องการให้แสดงการแจ้งเตือน | | |
| `date_alert` | TIMESTAMP WITH TIME ZONE | | | วันที่-เวลา ต้องการให้แจ้งเตือน | | |
| `date_start` | TIMESTAMP WITH TIME ZONE | | | วันที่-เวลา เริ่ม เช่น maintenances โดย maintenances_status จะเป็น Active | NOT NULL | Yes |
| `date_end` | TIMESTAMP WITH TIME ZONE | | | วันที่-เวลา เสร็จสิ้น maintenances โดย maintenances_status จะเป็น complete | NOT NULL | Yes |
| `date_count` | Int | | `0` | นับจำนวน วันที่ เวลา ของ date_start ถึง date_end | | |
| `created_date` | TIMESTAMP WITH TIME ZONE | | `CURRENT_TIMESTAMP` | วันที่สร้าง | NOT NULL | |
| `created_by` | UUID | | | ผู้สร้าง (FK -> user) | NOT NULL | |
| `updated_date` | TIMESTAMP WITH TIME ZONE | | `CURRENT_TIMESTAMP` | วันที่แก้ไขล่าสุด | NOT NULL | |
| `updated_by` | UUID | | | ผู้แก้ไขล่าสุด (FK -> user) | NOT NULL | |
| `is_deleted` | Boolean | | `FALSE` | Soft Delete | | Yes |
