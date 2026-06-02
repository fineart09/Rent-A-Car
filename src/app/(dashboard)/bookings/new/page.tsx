import prisma from '@/lib/prisma'
import { toNumber } from '@/lib/ui-format'
import NewBookingForm, {
  type BookingCarOption,
  type BookingProductOption,
} from './NewBookingForm'

export const dynamic = 'force-dynamic'

type NewBookingPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

function getParam(params: Record<string, string | string[] | undefined>, key: string) {
  const value = params[key]
  return Array.isArray(value) ? value[0] : value
}

export default async function NewBookingPage({ searchParams }: NewBookingPageProps) {
  const params = (await searchParams) ?? {}
  const prefillCarId = getParam(params, 'car_id') ?? getParam(params, 'id') ?? ''

  const [cars, products] = await Promise.all([
    prisma.car.findMany({
      where: { isDeleted: false },
      orderBy: [{ status: 'asc' }, { createdAt: 'desc' }],
      select: {
        id: true,
        model: true,
        year: true,
        color: true,
        license: true,
        status: true,
        brand: { select: { name: true } },
        vehicleType: { select: { name: true } },
      },
    }),
    prisma.product.findMany({
      where: { isDeleted: false, isActive: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        price: true,
        dateCount: true,
        dateStart: true,
        dateEnd: true,
      },
    }),
  ])

  const carOptions: BookingCarOption[] = cars.map((car) => ({
    id: car.id,
    name: `${car.brand.name} ${car.model}`,
    license: car.license,
    status: car.status,
    vehicleType: car.vehicleType.name,
    year: car.year,
    color: car.color,
  }))

  const productOptions: BookingProductOption[] = products.map((product) => ({
    id: product.id,
    name: product.name,
    price: toNumber(product.price),
    dateCount: product.dateCount,
    dateStart: product.dateStart.toISOString(),
    dateEnd: product.dateEnd.toISOString(),
  }))

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-extrabold tracking-normal text-slate-950">สร้างรายการเช่า</h1>
        <p className="text-lg font-bold text-slate-500">
          ตรวจสอบช่วงวันที่ว่างและคำนวณยอดก่อนสร้างรายการจริง
        </p>
      </header>

      <NewBookingForm
        cars={carOptions}
        products={productOptions}
        prefillCarId={prefillCarId}
      />
    </div>
  )
}
