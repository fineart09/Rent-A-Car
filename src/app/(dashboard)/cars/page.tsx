import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Calendar, Car, Gauge, Palette, Search } from 'lucide-react'
import prisma from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Input from '@/components/ui/input'
import Select from '@/components/ui/select'
import CarSpeedDial from '@/components/CarSpeedDial'
import {
  formatCompactNumber,
  getStatusBadgeClass,
  getStatusLabel,
  toNumber,
} from '@/lib/ui-format'

export const dynamic = 'force-dynamic'

const carStatuses = ['Available', 'Booked', 'Maintenance', 'Unavailable', 'Reserved'] as const

type CarsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

function getFirstImage(
  images: Array<{ number: number; image: { url: string; name: string } }>
) {
  return [...images].sort((a, b) => a.number - b.number)[0]?.image
}

export default async function CarsPage({ searchParams }: CarsPageProps) {
  const params = (await searchParams) ?? {}
  const q = typeof params.q === 'string' ? params.q.trim() : ''
  const statusParam = typeof params.status === 'string' ? params.status : ''
  const status = carStatuses.includes(statusParam as (typeof carStatuses)[number]) ? statusParam : ''
  const brand = typeof params.brand === 'string' ? params.brand.trim() : ''
  const vehicleType = typeof params.vehicleType === 'string' ? params.vehicleType.trim() : ''
  const sort = typeof params.sort === 'string' ? params.sort : 'newest'

  const where: any = { isDeleted: false }

  if (q) {
    where.OR = [
      { model: { contains: q, mode: 'insensitive' } },
      { license: { contains: q, mode: 'insensitive' } },
      { color: { contains: q, mode: 'insensitive' } },
      { brand: { name: { contains: q, mode: 'insensitive' } } },
      { vehicleType: { name: { contains: q, mode: 'insensitive' } } },
    ]
  }

  if (status) where.status = status
  if (brand) where.brand = { name: { contains: brand, mode: 'insensitive' } }
  if (vehicleType) where.vehicleType = { name: { contains: vehicleType, mode: 'insensitive' } }

  const orderBy: any =
    sort === 'model'
      ? { model: 'asc' }
      : sort === 'year'
        ? { year: 'desc' }
        : sort === 'mileage'
          ? { mileage: 'asc' }
          : { createdAt: 'desc' }

  const [cars, totalCars, availableCars] = await Promise.all([
    prisma.car.findMany({
      where,
      orderBy,
      take: 48,
      include: {
        brand: true,
        vehicleType: true,
        images: {
          include: { image: true },
          orderBy: { number: 'asc' },
        },
      },
    }),
    prisma.car.count({ where: { isDeleted: false } }),
    prisma.car.count({ where: { isDeleted: false, status: 'Available' } }),
  ])

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-normal text-slate-950">จัดการรถ</h1>
          <p className="mt-3 text-lg font-bold text-slate-500">ค้นหา ตรวจสอบสถานะ และจัดการข้อมูลรถเช่า</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:min-w-72">
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm shadow-slate-200/60">
            <div className="text-sm font-bold text-slate-500">รถทั้งหมด</div>
            <div className="mt-2 text-3xl font-extrabold text-slate-950">{formatCompactNumber(totalCars)}</div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm shadow-slate-200/60">
            <div className="text-sm font-bold text-slate-500">พร้อมให้เช่า</div>
            <div className="mt-2 text-3xl font-extrabold text-emerald-600">
              {formatCompactNumber(availableCars)}
            </div>
          </div>
        </div>
      </header>

      <form
        method="get"
        action="/cars"
        className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60 lg:grid-cols-[minmax(220px,1fr)_180px_160px_160px_150px_auto]"
      >
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input name="q" defaultValue={q} placeholder="ค้นหารถ รุ่น ทะเบียน" className="pl-10" />
        </div>

        <Select name="status" defaultValue={status}>
          <option value="">ทุกสถานะ</option>
          {carStatuses.map((carStatus) => (
            <option key={carStatus} value={carStatus}>
              {getStatusLabel(carStatus)}
            </option>
          ))}
        </Select>

        <Input name="brand" defaultValue={brand} placeholder="แบรนด์" />
        <Input name="vehicleType" defaultValue={vehicleType} placeholder="ประเภทรถ" />

        <Select name="sort" defaultValue={sort}>
          <option value="newest">ล่าสุด</option>
          <option value="model">เรียงตามรุ่น</option>
          <option value="year">ปีใหม่ก่อน</option>
          <option value="mileage">ไมล์น้อยก่อน</option>
        </Select>

        <Button type="submit" className="h-11">
          ค้นหา
        </Button>
      </form>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {cars.map((car) => {
          const image = getFirstImage(car.images)

          return (
            <Card key={car.id} className="overflow-hidden">
              <div className="relative h-52 bg-slate-100">
                {image ? (
                  <Image
                    src={image.url}
                    alt={image.name || `${car.brand.name} ${car.model}`}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-400">
                    <Car className="h-12 w-12" aria-hidden="true" />
                  </div>
                )}

                <div className="absolute left-4 top-4">
                  <Badge className={getStatusBadgeClass(car.status)}>{getStatusLabel(car.status)}</Badge>
                </div>
              </div>

              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="truncate text-xl font-extrabold text-slate-950">
                      {car.brand.name} {car.model}
                    </h2>
                    <p className="mt-1 text-sm font-bold text-slate-500">{car.license}</p>
                  </div>
                  <div className="rounded-xl bg-blue-50 px-3 py-2 text-sm font-extrabold text-blue-700">
                    {car.vehicleType.name}
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-3 gap-3 text-sm font-bold text-slate-600">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    {car.year || '-'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Gauge className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    {formatCompactNumber(toNumber(car.mileage))} km
                  </div>
                  <div className="flex items-center gap-2">
                    <Palette className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    {car.color || '-'}
                  </div>
                </div>

                {car.remark && (
                  <p className="mt-5 line-clamp-2 text-sm font-medium leading-6 text-slate-500">
                    {car.remark}
                  </p>
                )}

                <div className="mt-6 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-400">ID: {car.id.slice(0, 8)}</span>
                  <Button asChild size="sm">
                    <Link href={`/cars/${car.id}`}>
                      รายละเอียด
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </section>

      {cars.length === 0 && (
        <Card>
          <CardContent className="py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
              <Car className="h-7 w-7" aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-xl font-extrabold text-slate-950">ไม่พบรถที่ตรงกับเงื่อนไข</h2>
            <p className="mt-2 text-sm font-semibold text-slate-500">ลองเปลี่ยนคำค้นหาหรือตัวกรองอีกครั้ง</p>
          </CardContent>
        </Card>
      )}

      <CarSpeedDial />
    </div>
  )
}
