import Link from 'next/link'
import { Plus } from 'lucide-react'
import prisma from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { formatBaht, formatThaiDate, getStatusBadgeClass, getStatusLabel } from '@/lib/ui-format'

export const dynamic = 'force-dynamic'

export default async function BookingsPage() {
  const [bookings, totalBookings, activeBookings] = await Promise.all([
    prisma.booking.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
      take: 40,
      include: {
        user: true,
        car: { include: { brand: true } },
        payments: true,
      },
    }),
    prisma.booking.count({ where: { isDeleted: false } }),
    prisma.booking.count({
      where: { isDeleted: false, status: { in: ['Pending', 'Confirmed', 'InProgress'] } },
    }),
  ])

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-4xl font-extrabold tracking-normal text-slate-950">รายการเช่า</h1>
          <p className="mt-3 text-lg font-bold text-slate-500">ตรวจสอบรายการจองและสถานะการเช่ารถ</p>
        </div>
        <Button asChild>
          <Link href="/bookings/new">
            <Plus className="h-4 w-4" aria-hidden="true" />
            สร้างรายการเช่า
          </Link>
        </Button>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-bold text-slate-500">รายการทั้งหมด</div>
            <div className="mt-2 text-4xl font-extrabold text-slate-950">{totalBookings}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-bold text-slate-500">กำลังดำเนินการ</div>
            <div className="mt-2 text-4xl font-extrabold text-blue-700">{activeBookings}</div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardContent className="p-6 sm:p-8">
          <h2 className="text-2xl font-extrabold text-slate-950">รายการล่าสุด</h2>
          <div className="mt-7 overflow-x-auto">
            <table className="w-full min-w-[920px] text-left">
              <thead>
                <tr className="border-b border-slate-200 text-sm font-extrabold text-slate-950">
                  <th className="px-3 py-3">รหัส</th>
                  <th className="px-3 py-3">ลูกค้า</th>
                  <th className="px-3 py-3">รถ</th>
                  <th className="px-3 py-3">เริ่ม</th>
                  <th className="px-3 py-3">สิ้นสุด</th>
                  <th className="px-3 py-3 text-right">ยอดสุทธิ</th>
                  <th className="px-3 py-3">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => {
                  const customerName = `${booking.user.firstName} ${booking.user.lastName}`.trim()
                  const carName = `${booking.car.brand.name} ${booking.car.model} (${booking.car.license})`

                  return (
                    <tr
                      key={booking.id}
                      className="border-b border-slate-200 text-base font-semibold text-slate-900 last:border-0"
                    >
                      <td className="px-3 py-4">#{booking.id.slice(0, 8)}</td>
                      <td className="px-3 py-4">{customerName || booking.user.userName}</td>
                      <td className="px-3 py-4">{carName}</td>
                      <td className="px-3 py-4">{formatThaiDate(booking.dateStart)}</td>
                      <td className="px-3 py-4">{formatThaiDate(booking.dateEnd)}</td>
                      <td className="px-3 py-4 text-right">{formatBaht(booking.netAmount)}</td>
                      <td className="px-3 py-4">
                        <Badge className={getStatusBadgeClass(booking.status)}>
                          {getStatusLabel(booking.status)}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {bookings.length === 0 && (
            <div className="py-12 text-center text-sm font-semibold text-slate-500">
              ยังไม่มีรายการเช่าในระบบ
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
