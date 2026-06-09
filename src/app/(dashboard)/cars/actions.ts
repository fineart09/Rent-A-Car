'use server'

import prisma from '@/lib/prisma'
import { getSessionAndRoles } from '@/lib/auth-server'

interface CreateCarInput {
  vehicleTypeId: string
  brandId: string
  model: string
  year: string
  color: string
  license: string
  mileage: number
  status: 'Available' | 'Booked' | 'Maintenance' | 'Unavailable' | 'Reserved'
  remark: string | null
}

export async function createCar(input: CreateCarInput) {
  try {
    // Check if license already exists
    const existingCar = await prisma.car.findUnique({
      where: { license: input.license.trim() },
    })

    if (existingCar) {
      return {
        success: false,
        error: 'ทะเบียนรถนี้ถูกใช้งานแล้ว กรุณาตรวจสอบอีกครั้ง',
      }
    }

    const userRoles = await getSessionAndRoles();

    // Create the car
    const car = await prisma.car.create({
      data: {
        vehicleTypeId: input.vehicleTypeId,
        brandId: input.brandId,
        model: input.model,
        year: input.year,
        color: input.color,
        license: input.license.trim(),
        mileage: input.mileage,
        status: input.status,
        remark: input.remark,
        isDeleted: false,
        createdBy: userRoles.session?.user?.id || 'unknown',
        updatedBy: userRoles.session?.user?.id || 'unknown',
      },
      include: {
        brand: true,
        vehicleType: true,
      },
    })

    return {
      success: true,
      data: car,
    }
  } catch (error) {
    console.error('[createCar] Error:', error)
    return {
      success: false,
      error: 'เกิดข้อผิดพลาดในการสร้างข้อมูลรถ',
    }
  }
}
