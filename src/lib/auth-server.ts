import { getServerSession } from 'next-auth'
import { authOptions } from '../../app/api/auth/[...nextauth]/route'
import prisma from './prisma'

export async function getSessionAndRoles(req: any, res: any) {
  const session = await getServerSession(authOptions as any)
  if (!session?.user?.email) return { session: null, roles: [] }
  const user = await prisma.user.findUnique({ where: { email: session.user.email }, include: { roles: { include: { role: true } } } })
  const roles = (user?.roles ?? []).map((ur: any) => ur.role.name)
  return { session, roles }
}
