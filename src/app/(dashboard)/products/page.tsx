import Link from 'next/link'
import prisma from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatBaht, formatThaiDate } from '@/lib/ui-format'

export const dynamic = 'force-dynamic'

export default async function ProductsPage() {
  const [products, totalProducts, activeProducts] = await Promise.all([
    prisma.product.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
      take: 20,
    }),
    prisma.product.count({ where: { isDeleted: false } }),
    prisma.product.count({ where: { isDeleted: false, isActive: true } }),
  ])

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3">
        <h1 className="text-4xl font-extrabold tracking-normal text-slate-950">ข้อมูลบริการ/โปรโมชั่น</h1>
        <p className="text-lg font-bold text-slate-500">หน้ารองสำหรับรายการบริการและโปรโมชั่นตาม CSV</p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-bold text-slate-500">รายการทั้งหมด</div>
            <div className="mt-2 text-4xl font-extrabold text-slate-950">{totalProducts}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-bold text-slate-500">เปิดใช้งาน</div>
            <div className="mt-2 text-4xl font-extrabold text-blue-700">{activeProducts}</div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardContent className="p-6 sm:p-8">
          <h2 className="text-2xl font-extrabold text-slate-950">รายการล่าสุด</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="w-full min-w-[860px] text-left">
              <thead>
                <tr className="border-b border-slate-200 text-sm font-extrabold text-slate-950">
                  <th className="px-3 py-3">ชื่อ</th>
                  <th className="px-3 py-3">ราคา/วัน</th>
                  <th className="px-3 py-3">วันที่เริ่ม</th>
                  <th className="px-3 py-3">วันที่สิ้นสุด</th>
                  <th className="px-3 py-3">สถานะ</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id} className="border-b border-slate-200 text-base font-semibold text-slate-900">
                    <td className="px-3 py-4">{product.name}</td>
                    <td className="px-3 py-4">{formatBaht(product.price)}</td>
                    <td className="px-3 py-4">{formatThaiDate(product.dateStart)}</td>
                    <td className="px-3 py-4">{formatThaiDate(product.dateEnd)}</td>
                    <td className="px-3 py-4">{product.isActive ? 'Active' : 'Inactive'}</td>
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
