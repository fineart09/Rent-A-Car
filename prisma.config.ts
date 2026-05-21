import { defineConfig } from "prisma/config";
import { config } from "dotenv";

// 👈 บังคับให้โหลดค่าจาก .env ตั้งแต่บรรทัดแรก
config();

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // 👈 เรียกใช้งาน process.env ตรงๆ
    url: process.env.DATABASE_URL || "", 
  },
});
