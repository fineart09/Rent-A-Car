import Link from 'next/link'
import { ArrowLeft, Wrench } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default function CarMaintenancePage() {
  return (
    <div className="space-y-8">
      <header>
        <Link
          href="/cars"
          className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition hover:text-blue-700"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          กลับไปหน้ารถ
        </Link>
        <h1 className="mt-5 text-4xl font-extrabold text-slate-950">บำรุงรักษารถ</h1>
        <p className="mt-3 text-lg font-bold text-slate-500">หน้ารองสำหรับงานซ่อม ภาษี และประกันตาม speed dial</p>
      </header>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <Wrench className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-950">โครงหน้าเริ่มต้น</h2>
              <p className="mt-2 max-w-2xl text-sm font-medium leading-6 text-slate-500">
                หน้านี้เตรียมไว้สำหรับเพิ่มรายการบำรุงรักษาและเตือนงานตามระยะในรอบถัดไป
              </p>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-5 text-sm font-semibold text-slate-500">
            ยังไม่ใส่รายละเอียด CRUD เต็มรูปแบบ
          </div>

          <div className="mt-6">
            <Button asChild>
              <Link href="/cars">กลับไปหน้าจัดการรถ</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
