import { BookingStatus } from '@prisma/client'
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

const availabilitySchema = z
  .object({
    car_id: z.string().trim().optional(),
    id: z.string().trim().optional(),
    date_start: z.string().trim().min(1),
    date_end: z.string().trim().min(1),
  })
  .refine((data) => Boolean(data.car_id || data.id), {
    message: 'car_id or id is required',
    path: ['car_id'],
  })

const ACTIVE_STATUSES: BookingStatus[] = [
  BookingStatus.Pending,
  BookingStatus.Confirmed,
  BookingStatus.InProgress,
]

function buildError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status })
}

function parseDateOnly(value: string, boundary: 'start' | 'end') {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T${boundary === 'start' ? '00:00:00.000' : '23:59:59.999'}Z`)
  }

  return new Date(value)
}

async function handle(payload: unknown) {
  const parsed = availabilitySchema.safeParse(payload)
  if (!parsed.success) return buildError('Invalid request payload')

  const { car_id, id, date_start, date_end } = parsed.data
  const carId = car_id ?? id

  const start = parseDateOnly(date_start, 'start')
  const end = parseDateOnly(date_end, 'end')
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return buildError('Invalid date')
  }

  if (end < start) {
    return buildError('End date must be after or equal to start date')
  }

  const conflicts = await prisma.booking.findMany({
    where: {
      carId,
      isDeleted: false,
      status: { in: ACTIVE_STATUSES },
      dateStart: { lte: end },
      dateEnd: { gte: start },
    },
    orderBy: { dateStart: 'asc' },
    select: {
      id: true,
      dateStart: true,
      dateEnd: true,
      status: true,
      car: {
        select: {
          id: true,
          license: true,
          model: true,
          brand: { select: { name: true } },
        },
      },
    },
  })

  return NextResponse.json({
    available: conflicts.length === 0,
    conflicts: conflicts.map((booking) => ({
      id: booking.id,
      dateStart: booking.dateStart.toISOString(),
      dateEnd: booking.dateEnd.toISOString(),
      status: booking.status,
      car: {
        id: booking.car.id,
        name: `${booking.car.brand.name} ${booking.car.model}`,
        license: booking.car.license,
      },
    })),
  })
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })

  try {
    return handle(await req.json())
  } catch {
    return buildError('Invalid JSON payload')
  }
}

export async function GET(req: Request) {
  const session = await auth()
  if (!session?.user) return NextResponse.json({ error: 'Unauthenticated' }, { status: 401 })

  const url = new URL(req.url)
  return handle(Object.fromEntries(url.searchParams.entries()))
}
