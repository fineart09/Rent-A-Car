import React from 'react';
import Link from 'next/link';

type User = { role?: string | null; name?: string | null } | null;

const MENU = [
  { title: 'Dashboard', href: '/dashboard', roles: ['admin', 'manager', 'user'] },
  { title: 'Bookings', href: '/bookings', roles: ['admin', 'manager', 'user'] },
  { title: 'Cars', href: '/cars', roles: ['admin', 'manager'] },
  { title: 'Users', href: '/users', roles: ['admin'] },
  { title: 'Settings', href: '/settings', roles: ['admin', 'manager'] },
];

export default function RBACSidebar({ user }: { user?: User }) {
  const role = user?.role ?? 'guest';

  const visibleItems = MENU.filter((item) => item.roles.includes(role));

  return (
    <>
      {/* Desktop / tablet persistent sidebar */}
      <aside className="hidden md:block w-64 border-r bg-white dark:bg-slate-900">
        <div className="p-4 h-full flex flex-col">
          <div className="mb-6 text-lg font-semibold">RentCar</div>

          <nav className="flex-1 space-y-1">
            {visibleItems.map((item) => (
              <Link key={item.href} href={item.href} className="block px-3 py-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800">
                {item.title}
              </Link>
            ))}
          </nav>

          <div className="mt-4 text-sm text-slate-500">Role: {role}</div>
        </div>
      </aside>

      {/* Mobile: simple top nav with drawer trigger (keeps markup minimal so existing app-level drawer can be integrated) */}
      <div className="md:hidden">
        <header className="w-full border-b bg-white dark:bg-slate-900 p-3 flex items-center justify-between">
          <div className="font-semibold">RentCar</div>
          {/* The hamburger/drawer toggle should integrate with existing mobile drawer logic if present. */}
          <button aria-label="Open menu" className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800">☰</button>
        </header>
      </div>
    </>
  );
}
