'use client'

import { useState } from 'react'
import { Input, Label, Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui'
import { Button } from "@/components/ui/button"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Placeholder: integrate email reset flow with backend
    setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50 dark:bg-slate-900">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset your password</CardTitle>
          <CardDescription>Enter the email associated with your account and we will send reset instructions.</CardDescription>
        </CardHeader>
        <CardContent>
          {sent ? (
            <div className="p-4 bg-green-50 text-green-700 rounded">If an account exists for that email, reset instructions were sent.</div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Email</Label>
                <Input value={email} onChange={(e) => setEmail((e.target as HTMLInputElement).value)} placeholder="you@example.com" required />
              </div>

              <div>
                <Button type="submit" className="w-full">Send reset link</Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
