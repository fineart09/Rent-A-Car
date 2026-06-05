"use client"

import { useState } from 'react'
import type { ComponentType } from 'react'
import Link from 'next/link'
import { BadgePlus, Car, Plus, Shapes, Wrench, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type SpeedDialItem = {
  title: string
  description: string 
  href: string
  icon: ComponentType<{ className?: string }>
}

const items: SpeedDialItem[] = [
  { 
    title: 'สร้างรถ', 
    description: '', 
    href: '/cars/new', 
    icon: Car 
  },
  { 
    title: 'สร้างแบรนด์รถ', 
    description: '', 
    href: '/cars/brands/new', 
    icon: BadgePlus 
  },
  {
    title: 'สร้างประเภทรถ',
    description: '',
    href: '/cars/vehicle-types/new',
    icon: Shapes,
  },
  {
    title: 'สร้างการบำรุงรักษา',
    description: '',
    href: '/cars/maintenance/new',
    icon: Wrench,
  },
]

export default function CarSpeedDial() {
  const [open, setOpen] = useState(false)
  const [activeItem, setActiveItem] = useState<SpeedDialItem | null>(null)

  const closeAll = () => {
    setActiveItem(null)
    setOpen(false)
  }

  return (
    <>
      {open && !activeItem && (
        <button
          type="button"
          aria-label="Close speed dial"
          className="fixed inset-0 z-30 bg-transparent"
          onClick={closeAll}
        />
      )}

      <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
        {open && (
          <div className="flex flex-col items-end gap-3">
            {items.map((item) => {
              const Icon = item.icon
              const active = activeItem?.href === item.href

              return (
                <button
                  key={item.href}
                  type="button"
                  onClick={() => setActiveItem(item)}
                  className={cn(
                    'group flex items-center gap-4 rounded-2xl border bg-white px-4 py-3 text-left shadow-lg shadow-slate-950/10 transition-all duration-200',
                    'min-w-[190px] max-w-[220px]',
                    active
                      ? 'border-violet-300 bg-violet-50 ring-2 ring-violet-300'
                      : 'border-slate-200 hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50/50'
                  )}
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 shadow-sm transition group-hover:bg-white group-hover:text-violet-700">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate text-sm font-bold text-slate-900">{item.title}</div>
                    <div className="truncate text-xs font-medium text-slate-500">{item.description}</div>
                  </div>
                </button>
              )
            })}
          </div>
        )}

        <Button
          type="button"
          size="lg"
          onClick={() => setOpen((value) => !value)}
          className={cn(
            'h-14 w-14 rounded-xl border-2 border-violet-200 bg-violet-600 shadow-2xl shadow-violet-900/25',
            'hover:bg-violet-700'
          )}
        >
          <Plus className="h-7 w-7" aria-hidden="true" />
        </Button>
      </div>

      {activeItem && (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            aria-label="Close drawer"
            className="absolute inset-0 bg-slate-950/30 backdrop-blur-[2px]"
            onClick={closeAll}
          />

          <aside className="absolute right-0 top-0 h-full w-full max-w-1/2 bg-white shadow-2xl shadow-slate-950/20">
            <Card className="h-full rounded-none border-0">
              <CardContent className="flex h-full flex-col p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="mt-2 text-2xl font-extrabold text-slate-950">{activeItem.title}</h2>
                    <p className="mt-2 text-sm font-medium leading-6 text-slate-500">{activeItem.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={closeAll}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                  >
                    <X className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-6 rounded-3xl bg-gradient-to-br from-violet-50 via-white to-slate-50 p-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                      <activeItem.icon className="h-6 w-6 text-violet-700" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-500">Table</div>
                      <div className="text-base font-extrabold text-slate-950">{activeItem.description}</div>
                    </div>
                  </div>

                  <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-white p-4 text-sm font-medium leading-6 text-slate-500">
                    หน้านี้เป็นโครงสำหรับเริ่มสร้างข้อมูลตามเมนูที่เลือก สามารถต่อยอดเป็นฟอร์มจริงได้ในรอบถัดไป
                  </div>

                  <div className="mt-6 flex gap-3">
                    <Button asChild className="flex-1">
                      <Link href={activeItem.href}>เปิดหน้า</Link>
                    </Button>
                    <Button type="button" variant="outline" onClick={closeAll}>
                      ปิด
                    </Button>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-600">
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">1. เมนูนี้จะใช้สำหรับสร้างข้อมูลใหม่</div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">2. เดี๋ยวค่อยต่อฟอร์มจริงทีละรายการ</div>
                  <div className="rounded-2xl bg-slate-50 px-4 py-3">3. ตอนนี้มีแค่โครงหน้าพร้อมลิงก์</div>
                </div>
              </CardContent>
            </Card>
          </aside>
        </div>
      )}
    </>
  )
}
