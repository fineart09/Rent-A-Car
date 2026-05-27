import React from 'react'
import prisma from '../../src/lib/prisma'
import Image from 'next/image'
import { Calendar, MapPin, DollarSign, Search } from 'lucide-react'
import { Card, CardHeader, CardContent, CardFooter } from '../../src/components/ui/card'
import { Badge } from '../../src/components/ui/badge'
import { Button } from '../../src/components/ui/button'

function statusColor(status?: string) {
  const s = (status || '').toLowerCase()
  if (s.includes('available')) return 'bg-green-100 text-green-700'
  if (s.includes('maintenance')) return 'bg-yellow-100 text-yellow-700'
  if (s.includes('book') || s.includes('reserved')) return 'bg-red-100 text-red-700'
  return 'bg-slate-100 text-slate-700'
}

export default async function CarsPage({ searchParams }: { searchParams?: Record<string, string | string[]> }) {
  const q = typeof searchParams?.q === 'string' ? searchParams.q.trim() : ''
  const status = typeof searchParams?.status === 'string' ? searchParams.status : ''
  const brand = typeof searchParams?.brand === 'string' ? searchParams.brand : ''
  const vehicle_type = typeof searchParams?.vehicle_type === 'string' ? searchParams.vehicle_type : ''
  const min_price = typeof searchParams?.min_price === 'string' && searchParams.min_price !== '' ? Number(searchParams.min_price) : undefined
  const max_price = typeof searchParams?.max_price === 'string' && searchParams.max_price !== '' ? Number(searchParams.max_price) : undefined
  const sort = typeof searchParams?.sort === 'string' ? searchParams.sort : 'price_asc'

  const where: any = {}

  if (q) {
    where.OR = [
      { car_name: { contains: q, mode: 'insensitive' } },
      { brand: { contains: q, mode: 'insensitive' } },
      { vehicle_type: { contains: q, mode: 'insensitive' } },
    ]
  }

  if (status) where.car_status = status
  if (brand) where.brand = brand
  if (vehicle_type) where.vehicle_type = vehicle_type

  if (min_price !== undefined || max_price !== undefined) {
    where.price_per_day = {}
    if (min_price !== undefined) where.price_per_day.gte = min_price
    if (max_price !== undefined) where.price_per_day.lte = max_price
  }

  const orderBy: any = {}
  if (sort === 'price_asc') orderBy.price_per_day = 'asc'
  else if (sort === 'price_desc') orderBy.price_per_day = 'desc'
  else if (sort === 'newest') orderBy.car_year = 'desc'

  const cars = await prisma.car.findMany({ where, orderBy: Object.keys(orderBy).length ? orderBy : undefined, take: 48 })

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Vehicles</h1>
        <p className="mt-1 text-sm text-slate-600">Filter, search and explore our fleet. Mobile-first, responsive and accessible.</p>
      </header>

      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <form method="get" action="/cars" className="flex-1 flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input name="q" defaultValue={q} placeholder="Search by model, brand or type" className="pl-10 pr-3 py-2 rounded-md border border-slate-200 w-full focus-visible:ring-2 focus-visible:ring-sky-400" />
          </div>

          <select name="status" defaultValue={status} className="hidden sm:inline-block rounded-md border border-slate-200 px-3 py-2">
            <option value="">All status</option>
            <option value="Available">Available</option>
            <option value="Maintenance">Maintenance</option>
            <option value="Booked">Booked</option>
          </select>

          <select name="sort" defaultValue={sort} className="rounded-md border border-slate-200 px-3 py-2">
            <option value="price_asc">Price: Low to high</option>
            <option value="price_desc">Price: High to low</option>
            <option value="newest">Newest</option>
          </select>

          <button type="submit" className="ml-2 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700">Search</button>
        </form>

        <div className="flex items-center gap-2">
          <form method="get" action="/cars" className="flex items-center gap-2">
            <input type="hidden" name="q" value={q} />
            <input type="number" name="min_price" placeholder="Min" defaultValue={min_price ?? ''} className="w-24 px-3 py-2 rounded-md border border-slate-200 focus-visible:ring-2 focus-visible:ring-sky-400" />
            <input type="number" name="max_price" placeholder="Max" defaultValue={max_price ?? ''} className="w-24 px-3 py-2 rounded-md border border-slate-200 focus-visible:ring-2 focus-visible:ring-sky-400" />
            <input type="text" name="brand" placeholder="Brand" defaultValue={brand} className="w-32 px-3 py-2 rounded-md border border-slate-200" />
            <input type="text" name="vehicle_type" placeholder="Type" defaultValue={vehicle_type} className="w-32 px-3 py-2 rounded-md border border-slate-200" />
            <button type="submit" className="ml-2 px-3 py-2 rounded-md bg-slate-100">Apply</button>
          </form>
        </div>
      </div>

      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {cars.map((car: any) => (
          <Card key={car.car_id} className="overflow-hidden">
            <CardHeader className="p-0">
              <div className="relative h-44 bg-slate-50">
                {car.image_url ? (
                  // eslint-disable-next-line jsx-a11y/alt-text
                  <Image src={car.image_url} alt={car.car_name || 'vehicle'} fill style={{ objectFit: 'cover' }} />
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400">No image</div>
                )}

                <div className="absolute top-3 left-3">
                  <Badge className={`${statusColor(car.car_status)} text-xs`}>{car.car_status || 'Unknown'}</Badge>
                </div>
              </div>
            </CardHeader>

            <CardContent>
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

              <div className="mt-4 grid grid-cols-3 gap-3 text-xs text-slate-500">
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

              <div className="mt-4 text-sm text-slate-600">{car.description ? car.description.substring(0, 120) + (car.description.length > 120 ? '…' : '') : null}</div>
            </CardContent>

            <CardFooter className="flex items-center gap-3">
              <Button asChild>
                <a href={`/cars/${car.car_id}`} className="inline-flex items-center">Details</a>
              </Button>
              <Button variant="outline" asChild>
                <a href={`/bookings/new?car_id=${car.car_id}`} className="inline-flex items-center">Book</a>
              </Button>
              <div className="ml-auto text-xs text-slate-500">ID: {car.car_id}</div>
            </CardFooter>
          </Card>
        ))}
      </section>

      {cars.length === 0 && (
        <div className="mt-8 text-center text-slate-600">No vehicles found with the current filters.</div>
      )}
    </div>
  )
}
