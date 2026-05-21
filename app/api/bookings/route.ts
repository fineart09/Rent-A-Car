import { NextResponse } from 'next/server';
import { auth } from '../auth/[...nextauth]/route';
import prisma from '../../../src/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user?.email) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { roles: { include: { role: true } } },
  });
  const roles = (user?.roles ?? []).map((ur: any) => ur.role.code);
  const allowed = ['ADMIN', 'MANAGER', 'AGENT'];
  if (!roles.some((r) => allowed.includes(r)))
    return NextResponse.json({ message: 'Forbidden' }, { status: 403 });

  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: 'desc' },
    include: { car: true, user: true, payments: true },
  });
  return NextResponse.json(bookings);
}
