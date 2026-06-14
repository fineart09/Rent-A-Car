import prisma from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatCompactNumber, formatThaiDate, getStatusBadgeClass, getStatusLabel } from '@/lib/ui-format'

export const dynamic = 'force-dynamic'

export default async function MaintenancePage() {
  const [maintenances, totalMaintenances, activeMaintenances] = await Promise.all([
    prisma.maintenance.findMany({
      where: { isDeleted: false },
      orderBy: { dateStart: 'desc' },
      take: 40,
      include: {
        car: { include: { brand: true } },
      },
    }),
    prisma.maintenance.count({ where: { isDeleted: false } }),
    prisma.maintenance.count({ where: { isDeleted: false, status: 'Active' } }),
  ])

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-extrabold tracking-normal text-slate-950">บำรุงรักษา</h1>
        <p className="mt-3 text-lg font-bold text-slate-500">ติดตามงานซ่อม ภาษี ประกัน และกำหนดแจ้งเตือนของรถ</p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-bold text-slate-500">รายการทั้งหมด</div>
            <div className="mt-2 text-4xl font-extrabold text-slate-950">{totalMaintenances}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-bold text-slate-500">กำลังดำเนินการ</div>
            <div className="mt-2 text-4xl font-extrabold text-blue-700">{activeMaintenances}</div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardContent className="p-6 sm:p-8">
          <h2 className="text-2xl font-extrabold text-slate-950">รายการล่าสุด</h2>
          <div className="mt-7 overflow-x-auto">
            <table className="w-full min-w-230 text-left">
              <thead>
                <tr className="border-b border-slate-200 text-sm font-extrabold text-slate-950">
                  <th className="px-3 py-3">งาน</th>
                  <th className="px-3 py-3">รถ</th>
                  <th className="px-3 py-3">ประเภท</th>
                  <th className="px-3 py-3">เริ่ม</th>
                  <th className="px-3 py-3">สิ้นสุด</th>
                  <th className="px-3 py-3 text-right">เลขไมล์เป้าหมาย</th>
                  <th className="px-3 py-3">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {maintenances.map((maintenance) => {
                  const carName = `${maintenance.car.brand.name} ${maintenance.car.model} (${maintenance.car.license})`

                  return (
                    <tr
                      key={maintenance.id}
                      className="border-b border-slate-200 text-base font-semibold text-slate-900 last:border-0"
                    >
                      <td className="px-3 py-4">{maintenance.name}</td>
                      <td className="px-3 py-4">{carName}</td>
                      <td className="px-3 py-4">{maintenance.type}</td>
                      <td className="px-3 py-4">{formatThaiDate(maintenance.dateStart)}</td>
                      <td className="px-3 py-4">{formatThaiDate(maintenance.dateEnd)}</td>
                      <td className="px-3 py-4 text-right">
                        {formatCompactNumber(maintenance.mileageTarget)} km
                      </td>
                      <td className="px-3 py-4">
                        <Badge className={getStatusBadgeClass(maintenance.status)}>
                          {getStatusLabel(maintenance.status)}
                        </Badge>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {maintenances.length === 0 && (
            <div className="py-12 text-center text-sm font-semibold text-slate-500">
              ยังไม่มีรายการบำรุงรักษาในระบบ
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
