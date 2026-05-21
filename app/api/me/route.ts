import { NextResponse } from 'next/server';
import { auth } from '../auth/[...nextauth]/route';
import prisma from '../../../src/lib/prisma';

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ user: null, roles: [] });
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { roles: { include: { role: true } } },
  });
  const roles = (user?.roles ?? []).map((ur: any) => ur.role.code);
  return NextResponse.json({
    user: user
      ? {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
        }
      : null,
    roles,
  });
}
