import React from 'react'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import CarGallery from '@/components/CarGallery'
import { Calendar, MapPin } from 'lucide-react'

export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params

  const car = await prisma.car.findUnique({ 
    where: { id, isDeleted: false },
    include: { brand: true }
  })
  if (!car) return { title: 'Vehicle not found' }
  return { title: `${car.brand.name} ${car.model} • Rent Car` }
}

export default async function CarDetailPage({ params }: PageProps) {
  const { id } = await params

  const car = await prisma.car.findUnique({ 
    where: { 
      id: id,
      isDeleted: false
    },
    include: {
      brand: true,
      vehicleType: true,
      images: {
        include: {
          image: true
        },
        // orderBy: { sequence: 'asc' } // ออกชั่วคราว
      }
    }
  })
  
  if (!car) return notFound()
    
  const images = car.images
  .sort((a: any, b: any) => (a.sequence || 0) - (b.sequence || 0))
  .map((carImg: any) => ({
    url: carImg.image.url,
    alt: `${car.brand.name} ${car.model}`
  }))

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Available': return 'bg-green-100 text-green-700 hover:bg-green-100'
      case 'Booked': return 'bg-blue-100 text-blue-700 hover:bg-blue-100'
      case 'Maintenance': return 'bg-yellow-100 text-yellow-700 hover:bg-yellow-100'
      default: return 'bg-slate-100 text-slate-700 hover:bg-slate-100'
    }
  }

  return (
    <div className="p-6">
      <div className="mb-4">
        <Link href="/cars" className="text-sm text-slate-600 hover:underline">← Back to vehicles</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* ส่ง Array ของรูปภาพที่ถูกจัดการโครงสร้างแล้วไปใช้งาน */}
          <CarGallery images={images} />

          <Card className="mt-6">
            <CardContent className="pt-6">
              <h2 className="text-lg font-semibold">Description</h2>
              <p className="mt-2 text-sm text-slate-700">{car.remark || 'No description provided.'}</p>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-slate-600">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500">Year</span>
                  <span className="font-medium">{car.year || '—'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500">Mileage</span>
                  <span className="font-medium">{car.mileage ? `${Number(car.mileage).toLocaleString()} km` : '—'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500">Vehicle Type</span>
                  <span className="font-medium">{car.vehicleType.name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-slate-500">Color</span>
                  <span className="font-medium">{car.color || '—'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <aside>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-xl font-bold">{car.brand.name} {car.model}</h1>
                  <div className="mt-1 text-sm text-slate-500">License: {car.license}</div>
                </div>
                <div className="text-right">
                  {/* หมายเหตุ: ใน Schema ของคุณไม่มี field ราคา (Price) บนโมเดล Car ตรงๆ 
                      สามารถใส่ fallback หรือเพิ่มฟิลด์ price ใน Car Model ภายหลังได้ */}
                  <div className="text-xs text-slate-500">Status</div>
                  <div className="text-md font-bold text-slate-900">{car.status}</div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <Badge className={`${getStatusBadgeClass(car.status)} text-sm font-normal`}>
                  {car.status}
                </Badge>
              </div>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <div>Year: {car.year || '—'}</div>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-600">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <div>{car.mileage ? `${Number(car.mileage).toLocaleString()} km` : '—'}</div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3">
                <a href={`/bookings/new?id=${car.id}`} className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700 text-sm font-medium">
                  Book now
                </a>
                <a href={`mailto:support@rentcar.example?subject=Inquiry%20about%20${encodeURIComponent(`${car.brand.name} ${car.model}`)}`} className="inline-flex items-center justify-center px-4 py-2 rounded-md border border-slate-200 text-slate-700 hover:bg-slate-50 text-sm font-medium">
                  Contact
                </a>
              </div>

              <div className="mt-4 text-xs text-slate-500">Vehicle ID: {car.id}</div>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  )
}
