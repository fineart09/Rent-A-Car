import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export const dynamic = 'force-dynamic'

export default async function DriverPage() {
  const [drivers, totalDrivers] = await Promise.all([
    prisma.driver.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        cardImage: true,
        licenseImage: true,
      },
    }),
    prisma.driver.count({ where: { isDeleted: false } }),
  ])

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-extrabold tracking-normal text-slate-950">ข้อมูลลูกค้า</h1>
        <p className="text-lg font-bold text-slate-500">หน้ารองสำหรับข้อมูลลูกค้า/ผู้ขับตามโครงสร้างเมนูใน CSV</p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-bold text-slate-500">รายการทั้งหมด</div>
            <div className="mt-2 text-4xl font-extrabold text-slate-950">{totalDrivers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-bold text-slate-500">สถานะหน้า</div>
            <div className="mt-2 text-4xl font-extrabold text-blue-700">Draft</div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardContent className="p-6 sm:p-8">
          <h2 className="text-2xl font-extrabold text-slate-950">รายการล่าสุด</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-190 text-left">
              <thead>
                <tr className="border-b border-slate-200 text-sm font-extrabold text-slate-950">
                  <th className="px-3 py-3">ชื่อ</th>
                  <th className="px-3 py-3">โทรศัพท์</th>
                  <th className="px-3 py-3">บัตรประชาชน</th>
                  <th className="px-3 py-3">ใบขับขี่</th>
                </tr>
              </thead>
              <tbody>
                {drivers.map((driver) => (
                  <tr key={driver.id} className="border-b border-slate-200 text-base font-semibold text-slate-900">
                    <td className="px-3 py-4">{driver.fullName}</td>
                    <td className="px-3 py-4">{driver.phone}</td>
                    <td className="px-3 py-4">{driver.cardImage ? 'มี' : 'ไม่มี'}</td>
                    <td className="px-3 py-4">{driver.licenseImage ? 'มี' : 'ไม่มี'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex gap-3">
            <Button asChild>
              <Link href="/cars">กลับไปหน้ารถ</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
