'use client'

import { X } from 'lucide-react'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import CreateCarForm from '@/components/CreateCarForm'

interface CarCreateDrawerProps {
  onClose: () => void
  vehicleTypes: any[]
  brands: any[]
}

export default function CarCreateDrawer({ onClose, vehicleTypes, brands }: CarCreateDrawerProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <>
      <Button
        type="button"
        aria-label="Close drawer"
        className="fixed inset-0 z-30 bg-slate-950/30 backdrop-blur-[2px]"
        onClick={onClose}
      />

      <aside className="fixed right-0 top-0 z-40 h-full w-full max-w-xl overflow-y-auto bg-white shadow-2xl shadow-slate-950/20">
        <Card className="h-full rounded-none border-0">
          <CardContent className="flex h-full flex-col p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-950">สร้างรถ</h2>
                <p className="mt-2 text-sm font-medium leading-6 text-slate-500">
                  กรอกข้อมูลรถใหม่เพื่อเพิ่มเข้าระบบ
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
                aria-label="Close"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-6 flex-1">
              <CreateCarForm onSuccess={onClose} vehicleTypes={vehicleTypes} brands={brands} />
            </div>
          </CardContent>
        </Card>
      </aside>
    </>
  )
}