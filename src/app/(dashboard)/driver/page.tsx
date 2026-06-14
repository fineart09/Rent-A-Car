import prisma from '@/lib/prisma'
import DriverPageClient, { type DriverRow } from './driver-client'

export const dynamic = 'force-dynamic'

export default async function DriverPage() {
  const drivers = await prisma.driver.findMany({
    where: { isDeleted: false },
    orderBy: { createdAt: 'desc' },
    include: {
      cardImage: true,
      licenseImage: true,
    },
  })

  const rows: DriverRow[] = drivers.map((driver) => ({
    id: driver.id,
    driver_full_name: driver.fullName,
    driver_phone: driver.phone,
    driver_remark: driver.remark ?? '',
    driver_card_images_id: driver.cardImageId ?? '',
    driver_license_images_id: driver.licenseImageId ?? '',
    cardImage: driver.cardImage
      ? {
          id: driver.cardImage.id,
          url: driver.cardImage.url,
          name: driver.cardImage.name,
        }
      : null,
    licenseImage: driver.licenseImage
      ? {
          id: driver.licenseImage.id,
          url: driver.licenseImage.url,
          name: driver.licenseImage.name,
        }
      : null,
  }))

  return <DriverPageClient initialDrivers={rows} />
}
