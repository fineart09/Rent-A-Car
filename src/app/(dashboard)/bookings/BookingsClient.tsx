'use client'

import { useEffect, useMemo, useState, type FormEvent } from 'react'
import { Edit, Plus, X, ClipboardList } from 'lucide-react'
import { UploadButton } from '@uploadthing/react'
import type { OurFileRouter } from '@/app/api/uploadthing/core'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'
import Select from '@/components/ui/select'
import Textarea from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { formatBaht, formatThaiDate, getStatusBadgeClass, getStatusLabel } from '@/lib/ui-format'
import { AlertDialogDestructive } from '@/components/AlertDialogDestructive'

type Row = any
type Option = { id: string; label: string; price?: number }

const statusOptions = ['Pending', 'Confirmed', 'InProgress', 'Completed', 'Cancelled', 'Rejected'] as const

function dateCount(start: string, end: string) {
  if (!start || !end) return 0
  const a = new Date(start)
  const b = new Date(end)
  if (Number.isNaN(a.getTime()) || Number.isNaN(b.getTime())) return 0
  return Math.max(Math.ceil((b.getTime() - a.getTime()) / 86_400_000) + 1, 0)
}

function toDatetimeLocal(value?: string | Date | null) {
  if (!value) return ''
  const d = new Date(value)
  const tzOffset = d.getTimezoneOffset() * 60000
  return new Date(d.getTime() - tzOffset).toISOString().slice(0, 16)
}

function uploadKey(url: string) {
  const parts = url.split('/')
  return parts[parts.length - 1] ?? url
}

export default function BookingsClient({
  initialBookings,
  products,
  cars,
  drivers,
  currentUserId,
}: {
  initialBookings: Row[]
  products: Option[]
  cars: Option[]
  drivers: Option[]
  currentUserId: string
}) {
  const [bookings, setBookings] = useState<Row[]>(initialBookings)
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const empty = {
    productId: '',
    carId: '',
    userId: currentUserId,
    driverId: '',
    dateStart: '',
    dateEnd: '',
    price: '0',
    discountAmount: '0',
    taxAmount: '0',
    bookingStatus: 'Pending',
    bookingRemark: '',
    paymentImageId: '',
    healthCheck01ImageId: '',
    healthCheck02ImageId: '',
  }
  const [form, setForm] = useState(empty)

  const selectedProduct = useMemo(() => products.find((p) => p.id === form.productId), [form.productId, products])
  const days = useMemo(() => dateCount(form.dateStart, form.dateEnd), [form.dateStart, form.dateEnd])
  const dailyRate = Number(form.price || selectedProduct?.price || 0)
  const gross = Number((dailyRate * days).toFixed(2))
  const discount = Number(form.discountAmount || 0)
  const tax = Number(form.taxAmount || 0)
  const total = Number(Math.max(gross - discount + tax, 0).toFixed(2))
  const totalCount = bookings.length
  const pendingCount = bookings.filter((booking) => booking.status === 'Pending').length
  const activeCount = bookings.filter((booking) => ['Confirmed', 'InProgress'].includes(booking.status)).length
  const completeCount = bookings.filter((booking) => booking.status === 'Completed').length

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        setDrawerOpen(true)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [])

  function openCreate() {
    setEditingId(null)
    setForm({ ...empty, userId: currentUserId, bookingStatus: 'Pending' })
    setError('')
    setDrawerOpen(true)
  }

  function openEdit(row: Row) {
    setEditingId(row.id)
    setForm({
      productId: row.productId ?? '',
      carId: row.carId ?? '',
      userId: row.userId ?? currentUserId,
      driverId: row.driverId ?? '',
      dateStart: toDatetimeLocal(row.dateStart),
      dateEnd: toDatetimeLocal(row.dateEnd),
      price: String(row.price ?? row.product?.price ?? '0'),
      discountAmount: String(row.discountAmount ?? 0),
      taxAmount: String(row.taxAmount ?? 0),
      bookingStatus: row.status ?? 'Pending',
      bookingRemark: row.remark ?? '',
      paymentImageId: row.paymentImageId ?? '',
      healthCheck01ImageId: row.healthCheck01ImageId ?? '',
      healthCheck02ImageId: row.healthCheck02ImageId ?? '',
    })
    setError('')
    setDrawerOpen(true)
  }

  async function persistImage(payload: { key: string; url: string; name: string; size?: number; type?: string }) {
    const res = await fetch('/api/booking-images', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data?.error ?? 'upload failed')
    return data.image as { id: string }
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setError('')
    try {
      if (!form.productId || !form.carId || !form.userId || !form.dateStart || !form.dateEnd) {
        setError('กรุณากรอกข้อมูลบังคับให้ครบ')
        return
      }
      const payload = {
        ...form,
        dateCount: days,
        dailyRate: gross,
        totalAmount: total,
      }
      const res = await fetch(editingId ? `/api/bookings/${editingId}` : '/api/bookings', {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.message ?? data?.error ?? 'บันทึกไม่สำเร็จ')
      const row = data.booking
      setBookings((current) => editingId ? current.map((item) => (item.id === row.id ? row : item)) : [row, ...current])
      setDrawerOpen(false)
    } catch (err: any) {
      setError(err?.message ?? 'บันทึกไม่สำเร็จ')
    } finally {
      setSaving(false)
    }
  }

  async function remove(id: string) {
    const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' })
    if (!res.ok) return
    setBookings((current) => current.filter((item) => item.id !== id))
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-3">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-950">รายการเช่ารถ / จองรถ</h1>
          <p className="max-w-3xl text-lg font-semibold text-slate-500">จัดการรายการจอง อัปโหลดเอกสาร และบันทึกยอดโดยใช้รูปแบบเดียวกับหน้าข้อมูลลูกค้า / ผู้ขับขี่</p>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card><CardContent className="p-6"><div className="text-sm font-semibold text-slate-500">รายการทั้งหมด</div><div className="mt-2 text-3xl font-extrabold text-slate-950">{totalCount}</div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="text-sm font-semibold text-slate-500">รอยืนยัน</div><div className="mt-2 text-3xl font-extrabold text-amber-600">{pendingCount}</div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="text-sm font-semibold text-slate-500">กำลังดำเนินการ</div><div className="mt-2 text-3xl font-extrabold text-blue-700">{activeCount}</div></CardContent></Card>
        <Card><CardContent className="p-6"><div className="text-sm font-semibold text-slate-500">เสร็จสิ้น</div><div className="mt-2 text-3xl font-extrabold text-emerald-600">{completeCount}</div></CardContent></Card>
      </section>

      <Card>
        <CardContent className="p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-950">รายการล่าสุด</h2>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="mt-6 w-full min-w-275 text-left">
              <thead>
                <tr>
                  <th className="border-b border-slate-200 px-3 py-3 text-sm font-extrabold text-slate-950">ลูกค้า / ผู้เช่า</th>
                  <th className="border-b border-slate-200 px-3 py-3 text-sm font-extrabold text-slate-950">รถที่จอง</th>
                  <th className="border-b border-slate-200 px-3 py-3 text-sm font-extrabold text-slate-950">วันรับรถ - วันคืนรถ</th>
                  <th className="border-b border-slate-200 px-3 py-3 text-sm font-extrabold text-slate-950 text-right">ยอดรวมสุทธิ</th>
                  <th className="border-b border-slate-200 px-3 py-3 text-sm font-extrabold text-slate-950">สถานะ</th>
                  <th className="border-b border-slate-200 px-3 py-3 text-sm font-extrabold text-slate-950">จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id} className="border-b border-slate-100 text-sm font-medium text-slate-700">
                    <td className="px-3 py-4 font-bold text-slate-950">{booking.driver?.fullName ?? ''}</td>
                    <td className="px-3 py-4">{`${booking.car?.brand?.name ?? ''} ${booking.car?.model ?? ''}`.trim()}</td>
                    <td className="px-3 py-4">{formatThaiDate(booking.dateStart)} - {formatThaiDate(booking.dateEnd)}</td>
                    <td className="px-3 py-4 text-right font-semibold">{formatBaht(booking.netAmount)}</td>
                    <td className="px-3 py-4"><Badge className={getStatusBadgeClass(booking.status)}>{getStatusLabel(booking.status)}</Badge></td>
                    <td className="px-3 py-4">
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => openEdit(booking)} className="gap-2"><Edit className="h-4 w-4" /></Button>
                        <AlertDialogDestructive onClick={() => remove(booking.id)} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {drawerOpen && (
        <>
          <button
            type="button"
            aria-label="Close drawer"
            className="fixed inset-0 z-30 bg-slate-950/30 backdrop-blur-[2px] my-0"
            onClick={() => !saving && setDrawerOpen(false)}
          />

          <aside className="fixed right-0 top-0 z-40 h-full w-full max-w-2xl overflow-auto bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b px-6 py-5">
              <div>
                <h2 className="text-2xl font-extrabold text-slate-950">{editingId ? 'แก้ไขรายการเช่ารถ' : 'เพิ่มรายการเช่าใหม่'}</h2>
                <p className="mt-2 text-sm font-medium text-slate-500">กรอกข้อมูลพื้นฐานและอัปโหลดเอกสาร</p>
              </div>
              <button className="rounded-full border p-2" onClick={() => setDrawerOpen(false)}><X className="h-4 w-4" /></button>
            </div>
    
            <form onSubmit={submit} className="space-y-6 px-6 py-5">
              <div>
                <Label>เรทราคา / โปรโมชั่น *</Label>
                <Select value={form.productId} onChange={(e) => setForm((c) => ({ ...c, productId: e.target.value, price: String(products.find((p) => p.id === e.target.value)?.price ?? c.price) }))} required>
                  <option value="">เลือกโปรโมชั่น</option>
                  {products.map((p) => <option key={p.id} value={p.id}>{p.label}</option>)}
                </Select>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label>รถที่จอง *</Label>
                  <Select value={form.carId} onChange={(e) => setForm((c) => ({ ...c, carId: e.target.value }))} required>
                    <option value="">เลือกคันรถ</option>
                    {cars.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </Select>
                </div>
                <div>
                  <Label>ผู้จอง / คนขับ *</Label>
                  <Select value={form.driverId} onChange={(e) => setForm((c) => ({ ...c, driverId: e.target.value }))} required>
                    <option value="">เลือกคนขับ</option>
                    {drivers.map((d) => <option key={d.id} value={d.id}>{d.label}</option>)}
                  </Select>
                </div>
                <div>
                  <Label>วันที่-เวลา รับรถ *</Label>
                  <Input type="date" value={form.dateStart} onChange={(e) => setForm((c) => ({ ...c, dateStart: e.target.value }))} required />
                </div>
                <div>
                  <Label>วันที่-เวลา ส่งคืน *</Label>
                  <Input type="date" value={form.dateEnd} onChange={(e) => setForm((c) => ({ ...c, dateEnd: e.target.value }))} required />
                </div>
                <div>
                  <Label>จำนวนวัน</Label>
                  <Input value={days} readOnly />
                </div>
                <div>
                  <Label>ราคาต่อวัน *</Label>
                  <Input type="number" min="0" step="0.01" value={form.price} onChange={(e) => setForm((c) => ({ ...c, price: e.target.value }))} required />
                </div>
                <div>
                  <Label>ยอดรวมก่อนหักส่วนลด *</Label>
                  <Input value={gross} readOnly />
                </div>
                <div>
                  <Label>ส่วนลด</Label>
                  <Input type="number" min="0" step="0.01" value={form.discountAmount} onChange={(e) => setForm((c) => ({ ...c, discountAmount: e.target.value }))} />
                </div>
                <div>
                  <Label>VAT / ภาษี</Label>
                  <Input type="number" min="0" step="0.01" value={form.taxAmount} onChange={(e) => setForm((c) => ({ ...c, taxAmount: e.target.value }))} />
                </div>
                <div>
                  <Label>ยอดรวมทั้งหมด *</Label>
                  <Input value={total} readOnly />
                </div>
                <div>
                  <Label>สถานะการจอง *</Label>
                  <Select value={form.bookingStatus} onChange={(e) => setForm((c) => ({ ...c, bookingStatus: e.target.value }))} required>
                    {statusOptions.map((s) => <option key={s} value={s}>{s}</option>)}
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label>หมายเหตุ</Label>
                  <Textarea maxLength={500} value={form.bookingRemark} onChange={(e) => setForm((c) => ({ ...c, bookingRemark: e.target.value }))} />
                </div>
    
                {[
                  ['หลักฐานการรับเงิน', 'paymentImageId'],
                  ['ตรวจรับรถคืน ด้านหน้า', 'healthCheck01ImageId'],
                  ['ตรวจรับรถคืน ด้านหลัง', 'healthCheck02ImageId'],
                ].map(([label, key]) => (
                  <div key={String(key)} className="rounded-2xl border p-4 md:col-span-2">
                    <div className="mb-3 flex items-center justify-between">
                      <div className="font-bold text-slate-950">{label}</div>
                      <Badge variant={form[key as keyof typeof form] ? 'success' : 'destructive'}>{form[key as keyof typeof form] ? 'อัปโหลดแล้ว' : 'ยังไม่มี'}</Badge>
                    </div>
                    <UploadButton<OurFileRouter, 'bookingImage'>
                      endpoint="bookingImage"
                      onClientUploadComplete={async (res) => {
                        if (!res?.[0]) return
                        const uploaded = res[0]
                        const image = await persistImage({ key: uploadKey(uploaded.url), url: uploaded.url, name: uploaded.name, size: uploaded.size, type: uploaded.type })
                        setForm((c) => ({ ...c, [key]: image.id }))
                      }}
                      onUploadError={(err) => setError(err.message || 'อัปโหลดไม่สำเร็จ')}
                    />
                  </div>
                ))}
    
                {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}
    
              </div>
    
              <div className="flex items-center justify-end gap-3 w-full border-t border-slate-200 pt-5">
                <Button type="submit" disabled={saving} className="gap-2 w-full" variant="save">
                  {saving ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
                </Button>
              </div>
            </form>
          </aside>
        </>
      )}

      {!drawerOpen && menuOpen && (
        <button
          type="button"
          aria-label="ปิดเมนูเพิ่มรายการเช่ารถ"
          className="fixed inset-0 z-40 cursor-default bg-transparent"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {!drawerOpen && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
          {menuOpen && (
            <button 
              type="button" 
              onClick={() => {
                setMenuOpen(false)
                openCreate()
              }}
              className={cn(
                'group relative z-50 flex items-center gap-4 rounded-2xl border bg-white px-4 py-3 text-left shadow-lg shadow-slate-950/10 transition-all duration-200',
                'min-w-47.5 max-w-60',
                'border-slate-200 hover:-translate-y-0.5 hover:border-violet-200 hover:bg-violet-50/50'
              )}
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-50 text-slate-600 shadow-sm transition group-hover:bg-white group-hover:text-violet-700">
                <ClipboardList className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-bold text-slate-900">เพิ่มรายการเช่ารถใหม่</div>
              </div>
            </button>
          )}
          
          <Button
            type="button"
            size="lg"
            onClick={() => setMenuOpen((value) => !value)}
            className={cn('relative z-50 h-14 w-14 rounded-xl border-2 border-violet-200 bg-violet-600 shadow-2xl shadow-violet-900/25', 'hover:bg-violet-700')}
          >
            {menuOpen ? <X className="h-7 w-7" /> : <Plus className="h-7 w-7" />}
          </Button>
        </div>
      )}
    </div>
  )
}
