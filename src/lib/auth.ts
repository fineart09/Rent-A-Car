// src/auth.ts (หรือสร้างไว้ที่ src/lib/auth.ts แล้วแต่โครงสร้างโปรเจกต์ของคุณ)
import { scryptSync, timingSafeEqual } from 'node:crypto';
import NextAuth, { type NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import prisma from './prisma'

function verifyPassword(password: string, storedHash: string | null) {
  if (!storedHash) return false;

  const [algorithm, salt, hash] = storedHash.split(':');
  if (algorithm !== 'scrypt' || !salt || !hash) return false;

  const hashBuffer = Buffer.from(hash, 'hex');
  const candidateBuffer = scryptSync(password, salt, hashBuffer.length);
  return (
    hashBuffer.length === candidateBuffer.length && timingSafeEqual(hashBuffer, candidateBuffer)
  );
}

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        csrfToken: { label: 'CsrfToken', type: 'text' },
        remember: { label: 'Remember', type: 'boolean' },
      },
      async authorize(credentials) {
        const username = typeof credentials?.username === 'string' ? credentials.username : '';
        const email = typeof credentials?.email === 'string' ? credentials.email : '';
        const password = typeof credentials?.password === 'string' ? credentials.password : '';
        if ((!username && !email) || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email },
          include: { roles: { include: { role: true } } },
        });

        if (!user || !verifyPassword(password, user.hashedPassword)) return null;

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          roles: user.roles.map((userRole) => userRole.role.code),
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        const authUser = user as typeof user & { roles?: string[] };
        token.id = authUser.id;
        token.roles = Array.isArray(authUser.roles) ? authUser.roles : [];
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const sessionUser = session.user as typeof session.user & { id?: string; roles?: string[] };
        sessionUser.id = token.id as string;
        sessionUser.roles = Array.isArray(token.roles) ? token.roles : [];
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
};

// Export ตัว handlers และ auth ไปใช้ที่อื่น
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
