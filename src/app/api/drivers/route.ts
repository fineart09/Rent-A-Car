import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import prisma from '@/lib/prisma'

async function getUserId() {
  const session = await auth()
  if (!session?.user?.email) return null
  const user = await prisma.user.findUnique({ where: { email: session.user.email }, select: { id: true, roles: { select: { role: { select: { code: true } } } } } })
  const roles = (user?.roles ?? []).map((entry) => entry.role.code)
  if (!user?.id || !roles.some((role) => ['ADMIN', 'MANAGER', 'AGENT'].includes(role))) return null
  return user.id
}

function normalize(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function mapDriver(driver: {
  id: string
  fullName: string
  phone: string
  remark: string | null
  cardImageId: string | null
  licenseImageId: string | null
  cardImage?: { id: string; url: string; name: string } | null
  licenseImage?: { id: string; url: string; name: string } | null
}) {
  return {
    id: driver.id,
    driver_full_name: driver.fullName,
    driver_phone: driver.phone,
    driver_remark: driver.remark ?? '',
    driver_card_images_id: driver.cardImageId ?? '',
    driver_license_images_id: driver.licenseImageId ?? '',
    cardImage: driver.cardImage ?? null,
    licenseImage: driver.licenseImage ?? null,
  }
}

export async function POST(request: Request) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const fullName = normalize(body.driver_full_name)
  const phone = normalize(body.driver_phone)
  const remark = normalize(body.driver_remark)
  const cardImageId = normalize(body.driver_card_images_id) || null
  const licenseImageId = normalize(body.driver_license_images_id) || null

  if (!fullName) return NextResponse.json({ error: 'driver_full_name is required' }, { status: 400 })
  if (!phone) return NextResponse.json({ error: 'driver_phone is required' }, { status: 400 })

  const driver = await prisma.driver.create({
    data: {
      fullName,
      phone,
      remark: remark || null,
      cardImageId,
      licenseImageId,
      createdBy: userId,
      updatedBy: userId,
    },
    include: {
      cardImage: { select: { id: true, url: true, name: true } },
      licenseImage: { select: { id: true, url: true, name: true } },
    },
  })

  return NextResponse.json({ driver: mapDriver(driver) })
}

export async function PATCH(request: Request) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const id = normalize(body.id)
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  const driver = await prisma.driver.update({
    where: { id },
    data: {
      fullName: normalize(body.driver_full_name),
      phone: normalize(body.driver_phone),
      remark: normalize(body.driver_remark) || null,
      cardImageId: normalize(body.driver_card_images_id) || null,
      licenseImageId: normalize(body.driver_license_images_id) || null,
      updatedBy: userId,
    },
    include: {
      cardImage: { select: { id: true, url: true, name: true } },
      licenseImage: { select: { id: true, url: true, name: true } },
    },
  })

  return NextResponse.json({ driver: mapDriver(driver) })
}

export async function DELETE(request: Request) {
  const userId = await getUserId()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => ({}))
  const id = normalize(body.id)
  if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 })

  await prisma.driver.update({
    where: { id },
    data: {
      isDeleted: true,
      updatedBy: userId,
    },
  })

  return NextResponse.json({ ok: true })
}
