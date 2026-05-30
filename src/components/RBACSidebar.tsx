"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { menuItems } from "@/lib/rbac/menus";

type SidebarUser = {
  name?: string | null;
  email?: string | null;
  role?: string | null;
  roles?: string[] | string | null;
  user_roles?: string[] | string | null;
};

function normalizeRoles(user?: SidebarUser | null) {
  const raw = user?.roles ?? user?.role ?? user?.user_roles ?? [];
  const roles = Array.isArray(raw) ? raw : typeof raw === "string" ? [raw] : [];
  return roles.map((role) => role.toLowerCase());
}

export default function RBACSidebar({ user }: { user?: SidebarUser | null }) {
  const pathname = usePathname();
  const roles = normalizeRoles(user);
  const displayName = user?.name ?? user?.email ?? "Guest";

  const visibleItems = menuItems.filter(
    (item) => !item.roles?.length || item.roles.some((role) => roles.includes(role.toLowerCase()))
  );

  return (
    <aside className="flex h-full w-64 flex-col border-r bg-white dark:border-slate-800 dark:bg-slate-950">
      <div className="border-b p-4 dark:border-slate-800">
        <div className="font-semibold">Rent Car App</div>
        <div className="mt-1 truncate text-sm text-slate-500">{displayName}</div>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {visibleItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "block rounded-md px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-200"
                  : "text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-900"
              )}
            >
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
