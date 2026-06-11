import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, Calendar, Car, Gauge, Save, Tag, Book, Wrench } from 'lucide-react'
import prisma from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import CarGallery from '@/components/CarGallery'
import { 
  // formatCompactNumber, 
  getStatusBadgeClass, 
  getStatusLabel, 
  // toNumber 
} from '@/lib/ui-format'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

const carStatuses = [
  { value: 'Available', label: 'พร้อมให้เช่า' },
  { value: 'Booked', label: 'จองแล้ว' },
  { value: 'Maintenance', label: 'บำรุงรักษา' },
  { value: 'Unavailable', label: 'ไม่พร้อมใช้' },
  { value: 'Reserved', label: 'จองสำรอง' },
]

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
          <Button asChild>
            <Link href={`/booking/new?id=${car.id}`}>
              <Book className="h-4 w-4" aria-hidden="true" />
              จองรถคันนี้
            </Link>
          </Button>
          <Button variant="save" >
            <Save className="h-4 w-4" aria-hidden="true" />
            บันทึกข้อมูลรถ
          </Button>
        </div>
      </header>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-6">
          <CarGallery images={images} />

          <Card>
            <CardContent className="p-6 sm:p-8">
              <h2 className="text-2xl font-extrabold text-slate-950">รายละเอียดการบำรุงรักษา</h2>
              
              <div className="mt-4 rounded-lg bg-slate-50 text-sm font-medium text-slate-500 overflow-auto">
                <table className="mt-6 w-full table-fixed border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 text-left text-sm font-extrabold text-slate-950">
                      <th className="w-1/3 px-3 py-3">วันที่</th>
                      <th className="w-1/3 px-3 py-3">ประเภทการบำรุงรักษา</th>
                      <th className="w-1/3 px-3 py-3">รายละเอียด</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* ตัวอย่างข้อมูลการบำรุงรักษา */}
                    <tr className="border-b border-slate-200">
                      <td className="px-3 py-3"><Calendar className="h-4 w-4 inline-block mr-1" aria-hidden="true" /> 2024-05-01</td>
                      <td className="px-3 py-3"><Tag className="h-4 w-4 inline-block mr-1" aria-hidden="true" /> เปลี่ยนถ่ายน้ำมันเครื่อง</td>
                      <td className="px-3 py-3"><Gauge className="h-4 w-4 inline-block mr-1" aria-hidden="true" /> เปลี่ยนกรองอากาศ, ตรวจเช็คระบบเบรก</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="px-3 py-3"><Calendar className="h-4 w-4 inline-block mr-1" aria-hidden="true" /> 2024-03-15</td>
                      <td className="px-3 py-3"><Tag className="h-4 w-4 inline-block mr-1" aria-hidden="true" /> ตรวจเช็คสภาพรถ</td>
                      <td className="px-3 py-3"><Gauge className="h-4 w-4 inline-block mr-1" aria-hidden="true" /> ตรวจเช็คระบบไฟ, ตรวจเช็คยาง</td>
                    </tr>
                    <tr className="border-b border-slate-200">
                      <td className="px-3 py-3"><Calendar className="h-4 w-4 inline-block mr-1" aria-hidden="true" /> 2024-01-10</td>
                      <td className="px-3 py-3"><Tag className="h-4 w-4 inline-block mr-1" aria-hidden="true" /> ซ่อมแซม</td>
                      <td className="px-3 py-3"><Wrench className="h-4 w-4 inline-block mr-1" aria-hidden="true" /> ซ่อมแซมระบบแอร์, เปลี่ยนแบตเตอรี่</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <aside className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <h2 className="mt-5 text-2xl font-extrabold text-slate-950">ข้อมูลรถ</h2>

              <dl className="mt-6 space-y-4 text-sm">
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <dt className="font-bold text-slate-500">ประเภทรถ <span className="text-red-600">*</span></dt>
                  <dd className="font-extrabold text-slate-950">
                    <select defaultValue={car.vehicleTypeId} className="w-full min-[200px]:w-50 rounded-lg border border-slate-300 px-3 py-2 text-sm">
                      <option value="">-- เลือกประเภทรถ --</option>
                      <option value={car.vehicleType.id}>{car.vehicleType.name}</option>
                    </select>
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <dt className="font-bold text-slate-500">แบรนด์รถ <span className="text-red-600">*</span></dt>
                  <dd className="font-extrabold text-slate-950">
                    <select defaultValue={car.brandId} className="w-full min-[200px]:w-50 rounded-lg border border-slate-300 px-3 py-2 text-sm">
                      <option value="">-- เลือกแบรนด์ --</option>
                      <option value={car.brand.id}>{car.brand.name}</option>
                    </select>
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <dt className="font-bold text-slate-500">รุ่น</dt>
                  <dd className="font-extrabold text-slate-950">
                    <Input defaultValue={car.model} className="w-full min-[200px]:w-50 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <dt className="font-bold text-slate-500">ปีที่ผลิต <span className="text-red-600">*</span></dt>
                  <dd className="font-extrabold text-slate-950">
                    <Input defaultValue={car.year} className="w-full min-[200px]:w-50 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <dt className="font-bold text-slate-500">สีรถ</dt>
                  <dd className="font-extrabold text-slate-950">
                    <Input defaultValue={car.color} className="w-full min-[200px]:w-50 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <dt className="font-bold text-slate-500">ทะเบียน <span className="text-red-600">*</span></dt>
                  <dd className="font-extrabold text-slate-950">
                    <Input defaultValue={car.license} className="w-full min-[200px]:w-50 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <dt className="font-bold text-slate-500">เลขไมล์</dt>
                  <dd className="font-extrabold text-slate-950">
                    <Input type='number' defaultValue={car.mileage} className="w-full min-[200px]:w-50 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                  <dt className="font-bold text-slate-500">สถานะ</dt>
                  <dd className="font-extrabold text-slate-950">
                    <select defaultValue={car.status} className="w-full min-[200px]:w-50 rounded-lg border border-slate-300 px-3 py-2 text-sm">
                      {carStatuses.map((status) => (
                        <option key={status.value} value={status.value}>
                          {status.label}
                        </option>
                      ))}
                    </select>
                  </dd>
                </div>
                <div className="flex items-center justify-between gap-4 pb-4">
                  <dt className="font-bold text-slate-500">หมายเหตุ</dt>
                  <dd className="font-extrabold text-slate-950">
                    <Textarea defaultValue={car.remark} className="w-full min-[200px]:w-50 rounded-lg border border-slate-300 px-3 py-2 text-sm resize-none" rows={3} />
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
