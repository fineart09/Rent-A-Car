'use server'


interface CreateMaintenanceInput {
  name: string
  description: string | null
}

export async function createMaintenance(input: CreateMaintenanceInput) {
  try {


    return {
      success: true,
      data: input,
    }
  } catch (error) {
    console.error('[createMaintenance] Error:', error)
    return {
      success: false,
      error: 'เกิดข้อผิดพลาดในการสร้างการบำรุงรักษา',
    }
  }
}