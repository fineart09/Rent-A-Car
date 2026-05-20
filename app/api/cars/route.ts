import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import prisma from '../../../src/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions as any)
  if (!session?.user?.email) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 })

  const user = await prisma.user.findUnique({ where: { email: session.user.email }, include: { roles: { include: { role: true } } } })
  const roles = (user?.roles ?? []).map((ur: any) => ur.role.name)
  const allowed = ['ADMIN', 'MANAGER', 'AGENT']
  if (!roles.some((r) => allowed.includes(r))) return NextResponse.json({ message: 'Forbidden' }, { status: 403 })

  const cars = await prisma.car.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(cars)
}
