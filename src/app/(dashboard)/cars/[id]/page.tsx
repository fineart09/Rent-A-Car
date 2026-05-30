import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, Car, Gauge, Mail, Palette, Tag } from 'lucide-react'
import prisma from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import CarGallery from '@/components/CarGallery'
import { formatCompactNumber, getStatusBadgeClass, getStatusLabel, toNumber } from '@/lib/ui-format'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params

  const car = await prisma.car.findUnique({
    where: { id, isDeleted: false },
    include: { brand: true },
  })

  if (!car) return { title: 'Vehicle not found' }
  return { title: `${car.brand.name} ${car.model} | RentCar Admin` }
}

export default async function CarDetailPage({ params }: PageProps) {
  const { id } = await params

  const car = await prisma.car.findUnique({
    where: {
      id,
      isDeleted: false,
    },
    include: {
      brand: true,
      vehicleType: true,
      images: {
        include: {
          image: true,
        },
        orderBy: { number: 'asc' },
      },
    },
  })

  if (!car) return notFound()

  const images = car.images.map((carImage) => ({
    url: carImage.image.url,
    alt: `${car.brand.name} ${car.model}`,
  }))

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-blue-700"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            กลับไปหน้าจัดการรถ
          </Link>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <h1 className="text-4xl font-extrabold tracking-normal text-slate-950">
              {car.brand.name} {car.model}
            </h1>
            <Badge className={getStatusBadgeClass(car.status)}>{getStatusLabel(car.status)}</Badge>
          </div>
          <p className="mt-3 text-lg font-bold text-slate-500">ทะเบียน {car.license}</p>
        </div>

        <div className="flex gap-3">
          <Button asChild variant="outline">
            <a
              href={`mailto:support@rentcar.example?subject=Inquiry%20about%20${encodeURIComponent(
                `${car.brand.name} ${car.model}`
              )}`}
            >
              <Mail className="h-4 w-4" aria-hidden="true" />
              ติดต่อ
            </a>
          </Button>
          <Button asChild>
            <Link href={`/bookings/new?id=${car.id}`}>จองรถ</Link>
          </Button>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <CarGallery images={images} />

          <Card>
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-2xl font-extrabold text-slate-950">รายละเอียดรถ</h2>
              <p className="mt-3 text-sm font-medium leading-7 text-slate-600">
                {car.remark || 'ยังไม่มีรายละเอียดเพิ่มเติมสำหรับรถคันนี้'}
              </p>

              <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <Calendar className="h-5 w-5 text-blue-700" aria-hidden="true" />
                  <div className="mt-3 text-xs font-bold text-slate-500">ปีรถ</div>
                  <div className="mt-1 text-lg font-extrabold text-slate-950">{car.year || '-'}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <Gauge className="h-5 w-5 text-blue-700" aria-hidden="true" />
                  <div className="mt-3 text-xs font-bold text-slate-500">เลขไมล์</div>
                  <div className="mt-1 text-lg font-extrabold text-slate-950">
                    {formatCompactNumber(toNumber(car.mileage))} km
                  </div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <Tag className="h-5 w-5 text-blue-700" aria-hidden="true" />
                  <div className="mt-3 text-xs font-bold text-slate-500">ประเภทรถ</div>
                  <div className="mt-1 text-lg font-extrabold text-slate-950">{car.vehicleType.name}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <Palette className="h-5 w-5 text-blue-700" aria-hidden="true" />
                  <div className="mt-3 text-xs font-bold text-slate-500">สี</div>
                  <div className="mt-1 text-lg font-extrabold text-slate-950">{car.color || '-'}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                <Car className="h-7 w-7" aria-hidden="true" />
              </div>

              <h2 className="mt-5 text-2xl font-extrabold text-slate-950">ข้อมูลสรุป</h2>

              <dl className="mt-6 space-y-4 text-sm">
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <dt className="font-bold text-slate-500">แบรนด์</dt>
                  <dd className="font-extrabold text-slate-950">{car.brand.name}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <dt className="font-bold text-slate-500">รุ่น</dt>
                  <dd className="font-extrabold text-slate-950">{car.model}</dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <dt className="font-bold text-slate-500">ทะเบียน</dt>
                  <dd className="font-extrabold text-slate-950">{car.license}</dd>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <dt className="font-bold text-slate-500">สถานะ</dt>
                  <dd>
                    <Badge className={getStatusBadgeClass(car.status)}>{getStatusLabel(car.status)}</Badge>
                  </dd>
                </div>
              </dl>

              <div className="mt-7 grid gap-3">
                <Button asChild>
                  <Link href={`/bookings/new?id=${car.id}`}>สร้างรายการเช่า</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/cars">ดูรถทั้งหมด</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4 text-xs font-bold text-slate-400 shadow-sm shadow-slate-200/60">
            Vehicle ID: {car.id}
          </div>
        </aside>
      </div>
    </div>
  )
}
