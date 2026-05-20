
สิ่งที่ลูกค้าต้องการ
1. ต้องการระบบการแจ้งเตือนเมื่อถึงเลขไมที่กำหนด เพื่อเป็นการเตือนการซ่อมบำรุง
2. จัดการรายรับรายจ่าย ให้แยก report summary ให้ระดับ admin ดูได้คนเดียว
3. สามารถปริ้น pdf สัญญาเช่ารถได้โดยมาจากข้อมูลลูกค้า (สามารถกับหนดจำนวนการปริ้นได้)
4. สารถเพิ่มราคาได้ โดยกำหนดราคาตามวันที่กำหนด จะเก็บไว้ในส่วนของ payment 


* สิ่งที่ต้องเตรียม
1. จะต้องมีระบบอะไรบ้าง
2. จะต้องมีหน้าอะไรบ้าง
3. จะต้องมี field อะไรบ้างที่จะต้องกรอก


* ข้อมูลจำเป็นใช้ในการออกแบบ Database
ข้อมูลรถ (Cars Entity)
1. รหัสของรถ (cars_id : cars0001)
2. ประเภทรถ ( : [vehicle_type_id : vehi0001, vehicle_type: SUV])
3. ยี่ห้อรถ  (brand_id: [brand_id: bran0001, brand: Honda])
4. รุ่นของรถ (model: HRV)
5. ปีของรถ (years: 2025)
6. สีของรถ (color: ดำ)
10. ทะเบียนรถ (license_plate: 7กก 1525)
12. สถานะปัจจุบัน (status: [Available, Booked, In_Maintenance])

ข้อมูลผู้เช่า (Customers Entity)
1. รหัสของผู้เช่า (customer_id: cust0001)
2. ชื่อนามสกุล (full_name: มิคามิ โอบิโตะ)
4. เบอร์โทร (phone: 0922644346)
5. เลขประจำตัวประชาชน (identification_number: 1234567890123) > เป็นรูปภาพ
6. เลขที่ใบอนุญาตขับรถ (license_number: 12345678) > เป็นรูปภาพ

ข้อมูลการจอง (Booking Entity)
1. รหัสการจอง (booking_id: book0001)
2. car_id
3. customer_id
4. วันที่เริ่มการเช่า (start_date: 21/04/2026)
5. วันที่สิ้นสุดการเช่า (end_date: 22/04/2026)
6. สถานที่รับรถ (pickup_location: ดอนเมือง)
7. สถานที่คืนรถ (dropoff_location: ดอนเมือง)
8. ราคารวม (total_price: 8000)
9. สาถานะการจอง (booking_status:[Pending, Confirmed, Completed, Cancelled])

ข้อมูลการชำระเงิน (Payments Entity)
- รหัสการชำระเงิน (payments_id: paym0001)
- bookinng_id
- ยอดเงินที่จ่าย (amount: 2000)
- ราคาเช่าต่อวัน (daily_rate: 2000)
- ราคาโปรโมชั่น
- จำนวนวันในการเช่า
- วิธีการจ่าย (payment_method: [Credit Card, Bank Transfer, PromptPay])
- สถานะการชำระเงิน (payment_status: [Success, Failed, Refunded])
- เวลาที่ทำรายการ (transaction_time: 5 นาที)


ข้อมูลการซ่อมบำรุง (Maintenance Entity)
1. รหัสการซ่อมบำรุง (maintenance_id: main0001)
2. cars_id
3. รายละเอียดการซ่อม (description: บลา บลา)
4. วันที่นัดซ่อม (scheduled_date: 22/04/2026)

ข้อมูลพนักงาน
1. ชื่อนามสกุล
2. เบอร์โทร
3. เลขประจำตัวประชาชน (identification_number: 1234567890123) > เป็นรูปภาพ
4. สิทการเข้าถึงระบบ Role Management 


Architecture
Frontend + Backend:
Next.js

UI:
Tailwind + shadcn/ui

Database:
PostgreSQL

ORM:
Prisma

Auth:
Auth.js

Storage:
S3 / UploadThing

PDF:
React-pdf

Dashboard:
TanStack Table

Deploy:
Vercel


 

