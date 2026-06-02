'use client'

import { useMemo, useState } from 'react'
import { AlertTriangle, CalendarCheck, Calculator, CheckCircle2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import Select from '@/components/ui/select'
import { formatBaht, formatThaiDate, getStatusBadgeClass, getStatusLabel } from '@/lib/ui-format'

export type BookingCarOption = {
  id: string
  name: string
  license: string
  status: string
  vehicleType: string
  year: string
  color: string
}

export type BookingProductOption = {
  id: string
  name: string
  price: number
  dateCount: number
  dateStart: string
  dateEnd: string
}

type AvailabilityConflict = {
  id: string
  dateStart: string
  dateEnd: string
  status: string
  car?: {
    name: string
    license: string
  }
}

type AvailabilityState =
  | { type: 'idle' }
  | { type: 'available' }
  | { type: 'conflict'; conflicts: AvailabilityConflict[] }
  | { type: 'error'; message: string }

type NewBookingFormProps = {
  cars: BookingCarOption[]
  products: BookingProductOption[]
  prefillCarId?: string
}

function getDateCount(dateStart: string, dateEnd: string) {
  if (!dateStart || !dateEnd) return 0

  const start = new Date(`${dateStart}T00:00:00`)
  const end = new Date(`${dateEnd}T00:00:00`)
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return 0

  const diff = Math.floor((end.getTime() - start.getTime()) / 86_400_000) + 1
  return Math.max(diff, 0)
}

export default function NewBookingForm({
  cars,
  products,
  prefillCarId = '',
}: NewBookingFormProps) {
  const [carId, setCarId] = useState(prefillCarId)
  const [productId, setProductId] = useState(products[0]?.id ?? '')
  const [dateStart, setDateStart] = useState('')
  const [dateEnd, setDateEnd] = useState('')
  const [discount, setDiscount] = useState('0')
  const [tax, setTax] = useState('0')
  const [remark, setRemark] = useState('')
  const [checking, setChecking] = useState(false)
  const [availability, setAvailability] = useState<AvailabilityState>({ type: 'idle' })

  const selectedCar = useMemo(() => cars.find((car) => car.id === carId), [cars, carId])
  const selectedProduct = useMemo(
    () => products.find((product) => product.id === productId),
    [products, productId]
  )

  const dayCount = useMemo(() => getDateCount(dateStart, dateEnd), [dateStart, dateEnd])
  const discountAmount = Math.max(Number(discount) || 0, 0)
  const taxAmount = Math.max(Number(tax) || 0, 0)
  const dailyRate = selectedProduct?.price ?? 0
  const grossAmount = dayCount * dailyRate
  const netAmount = Math.max(grossAmount - discountAmount + taxAmount, 0)

  function resetAvailability() {
    if (availability.type !== 'idle') setAvailability({ type: 'idle' })
  }

  async function checkAvailability() {
    if (!carId || !dateStart || !dateEnd) {
      setAvailability({ type: 'error', message: 'กรุณาเลือกรถและระบุวันที่ให้ครบ' })
      return
    }

    if (dayCount <= 0) {
      setAvailability({ type: 'error', message: 'วันที่สิ้นสุดต้องไม่น้อยกว่าวันที่เริ่มต้น' })
      return
    }

    setChecking(true)
    setAvailability({ type: 'idle' })

    try {
      const res = await fetch('/api/bookings/availability', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          car_id: carId,
          date_start: dateStart,
          date_end: dateEnd,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setAvailability({
          type: 'error',
          message: data?.error ?? 'ไม่สามารถตรวจสอบช่วงวันที่ได้',
        })
        return
      }

      setAvailability(
        data.available
          ? { type: 'available' }
          : { type: 'conflict', conflicts: data.conflicts ?? [] }
      )
    } catch {
      setAvailability({ type: 'error', message: 'ไม่สามารถเชื่อมต่อกับระบบตรวจสอบได้' })
    } finally {
      setChecking(false)
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
      <Card>
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-950">ข้อมูลการเช่า</h2>
              <p className="mt-2 text-sm font-semibold text-slate-500">
                เลือกรถ แพ็กเกจ และช่วงวันที่เพื่อเช็กคิวก่อนบันทึกรายการ
              </p>
            </div>

            {availability.type === 'available' && (
              <Badge variant="success" className="gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" aria-hidden="true" />
                พร้อมให้เช่า
              </Badge>
            )}
            {availability.type === 'conflict' && (
              <Badge variant="destructive" className="gap-1.5">
                <AlertTriangle className="h-3.5 w-3.5" aria-hidden="true" />
                ช่วงวันที่ซ้ำ
              </Badge>
            )}
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor="car_id">รถ</Label>
              <Select
                id="car_id"
                name="car_id"
                value={carId}
                onChange={(event) => {
                  setCarId(event.target.value)
                  resetAvailability()
                }}
              >
                <option value="">เลือกรถ</option>
                {cars.map((car) => (
                  <option key={car.id} value={car.id}>
                    {car.name} - {car.license}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="product_id">แพ็กเกจ</Label>
              <Select
                id="product_id"
                name="product_id"
                value={productId}
                onChange={(event) => setProductId(event.target.value)}
              >
                <option value="">เลือกแพ็กเกจ</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - {formatBaht(product.price)}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <Label htmlFor="date_start">วันที่เริ่ม</Label>
              <Input
                id="date_start"
                name="date_start"
                type="date"
                value={dateStart}
                onChange={(event) => {
                  setDateStart(event.target.value)
                  resetAvailability()
                }}
              />
            </div>

            <div>
              <Label htmlFor="date_end">วันที่สิ้นสุด</Label>
              <Input
                id="date_end"
                name="date_end"
                type="date"
                value={dateEnd}
                onChange={(event) => {
                  setDateEnd(event.target.value)
                  resetAvailability()
                }}
              />
            </div>

            <div>
              <Label htmlFor="discount_amount">ส่วนลด</Label>
              <Input
                id="discount_amount"
                name="discount_amount"
                type="number"
                min="0"
                step="1"
                value={discount}
                onChange={(event) => setDiscount(event.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="tax_amount">ภาษี</Label>
              <Input
                id="tax_amount"
                name="tax_amount"
                type="number"
                min="0"
                step="1"
                value={tax}
                onChange={(event) => setTax(event.target.value)}
              />
            </div>

            <div className="md:col-span-2">
              <Label htmlFor="remark">หมายเหตุ</Label>
              <Input
                id="remark"
                name="remark"
                value={remark}
                onChange={(event) => setRemark(event.target.value)}
                placeholder="รายละเอียดเพิ่มเติมของรายการเช่า"
              />
            </div>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <Button type="button" onClick={checkAvailability} disabled={checking}>
              <CalendarCheck className="h-4 w-4" aria-hidden="true" />
              {checking ? 'กำลังตรวจสอบ...' : 'ตรวจสอบช่วงวันที่'}
            </Button>
            {availability.type === 'error' && (
              <span className="text-sm font-semibold text-red-600">{availability.message}</span>
            )}
          </div>

          {availability.type === 'conflict' && (
            <div className="mt-7 rounded-2xl border border-red-100 bg-red-50 p-4">
              <h3 className="text-sm font-extrabold text-red-700">รายการที่ชนกับช่วงวันที่นี้</h3>
              <div className="mt-3 space-y-2">
                {availability.conflicts.map((conflict) => (
                  <div
                    key={conflict.id}
                    className="flex flex-col gap-1 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-700 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <span>
                      #{conflict.id.slice(0, 8)} {conflict.car?.license ?? ''}
                    </span>
                    <span>
                      {formatThaiDate(conflict.dateStart)} - {formatThaiDate(conflict.dateEnd)}
                    </span>
                    <Badge className={getStatusBadgeClass(conflict.status)}>
                      {getStatusLabel(conflict.status)}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <aside className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
              <Calculator className="h-7 w-7" aria-hidden="true" />
            </div>
            <h2 className="mt-5 text-2xl font-extrabold text-slate-950">สรุปยอด</h2>

            <dl className="mt-6 space-y-4 text-sm">
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <dt className="font-bold text-slate-500">จำนวนวัน</dt>
                <dd className="font-extrabold text-slate-950">{dayCount || '-'} วัน</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <dt className="font-bold text-slate-500">ราคา/วัน</dt>
                <dd className="font-extrabold text-slate-950">{formatBaht(dailyRate)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <dt className="font-bold text-slate-500">ยอดรวม</dt>
                <dd className="font-extrabold text-slate-950">{formatBaht(grossAmount)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <dt className="font-bold text-slate-500">ส่วนลด</dt>
                <dd className="font-extrabold text-slate-950">{formatBaht(discountAmount)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4">
                <dt className="font-bold text-slate-500">ภาษี</dt>
                <dd className="font-extrabold text-slate-950">{formatBaht(taxAmount)}</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="font-bold text-slate-500">สุทธิ</dt>
                <dd className="text-2xl font-extrabold text-blue-700">{formatBaht(netAmount)}</dd>
              </div>
            </dl>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h2 className="text-lg font-extrabold text-slate-950">รถที่เลือก</h2>
            {selectedCar ? (
              <div className="mt-4 space-y-3 text-sm font-semibold text-slate-600">
                <div className="text-xl font-extrabold text-slate-950">{selectedCar.name}</div>
                <div>ทะเบียน {selectedCar.license}</div>
                <div>
                  {selectedCar.vehicleType} / {selectedCar.year} / {selectedCar.color}
                </div>
                <Badge className={getStatusBadgeClass(selectedCar.status)}>
                  {getStatusLabel(selectedCar.status)}
                </Badge>
              </div>
            ) : (
              <p className="mt-3 text-sm font-semibold text-slate-500">ยังไม่ได้เลือกรถ</p>
            )}
          </CardContent>
        </Card>
      </aside>
    </div>
  )
}
