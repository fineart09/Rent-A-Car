import prisma from '@/lib/prisma'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export const dynamic = 'force-dynamic'

export default async function UsersPage() {
  const [users, totalUsers, activeRoles] = await Promise.all([
    prisma.user.findMany({
      where: { isDeleted: false },
      orderBy: { createdAt: 'desc' },
      take: 40,
      include: {
        roles: {
          where: { isDeleted: false },
          include: { role: true },
        },
      },
    }),
    prisma.user.count({ where: { isDeleted: false } }),
    prisma.role.count({ where: { isDeleted: false, isActive: true } }),
  ])

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-extrabold tracking-normal text-slate-950">ผู้ใช้และสิทธิ์</h1>
        <p className="mt-3 text-lg font-bold text-slate-500">ตรวจสอบบัญชีผู้ใช้และบทบาทในระบบ</p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-bold text-slate-500">ผู้ใช้ทั้งหมด</div>
            <div className="mt-2 text-4xl font-extrabold text-slate-950">{totalUsers}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-sm font-bold text-slate-500">บทบาทที่เปิดใช้งาน</div>
            <div className="mt-2 text-4xl font-extrabold text-blue-700">{activeRoles}</div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardContent className="p-6 sm:p-8">
          <h2 className="text-2xl font-extrabold text-slate-950">ผู้ใช้ล่าสุด</h2>
          <div className="mt-7 overflow-x-auto">
            <table className="w-full min-w-[820px] text-left">
              <thead>
                <tr className="border-b border-slate-200 text-sm font-extrabold text-slate-950">
                  <th className="px-3 py-3">ชื่อ</th>
                  <th className="px-3 py-3">Username</th>
                  <th className="px-3 py-3">อีเมล</th>
                  <th className="px-3 py-3">โทรศัพท์</th>
                  <th className="px-3 py-3">บทบาท</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => {
                  const displayName = `${user.firstName} ${user.lastName}`.trim() || user.userName

                  return (
                    <tr
                      key={user.id}
                      className="border-b border-slate-200 text-base font-semibold text-slate-900 last:border-0"
                    >
                      <td className="px-3 py-4">{displayName}</td>
                      <td className="px-3 py-4">{user.userName}</td>
                      <td className="px-3 py-4">{user.email}</td>
                      <td className="px-3 py-4">{user.phone}</td>
                      <td className="px-3 py-4">
                        <div className="flex flex-wrap gap-2">
                          {user.roles.length > 0 ? (
                            user.roles.map((userRole) => (
                              <Badge key={userRole.id}>{userRole.role.code}</Badge>
                            ))
                          ) : (
                            <span className="text-sm font-semibold text-slate-400">ยังไม่มีบทบาท</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {users.length === 0 && (
            <div className="py-12 text-center text-sm font-semibold text-slate-500">
              ยังไม่มีผู้ใช้ในระบบ
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
