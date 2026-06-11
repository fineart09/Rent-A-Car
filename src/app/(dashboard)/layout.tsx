import { auth } from "@/lib/auth";
import RBACSidebar from "@/components/RBACSidebar";
import ResponsiveShell from "@/components/ResponsiveShell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <ResponsiveShell sidebar={<RBACSidebar user={session?.user ?? null} />}>
      {children}
    </ResponsiveShell>
  );
}
