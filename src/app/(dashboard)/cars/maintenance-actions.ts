'use server'

import prisma from '@/lib/prisma'

interface CreateMaintenanceInput {
  name: string
  description: string | null
  estimatedCost: number | null
}

export async function createMaintenance(input: CreateMaintenanceInput) {
  try {
    const existing = await prisma.maintenance.findUnique({
      where: { name: input.name.trim() },
    })

    if (existing) {
      return {
        success: false,
        error: 'การบำรุงรักษาแบบนี้มีอยู่แล้ว กรุณาใช้ชื่ออื่น',
      }
    }

    const maintenance = await prisma.maintenance.create({
      data: {
        name: input.name.trim(),
        description: input.description,
        estimatedCost: input.estimatedCost,
      },
    })

    return {
      success: true,
      data: maintenance,
    }
  } catch (error) {
    console.error('[createMaintenance] Error:', error)
    return {
      success: false,
      error: 'เกิดข้อผิดพลาดในการสร้างการบำรุงรักษา',
    }
  }
}