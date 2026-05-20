import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '../auth/[...nextauth]/route'
import prisma from '../../../src/lib/prisma'

export async function GET(req: Request) {
  const session = await getServerSession(authOptions as any)
  if (!session?.user?.email) return NextResponse.json({ user: null, roles: [] })
  const user = await prisma.user.findUnique({ where: { email: session.user.email }, include: { roles: { include: { role: true } } } })
  const roles = (user?.roles ?? []).map((ur: any) => ur.role.name)
  return NextResponse.json({ user: { id: user?.id, email: user?.email, name: user?.name }, roles })
}
