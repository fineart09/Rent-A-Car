'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import  Input  from '@/components/ui/input'
import  Label  from '@/components/ui/label'
import  Select  from '@/components/ui/select'
import  Textarea  from '@/components/ui/textarea'
import { createCar } from 'src/app/(dashboard)/cars/actions'

interface CreateCarFormProps {
  vehicleTypes: Array<{ id: string; name: string }>
  brands: Array<{ id: string; name: string }>
  onSuccess: () => void
}

const createCarSchema = z.object({
  vehicleTypeId: z.string().min(1, 'ประเภทรถเป็นข้อมูลบังคับ'),
  brandId: z.string().min(1, 'แบรนด์รถเป็นข้อมูลบังคับ'),
  model: z.string().min(1, 'รุ่นรถเป็นข้อมูลบังคับ').trim(),
  year: z
    .string()
    .min(4, 'ปีต้องเป็นตัวเลข 4 หลัก')
    .max(4, 'ปีต้องเป็นตัวเลข 4 หลัก')
    .regex(/^\d{4}$/, 'ปีต้องเป็นตัวเลข 4 หลัก'),
  color: z.string().optional().default(''),
  license: z.string().min(1, 'ทะเบียนรถเป็นข้อมูลบังคับ').trim(),
  mileage: z
    .string()
    .refine((val) => {
      const num = parseFloat(val)
      return !isNaN(num) && num >= 0
    }, 'เลขไมล์ต้องเป็นตัวเลขและไม่เป็นลบ')
    .default('0'),
  status: z.enum(['Available', 'Booked', 'Maintenance', 'Unavailable', 'Reserved']).default('Available'),
  remark: z.string().optional().default(''),
})

type CreateCarFormData = z.infer<typeof createCarSchema>

const carStatuses = [
  { value: 'Available', label: 'พร้อมให้เช่า' },
  { value: 'Booked', label: 'จองแล้ว' },
  { value: 'Maintenance', label: 'บำรุงรักษา' },
  { value: 'Unavailable', label: 'ไม่พร้อมใช้' },
  { value: 'Reserved', label: 'จองสำรอง' },
]

export default function CreateCarForm({
  vehicleTypes,
  brands,
  onSuccess,
}: CreateCarFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<CreateCarFormData>({
    vehicleTypeId: '',
    brandId: '',
    model: '',
    year: new Date().getFullYear().toString(),
    color: '',
    license: '',
    mileage: '0',
    status: 'Available',
    remark: '',
  })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setErrors({})
    setIsLoading(true)

    try {
      const validated = createCarSchema.parse(formData)

      const result = await createCar({
        vehicleTypeId: validated.vehicleTypeId,
        brandId: validated.brandId,
        model: validated.model,
        year: validated.year,
        color: validated.color,
        license: validated.license,
        mileage: parseFloat(validated.mileage),
        status: validated.status,
        remark: validated.remark || null,
      })

      if (result.success) {
        onSuccess()
      } else {
        setErrors({ form: result.error || 'เกิดข้อผิดพลาดในการสร้างรถ' })
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error?.issues.forEach((err) => {
          const path = err.path[0]?.toString() || 'form'
          newErrors[path] = err.message
        })
        setErrors(newErrors)
      } else {
        setErrors({ form: 'เกิดข้อผิดพลาด กรุณาลองใหม่' })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {errors.form && (
        <div className="rounded-lg bg-red-50 p-4 text-sm font-medium text-red-700">
          {errors.form}
        </div>
      )}

      {/* ข้อมูลพื้นฐาน */}
      <section className="space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">
          ข้อมูลพื้นฐาน
        </h3>

        <div>
          <Label htmlFor="vehicleTypeId" className="font-bold text-slate-900">
            ประเภทรถ <span className="text-red-600">*</span>
          </Label>
          <p className="mt-1 text-xs font-medium text-slate-500">เลือกประเภทของรถ</p>
          <Select
            id="vehicleTypeId"
            name="vehicleTypeId"
            value={formData.vehicleTypeId}
            onChange={handleChange}
            className="mt-2"
          >
            <option value="">-- เลือกประเภทรถ --</option>
            {vehicleTypes.length > 0 ? (
              vehicleTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))
            ) : (
              <option disabled>ไม่มีข้อมูลประเภทรถ</option>
            )}
          </Select>
          {errors.vehicleTypeId && (
            <p className="mt-1 text-xs font-medium text-red-600">
              {errors.vehicleTypeId}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="brandId" className="font-bold text-slate-900">
            แบรนด์รถ <span className="text-red-600">*</span>
          </Label>
          <Select
            id="brandId"
            name="brandId"
            value={formData.brandId}
            onChange={handleChange}
            className="mt-2"
          >
            <option value="">-- เลือกแบรนด์ --</option>
            {brands.length > 0 ? (
              brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))
            ) : (
              <option disabled>ไม่มีข้อมูลแบรนด์</option>
            )}
          </Select>
          {errors.brandId && (
            <p className="mt-1 text-xs font-medium text-red-600">
              {errors.brandId}
            </p>
          )}
        </div>
      </section>

      {/* ข้อมูลรถ */}
      <section className="space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">
          ข้อมูลรถ
        </h3>

        <div>
          <Label htmlFor="model" className="font-bold text-slate-900">
            รุ่นรถ <span className="text-red-600">*</span>
          </Label>
          <Input
            id="model"
            name="model"
            type="text"
            placeholder="เช่น Civic, Accord, CR-V"
            value={formData.model}
            onChange={handleChange}
            className="mt-2"
          />
          {errors.model && (
            <p className="mt-1 text-xs font-medium text-red-600">{errors.model}</p>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="year" className="font-bold text-slate-900">
              ปีที่ผลิต <span className="text-red-600">*</span>
            </Label>
            <Input
              id="year"
              name="year"
              type="text"
              placeholder="2024"
              inputMode="numeric"
              maxLength={4}
              value={formData.year}
              onChange={handleChange}
              className="mt-2"
            />
            {errors.year && (
              <p className="mt-1 text-xs font-medium text-red-600">{errors.year}</p>
            )}
          </div>

          <div>
            <Label htmlFor="color" className="font-bold text-slate-900">
              สีรถ
            </Label>
            <Input
              id="color"
              name="color"
              type="text"
              placeholder="เช่น สีดำ, สีขาว"
              value={formData.color}
              onChange={handleChange}
              className="mt-2"
            />
            {errors.color && (
              <p className="mt-1 text-xs font-medium text-red-600">{errors.color}</p>
            )}
          </div>
        </div>

        <div>
          <Label htmlFor="license" className="font-bold text-slate-900">
            ทะเบียนรถ <span className="text-red-600">*</span>
          </Label>
          <p className="mt-1 text-xs font-medium text-slate-500">
            ต้องไม่ซ้ำกับรถคันอื่น
          </p>
          <Input
            id="license"
            name="license"
            type="text"
            placeholder="เช่น กก-1234"
            value={formData.license}
            onChange={handleChange}
            className="mt-2"
          />
          {errors.license && (
            <p className="mt-1 text-xs font-medium text-red-600">{errors.license}</p>
          )}
        </div>

        <div>
          <Label htmlFor="mileage" className="font-bold text-slate-900">
            เลขไมล์
          </Label>
          <Input
            id="mileage"
            name="mileage"
            type="number"
            inputMode="decimal"
            placeholder="0"
            min="0"
            step="0.1"
            value={formData.mileage}
            onChange={handleChange}
            className="mt-2"
          />
          {errors.mileage && (
            <p className="mt-1 text-xs font-medium text-red-600">{errors.mileage}</p>
          )}
        </div>

        <div>
          <Label htmlFor="status" className="font-bold text-slate-900">
            สถานะรถ
          </Label>
          <Select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-2"
          >
            {carStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </Select>
          {errors.status && (
            <p className="mt-1 text-xs font-medium text-red-600">{errors.status}</p>
          )}
        </div>
      </section>

      {/* หมายเหตุ */}
      <section className="space-y-4">
        <h3 className="text-sm font-extrabold uppercase tracking-wide text-slate-500">
          หมายเหตุ
        </h3>

        <div>
          <Label htmlFor="remark" className="font-bold text-slate-900">
            หมายเหตุเพิ่มเติม
          </Label>
          <Textarea
            id="remark"
            name="remark"
            placeholder="เพิ่มหมายเหตุเกี่ยวกับรถคันนี้..."
            value={formData.remark}
            onChange={handleChange}
            className="mt-2 resize-none"
            rows={3}
          />
          {errors.remark && (
            <p className="mt-1 text-xs font-medium text-red-600">{errors.remark}</p>
          )}
        </div>

        <div className="rounded-lg bg-blue-50 p-3 text-xs font-medium text-blue-700">
          <p><strong>หมายเหตุ:</strong> เลขเครื่องยนต์และเลขตัวถังสามารถเพิ่มเข้าในระบบได้ในรอบถัดไป</p>
        </div>
      </section>

      {/* ปุ่มแอ็กชัน */}
      <div className="sticky bottom-0 border-t border-slate-200 bg-white pt-4">
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={isLoading}
            className="flex-1"
          >
            {isLoading && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
            )}
            {isLoading ? 'กำลังบันทึก...' : 'บันทึกข้อมูล'}
          </Button>
        </div>
      </div>
    </form>
  )
}