import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Roles
  const roles = ['ADMIN', 'MANAGER', 'AGENT', 'VIEWER']
  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name, description: `${name} role` }
    })
  }

  // Permissions (simple examples)
  const permissions = [
    { action: 'read', resource: 'cars' },
    { action: 'write', resource: 'cars' },
    { action: 'read', resource: 'bookings' },
    { action: 'write', resource: 'bookings' },
    { action: 'manage', resource: 'users' }
  ]

  for (const p of permissions) {
    await prisma.permission.upsert({
      where: { action_resource: { action: p.action, resource: p.resource } as any },
      update: {},
      create: { action: p.action, resource: p.resource }
    })
  }

  // Attach all permissions to ADMIN role
  const adminRole = await prisma.role.findUnique({ where: { name: 'ADMIN' } })
  if (adminRole) {
    for (const perm of permissions) {
      const permission = await prisma.permission.findUnique({ where: { action_resource: { action: perm.action, resource: perm.resource } as any }})
      if (permission) {
        await prisma.rolePermission.upsert({
          where: { roleId_permissionId: { roleId: adminRole.id, permissionId: permission.id } as any },
          update: {},
          create: { roleId: adminRole.id, permissionId: permission.id }
        })
      }
    }
  }

  // Create admin user
  const adminEmail = 'admin@example.com'
  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'Admin',
      // Replace this with a secure hashed password in production
      hashedPassword: 'changeme',
    }
  })

  // Grant admin role to user
  if (adminRole) {
    await prisma.userRole.upsert({
      where: { userId_roleId: { userId: admin.id, roleId: adminRole.id } as any },
      update: {},
      create: { userId: admin.id, roleId: adminRole.id }
    })
  }

  console.log('Seed finished')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
