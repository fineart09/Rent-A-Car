'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Input from '@/components/ui/input'
import Label from '@/components/ui/label'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    // ใส่ redirect: false เพื่อดักจับ Error กรณีรหัสผ่านผิด
    const res = await signIn('credentials', { 
      email, 
      password, 
      redirect: false,
      callbackUrl: '/' 
    })

    setLoading(false)

    if (res?.error) {
      setError('อีเมลหรือรหัสผ่านไม่ถูกต้อง')
    } else if (res?.url) {
      window.location.href = res.url
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
      <Card className="w-full max-w-md shadow-md border border-slate-100 dark:border-slate-800">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-slate-900 dark:text-white">
            Sign in
          </CardTitle>
          <CardDescription className="text-center text-slate-500">
            ระบบบริหารจัดการรถเช่า (Rent Car Management)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md border border-red-200 text-center dark:bg-red-950/50 dark:text-red-400 dark:border-red-900">
                {error}
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Username or email</Label>
              <Input 
                id="email" 
                type="text" 
                placeholder="Username or email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>

            <Button 
              type="submit" 
              disabled={loading} 
              className="w-full bg-sky-600 hover:bg-sky-700 text-white transition-colors"
            >
              {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
