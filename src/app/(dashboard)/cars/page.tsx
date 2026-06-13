import Link from 'next/link'
import { Car, Edit, Search, Trash } from 'lucide-react'
import prisma from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Input from '@/components/ui/input'
import Select from '@/components/ui/select'
import {
  formatCompactNumber,
  getStatusBadgeClass,
  getStatusLabel,
  toNumber,
} from '@/lib/ui-format'
import SpeedDialContainer from '@/components/SpeedDialContainer'

export const dynamic = 'force-dynamic'

const carStatuses = [
  { value: 'Available', label: 'พร้อมให้เช่า' },
  { value: 'Booked', label: 'จองแล้ว' },
  { value: 'Maintenance', label: 'บำรุงรักษา' },
  { value: 'Unavailable', label: 'ไม่พร้อมใช้' },
  { value: 'Reserved', label: 'จองสำรอง' },
] as const

type CarsPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

export default async function CarsPage({ searchParams }: CarsPageProps) {
  const params = (await searchParams) ?? {}
  const q = typeof params.q === 'string' ? params.q.trim() : ''
  const statusParam = typeof params.status === 'string' ? params.status : ''
  const status = carStatuses.find(status => status.value === statusParam)?.value ?? ''
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
        className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/60 lg:grid-cols-3 xl:grid-cols-[minmax(220px,1fr)_180px_160px_160px_150px_auto] overflow-auto"
      >
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input name="q" defaultValue={q} placeholder="ค้นหารถ รุ่น ทะเบียน" className="pl-10" />
        </div>

        <Select name="status" defaultValue={status}>
          <option value="">ทุกสถานะ</option>
          {carStatuses.map((carStatus) => (
            <option key={carStatus.value} value={carStatus.value}>
              {carStatus.label}
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

      {cars.length > 0 && (
        <Card>
          <CardContent className="py-14 text-center overflow-auto">
            <table className="mx-auto w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 text-sm font-extrabold text-slate-950">
                  <th className="px-3 py-3">ยี่ห้อ/รุ่น</th>
                  <th className="px-3 py-3">ปี</th>
                  <th className="px-3 py-3">ทะเบียน</th>
                  <th className="px-3 py-3">สี</th>
                  <th className="px-3 py-3">ประเภท</th>
                  <th className="px-3 py-3 text-right">เลขไมล์</th>
                  <th className="px-3 py-3">สถานะ</th>
                  <th className='px-3 py-3 text-right'>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car) => {
                  return (
                    <tr key={car.id} className="border-b border-slate-200">
                      <td className="px-3 py-3">{car.brand.name} {car.model}</td>
                      <td className="px-3 py-3">{car.year}</td>
                      <td className="px-3 py-3">{car.license}</td>
                      <td className="px-3 py-3">{car.color}</td>
                      <td className="px-3 py-3">{car.vehicleType.name}</td>
                      <td className="px-3 py-3 text-right">{formatCompactNumber(toNumber(car.mileage))}</td>
                      <td className="px-3 py-3"><Badge className={getStatusBadgeClass(car.status)}>{getStatusLabel(car.status)}</Badge></td>
                      <td className='px-3 py-3 text-right'>
                        <div className="flex justify-end gap-2">
                          <Button asChild size={"sm"} variant="ghost">
                            <Link href={`/cars/${car.id}`}>
                              <Edit className="size-4" />
                            </Link>
                          </Button>
                          <Button asChild size={"sm"} variant="destructive">
                            <Link href={`/cars/${car.id}`}>
                              <Trash className="size-4 text-red-500" />
                            </Link>
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      <SpeedDialContainer />
    </div>
  )
}
