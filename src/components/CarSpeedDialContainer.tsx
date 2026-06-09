import prisma from '@/lib/prisma'
import CarSpeedDialClient from '@/components/CarSpeedDialClient'

export default async function CarSpeedDialContainer() {
  const [vehicleTypes, brands] = await Promise.all([
    prisma.vehicleType.findMany({ orderBy: { name: 'asc' } }),
    prisma.brand.findMany({ orderBy: { name: 'asc' } }),
  ])

  return <CarSpeedDialClient vehicleTypes={vehicleTypes} brands={brands} />
}
