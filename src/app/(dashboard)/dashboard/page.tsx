import React from 'react'
import prisma from '@/lib/prisma'
import Image from 'next/image'
import { Calendar, MapPin, DollarSign } from 'lucide-react'

export const dynamic = 'force-dynamic'

function statusColor(status?: string) {
  const s = (status || '').toLowerCase()
  if (s === 'available' || s === 'available_now' || s === 'available_today') return 'bg-green-100 text-green-700'
  if (s === 'maintenance' || s === 'maintained') return 'bg-yellow-100 text-yellow-700'
  if (s === 'booked' || s === 'reserved') return 'bg-red-100 text-red-700'
  return 'bg-slate-100 text-slate-700'
}

export default async function DashboardPage() {
  const cars = await prisma.car.findMany({ take: 24 })

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Fleet overview</h1>
        <p className="mt-1 text-sm text-slate-600">Browse available vehicles and quick metrics. Responsive, mobile-first layout.</p>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cars.map((car: any) => (
          <article key={car.car_id} className="bg-white shadow-md rounded-2xl overflow-hidden border">
            <div className="relative h-44 bg-slate-50">
              {car.image_url ? (
                // Image from external URL or storage
                // eslint-disable-next-line jsx-a11y/alt-text
                <Image src={car.image_url} alt={car.car_name || 'vehicle'} fill style={{ objectFit: 'cover' }} />
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400">No image</div>
              )}

              <span className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-medium ${statusColor(car.car_status)}`}>{car.car_status || 'Unknown'}</span>
            </div>

            <div className="p-4 sm:p-5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <h3 className="text-sm sm:text-base font-semibold text-slate-800 truncate">{car.car_name || 'Untitled'}</h3>
                  <div className="mt-1 text-xs text-slate-500">{car.brand || ''} • {car.vehicle_type || ''}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-500">Per day</div>
                  <div className="mt-1 text-lg font-bold text-slate-900">${Number(car.price_per_day || 0).toFixed(2)}</div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span>{car.car_year || '—'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-slate-400" />
                  <span>{car.car_mileage ? `${car.car_mileage} km` : '—'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-slate-400" />
                  <span className="text-slate-700 font-medium">${Number(car.price_per_day || 0).toFixed(0)}</span>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-3">
                <a href={`/cars/${car.car_id}`} className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium bg-sky-600 text-white hover:bg-sky-700 transition">View</a>
                <a href={`/bookings/new?car_id=${car.car_id}`} className="inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium border border-slate-200 text-slate-700 hover:bg-slate-50 transition">Book</a>
              </div>
            </div>
          </article>
        ))}
      </section>

      {cars.length === 0 && (
        <div className="mt-8 text-center text-slate-600">No vehicles found.</div>
      )}
    </div>
  )
}
